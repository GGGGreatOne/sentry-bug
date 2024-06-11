import { combineReducers } from '@reduxjs/toolkit'
import application from './application/reducer'
import user from './user/reducer'
import signature from './signatures/reducer'
import transactions from './transactions/reducer'
import mintV3 from './mint/v3/reducer'
import burnV3 from './burn/v3/reducer'
import burn from './burn/reducer'
import lists from './lists/reducer'
import { isDevelopmentEnv } from '../utils/env'
import { customCreateMigrate, migrations } from 'state/migrations'
import { PersistConfig, persistReducer } from 'redux-persist'
import localForage from 'localforage'

const persistedReducers = {
  user,
  signature,
  transactions
}

const appReducer = combineReducers({
  application,
  mintV3,
  burn,
  burnV3,
  lists,
  ...persistedReducers
})

const persistConfig: PersistConfig<AppState> = {
  key: 'interface',
  version: 7, // see migrations.ts for more details about this version
  storage: localForage.createInstance({
    name: 'redux'
  }),
  migrate: customCreateMigrate(migrations, { debug: false }),
  whitelist: Object.keys(persistedReducers),
  throttle: 1000, // ms
  serialize: false,
  // The typescript definitions are wrong - we need this to be false for unserialized storage to work.
  // We need unserialized storage for inspectable db entries for debugging.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  deserialize: false,
  debug: isDevelopmentEnv()
}

export type AppState = ReturnType<typeof appReducer>
const persistedReducer = persistReducer(persistConfig, appReducer)

export default persistedReducer
