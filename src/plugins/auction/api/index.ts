import { ApiInstance } from 'utils/fetch'
import {
  IAuctionHistoryResult,
  IAuctionPoolResult,
  IBoxAuctionPoolList,
  IClubAuctionPoolListResult,
  IClubAuctionPoolParams,
  ICreateAuctionPoolParams,
  ICreateAuctionPoolResult,
  ImportWhitelistResult,
  IPaginationParams
} from './type'

export function createAuctionPool(params: ICreateAuctionPoolParams) {
  return ApiInstance.post<ICreateAuctionPoolResult>(`auction/create/${params.boxId}`, params.body)
}

// this is draft
export function getBoxAuctionPoolList(boxId: string, params: IPaginationParams) {
  return ApiInstance.get<IBoxAuctionPoolList>(`auction/draft/${boxId}`, params)
}

export function getClubAuctionPoolList(params: IClubAuctionPoolParams) {
  return ApiInstance.get<IClubAuctionPoolListResult>('auction/list', params)
}
export function importAuctionWhitelist(poolKey: string, body: { whitelist: string[] }) {
  return ApiInstance.post<ImportWhitelistResult>(`auction/whitelist/${poolKey}`, body)
}

export function getAuctionPoolInfo(poolId: string) {
  return ApiInstance.get<IAuctionPoolResult>(`auction/info/${poolId}`)
}

export function getAuctionHistory(poolId: string, params?: IPaginationParams) {
  return ApiInstance.get<IAuctionHistoryResult>(`auction/histroy/${poolId}`, params)
}

export function addOtherAuction(boxId: string, poolId: string) {
  return ApiInstance.post(`auction/reference/${boxId}`, { poolId })
}
