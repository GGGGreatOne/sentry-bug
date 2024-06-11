import { Contract } from '@ethersproject/contracts'
import { useBoxContract, useBoxFactoryContract } from './useContract'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import { useTransactionAdder, useUserHasSubmittedRecords } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils/contract'
import { useTransactionModalWrapper } from './useTransactionModalWrapper'
import { useRouter } from 'next/router'
import { viewControl } from 'views/editBox/modal'

export function useCreateBox() {
  const boxFactoryContract = useBoxFactoryContract()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const action = 'create_box'
  const router = useRouter()
  const submitted = useUserHasSubmittedRecords(account || undefined, action)
  const run = useCallback(
    async ({ boxId, expiredAt, signature }: { boxId: string; expiredAt: number; signature: string }) => {
      if (!boxId) {
        return Promise.reject('no club id')
      }
      if (!account) {
        return Promise.reject('no account')
      }
      if (!boxFactoryContract) {
        return Promise.reject('no contract')
      }
      const estimatedGas = await boxFactoryContract.estimateGas
        .createBox(boxId, expiredAt, signature)
        .catch((error: Error) => {
          console.debug('Failed to create club', error)
          throw error
        })
      return boxFactoryContract
        .createBox(boxId, expiredAt, signature, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `You created a club`,
            userSubmitted: {
              account,
              action
            }
          })
          return response
        })
    },
    [account, addTransaction, boxFactoryContract]
  )

  const runWithModal = useTransactionModalWrapper(run, {
    successTipsText: 'You have successfully created the club!',
    onSuccess() {
      viewControl.hide('CreateProjectBoxModal')
    },
    modalSuccessClose() {
      router.push('/club/editClub')
    },
    modalSuccessCancel() {
      router.push('/club/editClub')
    }
  })

  return { submitted, runWithModal }
}
export interface iBoxExecuteSendParams<T> {
  toContract: T | null
  toFunc: string
  toData: any
  value?: string
}
interface iBoxExecuteSendTransactionConfig {
  summary: string
  action: string
  key?: string | number
  hideSuccessTip?: boolean | undefined
  successTipsTitle?: string | undefined
  successTipsText?: string | undefined
  cancelText?: string
  modalSuccessCancel?: (params?: TransactionReceipt) => void | undefined
  onSuccess?: (() => void) | undefined
  modalSuccessClose?: (() => void) | undefined
}

export function useBoxExecute<T extends Contract>(
  boxAddress: string | undefined,
  contractData: iBoxExecuteSendParams<T>,
  config: iBoxExecuteSendTransactionConfig,
  devForceCommit?: boolean
) {
  // const { boxContract } = useWidgetData()
  devForceCommit = process.env.NODE_ENV === 'development' ? devForceCommit : false
  const boxContract = useBoxContract(boxAddress)
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const submitted = useUserHasSubmittedRecords(account || undefined, config.action, config.key)
  const run = useCallback(
    async (callData?: any[], value?: string) => {
      if (!account) {
        return Promise.reject('Account not found')
      }
      if (!boxContract) {
        return Promise.reject('Contract not found')
      }

      if (!contractData.toContract || !contractData.toFunc) {
        return Promise.reject('Contract params error')
      }

      const executeData = contractData.toContract.interface.encodeFunctionData(
        contractData.toFunc,
        callData || contractData.toData
      )

      let estimatedGas = undefined
      if (!devForceCommit) {
        estimatedGas = await boxContract.estimateGas
          .execute(contractData.toContract.address, executeData, {
            value: value || contractData.value
          })
          .catch((error: Error) => {
            console.debug('Failed to create club', error)
            throw error
          })
      }

      return boxContract
        .execute(contractData.toContract.address, executeData, {
          value: value || contractData.value,
          gasLimit: devForceCommit || !estimatedGas ? '3500000' : calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: config.summary,
            userSubmitted: {
              account,
              action: config.action,
              key: config.key
            }
          })
          return response
        })
    },
    [
      account,
      addTransaction,
      boxContract,
      config.action,
      config.key,
      config.summary,
      contractData.toContract,
      contractData.toData,
      contractData.toFunc,
      contractData.value,
      devForceCommit
    ]
  )

  const runWithModal = useTransactionModalWrapper(run, {
    hideSuccessTip: config.hideSuccessTip,
    successTipsTitle: config.successTipsTitle,
    successTipsText: config.successTipsText,
    cancelText: config.cancelText,
    modalSuccessCancel: config.modalSuccessCancel,
    onSuccess: config.onSuccess,
    modalSuccessClose: config.modalSuccessClose
  })

  return { submitted, runWithModal }
}
