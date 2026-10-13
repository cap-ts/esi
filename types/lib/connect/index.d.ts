declare namespace _exports {
    export { IFlowError, IFlowOptions, IFlowSpawnOptions, IFlowService };
}
declare const _exports: {
    [x: symbol]: {
        /** @type {Map<string, Promise<IFlowService>>} */
        iflows: Map<string, Promise<IFlowService>>;
        /**
         * The value of a response header, whatever the case of its name.
         *
         * @param {any} oHeaders
         * @param {string} sName - Lower case name.
         * @returns {string | undefined}
         */
        header: (oHeaders: any, sName: string) => string | undefined;
        /**
         * The error of a failed iFlow call as an `IFlowError`: the message with the response body (a JSON body
         * serialized), and the MPL id: the `SAP_MessageProcessingLogID` response header of Integration Suite, else the
         * id named in the body.
         *
         * @param {any} oError
         * @returns {IFlowError}
         */
        toIFlowError: (oError: any) => IFlowError;
        /**
         * Connects the REST service of an iFlow and adds `execute` and `spawn` to it.
         *
         * @param {string} sName - Name of the `cds.requires` entry.
         * @param {any} oDefinition - The `cds.requires` entry (kind `iflow-https`).
         * @returns {Promise<IFlowService>}
         */
        connectIFlow: (sName: string, oDefinition: any) => Promise<IFlowService>;
    };
    connect: typeof connect;
};
export = _exports;
/**
 * Error of an iFlow call. The fields are own enumerable properties, so `JSON.stringify` keeps them.
 */
type IFlowError = Error & {
    code?: string;
    status?: number;
    MPLId?: string;
    correlationId?: string;
    config?: any;
    request?: any;
    response?: any;
};
/**
 * Options of `IFlowService.execute` and `IFlowService.spawn`.
 */
type IFlowOptions = {
    /**
     * - Path below the configured `credentials.path` (default `/`).
     */
    path?: string;
    /**
     * - Extra request headers. `Content-Type: application/json` and, on Cloud
     * Foundry, `x-cf-space` are set by default.
     */
    headers?: Record<string, string>;
};
/**
 * Options of `IFlowService.spawn`.
 */
type IFlowSpawnOptions = IFlowOptions & {
    onError?: (error: IFlowError) => void | Promise<void>;
};
/**
 * Client of an iFlow: the CAP REST service of the `cds.requires` entry plus `execute` and `spawn`.
 */
type IFlowService = {
    /**
     * - POSTs `data` to the iFlow and resolves
     * to its response; rejects with an `IFlowError`.
     */
    execute: (data: any, options?: IFlowOptions) => Promise<any>;
    /**
     * - Runs `execute` in the background
     * (`cds.spawn`); a failure is logged and passed to `onError`.
     */
    spawn: (data: any, options?: IFlowSpawnOptions) => void;
    /**
     * - POST of the REST
     * service.
     */
    post: (path: string, data?: any, headers?: Record<string, string>) => Promise<any>;
    /**
     * - GET of the REST service.
     */
    get: (path: string, headers?: Record<string, string>) => Promise<any>;
};
/**
 * connect module: connects to a service of the application by its `cds.requires` / served name.
 * @class
 * @public
 */
declare class connect {
    /**
     * Connects to a service by name. A `cds.requires` entry of kind `iflow-https` (an SAP Integration Suite iFlow,
     * `credentials` with destination and path) returns an `IFlowService`: a REST client with `execute` and `spawn`,
     * created once per name. Every other name is `cds.connect.to(name)`.
     *
     * @public
     * @static
     * @param {string} sServiceName - Name of a served service or of a `cds.requires` entry.
     * @returns {Promise<any>} The connected service; an `IFlowService` for kind `iflow-https`.
     * @example
     * const srv = await connect.to("CatalogService");
     * const flow = await connect.to("iFlowService");
     * flow.spawn({ ID }, { onError: async (oError) => { ... } });
     */
    public static to(sServiceName: string): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map