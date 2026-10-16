# @cap-ts/esi User API Reference

> **Module:** `esi.user`  
> **Purpose:** User context enrichment — the logged-in user's business profile, loaded once per user and tenant,
> cached, and merged into `req.user.attr` for every request — plus transactions as a technical user.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Exports](#exports)
- [How it works](#how-it-works)
- [The provider](#the-provider)
  - [An annotated entity](#an-annotated-entity)
  - [An annotated function or action](#an-annotated-function-or-action)
  - [A function in code or a module](#a-function-in-code-or-a-module)
  - [Precedence](#precedence)
- [Settings: `cds.esi.user`](#settings-cdsesiuser)
- [user.provider(fn)](#userproviderfn)
- [user.enrich(user, tenant?)](#userenrichuser-tenant)
- [user.invalidate(userId?, tenant?)](#userinvalidateuserid-tenant)
- [user.stats()](#userstats)
- [user.technical()](#usertechnical)
- [user.tx(srv, fn?)](#usertxsrv-fn)
- [user.callerOrTechnical(srv, req)](#usercallerortechnicalsrv-req)
- [Types](#types)
- [Behavior](#behavior)
- [Quick Usage Examples](#quick-usage-examples)

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@sap/cds` | Middleware registration, `cds.User`, transactions, `cds.log('esi.user')` |

The enrichment runs in esi's CAP plugin; nothing has to be registered by the application.

---

## Exports

```js
const { esi } = require('@cap-ts/esi');
esi.user; // { provider, enrich, invalidate, stats, technical, tx, callerOrTechnical }
```

```ts
import { esi } from '@cap-ts/esi';
import type { EsiUserAttributes, EsiUserProvider } from '@cap-ts/esi';
```

---

## How it works

1. esi's plugin adds a middleware after CAP's `auth` middleware (unless `cds.esi.user.enabled` is `false`).
2. When the services are served, the provider is resolved once: a second `@esi.user.provider` or a broken provider
   module fails the startup instead of the first request.
3. For each HTTP request: the skip rules are checked, the login email is read from the authenticated user, the profile
   is looked up in the cache (key `tenant|user.id`) or loaded from the provider, and merged into `req.user.attr`.
4. Handlers and `@restrict` rules read it: `$user.email`, `$user.Department`, `req.user.attr.Groups`.

---

## The provider

Exactly one source of the profile.

### An annotated entity

esi runs `SELECT.one.from(<entity>)` as the logged-in user, so the entity's `@restrict` applies.

```cds
service DirectoryService {
    @readonly @odata.singleton
    @esi.user.provider
    @(restrict: [{ grant: 'READ', where: `Email = $user.email` }])
    entity Me as projection on Backend.Users { ... };
}
```

### An annotated function or action

An unbound function or action: `data` is sent as the event data, and the login email is written to the dotted path
`email`. For an array result the first element is used.

```cds
service DirectoryService {
    @esi.user.provider: {
        email : 'query.Email',
        data  : { query: { IncludeGroups: true } }
    }
    function findUser(query: DirectoryService.UserQuery) returns DirectoryService.UserInfo;
}
```

### A function in code or a module

```ts
import { esi } from '@cap-ts/esi';
esi.user.provider(async ({ user, tenant, email }) => ({ Department: 'Sales', Language: 'EN', Groups: [] }));
```

or a module named in `cds.esi.user.provider` (path relative to the project root) that exports the function.

### Precedence

`cds.esi.user.provider` module > `esi.user.provider(fn)` > annotation. More than one annotated definition (entities,
functions or actions, in any services) fails the startup with a message naming all of them, also when a provider is
registered in code or configured:
`[esi.user] Only one definition may be annotated with @esi.user.provider, found 2: A.findUser, A.Me`. An entity that only
inherits the annotation from the entity it projects on does not count.

Every provider runs in its own root transaction, as the same user and tenant. `null`, `undefined`, `[]` and a `403` /
`404` error mean "no business user".

---

## Settings: `cds.esi.user`

All optional; profiles apply. The values shown are the defaults.

```jsonc
"cds": {
  "esi": {
    "user": {
      "enabled": true,               // false: nothing is registered
      "provider": null,              // module path, see above
      "cache": {
        "ttl": 900000,               // ms a loaded profile is reused (15 min)
        "notFoundTtl": 60000,        // ms "no business user" is remembered (1 min)
        "maxEntries": 5000           // oldest-first eviction
      },
      "precedence": "token",         // "token": token claims win on name clashes; "provider": the profile wins
      "email": ["attr.email", "id"], // where to read the login email; a value counts only if it contains "@"
      "skip": {
        "anonymous": true,
        "privileged": true,
        "withoutEmail": true,        // technical users (client credentials) have no business user
        "paths": []                  // path segments, e.g. ["/health"]
      },
      "defaults": null,              // attributes every user gets when token and profile lack them
      "technical": {                 // the user of technical() / tx() / callerOrTechnical()
        "id": "technical",
        "roles": []
      }
    }
  }
}
```

| Setting | Effect |
|---------|--------|
| `enabled` | `false`: no middleware, no enrichment. |
| `provider` | Module path of the provider function (wins over code and annotation). |
| `cache.ttl` / `cache.notFoundTtl` / `cache.maxEntries` | Lifetime of a found profile / of "no business user"; size of the cache. |
| `precedence` | `token`: `{ ...profile, ...tokenAttr, email }`; `provider`: the two spreads swapped. `email` is always the login email. |
| `email` | Paths on the authenticated user where the login email is read; the first value with an `@` wins. |
| `skip.*` | Users and paths that are not enriched (they still get `defaults`). |
| `defaults` | Fills every attribute that neither the token nor the profile has (`undefined` / `null` / `''`), nested objects key by key, for every handled user (enriched, not found, skipped). E.g. `{ "Language": "EN" }`, so a `@restrict` on it resolves for technical users too. |
| `technical` | `{ id, roles }` of the technical user. |

---

## `user.provider(fn)`

Registers the provider in code. A module in `cds.esi.user.provider` takes precedence over it; it takes precedence over
an `@esi.user.provider` annotation.

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `EsiUserProvider` | `({ user, tenant, email }) => profile \| null \| undefined` (sync or async) |
| **Returns** | `void` | Throws a `TypeError` when `fn` is not a function |

---

## `user.enrich(user, tenant?)`

The same enrichment outside HTTP requests: `cds.spawn`, the outbox, messaging, jobs. Changes `user.attr` in place;
never throws.

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `cds.User` | The user to enrich |
| `tenant` | `string` | Default: `cds.context.tenant` |
| **Returns** | `Promise<boolean>` | `true` when a profile was merged in |

```js
cds.spawn({ user: new cds.User({ id: 'alice', attr: { email: 'alice@example.com' } }) }, async () => {
    await esi.user.enrich(cds.context.user);
    // the profile's attributes are in cds.context.user.attr now
});
```

---

## `user.invalidate(userId?, tenant?)`

Drops the cached profile of one user, or the whole cache without arguments (e.g. after the profile changed).

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user id (`req.user.id`); omitted: everything |
| `tenant` | `string` | Default: `cds.context.tenant` |
| **Returns** | `void` | |

---

## `user.stats()`

| **Returns** | `{ size, hits, misses, inFlight }` |
|---|---|

`size`: entries in the cache (found and not found); `hits`: lookups answered from the cache or from a running lookup;
`misses`: lookups that called the provider; `inFlight`: provider calls running now.

---

## `user.technical()`

The technical user of `cds.esi.user.technical`: a new `cds.User` with that id and roles and no attributes, on every
call. For reads and writes the caller may not do itself, or work without a caller.

| **Returns** | `cds.User` |
|---|---|

> A technical user has no attributes: a `@restrict` condition on `$user.<attr>` denies unless `defaults` fill it.

---

## `user.tx(srv, fn?)`

A transaction on a service as the technical user.

| Parameter | Type | Description |
|-----------|------|-------------|
| `srv` | CAP service | The service |
| `fn` | `(tx) => Promise<any>` | Optional work; it runs in the transaction, which is committed (or rolled back) with it |
| **Returns** | `any` | With `fn`: the promise of its result; without: the transaction |

```js
const requests = await cds.connect.to('RequestService');
await esi.user.tx(requests, (tx) => tx.run(UPDATE('Requests', id).set({ Status: 'A' })));
const tx = esi.user.tx(requests); // manage it yourself: await tx.commit()
```

---

## `user.callerOrTechnical(srv, req)`

A transaction on a service as the caller when it is a business user (`req.user.attr.email` is set), else as the
technical user (a technical client, a background job).

| Parameter | Type | Description |
|-----------|------|-------------|
| `srv` | CAP service | The service |
| `req` | `object` | The request (optional) |
| **Returns** | `any` | `srv.tx(req)` or `esi.user.tx(srv)` |

---

## Types

| Type | Description |
|------|-------------|
| `EsiUserAttributes<T>` | Type of `req.user.attr` after enrichment: your profile shape `T` plus `email` and the token attributes. E.g. `req.user.attr as EsiUserAttributes<{ Department: string; Groups: string[] }>`. |
| `EsiUserProvider` | `(context: { user, tenant?, email? }) => profile \| null \| undefined` (or a promise of it). `user` is read only. |

---

## Behavior

- `user.attr` is replaced on the existing user object; `cds.context.user` is never replaced, so `user.authInfo` (token
  forwarding, principal propagation) keeps working.
- The lookup email always comes from the authenticated user, never from request headers or request data.
- Cached profiles are frozen; every request gets its own deep copy. Concurrent requests of one user share one lookup.
  Errors other than 403 / 404 are not cached, so the next request tries again.
- A request never fails because of the enrichment: errors are logged and the request continues with the token
  attributes. A `$batch` request is enriched once for all its sub-requests.
- Logging: `cds.log('esi.user')`; user id and email only at `debug`, outcomes at `info` / `warn` / `error`.

---

## Quick Usage Examples

```ts
import cds from '@sap/cds';
import { esi } from '@cap-ts/esi';
import type { EsiUserAttributes } from '@cap-ts/esi';

type UserInfo = { Department: string; Groups: string[] };

export class OrderService extends cds.ApplicationService {
    async init() {
        this.before('READ', 'Orders', (req) => {
            const attr = req.user.attr as EsiUserAttributes<UserInfo>;
            if (!attr.Groups?.includes('ORDER_VIEWER')) return req.reject(403);
        });
        this.on('archive', async (req) => {
            // the caller may not write the archive itself
            const archive = await cds.connect.to('ArchiveService');
            return esi.user.tx(archive, (tx) => tx.run(INSERT.into('Archive').entries(req.data)));
        });
        return super.init();
    }
}
```
