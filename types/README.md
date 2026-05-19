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

// utils usage
const valid = await utils.date.isValid("2026-04-20");
const items = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
const grouped = utils.array.toGroupByPropertyName(items, "name");
const merged = utils.json.merge({ a: 1 }, { b: 2 });                    // { a: 1, b: 2 }

```
