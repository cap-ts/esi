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
import { RemoteApplicationService } from "@cap-ts/remote-service-adapter";
declare const SoapApplicationService: typeof soap.ApplicationService;
import { _LOG } from "./lib/utils";
import { soap } from "@cap-ts/soap-adapter";
export declare namespace utils {
    export { date };
    export { xml };
    export { json };
    export { array };
    export { UUID };
}
export declare namespace esi {
    export { log };
    export { query };
    export { service };
    export { impl };
    export { connect };
    export { RemoteApplicationService };
    export { SoapApplicationService };
}
export { _LOG };
//# sourceMappingURL=index.d.ts.map