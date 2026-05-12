/**
 * - Request Object
 */
export type Request = any;
export namespace query {
    namespace DELETE {
        function getKeyPropertyValueByName(oRequest: Request, sPropertyName: string): any;
    }
    namespace SELECT {
        namespace columns {
            function get(oColumns: any): any;
            function parse(oQueryString: any, oKeyFields: any): {
                ref: any[];
            }[];
            function split(sQueryString: any): string[];
            namespace _expand {
                export function parse_1(sExpand: any): {
                    ref: any[];
                };
                export { parse_1 as parse };
            }
        }
        namespace from {
            function fromable(oFrom: any, iIndex?: number): {
                clause: any;
                from: any;
                where: any;
                serviceName: any;
                entityName: any;
                Association: /*elided*/ any;
            };
        }
        namespace where {
            function _toANDArray(oWhereClause: any, bAlwwaysArray?: boolean): any[];
            function toANDArray(oWhereClause: any, bAlwwaysArray?: boolean): any[];
            function convert(oIDWhere: object, oIDColumns: object, fConvertLogic?: Function): any[];
            function add(oRequest: Request, oWhereClause: any[]): void;
            function apply(oData: any, oWhereClause: any): any;
        }
    }
}
//# sourceMappingURL=index.d.ts.map