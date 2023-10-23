export function generatePostgreSqlPrompt(
  databaseItem,
  userQuestion: string
): string {
  return `
    \n\nHuman:
      You are connected to a relational database with the following schema:
  
      <schema>
      ${databaseItem.schema}
      </schema>
  
      The database is implemented in PostgreSQL. Write a query to retrieve the data needed to answer the following question - or respond with "unknown" if the given schema does not contain relevant information. Output the query inside <query></query> tags and and explanation of what the query does inside <explanation></explanation> tags. Do not use any linebreak inside the <query></query> and <explanation></explanation> tags!
  
      Question: ${userQuestion}
  
      Assistant:
    `;
}

export function generateAthenaPrompt(
  databaseItem,
  userQuestion: string
): string {
  return `
    \n\nHuman:
      You are connected to a Amazon Athena database with the following schema:
  
      <schema>
      ${databaseItem.schema}
      </schema>
  
      The database is implemented in AnsiSQL. Write a query to retrieve the data needed to answer the following question - or respond with "unknown" if the given schema does not contain relevant information. Output the query inside <query></query> tags and and explanation of what the query does inside <explanation></explanation> tags.
  
      Question: ${userQuestion}
  
      Assistant:
    `;
}

export function generateNeptunePrompt(
  databaseItem,
  userQuestion: string
): string {
  return `
    \n\nHuman:
      You are connected to a graph database with the following schema:
  
      <schema>
      ${databaseItem.schema}
      </schema>
  
      The database is implemented in Amazon Neptune Neo4J. Write a query to retrieve the data needed to answer the following question - or respond with "unknown" if the given schema does not contain relevant information. Check you use relations only in the direction they run when matching. Return only an explanation of how the query works enclosed in <explanation></explanation> tags, and a valid OpenCypher query enclosed in <query></query> tags.
  
      <question>${userQuestion}</question>
  
      Assistant:
    `;
}
