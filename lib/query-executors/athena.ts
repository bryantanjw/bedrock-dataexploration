/**
 * This file contains the code for executing SQL queries on an Amazon Athena database.
 * It uses the AWS SDK for JavaScript to interact with Athena.
 *
 * The main function exported by this module is `executeAthenaQuery`, which takes a database connection
 * and a query string, executes the query on the database, and returns the results.
 *
 * The results are returned as an object with two properties: `columnNames` and `values`.
 * `columnNames` is an array of strings representing the names of the columns in the result set.
 * `values` is a 2D array of strings representing the rows of the result set.
 */
import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryResultsCommand,
  GetQueryExecutionCommand,
} from "@aws-sdk/client-athena";

// Interface for the result of a query
export interface QueryResult {
  query: string;
  columnNames: string[];
  values: string[][];
}

const client = new AthenaClient();

export async function executeAthenaQuery(
  databaseItem,
  queryString: string
): Promise<QueryResult> {
  const query = queryString.replace(/\\n/g, "\n");
  const connectionUrl = databaseItem.connectionUrl;
  const params = connectionUrl.split(";").reduce((acc, param) => {
    const [key, value] = param.split("=");
    return { ...acc, [key]: value };
  }, {});

  const schema = params["Schema"];
  const outputLocation = params["S3OutputLocation"];

  const startQueryExecutionCommand = new StartQueryExecutionCommand({
    QueryString: query,
    QueryExecutionContext: {
      Database: schema,
    },
    ResultConfiguration: {
      OutputLocation: outputLocation,
    },
  });

  const startQueryExecutionResponse = await client.send(
    startQueryExecutionCommand
  );
  const queryExecutionId = startQueryExecutionResponse.QueryExecutionId;

  // If there is no query execution ID, throw an error
  if (!queryExecutionId) {
    throw new Error("Failed to execute query");
  }

  // Keep checking the status of the query until it is no longer running
  let queryExecutionStatus = "RUNNING";
  while (queryExecutionStatus === "RUNNING") {
    // Get the current status of the query
    const getQueryExecutionCommand = new GetQueryExecutionCommand({
      QueryExecutionId: queryExecutionId,
    });
    const getQueryExecutionResponse = await client.send(
      getQueryExecutionCommand
    );

    // If there is no status, throw an error
    if (!getQueryExecutionResponse.QueryExecution?.Status?.State) {
      throw new Error("Failed to get query execution status");
    }

    // Update the status
    queryExecutionStatus =
      getQueryExecutionResponse.QueryExecution.Status.State;

    // If the query failed or was cancelled, throw an error
    if (
      queryExecutionStatus === "FAILED" ||
      queryExecutionStatus === "CANCELLED"
    ) {
      throw new Error(
        `Query failed or was cancelled: ${getQueryExecutionResponse.QueryExecution.Status.StateChangeReason}`
      );
    }

    // Wait for 5 seconds before checking the status again
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Get the results of the query
  let getQueryResultsResponse;
  let attempts = 0;
  const maxAttempts = 5;
  while (true) {
    try {
      const getQueryResultsCommand = new GetQueryResultsCommand({
        QueryExecutionId: queryExecutionId,
      });
      getQueryResultsResponse = await client.send(getQueryResultsCommand);
      break; // If the command was successful, break the loop
    } catch (error) {
      if (error.name === "InvalidRequestException" && attempts < maxAttempts) {
        // If the error is because the query is still running, wait for 5 seconds and then try again
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
      } else {
        // If the error is something else, or we've retried too many times, throw the error
        throw error;
      }
    }
  }

  // If there is no metadata, throw an error
  if (!getQueryResultsResponse.ResultSet?.ResultSetMetadata?.ColumnInfo) {
    throw new Error("Failed to get query results metadata");
  }

  // Extract the column names from the metadata
  const columnNames =
    getQueryResultsResponse.ResultSet.ResultSetMetadata.ColumnInfo.map(
      (column) => {
        if (!column.Name) {
          throw new Error("Failed to get column name");
        }
        return column.Name;
      }
    );

  // If there are no rows, throw an error
  if (!getQueryResultsResponse.ResultSet?.Rows) {
    throw new Error("Failed to get query results rows");
  }

  // Extract the values from the rows
  const values = getQueryResultsResponse.ResultSet.Rows.map((row) => {
    if (!row.Data) {
      throw new Error("Failed to get query results data");
    }
    return row.Data.map((datum) => {
      if (!datum.VarCharValue) {
        throw new Error("Failed to get data value");
      }
      return datum.VarCharValue;
    });
  });

  // Return the query, column names and values
  return { query, columnNames, values };
}
