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
    namespace DELETE {
        function getKeyPropertyValueByName(oRequest: Request, sPropertyName: string): string | undefined;
    }
    namespace SELECT {
        namespace columns {
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
        namespace from {
            function fromable(oFrom: {
                ref: any[];
            }, iIndex?: number): Fromable;
        }
        namespace where {
            export function _toANDArray(oWhereClause: any[], bAlwwaysArray?: boolean): any[] | undefined;
            export function toANDArray(oWhereClause: any[], bAlwwaysArray?: boolean): Array<WhereCondition[]> | undefined;
            export function convert(oIDWhere: object, oIDColumns: object, fConvertLogic?: Function): any[];
            export function add(oRequest: Request, oWhereClause: any[]): void;
            export function apply(oData: any[], oWhereClause: any[]): any[];
            export function has_1(oRequest: Request, sPropertyName: string, sAssociationName?: string): boolean;
            export { has_1 as has };
        }
    }
}
//# sourceMappingURL=index.d.ts.map