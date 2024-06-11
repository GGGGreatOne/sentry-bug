import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { load, save } from 'redux-localstorage-simple-next'
import multicall from './multicall'
import application from './application/reducer'
import user from './user/reducer'
import boxes from './boxes/reducer'
import { updateVersion } from './global/actions'
import transactions from './transactions/reducer'
import swap from './widget/swap/reducer'
import swapUser from './widget/swapUser/reducer'
import mint from './widget/mint/reducer'
import burn from './widget/burn/reducer'
import swap2 from '../components/Widget2/state'
import { persistStore } from 'redux-persist'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import lists from '../components/Widget2/state/lists/reducer'
import signatures from '../components/Widget2/state/signatures/reducer'
import pluginListConfig from './pluginListConfig/reducer'
import { leverageData } from 'plugins/leverage/state'
import pluginTokenListConfig from './pluginTokenListConfig/reducer'
import pluginTokenPriceListConfig from './pluginTokenPriceConfig/reducer'
import { routingApi } from 'components/Widget2/state/routing/slice'
import { quickRouteApi } from 'components/Widget2/state/routing/quickRouteSlice'
const PERSISTED_KEYS: string[] = ['transactions']

const persistedReducers = {
  signatures,
  lists
}

const reducer = combineReducers({
  [multicall.reducerPath]: multicall.reducer,
  [leverageData.name]: leverageData.reducer,
  user,
  boxes,
  application,
  transactions,
  swap,
  swapUser,
  mint,
  burn,
  swap2,
  pluginListConfig,
  pluginTokenListConfig,
  pluginTokenPriceListConfig,
  [routingApi.reducerPath]: routingApi.reducer,
  [quickRouteApi.reducerPath]: quickRouteApi.reducer,
  ...persistedReducers
})

const store = configureStore({
  reducer,
  // middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: { ignoredPaths: [routingApi.reducerPath, quickRouteApi.reducerPath] }
    })
      .concat(save({ states: PERSISTED_KEYS }))
      .concat(routingApi.middleware)
      .concat(quickRouteApi.middleware),
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())
setupListeners(store.dispatch)

export default store
export const persistor = persistStore(store)

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
