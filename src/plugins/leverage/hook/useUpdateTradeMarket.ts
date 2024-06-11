import { useTradingV6Contract } from './useContract'
import { useBoxExecute } from '../../../hooks/useBoxCallback'

export const useUpdateTradeMarket = (tradingAddress: string, boxAddress: string, onSuccess: () => void) => {
  const tradingContract = useTradingV6Contract(tradingAddress)
  const updateSl = useBoxExecute(
    boxAddress,
    {
      toContract: tradingContract,
      toData: [],
      toFunc: 'updateSl'
    },
    {
      summary: `Update `,
      action: 'update position',
      successTipsText: 'Your position has been updated successfully.',
      onSuccess: onSuccess
    }
  )
  const updateTp = useBoxExecute(
    boxAddress,
    {
      toContract: tradingContract,
      toData: [],
      toFunc: 'updateTp'
    },
    {
      summary: `Update `,
      action: 'update position',
      successTipsText: 'Your position has been updated successfully.',
      onSuccess: onSuccess
    }
  )
  return {
    updateTp: updateTp,
    updateSl: updateSl
  }
}
