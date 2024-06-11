import { DEFAULT_TXN_DISMISS_MS, L2_TXN_DISMISS_MS } from '../../constants/misc'
import LibUpdater from '../../lib/hooks/transactions/updater'
import { useCallback, useMemo } from 'react'
import { PopupType } from '../application/reducer'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { L2_CHAIN_IDS } from '../../constants/chains'
import { useAddPopup } from '../application/hooks'
import { isPendingTx } from './hooks'
import { checkedTransaction, finalizeTransaction } from './reducer'
import { SerializableTransactionReceipt, TransactionDetails } from './types'
import { TransactionReceipt } from '@ethersproject/providers'
import { useActiveWeb3React } from 'hooks'

export function toSerializableReceipt(receipt: TransactionReceipt): SerializableTransactionReceipt {
  return {
    blockHash: receipt.blockHash,
    blockNumber: receipt.blockNumber,
    contractAddress: receipt.contractAddress,
    from: receipt.from,
    status: receipt.status,
    to: receipt.to,
    transactionHash: receipt.transactionHash,
    transactionIndex: receipt.transactionIndex
  }
}

export default function Updater() {
  const { chainId } = useActiveWeb3React()
  const addPopup = useAddPopup()
  // speed up popup dismissal time if on L2
  const isL2 = Boolean(chainId && (L2_CHAIN_IDS as any).includes(chainId))
  const transactions = useAppSelector(state => state.swap2.transactions)
  const pendingTransactions = useMemo(() => {
    if (!chainId || !transactions[chainId]) return {}
    return Object.values(transactions[chainId]).reduce(
      (acc, tx) => {
        if (isPendingTx(tx)) acc[tx.hash] = tx
        return acc
      },
      {} as Record<string, TransactionDetails>
    )
  }, [chainId, transactions])

  const dispatch = useAppDispatch()
  const onCheck = useCallback(
    ({ chainId, hash, blockNumber }: { chainId: number; hash: string; blockNumber: number }) =>
      dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch]
  )
  const onReceipt = useCallback(
    ({ chainId, hash, receipt }: { chainId: number; hash: string; receipt: TransactionReceipt }) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: toSerializableReceipt(receipt)
        })
      )

      // if (pendingTransactions[hash] && pendingTransactions[hash].info?.type === TransactionType.SWAP) {
      //   logSwapSuccess(hash, chainId, analyticsContext)
      // }

      addPopup(
        {
          type: PopupType.Transaction,
          hash
        },
        hash,
        isL2 ? L2_TXN_DISMISS_MS : DEFAULT_TXN_DISMISS_MS
      )
    },
    [addPopup, dispatch, isL2]
  )

  return <LibUpdater pendingTransactions={pendingTransactions} onCheck={onCheck} onReceipt={onReceipt} />
}