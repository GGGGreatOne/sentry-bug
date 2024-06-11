import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import { ApprovalState, useApproval } from '../lib/hooks/useApproval'
import { useHasPendingApproval, useTransactionAdder } from 'state/transactions/hooks'

function useGetAndTrackApproval(getApproval: ReturnType<typeof useApproval>[1]) {
  const addTransaction = useTransactionAdder()
  return useCallback(() => {
    return getApproval().then(pending => {
      if (pending) {
        const { response, amount, tokenAddress, spenderAddress: spender } = pending

        addTransaction(response, {
          // type: TransactionType.APPROVAL,
          // tokenAddress,
          // spender,
          // amount: amount.quotient.toString(),
          summary: `Approved ${amount.toExact()} ${
            amount.currency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : amount.currency.symbol?.toLocaleUpperCase()
          }`,
          approval: { tokenAddress, spender }
        })
      }
    })
  }, [addTransaction, getApproval])
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useApproval(amountToApprove, spender, useHasPendingApproval)
  return [approval, useGetAndTrackApproval(getApproval)]
}
