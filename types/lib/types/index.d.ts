export type CDSService = {
    /**
     * - Collection of entities served by this service.
     */
    entities: Record<string, any>;
    /**
     * - Executes a given query against the service.
     */
    run: (query: any) => Promise<any>;
    /**
     * - Starts a new transaction.
     */
    tx: (req: any) => CDSServiceTx;
    /**
     * - Alias for the tx method.
     */
    transaction: (req: any) => CDSServiceTx;
    /**
     * - Registers a handler for specific events.
     */
    on: CDSMethod;
    /**
     * - Registers a handler to run before the standard logic.
     */
    before: CDSMethod;
    /**
     * - Registers a handler to run after the standard logic.
     */
    after: CDSAfterMethod;
    /**
     * - Synchronously or asynchronously triggers an event.
     */
    emit: (event: string, data?: any) => Promise<void>;
    /**
     * - Sends a custom action or function call to the service.
     */
    send: (action: string, params?: any) => Promise<any>;
    /**
     * - Deletes records matching the given criteria.
     */
    delete: (entity: string, where: any) => Promise<number>;
    /**
     * - Registers a handler for read operation.
     */
    read: (entity: string) => SelectBuilder;
};
export type CDSRequest<T> = {
    /**
     * - The request payload.
     */
    data: T & {
        params?: any;
    };
    /**
     * - Map of request headers.
     */
    headers: Record<string, string>;
    /**
     * - Positional parameters from the URL.
     */
    params: any[];
    /**
     * - The authenticated user information.
     */
    user: CDSUser;
    /**
     * - The CQN (OData-like) query structure.
     */
    query: any;
    /**
     * - Information about the target entity.
     */
    target: CDSTarget;
    /**
     * - The name of the event (e.g., 'READ', 'UPDATE').
     */
    event: string;
    /**
     * - The underlying HTTP request (if applicable).
     */
    http?: {
        req: {
            headers: Record<string, string>;
        };
    };
    /**
     * - Rejects the request with a specific status and message.
     */
    reject: CDSReject;
    /**
     * - Adds an error to the request without necessarily stopping execution.
     */
    error: CDSError;
    /**
     * - Adds a warning message to the response.
     */
    warn: (opts: {
        message: string;
    }) => void;
    /**
     * - Adds an informational message to the response.
     */
    info: (msg: string) => void;
    /**
     * - Collection of errors collected during processing.
     */
    errors?: any[];
};
export type CDSUser = {
    /**
     * - The user's unique identifier.
     */
    id: string;
    /**
     * - Custom user attributes.
     */
    attr: Record<string, any>;
    /**
     * - Checks if the user has a specific role.
     */
    is: (role: string) => boolean;
};
/**
 * Fluent query builder returned by srv.read().
 */
export type SelectBuilder = {
    /**
     * - Adds WHERE clause using query-by-example object.
     */
    where: (where: any) => SelectBuilder;
    /**
     * - Executes query and returns array of results.
     */
    exec?: () => Promise<any[]>;
    /**
     * - Executes query expecting single result.
     */
    one: () => Promise<any>;
};
export type CDSTarget = {
    /**
     * - The absolute name of the target entity.
     */
    name: string;
    /**
     * - Any projection (select list) applied to the entity.
     */
    projection?: any;
};
export type CDSReject = (opts?: {
    status?: number;
    message?: string;
    code?: string;
    target?: string;
    args?: any[];
}) => void;
export type CDSError = (opts: {
    status?: number;
    message?: string;
    code?: string;
    target?: string;
    args?: any[];
}) => void;
/**
 * Handles 'on' and 'before' event registrations.
 * Supports both signatures: (event, entities, handler) AND (event, handler).
 */
export type CDSMethod = (event: string | string[], entitiesOrHandler: any | CDSHandler, handler?: CDSHandler) => void;
/**
 * Handles 'after' event registrations.
 * Supports both signatures: (event, entities, handler) AND (event, handler).
 */
export type CDSAfterMethod = (event: string | string[], entitiesOrHandler: any | CDSAfterHandler, handler?: CDSAfterHandler) => void;
export type CDSHandler = (req: CDSRequest, next: () => Promise<any>) => any | Promise<any>;
export type CDSAfterHandler = (results: any, req: CDSRequest) => any | Promise<any>;
export type CDSServiceTx = CDSService;
//# sourceMappingURL=index.d.ts.map