import { useRequest } from 'ahooks'
import { getBoxInfo } from 'api/boxes'
import { IBoxBasicAnotherInfoValue, IBoxValue, IBoxesPublishJsonData } from 'state/boxes/type'
import { useActiveWeb3React } from '../index'

const getBoxBasicInfo = (data: IBoxesPublishJsonData) => {
  return {
    id: data.id,
    avatar: data.avatar,
    projectName: data.projectName,
    followCount: data.followCount,
    rank: data.rank,
    tvl: data.tvl,
    Slogan: '',
    backgroundImg: '',
    roomId: data.roomId,
    textColor: '#D9D9D9',
    introduction: '',
    links: [
      {
        typeName: 'twitter',
        url: ''
      },
      {
        typeName: 'telegram',
        url: ''
      },
      {
        typeName: 'medium',
        url: ''
      },
      {
        typeName: 'discord',
        url: ''
      },
      {
        typeName: 'facebook',
        url: ''
      },
      {
        typeName: 'youtube',
        url: ''
      }
    ]
  }
}
export const useGetBoxInfo = (boxId: string | undefined, changeNum?: number) => {
  const { account } = useActiveWeb3React()
  return useRequest(
    async () => {
      if (!boxId) return null
      try {
        const { data, code } = await getBoxInfo(boxId)
        if (code !== 200) return null
        const _pluginNameList = data.plugins ? JSON.parse(data.plugins) : []
        const pluginNameList: number[] = typeof _pluginNameList?.[0] === 'number' ? _pluginNameList : []

        const boxValue: IBoxValue & {
          boxAddress?: string
          isFollow: boolean
          verified: boolean
          rewardId?: number | null
          anotherInfo: IBoxBasicAnotherInfoValue
          roomId: string | undefined
          isJoinRoom: boolean | undefined
          publishStatus: 0 | 1
          listingStatus: boolean
          ownerAddress?: string
        } = {
          ...(data as any),
          boxAddress: data.boxAddress || undefined,
          anotherInfo: {
            followCount: data.followCount,
            rank: data.rank,
            tvl: data.tvl
          },
          editing: true,
          boxBasicInfo: data.page ? JSON.parse(data.page) : getBoxBasicInfo(data),
          about: data.about ? JSON.parse(data.about) : [],
          pluginList: pluginNameList,
          pluginData: data.pluginInfo ? JSON.parse(data.pluginInfo) : [],
          roomId: data.roomId || undefined,
          isJoinRoom: data.isJoinClubRoom || false
        }

        return boxValue
      } catch (error) {
        return null
      }
    },
    {
      refreshDeps: [boxId, account, changeNum],
      cacheKey: `${boxId}_useGetBoxInfo`,
      cacheTime: 10_000,
      manual: false
    }
  )
}
