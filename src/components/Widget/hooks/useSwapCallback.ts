import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from '@uniswap/sdk'
import { useMemo } from 'react'
import { getRouterContract } from '../utils'
import { useTransactionAdder } from 'state/transactions/hooks'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../constant'
import { useActiveWeb3React } from 'hooks'
import useENS from './useENS'
import isZero, { isAddress, shortenAddress } from 'utils'
import useTransactionDeadline from './useTransactionDeadline'
import { BigNumber } from 'ethers'
// import { useWidgetData } from './Box'
import { getSymbol } from '../utils/getSymbol'
import { calculateGasMargin } from 'utils/contract'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    const contract: Contract | null = getRouterContract(chainId, library, account)
    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber()
      })
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber()
        })
      )
    }

    return swapMethods.map(parameters => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  // const { boxContract } = useWidgetData()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!library) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing contract' }
    }
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map(call => {
            const {
              parameters: { methodName, args, value },
              contract
            } = call
            const options = !value || isZero(value) ? {} : { value }

            const executeData = contract.interface.encodeFunctionData(methodName, args)

            return library
              .estimateGas({
                from: account,
                to: contract.address,
                data: executeData,
                value: options.value
              })
              .then(gasEstimate => {
                return {
                  call,
                  gasEstimate
                }
              })
              .catch(gasError => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call, gasError)

                let errorMessage: string
                // switch (gasError.reason) {
                //   case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                //   case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                //     errorMessage =
                //       'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                //     break
                //   default:
                //     errorMessage = `The transaction cannot succeed due to error: ${gasError.reason}. This is probably an issue with one of the tokens you are swapping.`
                // }
                if (
                  gasError.reason?.includes('INSUFFICIENT_OUTPUT_AMOUNT') ||
                  gasError.reason?.includes('EXCESSIVE_INPUT_AMOUNT')
                ) {
                  errorMessage =
                    'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                } else {
                  let errMsg =
                    gasError?.reason ||
                    gasError?.error?.message ||
                    gasError?.data?.message ||
                    gasError?.message ||
                    gasError?.toString()
                  if (
                    typeof errMsg === 'string' &&
                    (errMsg.includes(`Non-200 status code: '403'`) || errMsg.includes(`JSON-RPC error`))
                  ) {
                    errMsg = `Rate limit,please try again later.`
                  }
                  errorMessage = `The transaction cannot succeed due to error: ${errMsg}. This is probably an issue with one of the tokens you are swapping.`
                }
                return { call, error: new Error(errorMessage) }

                // return contract.callStatic[methodName](...args, options)
                //   .then(result => {
                //     console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                //     return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                //   })
                //   .catch(callError => {
                //     console.debug('Call threw error', call, callError)
                //     let errorMessage: string
                //     switch (callError.reason) {
                //       case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
                //       case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
                //         errorMessage =
                //           'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
                //         break
                //       default:
                //         errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`
                //     }
                //     return { call, error: new Error(errorMessage) }
                //   })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value }
          },
          gasEstimate
        } = successfulEstimation

        // boxContract
        // .execute(contractData.toContract.address, executeData, {
        //   value: contractData.value,
        //   gasLimit: devForceCommit || !estimatedGas ? '3500000' : calculateGasMargin(estimatedGas, 10)
        // })

        const executeData = contract.interface.encodeFunctionData(methodName, args)

        // return

        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: contract.address,
            data: executeData,
            value: value && !isZero(value) ? value : undefined,
            gasLimit: !gasEstimate ? '3500000' : calculateGasMargin(gasEstimate)
          })
          .then((response: any) => {
            const inputSymbol = getSymbol(trade.inputAmount.currency, chainId)
            const outputSymbol = getSymbol(trade.outputAmount.currency, chainId)
            const inputAmount = trade.inputAmount.toSignificant(3)
            const outputAmount = trade.outputAmount.toSignificant(3)
            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            const withVersion = withRecipient

            addTransaction(response, {
              summary: withVersion
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              let errMsg = `${error.message?.slice(0, 200)}${error.message?.length > 200 ? '...' : ''}`
              if (
                typeof errMsg === 'string' &&
                (errMsg.includes(`Non-200 status code: '403'`) || errMsg.includes(`JSON-RPC error`))
              ) {
                errMsg = `Rate limit,please try again later.`
              }
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`Swap failed: ${errMsg}`)
            }
          })
      },
      error: null
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction])
}
