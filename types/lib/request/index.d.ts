/**
 * A message for the client: `message` and `code`.
 */
export type EsiMessage = {
    /**
     * The text.
     */
    message: string;
    /**
     * The message key or code.
     */
    code?: string;
};
/**
 * One entry of {@link request.errorDetails}.
 */
export type EsiErrorDetail = {
    /**
     * The (translated) text.
     */
    message: string;
    /**
     * The message key or code.
     */
    code?: string;
    /**
     * The element the error is about.
     */
    target?: string;
    /**
     * The HTTP status.
     */
    status?: number;
};
/**
 * A text bundle as CAP creates it (`cds.i18n.bundle4(...)`, `cds.i18n.messages`): `at(key, args)` answers the key itself
 * (or `undefined`) when it has no text for it.
 */
export type EsiTextBundle = {
    at: (sKey: string, aArgs?: any) => string | undefined;
};
/**
 * A logger with an `error` method (`cds.log(...)`).
 */
export type EsiErrorLogger = {
    error: (...aArgs: any[]) => void;
};
export namespace request {
    function headers(oRequest: any): Record<string, string>;
    function actingUser(oRequest: any, sHeader: string): string | undefined;
    function addError(oRequest: any, oLog: EsiErrorLogger, oError: {
        message: string;
        target?: string;
        status?: number;
        code?: string;
        args?: unknown[];
    }, sLogText?: string): void;
    function failOnErrors(oRequest: any): void;
    function translate(oBundle: EsiTextBundle, sMessage: string, aArgs?: unknown[], sCode?: string): EsiMessage;
    function errorDetails(oError: any, fTranslate?: (sMessage: string, aArgs?: unknown[], sCode?: string) => EsiMessage): EsiErrorDetail[];
    function guard<T>(oRequest: any, fRun: () => T | Promise<T>, oOptions?: {
        log?: EsiErrorLogger;
        status?: number;
        message?: string;
    }): Promise<T | undefined>;
}
//# sourceMappingURL=index.d.ts.map