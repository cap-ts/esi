# @cap-ts/esi Utilities API Reference

> **Module:** `utils`  
> **Purpose:** Core utility belt — dates, XML parsing, JSON manipulation, array operations, SAP user formats, wildcards, run-once functions, and UUID generation/parsing.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Exports](#exports)
- [Class: `date`](#class-date)
  - [date.isValid(sDate)](#dateisvalidsdate)
  - [Formatting and ranges](#date-formatting-and-ranges)
- [Class: `xml`](#class-xml)
  - [xml.isValid(oXML)](#xmlisvalidoxml)
- [Class: `json`](#class-json)
  - [json.isValid(oJson)](#jsonisvalidojson)
  - [json.copy(oJson)](#jsoncopyojson)
  - [json.replace(oJson, sOldValue, sNewValue, oEvaluate?)](#jsonreplaceojson-soldvalue-snewvalue-oevaluate)
  - [json.getValue(oJson, sPropertyPath)](#jsongetvalueojson-spropertypath)
  - [json.unique(oNestedArray)](#jsonuniqueonnestedarray)
  - [json.order(oJson, oKeyOrder)](#jsonorderojson-okeyorder)
  - [json.projection(oJson, oColumns, bHasAssociattion?)](#jsonprojectionojson-ocolumns-bhasassociattion)
  - [json.map(oJson, oMap)](#jsonmapojson-omap)
  - [json.merge(oJson1, oJson2)](#jsonmergeojson1-ojson2)
  - [json.flat(oJson, sFlattenedProperty)](#jsonflatojson-sflattenedproperty)
  - [json.stripUndefined(oSourceJson)](#jsonstripundefinedosourcejson)
  - [Parsing, columns and metadata](#json-parsing-columns-and-metadata)
- [Class: `array`](#class-array)
  - [array.add(oArray, oItem)](#arrayaddoarray-oitem)
  - [array.topN(oSortedArray, iTop)](#arraytopnosortedarray-itop)
  - [array.flat(oArray, sFlattenedProperty)](#arrayflatoarray-sflattenedproperty)
  - [array.unique(oArray)](#arrayuniqueoarray)
  - [array.uniqueBy(oArray, sPropertyName)](#arrayuniquebyoarray-spropertyname)
  - [array.order(oArray, oOrder)](#arrayorderoarray-oorder)
  - [array.projection(oArray, oColumns, bHasAssociattion?)](#arrayprojectionoarray-ocolumns-bhasassociattion)
  - [array.map(oArray, oMap)](#arraymapoarray-omap)
  - [array.sort(oArray, oOrderBy)](#arraysortoarray-oorderby)
  - [array.filter(oArray, oFilterCondition)](#arrayfilteroarray-ofiltercondition)
  - [array.hasElement(oArray, oElement)](#arrayhaselementoarray-oelement)
  - [array.toArray(oArray)](#arraytoarrayoarray)
  - [array.toDisArray(oArray)](#arraytodisarrayoarray)
  - [array.toInterleavedArray(oArray, oElement)](#arraytointerleavedarray-oarray-oelement)
  - [array.toArrayProjection(oArray, sProjectionFieldName)](#arraytoarrayprojectionoarray-sprojectionfieldname)
  - [array.findProperty(oArray, sProjectionFieldName)](#arrayfindpropertyoarray-sprojectionfieldname)
  - [array.toGroupByPropertyName(oArray, sPropertyName)](#arraytogroupbypropertynameoarray-spropertyname)
  - [array.toGroupByPropertyList(oArray, oPropertyList)](#arraytogroupbypropertylistoarray-opropertylist)
  - [Joining, grouping and chunking](#array-joining-grouping-and-chunking)
- [Class: `sap`](#class-sap)
- [Class: `string`](#class-string)
- [Class: `fn`](#class-fn)
- [Class: `UUID`](#class-uuid)
  - [constructor()](#constructor)
  - [converse(oJsonData)](#converseoJsondata)
  - [inverse(sUUID)](#inversesuuid)

---

## Dependencies

| Package  | Purpose                                         |
|----------|-------------------------------------------------|
| `xml2js` | XML string parsing and validation               |
| `uuid`   | UUID format validation                          |
| `lodash` | Deep merge, orderBy, uniqWith, and isEqual      |

---

## Exports

```js
module.exports = { date, xml, json, array, sap, string, fn, UUID };
```

---

## Class: `date`

Date-related validation helpers. All methods are `static`.

### `date.isValid(sDate)`

| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `sDate`   | `string` | Date string to validate              |
| **Returns** | `Promise<boolean>` | `true` if valid date    |

**Behavior:** Parses the string via `new Date()` and verifies the result is a real Date (not `NaN`). Logs errors via the framework logger.

```js
await date.isValid("2026-04-20");    // true
await date.isValid("not-a-date");    // false
```

---

### Date formatting and ranges

All dates are handled in UTC, so a date-only string (`yyyy-MM-dd`) keeps its day in every time zone.

| Function | Result |
| --- | --- |
| `date.PATTERN` | `ISO` `yyyy-MM-dd`, `BASIC` `yyyyMMdd` (SAP DATS), `DMY` `dd-MM-yyyy`, `TIMESTAMP` `yyyy-MM-ddTHH:mm:ss` |
| `date.format(date, pattern = PATTERN.ISO)` | The date with the tokens `yyyy`, `MM`, `dd`, `HH`, `mm`, `ss` replaced (zero-padded, UTC); other characters kept. `null` for no or an invalid date. |
| `date.formatFields(rowOrRows, fields, pattern = PATTERN.ISO)` | Formats the fields of a row or of every row in place; `null` / `undefined` values stay. |
| `date.isDateString(value)` | Synchronous check of the notation: ISO date-time, `yyyy-MM-dd`, `dd/MM/yyyy` or `MM/dd/yyyy`. |
| `date.addMonths(months, date = now)` | A new date, months added (negative: subtracted), at local midnight. |
| `date.weekOf(date = now)` | `{ Low, High }`: Monday and Sunday of the week (`yyyy-MM-dd`). |
| `date.calendarMonth(yyyyMM = current month)` | `{ Low, High, YearMonth }`: Monday of the first and Sunday of the last week of the month. |
| `date.monthRange('yyyy-MM-dd...')` | `[first, last]` day of the month; `undefined` for another notation. |
| `date.days({ Low, High })` | Every day of the range (both included) as dates at UTC midnight. |

```js
date.format('2026-04-05T08:05:09Z', date.PATTERN.DMY);  // '05-04-2026'
date.calendarMonth('202604');                           // { Low: '2026-03-30', High: '2026-05-03', YearMonth: '202604' }
date.monthRange('2024-02-10');                          // ['2024-02-01', '2024-02-29']
```

---

## Class: `xml`

XML parsing and validation helpers. All methods are `static`.

### `xml.isValid(oXML)`

| Parameter | Type             | Description                 |
|-----------|------------------|-----------------------------|
| `oXML`    | `string\|object` | XML content to validate     |
| **Returns** | `Promise<boolean>` | `true` if well-formed XML |

**Behavior:** Uses `xml2js.Parser.parseStringPromise` to attempt parsing. Logs the parsed result on success and errors on failure.

```js
await xml.isValid("<root><item>val</item></root>"); // true
await xml.isValid("not xml");                       // false
```

---

## Class: `json`

Comprehensive JSON/object manipulation utilities. All methods are `static`.

### `json.isValid(oJson)`

Checks if the input can be parsed as JSON via `JSON.parse`.

| Parameter | Type             | Returns    |
|-----------|------------------|------------|
| `oJson`   | `string\|object` | `boolean`  |

---

### `json.copy(oJson)`

Creates a deep clone using `structuredClone`. Falls back to returning the original reference if the input isn't valid JSON.

| Parameter | Type     | Returns  |
|-----------|----------|----------|
| `oJson`   | `object` | `object` |

---

### `json.replace(oJson, sOldValue, sNewValue, oEvaluate?)`

Recursively walks objects and arrays, replacing all string occurrences of `sOldValue` with `sNewValue`. **Mutates the input in place.**

| Parameter    | Type     | Default     | Description                                              |
|-------------|----------|-------------|----------------------------------------------------------|
| `oJson`      | `object\|Array` | — | Target structure                                          |
| `sOldValue`  | `string` | —           | Substring to find                                        |
| `sNewValue`  | `string` | —           | Replacement substring                                    |
| `oEvaluate`  | `object` | `undefined` | Optional context; when set, resolved string is evaluated as a property path via `json.getValue` |

```js
const data = { msg: "Hello {{name}}", nested: { msg: "Hi {{name}}" } };
json.replace(data, "{{name}}", "World");
// data → { msg: "Hello World", nested: { msg: "Hi World" } }
```

---

### `json.getValue(oJson, sPropertyPath)`

Resolves a dot-separated property path to its value.

| Parameter        | Type     | Returns |
|-----------------|----------|---------|
| `oJson`          | `object` | `*`     |
| `sPropertyPath`  | `string` | Value or `undefined` |

```js
json.getValue({ a: { b: { c: 42 } } }, "a.b.c"); // 42
json.getValue({ a: 1 }, "x.y");                    // undefined
```

---

### `json.unique(oNestedArray)`

Flattens a nested array and removes duplicates using JSON serialization for deep equality.

| Parameter       | Type    | Returns |
|----------------|---------|---------|
| `oNestedArray`  | `any[]` | `any[]` |

---

### `json.order(oJson, oKeyOrder)`

Returns a new object with keys reordered: specified keys first, then the rest.

| Parameter   | Type       | Returns  |
|------------|------------|----------|
| `oJson`     | `object`   | `object` |
| `oKeyOrder` | `string[]` | —        |

```js
json.order({ c: 3, a: 1, b: 2 }, ["a", "b"]); // { a: 1, b: 2, c: 3 }
```

---

### `json.projection(oJson, oColumns, bHasAssociattion?)`

Filters an object to include only the specified properties.

| Parameter          | Type       | Default | Description                                  |
|-------------------|------------|---------|----------------------------------------------|
| `oJson`            | `object`   | —       | Source object                                |
| `oColumns`         | `string[]` | —       | Property names to keep                       |
| `bHasAssociattion` | `boolean`  | `false` | Also include keys prefixed with column names |

---

### `json.map(oJson, oMap)`

Creates a new object by mapping source properties via a definition object.

| Parameter | Type     | Description                                           |
|-----------|----------|-------------------------------------------------------|
| `oJson`   | `object` | Source data                                           |
| `oMap`    | `object` | `{ targetKey: "source.path" }` mapping definition     |

```js
json.map({ user: { name: "John" } }, { fullName: "user.name" }); // { fullName: "John" }
```

---

### `json.merge(oJson1, oJson2)`

Deep-merges two objects using Lodash `_.merge`. Returns `{}` if either argument is not an object.

---

### `json.flat(oJson, sFlattenedProperty)`

Promotes a nested property's contents to the top level of the object.

```js
json.flat({ id: 1, details: { name: "A", desc: "B" } }, "details");
// { id: 1, name: "A", desc: "B" }
```

---

### `json.stripUndefined(oSourceJson)`

Removes properties where the value is `undefined`, `null`, or an empty string.

---

### JSON parsing, columns and metadata

| Function | Result |
| --- | --- |
| `json.tryParse(text)` | The parsed value; `undefined` for a value that is not JSON text (never throws). |
| `json.isPrimitive(value)` | `true` for `string`, `number`, `boolean`, `null`, `undefined` and `Date`. |
| `json.toColumns(object, separator = '_')` | One level of columns: nested keys joined (`response_status`), arrays as JSON text, non-JSON values dropped. An `Error`'s own enumerable properties are kept. |
| `json.label(name)` | A label from a field name: last segment of a dotted path, camelCase split (`'Order.ShipToCity'` -> `'Ship To City'`). |
| `json.metadata(rows, labelFn = json.label)` | `{ properties: [{ name, type, label }] }`: every field once, its EDM type from its first value (`sap.edmType`). Pass a `labelFn` for translated labels. |

```js
json.toColumns({ message: 'Timeout', response: { status: 408 } }); // { message: 'Timeout', response_status: 408 }
json.metadata([{ ID: 1, Name: 'A' }], (name) => i18n.at(name) ?? json.label(name));
```

---

## Class: `array`

Array operations with automatic fallback to the `json` class for single-object inputs. All methods are `static`.

### `array.add(oArray, oItem)`

Appends item(s) to an array. Accepts single values or arrays.

---

### `array.topN(oSortedArray, iTop)`

Returns the first `iTop` elements via `Array.slice`.

---

### `array.flat(oArray, sFlattenedProperty)`

Flattens a nested property for each element. Delegates to `json.flat` for single objects.

---

### `array.unique(oArray)`

Deduplicates using Lodash `_.uniqWith` with `_.isEqual` for deep comparison.

---

### `array.uniqueBy(oArray, sPropertyName, oOptions?)`

Keeps the first element per value of a property (e.g. one row per key when a backend answers an entry twice). Elements
without the property (`undefined` / `null`) are all kept. A value that is not an array is returned as is. With
`{ last: true }` the last element per value wins (e.g. the rows of two reads, the later read wins), at the position of
the first one.

```js
array.uniqueBy([{ ID: 1, a: 1 }, { ID: 1, a: 2 }, { ID: 2 }], 'ID');                 // [{ ID: 1, a: 1 }, { ID: 2 }]
array.uniqueBy([{ ID: 1, a: 1 }, { ID: 1, a: 2 }, { ID: 2 }], 'ID', { last: true }); // [{ ID: 1, a: 2 }, { ID: 2 }]
```

---

### `array.order(oArray, oOrder)`

Reorders keys for every object in the array per the specified key order.

---

### `array.projection(oArray, oColumns, bHasAssociattion?)`

Projects each element to only contain the listed columns.

---

### `array.map(oArray, oMap)`

Applies a property mapping to every element in the array.

---

### `array.sort(oArray, oOrderBy)`

Multi-column sort with type coercion support.

| `oOrderBy` entry | Property | Type | Description |
|---|---|---|---|
| `ref` | `string[]` | Required | Column path |
| `sort` | `'asc'\|'desc'` | Optional (default `'asc'`) | Sort direction |
| `function` | `'Date'\|'parseFloat'` | Optional | Value coercion |

```js
array.sort(items, [
  { ref: ["date"], sort: "desc", function: "Date" },
  { ref: ["price"], sort: "asc", function: "parseFloat" }
]);
```

---

### `array.filter(oArray, oFilterCondition)`

Filters array elements based on a list of filter conditions (AND logic).

**FilterCondition:**
| Property | Type | Description |
|---|---|---|
| `name` | `string` | Property name to filter by |
| `op` | `'='\|'!='\|'>'\|'<'\|'>='\|'<='` | Comparison operator |
| `value` | `string\|number\|boolean` | Value to compare against |

```js
array.filter(employees, [
  { name: "age", op: ">=", value: 30 },
  { name: "dept", op: "=", value: "Engineering" }
]);
```

---

### `array.hasElement(oArray, oElement)`

Returns `true` if the element is found (strict `===` via `Array.includes`).

---

### `array.toArray(value)`

Normalizes any value into an array: `undefined` → `[]`, non-array → `[value]`, array → as-is.

---

### `array.toDisArray(oArray)`

Unwraps a single-element array to its value. Multi-element arrays pass through.

---

### `array.toInterleavedArray(oArray, oElement)`

Inserts a separator element between consecutive items.

```js
array.toInterleavedArray(["a", "b", "c"], "|"); // ["a", ["|"], "b", ["|"], "c"]
```

---

### `array.toArrayProjection(oArray, sProjectionFieldName)`

Extracts a single field from each element into a flat array.

```js
array.toArrayProjection([{ id: 1 }, { id: 2 }], "id"); // [1, 2]
```

---

### `array.findProperty(oArray, sProjectionFieldName)`

Recursively searches nested structures for all values of a named property. Returns a deduplicated array.

---

### `array.toGroupByPropertyName(oArray, sPropertyName)`

Groups elements into an object keyed by a single property's value.

```js
array.toGroupByPropertyName(
  [{ type: "A", v: 1 }, { type: "B", v: 2 }, { type: "A", v: 3 }],
  "type"
);
// { A: [{...}, {...}], B: [{...}] }
```

---

### `array.toGroupByPropertyList(oArray, oPropertyList)`

Groups elements by a composite key derived from multiple properties (joined with `##`). Supports dot-notation paths and recursive deep property lookup.

```js
array.toGroupByPropertyList(data, ["region", "details.category"]);
// { "US##Electronics": [...], "EU##Clothing": [...] }
```

---

### Array joining, grouping and chunking

| Function | Result |
| --- | --- |
| `array.semiJoin(left, right, key, rightKey = key)` | The elements of `left` whose `key` value occurs in `right` (e.g. headers that have items). |
| `array.bestBy(rows, key, rankFn)` | The best element per `key` value: `rankFn(row)` returns a tuple, compared element by element (higher wins; a tie keeps the earlier). Rows without a value are dropped. |
| `array.sumBy(rows, dimensions, measures)` | One row per combination of dimension values (trimmed text), the measures summed; a measure given as text stays text. |
| `array.nest(rows, levels)` | A tree from flat rows: per level `{ key, fields, children? }`, `fields` as names or target -> source map, `children` the property of the next level. |
| `array.chunkByLength(values, buildFn, maxLength)` | Chunks whose text `buildFn(chunk)` stays shorter than `maxLength` (e.g. a URL); `undefined` when not even one value fits. |

```js
array.bestBy(prices, 'ProductID', (r) => [r.Valid ? 1 : 0, r.ValidFrom ?? '']);
array.sumBy(rows, ['Region', 'Channel'], ['Amount']);
array.nest(rows, [
    { key: 'OrderID', fields: ['OrderID', 'Customer'], children: 'Items' },
    { key: 'ItemID', fields: { ID: 'ItemID', Quantity: 'Quantity' } }
]);
array.chunkByLength(codes, (a) => `${path}?$filter=${a.map((c) => `Code eq '${c}'`).join(' or ')}`, 2048);
```

---

## Class: `sap`

SAP-standard value lists. All methods are `static`.

### `sap.decimalNotation(sCode)`

The decimal notation of an SAP user (`DecimalFormatCode`, SU01 "Decimal Notation") as `{ decimal, thousand }`:
blank or any other code `1.234.567,89` (`,` / `.`), `X` `1,234,567.89` (`.` / `,`), `Y` `1 234 567,89` (`,` / space).

```js
sap.decimalNotation('X'); // { decimal: '.', thousand: ',' }
```

| Function | Result |
| --- | --- |
| `sap.dateFormat(code)` | The date format of an SAP user (`DateFormatCode`): `1` `DD.MM.YYYY`, `2` `MM/DD/YYYY`, `3` `MM-DD-YYYY`, `4` `YYYY.MM.DD`, `5` `YYYY/MM/DD`, `6` `YYYY-MM-DD`, `7`-`9` `GYY.MM.DD` / `GYY/MM/DD` / `GYY-MM-DD`; any other code `YYYY/MM/DD`. |
| `sap.timeFormat(code)` | The time format of an SAP user (`TimeFormatCode`): `1` / `3` `hh:mm:ss A`, `2` / `4` `hh:mm:ss a`, otherwise `HH:mm:ss`. |
| `sap.edmType(value)` | The OData EDM type of a value: `Edm.Int32`, `Edm.Decimal`, `Edm.Boolean`, `Edm.DateTime` (a `Date` or a date string), else `Edm.String`. |

---

## Class: `string`

| Function | Result |
| --- | --- |
| `string.wildcard(pattern)` | A `RegExp` that matches the whole value: `*` any text, every other character itself. |
| `string.matches(value, patterns = [])` | Whether a non-empty value matches one of the wildcard patterns. No pattern is no restriction (every non-empty value matches); non-string patterns are ignored. |

```js
string.matches('Z_SALES_MANAGER', ['Z_SALES_*', 'Z_FI_*']); // true
```

---

## Class: `fn`

### `fn.once(asyncFn)`

Wraps an async function so that it runs once: every call gets the same promise, also concurrent calls while the first
runs (the arguments of the first call are used). A rejected run is forgotten, so the next call retries. `reset()`
forgets the result, e.g. to reload a configuration value.

```js
const exchangeRates = utils.fn.once(async () => loadExchangeRates());
await exchangeRates(); // reads
await exchangeRates(); // the same result, no second read
```

---

## Class: `UUID`

Singleton class for deterministic UUID generation and parsing based on a fixed field configuration. Encodes/decodes structured business data into RFC-4122-compliant UUIDs.

### Constructor

```js
const uuidHelper = new UUID();
```

Creates a singleton instance. Subsequent `new UUID()` calls return the same instance.

---

### `UUID.isValid(vValue)` (static)

Whether a value is a UUID string (RFC 9562, any version, also the nil and max UUID), e.g. an ID from a request.

```js
UUID.isValid('6ba7b810-9dad-11d1-80b4-00c04fd430c8'); // true
UUID.isValid('abc');                                   // false
```

---

### `converse(oJsonData)`

Encodes structured JSON data into a deterministic UUID.

| Parameter   | Type     | Description                               |
|------------|----------|-------------------------------------------|
| `oJsonData` | `object` | Object                                    |
| **Returns** | `string` | A valid UUID string                       |
| **Throws**  | `Error`  | If any field has an invalid format or the generated UUID fails validation |

```js
const uid = new UUID();
uid.converse({
  ABC: "AB12",
  MNO: "I1234567",
  XYZ: "000000012345"
});
// Returns a valid UUID string e.g., "c0656612-2e12-4345-8670-000000012345"
```

---

### `inverse(sUUID)`

Decodes a previously generated UUID back into its original structured data.

| Parameter | Type     | Description                        |
|-----------|----------|------------------------------------|
| `sUUID`   | `string` | A UUID previously created by `converse` |
| **Returns** | `object` | `{ ABC, MNO, XYZ }` or `{}` if invalid |

```js
const uid = new UUID();
uid.inverse("c0656612-2e12-4345-8670-000000012345");
// { ABC: "AB12", MNO: "I1234567", XYZ: "000000012345" }
```

### `toKeys(sUUID)`

Like `inverse`, but returns the fields only when every field fits its format; anything else (no UUID, a UUID of the
right shape whose fields do not fit) gives `undefined` instead of an empty or partial object.

| Parameter | Type     | Description                        |
|-----------|----------|------------------------------------|
| `sUUID`   | `string` | A UUID previously created by `converse` |
| **Returns** | `object \| undefined` | The fields, or `undefined` |

TypeScript: the result is `Record<string, string> | undefined`; name your key type to get it typed:
`new UUID().toKeys<OrderKey>(id)`.

### `tryConverse(oJsonData)`

Like `converse`, but returns `undefined` instead of throwing when a field does not fit its format.

| Parameter   | Type     | Description |
|-------------|----------|-------------|
| `oJsonData` | `object` | The fields to encode |
| **Returns** | `string \| undefined` | The UUID, or `undefined` |

---

## Quick Usage Examples

```js
const { date, xml, json, array, sap, string, fn, UUID } = require('@cap-ts/esi').utils;

// Validate & transform
const valid = await date.isValid("2026-04-20");
const items = [{ id: 1, name: "A" }, { id: 2, name: "B" }];

// Project, sort, filter
const names = array.toArrayProjection(items, "name");             // ["A", "B"]
const sorted = array.sort(items, [{ ref: ["id"], sort: "desc" }]);
const filtered = array.filter(items, [{ name: "id", op: ">", value: 1 }]);

// Group & merge
const grouped = array.toGroupByPropertyName(items, "name");
const merged = json.merge({ a: 1 }, { b: 2 });                    // { a: 1, b: 2 }

// UUID round-trip
const uid = new UUID();
const uuidStr = uid.converse({ ABC: "AB12", MNO: "I1234567", XYZ: "000000012345" });
const original = uid.inverse(uuidStr);
```
