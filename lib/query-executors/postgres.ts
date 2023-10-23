import { Client } from "pg";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

async function getSecretValue(databaseInformation) {
  const secretsManager = new SecretsManagerClient();
  const command = new GetSecretValueCommand({
    SecretId: databaseInformation.databaseCredentialsSsm,
  });
  const secretValueResponse = await secretsManager.send(command);
  return JSON.parse(secretValueResponse.SecretString);
}

export async function executePostgreSqlQuery(databaseInformation, queryString) {
  const query = queryString.replace(/\\n/g, "\n");
  const secretValue = await getSecretValue(databaseInformation);

  const url = new URL(databaseInformation.connectionUrl.replace("jdbc:", ""));
  const host = url.hostname;
  const database = url.pathname.slice(1);
  const port = url.port;

  const client = new Client({
    host,
    database,
    user: secretValue.username,
    password: secretValue.password,
    port: parseInt(port, 10),
  });

  await client.connect();

  const res = await client.query(query);

  await client.end();

  const columnNames = res.fields.map((field) => field.name);
  const values = res.rows.map((row) => Object.values(row));

  return { query, columnNames, values };
}
