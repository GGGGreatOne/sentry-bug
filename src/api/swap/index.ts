import { ApiInstance } from 'utils/fetch'

export const SwapMapping = async (boxId: string | number, txHash: string) => {
  return ApiInstance.post(`club/swap/mapping`, {
    boxId,
    txHash
  })
}
