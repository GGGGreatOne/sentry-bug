import { IListOrder, OrderType } from 'api/boxes/type'
import { ILockType } from 'plugins/tokenToolBox/type'

export interface DisperseListParam {
  address?: string
  chainId?: number
  token?: string
  hash?: string
  offset?: number
  limit?: number
}

export interface GetLocksListParam {
  tokenContract?: string
  pageNum?: number
  pageSize?: number
  orderByColumn?: OrderType
  isAsc?: IListOrder
}

export interface TokenInfoList {
  list: TokenInfo[]
  total: number
}

export interface ExchangeInfo {
  id: number
  chain_id: number
  name: string
  logo?: string
  uniswap: string
  chain_type: number
  created_at: string
  updated_at: string
}

export interface ExchangeList {
  list: ExchangeInfo[]
  total: number
}

export interface TokenInfo {
  id: number
  contract: string
  creator: string
  token_type: number
  chain_id: string
  token: string
  name: string
  symbol: string
  decimals: number
  thumb_url: string
  small_url: string
  large_url: string
  price: string
  supply: string
  hash: string
  tx_ts: number
  block_height: number
  created_at: string
  updated_at: string
}

export interface LockInfoList {
  list: LockInfo[]
  total: number
}

export interface LockInfo {
  createTime: string
  id: string
  boxId: string
  contract: string
  creator: string
  factory: string
  token: string
  tokenId: string
  deployContract: string
  newOwner: string
  title: string
  amount: string
  lockType: ILockType
  lockStart: number
  lockEnd: number
  hash: string
  txTs: number
  blockHeight: string
  decimals: number
  logoUri: string
}

export interface ExchangeParam {
  chainId: number
  uniVersion: number
  limit?: number
  offset?: number
}

export interface GetDisperselistParam {
  tokenContract?: string
  pageSize?: number
  pageNum?: number
  orderByColumn?: OrderType
  isAsc?: IListOrder
}

export interface GetDisperselistResult {
  list: Disperse[]
  total: number
}

export interface Disperse {
  createTime: string
  id: number
  boxId: string
  contract: string
  creator: string
  token: string
  decimals: number
  name: string
  amount: string
  hash: string
  totalCount: string
  txTs: string
  blockHeight: string
  logoUri: string
}

export interface TokenUploadimgParam {
  tokenContract: string
  imageUrl: string
}
