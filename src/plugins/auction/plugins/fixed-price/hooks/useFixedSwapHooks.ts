import { useMemo } from 'react'
import { useFixedSwapERC20Contract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { CurrencyAmount } from 'constants/token'
import JSBI from 'jsbi'
import { IFixedPricePoolInfo } from '../type'
import BigNumber from 'bignumber.js'

export const useUserClaim = (poolInfo: IFixedPricePoolInfo & { boxAddress: string | undefined }) => {
  const { boxAddress, currencyAmountMySwap0 } = poolInfo
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()

  const executeResult = useBoxExecute(
    boxAddress,
    { toContract: fixedSwapERC20Contract, toFunc: 'userClaim', toData: [poolInfo.poolId] },
    {
      action: `fixed_price_user_claim`,
      key: `fixed_price_user_claim-${poolInfo.poolId}`,
      summary: `Claim token`,
      successTipsText: `You have successfully claimed ${currencyAmountMySwap0?.toSignificant()} ${
        currencyAmountMySwap0?.currency.symbol
      }`
    }
  )

  return {
    ...executeResult
  }
}
export function useFixedSwapCreatorClaim(
  boxAddress: string | undefined,
  poolId: string | undefined,
  poolInfo: IFixedPricePoolInfo | undefined
) {
  const txFee = new BigNumber(poolInfo?.txFeeRatio?.toString() || 0).div(new BigNumber(10).pow(18))
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()
  const funcName = 'creatorClaim'
  return useBoxExecute(
    boxAddress,
    { toContract: fixedSwapERC20Contract, toFunc: funcName, toData: [poolId] },
    {
      action: `${funcName}-${poolId}`,
      summary: 'Claim fixedSwap auction',
      successTipsText: `You have successfully claimed ${poolInfo?.amountBid1?.minus(
        poolInfo.amountBid1?.times(txFee)
      )} ${poolInfo?.currencyAmountSwap1?.currency.symbol} (fees: ${poolInfo?.amountBid1?.times(txFee)} ${
        poolInfo?.currencyAmountSwap1?.currency.symbol
      }) and ${new BigNumber(poolInfo?.currencyAmountTotal0?.toExact() || 0).minus(
        poolInfo?.amountBid0 || 0
      )} ${poolInfo?.currencyAmountTotal0?.currency?.symbol}`
    }
  )
}

export const TX_FEE_RATIO = 0.025

export function useCreatorClaimAmount1Data(amount1: CurrencyAmount | undefined, ratio = TX_FEE_RATIO * 1e18) {
  return useMemo(() => {
    if (!amount1) return undefined
    const _fee = amount1.multiply(JSBI.BigInt(ratio)).divide(JSBI.BigInt(1e18))
    const fee = CurrencyAmount.fromAmount(amount1.currency, _fee.toSignificant(18))
    if (!fee) return undefined

    return {
      fee,
      receivedAmount: amount1.subtract(fee)
    }
  }, [amount1, ratio])
}
