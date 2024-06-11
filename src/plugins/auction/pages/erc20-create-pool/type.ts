import { createStakeVal, ICreateStakePool } from 'plugins/auction/plugins/stake/pages/create-stake/createType'
import { AuctionType, ParticipantStatus } from '../../plugins/fixed-price/constants/type'
import {
  createFixedPriceVal,
  ICreateFixedPricePool
} from '../../plugins/fixed-price/pages/create-fixed-price/createType'
import { IAuctionDetail, IWhiteListResult } from 'plugins/auction/api/type'

export interface IBasicInformation {
  auctionName: string
  PCbannerUrl: string
  MobileBannerUrl: string
  dec: string
  attachments?: string
  id?: string
}
export interface ICreatePoolSettings {
  participantStatus: ParticipantStatus
  whiteListAddress?: string[]
  // 0 - 1e18 , 0 = No handling fee
  clubShare: string
  whitelistWithAmount?: string
}
export type ActiveType = 'BASIC_INFO' | 'AUCTION_DETAIL' | 'PARTICIPANT_SETTINGS'
export interface IActiveTab {
  index: number
  tabs: Array<ActiveType>
}

export interface AuctionTypePoolMap {
  [AuctionType.FIXED_PRICE]: ICreateFixedPricePool
  [AuctionType.STAKING_AUCTION]: ICreateStakePool
}

export type CreatePoolInfo = AuctionTypePoolMap[keyof AuctionTypePoolMap]
export interface ICreateAuthentication {
  expiredTime: number
  poolKey: string
  signature: string
  whiteListCount?: number
  merkleRoot?: string
}

export interface ICreatePoolParams {
  basic: IBasicInformation
  poolInfo: CreatePoolInfo
  settings: ICreatePoolSettings
  activeTab: IActiveTab
  auth: ICreateAuthentication
}
export enum ProviderDispatchActionType {
  setBasicInfo = 'SET_BASIC_INFO',
  nextActive = 'NEXT_ACTIVE',
  prevActive = 'PREV_ACTIVE',
  resetVal = 'RESET_VAL',
  setPoolValue = 'SET_POOL_VALUE',
  setSettingValue = 'SET_SETTING_VALUE',
  setAuth = 'SET_AUTH'
}
export const AuctionTypeToValueMap: AuctionTypePoolMap = {
  [AuctionType.FIXED_PRICE]: createFixedPriceVal,
  [AuctionType.STAKING_AUCTION]: createStakeVal
}
export const AuctionTypeToStepMap: { [key in AuctionType]: IActiveTab['tabs'] } = {
  [AuctionType.FIXED_PRICE]: ['BASIC_INFO', 'AUCTION_DETAIL', 'PARTICIPANT_SETTINGS'],
  [AuctionType.STAKING_AUCTION]: ['BASIC_INFO', 'AUCTION_DETAIL']
}
interface PayloadType {
  [ProviderDispatchActionType.setBasicInfo]: {
    basicInfo: IBasicInformation
  }
  [ProviderDispatchActionType.nextActive]: undefined
  [ProviderDispatchActionType.prevActive]: undefined
  [ProviderDispatchActionType.resetVal]: undefined
  [ProviderDispatchActionType.setPoolValue]: {
    auctionType: AuctionType
    poolValue?: CreatePoolInfo
  }
  [ProviderDispatchActionType.setSettingValue]: {
    settingValue: ICreatePoolSettings
  }
  [ProviderDispatchActionType.setAuth]: {
    auth: ICreateAuthentication
  }
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
        payload: null
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export type Actions = ActionMap<PayloadType>[keyof ActionMap<PayloadType>]

export interface IAuctionPoolInfo {
  isEnWhiteList?: boolean | undefined
  isWhiteListPool?: boolean | undefined
  auction?: IAuctionDetail | undefined
  whitelist?: IWhiteListResult | undefined
  enableRef?: boolean
}

export enum AuctionCategory {
  'Fixed Price Auction' = 1,
  'Staking Auction' = 2
}
