import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from './multicall'
import { useFeeDistributor } from './useContract'
import BigNumber from 'bignumber.js'
import { useToken } from './useToken'
import { CurrencyAmount } from 'constants/token'
import { useMemo } from 'react'
import { useBoxExecute } from './useBoxCallback'

export function useBoxFeeAmount(boxAddress: string | undefined, tokenAddress: string | undefined) {
  const { chainId } = useActiveWeb3React()
  const feeDistributorContract = useFeeDistributor(chainId)
  const feeAmount = useSingleCallResult(chainId, feeDistributorContract, 'boxFeeAmount', [
    boxAddress,
    tokenAddress
  ]).result
  const token = useToken(tokenAddress || '', chainId)
  const amount = useMemo(() => new BigNumber(feeAmount?.[0].toString() || 0), [feeAmount])
  const currencyAmount = useMemo(
    () => (token ? CurrencyAmount.fromRawAmount(token, amount.toString()) : undefined),
    [amount, token]
  )
  return { amount, currencyAmount }
}

export function useClaimFee(
  boxAddress: string | undefined,
  tokenAddress: string | undefined,
  currencyAmount: CurrencyAmount | undefined
) {
  const contract = useFeeDistributor()
  return useBoxExecute(
    boxAddress,
    {
      toFunc: 'claimFee',
      toData: [tokenAddress],
      toContract: contract
    },
    {
      summary: 'claim fee',
      action: 'claimFee',
      successTipsText: `You have successfully claim ${currencyAmount?.toSignificant()} ${
        currencyAmount?.currency.symbol
      }`
    }
  )
}
