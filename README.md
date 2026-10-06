
[![Version npm](https://img.shields.io/npm/v/@cap-ts/esi.svg)](https://www.npmjs.com/package/@cap-ts/esi)

# @cap-ts/esi
**Remote Service Integration for SAP CAP Applications (Node.js)**

## 📦 About

`@cap-ts/esi` is an API package for **Enterprise System Integration** based on [SAP CAP (SAP Cloud Application Programming Model)](https://cap.cloud.sap/docs/). It streamlines communication with remote systems and natively supports service associations — out of the box, with minimal configuration.

> ⚠️ **Critical upgrade required**
>
> **Important: Upgrade to version 1.9 or higher immediately**
>
> A critical fix is included only in version **1.9** and later. Versions below **1.9** will not work correctly and are no longer supported.
>
> Please upgrade to version **1.9** as soon as possible to ensure proper functionality and continued support.

Refer to the [official documentation](https://github.com/cap-ts/esi/wiki) to get started.

## 🧰 Requirements & Setup

Explore our [sample application](https://github.com/cap-ts/Samples/tree/main/esi) for a practical implementation of this package. It demonstrates integration patterns, service bindings, and setup essentials.

Additional documentation pages will be added soon.

## 🚀 Installation

The package is available on npm and can be installed as follows:

```bash
npm install @cap-ts/esi@latest
```

## 🛠️ Support & Feedback

We welcome your feedback, feature requests, and bug reports!

Submit an issue via our [GitHub Issues Tracker](https://github.com/cap-ts/esi/issues). Community feedback are appreciated and help shape the project’s evolution.

## 📄 License

This package is provided under the terms of the **SAP-Code-World** [Usage License Agreement](LICENSE).

### Licence token

Using `@cap-ts/esi` in production needs a licence token from SAP-Code-World. The token is a signed text string. The
package checks it when it is loaded (`require('@cap-ts/esi')`), offline: no call home, no network access.

Set it as `cds.capts.license`. One setting serves every `@cap-ts` package. Keep it out of source control, like any
other credential:

| Where | How |
| --- | --- |
| Environment variable (Cloud Foundry, Kyma, local shell) | `CDS_CAPTS_LICENSE=<token>`, for example `cf set-env <app> CDS_CAPTS_LICENSE <token>` or an `mta.yaml` `properties` entry |
| Kubernetes secret | mount it as `<CDS_CONFIG root>/capts/license` (see CAP's `CDS_CONFIG` directory mode) |
| Local development | `.cdsrc-private.json`: `{ "capts": { "license": "<token>" } }` |

A licence covers this package only, selected `@cap-ts` packages, or every `@cap-ts` package. Several tokens (for
example one per package) go into the same setting, separated by spaces or commas, or as a JSON array; the best one for
each package is used.

What happens:

| Licence state | Production | Not production |
| --- | --- | --- |
| Valid | `info` log: licensee, expiry date, licence ID | same |
| Expires within 30 days | `warn` log | same |
| Expired, inside the grace period (30 days unless your licence says otherwise) | `error` log; esi keeps working | same |
| Expired after the grace period, invalid, not granted for this package, or not set | the application does not start: error `CAPTS_LICENSE_EXPIRED`, `CAPTS_LICENSE_INVALID` or `CAPTS_LICENSE_MISSING` with the reason | `warn` log; the package runs in evaluation mode |

- **Production** means the cds profile `production` (`NODE_ENV=production`, which the Cloud Foundry Node.js buildpack
  sets) or running on Cloud Foundry.
- esi reads its own configuration from the application: `cds.esi` (or `esi`) in `package.json`, or `.esisrc.json`.
  Without it esi does not load.
- User-context enrichment (`bRefreshUserContext` of `impl.LocalService` / `impl.RemoteService`) is a licensed
  feature: it is on when your licence says so.
- A licence can be bound to Cloud Foundry org or space GUIDs. It is then only valid in those orgs or spaces.
- A running application is never stopped. Renewing means setting the new token and restarting the app.

© 2025 **SAP-Code-World**. All rights reserved.