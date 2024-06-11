import { ApiInstance } from 'utils/fetch'
import { IChatRoomSignResult } from './type'

export const getBackedSignature = ({ message }: { message: string }) => {
  return ApiInstance.get<IChatRoomSignResult>('login/sendingnetwork', { message })
}
