#include "lmdb-js.h"
#include <atomic>
#include <string.h>
#include <stdio.h>
#include <node_version.h>
#include <time.h>

using namespace Napi;

static thread_local char* globalUnsafePtr;
static thread_local size_t globalUnsafeSize;

void setupExportMisc(Napi::Env env, Object exports) {
	Object versionObj = Object::New(env);

	int major, minor, patch;
	char *str = mdb_version(&major, &minor, &patch);
	versionObj.Set("versionString", String::New(env, str));
	versionObj.Set("major", Number::New(env, major));
	versionObj.Set("minor", Number::New(env, minor));
	versionObj.Set("patch", Number::New(env, patch));
	#if ENABLE_V8_API
   versionObj.Set("nodeCompiledVersion", Number::New(env, NODE_MAJOR_VERSION));
	#endif

	exports.Set("version", versionObj);
	EXPORT_NAPI_FUNCTION("setGlobalBuffer", setGlobalBuffer)
	EXPORT_NAPI_FUNCTION("lmdbError", lmdbError)
	EXPORT_NAPI_FUNCTION("enableDirectV8", enableDirectV8)
	EXPORT_NAPI_FUNCTION("createBufferForAddress", createBufferForAddress);
	EXPORT_NAPI_FUNCTION("getAddress", getAddress);
	EXPORT_NAPI_FUNCTION("getBufferAddress", getBufferAddress);
	EXPORT_NAPI_FUNCTION("detachBuffer", detachBuffer);
	EXPORT_NAPI_FUNCTION("startRead", startRead);
	EXPORT_NAPI_FUNCTION("setReadCallback", setReadCallback);
	EXPORT_NAPI_FUNCTION("enableThreadSafeCalls", enableThreadSafeCalls);
	napi_value globalBuffer;
	napi_create_buffer(env, SHARED_BUFFER_THRESHOLD, (void**) &globalUnsafePtr, &globalBuffer);
	globalUnsafeSize = SHARED_BUFFER_THRESHOLD;
	exports.Set("globalBuffer", Object(env, globalBuffer));
}

void setFlagFromValue(int *flags, int flag, const char *name, bool defaultValue, Object options) {
	Value opt = options.Get(name);
	if (opt.IsBoolean() ? opt.As<Boolean>().Value() : defaultValue)
		*flags |= flag;
}
/*
Value valToStringUnsafe(MDB_val &data) {
	auto resource = new CustomExternalOneByteStringResource(&data);
	auto str = Nan::New<v8::String>(resource);

	return str.ToLocalChecked();
}*/

Value valToUtf8(Env env, MDB_val &data) {
	return String::New(env, (const char*) data.mv_data, data.mv_size);
}

Value valToString(Env env, MDB_val &data) {
	// UTF-16 buffer
	const uint16_t *buffer = reinterpret_cast<const uint16_t*>(data.mv_data);
	// Number of UTF-16 code points
	size_t n = data.mv_size / sizeof(uint16_t);
	
	// Check zero termination
	if (n < 1 || buffer[n - 1] != 0) {
		return throwError(env, "Invalid zero-terminated UTF-16 string");
	}
	
	size_t length = n - 1;
	return String::New(env, (const char16_t*)data.mv_data, length);
}

bool valToBinaryFast(MDB_val &data, DbiWrap* dw) {
	Compression* compression = dw->compression;
	if (compression) {
		if (data.mv_data == compression->decompressTarget) {
			// already decompressed to the target, nothing more to do
		} else {
			if (data.mv_size > compression->decompressSize) {
				// indicates we could not copy, won't fit
				return false;
			}
			// copy into the buffer target
			memcpy(compression->decompressTarget, data.mv_data, data.mv_size);
		}
	} else {
		if (data.mv_size > globalUnsafeSize) {
			// indicates we could not copy, won't fit
			return false;
		}
		memcpy(globalUnsafePtr, data.mv_data, data.mv_size);
	}
	return true;
}
Value valToBinaryUnsafe(MDB_val &data, DbiWrap* dw, Env env) {
	valToBinaryFast(data, dw);
	return Number::New(env, data.mv_size);
}


int getVersionAndUncompress(MDB_val &data, DbiWrap* dw) {
	//fprintf(stdout, "uncompressing %u\n", compressionThreshold);
	unsigned char* charData = (unsigned char*) data.mv_data;
	if (dw->hasVersions) {
		memcpy((dw->ew->keyBuffer + 16), charData, 8);
//		fprintf(stderr, "getVersion %u\n", lastVersion);
		charData = charData + 8;
		data.mv_data = charData;
		data.mv_size -= 8;
	}
	if (data.mv_size == 0) {
		return 1;// successFunc(data);
	}
	unsigned char statusByte = dw->compression ? charData[0] : 0;
		//fprintf(stdout, "uncompressing status %X\n", statusByte);
	if (statusByte >= 250) {
		bool isValid;
		dw->compression->decompress(data, isValid, !dw->getFast);
		return isValid ? 2 : 0;
	}
	return 1;
}

NAPI_FUNCTION(lmdbError) {
	ARGS(1)
	int32_t error_code;
	GET_INT32_ARG(error_code, 0);
	return throwLmdbError(env, error_code);
}

NAPI_FUNCTION(setGlobalBuffer) {
	ARGS(1)
	napi_get_buffer_info(env, args[0], (void**) &globalUnsafePtr, &globalUnsafeSize);
	RETURN_UNDEFINED
}

/*Value getBufferForAddress) {
	char* address = (char*) (size_t) Nan::To<v8::Number>(info[0]).ToLocalChecked()->Value();
	std::unique_ptr<v8::BackingStore> backing = v8::ArrayBuffer::NewBackingStore(
	address, 0x100000000, [](void*, size_t, void*){}, nullptr);
	auto array_buffer = v8::ArrayBuffer::New(Isolate::GetCurrent(), std::move(backing));
	info.GetReturnValue().Set(array_buffer);
}*/
NAPI_FUNCTION(createBufferForAddress) {
	ARGS(2)
	GET_INT64_ARG(0)
	void* data = (void*) i64;   
	uint32_t length;
	GET_UINT32_ARG(length, 1);
	napi_create_external_buffer(env, length, data, nullptr, nullptr, &returnValue);
	return returnValue;
}

NAPI_FUNCTION(getAddress) {
	ARGS(1)
	void* data;
	size_t length;
	napi_get_arraybuffer_info(env, args[0], &data, &length);
	napi_create_double(env, (double) (size_t) data, &returnValue);
	return returnValue;
}

NAPI_FUNCTION(getBufferAddress) {
	ARGS(1)
	void* data;
	size_t length;
	napi_get_buffer_info(env, args[0], &data, &length);
	napi_create_double(env, (double) (size_t) data, &returnValue);
	return returnValue;
}

NAPI_FUNCTION(detachBuffer) {
	ARGS(1)
	#if (NAPI_VERSION > 6)
	napi_detach_arraybuffer(env, args[0]);
	#endif
	RETURN_UNDEFINED;
}

class ReadWorker : public AsyncWorker {
  public:
	ReadWorker(uint32_t* start, const Function& callback)
	  : AsyncWorker(callback), start(start) {}

	void Execute() {
		uint32_t instruction;
		uint32_t* gets = start;
		while((instruction = std::atomic_exchange((std::atomic<uint32_t>*)(gets + 2), (uint32_t)0xf0000000))) {

			MDB_val key;
			key.mv_size = *(gets + 3);
			MDB_dbi dbi = (MDB_dbi) (instruction & 0xffff);
			MDB_val data;
			MDB_txn* txn = (MDB_txn*) (size_t) *((double*)gets);
			
			unsigned int flags;
			mdb_dbi_flags(txn, dbi, &flags);
			bool dupSort = flags & MDB_DUPSORT;
			int effected = 0;
			MDB_cursor *cursor;
			int rc = mdb_cursor_open(txn, dbi, &cursor);
			if (rc)
				return SetError(mdb_strerror(rc));

			key.mv_data = (void*) gets;
			rc = mdb_cursor_get(cursor, &key, &data, MDB_SET_KEY);
			MDB_env* env = mdb_txn_env(txn);
			*(gets + 3) = data.mv_size;
			*((double*)gets) = (double) (size_t) data.mv_data;
			gets += (key.mv_size + 28) >> 2;
			while (!rc) {
				// access one byte from each of the pages to ensure they are in the OS cache,
				// potentially triggering the hard page fault in this thread
				int pages = (data.mv_size + 0xfff) >> 12;
				// TODO: Adjust this for the page headers, I believe that makes the first page slightly less 4KB.
				for (int i = 0; i < pages; i++) {
					effected += *(((uint8_t*)data.mv_data) + (i << 12));
				}
				if (dupSort) // in dupsort databases, access the rest of the values
					rc = mdb_cursor_get(cursor, &key, &data, MDB_NEXT_DUP);
				else
					rc = 1; // done

			}
			mdb_cursor_close(cursor);
		}
	}

	void OnOK() {
		// TODO: For each entry, find the shared buffer
		uint32_t* gets = start;
		// EnvWrap::toSharedBuffer();
		Callback().Call({Env().Null()});
	}

  private:
	uint32_t* start;
};
typedef struct { // this is read results data buffer that is actively being used by a JS thread (read results are written to it)
	int id;
	char* data;
	uint32_t offset;
	uint32_t size;
} read_results_buffer_t;

static thread_local std::unordered_map<void*, read_results_buffer_t*>* buffersByWorker;

typedef struct {
	napi_ref callback;
	napi_ref resource;
} read_callback_t;
static int next_buffer_id = -1;
typedef struct {
	uint32_t* instructionAddress;
	uint32_t callback_id;
	napi_async_work work;
	//napi_deferred deferred;
	js_buffers_t* buffers;
} read_instruction_t;
const uint32_t ZERO = 0;
void do_read(napi_env nenv, void* instruction_pointer) {
	read_instruction_t* readInstruction = (read_instruction_t*) instruction_pointer;
	//fprintf(stderr, "lock %p\n", &readInstruction->buffers->modification_lock);
	uint32_t* instruction = readInstruction->instructionAddress;
	MDB_val key;
	key.mv_size = *(instruction + 3);
	MDB_dbi dbi = (MDB_dbi) (*(instruction + 2) & 0xffff) ;
	MDB_val data;
	TxnWrap* tw = (TxnWrap*) (size_t) *((double*)instruction);
	MDB_txn* txn = tw->txn;
	mdb_txn_renew(txn);
	unsigned int flags;
	mdb_dbi_flags(txn, dbi, &flags);
	bool dupSort = flags & MDB_DUPSORT;
	int effected = 0;
	MDB_cursor *cursor;
	MDB_env* env = mdb_txn_env(txn);
	int rc = mdb_cursor_open(txn, dbi, &cursor);
	if (rc) {
		*instruction = rc;
		return;
	}
	key.mv_data = (void*) (instruction + 4);
	rc = mdb_cursor_get(cursor, &key, &data, MDB_SET_KEY);
	*(instruction + 3) = data.mv_size;

	//instruction += (key.mv_size + 28) >> 2;
	while (!rc) {
		// access one byte from each of the pages to ensure they are in the OS cache,
		// potentially triggering the hard page fault in this thread
		int pages = (data.mv_size + 0xfff) >> 12;
		// TODO: Adjust this for the page headers, I believe that makes the first page slightly less than 4KB.
		for (int i = 0; i < pages; i++) {
			effected += *(((uint8_t*)data.mv_data) + (i << 12));
		}
		if (dupSort) // in dupsort databases, access the rest of the values
			rc = mdb_cursor_get(cursor, &key, &data, MDB_NEXT_DUP);
		else
			rc = 1; // done

	}
	*instruction = rc;
	unsigned int env_flags = 0;
	mdb_env_get_flags(env, &env_flags);
	if (data.mv_size > 4096 && !(env_flags & MDB_REMAP_CHUNKS)) {
		EnvWrap::toSharedBuffer(env, instruction, data);
		*((double*)instruction) = (double) (size_t) data.mv_data;
	} else {
		if (!buffersByWorker)
			buffersByWorker = new std::unordered_map<void*, read_results_buffer_t*>;
		read_results_buffer_t* read_buffer;
		auto buffer_search = buffersByWorker->find(readInstruction->buffers);
		if (buffer_search == buffersByWorker->end()) {
			// create new one
			buffersByWorker->emplace(readInstruction->buffers, read_buffer = new read_results_buffer_t);
			read_buffer->size = 0;
			read_buffer->offset = 0; // force it re-malloc
		} else
			read_buffer = buffer_search->second;
		if ((int) read_buffer->size - (int) read_buffer->offset - 4 < (int) data.mv_size) {
			size_t size = 0x40000;// 256KB
			read_buffer->data = (char*) malloc(size);
			read_buffer->size = size;
			read_buffer->offset = 0;
			buffer_info_t buffer_info;
			buffer_info.end = read_buffer->data + size;
			buffer_info.env = nullptr;
			buffer_info.isSharedMap = false;
			pthread_mutex_lock(&readInstruction->buffers->modification_lock);
			buffer_info.id = read_buffer->id = readInstruction->buffers->nextId++;
			readInstruction->buffers->buffers.emplace(read_buffer->data, buffer_info);
			pthread_mutex_unlock(&readInstruction->buffers->modification_lock);

		}
		auto position = (uint32_t*) (read_buffer->data + read_buffer->offset);
		memcpy(position, data.mv_data, data.mv_size);
		position += (data.mv_size + 7) >> 2;
		*(instruction + 1) = read_buffer->id;
		*(instruction + 2) = read_buffer->offset;
		read_buffer->offset = (char*)position - read_buffer->data;
	}
	mdb_cursor_close(cursor);
	//fprintf(stderr, "unlock %p\n", &readInstruction->buffers->modification_lock);
}
static thread_local napi_ref* read_callback;
void read_complete(napi_env env, napi_status status, void* data) {
	read_instruction_t* readInstruction = (read_instruction_t*) data;
	napi_value callback;
	napi_get_reference_value(env, *read_callback, &callback);
	//uint32_t count;
	napi_value result;
	napi_value callback_id;
	napi_create_int32(env, readInstruction->callback_id, &callback_id);
	status = napi_call_function(env, callback, callback, 1, &callback_id, &result);
	napi_delete_async_work(env, readInstruction->work);
	delete readInstruction;
	//napi_resolve_deferred(env, readInstruction->deferred, resolution);
}
NAPI_FUNCTION(enableThreadSafeCalls) {
	WriteWorker::threadSafeCallsEnabled = true;
    napi_value returnValue;
	RETURN_UNDEFINED;
}

NAPI_FUNCTION(setReadCallback) {
	ARGS(1)
	read_callback = new napi_ref;
	napi_create_reference(env, args[0], 1, read_callback);
	RETURN_UNDEFINED;
}
NAPI_FUNCTION(startRead) {
	ARGS(4)
	GET_INT64_ARG(0);
	uint32_t* instructionAddress = (uint32_t*) i64;
	read_instruction_t* readInstruction = new read_instruction_t;
	readInstruction->instructionAddress = instructionAddress;
	uint32_t callback_id;
	GET_UINT32_ARG(callback_id, 1);
	//napi_create_reference(env, args[1], 1, &readInstruction->callback);
	readInstruction->callback_id = callback_id;
	readInstruction->buffers = EnvWrap::sharedBuffers;
	napi_status status;
	status = napi_create_async_work(env, args[2], args[3], do_read, read_complete, readInstruction, &readInstruction->work);
	status = napi_queue_async_work(env, readInstruction->work);
	RETURN_UNDEFINED;
}/*
NAPI_FUNCTION(nextRead) {
	ARGS(1)
	uint32_t offset;
	GET_UINT32_ARG(offset, 0);
	uint32_t* instructionAddress = (uint32_t*) currentReadAddress + offset;
	read_callback_t* callback = lastCallback;
	uint32_t count;
	napi_reference_ref(callback->env, callback->callback, &count);
	read_instruction_t* readInstruction = new read_instruction_t;
	readInstruction->instructionAddress = instructionAddress;
	readInstruction->callback = callback;
	napi_async_work work;
	napi_create_async_work(callback->env, nullptr, readInstruction, &work);
	napi_queue_async_work(env, work);
	ReadWorker* worker = new ReadWorker(instructionAddress, Function(env, args[1]));
	worker->Queue();
	RETURN_UNDEFINED;
}*/

Value lmdbNativeFunctions(const CallbackInfo& info) {
	// no-op, just doing this to give a label to the native functions
	return info.Env().Undefined();
}

Napi::Value throwLmdbError(Napi::Env env, int rc) {
	if (rc < 0 && !(rc < -30700 && rc > -30800))
		rc = -rc;
	Error error = Error::New(env, mdb_strerror(rc));
	error.Set("code", Number::New(env, rc));
	error.ThrowAsJavaScriptException();
	return env.Undefined();
}

Napi::Value throwError(Napi::Env env, const char* message) {
	Error::New(env, message).ThrowAsJavaScriptException();
	return env.Undefined();
}

int putWithVersion(MDB_txn *   txn,
		MDB_dbi	 dbi,
		MDB_val *   key,
		MDB_val *   data,
		unsigned int	flags, double version) {
	// leave 8 header bytes available for version and copy in with reserved memory
	char* sourceData = (char*) data->mv_data;
	int size = data->mv_size;
	data->mv_size = size + 8;
	int rc = mdb_put(txn, dbi, key, data, flags | MDB_RESERVE);
	if (rc == 0) {
		// if put is successful, data->mv_data will point into the database where we copy the data to
		memcpy((char*) data->mv_data + 8, sourceData, size);
		memcpy(data->mv_data, &version, 8);
		//*((double*) data->mv_data) = version; // this doesn't work on ARM v7 because it is not (guaranteed) memory-aligned
	}
	data->mv_data = sourceData; // restore this so that if it points to data that needs to be freed, it points to the right place
	return rc;
}


#ifdef _WIN32

int pthread_mutex_init(pthread_mutex_t *mutex, pthread_mutexattr_t *attr)
{
	(void)attr;

	if (mutex == NULL)
		return 1;

	InitializeCriticalSection(mutex);
	return 0;
}

int pthread_mutex_destroy(pthread_mutex_t *mutex)
{
	if (mutex == NULL)
		return 1;
	DeleteCriticalSection(mutex);
	return 0;
}

int pthread_mutex_lock(pthread_mutex_t *mutex)
{
	if (mutex == NULL)
		return 1;
	EnterCriticalSection(mutex);
	return 0;
}

int pthread_mutex_unlock(pthread_mutex_t *mutex)
{
	if (mutex == NULL)
		return 1;
	LeaveCriticalSection(mutex);
	return 0;
}

int cond_init(pthread_cond_t *cond)
{
	if (cond == NULL)
		return 1;
	InitializeConditionVariable(cond);
	return 0;
}

int pthread_cond_destroy(pthread_cond_t *cond)
{
	/* Windows does not have a destroy for conditionals */
	(void)cond;
	return 0;
}

int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mutex)
{
	if (cond == NULL || mutex == NULL)
		return 1;
	if (!SleepConditionVariableCS(cond, mutex, INFINITE))
		return 1;
	return 0;
}

int cond_timedwait(pthread_cond_t *cond, pthread_mutex_t *mutex, uint64_t ms)
{
	if (cond == NULL || mutex == NULL)
		return 1;
	if (!SleepConditionVariableCS(cond, mutex, ms))
		return 1;
	return 0;
}

int pthread_cond_signal(pthread_cond_t *cond)
{
	if (cond == NULL)
		return 1;
	WakeConditionVariable(cond);
	return 0;
}

int pthread_cond_broadcast(pthread_cond_t *cond)
{
	if (cond == NULL)
		return 1;
	WakeAllConditionVariable(cond);
	return 0;
}

uint64_t get_time64() {
    return GetTickCount64();
}

#else
int cond_init(pthread_cond_t *cond) {
    pthread_condattr_t attr;
    pthread_condattr_init( &attr);
    #if defined(__linux)
    // only tested in linux, not available on macos
    pthread_condattr_setclock( &attr, CLOCK_MONOTONIC);
    #endif
    return pthread_cond_init(cond, &attr);
}

int cond_timedwait(pthread_cond_t *cond, pthread_mutex_t *mutex, uint64_t cms)
{
	struct timespec ts;
    #if defined(__linux)
	clock_gettime(CLOCK_MONOTONIC, &ts);
	#else
	// without being able to set the clock for condition/mutexes, need to use default realtime clock on macos
	clock_gettime(CLOCK_REALTIME, &ts);
	#endif
	uint64_t ns = ts.tv_nsec + cms * 10000;
	ts.tv_sec += ns / 1000000000;
	ts.tv_nsec = ns % 1000000000;
	return pthread_cond_timedwait(cond, mutex, &ts);
}

uint64_t get_time64() {
    struct timespec time;
    clock_gettime(CLOCK_MONOTONIC, &time);
    return time.tv_sec * 1000000000ll + time.tv_nsec;
}
#endif

// This file contains code from the node-lmdb project
// Copyright (c) 2013-2017 Timur Kristóf
// Copyright (c) 2021 Kristopher Tate
// Licensed to you under the terms of the MIT license
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

