/**
 * @license
 * Copyright 2020 Google LLC.
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
declare namespace gapi {
    type LoadCallback = () => void;
    interface LoadConfig {
    }
    interface LoadOptions {
        callback?: LoadCallback;
        timeout?: number;
        ontimeout?: LoadCallback;
    }
    function load(features: 'gapi.iframes', options?: LoadOptions | LoadCallback): void;
}
declare namespace gapi.iframes {
    interface Message {
        type: string;
    }
    type IframesFilter = (iframe: Iframe) => boolean;
    type MessageHandler<T extends Message> = (message: T) => unknown | Promise<void>;
    type SendCallback = () => void;
    type Callback = (iframe: Iframe) => void;
    class Context {
        open(options: Record<string, unknown>, callback?: Callback): Promise<Iframe>;
    }
    class Iframe {
        register<T extends Message>(message: string, handler: MessageHandler<T>, filter?: IframesFilter): void;
        send<T extends Message, U extends Message>(type: string, data: T, callback?: MessageHandler<U>, filter?: IframesFilter): void;
        ping(callback: SendCallback, data?: unknown): Promise<unknown[]>;
        restyle(style: Record<string, string | boolean>, callback?: SendCallback): Promise<unknown[]>;
    }
    const CROSS_ORIGIN_IFRAMES_FILTER: IframesFilter;
    function getContext(): Context;
}
