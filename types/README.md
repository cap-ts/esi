# @cap-ts/esi API Reference

> **Module:** `@cap-ts/esi` Package
> **Purpose:** `@cap-ts/esi` is a specialized API package designed for **Enterprise System Integration** within the [SAP Cloud Application Programming Model (CAP)](https://cap.cloud.sap/docs/) framework. It streamlines communication with remote systems and provides native support for service associations, requiring minimal configuration to achieve out-of-the-box connectivity.
> **Package Structure:** The package is organized into two primary modules:
> **`esi` Module**: Contains the core integration logic and foundational functions for system communication.
> **`utils` Module**: Provides a suite of generic utility functions to support common development tasks.

---

## Table of Contents

- [Exports](#exports)
- [Module: `esi`](#module-esi)
  - [`esi.user`: user context enrichment](#esiuser-user-context-enrichment)
- [Module: `utils`](#module-utils)
- [Quick Usage Examples](#quick-usage-examples)

---

## Exports

```js
module.exports = { esi, utils };
```

---

## Module: `esi`

Contains the core integration logic and foundational functions for system communication. Its core capabilities are outlined below:

| Feature | Module Name | Description |
| :--- | :--- | :--- |
| **Remote Communication** | `connect` | Streamlined protocols for connecting to external APIs. Simplifies connectivity with minimal configuration. It supports API of soap, odata v4/v2, rest, iflow-https. |
| **Service Implementation** | `impl` | Native support for remote service associations. Reduces boilerplate code for complex data models. |
| **Enriched Logging** | `log` | Pre-configured patterns for SAP environment logging. Accelerates development using CAP best practices. |
| **Core Functions** | `service`, `query` | Foundational functions for system-to-system messaging. Ensures consistent data handling across the enterprise. |
| **User Context** | `user` | Loads the logged-in user's business profile into `req.user.attr`, run by the esi CAP plugin for every request. Cached per user and tenant. |

### `esi.user`: user context enrichment

The esi CAP plugin registers a middleware after CAP's `auth` middleware. For every HTTP request it loads the
logged-in user's business profile from a provider, caches it per tenant and user, and merges it into
`req.user.attr`. The provider is, in this order of precedence: a module named in `cds.esi.user.provider`, a function
registered with `esi.user.provider(fn)`, or the one entity, unbound function or action annotated with
`@esi.user.provider`. Settings are in `cds.esi.user`; see the package README.

| API | Returns | Description |
| :--- | :--- | :--- |
| `esi.user.provider(fn)` | `void` | Registers the provider in code: `fn({ user, tenant, email })` returns the profile, or `null` / `undefined` when there is none. It runs in its own root transaction as the same user and tenant. |
| `esi.user.enrich(user, tenant?)` | `Promise<boolean>` | The same enrichment outside HTTP requests (`cds.spawn`, outbox, messaging, jobs). Changes `user.attr` in place; `true` when a profile was merged in. Never throws. `tenant` defaults to `cds.context.tenant`. |
| `esi.user.invalidate(userId?, tenant?)` | `void` | Drops the cached profile of one user (`tenant` defaults to `cds.context.tenant`), or the whole cache without arguments. |
| `esi.user.stats()` | `EsiUserStats` | `{ size, hits, misses, inFlight }` of the cache, for diagnostics. |

Types exported by the package:

| Type | Description |
| :--- | :--- |
| `EsiUserAttributes<T>` | `req.user.attr` after enrichment: the profile type `T` merged with the token attributes and `email`. |
| `EsiUserProvider` | The provider function of `esi.user.provider(fn)`. |


---

## Module: `utils`

Provides a suite of generic utility functions to support common development tasks. Refer to the [utils Documentation](./lib/utils/README.md) for more details.


---

## Quick Usage Examples

```js
const { cds } = require('@sap/cds');
const { esi, utils } = require('@cap-ts/esi');

// impl usage
const srvImpl = cds.service.impl(esi.impl.RemoteService);

// connect usage
const srv = esi.connect.to('<ServiceName>');
srv.run(SELECT.from('<EntityName').where('<Where Clause').columns('<Columns list'));

// log usage
const logger = esi.log('<LoggerName>');
const data = { a: 1, b: "Hello" };
logger.warn(esi.service.events.PreOn, req, "data", data); // [2026-01-01T12:32:20.197Z] [WARN] [<LoggerName>] [PreOn:READ:<Name of Service>.<Name of Entity>] - data | { a: 1, b: "Hello" }

// user usage: register a provider in code (or annotate an entity / function with @esi.user.provider)
esi.user.provider(async ({ user, tenant, email }) => ({ Profile: { Roles: ['Admin'] } }));
await esi.user.enrich(cds.context.user);                                  // e.g. in a cds.spawn job
esi.user.invalidate(userId);                                              // after a role change

// utils usage
const valid = await utils.date.isValid("2026-04-20");
const items = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
const grouped = utils.array.toGroupByPropertyName(items, "name");
const merged = utils.json.merge({ a: 1 }, { b: 2 });                    // { a: 1, b: 2 }

```
