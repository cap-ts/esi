/**
 * Date utility class providing date validation helpers.
 * @class
 * @public
 */
export class date {
    /**
     * Patterns of {@link date.format}: `ISO` 2026-04-15, `BASIC` 20260415 (the SAP internal date, DATS), `DMY`
     * 15-04-2026, `TIMESTAMP` 2026-04-15T08:05:09.
     *
     * @public
     * @static
     * @readonly
     */
    public static readonly PATTERN: Readonly<{
        ISO: "yyyy-MM-dd";
        BASIC: "yyyyMMdd";
        DMY: "dd-MM-yyyy";
        TIMESTAMP: "yyyy-MM-ddTHH:mm:ss";
    }>;
    /**
     * Validates whether a given string is a valid date.
     * Attempts to parse the string into a Date object and checks for validity.
     *
     * @public
     * @static
     * @param {string} sDate - The date string to validate (e.g., "2026-04-20", "April 20, 2026").
     * @returns {Promise<boolean>} Resolves to `true` if the string represents a valid date, `false` otherwise.
     * @example
     * await date.isValid("2026-04-20"); // true
     * await date.isValid("not-a-date"); // false
     */
    public static isValid(sDate: string): Promise<boolean>;
    /**
     * Whether a value is a string in a common date notation: an ISO 8601 date-time (`yyyy-MM-ddTHH:mm:ss...`),
     * `yyyy-MM-dd`, or `dd/MM/yyyy` / `MM/dd/yyyy`. Synchronous and by notation only (unlike {@link date.isValid}).
     *
     * @public
     * @static
     * @param {unknown} vValue - The value to check.
     * @returns {boolean} `true` for a date string.
     * @example
     * date.isDateString('2026-04-15');          // true
     * date.isDateString('2026-04-15T10:30:00'); // true
     * date.isDateString('hello');               // false
     */
    public static isDateString(vValue: unknown): boolean;
    /**
     * A date `iMonths` months after (negative: before) a date, at local midnight.
     *
     * @public
     * @static
     * @param {number} iMonths - Months to add (negative to subtract).
     * @param {Date|string|number} [vDate=new Date()] - The base date.
     * @returns {Date} A new date.
     * @example
     * date.addMonths(-2, new Date(2026, 5, 1)); // 2026-04-01 (local midnight)
     */
    public static addMonths(iMonths: number, vDate?: Date | string | number): Date;
    /**
     * Formats a date in UTC with a pattern of the tokens `yyyy`, `MM`, `dd`, `HH`, `mm`, `ss` (zero-padded); every other
     * character is kept. A date-only string (`yyyy-MM-dd`) is read as UTC midnight, so it keeps its day.
     *
     * @public
     * @static
     * @param {Date|string|number|null|undefined} vDate - The date.
     * @param {string} [sPattern='yyyy-MM-dd'] - The pattern, e.g. {@link date.PATTERN}.
     * @returns {string|null} The formatted date, `null` without a date or for an invalid one.
     * @example
     * date.format('2026-04-15T08:05:09Z', 'yyyyMMdd');            // '20260415'
     * date.format('2026-04-15T08:05:09Z', 'yyyy-MM-ddTHH:mm:ss');   // '2026-04-15T08:05:09'
     * date.format(null);                                           // null
     */
    public static format(vDate: Date | string | number | null | undefined, sPattern?: string): string | null;
    /**
     * Formats the given fields of one row or of every row of an array with {@link date.format} (changed in place).
     * `null` / `undefined` values are left as they are.
     *
     * @public
     * @static
     * @param {object|object[]} vData - A row or rows.
     * @param {string[]} [aFields=[]] - The date fields.
     * @param {string} [sPattern='yyyy-MM-dd'] - The pattern.
     * @returns {object|object[]} The same data.
     * @example
     * date.formatFields([{ Start: '2026-04-15' }], ['Start'], 'dd-MM-yyyy'); // [{ Start: '15-04-2026' }]
     */
    public static formatFields(vData: any, aFields?: string[], sPattern?: string): object | object[];
    /**
     * Monday and Sunday (`yyyy-MM-dd`, UTC) of the week of a date.
     *
     * @public
     * @static
     * @param {Date|string|number} [vDate=new Date()] - A day of the week.
     * @returns {{ Low: string, High: string }} The week.
     * @example
     * date.weekOf('2026-10-16'); // { Low: '2026-10-12', High: '2026-10-18' }
     */
    public static weekOf(vDate?: Date | string | number): {
        Low: string;
        High: string;
    };
    /**
     * The calendar view of a month: from the Monday of its first week to the Sunday of its last week (`yyyy-MM-dd`, UTC).
     *
     * @public
     * @static
     * @param {string} [sYearMonth] - `yyyyMM`; default: the current month (UTC).
     * @returns {{ Low: string, High: string, YearMonth: string }} The range and the month as `yyyyMM`.
     * @example
     * date.calendarMonth('202604'); // { Low: '2026-03-30', High: '2026-05-03', YearMonth: '202604' }
     */
    public static calendarMonth(sYearMonth?: string): {
        Low: string;
        High: string;
        YearMonth: string;
    };
    /**
     * The first and the last day (`yyyy-MM-dd`) of the month of a date given as `yyyy-MM-dd...`.
     *
     * @public
     * @static
     * @param {string} sDate - The date.
     * @returns {[string, string]|undefined} The month, `undefined` for another notation.
     * @example
     * date.monthRange('2024-02-10'); // ['2024-02-01', '2024-02-29']
     */
    public static monthRange(sDate: string): [string, string] | undefined;
    /**
     * Every day of a range, `Low` to `High` (both included), as dates at UTC midnight.
     *
     * @public
     * @static
     * @param {{ Low: Date|string, High: Date|string }} oRange - The range.
     * @returns {Date[]} The days.
     * @example
     * date.days({ Low: '2026-04-01', High: '2026-04-03' }).map((d) => date.format(d)); // ['2026-04-01', '2026-04-02', '2026-04-03']
     */
    public static days(oRange: {
        Low: Date | string;
        High: Date | string;
    }): Date[];
}
/**
 * XML utility class providing XML validation helpers.
 * Uses the `xml2js` library for parsing and validation.
 * @class
 * @public
 */
export class xml {
    /**
     * Validates whether the given input is well-formed XML.
     * Parses the XML string using xml2js and logs the result.
     *
     * @public
     * @static
     * @param {string|object} oXML - The XML string or object to validate.
     * @returns {Promise<boolean>} Resolves to `true` if the XML is valid, `false` otherwise.
     * @example
     * await xml.isValid("<root><item>value</item></root>"); // true
     * await xml.isValid("not xml");                         // false
     */
    public static isValid(oXML: object): Promise<boolean>;
}
/**
 * JSON utility class providing a comprehensive set of JSON/object manipulation helpers.
 * Includes validation, deep copy, recursive replacement, property access, deduplication,
 * key ordering, projection, mapping, merging, flattening, and stripping of undefined values.
 * @class
 * @public
 */
export class json {
    /**
     * Checks whether a given value is valid JSON by attempting to parse it.
     *
     * @public
     * @static
     * @param {string|object} oJson - The value to validate (typically a JSON string).
     * @returns {boolean} `true` if the value can be parsed as JSON, `false` otherwise.
     * @example
     * json.isValid('{"key":"value"}'); // true
     * json.isValid('not json');        // false
     */
    public static isValid(oJson: object): boolean;
    /**
     * Creates a deep copy of a JSON-parseable value using `structuredClone`.
     * If the value is not valid JSON, returns the original reference.
     *
     * @public
     * @static
     * @param {object} oJson - The object or value to copy.
     * @returns {object} A deep clone if the input is valid JSON, otherwise the original value.
     * @example
     * const copy = json.copy(originalObject);
     */
    public static copy(oJson: object): object;
    /**
     * Recursively replaces all occurrences of a string value within a nested JSON structure
     * (objects and arrays). Optionally evaluates the replaced value as a property path on
     * a provided evaluation context object.
     *
     * @public
     * @static
     * @param {object|Array} oJson - The JSON object or array to perform replacements in (mutated in place).
     * @param {string} sOldValue - The substring to search for.
     * @param {string} sNewValue - The substring to replace with.
     * @param {object} [oEvaluate=undefined] - Optional context object; when provided, the replaced
     *   string is resolved as a property path via {@link json.getValue}.
     * @returns {void} The input object is mutated in place.
     * @example
     * const data = { greeting: "Hello {{name}}" };
     * json.replace(data, "{{name}}", "World");
     * // data.greeting === "Hello World"
     */
    public static replace(oJson: object, sOldValue: string, sNewValue: string, oEvaluate?: object): void;
    /**
     * Retrieves a deeply nested property value from an object using a dot-separated path.
     *
     * @public
     * @static
     * @param {object} oJson - The source object to traverse.
     * @param {string} sPropertyPath - Dot-separated property path (e.g., "level1.level2.prop").
     * @returns {*} The value at the specified path, or `undefined` if any segment is missing.
     * @example
     * json.getValue({ a: { b: 42 } }, "a.b"); // 42
     */
    public static getValue(oJson: object, sPropertyPath: string): any;
    /**
     * Flattens a nested array and returns only unique elements (deep equality via JSON serialization).
     *
     * @public
     * @static
     * @param {any[]} oNestedArray - A potentially nested array.
     * @returns {any[]} A flat array of unique elements, or the original input if not an array.
     * @example
     * json.unique([[1,2],[2,3]]); // [1, 2, 3]
     */
    public static unique(oNestedArray: any[]): any[];
    /**
     * Reorders the keys of a JSON object according to a specified key order.
     * Keys listed in `oKeyOrder` appear first; remaining keys follow in their original order.
     *
     * @public
     * @static
     * @param {object} oJson - The source object to reorder.
     * @param {string[]} oKeyOrder - Desired key order (priority keys listed first).
     * @returns {object} A new object with keys arranged in the specified order.
     * @example
     * json.order({ c: 3, a: 1, b: 2 }, ["a", "b"]); // { a: 1, b: 2, c: 3 }
     */
    public static order(oJson: object, oKeyOrder: string[]): object;
    /**
     * Projects (filters) an object's properties to only include the specified column names.
     * Optionally includes association-prefixed keys (e.g., `key_assoc`).
     *
     * @public
     * @static
     * @param {object} oJson - The source object.
     * @param {string[]} oColumns - List of property names to include.
     * @param {boolean} [bHasAssociattion=false] - When `true`, also includes keys where a column starts with `key_`.
     * @returns {object} A new object containing only the projected properties.
     * @example
     * json.projection({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
     */
    public static projection(oJson: object, oColumns: string[], bHasAssociattion?: boolean): object;
    /**
     * Maps properties from a source object to a new object based on a mapping definition.
     * Supports one-level and two-level dot-notation paths in the mapping values.
     *
     * @public
     * @static
     * @param {object} oJson - The source data object.
     * @param {object} oMap - Mapping definition where keys are target property names and values
     *   are dot-separated source paths (e.g., `{ fullName: "user.name" }`).
     * @returns {object} A new object with mapped properties.
     * @example
     * json.map({ user: { name: "John" } }, { fullName: "user.name" }); // { fullName: "John" }
     */
    public static map(oJson: object, oMap: object): object;
    /**
     * Deep-merges two objects using Lodash's `_.merge`. Returns an empty object if either input is not an object.
     *
     * @public
     * @static
     * @param {object} oJson1 - The base object.
     * @param {object} oJson2 - The object to merge into the base.
     * @returns {object} A new deeply merged object.
     * @example
     * json.merge({ a: { x: 1 } }, { a: { y: 2 } }); // { a: { x: 1, y: 2 } }
     */
    public static merge(oJson1: object, oJson2: object): object;
    /**
     * Flattens a single nested property of an object into the parent level.
     * All keys from the nested property are spread into the resulting object.
     *
     * @public
     * @static
     * @param {object} oJson - The source object.
     * @param {string} sFlattenedProperty - The property name whose contents should be flattened.
     * @returns {object} A new object with the specified property's contents promoted to the top level.
     * @example
     * json.flat({ id: 1, details: { name: "A" } }, "details"); // { id: 1, name: "A" }
     */
    public static flat(oJson: object, sFlattenedProperty: string): object;
    /**
     * Removes all properties with `undefined`, `null`, or empty string values from an object.
     *
     * @public
     * @static
     * @param {object} oSourceJson - The source object to strip.
     * @returns {object} A new object containing only defined, non-null, non-empty properties.
     * @example
     * json.stripUndefined({ a: 1, b: null, c: "" }); // { a: 1 }
     */
    public static stripUndefined(oSourceJson: object): object;
    /**
     * Parses JSON text without throwing.
     *
     * @public
     * @static
     * @param {unknown} vText - The text.
     * @returns {any} The parsed value, `undefined` for a value that is not JSON text.
     * @example
     * json.tryParse('{"a":1}'); // { a: 1 }
     * json.tryParse('nope');    // undefined
     */
    public static tryParse(vText: unknown): any;
    /**
     * Whether a value is a primitive (`string`, `number`, `boolean`, `null`, `undefined`) or a `Date`, i.e. a column
     * value rather than an object or an array.
     *
     * @public
     * @static
     * @param {unknown} vValue - The value.
     * @returns {boolean} `true` for a primitive or a date.
     */
    public static isPrimitive(vValue: unknown): boolean;
    /**
     * Flattens a nested object into one level of columns: nested keys are joined with `sSeparator`, arrays are JSON
     * text, functions and other non-JSON values are dropped (the input is serialized first, so an `Error`'s own
     * enumerable properties are kept, `Date`s become ISO strings).
     *
     * @public
     * @static
     * @param {unknown} vObject - The object, e.g. an error.
     * @param {string} [sSeparator='_'] - Joins the path segments.
     * @returns {Record<string, unknown>} The columns.
     * @example
     * json.toColumns({ message: 'Timeout', response: { status: 408, data: { code: 'T' } }, list: [1] });
     * // { message: 'Timeout', response_status: 408, response_data_code: 'T', list: '[1]' }
     */
    public static toColumns(vObject: unknown, sSeparator?: string): Record<string, unknown>;
    /**
     * A readable label of a field name: the last segment of a dotted path, PascalCase / camelCase split into words.
     *
     * @public
     * @static
     * @param {string} sName - The field name.
     * @returns {string} The label.
     * @example
     * json.label('Order.ShipToCity'); // 'Ship To City'
     */
    public static label(sName: string): string;
    /**
     * Metadata of rows of unknown shape: every field once (in the order found), its EDM type from its first value
     * ({@link sap.edmType}) and a label.
     *
     * @public
     * @static
     * @param {object[]} aRows - The rows.
     * @param {(sName: string) => string} [fLabel=json.label] - The label of a field, e.g. a translated text.
     * @returns {{ properties: { name: string, type: string, label: string }[] }} The metadata.
     * @example
     * json.metadata([{ ID: 1, Name: 'A' }]);
     * // { properties: [{ name: 'ID', type: 'Edm.Int32', label: 'I D' }, { name: 'Name', type: 'Edm.String', label: 'Name' }] }
     */
    public static metadata(aRows: object[], fLabel?: (sName: string) => string): {
        properties: {
            name: string;
            type: string;
            label: string;
        }[];
    };
}
/**
 * Array utility class providing operations for sorting, filtering, mapping, projecting,
 * flattening, deduplication, grouping, and structural transformations on arrays.
 * Many methods gracefully handle single-object inputs by delegating to the `json` class.
 * @class
 * @public
 */
export class array {
    /**
     * Appends one or more items to an array. Accepts both single values and arrays.
     *
     * @public
     * @static
     * @param {any[]} oArray - The target array to append to (mutated in place).
     * @param {any|any[]} oItem - The item(s) to add.
     * @returns {any[]} The modified array.
     * @example
     * array.add([1, 2], 3);       // [1, 2, 3]
     * array.add([1, 2], [3, 4]);  // [1, 2, 3, 4]
     */
    public static add(oArray: any[], oItem: any): any[];
    /**
     * Returns the first N elements from a (pre-sorted) array.
     *
     * @public
     * @static
     * @param {any[]} oSortedArray - The sorted array to slice.
     * @param {number} iTop - The number of elements to return.
     * @returns {any[]} The top N elements.
     * @example
     * array.topN([10, 20, 30, 40], 2); // [10, 20]
     */
    public static topN(oSortedArray: any[], iTop: number): any[];
    /**
     * Flattens a specified nested property for each element in an array.
     * If the input is a single object, delegates to {@link json.flat}.
     *
     * @public
     * @static
     * @param {any[]|object} oArray - The array (or single object) to flatten.
     * @param {string} sFlattenedProperty - The property name whose contents should be promoted.
     * @returns {any[]} An array of flattened objects.
     */
    public static flat(oArray: any[], sFlattenedProperty: string): any[];
    /**
     * Returns a new array with duplicate elements removed (deep equality comparison via Lodash).
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to deduplicate.
     * @returns {any[]} A new array with only unique elements.
     */
    public static unique(oArray: any[]): any[];
    /**
     * Keeps the first element per value of a property, e.g. one row per key when a backend answers an entry twice.
     * Elements without the property (`undefined` / `null`) are all kept: without a value there is nothing to compare.
     * A value that is not an array is returned as is. With `{ last: true }` the last element per value wins (e.g.
     * rows of two reads merged, the later read wins); it keeps the position of the first one.
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to deduplicate.
     * @param {string} sPropertyName - The property whose value identifies an element.
     * @param {{ last?: boolean }} [oOptions] - `last`: keep the last element per value instead of the first.
     * @returns {any[]} A new array with one element per property value.
     * @example
     * array.uniqueBy([{ ID: 1, a: 1 }, { ID: 1, a: 2 }, { ID: 2 }], 'ID'); // [{ ID: 1, a: 1 }, { ID: 2 }]
     * array.uniqueBy([{ ID: 1, a: 1 }, { ID: 1, a: 2 }, { ID: 2 }], 'ID', { last: true }); // [{ ID: 1, a: 2 }, { ID: 2 }]
     */
    public static uniqueBy(oArray: any[], sPropertyName: string, oOptions?: {
        last?: boolean;
    }): any[];
    /**
     * The elements of `aLeft` whose `sKey` value occurs in `aRight` (a semi-join, e.g. headers that have items).
     *
     * @public
     * @static
     * @param {any[]} aLeft - The elements to keep or drop.
     * @param {any[]} aRight - The elements whose values count.
     * @param {string} sKey - The property of `aLeft`.
     * @param {string} [sRightKey=sKey] - The property of `aRight`.
     * @returns {any[]} The matching elements of `aLeft`.
     * @example
     * array.semiJoin([{ ID: 1 }, { ID: 2 }], [{ ID: 2 }], 'ID'); // [{ ID: 2 }]
     */
    public static semiJoin(aLeft: any[], aRight: any[], sKey: string, sRightKey?: string): any[];
    /**
     * The best element per value of `sKey`: `fRank` gives each element a tuple, compared element by element (the first
     * difference decides, higher is better); on a tie the earlier element stays. Elements without a value are dropped.
     *
     * @public
     * @static
     * @param {any[]} aRows - The elements.
     * @param {string} sKey - The property that groups them.
     * @param {(oRow: any) => (string|number|boolean)[]} fRank - The rank tuple of an element.
     * @returns {any[]} One element per value, in the order the values were first found.
     * @example
     * array.bestBy([{ P: 'a', v: 1 }, { P: 'a', v: 3 }], 'P', (o) => [o.v]); // [{ P: 'a', v: 3 }]
     */
    public static bestBy(aRows: any[], sKey: string, fRank: (oRow: any) => any[]): any[];
    /**
     * Rows grouped per dimension values, the measures summed (a measure given as text, as OData V2 sends decimals,
     * stays text). The first row of a group gives its other fields.
     *
     * @public
     * @static
     * @param {object[]} aRows - The rows.
     * @param {string[]} aDimensions - The fields that group (compared as trimmed text).
     * @param {string[]} aMeasures - The fields that are summed.
     * @returns {object[]} One row per group, in the order the groups were first found.
     * @example
     * array.sumBy([{ D: 'a', M: '1.5' }, { D: 'a', M: '2' }], ['D'], ['M']); // [{ D: 'a', M: '3.5' }]
     */
    public static sumBy(aRows: object[], aDimensions: string[], aMeasures: string[]): object[];
    /**
     * Builds a tree from flat rows (e.g. the rows of a join): each level groups the rows by its `key`, takes its
     * `fields` from the first row of the group and puts the next level into `children`.
     *
     * @public
     * @static
     * @param {object[]} aRows - The flat rows.
     * @param {{ key: string, fields: string[] | Record<string, string>, children?: string }[]} aLevels - Top level first.
     *   `fields`: the field names, or target name -> source field. `children`: the property of the next level (not on
     *   the last level). A row without a value for a level's `key` gives no node on that level.
     * @returns {object[]} The nodes of the top level.
     * @example
     * array.nest([{ H: 1, I: 'a' }, { H: 1, I: 'b' }], [{ key: 'H', fields: ['H'], children: 'Items' }, { key: 'I', fields: { Item: 'I' } }]);
     * // [{ H: 1, Items: [{ Item: 'a' }, { Item: 'b' }] }]
     */
    public static nest(aRows: object[], aLevels: {
        key: string;
        fields: string[] | Record<string, string>;
        children?: string;
    }[]): object[];
    /**
     * Splits values into chunks so that `fBuild(chunk)` (e.g. a request URL) stays shorter than `iMaxLength`: as many
     * values per chunk as fit into the first one.
     *
     * @public
     * @static
     * @param {any[]} aValues - The values.
     * @param {(aChunk: any[]) => string} fBuild - Builds the text of a chunk.
     * @param {number} iMaxLength - The text must be shorter than this.
     * @returns {any[][]|undefined} The chunks (none for no values), `undefined` when not even one value fits.
     * @example
     * array.chunkByLength(['A', 'B', 'C'], (a) => `/x?in=${a.join(',')}`, 11); // [['A', 'B'], ['C']]
     */
    public static chunkByLength(aValues: any[], fBuild: (aChunk: any[]) => string, iMaxLength: number): any[][] | undefined;
    /**
     * Reorders the keys of each object in an array according to the specified key order.
     * If the input is a single object, delegates to {@link json.order}.
     *
     * @public
     * @static
     * @param {any[]|object} oArray - The array (or single object) to reorder.
     * @param {string[]} oOrder - The desired key order.
     * @returns {any[]} An array of objects with reordered keys.
     */
    public static order(oArray: any[], oOrder: string[]): any[];
    /**
     * Projects each element in an array to only include specified columns.
     * Works with both arrays and single objects.
     *
     * @public
     * @static
     * @param {any[]|object} oArray - The array or single object to project.
     * @param {string[]} oColumns - The column names to keep.
     * @param {boolean} [bHasAssociattion=false] - When true, includes association-prefixed keys.
     * @returns {any[]} Projected results.
     */
    public static projection(oArray: any[], oColumns: string[], bHasAssociattion?: boolean): any[];
    /**
     * Maps each element in an array using a property mapping definition.
     * Works with both arrays and single objects.
     *
     * @public
     * @static
     * @param {any[]|object} oArray - The array or single object to map.
     * @param {object} oMap - Mapping definition (see {@link json.map}).
     * @returns {any[]} Mapped results.
     */
    public static map(oArray: any[], oMap: any[]): any[];
    /**
     * Sorts an array of objects by one or more columns with optional type coercion.
     * Supports `Date` and `parseFloat` coercion functions, and `asc`/`desc` sort directions.
     * Uses Lodash `_.orderBy` internally.
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to sort.
     * @param {Array<{ref: string[], sort?: 'asc'|'desc', function?: 'Date'|'parseFloat'}>} oOrderBy -
     *   Sort specification. Each entry has `ref` (column path), optional `sort` direction, and
     *   optional `function` for type coercion.
     * @returns {any[]} A new sorted array.
     * @example
     * array.sort(items, [{ ref: ["price"], sort: "desc", function: "parseFloat" }]);
     */
    public static sort(oArray: any[], oOrderBy: object): any[];
    /**
     * Filters an array of objects based on a set of filter conditions.
     * Each condition specifies a property name, comparison operator, and value.
     *
     * @public
     * @static
     * @typedef {Object} FilterCondition
     * @property {string} name - The property name to filter by.
     * @property {'=' | '!=' | '>' | '<' | '>=' | '<='} op - The comparison operator.
     * @property {string | number | boolean} value - The value to compare against.
     * @param {any[]} oArray - The array to filter.
     * @param {FilterCondition[]} oFilterCondition - The filter conditions to apply.
     * @returns {any[]} A filtered array containing only elements matching all conditions.
     */
    public static filter(oArray: any[], oFilterCondition: {
        /**
         * - The property name to filter by.
         */
        name: string;
        /**
         * - The comparison operator.
         */
        op: "=" | "!=" | ">" | "<" | ">=" | "<=";
        /**
         * - The value to compare against.
         */
        value: string | number | boolean;
    }[]): any[];
    /**
     * Checks if an array contains a specific element (strict equality).
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to search.
     * @param {*} oElement - The element to look for.
     * @returns {boolean} `true` if the element exists in the array.
     */
    public static hasElement(oArray: any[], oElement: any): boolean;
    /**
     * Ensures the input is always returned as an array.
     * Returns `[]` for `undefined`, wraps non-array values in an array, passes arrays through.
     *
     * @public
     * @static
     * @param {*} oArray - The value to coerce into an array.
     * @returns {any[]} The input as an array.
     * @example
     * array.toArray("hello");   // ["hello"]
     * array.toArray(undefined); // []
     * array.toArray([1, 2]);    // [1, 2]
     */
    public static toArray(oArray: any): any[];
    /**
     * Unwraps a single-element array to its contained value.
     * If the array has more than one element, returns the array as-is.
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to potentially unwrap.
     * @returns {*|any[]} The single element or the original array.
     * @example
     * array.toDisArray([42]);     // 42
     * array.toDisArray([1, 2]);   // [1, 2]
     */
    public static toDisArray(oArray: any[]): any | any[];
    /**
     * Creates a new array with a separator element inserted between every two elements.
     *
     * @public
     * @static
     * @param {any[]} oArray - The source array.
     * @param {*} oElement - The separator element to interleave.
     * @returns {any[]} A new array with the separator interleaved.
     * @example
     * array.toInterleavedArray(["a", "b", "c"], "-"); // ["a", ["-"], "b", ["-"], "c"]
     */
    public static toInterleavedArray(oArray: any[], oElement: any): any[];
    /**
     * Extracts a single property value from each element, returning a flat array of those values.
     *
     * @public
     * @static
     * @param {any[]} oArray - The source array of objects.
     * @param {string} sProjectionFieldName - The property name to extract.
     * @returns {any[]} An array of the extracted property values.
     * @example
     * array.toArrayProjection([{ id: 1 }, { id: 2 }], "id"); // [1, 2]
     */
    public static toArrayProjection(oArray: any[], sProjectionFieldName: string): any[];
    /**
     * Recursively searches for a property in a nested JSON Array.
     *
     * @public
     * @static
     * @param {any[]} oArray - The JSON Array to search.
     * @param {string} sProjectionFieldName - The property name to look for.
     * @returns {Array} An array of all matching values found.
     */
    public static findProperty(oArray: any[], sProjectionFieldName: string): any[];
    /**
     * Groups array elements into an object keyed by the value of a specified property.
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to group.
     * @param {string} sPropertyName - The property name to group by.
     * @returns {Object<string, any[]>} An object where keys are property values and values are arrays of matching elements.
     * @example
     * array.toGroupByPropertyName([{ type: "A", v: 1 }, { type: "A", v: 2 }, { type: "B", v: 3 }], "type");
     * // { A: [{ type: "A", v: 1 }, { type: "A", v: 2 }], B: [{ type: "B", v: 3 }] }
     */
    public static toGroupByPropertyName(oArray: any[], sPropertyName: string): {
        [x: string]: any[];
    };
    /**
     * Groups array elements by a composite key formed from multiple property values.
     * Supports dot-notation and recursive deep property lookup.
     * The composite key is formed by joining values with `##`.
     *
     * @public
     * @static
     * @param {any[]} oArray - The array to group.
     * @param {string[]} oPropertyList - List of property names/paths to form the composite key.
     * @returns {Object<string, any[]>} An object where keys are composite values and values are arrays of matching elements.
     * @example
     * array.toGroupByPropertyList(data, ["region", "category"]);
     * // { "US##Electronics": [...], "EU##Clothing": [...] }
     */
    public static toGroupByPropertyList(oArray: any[], oPropertyList: string[]): {
        [x: string]: any[];
    };
}
/**
 * SAP-standard value lists, e.g. the formats of an SAP user.
 *
 * @class
 * @public
 */
export class sap {
    /**
     * The decimal notation of an SAP user (`DecimalFormatCode`, SU01 "Decimal Notation"): blank (or any other code)
     * 1.234.567,89; `X` 1,234,567.89; `Y` 1 234 567,89.
     *
     * @public
     * @static
     * @param {string} [sCode] - The decimal format code.
     * @returns {{ decimal: string, thousand: string }} The decimal and the thousands separator.
     * @example
     * sap.decimalNotation('X'); // { decimal: '.', thousand: ',' }
     */
    public static decimalNotation(sCode?: string | undefined): {
        decimal: string;
        thousand: string;
    };
    /**
     * The date format of an SAP user (`DateFormatCode`, SU01 "Date Format"): `1` DD.MM.YYYY, `2` MM/DD/YYYY,
     * `3` MM-DD-YYYY, `4` YYYY.MM.DD, `5` YYYY/MM/DD, `6` YYYY-MM-DD (ISO), `7` GYY.MM.DD, `8` GYY/MM/DD, `9` GYY-MM-DD
     * (`G` the Japanese era); any other code YYYY/MM/DD.
     *
     * @public
     * @static
     * @param {string|number} [vCode] - The date format code.
     * @returns {string} The pattern.
     * @example
     * sap.dateFormat('1'); // 'DD.MM.YYYY'
     */
    public static dateFormat(vCode?: string | number | undefined): string;
    /**
     * The time format of an SAP user (`TimeFormatCode`, SU01 "Time Format"): `1` / `3` 12 hours with `AM` / `PM`,
     * `2` / `4` 12 hours with `am` / `pm`; any other code (`0`) 24 hours.
     *
     * @public
     * @static
     * @param {string|number} [vCode] - The time format code.
     * @returns {string} The pattern: `hh:mm:ss A`, `hh:mm:ss a` or `HH:mm:ss`.
     * @example
     * sap.timeFormat('2'); // 'hh:mm:ss a'
     */
    public static timeFormat(vCode?: string | number | undefined): string;
    /**
     * The OData EDM type of a value: a date string ({@link date.isDateString}) or a `Date` `Edm.DateTime`, an integer
     * `Edm.Int32`, another number `Edm.Decimal`, a boolean `Edm.Boolean`, anything else `Edm.String`.
     *
     * @public
     * @static
     * @param {unknown} vValue - The value.
     * @returns {string} The EDM type.
     * @example
     * sap.edmType(3.5); // 'Edm.Decimal'
     */
    public static edmType(vValue: unknown): string;
}
/**
 * String helpers.
 *
 * @class
 * @public
 */
export class string {
    /**
     * A regular expression of a wildcard pattern: `*` matches any text, every other character itself; the whole value
     * must match.
     *
     * @public
     * @static
     * @param {string} sPattern - The pattern, e.g. `Z_*`.
     * @returns {RegExp} The expression.
     * @example
     * string.wildcard('Z_*').test('Z_SALES'); // true
     */
    public static wildcard(sPattern: string): RegExp;
    /**
     * Whether a value matches one of the wildcard patterns ({@link string.wildcard}). No pattern is no restriction: every
     * non-empty value matches. Patterns that are not strings are ignored.
     *
     * @public
     * @static
     * @param {string} sValue - The value.
     * @param {unknown[]} [aPatterns=[]] - The patterns.
     * @returns {boolean} `true` when it matches.
     * @example
     * string.matches('Z_SALES', ['Z_*', 'Y_*']); // true
     */
    public static matches(sValue: string, aPatterns?: unknown[]): boolean;
}
/**
 * Function helpers.
 *
 * @class
 * @public
 */
export class fn {
    /**
     * Wraps an async function so that it runs once: every call gets the same promise, also calls while the first one
     * runs. A rejected run is forgotten, so the next call runs it again. `reset()` forgets a result.
     *
     * @public
     * @static
     * @template T
     * @param {(...aArgs: any[]) => Promise<T>} fRun - The function; the arguments of the first call are used.
     * @returns {((...aArgs: any[]) => Promise<T>) & { reset: () => void }} The wrapper.
     * @example
     * const exchangeRates = utils.fn.once(async () => loadExchangeRates());
     * await exchangeRates(); // reads
     * await exchangeRates(); // the same result
     */
    public static once<T>(fRun: (...aArgs: any[]) => Promise<T>): ((...aArgs: any[]) => Promise<T>) & {
        reset: () => void;
    };
}
/**
 * UUID handles UUID related API's.
 *
 * @class
 * @public
 */
export class UUID {
    /**
     * Internal configuration — not part of public API.
     *
     * @private
     * @static
     */
    private static "__#private@#instance";
    /**
     * Suffixes a PersonWorkAgreementExternalID may end with. The suffix is not written into the UUID: its position in
     * this list is (see `#slots`). Append only: reordering or removing an entry changes what stored UUIDs decode to.
     * No suffix may end another one.
     *
     * @private
     * @static
     */
    private static "__#private@#suffixes";
    /**
     * The characters each marker slot of the UUID (the first character of its 2nd, 3rd and 4th group) may hold: any
     * hex digit, the UUID version 1-8, the variant 8-b. Together they number 16 * 8 * 4 = 512 codes.
     *
     * @private
     * @static
     */
    private static "__#private@#slotChars";
    /**
     * The code of the markers 2-4-8, which mean "no suffix" (every UUID made before the suffixes): 2 * 32 + 3 * 4 + 0.
     *
     * @private
     * @static
     */
    private static "__#private@#noSuffix";
    /**
     * The three marker characters of a suffix: `''` gives 2-4-8, the n-th suffix of `#suffixes` the n-th code after it.
     *
     * @private
     * @param {string} sSuffix - '' or an entry of `#suffixes`
     * @returns {string[]} the characters of the three slots
     */
    private static "__#private@#slots";
    /**
     * The suffix the marker slots of a UUID stand for: '' for 2-4-8, `undefined` for markers of no suffix.
     *
     * @private
     * @param {string} sUUID - a UUID string
     * @returns {string|undefined} the suffix
     */
    private static "__#private@#suffixOf";
    /**
     * Whether a value is a UUID string (RFC 9562, any version, also the nil and max UUID), e.g. an ID from a request.
     *
     * @public
     * @static
     * @param {unknown} vValue - The value to check.
     * @returns {boolean} `true` for a UUID string.
     * @example
     * UUID.isValid('c0656612-2e12-4345-8670-000000012345'); // true
     * UUID.isValid('abc');                                   // false
     */
    public static isValid(vValue: unknown): boolean;
    /** Internal configuration — not part of public API @private @type {object} */
    private _Config;
    /** Returns a UUID representation of the input Json Data
     * @param {object} oJsonData - Json Object that reperesents data for converting it into UUID
     * @returns {string} UUID
     */
    converse(oJsonData: object): string;
    /** Returns the UUID of the input Json Data, or `undefined` when a field does not fit its format (instead of throwing
     * like `converse`).
     * @param {object} oJsonData - Json Object that reperesents data for converting it into UUID
     * @returns {string|undefined} UUID, or `undefined`
     */
    tryConverse(oJsonData: object): string | undefined;
    /** Returns the fields encoded in the UUID when every field fits its format, else `undefined`. Unlike `inverse`, a
     * UUID of the right shape whose fields do not fit (or no UUID at all) gives no partial or empty object.
     * @template {object} [T=Record<string, string>] - the key type of the application, e.g. `toKeys<OrderKey>(id)`
     * @param {string} sUUID - UUID representation of json data
     * @returns {T|undefined} - the key fields of the layout (field name -> value), or `undefined`
     */
    toKeys<T extends unknown = Record<string, string>>(sUUID: string): T | undefined;
    /** Returns a Json Data representation of the input UUID
     * @returns {object} - Json Object that reperesents data generated from UUID
     * @param {string} sUUID - UUID representation of json data
     */
    inverse(sUUID: string): object;
}
/**
 * Tagged template for log output: renders only the interpolated values and joins them with `" | "`.
 * `undefined` becomes `"undefined"`, an array its length, an object indented JSON; anything else is kept as is.
 * The literal parts of the template are ignored.
 *
 * @example
 * logger.debug(oRequest, "handleRead", "END", _LOG`${oResult}`);
 * @public
 * @type {(strings: TemplateStringsArray, ...values: any[]) => string}
 */
export const _LOG: (strings: TemplateStringsArray, ...values: any[]) => string;
//# sourceMappingURL=index.d.ts.map