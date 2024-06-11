import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { useRequest } from 'ahooks'
import { globalDialogControl } from 'components/Dialog'

export function useTransactionModalWrapper<T extends any[]>(
  event: (...args: T) => Promise<TransactionResponse>,
  option?: {
    isApprove?: boolean
    hideSuccessTip?: boolean
    successTipsTitle?: string
    successTipsText?: string
    cancelText?: string
    onSuccess?: () => void
    modalSuccessCancel?: (output?: TransactionReceipt) => void
    modalSuccessClose?: () => void
  }
) {
  const { runAsync } = useRequest(
    async (...args: T) => {
      try {
        globalDialogControl.show('PendingTipDialog', {
          title: option?.isApprove ? 'Requesting Wallet Approval' : 'Requests wallet interaction',
          subTitle: option?.isApprove
            ? 'Please manually approve the transaction in your wallet.'
            : 'Please open your wallet and confirm in the transaction activity to proceed your order.'
        })

        const { wait } = await event(...args)
        const ret = new Promise((resolve, reject) => {
          globalDialogControl.show('PendingTipDialog', {
            title: 'Waiting for Transaction Settlement',
            subTitle: 'Please wait for the transaction to be settled on-chain.',
            onClose() {
              reject()
            }
          })

          wait(1).then((curReceipt: TransactionReceipt) => {
            resolve(curReceipt)
          })
        })
        try {
          const output = (await ret) as unknown as TransactionReceipt
          globalDialogControl.hide('PendingTipDialog')
          !option?.hideSuccessTip &&
            globalDialogControl.show('ResultTipDialog', {
              iconType: 'success',
              actionParams: output,
              title: option?.successTipsTitle || 'Congratulations!',
              subTitle: option?.successTipsText || `The transaction has been successfully confirmed`,
              cancelBtn: option?.cancelText || 'OK',
              onCancel: option?.modalSuccessCancel && (() => option?.modalSuccessCancel?.(output)),
              onClose: option?.modalSuccessClose
            })
          option?.onSuccess && option.onSuccess()
          return output
        } catch (error) {
          throw 'user cancel'
        }
      } catch (err: any) {
        if (err === 'user cancel') throw err
        globalDialogControl.hide('PendingTipDialog')
        let errMsg =
          err?.reason ||
          err?.error?.message ||
          err?.data?.message ||
          err?.message ||
          err?.toString() ||
          'Something went wrong'
        if (
          typeof errMsg === 'string' &&
          (errMsg.includes(`Non-200 status code: '403'`) || errMsg.includes(`JSON-RPC error`))
        ) {
          errMsg = `Rate limit,please try again later.`
        }
        globalDialogControl.show('ResultTipDialog', {
          iconType: 'error',
          title: 'Oops..',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          onAgain: () => runAsync(...args),
          subTitle: errMsg
        })
        throw err
      }
    },
    {
      manual: true
    }
  )

  return runAsync
}
