declare namespace _exports {
    export { EsiUserAttributes, EsiUserProvider };
}
declare namespace _exports {
    export namespace utils {
        export { date };
        export { xml };
        export { json };
        export { array };
        export { UUID };
    }
    export namespace esi {
        export { log };
        export { query };
        export { service };
        export { impl };
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
import { date } from "./lib/utils";
import { xml } from "./lib/utils";
import { json } from "./lib/utils";
import { array } from "./lib/utils";
import { UUID } from "./lib/utils";
import { log } from "./lib/log";
import { query } from "./lib/query";
import { service } from "./lib/service";
import { impl } from "./lib/impl";
import { connect } from "./lib/connect";
import { user } from "./lib/user";
import { RemoteApplicationService } from "@cap-ts/remote-service-adapter";
declare const SoapApplicationService: typeof soap.ApplicationService;
import { _LOG } from "./lib/utils";
import type { EsiUserAttributes as UserAttributes } from './lib/user';
import type { EsiUserProvider as UserProvider } from './lib/user';
import { soap } from "@cap-ts/soap-adapter";
//# sourceMappingURL=index.d.ts.map