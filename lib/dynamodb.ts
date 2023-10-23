import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();
const tableName = process.env.DYNAMODB_TABLE_NAME;

export async function storeDatabaseEntry(databaseInformation: any) {
  const params = {
    TableName: tableName,
    Item: marshall(databaseInformation),
  };

  await client.send(new PutItemCommand(params));
}

export async function getDatabaseItems() {
  const params = {
    TableName: tableName,
  };

  const response = await client.send(new ScanCommand(params));
  return response.Items?.map((item) => unmarshall(item));
}

export async function getDatabaseItem(key: string) {
  const params = {
    TableName: tableName,
    Key: marshall({ databaseName: key }),
  };

  const response = await client.send(new GetItemCommand(params));

  if (!response.Item) {
    throw new Error("Failed to get database item");
  }

  return unmarshall(response.Item);
}
