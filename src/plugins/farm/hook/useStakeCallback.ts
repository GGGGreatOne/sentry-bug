import { useActiveWeb3React } from 'hooks'
import { STAKING_CONSTANTS } from '../constants'
import { useStakeContract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { useSingleCallResult } from 'hooks/multicall'
import { Currency, CurrencyAmount } from 'constants/token'
import { useMemo } from 'react'
import { SupportedChainId } from 'constants/chains'

export const useStakeCallback = (
  boxContractAddr: string | undefined,
  amount: CurrencyAmount | undefined,
  cb?: () => void
) => {
  const { chainId } = useActiveWeb3React()
  const contract = useStakeContract(STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET])

  return useBoxExecute(
    boxContractAddr,
    {
      toContract: contract,
      toFunc: 'stake',
      toData: [amount?.currency.address, amount?.raw.toString()],
      value: amount?.currency.isNative ? amount.raw.toString() : undefined
    },
    {
      summary: 'You staked token',
      action: 'stake_you_token',
      successTipsText: 'You have successfully staked your token',
      modalSuccessCancel: cb
    }
  )
}

export const useViewStakedAmount = (currencyToken: Currency | null | undefined) => {
  const { chainId, account } = useActiveWeb3React()

  const contract = useStakeContract(STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET])
  const userStakedAmountRes = useSingleCallResult(
    chainId,
    contract,
    'stakedOf',
    [account, currencyToken?.address],
    undefined
  )

  return useMemo(() => {
    if (userStakedAmountRes.result && currencyToken) {
      return CurrencyAmount.fromRawAmount(currencyToken, userStakedAmountRes.result[0].toString()).toExact()
    }
    return undefined
  }, [currencyToken, userStakedAmountRes.result])
}

export const useStakedMultiAmount = (currencyToken: Currency | null | undefined) => {
  const { chainId, account } = useActiveWeb3React()
  const contract = useStakeContract(STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET])
  const userStakedAmountRes = useSingleCallResult(
    chainId,
    contract,
    'stakedOf',
    [account, currencyToken?.address],
    undefined
  )

  return useMemo(() => {
    if (userStakedAmountRes.result && currencyToken) {
      return CurrencyAmount.fromRawAmount(currencyToken, userStakedAmountRes.result[0].toString()).toExact()
    }
    return undefined
  }, [currencyToken, userStakedAmountRes.result])
}
