// import { useSyncExternalStore } from 'react'

// const connectionReady: Promise<void> | true = true

export function useConnectionReady() {
  return true
  // return useSyncExternalStore(
  //   onStoreChange => {
  //     if (connectionReady instanceof Promise) {
  //       connectionReady.finally(onStoreChange)
  //     }
  //     return () => undefined
  //   },
  //   () => connectionReady === true
  // )
}
