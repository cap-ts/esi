# @cap-ts/esi Request Helpers API Reference

> **Module:** `esi.request`  
> **Purpose:** Helpers for CAP requests in handlers: HTTP headers, the user a request acts for, collected errors, translated
> messages, error details for clients, and a guard that turns a failing step into a rejection.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Exports](#exports)
- [Types](#types)
- [request.headers(req)](#requestheadersreq)
- [request.actingUser(req, header)](#requestactinguserreq-header)
- [request.addError(req, log, error, logText?)](#requestadderrorreq-log-error-logtext)
- [request.failOnErrors(req)](#requestfailonerrorsreq)
- [request.translate(bundle, message, args?, code?)](#requesttranslatebundle-message-args-code)
- [request.errorDetails(error, translateFn?)](#requesterrordetailserror-translatefn)
- [request.guard(req, fn, options?)](#requestguardreq-fn-options)
- [Quick Usage Examples](#quick-usage-examples)

---

## Dependencies

None. The functions only work on the request, logger and text bundle objects they get.

---

## Exports

```js
const { esi } = require('@cap-ts/esi');
esi.request; // { headers, actingUser, addError, failOnErrors, translate, errorDetails, guard }
```

```ts
import { esi } from '@cap-ts/esi';
import type { EsiMessage, EsiErrorDetail } from '@cap-ts/esi';
```

---

## Types

| Type | Shape | Used by |
| --- | --- | --- |
| `EsiMessage` | `{ message: string, code?: string }` | `translate`, the `translateFn` of `errorDetails` |
| `EsiErrorDetail` | `{ message: string, code?: string, target?: string, status?: number }` | `errorDetails` |
| text bundle | `{ at(key, args?) }`: answers the key itself (or `undefined`) when it has no text, as `cds.i18n.bundle4(...)` / `cds.i18n.messages` do | `translate` |
| logger | `{ error(...args) }`, e.g. `cds.log('orders')` | `addError`, `guard` |

---

## `request.headers(req)`

The HTTP headers of a request: those of the HTTP request (`req.http.req.headers`), else `req.headers` (a request sent
from code), else none. Header names are in lower case.

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | `object` | The CAP request (or any object with `http.req.headers` / `headers`) |
| **Returns** | `Record<string, string>` | The headers, `{}` without any |

```js
const sRequestId = esi.request.headers(req)['x-request-id'];
```

---

## `request.actingUser(req, header)`

The user a request acts for: the value of the application's delegation header, else the caller's email
(`req.user.attr.email`). The header name is the application's own; esi has no default.

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | `object` | The CAP request |
| `header` | `string` | The header name, lower case (e.g. `x-acting-user`) |
| **Returns** | `string \| undefined` | The user (id or email, as the application defines), `undefined` without one |

> **Security:** the header is client input. Check that the caller may act for that user before trusting it.

```js
const sUser = esi.request.actingUser(req, 'x-acting-user'); // header value, else req.user.attr.email
```

---

## `request.addError(req, log, error, logText?)`

Collects an error on the request (`req.error`, the request goes on) and logs it: with `logText` when given (e.g. a more
detailed text than the client gets), else with the error's message. Reject later with
[`failOnErrors`](#requestfailonerrorsreq), so the client gets every error at once.

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | `object` | The CAP request |
| `log` | logger | The caller's logger (`error` is called with `'ERROR'` and the text) |
| `error` | `{ message, target?, status?, code?, args? }` | The error for the client (`message` may be a message key) |
| `logText` | `string` | Optional text for the log |
| **Returns** | `void` | |

---

## `request.failOnErrors(req)`

Rejects the request with the errors collected so far (`req.errors`), if there are any. Does nothing otherwise (also
without a request).

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | `object` | The CAP request |
| **Returns** | `void` | |

```js
if (!data.Name) esi.request.addError(req, LOG, { status: 400, message: 'ASSERT_MANDATORY', target: 'Name' });
if (data.Amount < 0) esi.request.addError(req, LOG, { status: 400, message: 'AMOUNT_POSITIVE', target: 'Amount' });
esi.request.failOnErrors(req); // one 400 with both errors (MULTIPLE_ERRORS)
```

---

## `request.translate(bundle, message, args?, code?)`

A message for the client. A message key that has a text in the bundle is translated, and the key becomes the code; any
other text is kept as it is, with `code`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `bundle` | text bundle | E.g. `cds.i18n.messages` or `cds.i18n.bundle4('messages')` |
| `message` | `string` | A message key or a text |
| `args` | `unknown[]` | Optional arguments of the message (`{0}`, `{1}`, ...) |
| `code` | `string` | Optional code of a text that is no key |
| **Returns** | `EsiMessage` | `{ message, code }` |

```js
esi.request.translate(cds.i18n.messages, 'ASSERT_MANDATORY');   // { message: 'Provide the missing value.', code: 'ASSERT_MANDATORY' }
esi.request.translate(cds.i18n.messages, 'Backend down', [], 'E1'); // { message: 'Backend down', code: 'E1' }
```

---

## `request.errorDetails(error, translateFn?)`

The errors of a failed call as entries for a client: one per entry of `error.details` (CAP's `MULTIPLE_ERRORS`, e.g. of
a deep write or of collected `req.error`s), else one for the error itself. Each message goes through `translateFn`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `error` | `any` | The error (an `Error`, a CAP error object, or a string) |
| `translateFn` | `(message, args?, code?) => EsiMessage` | Optional; default: the message as it is, with its code |
| **Returns** | `EsiErrorDetail[]` | `[{ message, code, target, status }]`; `status` is the error's `status`, else `statusCode` |

```js
try {
    await srv.run(INSERT.into(Orders).entries(order));
} catch (e) {
    const details = esi.request.errorDetails(e, (m, a, c) => esi.request.translate(cds.i18n.messages, m, a, c));
    // [{ target: '_Items[0]/Product', message: 'Provide the missing value.', code: 'ASSERT_MANDATORY', status: 400 }, ...]
}
```

---

## `request.guard(req, fn, options?)`

Runs a step of a handler (a check, a read) and rejects the request when it throws, instead of letting the error escape
as a 500. The rejection carries the error's `status` (else `statusCode`, else `options.status`, default 500), its
message (else `options.message`), `code` and `target`; the message is logged on `options.log`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | `object` | The CAP request |
| `fn` | `() => T \| Promise<T>` | The step |
| `options.log` | logger | Optional; logs `'ERROR'` and the message |
| `options.status` | `number` | Status of an error without one (default 500) |
| `options.message` | `string` | Message of an error without one |
| **Returns** | `Promise<T \| undefined>` | The step's result; `undefined` when it failed (the request is rejected) |

```js
this.before('READ', Orders, (req) =>
    esi.request.guard(req, () => checkRegionAccess(req), { log: LOG, status: 403, message: 'NO_ACCESS' }));
```

---

## Quick Usage Examples

```js
const cds = require('@sap/cds');
const { esi } = require('@cap-ts/esi');
const LOG = cds.log('orders');
const R = esi.request;

module.exports = class OrderService extends cds.ApplicationService {
    async init() {
        this.before('*', 'Orders', (req) => R.guard(req, () => checkAccess(req), { log: LOG, status: 403 }));

        this.before('CREATE', 'Orders', (req) => {
            if (!req.data.Product) R.addError(req, LOG, { status: 400, message: 'ASSERT_MANDATORY', target: 'Product' });
            if (req.data.Amount <= 0) R.addError(req, LOG, { status: 400, message: 'AMOUNT_POSITIVE', target: 'Amount' });
            R.failOnErrors(req);
        });

        this.on('importOrders', async (req) => {
            const results = [];
            for (const order of req.data.orders) {
                try {
                    results.push(await this.run(INSERT.into('Orders').entries(order)));
                } catch (e) {
                    results.push({ ID: order.ID, error: R.errorDetails(e, (m, a, c) => R.translate(cds.i18n.messages, m, a, c)) });
                }
            }
            return results;
        });
        return super.init();
    }
};
```
