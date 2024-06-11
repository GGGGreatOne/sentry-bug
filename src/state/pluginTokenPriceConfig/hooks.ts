import { useRequest } from 'ahooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import { fetchPluginTokenPriceListConfig } from './reducer'

export const useGetPluginTokenPriceData = () => {
  const state = useSelector<AppState, AppState['pluginTokenPriceListConfig']>(state => state.pluginTokenPriceListConfig)
  return state
}

export const useGetPluginTokenPriceList = () => {
  const dispatch = useDispatch()
  useRequest(async () => dispatch(fetchPluginTokenPriceListConfig()), {})
}
