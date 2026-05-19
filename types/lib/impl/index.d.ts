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
    /**
     * - esi runtime extension: logic to run before the 'on' phase.
     */
    PreOn?: any;
    /**
     * - esi runtime extension: logic to run after the 'on' phase.
     */
    PostOn?: any;
    /**
     * - esi runtime extension: pre-mashup processing.
     */
    PreMeshUp?: any;
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
export type ServiceEventsServiceInterceptor = (oService: CDSService) => Promise<void>;
export type ServiceEventsRequestInterceptor = (oRequest: CDSRequest) => Promise<any[]>;
export type Service = typeof import("../service").service;
export type ServiceEvents = Service["events"];
export type ServiceEventsKey = keyof ServiceEvents;
export type ServieEventsServiceHandler = Partial<Record<ServiceEventsKey, ServiceEventsServiceInterceptor>>;
export type ServieEventsRequestHandler = Partial<Record<ServiceEventsKey, ServiceEventsRequestInterceptor>>;
/**
 * impl module
 * @class
 * @public
 */
/**
 * @typedef {Object} CDSService
 * @property {Record<string, any>} entities - Collection of entities served by this service.
 * @property {(query: any) => Promise<any>} run - Executes a given query against the service.
 * @property {(req: any) => CDSServiceTx} tx - Starts a new transaction.
 * @property {(req: any) => CDSServiceTx} transaction - Alias for the tx method.
 * @property {CDSMethod} on - Registers a handler for specific events.
 * @property {CDSMethod} before - Registers a handler to run before the standard logic.
 * @property {CDSAfterMethod} after - Registers a handler to run after the standard logic.
 * @property {(event: string, data?: any) => Promise<void>} emit - Synchronously or asynchronously triggers an event.
 * @property {(action: string, params?: any) => Promise<any>} send - Sends a custom action or function call to the service.
 * @property {(entity: string, where: any) => Promise<number>} delete - Deletes records matching the given criteria.
 * @property {(entity: string) => SelectBuilder} read - Registers a handler for read operation.
 */
/**
 * @template T
 * @typedef {Object} CDSRequest
 * @property {T & { params?: any }} data - The request payload.
 * @property {Record<string, string>} headers - Map of request headers.
 * @property {any[]} params - Positional parameters from the URL.
 * @property {CDSUser} user - The authenticated user information.
 * @property {any} query - The CQN (OData-like) query structure.
 * @property {CDSTarget} target - Information about the target entity.
 * @property {string} event - The name of the event (e.g., 'READ', 'UPDATE').
 * @property {{ req: { headers: Record<string, string> } }} [http] - The underlying HTTP request (if applicable).
 * @property {CDSReject} reject - Rejects the request with a specific status and message.
 * @property {CDSError} error - Adds an error to the request without necessarily stopping execution.
 * @property {(opts: { message: string }) => void} warn - Adds a warning message to the response.
 * @property {(msg: string) => void} info - Adds an informational message to the response.
 * @property {any[]} [errors] - Collection of errors collected during processing.
 * @property {any} [PreOn] - esi runtime extension: logic to run before the 'on' phase.
 * @property {any} [PostOn] - esi runtime extension: logic to run after the 'on' phase.
 * @property {any} [PreMeshUp] - esi runtime extension: pre-mashup processing.
 */
/**
 * @typedef {Object} CDSUser
 * @property {string} id - The user's unique identifier.
 * @property {Record<string, any>} attr - Custom user attributes.
 * @property {(role: string) => boolean} is - Checks if the user has a specific role.
 */
/**
 * Fluent query builder returned by srv.read().
 * @typedef {Object} SelectBuilder
 * @property {(where: any) => SelectBuilder} where - Adds WHERE clause using query-by-example object.
 * @property {() => Promise<any[]>} [exec] - Executes query and returns array of results.
 * @property {() => Promise<any>} one - Executes query expecting single result.
 */
/**
 * @typedef {Object} CDSTarget
 * @property {string} name - The absolute name of the target entity.
 * @property {any} [projection] - Any projection (select list) applied to the entity.
 */
/**
 * @callback CDSReject
 * @param {{ status?: number; message?: string; code?: string; target?: string; args?: any[] }} [opts]
 * @returns {void}
 */
/**
 * @callback CDSError
 * @param {{ status?: number; message?: string; code?: string; target?: string; args?: any[] }} opts
 * @returns {void}
 */
/**
 * Handles 'on' and 'before' event registrations.
 * Supports both signatures: (event, entities, handler) AND (event, handler).
 * @callback CDSMethod
 * @param {string | string[]} event - The name of the event (e.g., 'READ', 'UPDATE').
 * @param {any | CDSHandler} entitiesOrHandler - Either the target entity/entities or the handler function.
 * @param {CDSHandler} [handler] - The handler function if an entity was provided as the second argument.
 * @returns {void}
 */
/**
 * Handles 'after' event registrations.
 * Supports both signatures: (event, entities, handler) AND (event, handler).
 * @callback CDSAfterMethod
 * @param {string | string[]} event - The name of the event.
 * @param {any | CDSAfterHandler} entitiesOrHandler - Either the target entity or the handler function.
 * @param {CDSAfterHandler} [handler] - The handler function if an entity was provided.
 * @returns {void}
 */
/**
 * @callback CDSHandler
 * @param {CDSRequest} req - The incoming request object.
 * @param {() => Promise<any>} next - The function to call the next handler in the chain.
 * @returns {any | Promise<any>}
 */
/**
 * @callback CDSAfterHandler
 * @param {any} results - The results from the primary execution.
 * @param {CDSRequest} req - The incoming request object.
 * @returns {any | Promise<any>}
 */
/**
 * @typedef {CDSService} CDSServiceTx
 */
/**
 * @callback ServiceEventsServiceInterceptor
 * @param {CDSService} oService - Service object for which request to be executed
 * @returns {Promise<void>}
 */
/**
 * @callback ServiceEventsRequestInterceptor
 * @param {CDSRequest} oRequest - Request object
 * @returns {Promise<any[]>}
 */
/**
 * @typedef {typeof import('../service').service} Service
 * @typedef {Service['events']} ServiceEvents
 * @typedef {keyof ServiceEvents} ServiceEventsKey
 * @typedef {Partial<Record<ServiceEventsKey, ServiceEventsServiceInterceptor>>} ServieEventsServiceHandler
 * @typedef {Partial<Record<ServiceEventsKey, ServiceEventsRequestInterceptor>>} ServieEventsRequestHandler
 */
export class impl {
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {ServieEventsServiceHandler|ServieEventsRequestHandler} oEvent
     * @returns {Promise<void>}
     */
    static DBService(oService: object, oEvent: ServieEventsServiceHandler | ServieEventsRequestHandler): Promise<void>;
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {string} sServiceName - Service Name
     * @param {ServieEventsServiceHandler|ServieEventsRequestHandler} oEvent
     * @param {string|any[]} oLocalEntities
     * @param {ServieEventsServiceHandler|ServieEventsRequestHandler} oRemoteEvent
     * @param {string|any[]} [oRemoteEntities]
     * @param {any[]} [oRemoteHandlers]
     * @param {boolean} bRefreshUserContext
     * @returns {Promise<void>}
     */
    static LocalService(oService: object, sServiceName: string, oEvent?: ServieEventsServiceHandler | ServieEventsRequestHandler, oLocalEntities?: string | any[], oRemoteEvent?: ServieEventsServiceHandler | ServieEventsRequestHandler, oRemoteEntities?: string | any[], oRemoteHandlers?: any[], bRefreshUserContext?: boolean): Promise<void>;
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {ServieEventsServiceHandler|ServieEventsRequestHandler} oEvent
     * @param {string|any[]} oEntities
     * @param {any[]} [oHandlers]
     * @param {boolean} bRefreshUserContext
     * @returns {Promise<void>}
     */
    static RemoteService(oService: object, oEvent?: ServieEventsServiceHandler | ServieEventsRequestHandler, oEntities?: string | any[], oHandlers?: any[], bRefreshUserContext?: boolean): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map