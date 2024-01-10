/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Enumerations used for upload tasks.
 */
/**
 * An event that is triggered on a task.
 * @internal
 */
export declare type TaskEvent = string;
/**
 * An event that is triggered on a task.
 * @internal
 */
export declare const TaskEvent: {
    /**
     * For this event,
     * <ul>
     *   <li>The `next` function is triggered on progress updates and when the
     *       task is paused/resumed with an `UploadTaskSnapshot` as the first
     *       argument.</li>
     *   <li>The `error` function is triggered if the upload is canceled or fails
     *       for another reason.</li>
     *   <li>The `complete` function is triggered if the upload completes
     *       successfully.</li>
     * </ul>
     */
    STATE_CHANGED: string;
};
/**
 * Internal enum for task state.
 */
export declare const enum InternalTaskState {
    RUNNING = "running",
    PAUSING = "pausing",
    PAUSED = "paused",
    SUCCESS = "success",
    CANCELING = "canceling",
    CANCELED = "canceled",
    ERROR = "error"
}
/**
 * Represents the current state of a running upload.
 * @internal
 */
export declare type TaskState = (typeof TaskState)[keyof typeof TaskState];
/**
 * Represents the current state of a running upload.
 * @internal
 */
export declare const TaskState: {
    /** The task is currently transferring data. */
    readonly RUNNING: "running";
    /** The task was paused by the user. */
    readonly PAUSED: "paused";
    /** The task completed successfully. */
    readonly SUCCESS: "success";
    /** The task was canceled. */
    readonly CANCELED: "canceled";
    /** The task failed with an error. */
    readonly ERROR: "error";
};
export declare function taskStateFromInternalTaskState(state: InternalTaskState): TaskState;
