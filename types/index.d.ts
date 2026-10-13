declare namespace _exports {
    export { EsiUserAttributes, EsiUserProvider, IFlowService, IFlowError, IFlowOptions, IFlowSpawnOptions, CDSRequest, CDSService };
}
declare namespace _exports {
    export namespace utils {
        export { date };
        export { xml };
        export { json };
        export { array };
        export { sap };
        export { UUID };
    }
    export namespace esi {
        export { query };
        export { connect };
        export { user };
        export { RemoteApplicationService };
        export { SoapApplicationService };
    }
    export { _LOG };
}
export = _exports;
/**
 * Attributes of `req.user.attr` after the user enrichment (`esi.user`).
 */
type EsiUserAttributes<T extends Record<string, any> = Record<string, any>> = UserAttributes<T>;
/**
 * Provider function for `esi.user.provider(fn)`.
 */
type EsiUserProvider = UserProvider;
/**
 * Client of an iFlow (`cds.requires` kind `iflow-https`), returned by `esi.connect.to(name)`.
 */
type IFlowService = IFlowClient;
/**
 * Error of an iFlow call (`execute` rejects with it, `spawn` passes it to `onError`).
 */
type IFlowError = IFlowFailure;
/**
 * Options of `IFlowService.execute`.
 */
type IFlowOptions = IFlowCallOptions;
/**
 * Options of `IFlowService.spawn`.
 */
type IFlowSpawnOptions = IFlowSpawnCallOptions;
/**
 * A CAP request (`req` of a handler).
 */
type CDSRequest<T> = Request<T>;
/**
 * A CAP service.
 */
type CDSService = Service;
import { date } from "./lib/utils";
import { xml } from "./lib/utils";
import { json } from "./lib/utils";
import { array } from "./lib/utils";
import { sap } from "./lib/utils";
import { UUID } from "./lib/utils";
import { query } from "./lib/query";
import { connect } from "./lib/connect";
import { user } from "./lib/user";
import { RemoteApplicationService } from "@cap-ts/remote-service-adapter";
declare const SoapApplicationService: typeof soap.Service;
import { _LOG } from "./lib/utils";
import type { EsiUserAttributes as UserAttributes } from './lib/user';
import type { EsiUserProvider as UserProvider } from './lib/user';
import type { IFlowService as IFlowClient } from './lib/connect';
import type { IFlowError as IFlowFailure } from './lib/connect';
import type { IFlowOptions as IFlowCallOptions } from './lib/connect';
import type { IFlowSpawnOptions as IFlowSpawnCallOptions } from './lib/connect';
import type { CDSRequest as Request } from './lib/types';
import type { CDSService as Service } from './lib/types';
import { soap } from "@cap-ts/soap-adapter";
//# sourceMappingURL=index.d.ts.map