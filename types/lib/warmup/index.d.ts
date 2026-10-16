/**
 * `cds.esi.warmUp`.
 */
export type EsiWarmUpSettings = {
    /**
     * The entities: `Service.Entity` (the
     * service is the name before the last dot), or service and entity name.
     */
    entities?: Array<string | {
        service: string;
        entity: string;
    }>;
    /**
     * Seconds between two runs; choose it below the time to live of the caches.
     */
    interval?: number;
    /**
     * Default: on in a deployed application (Cloud Foundry) or with the `production` profile.
     */
    enabled?: boolean;
};
/**
 * The outcome of one entity in a run.
 */
export type EsiWarmUpResult = {
    /**
     * `Service.Entity`.
     */
    entity: string;
    /**
     * Duration.
     */
    ms: number;
    /**
     * The message of a failed read.
     */
    error?: string;
};
export namespace warmUp {
    function enabled(): boolean;
    function run(): Promise<EsiWarmUpResult[]>;
    function start(): boolean;
    function stop(): void;
}
//# sourceMappingURL=index.d.ts.map