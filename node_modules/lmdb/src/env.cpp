    #include "lmdb-js.h"
#include <atomic>
#ifndef _WIN32
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#endif
using namespace Napi;

#define IGNORE_NOTFOUND	(1)

env_tracking_t* EnvWrap::envTracking = EnvWrap::initTracking();
thread_local std::vector<EnvWrap*>* EnvWrap::openEnvWraps = nullptr;
thread_local js_buffers_t* EnvWrap::sharedBuffers = nullptr;
//thread_local std::unordered_map<void*, buffer_info_t>* EnvWrap::sharedBuffers = nullptr;
void* getSharedBuffers() {
	return (void*) EnvWrap::sharedBuffers;
}

env_tracking_t* EnvWrap::initTracking() {
	env_tracking_t* tracking = new env_tracking_t;
	tracking->envsLock = new pthread_mutex_t;
	pthread_mutex_init(tracking->envsLock, nullptr);
	tracking->getSharedBuffers = getSharedBuffers;
	return tracking;
}
static napi_ref testRef;
static napi_env testRefEnv;
void EnvWrap::cleanupEnvWraps(void* data) {
	if (openEnvWraps)
		free(openEnvWraps);
	else
		fprintf(stderr, "How do we end up cleanup env wraps that don't exist?\n");
	openEnvWraps = nullptr;
}
EnvWrap::EnvWrap(const CallbackInfo& info) : ObjectWrap<EnvWrap>(info) {
	int rc;
	rc = mdb_env_create(&(this->env));

	if (rc != 0) {
		mdb_env_close(this->env);
		throwLmdbError(info.Env(), rc);
		return;
	}

	this->currentWriteTxn = nullptr;
	this->currentReadTxn = nullptr;
	this->writeTxn = nullptr;
	this->writeWorker = nullptr;
	this->readTxnRenewed = false;
    this->hasWrites = false;
	this->writingLock = new pthread_mutex_t;
	this->writingCond = new pthread_cond_t;
	info.This().As<Object>().Set("address", Number::New(info.Env(), (size_t) this));
	pthread_mutex_init(this->writingLock, nullptr);
	cond_init(this->writingCond);
}
MDB_env* foundEnv;
const int EXISTING_ENV_FOUND = 10;
int checkExistingEnvs(mdb_filehandle_t fd, MDB_env* env) {
	uint64_t inode, dev;
	#ifdef _WIN32
	BY_HANDLE_FILE_INFORMATION fileInformation;
	if (GetFileInformationByHandle(fd, &fileInformation)) {
		dev = fileInformation.dwVolumeSerialNumber;
		inode = ((uint64_t) fileInformation.nFileIndexHigh << 32) | fileInformation.nFileIndexLow;
	} else
		return MDB_NOTFOUND;
	#else
	struct stat sb;
	if (fstat(fd, &sb) == 0) {
		dev = sb.st_dev;
		inode = sb.st_ino;
	} else
		return MDB_NOTFOUND;
	#endif
	for (auto envRef = EnvWrap::envTracking->envs.begin(); envRef != EnvWrap::envTracking->envs.end();) {
		if (envRef->dev == dev && envRef->inode == inode) {
			envRef->count++;
			foundEnv = envRef->env;
			return EXISTING_ENV_FOUND;
		}
		++envRef;
	}
	SharedEnv envRef;
	envRef.dev = dev;
	envRef.inode = inode;
	envRef.env = env;
	envRef.count = 1;
    envRef.hasWrites = false;
	EnvWrap::envTracking->envs.push_back(envRef);
	return 0;
}

EnvWrap::~EnvWrap() {
	// Close if not closed already
	closeEnv();
	pthread_mutex_destroy(this->writingLock);
	pthread_cond_destroy(this->writingCond);
	
}

void EnvWrap::cleanupStrayTxns() {
	if (this->currentWriteTxn) {
		mdb_txn_abort(this->currentWriteTxn->txn);
		this->currentWriteTxn->removeFromEnvWrap();
	}
/*	while (this->workers.size()) { // enable this if we do need to do worker cleanup
		AsyncWorker *worker = *this->workers.begin();
		fprintf(stderr, "Deleting running worker\n");
		delete worker;
	}*/
	while (this->readTxns.size()) {
		TxnWrap *tw = *this->readTxns.begin();
		mdb_txn_abort(tw->txn);
		tw->removeFromEnvWrap();
	}
}
void EnvWrap::consolidateTxns() {
	// sort read txns by txn id, and then abort newer ones that we can just reference older ones with.

}

class SyncWorker : public AsyncWorker {
  public:
	SyncWorker(EnvWrap* env, const Function& callback)
	 : AsyncWorker(callback), env(env) {
		//env->workers.push_back(this);
	 }
	/*~SyncWorker() {
		for (auto workerRef = env->workers.begin(); workerRef != env->workers.end(); ) {
			if (this == *workerRef) {
				env->workers.erase(workerRef);
			}
		}
	}*/
	void OnOK() {
		napi_value result; // we use direct napi call here because node-addon-api interface with throw a fatal error if a worker thread is terminating
		napi_call_function(Env(), Env().Undefined(), Callback().Value(), 0, {}, &result);
	}
	void OnError(const Error& e) {
		napi_value result; // we use direct napi call here because node-addon-api interface with throw a fatal error if a worker thread is terminating
		napi_value arg = e.Value();
		napi_call_function(Env(), Env().Undefined(), Callback().Value(), 1, &arg, &result);
	}

	void Execute() {
		#ifdef _WIN32
		int rc = mdb_env_sync(env->env, 1);
		#else
		int retries = 0;
		retry:
		int rc = mdb_env_sync(env->env, 1);
#ifdef MDB_LOCK_FAILURE
		if (rc == MDB_LOCK_FAILURE) {
			if (retries++ < 4) {
				sleep(1);
				goto retry;
			}
		}
#endif
		#endif
		if (rc != 0) {
			SetError(mdb_strerror(rc));
		}
	}

  private:
	EnvWrap* env;
};

class CopyWorker : public AsyncWorker {
  public:
	CopyWorker(MDB_env* env, std::string inPath, int flags, const Function& callback)
	 : AsyncWorker(callback), env(env), path(inPath), flags(flags) {
	 }
	~CopyWorker() {
		//free(path);
	}

	void Execute() {
		int rc = mdb_env_copy2(env, path.c_str(), flags);
		if (rc != 0) {
			SetError(mdb_strerror(rc));
		}
	}

  private:
	MDB_env* env;
	std::string path;
	int flags;
};

MDB_txn* EnvWrap::getReadTxn(int64_t tw_address) {
	MDB_txn* txn;
	if (tw_address) // explicit txn
		txn = ((TxnWrap*)tw_address)->txn;
	else if (writeTxn && (txn = writeTxn->txn)) {
		return txn; // no need to renew write txn
	} else // default to current read txn
		txn = currentReadTxn;
	int rc = mdb_txn_renew(txn); // always try to renew
	if (rc) {
		if (!txn)
			fprintf(stderr, "No current read transaction available");
		if (rc != EINVAL)
			return nullptr; // if there was a real error, signal with nullptr and let error propagate with last_error
	}
	return txn;
}

#ifdef MDB_RPAGE_CACHE
static int encfunc(const MDB_val* src, MDB_val* dst, const MDB_val* key, int encdec)
{
	chacha8(src->mv_data, src->mv_size, (uint8_t*) key[0].mv_data, (uint8_t*) key[1].mv_data, (char*)dst->mv_data);
	return 0;
}
#endif

void cleanup(void* data) {
	((EnvWrap*) data)->closeEnv();
}

Napi::Value EnvWrap::open(const CallbackInfo& info) {
	int rc;
	// Get the wrapper
	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}
	Object options = info[0].As<Object>();
	int flags = info[1].As<Number>();
	int jsFlags = info[2].As<Number>();

	Compression* compression = nullptr;
	Napi::Value compressionOption = options.Get("compression");
	if (compressionOption.IsObject()) {
		napi_unwrap(info.Env(), compressionOption, (void**)&compression);
		this->compression = compression;
	}
	void* keyBuffer;
	Napi::Value keyBytesValue = options.Get("keyBytes");
	if (!keyBytesValue.IsTypedArray())
		fprintf(stderr, "Invalid key buffer\n");
	size_t keyBufferLength;
	napi_get_buffer_info(info.Env(), keyBytesValue, &keyBuffer, &keyBufferLength);
	String path = options.Get("path").As<String>();
	std::string pathString = path.Utf8Value();
	// Parse the maxDbs option
	int maxDbs = 12;
	Napi::Value option = options.Get("maxDbs");
	if (option.IsNumber())
		maxDbs = option.As<Number>();

	mdb_size_t mapSize = 0;
	// Parse the mapSize option
	option = options.Get("mapSize");
	if (option.IsNumber())
		mapSize = option.As<Number>().Int64Value();
	int pageSize = 0;
	// Parse the mapSize option
	option = options.Get("pageSize");
	if (option.IsNumber())
		pageSize = option.As<Number>();
	int maxReaders = 126;
	// Parse the mapSize option
	option = options.Get("maxReaders");
	if (option.IsNumber())
		maxReaders = option.As<Number>();

	Napi::Value encryptionKey = options.Get("encryptionKey");
	std::string encryptKey;
	if (!encryptionKey.IsUndefined()) {
		encryptKey = encryptionKey.As<String>().Utf8Value();
		if (encryptKey.length() != 32) {
			return throwError(info.Env(), "Encryption key must be 32 bytes long");
		}
		#ifndef MDB_RPAGE_CACHE
		return throwError(info.Env(), "Encryption not supported with data format version 1");
		#endif
	}

	napiEnv = info.Env();
	rc = openEnv(flags, jsFlags, (const char*)pathString.c_str(), (char*) keyBuffer, compression, maxDbs, maxReaders, mapSize, pageSize, encryptKey.empty() ? nullptr : (char*)encryptKey.c_str());
	//delete[] pathBytes;
	if (rc != 0)
		return throwLmdbError(info.Env(), rc);
	napi_add_env_cleanup_hook(napiEnv, cleanup, this);
	return info.Env().Undefined();
}
int EnvWrap::openEnv(int flags, int jsFlags, const char* path, char* keyBuffer, Compression* compression, int maxDbs,
		int maxReaders, mdb_size_t mapSize, int pageSize, char* encryptionKey) {
	this->keyBuffer = keyBuffer;
	this->compression = compression;
	this->jsFlags = jsFlags;
	#ifdef MDB_OVERLAPPINGSYNC
	MDB_metrics* metrics;
	#endif
	int rc;
	rc = mdb_env_set_maxdbs(env, maxDbs);
	if (rc) goto fail;
	rc = mdb_env_set_maxreaders(env, maxReaders);
	if (rc) goto fail;
	rc = mdb_env_set_mapsize(env, mapSize);
	if (rc) goto fail;
	#ifdef MDB_RPAGE_CACHE
	if (pageSize)
	   rc = mdb_env_set_pagesize(env, pageSize);
	if (rc) goto fail;
	#endif
	if ((size_t) encryptionKey > 100) {
		MDB_val enckey;
		enckey.mv_data = encryptionKey;
		enckey.mv_size = 32;
		#ifdef MDB_RPAGE_CACHE
		rc = mdb_env_set_encrypt(env, encfunc, &enckey, 0);
		#else
		rc = -1;
		#endif
		if (rc != 0) goto fail;
	}

	if (flags & MDB_NOLOCK) {
		fprintf(stderr, "You chose to use MDB_NOLOCK which is not officially supported by node-lmdb. You have been warned!\n");
	}
	#ifdef MDB_OVERLAPPINGSYNC
	if (flags & MDB_OVERLAPPINGSYNC) {
		flags |= MDB_PREVSNAPSHOT;
	}
	mdb_env_set_callback(env, checkExistingEnvs);
	trackMetrics = !!(flags & MDB_TRACK_METRICS);
	if (trackMetrics) {
		metrics = new MDB_metrics;
		memset(metrics, 0, sizeof(MDB_metrics));
		rc = mdb_env_set_userctx(env, (void*) metrics);
		if (rc) goto fail;
	}
	#endif

	timeTxnWaiting = 0;
	// Set MDB_NOTLS to enable multiple read-only transactions on the same thread (in this case, the nodejs main thread)
	flags |= MDB_NOTLS;
	// TODO: make file attributes configurable
	// *String::Utf8Value(Isolate::GetCurrent(), path)
	pthread_mutex_lock(envTracking->envsLock);
	rc = mdb_env_open(env, path, flags, 0664);

	if (rc != 0) {
		#ifdef MDB_OVERLAPPINGSYNC
		if (trackMetrics) {
			delete metrics;
		}
		#endif
		if (rc == EXISTING_ENV_FOUND) {
			mdb_env_close(env);
			env = foundEnv;
		} else {
			this->jsFlags |= OPEN_FAILED;
			closeEnv(true);
			pthread_mutex_unlock(envTracking->envsLock);
			goto fail;
		}
	}
	mdb_env_get_flags(env, (unsigned int*) &flags);
	if ((jsFlags & DELETE_ON_CLOSE)
	#ifdef MDB_OVERLAPPINGSYNC
	 	|| (flags & MDB_OVERLAPPINGSYNC)
	#endif
		) {
		if (!openEnvWraps) {
			openEnvWraps = new std::vector<EnvWrap*>;
			napi_add_env_cleanup_hook(napiEnv, cleanupEnvWraps, nullptr);
		}
		openEnvWraps->push_back(this);
	}
	pthread_mutex_unlock(envTracking->envsLock);
	return 0;

	fail:
	env = nullptr;
	return rc;
}
Napi::Value EnvWrap::getMaxKeySize(const CallbackInfo& info) {
	return Number::New(info.Env(), mdb_env_get_maxkeysize(this->env));
}

NAPI_FUNCTION(getEnvFlags) {
	ARGS(1)
	GET_INT64_ARG(0);
	EnvWrap* ew = (EnvWrap*) i64;
	unsigned int envFlags;
	mdb_env_get_flags(ew->env, &envFlags);
	RETURN_UINT32(envFlags);
}

NAPI_FUNCTION(setJSFlags) {
	ARGS(2)
	GET_INT64_ARG(0);
	EnvWrap* ew = (EnvWrap*) i64;
	int64_t jsFlags;
	napi_get_value_int64(env, args[1], &jsFlags);
	ew->jsFlags = jsFlags;
	RETURN_UNDEFINED;
}

#ifdef _WIN32
// TODO: I think we should switch to DeleteFileW (but have to convert to UTF16)
#define unlink DeleteFileA
#else
#include <unistd.h>
#endif


NAPI_FUNCTION(EnvWrap::onExit) {
	// close all the environments
	if (openEnvWraps) {
		for (auto envWrap : *openEnvWraps)
			envWrap->closeEnv();
	}
	napi_value returnValue;
	RETURN_UNDEFINED;
}
NAPI_FUNCTION(getEnvsPointer) {
	napi_value returnValue;
	napi_create_double(env, (double) (size_t) EnvWrap::envTracking, &returnValue);
	if (!EnvWrap::sharedBuffers) {
		EnvWrap::sharedBuffers = new js_buffers_t;
		EnvWrap::sharedBuffers->nextId = 0;
		pthread_mutex_init(&EnvWrap::sharedBuffers->modification_lock, nullptr);
	}
	return returnValue;
}

NAPI_FUNCTION(setEnvsPointer) {
	// If another version of lmdb-js is running, switch to using its list of envs
	ARGS(2)
	GET_INT64_ARG(0);
	env_tracking_t* adoptedTracking = (env_tracking_t*) i64;
	// copy any existing ones over to the central one
	adoptedTracking->envs.assign(EnvWrap::envTracking->envs.begin(), EnvWrap::envTracking->envs.end());
	EnvWrap::envTracking = adoptedTracking;
	js_buffers_t* adoptedBuffers = (js_buffers_t*) adoptedTracking->getSharedBuffers();
	if (EnvWrap::sharedBuffers && adoptedBuffers != EnvWrap::sharedBuffers) {
		free(EnvWrap::sharedBuffers);
	}
	EnvWrap::sharedBuffers = adoptedBuffers;
	RETURN_UNDEFINED;
}

napi_finalize cleanupSharedExternal = [](napi_env env, void* data, void* buffer_info) {
	// Data belongs to LMDB, we shouldn't free it here
};

napi_finalize cleanupAllocatedExternal = [](napi_env env, void* data, void* buffer_info) {
	int32_t id = ((buffer_info_t*) buffer_info)->id;
	pthread_mutex_lock(&EnvWrap::sharedBuffers->modification_lock);
	for (auto bufferRef = EnvWrap::sharedBuffers->buffers.begin(); bufferRef != EnvWrap::sharedBuffers->buffers.end();) {
		if (bufferRef->second.id == id) {
//			fprintf(stderr, "erasing buffer on cleanpu %p\n", bufferRef->first);
			bufferRef = EnvWrap::sharedBuffers->buffers.erase(bufferRef);
			break;
		}
		bufferRef++;
	}
	pthread_mutex_unlock(&EnvWrap::sharedBuffers->modification_lock);
	// We malloc'ed this data so free it
	free(data);
};


NAPI_FUNCTION(getSharedBuffer) {
	ARGS(2)
	int32_t bufferId;
	GET_UINT32_ARG(bufferId, 0);
	GET_INT64_ARG(1);
	EnvWrap* ew = (EnvWrap*) i64;
	pthread_mutex_lock(&EnvWrap::sharedBuffers->modification_lock);
	for (auto bufferRef = EnvWrap::sharedBuffers->buffers.begin(); bufferRef != EnvWrap::sharedBuffers->buffers.end(); bufferRef++) {
		if (bufferRef->second.id == bufferId) {
			char* start = bufferRef->first;
			buffer_info_t* buffer = &bufferRef->second;
			if (buffer->env == ew->env) {
				//fprintf(stderr, "found exiting buffer for %u\n", bufferId);
				napi_get_reference_value(env, buffer->ref, &returnValue);
				pthread_mutex_unlock(&EnvWrap::sharedBuffers->modification_lock);
				return returnValue;
			}
			if (buffer->env) {
				// if for some reason it is different env that didn't get cleaned up
				napi_value arrayBuffer;
				napi_get_reference_value(env, buffer->ref, &arrayBuffer);
				napi_detach_arraybuffer(env, arrayBuffer);
				napi_delete_reference(env, buffer->ref);
			}
			char* end = buffer->end;
			if (buffer->isSharedMap) // only memory mapped buffers are tied to envs
				buffer->env = ew->env;
			size_t size = end - start;
            if (size > 0x100000000)
                fprintf(stderr, "Getting invalid shared buffer size %llu from start: %llu to %end: %llu", size, start, end);
			napi_create_external_arraybuffer(env, start, size,
					 buffer->isSharedMap ? cleanupSharedExternal : cleanupAllocatedExternal, (void*) buffer, &returnValue);
			int64_t result;
			napi_create_reference(env, returnValue, 1, &buffer->ref);
			if (buffer->isSharedMap) {
				napi_adjust_external_memory(env, -(int64_t) size, &result);
				napi_value true_value;
				napi_get_boolean(env, true, &true_value);
				napi_set_named_property(env, returnValue, "isSharedMap", true_value);
			}
			pthread_mutex_unlock(&EnvWrap::sharedBuffers->modification_lock);
			return returnValue;
		}
	}
	pthread_mutex_unlock(&EnvWrap::sharedBuffers->modification_lock);
	RETURN_UNDEFINED;
}
NAPI_FUNCTION(setTestRef) {
	ARGS(1)
	napi_create_reference(env, args[0], 1, &testRef);
	testRefEnv = env;
	RETURN_UNDEFINED
}

NAPI_FUNCTION(getTestRef) {
	napi_value returnValue;
	fprintf(stderr,"trying to get refernec\n");
	napi_get_reference_value(env, testRef, &returnValue);
	fprintf(stderr,"got refernec\n");
	return returnValue;
}

NAPI_FUNCTION(directWrite) {
	ARGS(4)
	GET_INT64_ARG(0);
	EnvWrap* ew = (EnvWrap*) i64;
	napi_get_value_int64(env, args[1], &i64);
	char* target = (char*) i64;
	napi_get_value_int64(env, args[2], &i64);
	void* source = (void*) i64;
	uint32_t length;
	GET_UINT32_ARG(length, 3);
	mdb_filehandle_t fd;
	mdb_env_get_fd(ew->env, &fd);
	MDB_envinfo stat;
	mdb_env_info(ew->env, &stat);
	int64_t offset = target - (char*) stat.me_mapaddr;
	if (offset > 0 && offset < (int64_t) stat.me_mapsize) {
		#ifdef _WIN32
		OVERLAPPED ov;
		ov.Offset = offset;
		ov.OffsetHigh = 0;
		WriteFile(fd, source, length, nullptr, &ov);
		#else
		pwrite(fd, source, length, offset);
		#endif
	}
	RETURN_UNDEFINED;
}

int32_t EnvWrap::toSharedBuffer(MDB_env* env, uint32_t* keyBuffer,  MDB_val data) {
	unsigned int flags;
	mdb_env_get_flags(env, (unsigned int*) &flags);
	#ifdef MDB_RPAGE_CACHE
	if (flags & MDB_REMAP_CHUNKS) {
		*((uint32_t*)keyBuffer) = data.mv_size;
		*((uint32_t*) (keyBuffer + 4)) = 0;
		return -30000;
	}
	#endif
	MDB_envinfo stat;
	mdb_env_info(env, &stat);
	size_t mapAddress = (size_t) (char*) stat.me_mapaddr;
	size_t dataAddress = (size_t) (char*) data.mv_data;
    size_t bufferStart;
    uint64_t end;
    if (dataAddress > mapAddress && (dataAddress + data.mv_size) <= (mapAddress + stat.me_mapsize)) {
        // an address within the memory map
        int64_t mapOffset = dataAddress - mapAddress;
        size_t bufferPosition = (mapOffset + (mapOffset >> 4)) >> 32;
        bufferStart = bufferPosition << 32;
        bufferStart += mapAddress - (bufferStart >> 4);
        end = bufferStart + 0xffffffffll;
        if (end > mapAddress + stat.me_mapsize)
            end = mapAddress + stat.me_mapsize;
    } else {
        // outside the memory map, usually because this is from the heap during a write txn or the mmap has been reallocated
        bufferStart = (dataAddress >> 32) << 32;
		if (!bufferStart) // can't use a memory address of 0 because it is considered a nullptr
			bufferStart = 8;
        end = bufferStart + 0xffffffffll;
    }
    if ((dataAddress + data.mv_size) > end) {
        // crosses boundaries, create one-off for this address
        bufferStart = dataAddress;
        end = bufferStart + 0xffffffffll;
    }
	//fprintf(stderr, "mapAddress %p bufferStart %p", mapAddress, bufferStart);
	pthread_mutex_lock(&sharedBuffers->modification_lock);
	auto bufferSearch = sharedBuffers->buffers.find((char*)bufferStart);
	size_t offset = dataAddress - bufferStart;
	buffer_info_t bufferInfo;
	if (bufferSearch == sharedBuffers->buffers.end()) {
        bufferInfo.end = (char*) end;
        bufferInfo.env = nullptr;
		bufferInfo.isSharedMap = true;
        bufferInfo.id = sharedBuffers->nextId++;
        sharedBuffers->buffers.emplace((char*)bufferStart, bufferInfo);
	} else {
		bufferInfo = bufferSearch->second;
	}
	pthread_mutex_unlock(&sharedBuffers->modification_lock);
	*keyBuffer = data.mv_size;
	*(keyBuffer + 1) = bufferInfo.id;
	*(keyBuffer + 2) = offset;
	return -30001;
}

void EnvWrap::closeEnv(bool hasLock) {
	if (!env)
		return;
	if (openEnvWraps) {
		for (auto ewRef = openEnvWraps->begin(); ewRef != openEnvWraps->end(); ) {
			if (*ewRef == this) {
				openEnvWraps->erase(ewRef);
				break;
			}
			++ewRef;
		}
	}
	napi_remove_env_cleanup_hook(napiEnv, cleanup, this);
	cleanupStrayTxns();
	if (!hasLock)
		pthread_mutex_lock(envTracking->envsLock);
	for (auto envPath = envTracking->envs.begin(); envPath != envTracking->envs.end(); ) {
		if (envPath->env == env) {
			envPath->count--;
            if (hasWrites)
                envPath->hasWrites = true;
			if (envPath->count <= 0) {
				// last thread using it, we can really close it now
				unsigned int envFlags; // This is primarily useful for detecting termination of threads and sync'ing on their termination
				mdb_env_get_flags(env, &envFlags);
				#ifdef MDB_OVERLAPPINGSYNC
				if ((envFlags & MDB_OVERLAPPINGSYNC) && envPath->hasWrites) {
					mdb_env_sync(env, 1);
				}
				if (envFlags & MDB_TRACK_METRICS) {
					delete (MDB_metrics*) mdb_env_get_userctx(env);
				}
				#endif
				char* path;
				mdb_env_get_path(env, (const char**)&path);
				path = strdup(path);
				mdb_env_close(env);
				pthread_mutex_lock(&sharedBuffers->modification_lock);
				for (auto bufferRef = EnvWrap::sharedBuffers->buffers.begin(); bufferRef != EnvWrap::sharedBuffers->buffers.end();) {
					if (bufferRef->second.env == env) {
						napi_value arrayBuffer;
						napi_get_reference_value(napiEnv, bufferRef->second.ref, &arrayBuffer);
						napi_detach_arraybuffer(napiEnv, arrayBuffer);
						napi_delete_reference(napiEnv, bufferRef->second.ref);
						int64_t result;
						if (bufferRef->second.id >= 0)
							napi_adjust_external_memory(napiEnv, bufferRef->second.end - bufferRef->first, &result);
						bufferRef = EnvWrap::sharedBuffers->buffers.erase(bufferRef);
					} else
						bufferRef++;
				}
				pthread_mutex_unlock(&sharedBuffers->modification_lock);
				if (jsFlags & DELETE_ON_CLOSE) {
					unlink(path);
					//unlink(strcat(envPath->path, "-lock"));
				}
				envTracking->envs.erase(envPath);
			}
			break;
		}
		++envPath;
	}
	if (!hasLock)
		pthread_mutex_unlock(envTracking->envsLock);
	env = nullptr;
}

Napi::Value EnvWrap::close(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}
	this->closeEnv();
	return info.Env().Undefined();
}

Napi::Value EnvWrap::stat(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}
	int rc;
	MDB_stat stat;

	rc = mdb_env_stat(this->env, &stat);
	if (rc != 0) {
		return throwLmdbError(info.Env(), rc);
	}
	Object stats = Object::New(info.Env());
	stats.Set("pageSize", Number::New(info.Env(), stat.ms_psize));
	stats.Set("treeDepth", Number::New(info.Env(), stat.ms_depth));
	stats.Set("treeBranchPageCount", Number::New(info.Env(), stat.ms_branch_pages));
	stats.Set("treeLeafPageCount", Number::New(info.Env(), stat.ms_leaf_pages));
	stats.Set("entryCount", Number::New(info.Env(), stat.ms_entries));
	stats.Set("overflowPages", Number::New(info.Env(), stat.ms_overflow_pages));
	return stats;
}

Napi::Value EnvWrap::freeStat(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(),"The environment is already closed.");
	}
	int rc;
	MDB_stat stat;
	MDB_txn *txn = getReadTxn();
	rc = mdb_stat(txn, 0, &stat);
	if (rc != 0) {
		return throwLmdbError(info.Env(), rc);
	}
	Object stats = Object::New(info.Env());
	stats.Set("pageSize", Number::New(info.Env(), stat.ms_psize));
	stats.Set("treeDepth", Number::New(info.Env(), stat.ms_depth));
	stats.Set("treeBranchPageCount", Number::New(info.Env(), stat.ms_branch_pages));
	stats.Set("treeLeafPageCount", Number::New(info.Env(), stat.ms_leaf_pages));
	stats.Set("entryCount", Number::New(info.Env(), stat.ms_entries));
	stats.Set("overflowPages", Number::New(info.Env(), stat.ms_overflow_pages));
	return stats;
}

Napi::Value EnvWrap::info(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(),"The environment is already closed.");
	}
	int rc;
	MDB_envinfo envinfo;

	rc = mdb_env_info(this->env, &envinfo);
	if (rc != 0) {
		return throwLmdbError(info.Env(), rc);
	}
	Object stats = Object::New(info.Env());
	stats.Set("mapSize", Number::New(info.Env(), envinfo.me_mapsize));
	stats.Set("lastPageNumber", Number::New(info.Env(), envinfo.me_last_pgno));
	stats.Set("lastTxnId", Number::New(info.Env(), envinfo.me_last_txnid));
	stats.Set("maxReaders", Number::New(info.Env(), envinfo.me_maxreaders));
	stats.Set("numReaders", Number::New(info.Env(), envinfo.me_numreaders));
	#ifdef MDB_OVERLAPPINGSYNC
	if (this->trackMetrics) {
		MDB_metrics* metrics = (MDB_metrics*) mdb_env_get_userctx(this->env);
		stats.Set("timeStartTxns", Number::New(info.Env(), (double) metrics->time_start_txns / TICKS_PER_SECOND));
		stats.Set("timeDuringTxns", Number::New(info.Env(), (double) metrics->time_during_txns / TICKS_PER_SECOND));
		stats.Set("timePageFlushes", Number::New(info.Env(), (double) metrics->time_page_flushes / TICKS_PER_SECOND));
		stats.Set("timeSync", Number::New(info.Env(), (double) metrics->time_sync / TICKS_PER_SECOND));
		stats.Set("timeTxnWaiting", Number::New(info.Env(), (double) timeTxnWaiting / TICKS_PER_SECOND));
		stats.Set("txns", Number::New(info.Env(), metrics->txns));
		stats.Set("pageFlushes", Number::New(info.Env(), metrics->page_flushes));
		stats.Set("pagesWritten", Number::New(info.Env(), metrics->pages_written));
		stats.Set("writes", Number::New(info.Env(), metrics->writes));
		stats.Set("puts", Number::New(info.Env(), metrics->puts));
		stats.Set("deletes", Number::New(info.Env(), metrics->deletes));
	}
	#endif
	return stats;
}

Napi::Value EnvWrap::readerCheck(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}

	int rc, dead;
	rc = mdb_reader_check(this->env, &dead);
	if (rc != 0) {
		return throwLmdbError(info.Env(), rc);
	}
	return Number::New(info.Env(), dead);
}

Array readerStrings;
MDB_msg_func* printReaders = ([](const char* message, void* env) -> int {
	readerStrings.Set(readerStrings.Length(), String::New(*(Env*)env, message));
	return 0;
});

Napi::Value EnvWrap::readerList(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}
	readerStrings = Array::New(info.Env());
	int rc;
	Napi::Env env = info.Env();
	rc = mdb_reader_list(this->env, printReaders, &env);
	if (rc != 0) {
		return throwLmdbError(info.Env(), rc);
	}
	return readerStrings;
}


Napi::Value EnvWrap::copy(const CallbackInfo& info) {
	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}

	// Check that the correct number/type of arguments was given.
	if (!info[0].IsString()) {
		return throwError(info.Env(), "Call env.copy(path, compact?, callback) with a file path.");
	}
	if (!info[info.Length() - 1].IsFunction()) {
		return throwError(info.Env(), "Call env.copy(path, compact?, callback) with a file path.");
	}

	int flags = 0;
	if (info.Length() > 1 && info[1].IsBoolean() && info[1].ToBoolean()) {
		flags = MDB_CP_COMPACT;
	}

	CopyWorker* worker = new CopyWorker(
		this->env, info[0].As<String>().Utf8Value(), flags, info[info.Length()	> 2 ? 2 : 1].As<Function>()
	);
	worker->Queue();
	return info.Env().Undefined();
}

Napi::Value EnvWrap::beginTxn(const CallbackInfo& info) {
	int flags = info[0].As<Number>();
	if (!(flags & MDB_RDONLY)) {
		MDB_env *env = this->env;
		unsigned int envFlags;
		mdb_env_get_flags(env, &envFlags);
		MDB_txn *txn;

		if (this->writeTxn)
			txn = this->writeTxn->txn;
		else if (this->writeWorker) {
			// try to acquire the txn from the current batch
			txn = this->writeWorker->AcquireTxn(&flags);
		} else {
			pthread_mutex_lock(this->writingLock);
			txn = nullptr;
		}

		if (txn) {
			if (flags & TXN_ABORTABLE) {
				if (envFlags & MDB_WRITEMAP)
					flags &= ~TXN_ABORTABLE;
				else {
					// child txn
					mdb_txn_begin(env, txn, flags & 0xf0000, &txn);
					TxnTracked* childTxn = new TxnTracked(txn, flags);
					childTxn->parent = this->writeTxn;
					this->writeTxn = childTxn;
					return info.Env().Undefined();
				}
			}
		} else {
			mdb_txn_begin(env, nullptr, flags & 0xf0000, &txn);
			flags |= TXN_ABORTABLE;
		}
		this->writeTxn = new TxnTracked(txn, flags);
		return info.Env().Undefined();
	}

	if (info.Length() > 1) {
		fprintf(stderr, "Invalid number of arguments");
	} else {
		fprintf(stderr, "Invalid number of arguments");
	}
	return info.Env().Undefined();
}
Napi::Value EnvWrap::commitTxn(const CallbackInfo& info) {
	TxnTracked *currentTxn = this->writeTxn;
	//fprintf(stderr, "commitTxn %p\n", currentTxn);
	int rc = 0;
	if (currentTxn->flags & TXN_ABORTABLE) {
		//fprintf(stderr, "txn_commit\n");
		rc = mdb_txn_commit(currentTxn->txn);
	}
	this->writeTxn = currentTxn->parent;
	if (!this->writeTxn) {
		//fprintf(stderr, "unlock txn\n");
		if (this->writeWorker)
			this->writeWorker->UnlockTxn();
		else
			pthread_mutex_unlock(this->writingLock);
	}
	delete currentTxn;
    if (rc == 0) {
        hasWrites = true;
        return Napi::Boolean::New(info.Env(), true);
    }
#ifdef MDB_EMPTY_TXN
	else if (rc == MDB_EMPTY_TXN)
        return Napi::Boolean::New(info.Env(), false);
#endif
    else
        return throwLmdbError(info.Env(), rc);
}
Napi::Value EnvWrap::abortTxn(const CallbackInfo& info) {
	TxnTracked *currentTxn = this->writeTxn;
	if (currentTxn->flags & TXN_ABORTABLE) {
		mdb_txn_abort(currentTxn->txn);
	} else {
		throwError(info.Env(), "Can not abort this transaction");
	}
	this->writeTxn = currentTxn->parent;
	if (!this->writeTxn) {
		if (this->writeWorker)
			this->writeWorker->UnlockTxn();
		else
			pthread_mutex_unlock(this->writingLock);
	}
	delete currentTxn;
	return info.Env().Undefined();
}
/*Napi::Value EnvWrap::openDbi(const CallbackInfo& info) {


	const unsigned argc = 5;
	Local<Value> argv[argc] = { info.This(), info[0], info[1], info[2], info[3] };
	Nan::MaybeLocal<Object> maybeInstance = Nan::NewInstance(Nan::New(*dbiCtor), argc, argv);

	// Check if database could be opened
	if ((maybeInstance.IsEmpty())) {
		// The maybeInstance is empty because the dbiCtor called throwError.
		// No need to call that here again, the user will get the error thrown there.
		return;
	}

	Local<Object> instance = maybeInstance.ToLocalChecked();
	DbiWrap *dw = Nan::ObjectWrap::Unwrap<DbiWrap>(instance);
	if (dw->dbi == (MDB_dbi) 0xffffffff)
		info.GetReturnValue().Set(Nan::Undefined());
	else
		info.GetReturnValue().Set(instance);
}*/

Napi::Value EnvWrap::sync(const CallbackInfo& info) {

	if (!this->env) {
		return throwError(info.Env(), "The environment is already closed.");
	}
	if (info.Length() > 0) {
		SyncWorker* worker = new SyncWorker(this, info[0].As<Function>());
		worker->Queue();
	} else {
		int rc = mdb_env_sync(this->env, 1);
		if (rc != 0) {
			return throwLmdbError(info.Env(), rc);
		}
	}
	return info.Env().Undefined();
}

int32_t writeFFI(double ewPointer, uint64_t instructionAddress) {
	EnvWrap* ew = (EnvWrap*) (size_t) ewPointer;
	int rc;
	if (instructionAddress)
		rc = WriteWorker::DoWrites(ew->writeTxn->txn, ew, (uint32_t*)instructionAddress, nullptr);
	else {
		pthread_cond_signal(ew->writingCond);
		rc = 0;
	}
	return rc;
}


void EnvWrap::setupExports(Napi::Env env, Object exports) {
	// EnvWrap: Prepare constructor template
	Function EnvClass = ObjectWrap<EnvWrap>::DefineClass(env, "Env", {
		EnvWrap::InstanceMethod("open", &EnvWrap::open),
		EnvWrap::InstanceMethod("getMaxKeySize", &EnvWrap::getMaxKeySize),
		EnvWrap::InstanceMethod("close", &EnvWrap::close),
		EnvWrap::InstanceMethod("beginTxn", &EnvWrap::beginTxn),
		EnvWrap::InstanceMethod("commitTxn", &EnvWrap::commitTxn),
		EnvWrap::InstanceMethod("abortTxn", &EnvWrap::abortTxn),
		EnvWrap::InstanceMethod("sync", &EnvWrap::sync),
		EnvWrap::InstanceMethod("resumeWriting", &EnvWrap::resumeWriting),
		EnvWrap::InstanceMethod("startWriting", &EnvWrap::startWriting),
		EnvWrap::InstanceMethod("stat", &EnvWrap::stat),
		EnvWrap::InstanceMethod("freeStat", &EnvWrap::freeStat),
		EnvWrap::InstanceMethod("info", &EnvWrap::info),
		EnvWrap::InstanceMethod("readerCheck", &EnvWrap::readerCheck),
		EnvWrap::InstanceMethod("readerList", &EnvWrap::readerList),
		EnvWrap::InstanceMethod("copy", &EnvWrap::copy),
		//EnvWrap::InstanceMethod("detachBuffer", &EnvWrap::detachBuffer),
	});
	EXPORT_NAPI_FUNCTION("compress", compress);
	EXPORT_NAPI_FUNCTION("write", write);
	EXPORT_NAPI_FUNCTION("onExit", onExit);
	EXPORT_NAPI_FUNCTION("getEnvsPointer", getEnvsPointer);
	EXPORT_NAPI_FUNCTION("setEnvsPointer", setEnvsPointer);
	EXPORT_NAPI_FUNCTION("getEnvFlags", getEnvFlags);
	EXPORT_NAPI_FUNCTION("setJSFlags", setJSFlags);
	EXPORT_NAPI_FUNCTION("getSharedBuffer", getSharedBuffer);
	EXPORT_NAPI_FUNCTION("setTestRef", setTestRef);
	EXPORT_NAPI_FUNCTION("getTestRef", getTestRef);
	EXPORT_FUNCTION_ADDRESS("writePtr", writeFFI);
	//envTpl->InstanceTemplate()->SetInternalFieldCount(1);
	exports.Set("Env", EnvClass);
}

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

