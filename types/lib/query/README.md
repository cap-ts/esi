# @cap-ts/esi Query API Reference

> **Module:** `esi.query`  
> **Purpose:** CQN helpers for handlers — read, split, build and change WHERE clauses, columns and FROM clauses of
> `req.query`, translate a WHERE into the interval selection of an SAP enterprise service, and find key values.

---

## Table of Contents

- [Dependencies](#dependencies)
- [Exports](#exports)
- [Conventions](#conventions)
- [query.keyOf(req, name)](#querykeyofreq-name)
- [`SELECT.where`: conditions of a WHERE](#selectwhere-conditions-of-a-where)
  - [terms(where)](#termswhere) · [fromTerms(terms)](#fromtermsterms) · [termsOf(query)](#termsofquery)
  - [isEqual(term, name)](#isequalterm-name) · [toEqual(term)](#toequalterm) · [fieldOf(term)](#fieldofterm) · [fieldsOf(where)](#fieldsofwhere)
  - [toANDArray(where, alwaysArray?)](#toandarraywhere-alwaysarray)
  - [equalities(where)](#equalitieswhere) · [hasValues(where, name)](#hasvalueswhere-name)
- [`SELECT.where`: building conditions](#selectwhere-building-conditions)
  - [anyEqual](#anyequalname-values) · [allEqual](#allequalvalues) · [between](#betweenname-low-high) · [inList](#inlistname-values)
  - [fromValueRanges(name, ranges, options?)](#fromvaluerangesname-ranges-options)
- [`SELECT.where`: changing a request](#selectwhere-changing-a-request)
  - [add(req, where)](#addreq-where) · [has(req, name, association?)](#hasreq-name-association)
  - [replaceAt(req, name, condition, association?)](#replaceatreq-name-condition-association)
  - [appendFilterValuesAt(req, name, padConfig?, values, association?)](#appendfiltervaluesatreq-name-padconfig-values-association)
  - [toMonthRange(where, name)](#tomonthrangewhere-name)
  - [convert(where, idColumns, convertFn?)](#convertwhere-idcolumns-convertfn)
- [`SELECT.where`: evaluating and translating](#selectwhere-evaluating-and-translating)
  - [apply(rows, where)](#applyrows-where)
  - [toIntervals(where, fields)](#tointervalswhere-fields)
- [`SELECT.columns`](#selectcolumns)
- [`SELECT.search`, `SELECT.processingConditions`](#selectsearch-selectprocessingconditions)
- [`SELECT.from.fromable(from)`](#selectfromfromablefrom)
- [`SELECT.getForAssociation`, `DELETE.getKeyPropertyValueByName`](#selectgetforassociation-deletegetkeypropertyvaluebyname)
- [Quick Usage Examples](#quick-usage-examples)

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `utils` | `array` (lists), `date.monthRange`, `UUID.toKeys` (default of `convert`) |
| `lodash` | (through `utils`) |

No `@sap/cds` import: the functions work on CQN objects only.

---

## Exports

```js
const { esi } = require('@cap-ts/esi');
const { SELECT, DELETE, keyOf } = esi.query;
const W = esi.query.SELECT.where;
```

---

## Conventions

- **Tokens:** a WHERE is an array of CQN tokens: `{ ref: [...] }`, operators (`'='`, `'and'`, ...), `{ val }`,
  `{ list: [...] }`, groups `{ xpr: [...] }`, functions `{ func, args }`.
- **Term:** one condition of a top-level AND, as a token array (`[{ ref: ['a'] }, '=', { val: 1 }]`).
- **In place or not:** functions taking `req` change `req.query` in place; `toMonthRange` changes the given WHERE in
  place; everything else returns new arrays and leaves its input unchanged.
- **Builders** return plain token arrays; wrap them in `{ xpr: tokens }` before joining them with other conditions.

---

## `query.keyOf(req, name)`

The value of a key element of a request, wherever CAP put it.

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | `object` | The request |
| `name` | `string` | The key element |
| **Returns** | `any` | The value, `undefined` when none is given |

Order: `req.data[name]` (not empty) → the last entry of `req.params` (an object's `name`, or a single key value) → a
condition `name = value` (or `name in (value)`) of the statement's FROM reference or WHERE
([`termsOf`](#termsofquery)). The last one covers `DELETE.from(E, { ID })` and `UPDATE(E).where({ ID })` sent from
code, for which CAP fills neither data nor params.

```js
this.on(['UPDATE', 'DELETE'], 'Orders', (req) => {
    const sID = esi.query.keyOf(req, 'ID');
});
```

---

## `SELECT.where`: conditions of a WHERE

### `terms(where)`

Splits a WHERE at its top-level `and` into terms, without changing it. A WHERE with a top-level `or` stays one term
(`[{ xpr: where }]`), so joining it with further terms keeps its meaning. A term that is only a group (`{ xpr }` or a
nested token array, as the SOAP adapter's `$filter` parser writes it) is split into the group's terms.

| Parameter | Type | Description |
|-----------|------|-------------|
| `where` | `Array` | WHERE tokens (default `[]`) |
| **Returns** | `Array[]` | The terms |

```js
W.terms([{ ref: ['a'] }, '=', { val: 1 }, 'and', { xpr: [{ ref: ['b'] }, '=', { val: 2 }] }]);
// [[{ref:['a']}, '=', {val:1}], [{ref:['b']}, '=', {val:2}]]
```

### `fromTerms(terms)`

Joins terms with `and` (the counterpart of `terms`). Returns `[]` for no term.

### `termsOf(query)`

The terms of a statement: those of the key in its FROM reference (`Entity[ID = 1]`, the entity of a by-key URL)
followed by those of its WHERE. Takes a CQN query (`req.query`, SELECT, UPDATE or DELETE) or one statement
(`req.query.SELECT`).

```js
W.termsOf(SELECT.from('Orders', { ID: 1 }).where({ Status: 'O' })); // [[ID = 1], [Status = 'O']]
```

### `isEqual(term, name)`

`true` for `name = value` (the element on either side) and for `name in (value)` with exactly one value (how
association reads ask for one row).

### `toEqual(term)`

A term `name in (value)` with one value as `name = value`; any other term unchanged.

### `fieldOf(term)`

The element a term compares: the last segment of the `ref` of its left operand (`{ ref: ['_Assoc', 'Field'] }` →
`'Field'`); `undefined` when the left operand is no `ref` (a value, a function, a group).

### `fieldsOf(where)`

The element of each term (as `terms`; accepts `{ xpr }` too): one entry per term, `undefined` for a term without one
(a top-level `or` is such a term). With `every` / `some`: does a WHERE use only, or any of, some elements.

```js
const bOnlyKeys = W.fieldsOf(req.query.SELECT.where).every((f) => ['ID', 'Version'].includes(f));
```

### `toANDArray(where, alwaysArray?)`

The WHERE as an array of single conditions; every condition is wrapped (also numbers, booleans, functions). Groups
and function arguments are split recursively. `undefined` without a WHERE.

### `equalities(where)`

The `element = value` conditions that must all hold: those joined with `and`, also inside groups; a group (or the
WHERE) that contains an `or` is skipped. `eq` counts as `=`. The key is the `ref` path joined with `/`.

| **Returns** | `Record<string, any>` |
|---|---|

```js
W.equalities([{ ref: ['_Category', 'Active'] }, '=', { val: true }, 'and', { ref: ['a'] }, '>', { val: 1 }]);
// { '_Category/Active': true }
```

### `hasValues(where, name)`

`false` when a condition on the element can match nothing: `name in ()`, `name in (..., undefined, ...)` or
`name = undefined`. Looks into groups at any depth; only conditions on exactly `{ ref: [name] }` count.

```js
if (!W.hasValues(req.query.SELECT.where, 'Category')) return [];   // nothing to read
```

---

## `SELECT.where`: building conditions

### `anyEqual(name, values)`

`name = v1 or name = v2 ...`; no token for no value.

### `allEqual(values)`

`a = 1 and b = 2 ...` of the properties of an object (e.g. the fields of a key).

### `between(name, low, high)`

`name >= low and name <= high`.

### `inList(name, values)`

`name in (v1, v2, ...)`.

```js
W.anyEqual('Status', ['O', 'P']); // [{ref:['Status']}, '=', {val:'O'}, 'or', {ref:['Status']}, '=', {val:'P'}]
W.allEqual({ Region: 'EMEA', Year: '2026' });
W.between('Amount', 10, 20);
W.inList('Status', ['O', 'P']);
```

### `fromValueRanges(name, ranges, options?)`

A condition from value ranges, e.g. the field values of authorization restrictions.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | The element |
| `ranges` | `{ Low?, High? }[]` | The ranges |
| `options.nullValues` | `any[]` | Values always allowed (e.g. "not assigned"), added as `name = value` |
| `options.defaultLow` | `any` | Lower bound of a range that has only `High` |
| **Returns** | `Array` | Tokens joined with `or`; `[]` when nothing is allowed |

Rules: an empty bound is `undefined`, `null` or `''`. `Low` only → a single value (all single values become one `in`);
`Low` and `High` → `between`; only `High` → `between(defaultLow, High)` when `defaultLow` is given, else left out;
neither → left out.

```js
const tokens = W.fromValueRanges('Region', allowedRanges, { nullValues: [''] });
esi.query.SELECT.where.add(req, tokens.length ? [{ xpr: tokens }] : [{ val: 1 }, '=', { val: 2 }]); // none: no rows
```

---

## `SELECT.where`: changing a request

### `add(req, where)`

Appends conditions to `req.query.SELECT.where` with `and` (creates the WHERE when missing). Nothing happens without
conditions or without a SELECT. Wrap a condition with a top-level `or` in `{ xpr }` first.

### `has(req, name, association?)`

Whether the request's WHERE (or the infix WHERE of an expanded association) references the element (first `ref`
segment; a WHERE that is one group is looked into).

### `replaceAt(req, name, condition, association?)`

Replaces each condition `name <op> <value>` (three tokens) of the request's WHERE (or the association's) with the
tokens of `condition`.

### `appendFilterValuesAt(req, name, padConfig?, values, association?)`

Adds values to the condition on `name`: an existing `in` gets them, an existing `=` becomes an `in` of the old and the
new values, any other condition becomes `name in (values)`. With `padConfig` (`{ on: name, size, value, direction }`,
`direction` starting with `r` pads right, else left) the padded form of each value is added as well (e.g. `0001234`
for `1234`), for backends that store a padded key.

### `toMonthRange(where, name)`

Makes a date element compare by month: `name = 'yyyy-MM-dd'` matches the whole month of the date, `!=` / `<>`
everything outside it. Other conditions stay; the WHERE is changed in place, at any depth.

```js
const where = [{ ref: ['Due'] }, '=', { val: '2026-02-10' }];
W.toMonthRange(where, 'Due');
// [{ xpr: [{ref:['Due']}, '>=', {val:'2026-02-01'}, 'and', {ref:['Due']}, '<=', {val:'2026-02-28'}] }]
```

### `convert(where, idColumns, convertFn?)`

Replaces a condition on an encoded ID by the key conditions it decodes to.

| Parameter | Type | Description |
|-----------|------|-------------|
| `where` | `Array` | One condition `[ref, op, value]` |
| `idColumns` | `string[]` | The ID element(s) the condition may name |
| `convertFn` | `(id: string) => object \| undefined` | Default `new utils.UUID().toKeys(id)` |
| **Returns** | `Array` | Key conditions joined with `and`; `[]` when the ID does not convert |

`id = a` and `id in (a)` → the keys of `a`; `id in (a, b, ...)` → `[{ xpr: [{ xpr: keys of a }, 'or', { xpr: keys of b }, ...] }]`,
or `[]` when one of the IDs does not convert.

---

## `SELECT.where`: evaluating and translating

### `apply(rows, where)`

Filters rows in memory with a WHERE (AND of its conditions): `=`, `!=`, `>`, `<`, `>=`, `<=` and the functions
`contains`, `startswith`, `endswith`, `substring`. A condition it can not evaluate keeps the row.

### `toIntervals(where, fields)`

Translates a WHERE into the interval selection of an SAP enterprise service (SOAP `Query...In` operations).

| Parameter | Type | Description |
|-----------|------|-------------|
| `where` | `Array \| { xpr }` | WHERE tokens |
| `fields` | `Record<string, { Name, Parameter, operators? }>` | Element → its interval element (`Name`) and lower-boundary element (`Parameter`); `operators` limits what the service accepts (default `=`, `<`, `<=`, `>`, `>=`, `in`) |
| **Returns** | `{ intervals, complete }` | Per interval element its entries `{ IntervalBoundaryTypeCode, <Parameter>: value }`; `complete`: the service applies the whole WHERE |

Codes: `=` 1, `<` 6, `<=` 7, `>` 8, `>=` 9; `in (...)` gives one `=` interval per value. Conditions it can not express
(other elements or operators, a top-level `or`, a second condition on one element, which the service would OR) are left
out and make `complete` `false`: filter those in memory.

```js
const fields = { PartnerID: { Name: 'PartnerIDInterval', Parameter: 'LowerBoundaryPartnerID' } };
const { intervals, complete } = W.toIntervals(req.query.SELECT.where, fields);
return { Partner: intervals, __filterPushedDown: complete };
```

---

## `SELECT.columns`

| Function | Result |
|----------|--------|
| `has(req, name, association?)` | Whether `$select` (or the association's expand) contains `name` (also as alias, or through `*`). |
| `get(columns)` | `'*'` when the first column is `*`, else the element names of the `{ ref }` columns; `undefined` for none. |
| `parse(queryString, keyFields?)` | CQN columns from OData `$select` / `$expand` options (`{ $select, $expand }`); the key fields are added to the columns and to every expand. |
| `split(text)` | Splits `$select` / `$expand` text at top-level commas (parentheses respected). |
| `expand(entity, associations)` | `['*', { ref: [assoc], expand: ['*'] }, ...]` for the listed associations the entity has. |
| `ensure(columns, needed)` | `{ columns, requested }`: an explicit column list plus the elements a handler needs, and the names the client asked for (alias or element), so the added ones can be removed from the answer. No change for `*` or no list. Input unchanged. |
| `without(columns, names)` | The columns without those of the given elements. Input unchanged. |
| `DRAFT` | The draft elements CAP adds for Fiori (`IsActiveEntity`, `HasActiveEntity`, `HasDraftEntity`, `DraftAdministrativeData`, `SiblingEntity`, `DraftMessages`). |

```js
const select = req.query.SELECT;
select.columns = esi.query.SELECT.columns.without(select.columns, esi.query.SELECT.columns.DRAFT);
const { columns, requested } = esi.query.SELECT.columns.ensure(select.columns, ['ID', 'Region']);
select.columns = columns;
this.after('READ', 'Orders', (rows) => {
    if (requested) for (const row of rows) for (const key of Object.keys(row)) if (!requested.includes(key)) delete row[key];
});
```

---

## `SELECT.search`, `SELECT.processingConditions`

| Function | Result |
|----------|--------|
| `search.text(search)` | The text of a `$search` (`req.query.SELECT.search`): its values joined with blanks; `undefined` without one. |
| `processingConditions(select, pageSize = 1000)` | The `QueryProcessingConditions` of an SAP enterprise service: `QueryHitsMaximumNumberValue` = `$top` up to the page size, no total count, no unlimited query. Pass `cds.env.query.soap.pageSize` to use the SOAP adapter's page size. |

---

## `SELECT.from.fromable(from)`

A FROM clause as `{ clause, from, serviceName, entityName, where, Association }`: the entity (or `Service.Entity`), the
key WHERE of a by-key reference, and the next navigation segment as a nested fromable (`Association`).

```js
esi.query.SELECT.from.fromable({ ref: [{ id: 'Orders', where: [{ ref: ['ID'] }, '=', { val: 1 }] }, '_Items'] });
// { clause, from: 'Orders', entityName: 'Orders', where: [...], Association: { from: '_Items', entityName: '_Items', ... } }
```

---

## `SELECT.getForAssociation`, `DELETE.getKeyPropertyValueByName`

| Function | Result |
|----------|--------|
| `SELECT.getForAssociation(req, association)` | The column object `{ ref, expand, where }` of an expanded association, `undefined` when it is not expanded. |
| `DELETE.getKeyPropertyValueByName(req, name)` | The value of `name = value` in the key of a DELETE by key (`DELETE.from.ref[0].where`). For any statement and for data / params use [`keyOf`](#querykeyofreq-name). |

---

## Quick Usage Examples

```js
const { esi } = require('@cap-ts/esi');
const W = esi.query.SELECT.where;

// Replace an encoded ID by the backend keys, keep the other conditions, add the user's restriction
this.before('READ', 'Orders', (req) => {
    const select = req.query.SELECT;
    const terms = W.terms(select.where).flatMap((term) => {
        const keys = W.convert(term, ['ID']);
        return keys.length ? [keys] : [term];
    });
    select.where = W.fromTerms([...terms, W.allEqual({ Owner: req.user.id })]);
});

// A month filter for a date element
this.before('READ', 'Orders', (req) => W.toMonthRange(req.query.SELECT.where, 'DueDate'));
```
