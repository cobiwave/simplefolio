import { ByteString } from '../util/byte_string';
/**
 * Counts the number of zeros in a byte.
 *
 * Visible for testing.
 */
export declare function numberOfLeadingZerosInByte(x: number): number;
/**
 * OrderedCodeWriter is a minimal-allocation implementation of the writing
 * behavior defined by the backend.
 *
 * The code is ported from its Java counterpart.
 */
export declare class OrderedCodeWriter {
    buffer: Uint8Array;
    position: number;
    writeBytesAscending(value: ByteString): void;
    writeBytesDescending(value: ByteString): void;
    /** Writes utf8 bytes into this byte sequence, ascending. */
    writeUtf8Ascending(sequence: string): void;
    /** Writes utf8 bytes into this byte sequence, descending */
    writeUtf8Descending(sequence: string): void;
    writeNumberAscending(val: number): void;
    writeNumberDescending(val: number): void;
    /**
     * Writes the "infinity" byte sequence that sorts after all other byte
     * sequences written in ascending order.
     */
    writeInfinityAscending(): void;
    /**
     * Writes the "infinity" byte sequence that sorts before all other byte
     * sequences written in descending order.
     */
    writeInfinityDescending(): void;
    /**
     * Resets the buffer such that it is the same as when it was newly
     * constructed.
     */
    reset(): void;
    seed(encodedBytes: Uint8Array): void;
    /** Makes a copy of the encoded bytes in this buffer.  */
    encodedBytes(): Uint8Array;
    /**
     * Encodes `val` into an encoding so that the order matches the IEEE 754
     * floating-point comparison results with the following exceptions:
     *   -0.0 < 0.0
     *   all non-NaN < NaN
     *   NaN = NaN
     */
    private toOrderedBits;
    /** Writes a single byte ascending to the buffer. */
    private writeByteAscending;
    /** Writes a single byte descending to the buffer.  */
    private writeByteDescending;
    private writeSeparatorAscending;
    private writeSeparatorDescending;
    private writeEscapedByteAscending;
    private writeEscapedByteDescending;
    private ensureAvailable;
}
