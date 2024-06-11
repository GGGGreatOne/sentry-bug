import { useActiveWeb3React } from '../index'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useBoxLotteryContract } from '../useContract'
import { useCallback } from 'react'
import { calculateGasMargin } from '../../utils/contract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionModalWrapper } from '../useTransactionModalWrapper'
import { useUserInfo } from '../../state/user/hooks'

export const useBet = (payTokenInPrice: string) => {
  const { account, chainId } = useActiveWeb3React()
  const userInfo = useUserInfo()
  const contract = useBoxLotteryContract(chainId)
  const addTransaction = useTransactionAdder()
  const action = 'bet'
  const run = useCallback(async () => {
    if (!account) {
      return Promise.reject('no account')
    }
    if (!contract) {
      return Promise.reject('no contract')
    }
    if (userInfo.box?.boxAddress) {
      return Promise.reject('You already have a Bounce club, please leave the opportunity for others.')
    }
    const estimatedGas = await contract.estimateGas
      .bet({
        value: payTokenInPrice
      })
      .catch((error: Error) => {
        console.debug('Failed to transfer', error)
        throw error
      })
    return contract
      .bet({
        gasLimit: calculateGasMargin(estimatedGas),
        value: payTokenInPrice
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
  }, [account, contract, addTransaction, userInfo.box, payTokenInPrice])

  const runWithModal = useTransactionModalWrapper(run, {
    successTipsText:
      'Your ticket is now entered in the lottery. If not selected, it will automatically be entered into the next round. You can withdraw your entry at any time.',
    successTipsTitle: 'Successfully participated!',
    // onSuccess() {
    //   viewControl.hide('Transfer')
    // },
    modalSuccessClose() {},
    modalSuccessCancel() {}
  })

  return { runWithModal }
}
