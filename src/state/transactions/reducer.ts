import { createReducer } from '@reduxjs/toolkit'
import {
  addTransaction,
  cancelTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  ITransactionCustomData,
  removeTransaction,
  SerializableTransactionReceipt
} from './actions'
import { TransactionInfo } from 'components/Widget2/state/transactions/types'

const now = () => new Date().getTime()

export type TransactionDetails = {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  cancelled?: boolean
  info?: TransactionInfo
  nonce?: number
} & ITransactionCustomData

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

export default createReducer(initialState, builder =>
  builder
    .addCase(
      addTransaction,
      (transactions, { payload: { chainId, from, hash, approval, summary, claim, userSubmitted } }) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = transactions[chainId] ?? {}
        txs[hash] = { hash, approval, summary, claim, from, addedTime: now(), userSubmitted }
        transactions[chainId] = txs
      }
    )
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    })
    .addCase(removeTransaction, (transactions, { payload: { chainId, hash } }) => {
      if (transactions[chainId][hash]) {
        delete transactions[chainId][hash]
      }
    })
    .addCase(cancelTransaction, (transactions, { payload: { hash, chainId, cancelHash } }) => {
      const tx = transactions[chainId]?.[hash]

      if (tx) {
        delete transactions[chainId]?.[hash]
        transactions[chainId][cancelHash] = {
          ...tx,
          hash: cancelHash,
          cancelled: true
        }
      }
    })
)
