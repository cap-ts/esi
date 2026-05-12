# @cap-ts/esi Utilities API Reference

> **Module:** `utils`  
> **Purpose:** Core utility belt — date validation, XML parsing, JSON manipulation, array operations, and UUID generation/parsing.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Exports](#exports)
- [Class: `date`](#class-date)
  - [date.isValid(sDate)](#dateisvalidsdate)
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
- [Class: `array`](#class-array)
  - [array.add(oArray, oItem)](#arrayaddoarray-oitem)
  - [array.topN(oSortedArray, iTop)](#arraytopnosortedarray-itop)
  - [array.flat(oArray, sFlattenedProperty)](#arrayflatoarray-sflattenedproperty)
  - [array.unique(oArray)](#arrayuniqueoarray)
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
module.exports = { date, xml, json, array, UUID };
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

## Class: `UUID`

Singleton class for deterministic UUID generation and parsing based on a fixed field configuration. Encodes/decodes structured business data into RFC-4122-compliant UUIDs.

### Constructor

```js
const uuidHelper = new UUID();
```

Creates a singleton instance. Subsequent `new UUID()` calls return the same instance.

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

---

## Quick Usage Examples

```js
const { date, xml, json, array, UUID } = require('@cap-ts/esi').utils;

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
