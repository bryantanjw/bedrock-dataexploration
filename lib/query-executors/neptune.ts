/**
 * This file is responsible for executing Neptune queries.
 * It imports the necessary gremlin libraries and defines the executeNeptuneQuery function.
 * The function takes in databaseInformation and a queryString as parameters.
 * It establishes a connection with the Neptune database and executes the query.
 * The results of the query are then formatted into a JSON object with columnNames and values.
 * If an error occurs during the execution of the query, it is caught and logged to the console.
 */

import gremlin from "gremlin";
const {
  driver: { DriverRemoteConnection },
  structure: { Graph },
} = gremlin;

export async function executeNeptuneQuery(databaseInformation, queryString) {
  const query = queryString.replace(/\\n/g, "\n");

  const url = new URL(databaseInformation.connectionUrl.replace("jdbc:", ""));
  const host = url.hostname;
  const port = url.port;

  const dc = new DriverRemoteConnection(`wss://${host}:${port}/gremlin`);
  console.log("dc", dc);

  const graph = new Graph();
  const g = graph.traversal().withRemote(dc);

  try {
    const result = await g.V().hasLabel(query).toList();

    const columnNames = ["Records"];
    const values = result.map((item) => [JSON.stringify(item)]);

    dc.close();

    return { query, columnNames, values };
  } catch (error) {
    console.error("Error executing Neptune query", error);
    throw error;
  }
}
