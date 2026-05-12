declare namespace _exports {
    export { Service, ServiceEvents, ServiceEventsValue };
}
declare namespace _exports {
    function log(sServiceName?: string | undefined): {
        trace: (oEvent: ServiceEventsValue, oRequest: object, ...oArgs: any[]) => void;
        debug: (oEvent: ServiceEventsValue, oRequest: object, ...oArgs: any[]) => void;
        info: (oEvent: ServiceEventsValue, oRequest: object, ...oArgs: any[]) => void;
        warn: (oEvent: ServiceEventsValue, oRequest: object, ...oArgs: any[]) => void;
        error: (oEvent: ServiceEventsValue, oRequest: object, ...oArgs: any[]) => void;
        fatal: (oEvent: ServiceEventsValue, oRequest: object, ...oArgs: any[]) => void;
    };
}
export = _exports;
type Service = typeof import("../service").service;
type ServiceEvents = Service["events"];
type ServiceEventsValue = ServiceEvents[keyof ServiceEvents];
//# sourceMappingURL=index.d.ts.map