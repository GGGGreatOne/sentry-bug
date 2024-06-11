import { useActiveWeb3React } from 'hooks'
import { useTokenAllowance } from 'hooks/useAllowances'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { useCallback, useMemo } from 'react'
import { SupportedChainId } from '../constants'
import { useTokenContract } from 'hooks/useContract'
import { useTransactionModalWrapper } from 'hooks/useTransactionModalWrapper'
import { viewControl } from 'views/editBox/modal'
import { calculateGasMargin } from 'utils/contract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder, useUserHasSubmittedRecords } from 'state/transactions/hooks'

export const useTransferErc20TokenDetail = (tokenAddress: string, queryChainId: SupportedChainId): any => {
  const { account } = useActiveWeb3React()
  const res = useToken(tokenAddress, queryChainId)

  const balance = useCurrencyBalance(account, res ?? undefined, queryChainId)
  const currentAllowance = useTokenAllowance(res ?? undefined, account ?? undefined)
  const max = useMemo(() => {
    return balance && currentAllowance
      ? balance?.greaterThan(currentAllowance)
        ? currentAllowance.toExact()
        : balance?.toExact()
      : '0'
  }, [balance, currentAllowance])
  return useMemo(() => {
    return { tokenCurrency: res, balance: balance, allowance: currentAllowance, max }
  }, [balance, currentAllowance, max, res])
}

// export function useTransfer(tokenAddress: string | undefined) {
//   const { account } = useActiveWeb3React()
//   const tokenContract = useTokenContract(tokenAddress)

//   const run = useCallback(async () => {
//     return
//   }, [])
//   const runWithModal = useTransactionModalWrapper(run, {
//     successTipsText: 'You have successfully created the club!',
//     onSuccess() {
//       viewControl.hide('CreateProjectBoxModal')
//     },
//     modalSuccessClose() {},
//     modalSuccessCancel() {}
//   })
//   return useCallback(
//     (amount: string, to: string) => {
//       // const args = [to, amount]
//       // console.log('🚀 ~ useTransfer ~ args:', args)
//       // runWithModal(args)
//       tokenContract?.transfer(to, amount)
//     },
//     [tokenContract]
//   )
// }

export function useTransfer(tokenAddress: string | undefined) {
  const { account } = useActiveWeb3React()
  const tokenContract = useTokenContract(tokenAddress)
  const addTransaction = useTransactionAdder()
  const action = 'transfer'
  const submitted = useUserHasSubmittedRecords(account || undefined, action)

  const run = useCallback(
    async ({ amount, to }: { amount: string; to: string }) => {
      if (!amount || !to) {
        return Promise.reject('no amount or to')
      }
      if (!account) {
        return Promise.reject('no account')
      }
      if (!tokenContract) {
        return Promise.reject('no contract')
      }
      const estimatedGas = await tokenContract.estimateGas.transfer(to, amount).catch((error: Error) => {
        console.debug('Failed to transfer', error)
        throw error
      })
      return tokenContract
        .transfer(to, amount, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Transfer`,
            userSubmitted: {
              account,
              action
            }
          })
          return response
        })
    },
    [account, addTransaction, tokenContract]
  )

  const runWithModal = useTransactionModalWrapper(run, {
    successTipsText: 'You have successfully transfer!',
    onSuccess() {
      viewControl.hide('Transfer')
    },
    modalSuccessClose() {},
    modalSuccessCancel() {}
  })

  return { submitted, runWithModal }
}
