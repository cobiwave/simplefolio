import { AsyncQueue } from '../util/async_queue';
import { LocalStore } from './local_store';
import { Persistence, Scheduler } from './persistence';
/** This class is responsible for the scheduling of Index Backfiller. */
export declare class IndexBackfillerScheduler implements Scheduler {
    private readonly asyncQueue;
    private readonly backfiller;
    private task;
    constructor(asyncQueue: AsyncQueue, backfiller: IndexBackfiller);
    start(): void;
    stop(): void;
    get started(): boolean;
    private schedule;
}
/** Implements the steps for backfilling indexes. */
export declare class IndexBackfiller {
    /**
     * LocalStore provides access to IndexManager and LocalDocumentView.
     * These properties will update when the user changes. Consequently,
     * making a local copy of IndexManager and LocalDocumentView will require
     * updates over time. The simpler solution is to rely on LocalStore to have
     * an up-to-date references to IndexManager and LocalDocumentStore.
     */
    private readonly localStore;
    private readonly persistence;
    constructor(
    /**
     * LocalStore provides access to IndexManager and LocalDocumentView.
     * These properties will update when the user changes. Consequently,
     * making a local copy of IndexManager and LocalDocumentView will require
     * updates over time. The simpler solution is to rely on LocalStore to have
     * an up-to-date references to IndexManager and LocalDocumentStore.
     */
    localStore: LocalStore, persistence: Persistence);
    backfill(maxDocumentsToProcess?: number): Promise<number>;
    /** Writes index entries until the cap is reached. Returns the number of documents processed. */
    private writeIndexEntries;
    /**
     * Writes entries for the provided collection group. Returns the number of documents processed.
     */
    private writeEntriesForCollectionGroup;
    /** Returns the next offset based on the provided documents. */
    private getNewOffset;
}
