import { useTradingV6Contract } from './useContract'
import { useBoxExecute } from '../../../hooks/useBoxCallback'

export const useCancelOpenLimitOrder = (
  tradingAddress: string,
  boxContactAddr: string,
  orderIndex: number,
  pairIndex = 0
) => {
  const contract = useTradingV6Contract(tradingAddress)
  return useBoxExecute(
    boxContactAddr,
    {
      toContract: contract,
      toData: [pairIndex, orderIndex],
      toFunc: 'cancelOpenLimitOrder'
    },
    {
      summary: 'Cancel limit order',
      action: 'cancel limit order',
      successTipsText: 'Your limit order has been canceled successfully.'
    }
  )
}
