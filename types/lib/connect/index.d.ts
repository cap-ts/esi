/**
 * connect module for establishing connections to various services, including SOAP, ODATA v2/v4, Integration Flow and RESTful services.
 * @class
 * @public
 */
export class connect {
    /**
     * Establishes a connection to the specified service based on its configuration in `cds.requires`.
     * It supports connecting to local services defined in the application as well as remote services,
     * including SOAP, ODATA v2/v4, Integration Flow and RESTful services. The method determines the type of
     * service based on the configuration and uses the appropriate connection method to establish the connection.
     *
     * @public
     * @static
     * @param {string} sServiceName - The name of the service to connect to (e.g., "LocalService.MyService", "RemoteService.MyService").
     * @returns {Promise<any>} Resolves to the service connection object.
     * @example
     * await connect.to("LocalService.MyService"); // returns the service connection object
     * await connect.to("RemoteService.MyService"); // returns the service connection object
     */
    public static to(sServiceName: string): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map