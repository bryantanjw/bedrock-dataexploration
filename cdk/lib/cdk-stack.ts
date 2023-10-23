// NodeJS Built-Ins:
import { execSync } from "child_process";
import * as path from "path";
// External Dependencies:
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as cdk from "aws-cdk-lib";
import * as cr from "aws-cdk-lib/custom-resources";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as assets from "aws-cdk-lib/aws-ecr-assets";
import * as iam from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
// Local Dependencies:
import { AthenaInfra } from "./athena";
import { NeptuneInfra } from "./neptune";
import { RdsInfra } from "./rds";
import { VpcInfra } from "./vpc";

/**
 * Main CloudFormation stack for the Bedrock data analytics sample
 */
export class CdkStack extends cdk.Stack {
  private dataSourceTable: ddb.ITable;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcInfra = new VpcInfra(this, "VpcInfra");

    // Data source metastore and loading infrastructure:
    const ddbPartitionKey = "databaseName";
    this.dataSourceTable = new ddb.Table(this, "DataSourceTable", {
      partitionKey: { name: ddbPartitionKey, type: ddb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const loaderRole = new iam.Role(this, "DataLoaderRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"),
      ],
    });
    this.dataSourceTable.grantWriteData(loaderRole);
    const loaderFunction = new NodejsFunction(this, "DataLoaderFn", {
      bundling: {},
      description: "CFn custom resource handler to load initial sample data",
      entry: `${__dirname}/lambda-load-data/index.ts`,
      handler: "onEvent",
      memorySize: 128,
      role: loaderRole,
      runtime: Runtime.NODEJS_18_X,
      securityGroups: [vpcInfra.dbSecurityGroup],
      timeout: cdk.Duration.minutes(10),
      vpc: vpcInfra.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
    const loaderProvider = new cr.Provider(this, "DataLoaderProvider", {
      onEventHandler: loaderFunction,
    });

    // Create the data sources:
    const athenaInfra = new AthenaInfra(this, "AthenaInfra", {
      dbName: "bedrockathena",
      catalogName: "BedrockAthenaSample",
      loaderProvider,
      loaderRole,
      workgroupName: "BedrockAthenaWorkgroup",
    });
    const neptuneInfra = new NeptuneInfra(this, "NeptuneInfra", {
      dbSecurityGroup: vpcInfra.dbSecurityGroup,
      vpc: vpcInfra.vpc,
    });
    const rdsInfra = new RdsInfra(this, "RdsInfra", {
      dbSecurityGroup: vpcInfra.dbSecurityGroup,
      loaderProvider,
      loaderRole,
      vpc: vpcInfra.vpc,
    });

    // Load data source descriptors to DynamoDB:
    const athenaDesc = new cdk.CustomResource(this, "AthenaDescriptor", {
      serviceToken: loaderProvider.serviceToken,
      properties: {
        item: athenaInfra.dataSourceDescriptor,
        partitionKeyField: ddbPartitionKey,
        tableName: this.dataSourceTable.tableName,
      },
      resourceType: "Custom::DDBItem",
    });
    const neptuneDesc = new cdk.CustomResource(this, "NeptuneDescriptor", {
      serviceToken: loaderProvider.serviceToken,
      properties: {
        item: neptuneInfra.dataSourceDescriptor,
        partitionKeyField: ddbPartitionKey,
        tableName: this.dataSourceTable.tableName,
      },
      resourceType: "Custom::DDBItem",
    });
    const rdsDesc = new cdk.CustomResource(this, "RDSDescriptor", {
      serviceToken: loaderProvider.serviceToken,
      properties: {
        item: rdsInfra.dataSourceDescriptor,
        partitionKeyField: ddbPartitionKey,
        tableName: this.dataSourceTable.tableName,
      },
      resourceType: "Custom::DDBItem",
    });

    // TODO: Build & deploy the AppRunner app

    const appDir = path.join(__dirname, "..", "..", "data-exploration");
    console.log("Building Java application...");
    console.log(
      execSync(
        "mvn install:install-file  -Dfile=src/main/resources/AthenaJDBC42-2.0.36.1000.jar  -DgroupId=Athena  -DartifactId=AthenaJDBC42  -Dversion=2.0.36.1000  -Dpackaging=jar  -DgeneratePom=true " +
          "&& mvn install:install-file  -Dfile=src/main/resources/AwsJavaSdk-Bedrock-2.0.jar  -DgroupId=software.amazon.awssdk  -DartifactId=bedrock  -Dversion=2.0.23.0-SNAPSHOT  -Dpackaging=jar  -DgeneratePom=true " +
          "&& mvn clean package",
        { encoding: "utf-8", cwd: appDir }
      )
    );

    const appRole = new iam.Role(this, "AppRole", {
      assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
      inlinePolicies: {
        InlinePolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["bedrock:*"],
              resources: ["*"],
              sid: "DirectBedrockAccess"
            }),
            new iam.PolicyStatement({
              actions: ["logs:*", "metrics:*"],
              resources: ["*"],
              sid: "LoggingAndMetrics",
            }),
          ],
        }),
      },
    });
    athenaInfra.grantQuery(appRole);
    rdsInfra.grantFetchCredential(appRole);
    this.dataSourceTable.grantReadData(appRole);
    const appImage = new assets.DockerImageAsset(this, "ImageAssets", {
      directory: appDir,
      platform: assets.Platform.LINUX_AMD64,
    });
    const appVpcConnector = new apprunner.VpcConnector(this, "AppVpcConnector", {
      securityGroups: [vpcInfra.dbSecurityGroup],
      vpc: vpcInfra.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
    const appService = new apprunner.Service(this, "AppService", {
      autoDeploymentsEnabled: true,
      source: apprunner.Source.fromAsset({
        imageConfiguration: { port: 8080 },
        asset: appImage,
      }),
      instanceRole: appRole,
      vpcConnector: appVpcConnector,
    });

    appService.addEnvironmentVariable(
      "BEDROCK_DATA_EXPLORATION_DYNAMO_TABLE_NAME",
      this.dataSourceTable.tableName
    );

    new cdk.CfnOutput(this, "AppURL", { value: appService.serviceUrl });
  }
}
