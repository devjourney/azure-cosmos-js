import { ClientContext } from "../../ClientContext";
import { Helper } from "../../common";
import { CosmosClient } from "../../CosmosClient";
import { SqlQuerySpec } from "../../queryExecutionContext";
import { QueryIterator } from "../../queryIterator";
import { FeedOptions, RequestOptions, Response } from "../../request";
import { Container } from "../Container";
import { UserDefinedFunction } from "./UserDefinedFunction";
import { UserDefinedFunctionDefinition } from "./UserDefinedFunctionDefinition";
import { UserDefinedFunctionResponse } from "./UserDefinedFunctionResponse";

/**
 * Used to create, upsert, query, or read all User Defined Functions.
 *
 * @see {@link UserDefinedFunction} to read, replace, or delete a given User Defined Function by id.
 */
export class UserDefinedFunctions {
  private client: CosmosClient;
  /**
   * @hidden
   * @param container The parent {@link Container}.
   */
  constructor(public readonly container: Container, private readonly clientContext: ClientContext) {
    this.client = this.container.database.client;
  }

  /**
   * Query all User Defined Functions.
   * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
   * @param options
   */
  public query(query: SqlQuerySpec, options?: FeedOptions): QueryIterator<UserDefinedFunctionDefinition> {
    const path = Helper.getPathFromLink(this.container.url, "udfs");
    const id = Helper.getIdFromLink(this.container.url);

    return new QueryIterator(this.clientContext, query, options, innerOptions => {
      return this.clientContext.queryFeed(path, "udfs", id, result => result.UserDefinedFunctions, query, innerOptions);
    });
  }

  /**
   * Read all User Defined Functions.
   * @param options
   * @example Read all User Defined Functions to array.
   * ```typescript
   * const {body: udfList} = await container.userDefinedFunctions.readAll().toArray();
   * ```
   */
  public readAll(options?: FeedOptions): QueryIterator<UserDefinedFunctionDefinition> {
    return this.query(undefined, options);
  }

  /**
   * Create a UserDefinedFunction.
   *
   * Azure Cosmos DB supports JavaScript UDFs which can be used inside queries, stored procedures and triggers.
   *
   * For additional details, refer to the server-side JavaScript API documentation.
   *
   */
  public async create(
    body: UserDefinedFunctionDefinition,
    options?: RequestOptions
  ): Promise<UserDefinedFunctionResponse> {
    if (body.body) {
      body.body = body.body.toString();
    }

    const err = {};
    if (!Helper.isResourceValid(body, err)) {
      throw err;
    }

    const path = Helper.getPathFromLink(this.container.url, "udfs");
    const id = Helper.getIdFromLink(this.container.url);

    const response = await this.clientContext.create(body, path, "udfs", id, undefined, options);
    const ref = new UserDefinedFunction(this.container, response.result.id, this.clientContext);
    return { body: response.result, headers: response.headers, ref, userDefinedFunction: ref, udf: ref };
  }

  /**
   * Upsert a UserDefinedFunction.
   *
   * Azure Cosmos DB supports JavaScript UDFs which can be used inside queries, stored procedures and triggers.
   *
   * For additional details, refer to the server-side JavaScript API documentation.
   *
   */
  public async upsert(
    body: UserDefinedFunctionDefinition,
    options?: RequestOptions
  ): Promise<UserDefinedFunctionResponse> {
    if (body.body) {
      body.body = body.body.toString();
    }

    const err = {};
    if (!Helper.isResourceValid(body, err)) {
      throw err;
    }

    const path = Helper.getPathFromLink(this.container.url, "udfs");
    const id = Helper.getIdFromLink(this.container.url);

    const response = await this.clientContext.upsert(body, path, "udfs", id, undefined, options);
    const ref = new UserDefinedFunction(this.container, response.result.id, this.clientContext);
    return { body: response.result, headers: response.headers, ref, userDefinedFunction: ref, udf: ref };
  }
}
