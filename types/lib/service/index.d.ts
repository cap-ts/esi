/**
 * service module
 * @class
 * @public
 */
export class service {
    /** All Service Events
     * @public
     * @static
     * @enum {string} */
    public static events: Readonly<{
        PreBefore: "PreBefore";
        PostBefore: "PostBefore";
        PreOn: "PreOn";
        PreMeshUp: "PreMeshUp";
        PostOn: "PostOn";
        PreAfter: "PreAfter";
        PostAfter: "PostAfter";
        None: "";
    }>;
    /** This function enriches the user context with configured user function
     * @param {object} oRequest - Request Object
     */
    static enrichUserContext(oRequest: object): Promise<void>;
    static sanitizeData(oData: any, oFieldsArray: any, includeID?: boolean): any;
    static get(oRequest: any): any;
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {object} oRequest - Request Object
     * @returns {string[]}
     */
    static getEntityColumns(oService: object, oRequest: object): string[];
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {object} oRequest - Request Object
     * @param {object} oQuery - Query to be send
     */
    static sendQuery(oService: object, oRequest: object, oQuery?: object): Promise<any>;
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {object} oRequest - Request Object
     */
    static sendRequest(oService: object, oRequest: object): Promise<any>;
    /**
     * @param {object} oService - Service object for which request to be executed
     * @param {object} oRequest - Request Object
     */
    static executeRequest(oService: object, oRequest: object): Promise<any>;
    /**
     * @param {object} oRequest - Request Object
     * @param {object} oJsonData - JSON Data
     * @param {(error: Error) => Promise<void>} [onError] - Optional async error handler. Defaults to an empty async function.
     */
    static executeIflow(oRequest: object, oJsonData: object, onError?: (error: Error) => Promise<void>): Promise<void>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     */
    static handleReadByID(oService: object, oRequest: object, oID: any): Promise<any>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     */
    static handleDeleteByID(oService: object, oRequest: object, oID: any): Promise<any>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     * @param {function} fEventHandler - function to be called before Event for data handling
     */
    static handleEvent(oService: object, oRequest: object, fEventHandler?: Function): Promise<any>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     * @param {function} fPreInsert - function to be called before insert
     */
    static handleCreate(oService: object, oRequest: object, fPreInsert?: Function): Promise<any>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     * @param {function} fPreInsert - function to be called before insert
     */
    static handleInsert(oService: object, oRequest: object, fPreInsert?: Function): Promise<any>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     * @param {function} fPreUpdate - function to be called before Update
     */
    static handleUpdate(oService: object, oRequest: object, fPreUpdate: Function, oWhere: any, isOldDataRequired?: boolean): Promise<any>;
    /**
     * @param {object} oData - Data Result
     * @param {object} oRequest - Request Object
     */
    static handleCount(oData: object, oRequest: object): Promise<void>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     */
    static handlePostOn(oService: object, oRequest: object): Promise<any[]>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     */
    static handleHandler(oService: object, oRequest: object): Promise<any>;
    /**
     * @param {object} oService - Service Object
     * @param {object} oRequest - Request Object
     * @param {function} fNextHandler - Alternate handler method
     */
    static handleRead(oService: object, oRequest: object, fNextHandler: Function): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map