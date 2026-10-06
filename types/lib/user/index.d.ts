/**
 * Attributes of `req.user.attr` after enrichment: the profile of the provider merged with the token attributes.
 * Pass your own profile shape to type it, e.g. `EsiUserAttributes<{ Profile: { Roles: string[] } }>`.
 */
export type EsiUserAttributes<T extends Record<string, any> = Record<string, any>> = T & {
    email?: string;
    [key: string]: any;
};
/**
 * Argument of a provider function.
 */
export type EsiUserProviderContext = {
    /**
     * The authenticated `cds.User` (read only: do not change it).
     */
    user: object;
    /**
     * The tenant of the request.
     */
    tenant?: string;
    /**
     * The login email of the authenticated user.
     */
    email?: string;
};
/**
 * Loads the business profile of a user. Returns `null` / `undefined` when there is none. It runs in its own root
 * transaction as the same user and tenant.
 */
export type EsiUserProvider = (context: EsiUserProviderContext) => Promise<Record<string, any> | null | undefined> | Record<string, any> | null | undefined;
/**
 * Counters of the profile cache.
 */
export type EsiUserStats = {
    /**
     * Entries in the cache (found and not found).
     */
    size: number;
    /**
     * Lookups answered from the cache or from a running lookup.
     */
    hits: number;
    /**
     * Lookups that called the provider.
     */
    misses: number;
    /**
     * Provider calls running now.
     */
    inFlight: number;
};
export namespace user {
    function provider(fProvider: EsiUserProvider): void;
    function enrich(oUser: object, sTenant?: string): Promise<boolean>;
    function invalidate(sUserId?: string, sTenant?: string): void;
    function stats(): EsiUserStats;
}
//# sourceMappingURL=index.d.ts.map