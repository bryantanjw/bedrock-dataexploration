/**
 * Schema of data source descriptor objects in DynamoDB
 */
export interface IDataSourceDescriptor {
  databaseName: string;
  connectionUrl: string;
  databaseCredentialsSsm?: string;
  dbType: "ATHENA" | "NEPTUNE" | "POSTGRESQL";
  schema: string;
}

/**
 * All 'data source' constructs should expose a dataSourceDescriptor property
 */
export interface IDataSource {
  readonly dataSourceDescriptor: IDataSourceDescriptor;
}
