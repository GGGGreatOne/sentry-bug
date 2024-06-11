import { PoolType } from 'api/type'
import { AuctionCategory } from '../pages/erc20-create-pool/type'

export interface ICreateAuctionPoolParams {
  boxId: string
  body: {
    id?: string
    banner: string
    description: string
    name: string
    category: PoolType
    attachements?: string
  }
}

export interface ICreateAuctionPoolResult {
  expiredTime: number
  poolKey: string
  signature: string
}

export interface IBoxAuctionPoolListDataItem {
  id: string
  poolKey: string
  boxId: number
  factoryPoolId: string
  name: string
  banner: string
  description: string
  attachements: string
  token0: string
  token0Supply: string
  category: AuctionCategory
  fundingToken: string
  fundingSupply: string
  openTime: number
  closeTime: number
  allocationType: number
  delayUnlockTime: number
  refundable: number
  participantLimit: number
  distributionFee: string
  display: number
  creator: string
  blockHeight: number
  txHash: string
  ts: number
  projectName: string
  avatar: string
  merkleRoot?: string
  delFlag?: number
  draftFlag?: number
  publishId?: number
  createTime?: string
  limitAmount?: number
  swapRatio?: number
  sourcePoolId?: number
  sourceBoxId?: number
  sourceClubAvatar?: string
  sourceClubName?: string
}
export interface IBoxAuctionPoolList {
  total: number
  data: IBoxAuctionPoolListDataItem[]
}

export interface ImportWhitelistResult {
  expiredTime: number
  merkleRoot: string
  poolKey: string
  signature: string
  whiteListCount: number
}
export interface IPaginationParams {
  isAsc?: 'desc' | 'asc' //desc : reverse ,  asc: positive sequence
  orderByColumn?: 'createTime'
  pageNum: number
  pageSize: number
}

export interface IClubAuctionPoolParams {
  boxId?: string
  isAsc?: 'desc' | 'asc' //desc : reverse ,  asc: positive sequence
  orderByColumn?: 'createTime'
  pageNum: number
  pageSize: number
  category?: AuctionCategory
}

export interface IClubAuctionPoolListResult {
  total: number
  date: IBoxAuctionPoolListDataItem[]
}

export interface IClubAuctionPoolListPagination {
  total: number
  list: IBoxAuctionPoolListDataItem[]
}
export interface IWhiteListResult {
  address: string
  amount: string
  boxId: number
  createTime: string
  delFlag: number
  id: string
  merkleRoot: string
  poolKey: string
  proof: string
}
export interface IAuctionDetail {
  allocationType?: number
  attachements?: string
  banner: string
  blockHeight: number
  boxId: string
  category?: AuctionCategory
  closeTime?: number
  createTime: string
  creator?: string
  delayUnlockTime?: number
  delFlag?: number
  description: string
  display?: number
  distributionFee?: string
  draftFlag: number
  factoryPoolId?: string
  fundingSupply?: string
  fundingToken?: string
  id: string
  limitAmount?: string
  name: string
  openTime?: number
  participantLimit?: number
  poolKey: string
  publishId: number
  refundable?: number
  merkleRoot?: string
  token0?: string
  token0Supply?: string
  ts: number
  txHash: string
  sourceBoxId?: number
  sourcePoolId?: number
}
export interface IAuctionPoolResult {
  enableRef: boolean
  auction: IAuctionDetail
  whitelist: IWhiteListResult
}
export type PoolEvent =
  | 'AuctionFixedSwapSwap'
  | 'CreatorClaimed'
  | 'Reversed'
  | 'Bid'
  | 'Bet'
  | 'AuctionStakingCommitted'
export interface IAuctionHistoryDataItem {
  blockHeight: number
  boxId: number
  category: number
  contractAddress: string
  createTime?: string
  eventType: PoolEvent
  factoryPoolId: string
  id: string
  sender: string
  token0Address: string
  token0Amount: string
  token0Price?: number
  token0Value?: number
  token1Address?: string
  token1Amount?: string
  token1Price?: number
  token1Value?: number
  ts: number
  txHash: string
}

export interface IAuctionHistoryResult {
  total: number
  data: IAuctionHistoryDataItem[]
  count: number
}
export interface IAuctionHistoryPagination extends Omit<IAuctionHistoryResult, 'data'> {
  list: IAuctionHistoryDataItem[]
}
