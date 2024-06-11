import { useActiveWeb3React } from 'hooks'

import { useCallback } from 'react'
import { CurrencyAmount } from 'constants/token'
import { useFixedSwapERC20Contract } from './useContract'
import { getUserPermitSign } from '../api'
import { PoolType } from 'api/type'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { IFixedPricePoolInfo } from '../type'
import { IWhiteListResult } from 'plugins/auction/api/type'

export default function usePlaceBid(
  poolInfo: IFixedPricePoolInfo & { boxAddress: string | undefined } & { whitelist: IWhiteListResult | undefined } & {
    amountCurrencyAmount: CurrencyAmount | undefined
  }
) {
  const { boxAddress, whitelist, amountCurrencyAmount } = poolInfo
  const { account, chainId } = useActiveWeb3React()
  const isToken1Native = poolInfo.currencyAmountSwap1?.currency.isNative
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()
  const method = poolInfo.isPlayableAuction ? 'swapPlayable' : 'swap'
  const swapExecuteResult = useBoxExecute(
    boxAddress,
    {
      toContract: fixedSwapERC20Contract,
      toFunc: method,
      toData: [],
      value: isToken1Native ? amountCurrencyAmount?.raw.toString() : undefined
    },
    {
      summary: `You have successfully ${method} ${amountCurrencyAmount?.toSignificant()} ${amountCurrencyAmount?.currency.symbol?.toLocaleUpperCase()}`,
      action: `fixed_price_swap`,
      key: `fixed_price_swap-${poolInfo.poolId}`,
      successTipsText: `You have successfully bid ${amountCurrencyAmount?.toSignificant()} ${amountCurrencyAmount?.currency.symbol?.toLocaleUpperCase()}`
    }
  )
  const swapPermitExecuteResult = useBoxExecute(
    boxAddress,
    {
      toContract: fixedSwapERC20Contract,
      toFunc: 'swapPermit',
      toData: [],
      value: isToken1Native ? amountCurrencyAmount?.raw.toString() : undefined
    },
    {
      summary: `You have successfully ${method} token`,
      action: `fixed_price_swapPermit`,
      key: `fixed_price_swapPermit-${poolInfo.poolId}`
    }
  )
  const swapCallback = useCallback(
    async (bidAmount: CurrencyAmount) => {
      if (!account) {
        return Promise.reject('no account')
      }
      if (!fixedSwapERC20Contract) {
        return Promise.reject('no contract')
      }
      if (!chainId) {
        return Promise.reject('no chainId')
      }
      let proofArr: string[] = []

      let playableAmount = ''
      if (whitelist && !!Object.keys(whitelist).length && whitelist?.proof) {
        try {
          if (whitelist?.proof.length === 2) {
            proofArr = []
          } else {
            proofArr = whitelist?.proof.substring(1, whitelist?.proof.length - 1).split(',')
            proofArr = proofArr.map(item => `0x${item}`)
          }
        } catch (error) {
          console.error(error)
        }
      }
      if (poolInfo.isPlayableAuction) {
        playableAmount = poolInfo.maxAmount1PerWallet?.raw.toString() || '0'
      }
      let args = [poolInfo.poolId, bidAmount.raw.toString(), proofArr]
      if (method === 'swapPlayable' && playableAmount) {
        args = [poolInfo.poolId, bidAmount.raw.toString(), playableAmount, proofArr]
      }
      return {
        toData: args
      }
    },
    [
      account,
      chainId,
      fixedSwapERC20Contract,
      method,
      poolInfo.isPlayableAuction,
      poolInfo.maxAmount1PerWallet?.raw,
      poolInfo.poolId,
      whitelist
    ]
  )

  const swapPermitCallback = useCallback(
    async (bidAmount: CurrencyAmount) => {
      if (!account) {
        return Promise.reject('no account')
      }
      if (!fixedSwapERC20Contract) {
        return Promise.reject('no contract')
      }
      //  TODO : get whitelist and signature
      // if (!poolInfo.enableWhiteList) {
      //   return Promise.reject('no enable whiteList')
      // }
      const { data } = await getUserPermitSign({
        address: account,
        category: PoolType.FIXED_SWAP,
        chainId: chainId,
        poolId: String(poolInfo.poolId),
        tokenType: 1
      })

      const args = [poolInfo.poolId, bidAmount.raw.toString(), data.expiredTime, data.signature]
      return { toData: args }
    },
    [account, chainId, fixedSwapERC20Contract, poolInfo.poolId]
  )

  return {
    swap: {
      ...swapExecuteResult,
      runWithModal: async (bidAmount: CurrencyAmount) => {
        const result = await swapCallback(bidAmount)
        return swapExecuteResult.runWithModal(result.toData)
      }
    },
    swapPermit: {
      ...swapPermitExecuteResult,
      runWithModal: async (bidAmount: CurrencyAmount) => {
        const result = await swapPermitCallback(bidAmount)
        return swapPermitExecuteResult.runWithModal(result.toData)
      }
    }
  }
}
