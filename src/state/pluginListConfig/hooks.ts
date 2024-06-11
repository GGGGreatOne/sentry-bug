import { useRequest } from 'ahooks'
import { GetPluginList } from 'api/boxes'
import { IPluginListParams } from 'api/boxes/type'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'

export function usePluginListDatas() {
  const pluginListConfig = useSelector<AppState, AppState['pluginListConfig']>(state => state.pluginListConfig)
  return pluginListConfig.pluginList
}

export const useGetPluginListData = () => {
  const dispatch = useDispatch()
  const { data: pluginList, run: getPluginList } = useRequest(GetPluginList, {
    cacheKey: 'pluginData',
    onSuccess: response => {
      if (response.code === 200) {
        dispatch({
          type: 'pluginListConfig/setPluginList',
          payload: {
            pluginList: response.data
          }
        })
        return response.data
      }
      return undefined
    }
  })
  return { pluginList, getPluginList }
}

export const useGetPluginList = (params: IPluginListParams) => {
  return useRequest(
    async () => {
      const res = await GetPluginList(params)
      return res.data
    },
    {
      manual: false
    }
  )
}

export const useGetPluginInfo = (pluginId?: number) => {
  const pluginList = usePluginListDatas()
  const curPlugin = pluginList.list.find(i => i.id === pluginId)
  return curPlugin
}
