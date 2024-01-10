/**
 * @license
 * Copyright 2021 Google LLC
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
import { Value } from '../protos/firestore_proto_api';
import { DirectionalIndexByteEncoder } from './directional_index_byte_encoder';
/** Firestore index value writer.  */
export declare class FirestoreIndexValueWriter {
    static INSTANCE: FirestoreIndexValueWriter;
    private constructor();
    /** Writes an index value.  */
    writeIndexValue(value: Value, encoder: DirectionalIndexByteEncoder): void;
    private writeIndexValueAux;
    private writeIndexString;
    private writeUnlabeledIndexString;
    private writeIndexMap;
    private writeIndexArray;
    private writeIndexEntityRef;
    private writeValueTypeLabel;
    private writeTruncationMarker;
}
