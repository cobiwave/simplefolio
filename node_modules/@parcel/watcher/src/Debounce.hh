#ifndef DEBOUNCE_H
#define DEBOUNCE_H

#include <thread>
#include <unordered_map>
#include "Signal.hh"

#define MIN_WAIT_TIME 50
#define MAX_WAIT_TIME 500

class Debounce {
public:
  static std::shared_ptr<Debounce> getShared() {
    static std::weak_ptr<Debounce> sharedInstance;
    std::shared_ptr<Debounce> shared = sharedInstance.lock();
    if (!shared) {
      shared = std::make_shared<Debounce>();
      sharedInstance = shared;
    }

    return shared;
  }

  Debounce() {
    mRunning = true;
    mThread = std::thread([this] () {
      loop();
    });
  }

  ~Debounce() {
    mRunning = false;
    mWaitSignal.notify();
    mThread.join();
  }

  void add(void *key, std::function<void()> cb) {
    std::unique_lock<std::mutex> lock(mMutex);
    mCallbacks.emplace(key, cb);
  }

  void remove(void *key) {
    std::unique_lock<std::mutex> lock(mMutex);
    mCallbacks.erase(key);
  }

  void trigger() {
    std::unique_lock<std::mutex> lock(mMutex);
    mWaitSignal.notify();
  }
  
private:
  bool mRunning;
  std::mutex mMutex;
  Signal mWaitSignal;
  std::thread mThread;
  std::unordered_map<void *, std::function<void()>> mCallbacks;
  std::chrono::time_point<std::chrono::steady_clock> mLastTime;

  void loop() {
    while (mRunning) {
      mWaitSignal.wait();
      if (!mRunning) {
        break;
      }

      // If we haven't seen an event in more than the maximum wait time, notify callbacks immediately
      // to ensure that we don't wait forever. Otherwise, wait for the minimum wait time and batch 
      // subsequent fast changes. This also means the first file change in a batch is notified immediately, 
      // separately from the rest of the batch. This seems like an acceptable tradeoff if the common case
      // is that only a single file was updated at a time.
      auto time = std::chrono::steady_clock::now();
      if ((time - mLastTime) > std::chrono::milliseconds(MAX_WAIT_TIME)) {
        mLastTime = time;
        notify();
      } else {
        auto status = mWaitSignal.waitFor(std::chrono::milliseconds(MIN_WAIT_TIME));
        if (mRunning && (status == std::cv_status::timeout)) {
          mLastTime = std::chrono::steady_clock::now();
          notify();
        }
      }
    }
  }

  void notify() {
    std::unique_lock<std::mutex> lock(mMutex);

    for (auto it = mCallbacks.begin(); it != mCallbacks.end(); it++) {
      auto cb = it->second;
      cb();
    }

    mWaitSignal.reset();
  }
};

#endif
