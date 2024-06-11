import { useTradingV6Contract } from './useContract'
import { useBoxExecute } from '../../../hooks/useBoxCallback'

export const useClaimPendingOrder = (
  tradingAddress: string,
  boxContactAddr: string,
  orderId: number | undefined
  // isClosePosition: boolean
) => {
  const contract = useTradingV6Contract(tradingAddress)
  return useBoxExecute(
    boxContactAddr,
    {
      toContract: contract,
      toData: [orderId],
      toFunc: 'openTradeMarketTimeout'
    },
    {
      summary: 'Claim pending order',
      action: 'claim pending order',
      successTipsText: 'Your position has been claimed successfully.'
    }
  )
}
