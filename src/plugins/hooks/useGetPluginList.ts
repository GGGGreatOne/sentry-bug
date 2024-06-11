import { useRequest } from 'ahooks'
import { GetEnableplugins } from 'api/boxes/index'
import { useEditBoxPluginListName } from 'state/boxes/hooks'
import { PluginListResult } from 'api/boxes/type'
import { useUserInfo } from 'state/user/hooks'
export enum PluginCategory {
  ALL = 'All',
  DeFi = 'DeFi app',
  Auction = 'Auction app',
  SocialFi = 'SocialFi app',
  Game = 'Game app'
}
export interface PlugListData extends PluginListResult {
  hasPlug: boolean
}

export interface PluginListFilter {
  pluginName?: string
  category?: string
}

export const useGetPluginList = () => {
  const userInfo = useUserInfo()
  const { pluginList } = useEditBoxPluginListName()
  return useRequest(
    async () => {
      if (!userInfo?.user?.boxId) return
      try {
        const res = await GetEnableplugins(userInfo.user.boxId.toString())
        const categorys: PluginCategory[] = [PluginCategory.ALL]
        const listData: PlugListData[] = res.data.map(item => {
          categorys.push(item.category as PluginCategory)
          item.id = Number(item.id)

          if (pluginList.some(_ => _ === item.id || item.pluginName === 'SendingMe')) {
            return { ...item, hasPlug: true }
          } else {
            return { ...item, hasPlug: false }
          }
        })

        return { listData: listData, categorys: [...new Set(categorys)] }
      } catch (error) {
        return null
      }
    },
    {
      manual: false,
      onSuccess: () => {
        return
      }
    }
  )
}
