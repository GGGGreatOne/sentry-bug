import { ApiInstance } from 'utils/fetch'
import { GetRoomListParam, GetRoomListRespon } from './type'

export const getRoomList = async (params: GetRoomListParam) => {
  return ApiInstance.post<GetRoomListRespon>(`club/game/link/${params.clubId}`, {
    pluginId: params.pluginId
  })
}
