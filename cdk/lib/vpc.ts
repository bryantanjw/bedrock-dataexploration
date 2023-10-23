import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

/**
 * Construct to deploy shared networking infrastructure for the Bedrock data analytics sample
 */
export class VpcInfra extends Construct {
  public dbSecurityGroup: ec2.ISecurityGroup;
  public vpc: ec2.IVpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, "Vpc", {
      // 3 AZs not working and a pain to fix, per https://github.com/aws/aws-cdk/issues/3237
      // maxAzs: 3,
      natGateways: 1,
    });

    this.dbSecurityGroup = new ec2.SecurityGroup(this, "DBSecurityGroup", {
      allowAllOutbound: true,
      description: "Shared security group for demo databases in the solution",
      vpc: this.vpc,
    });

    // TODO: This was from the Neptune workshop stack, is it really necessary?
    this.dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "ssh from anywhere");
  }
}
