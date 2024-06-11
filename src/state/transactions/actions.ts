import { createAction } from '@reduxjs/toolkit'
import { SupportedChainId as LocalChainId } from '../../constants/chains'
import { ChainId } from '@uniswap/sdk-core'
import { TransactionInfo } from 'components/Widget2/state/transactions/types'

type SupportedChainId = LocalChainId | ChainId
export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export interface UserSubmittedProp {
  account: string
  action: string
  key?: string | number
}

export interface ITransactionCustomData {
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  userSubmitted?: UserSubmittedProp
  summary?: string
  info?: TransactionInfo
}

interface AddTransactionPayload {
  from: string
  hash: string
  info?: TransactionInfo
  nonce?: number
  deadline?: number
  receipt?: SerializableTransactionReceipt
}

export const addTransaction = createAction<
  {
    chainId: SupportedChainId
    hash: string
    from: string
  } & ITransactionCustomData &
    AddTransactionPayload
>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: SupportedChainId }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: SupportedChainId
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: SupportedChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
export const removeTransaction = createAction<{
  chainId: SupportedChainId
  hash: string
}>('transactions/removeTransaction')
export const cancelTransaction = createAction<{
  chainId: SupportedChainId
  hash: string
  cancelHash: string
}>('transactions/cancelTransaction')
