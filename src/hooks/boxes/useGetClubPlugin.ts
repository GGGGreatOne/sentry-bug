import { useRequest } from 'ahooks'
import { GetEnablePluginList } from 'api/boxes'
import { getPluginTokenList } from 'api/common'
import { IGetTokenListParams } from 'api/common/type'
import { getClubPlugin, getHotClubPlugin } from 'api/home'
import { ClubPluginListProps, ClubPluginParams, NewEventType, basicParams } from 'api/home/type'
import { IClubPluginId } from 'state/boxes/type'
export const useGetClubPlugin = (params?: ClubPluginParams) => {
  return useRequest(
    async () => {
      const res = await getClubPlugin(params)
      const ClubPluginList: ClubPluginListProps[] = res?.data?.list.map(item => {
        const expend = {
          eventName: item.eventType === NewEventType.Create ? ' Created a new ' : ' Closed the ',
          pluginMsg:
            item.pluginId === IClubPluginId.BITSWAP
              ? `‘${item.token0Name?.toUpperCase() || '--'}’ & ‘${item.token1Name?.toUpperCase() || '--'}’ Pair with `
              : item.pluginId === IClubPluginId.BITSTABLE
                ? `Stable Coin ‘${item.token0Name?.toUpperCase() || '--'}’ with `
                : item.pluginId === IClubPluginId.BITLEVERAGE
                  ? `Liquidity ‘${item.token0Name?.toUpperCase() || '--'}’ with `
                  : ''
        }
        return Object.assign(item, expend)
      })
      return ClubPluginList || []
    },
    {
      manual: false,
      pollingInterval: 60000,
      refreshDeps: [params?.boxId]
    }
  )
}

export const useGetHotClubPlugin = (params?: basicParams) => {
  return useRequest(
    async () => {
      const res = await getHotClubPlugin(params)
      return res?.data?.list || []
    },
    {
      manual: false,
      pollingInterval: 60000
    }
  )
}

export const useFetchPluginTokenList = ({
  params
}: {
  params?: IGetTokenListParams
} = {}) => {
  return useRequest(
    async () => {
      const res = await getPluginTokenList(params)
      return res?.data?.data
    },
    {
      cacheKey: `pluginTokenList${params ? `- tokenlist` : ''}`,
      cacheTime: 30_000
    }
  )
}

export const useGetEnablePluginList = (boxId?: string) => {
  return useRequest(
    async () => {
      if (!boxId) return
      try {
        const res = await GetEnablePluginList(boxId)
        return res.data
      } catch (error) {
        return null
      }
    },
    {
      manual: false,
      refreshDeps: [boxId]
    }
  )
}
