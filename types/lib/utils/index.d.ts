/**
 * Date utility class providing date validation helpers.
 * @class
 * @public
 */
export class date {
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
    /** Internal configuration — not part of public API @private @type {object} */
    private _Config;
    /** Returns a UUID representation of the input Json Data
     * @param {object} oJsonData - Json Object that reperesents data for converting it into UUID
     * @returns {string} UUID
     */
    converse(oJsonData: object): string;
    /** Returns a Json Data representation of the input UUID
     * @returns {object} - Json Object that reperesents data generated from UUID
     * @param {string} sUUID - UUID representation of json data
     */
    inverse(sUUID: string): object;
}
export { _LOG };
//# sourceMappingURL=index.d.ts.map