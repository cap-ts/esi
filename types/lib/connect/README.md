# @cap-ts/esi Connect API Reference

> **Module:** `esi.connect`  
> **Purpose:** Connects to a service by name: an SAP Integration Suite iFlow (`cds.requires` kind `iflow-https`) as a
> REST client with `execute` / `spawn`, any other name through `cds.connect.to`.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Exports](#exports)
- [Configuration](#configuration)
- [connect.to(name)](#connecttoname)
- [IFlowService](#iflowservice)
  - [execute(data, options?)](#executedata-options)
  - [spawn(data, options?)](#spawndata-options)
  - [post / get](#post--get)
- [IFlowError](#iflowerror)
- [Errors](#errors)
- [Quick Usage Examples](#quick-usage-examples)

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@sap/cds` | `cds.connect.to` (services and the REST client), `cds.spawn`, `cds.log('esi')` |
| `utils` | `json.stripUndefined` for the error fields |

---

## Exports

```js
const { esi } = require('@cap-ts/esi');
esi.connect.to(name);
```

```ts
import { esi } from '@cap-ts/esi';
import type { IFlowService, IFlowError, IFlowOptions, IFlowSpawnOptions } from '@cap-ts/esi';
```

---

## Configuration

An iFlow is a `cds.requires` entry of kind `iflow-https` with `credentials`: a BTP destination and the iFlow's path, or a
`url` for local development.

```json
"cds": {
  "requires": {
    "OrderSync": {
      "kind": "iflow-https",
      "credentials": { "destination": "INTEGRATION_SUITE", "path": "/http/orders/sync" }
    }
  }
}
```

| `cds.requires.<name>.kind` | `connect.to(name)` returns |
|----------------------------|----------------------------|
| `iflow-https` | An [`IFlowService`](#iflowservice), created once per name (later calls get the same client) |
| anything else, or a served service | `cds.connect.to(name)` |

---

## `connect.to(name)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Name of a served service or of a `cds.requires` entry |
| **Returns** | `Promise<any>` | The connected service; an `IFlowService` for kind `iflow-https` |

**Behavior:**
- No name (or not a string): rejects with `connect.to: a service name is required`.
- Kind `iflow-https`: connects a CAP REST client (`cds.connect.to({ kind: 'rest', credentials })`) and adds `execute`
  and `spawn`. The promise is cached per name; a connect that fails is removed from the cache, so the next call
  tries again.
- Any other name: exactly `cds.connect.to(name)` (CAP caches it).

```js
const catalog = await esi.connect.to('CatalogService');  // a CAP service
const flow = await esi.connect.to('OrderSync');           // an IFlowService
```

---

## `IFlowService`

The CAP REST service of the `cds.requires` entry plus two methods.

### `execute(data, options?)`

POSTs `data` as JSON to the configured `credentials.path` plus `options.path` (default `/`) and resolves to the
answer.

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `any` | The body |
| `options.path` | `string` | Path below `credentials.path` (default `/`) |
| `options.headers` | `Record<string, string>` | Extra headers; they win over the defaults |
| **Returns** | `Promise<any>` | The iFlow's answer; rejects with an [`IFlowError`](#iflowerror) |

Default headers: `Content-Type: application/json` and, on Cloud Foundry, `x-cf-space` (the space name).

```js
const result = await flow.execute({ OrderID: id }, { path: '/now', headers: { 'x-priority': 'high' } });
```

### `spawn(data, options?)`

Runs `execute` in the background (`cds.spawn`) and returns at once. A failure is logged on `cds.log('esi')` and passed
to `onError`; an `onError` that throws is logged too. Nothing is returned to the caller.

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `any` | The body |
| `options.path`, `options.headers` | | As for `execute` |
| `options.onError` | `(error: IFlowError) => void \| Promise<void>` | Called with the error of a failed call |
| **Returns** | `void` | |

> `cds.spawn` runs the call in its own root transaction, outside the request; to write from `onError` as the technical
> user, use `esi.user.tx(...)`.

```js
flow.spawn({ OrderID: id }, {
    onError: async (error) => {
        await esi.user.tx(orders, (tx) => tx.run(INSERT.into('SyncErrors').entries({ OrderID: id, Message: error.message, LogID: error.MPLId })));
    }
});
```

### `post` / `get`

The methods of CAP's REST client stay available: `post(path, data?, headers?)` and `get(path, headers?)`, without the
default headers and without the `IFlowError` conversion.

---

## `IFlowError`

The error of `execute` (and of `spawn`'s `onError`): an `Error` whose fields are own enumerable properties, so
`JSON.stringify(error)` keeps them all.

| Field | Content |
|-------|---------|
| `message` | The CAP message plus the response body (a JSON body serialized); line breaks and repeated spaces collapsed |
| `MPLId` | The message processing log ID: the `SAP_MessageProcessingLogID` response header (any case), else the ID named in the body (`The MPL ID for the failed message is : ...`) |
| `code` | The error code CAP's REST client reports |
| `status` | The HTTP status |
| `correlationId` | The correlation ID of the request |
| `config`, `request`, `response` | The HTTP client's request configuration, request and response |

Fields that are `undefined` are left out.

---

## Errors

| Situation | Error |
|-----------|-------|
| `connect.to()` without a name | `connect.to: a service name is required` |
| `iflow-https` entry without `credentials` | `'cds.requires.<name>' (kind 'iflow-https') needs 'credentials' (destination and path, or url)` |
| The iFlow answers an error / is not reachable | `execute` rejects with an `IFlowError`; `spawn` logs it and calls `onError` |

---

## Quick Usage Examples

```ts
import cds from '@sap/cds';
import { esi } from '@cap-ts/esi';
import type { IFlowService, IFlowError } from '@cap-ts/esi';

export class OrderService extends cds.ApplicationService {
    async init() {
        this.on('sync', async (req) => {
            const flow: IFlowService = await esi.connect.to('OrderSync');
            // wait for the answer
            const answer = await flow.execute({ ID: req.data.ID }).catch((error: IFlowError) =>
                req.reject(error.status ?? 502, error.message));
            // or fire and forget
            flow.spawn({ ID: req.data.ID }, { onError: (error: IFlowError) => cds.log('requests').error(error.MPLId, error.message) });
            return answer;
        });
        return super.init();
    }
}
```
