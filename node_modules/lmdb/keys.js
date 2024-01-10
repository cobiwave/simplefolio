import { getAddress, orderedBinary } from './native.js';

const REUSE_BUFFER_MODE = 512;
const writeUint32Key = (key, target, start) => {
	(target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length))).setUint32(start, key, true);
	return start + 4;
};
const readUint32Key = (target, start) => {
	return (target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length))).getUint32(start, true);
};
const writeBufferKey = (key, target, start) => {
	target.set(key, start);
	return key.length + start;
};
const Uint8ArraySlice = Uint8Array.prototype.slice;
const readBufferKey = (target, start, end) => {
	return Uint8ArraySlice.call(target, start, end);
};

let lastEncodedValue, bytes;
export function applyKeyHandling(store) {
 	if (store.encoding == 'ordered-binary') {
		store.encoder = store.decoder = {
			writeKey: orderedBinary.writeKey,
			readKey: orderedBinary.readKey,
		};
	}
	if (store.encoder && store.encoder.writeKey && !store.encoder.encode) {
		store.encoder.encode = function(value, mode) {
			if (typeof value !== 'object' && value && value === lastEncodedValue) {
				// reuse the last serialized bytes
				// NOTE that it is very important that nothing else calls saveKey with saveTo: false
			} else {
				lastEncodedValue = value;
				bytes = saveKey(value, this.writeKey, false, store.maxKeySize);
			}
			if (bytes.end > 0 && !(REUSE_BUFFER_MODE & mode)) {
				return bytes.subarray(bytes.start, bytes.end);
			}
			return bytes;
		};
		store.encoder.copyBuffers = true; // just an indicator for the buffer reuse in write.js
	}
	if (store.decoder && store.decoder.readKey && !store.decoder.decode) {
		store.decoder.decode = function(buffer) { return this.readKey(buffer, 0, buffer.length); };
		store.decoderCopies = true;
	}
	if (store.keyIsUint32 || store.keyEncoding == 'uint32') {
		store.writeKey = writeUint32Key;
		store.readKey = readUint32Key;
	} else if (store.keyIsBuffer || store.keyEncoding == 'binary') {
		store.writeKey = writeBufferKey;
		store.readKey = readBufferKey;
	} else if (store.keyEncoder) {
		store.writeKey = store.keyEncoder.writeKey;
		store.readKey = store.keyEncoder.readKey;
	} else {
		store.writeKey = orderedBinary.writeKey;
		store.readKey = orderedBinary.readKey;
	}
}

let saveBuffer, uint32, saveDataView = { setFloat64() {}, setUint32() {} }, saveDataAddress;
let savePosition = 8000;
let DYNAMIC_KEY_BUFFER_SIZE = 8192;
function allocateSaveBuffer() {
	saveBuffer = typeof Buffer != 'undefined' ? Buffer.alloc(DYNAMIC_KEY_BUFFER_SIZE) : new Uint8Array(DYNAMIC_KEY_BUFFER_SIZE);
	uint32 = null;
	saveBuffer.buffer.address = getAddress(saveBuffer.buffer);
	saveDataAddress = saveBuffer.buffer.address;
	// TODO: Conditionally only do this for key sequences?
	saveDataView.setUint32(savePosition, 0xffffffff);
	saveDataView.setFloat64(savePosition + 4, saveDataAddress, true); // save a pointer from the old buffer to the new address for the sake of the prefetch sequences
	saveDataView = saveBuffer.dataView || (saveBuffer.dataView = new DataView(saveBuffer.buffer, saveBuffer.byteOffset, saveBuffer.byteLength));
	savePosition = 0;
}
export function saveKey(key, writeKey, saveTo, maxKeySize, flags) {
	if (savePosition > 7800) {
		allocateSaveBuffer();
	}
	let start = savePosition;
	try {
		savePosition = key === undefined ? start + 4 :
			writeKey(key, saveBuffer, start + 4);
	} catch (error) {
		saveBuffer.fill(0, start + 4); // restore zeros
		if (error.name == 'RangeError') {
			if (8180 - start < maxKeySize) {
				allocateSaveBuffer(); // try again:
				return saveKey(key, writeKey, saveTo, maxKeySize);
			}
			throw new Error('Key was too large, max key size is ' + maxKeySize);
		} else
			throw error;
	}
	let length = savePosition - start - 4;
	if (length > maxKeySize) {
		throw new Error('Key of size ' + length + ' was too large, max key size is ' + maxKeySize);
	}
	if (savePosition >= 8160) { // need to reserve enough room at the end for pointers
		savePosition = start // reset position
		allocateSaveBuffer(); // try again:
		return saveKey(key, writeKey, saveTo, maxKeySize);
	}
	if (saveTo) {
		saveDataView.setUint32(start, flags ? length | flags : length, true); // save the length
		saveTo.saveBuffer = saveBuffer;
		savePosition = (savePosition + 12) & 0xfffffc;
		return start + saveDataAddress;
	} else {
		saveBuffer.start = start + 4;
		saveBuffer.end = savePosition;
		savePosition = (savePosition + 7) & 0xfffff8; // full 64-bit word alignment since these are usually copied
		return saveBuffer;
	}
}