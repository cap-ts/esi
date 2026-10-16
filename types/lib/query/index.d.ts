/**
 * - CDS Request Object containing query information
 */
export type Request = {
    /**
     * - The parsed CDS query object
     */
    query: {
        SELECT?: {
            columns?: any[];
            from?: any;
            where?: any[];
        };
        DELETE?: {
            from?: any;
        };
    };
};
/**
 * - A single WHERE condition tuple
 */
export type WhereCondition = {
    /**
     * 0 - Operand with ref array (e.g., {ref: ['fieldName']})
     */
    "": any;
};
/**
 * - How a field is sent in the interval selection of an SAP enterprise service
 */
export type IntervalField = {
    /**
     * - The interval element, e.g. `'DocumentIDInterval'`
     */
    Name: string;
    /**
     * - Its lower-boundary element, e.g. `'LowerBoundaryDocumentID'`
     */
    Parameter: string;
    /**
     * - The operators the service accepts for the field (default: `=`, `<`, `<=`, `>`, `>=`, `in`)
     */
    operators?: string[];
};
/**
 * - Result of `SELECT.where.toIntervals`
 */
export type IntervalSelection = {
    /**
     * - Per interval element, its intervals `{ IntervalBoundaryTypeCode, <Parameter>: value }`
     */
    intervals: Record<string, any[]>;
    /**
     * - Every condition was translated, and no field twice: the service applies the whole WHERE
     */
    complete: boolean;
};
/**
 * - A column reference object
 */
export type ColumnRef = {
    /**
     * - Array of reference path segments
     */
    ref: string[];
    /**
     * - Column alias
     */
    as?: string;
    /**
     * - Expanded sub-columns
     */
    expand?: any[];
};
/**
 * - Parsed FROM clause result
 */
export type Fromable = {
    /**
     * - Original FROM clause
     */
    clause: any;
    /**
     * - Full entity path
     */
    from?: string;
    /**
     * - Service name (if qualified)
     */
    serviceName?: string;
    /**
     * - Entity name
     */
    entityName?: string;
    /**
     * - WHERE clause from keyed access
     */
    where?: any[];
    /**
     * - Nested association fromable
     */
    Association?: any;
};
export namespace query {
    function keyOf(oRequest: Request & {
        data?: Record<string, any>;
        params?: any[];
    }, sName: string): any;
    namespace DELETE {
        function getKeyPropertyValueByName(oRequest: Request, sPropertyName: string): string | undefined;
    }
    namespace SELECT {
        namespace columns {
            let DRAFT: readonly string[];
            function expand(oEntity: {
                associations?: Record<string, unknown>;
            }, aAllowed: string[]): Array<string | ColumnRef>;
            function ensure(aColumns: Array<string | ColumnRef> | undefined, aNeeded: string[]): {
                columns: Array<string | ColumnRef> | undefined;
                requested: string[] | undefined;
            };
            function without(aColumns: Array<string | ColumnRef> | undefined, aNames: readonly string[]): Array<string | ColumnRef> | undefined;
            function has(oRequest: Request, sPropertyName: string, sAssociationName?: string): boolean;
            function get(oColumns: Array<ColumnRef | string>): string | string[] | undefined;
            function parse(oQueryString: {
                $select?: string;
                $expand?: string;
            }, oKeyFields?: string | string[]): Array<ColumnRef> | undefined;
            function split(sQueryString: string): string[];
            namespace _expand {
                export function parse_1(sExpand: string): ColumnRef | undefined;
                export { parse_1 as parse };
            }
        }
        namespace search {
            function text(aSearch: any[] | undefined): string | undefined;
        }
        function processingConditions(oSelect: {
            limit?: {
                rows?: {
                    val?: number;
                };
            };
        } | undefined, iPageSize?: number): {
            QueryHitsTotalNumberIndicator: boolean;
            QueryHitsMaximumNumberValue: number;
            QueryHitsCountIndicator: boolean;
            QueryHitsUnlimitedIndicator: boolean;
        };
        namespace from {
            function fromable(oFrom: {
                ref: any[];
            }, iIndex?: number): Fromable;
        }
        namespace where {
            export function anyEqual(sName: string, aValues: any[]): any[];
            export function allEqual(oValues: Record<string, any>): any[];
            export function between(sName: string, vLow: any, vHigh: any): any[];
            export function inList(sName: string, aValues: any[]): any[];
            export function fromValueRanges(sName: string, aRanges: {
                Low?: any;
                High?: any;
            }[], oOptions?: {
                nullValues?: any[];
                defaultLow?: any;
            }): any[];
            export function termsOf(oQuery: object | undefined): any[][];
            export function hasValues(vWhere?: any[] | {
                xpr: any[];
            }, sName: string): boolean;
            export function equalities(vWhere?: any[] | {
                xpr: any[];
            }): Record<string, any>;
            export function toMonthRange(aWhere: any[] | undefined, sName: string): void;
            export function _toANDArray(oWhereClause: any[], bAlwwaysArray?: boolean): any[] | undefined;
            export function toANDArray(oWhereClause: any[], bAlwwaysArray?: boolean): Array<WhereCondition[]> | undefined;
            export function terms(aWhere?: any[]): any[][];
            export function fromTerms(aTerms: any[][]): any[];
            export function isEqual(aTerm: any[], sName: string): boolean;
            export function toEqual(aTerm: any[]): any[];
            export function fieldOf(aTerm: any[]): string | undefined;
            export function fieldsOf(vWhere?: any[] | {
                xpr: any[];
            }): Array<string | undefined>;
            export function _conditionsOf(vWhere?: any[] | {
                xpr: any[];
            }): any[][];
            export function toIntervals(vWhere?: any[] | {
                xpr: any[];
            }, oFields: Record<string, IntervalField>): IntervalSelection;
            export function convert(oIDWhere: object, oIDColumns: object, fConvertLogic?: Function): any[];
            export function add(oRequest: Request, oWhereClause: any[]): void;
            export function apply(oData: any[], oWhereClause: any[]): any[];
            export function has_1(oRequest: Request, sPropertyName: string, sAssociationName?: string): boolean;
            export { has_1 as has };
            export function replaceAt(oRequest: Request, sPropertyName: string, oNewCondition: any[], sAssociationName?: string): void;
            export function appendFilterValuesAt(oRequest: Request, sPropertyName: string, oPadConfig?: any, oValues?: any[], sAssociationName?: string): void;
        }
        function getForAssociation(oRequest: Request, sAssociationName: string): ColumnRef | undefined;
    }
}
//# sourceMappingURL=index.d.ts.map