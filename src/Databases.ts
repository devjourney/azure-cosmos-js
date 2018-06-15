import { Response } from ".";
import { CosmosClient } from "./CosmosClient";
import { Database } from "./Database";
import { DatabaseDefinition } from "./DatabaseDefinition";
import { FeedOptions, RequestOptions } from "./documentclient";
import { SqlQuerySpec } from "./queryExecutionContext";
import { QueryIterator } from "./queryIterator";

export class Databases {
    constructor(private readonly client: CosmosClient) {}
    public getDatabase(id: string): Database {
        return new Database(this.client, id);
    }

    public query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<DatabaseDefinition> {
        return this.client.documentClient.queryDatabases(query, options);
    }

    public create(body: DatabaseDefinition, options?: RequestOptions): Promise<Response<DatabaseDefinition>> {
        return this.client.documentClient.createDatabase(body, options);
    }

    public read(options?: FeedOptions): QueryIterator<DatabaseDefinition> {
        return this.client.documentClient.readDatabases(options);
    }
}