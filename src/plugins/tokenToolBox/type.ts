export enum IReleaseType {
  Instant, // 0
  Cliff, // 1
  Linear, // 2
  Fragment // 3
}

export enum ILockType {
  Normal = '1',
  Stage = '2',
  Linear = '3',
  V2 = '4',
  V3 = '5'
}

export interface MyDisperseList {
  list: Disperse[]
  total: number
}

export interface Disperse {
  id: number
  contract: string
  creator: string
  chain_id: number
  token: string
  name: string
  amount: string
  total_count: string
  decimals: number
  hash: string
  tx_ts: number
  block_height: number
  created_at: string
  updated_at: string
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
