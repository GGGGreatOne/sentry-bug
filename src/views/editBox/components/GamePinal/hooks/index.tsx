import { useRequest } from 'ahooks'
import { getRoomList } from 'api/game'
import { GetRoomListParam } from 'api/game/type'
import { useMemo } from 'react'

export const useGetRoomList = (params: GetRoomListParam) => {
  const isReady = useMemo(() => {
    return !!params.clubId && !!params.pluginId
  }, [params.clubId, params.pluginId])

  return useRequest(
    async () => {
      const res = await getRoomList(params)
      console.log('🚀 ~ res:', res)
      return res
    },
    {
      manual: false,
      ready: isReady
    }
  )
}
