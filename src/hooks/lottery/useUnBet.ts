import { useActiveWeb3React } from '../index'
import { useBoxLotteryContract } from '../useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useCallback } from 'react'
import { calculateGasMargin } from '../../utils/contract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionModalWrapper } from '../useTransactionModalWrapper'

export const useUnBet = () => {
  const { account, chainId } = useActiveWeb3React()
  const contract = useBoxLotteryContract(chainId)
  const addTransaction = useTransactionAdder()
  const action = 'unBet'
  const run = useCallback(async () => {
    if (!account) {
      return Promise.reject('no account')
    }
    if (!contract) {
      return Promise.reject('no contract')
    }
    const estimatedGas = await contract.estimateGas.unBet().catch((error: Error) => {
      console.debug('Failed to transfer', error)
      throw error
    })
    return contract
      .unBet({
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Bet club`,
          userSubmitted: {
            account,
            action
          }
        })
        return response
      })
  }, [account, contract, addTransaction])

  const runWithModal = useTransactionModalWrapper(run, {
    successTipsText: 'You have successfully withdrawn your entry from the BounceClub lottery.',
    // onSuccess() {
    //   viewControl.hide('Transfer')
    // },
    modalSuccessClose() {},
    modalSuccessCancel() {}
  })

  return { runWithModal }
}
