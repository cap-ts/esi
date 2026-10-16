# @cap-ts/esi API Reference

> **Module:** `@cap-ts/esi` Package
> **Purpose:** `@cap-ts/esi` is a specialized API package designed for **Enterprise System Integration** within the [SAP Cloud Application Programming Model (CAP)](https://cap.cloud.sap/docs/) framework. It is the single dependency through which an application reaches remote systems: the service classes of the remote-service and SOAP adapters, user context enrichment, CQN and request helpers, iFlow calls and generic utilities.
> **Package Structure:** The package exports two modules:
> **`esi` Module**: the integration APIs and the adapter classes.
> **`utils` Module**: generic utility functions for common development tasks.

---

## Table of Contents

- [Exports](#exports)
- [Module: `esi`](#module-esi)
- [Module: `utils`](#module-utils)
- [CAP plugin](#cap-plugin)
- [Changes in 2.0](#changes-in-20)
- [Quick Usage Examples](#quick-usage-examples)

---

## Exports

```js
const { esi, utils, _LOG } = require('@cap-ts/esi');
```

```ts
import { esi, utils } from '@cap-ts/esi';
import type { EsiUserAttributes, EsiUserProvider, IFlowService, IFlowError, CDSRequest, CDSService, EsiMessage, EsiErrorDetail } from '@cap-ts/esi';
```

---

## Module: `esi`

| Feature | Member | Description | Reference |
| :--- | :--- | :--- | :--- |
| **Remote services** | `RemoteApplicationService` | The service class of `@cap-ts/remote-service-adapter`: projections over remote OData V2 / V4, SOAP, other CAP services or the database, with reads, writes, operations, filters through associations, caches and warm-up (`@remote.warmUp`). | Adapter README |
| **SOAP services** | `SoapApplicationService` | The service class of a SOAP service of `@cap-ts/soap-adapter`. | Adapter README |
| **Remote Communication** | `connect` | `connect.to(name)`: a service by name (`cds.connect.to`), or an iFlow client (`execute` / `spawn`) for a `cds.requires` entry of kind `iflow-https`. | [connect](./lib/connect/README.md) |
| **User Context** | `user` | Loads the logged-in user's business profile into `req.user.attr` (run by the esi CAP plugin for every request, cached per user and tenant); transactions as a technical user. | [user](./lib/user/README.md) |
| **Query Helpers** | `query` | CQN helpers: split, build and change WHERE clauses, columns and FROM clauses of `req.query`; key values of a request; the interval selection of SAP enterprise services. | [query](./lib/query/README.md) |
| **Request Helpers** | `request` | Headers, the user a request acts for, collected errors, translated messages, error details for clients, and a guard that turns a failing step into a rejection. | [request](./lib/request/README.md) |

---

## Module: `utils`

Generic utility functions: dates (`date`), XML (`xml`), JSON (`json`), arrays (`array`), SAP user formats and EDM
types (`sap`), wildcards (`string`), run-once functions (`fn`) and composite-key UUIDs (`UUID`). `_LOG` formats
values for log lines. Refer to the [utils Documentation](./lib/utils/README.md) for more details.

---

## CAP plugin

esi is a CAP plugin: an application that depends on it gets the CAP plugins of both adapters and the user context
enrichment without code of its own. Its configuration is `cds.esi` (access key `id`, `user`, `log`) or a top-level `esi`
in the application's `package.json`. On start it checks the license and the published configuration (an internet
connection is required).

---

## Changes in 2.0

esi 2.0 keeps only the APIs listed above. Removed with the V1 runtime:

| Removed | Use instead |
| :--- | :--- |
| `esi.impl` (`RemoteService`, `LocalService`, ...) | `esi.RemoteApplicationService` (annotate the service with `@remote`, or extend the class) |
| `esi.service` (events, `executeIflow`, service helpers) | `esi.connect.to(name)` (`execute` / `spawn` of an `iflow-https` entry), CAP's own handlers |
| `esi.log` | `cds.log(...)` |
| `.esisrc.json`, the `esi` of the published configuration, `cds.esi.requires` | `cds.esi` / `cds.requires` |

Applications that must stay on the V1 runtime pin `@cap-ts/esi` `~1.8.51`.

---

## Quick Usage Examples

```js
const cds = require('@sap/cds');
const { esi, utils } = require('@cap-ts/esi');

// remote services: a projection service served by RemoteApplicationService
class OrderService extends esi.RemoteApplicationService {
    async init() {
        this.before('READ', 'Orders', (req) => esi.request.guard(req, () => checkAccess(req), { status: 403 }));
        await super.init();
    }
}

// connect usage: a CAP service, or an iFlow (kind iflow-https)
const catalog = await esi.connect.to('CatalogService');
const flow = await esi.connect.to('OrderSync');
flow.spawn({ OrderID: id }, { onError: (error) => cds.log('orders').error(error.MPLId, error.message) });

// user usage: register a provider in code (or annotate an entity / function with @esi.user.provider)
esi.user.provider(async ({ user, tenant, email }) => ({ Department: 'Sales', Groups: ['Admin'] }));
await esi.user.enrich(cds.context.user);                                  // e.g. in a cds.spawn job
await esi.user.tx(catalog, (tx) => tx.run(SELECT.from('Orders')));        // as the technical user

// query and request usage
const W = esi.query.SELECT.where;
W.add(req, [{ xpr: W.anyEqual('Status', ['O', 'P']) }]);
const sUser = esi.request.actingUser(req, 'x-acting-user');

// utils usage
utils.date.format('2026-04-20T10:00:00Z', utils.date.PATTERN.DMY);       // '20-04-2026'
utils.array.uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], 'id');            // [{ id: 1 }, { id: 2 }]
utils.json.merge({ a: 1 }, { b: 2 });                                    // { a: 1, b: 2 }
```
