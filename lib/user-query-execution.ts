import { getDatabaseItem } from "./dynamodb";
import { callBedrock } from "./bedrock";
import { executeAthenaQuery } from "./query-executors/athena";
import { executePostgreSqlQuery } from "./query-executors/postgres";
import { executeNeptuneQuery } from "./query-executors/neptune";
import {
  generateAthenaPrompt,
  generateNeptunePrompt,
  generatePostgreSqlPrompt,
} from "./generate-prompt";

interface ExecuteQueryBody {
  database: string;
  userQuestion: string;
  maxlength: number;
  model: string;
  temperature: number;
  top_k: number;
  top_p: number;
}

export async function executeQuery(body: ExecuteQueryBody) {
  const { database, userQuestion, ...bedrockInput } = body;
  const databaseItem = await getDatabaseItem(database);
  let prompt = "";
  switch (databaseItem.dbType) {
    case "POSTGRESQL":
      prompt = generatePostgreSqlPrompt(databaseItem, userQuestion);
      break;
    case "NEPTUNE":
      prompt = generateNeptunePrompt(databaseItem, userQuestion);
      break;
    case "ATHENA":
      prompt = generateAthenaPrompt(databaseItem, userQuestion);
      break;
  }
  const bedrockResult = await callBedrock({ ...bedrockInput, prompt });
  let queryResult = null;
  switch (databaseItem.dbType) {
    case "ATHENA":
      queryResult = await executeAthenaQuery(databaseItem, bedrockResult.query);
      break;
    case "POSTGRESQL":
      queryResult = await executePostgreSqlQuery(
        databaseItem,
        bedrockResult.query
      );
      break;
    case "NEPTUNE":
      queryResult = await executeNeptuneQuery(
        databaseItem,
        bedrockResult.query
      );
      break;
  }
  return queryResult;
}
