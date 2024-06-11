import { OpenTradeParams } from '../type'
import { ZERO_ADDRESS } from 'constants/index'
import { useTradingV6Contract } from './useContract'
import { useBoxExecute } from '../../../hooks/useBoxCallback'

export const useOpenTrade = ({
  tuple,
  tradeType,
  tradingAddress,
  slippageP,
  referral = ZERO_ADDRESS,
  spreadReductionId = 0,
  boxContactAddr,
  isWBB,
  onSuccess
}: OpenTradeParams) => {
  const contract = useTradingV6Contract(tradingAddress ?? '')!

  return useBoxExecute(
    boxContactAddr,
    isWBB
      ? {
          toContract: contract,
          toData: [tuple, tradeType, spreadReductionId, slippageP, referral],
          toFunc: 'openTrade',
          value: tuple.positionSizeDai.toString()
        }
      : {
          toContract: contract,
          toData: [tuple, tradeType, spreadReductionId, slippageP, referral],
          toFunc: 'openTrade'
        },
    {
      summary: (tuple.buy ? 'Long' : 'Short') + ' ' + (tuple.index === 0 ? 'Market Order' : 'Limit Order'),
      action: 'open trade',
      successTipsText: 'Your position has been opened successfully.',
      onSuccess: onSuccess
    }
  )
}
