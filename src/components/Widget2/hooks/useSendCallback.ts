import { Currency, CurrencyAmount } from '@uniswap/sdk-core'

import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { SendTransactionInfo, TransactionType } from '../state/transactions/types'
import { currencyId } from '../utils/currencyId'
import { UserRejectedRequestError, toReadableError } from '../utils/errors'
import { didUserReject } from '../utils/swapErrorToUserReadableMessage'
import { TransactionRequest } from '@ethersproject/providers'
import { useActiveWeb3React } from 'hooks'

export function useSendCallback({
  currencyAmount,
  recipient,
  transactionRequest
}: {
  currencyAmount?: CurrencyAmount<Currency>
  recipient?: string
  transactionRequest?: TransactionRequest
}) {
  const { account, chainId, library: provider } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!account || !chainId) throw new Error('wallet must be connect to send')
    if (!provider) throw new Error('missing provider')
    if (!transactionRequest) throw new Error('missing to transaction to execute')
    if (!currencyAmount) throw new Error('missing currency amount to send')
    if (!recipient) throw new Error('missing recipient')

    try {
      const response = await provider.getSigner().sendTransaction(transactionRequest)

      const sendInfo: SendTransactionInfo = {
        type: TransactionType.SEND,
        currencyId: currencyId(currencyAmount.currency),
        amount: currencyAmount.quotient.toString(),
        recipient
      }
      addTransaction(response, sendInfo)
    } catch (error) {
      if (didUserReject(error)) {
        throw new UserRejectedRequestError(`Transfer failed: User rejected signature`)
      }
      if (error instanceof UserRejectedRequestError) {
        throw error
      } else {
        throw toReadableError(`Transfer failed:`, error)
      }
    }
  }, [account, addTransaction, chainId, currencyAmount, provider, recipient, transactionRequest])
}
