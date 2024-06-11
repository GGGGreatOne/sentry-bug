import { Percent } from '@uniswap/sdk-core'
import { FlatFeeOptions, SwapRouter, UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import { FeeOptions, toHex } from '@uniswap/v3-sdk'
import { useCallback } from 'react'
import { ClassicTrade, TradeFillType } from '../state/routing/types'
// import { useUserSlippageTolerance } from '../state/user/hooks'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { UserRejectedRequestError, WrongChainError } from '../utils/errors'

import { didUserReject, swapErrorToUserReadableMessage } from '../utils/swapErrorToUserReadableMessage'

import { PermitSignature } from './usePermitAllowance'
import { BigNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
// import { useCachedPortfolioBalancesQuery } from '../components/PrefetchBalancesWrapper/PrefetchBalancesWrapper'
// import useBlockNumber from '../lib/hooks/useBlockNumber'
import { TransactionResponse } from '@ethersproject/providers'
import { useGetTransactionDeadline } from './useTransactionDeadline'
import isZero from 'utils'

/** Thrown when gas estimation fails. This class of error usually requires an emulator to determine the root cause. */
class GasEstimationError extends Error {
  constructor() {
    super(`Your swap is expected to fail.`)
  }
}

/**
 * Thrown when the user modifies the transaction in-wallet before submitting it.
 * In-wallet calldata modification nullifies any safeguards (eg slippage) from the interface, so we recommend reverting them immediately.
 */
class ModifiedSwapError extends Error {
  constructor() {
    super(
      `Your swap was modified through your wallet. If this was a mistake, please cancel immediately or risk losing your funds.`
    )
  }
}

interface SwapOptions {
  slippageTolerance: Percent
  permit?: PermitSignature
  feeOptions?: FeeOptions
  flatFeeOptions?: FlatFeeOptions
}

export function useUniversalRouterSwapCallback(
  trade: ClassicTrade | undefined,
  fiatValues: { amountIn?: number; amountOut?: number; feeUsd?: number },
  options: SwapOptions
) {
  const { account, chainId, library: provider } = useActiveWeb3React()
  // const blockNumber = useBlockNumber()
  const getDeadline = useGetTransactionDeadline()
  // const isAutoSlippage = useUserSlippageTolerance()[0] === 'auto'
  // const { data } = useCachedPortfolioBalancesQuery({ account })
  // const portfolioBalanceUsd = data?.portfolios?.[0]?.tokensTotalDenominatedValue?.value

  return useCallback(
    (): Promise<{ type: TradeFillType.Classic; response: TransactionResponse; deadline?: BigNumber }> =>
      (async () => {
        try {
          if (!account) throw new Error('missing account')
          if (!chainId) throw new Error('missing chainId')
          if (!provider) throw new Error('missing provider')
          if (!trade) throw new Error('missing trade')

          const connectedChainId = await provider.getSigner().getChainId()

          if (chainId !== connectedChainId) throw new WrongChainError()

          const deadline = await getDeadline()

          // trace.setData('slippageTolerance', options.slippageTolerance.toFixed(2))
          const { calldata: data, value } = SwapRouter.swapERC20CallParameters(trade, {
            slippageTolerance: options.slippageTolerance,
            deadlineOrPreviousBlockhash: deadline?.toString(),
            inputTokenPermit: options.permit,
            fee: options.feeOptions,
            flatFee: options.flatFeeOptions
          })

          const tx = {
            from: account,
            to: UNIVERSAL_ROUTER_ADDRESS(chainId),
            data,
            // TODO(https://github.com/Uniswap/universal-router-sdk/issues/113): universal-router-sdk returns a non-hexlified value.
            ...(value && !isZero(value) ? { value: toHex(value) } : {})
          }

          const gasEstimate = await (async () => {
            try {
              return await provider.estimateGas(tx)
            } catch (gasError) {
              console.warn(gasError)
              throw new GasEstimationError()
            }
          })()

          const gasLimit = calculateGasMargin(gasEstimate)

          const response = await (async () => {
            try {
              return await provider.getSigner().sendTransaction({ ...tx, gasLimit })
            } catch (error) {
              if (didUserReject(error)) {
                throw new UserRejectedRequestError(swapErrorToUserReadableMessage(error))
              } else {
                throw error
              }
            }
          })()

          if (tx.data !== response.data) {
            if (!response.data || response.data.length === 0 || response.data === '0x') {
              throw new ModifiedSwapError()
            }
          }
          return { type: TradeFillType.Classic as const, response, deadline }
        } catch (error: unknown) {
          if (error instanceof GasEstimationError) {
            // trace.setStatus('failed_precondition')
            throw error
          } else if (error instanceof UserRejectedRequestError) {
            // trace.setStatus('cancelled')
            throw error
          } else if (error instanceof ModifiedSwapError) {
            // trace.setStatus('data_loss')
            throw error
          } else {
            // trace.setError(error)
            throw Error(swapErrorToUserReadableMessage(error))
          }
        }
      })(),
    [
      account,
      chainId,
      provider,
      trade,
      getDeadline,
      options.slippageTolerance,
      options.permit,
      options.feeOptions,
      options.flatFeeOptions
    ]
  )
}
