import { IPluginNameType } from 'state/boxes/type'
import { BoxTypes } from '../boxes/type'
export interface IAddressRegisterLoginParams {
  text: string
  walletAddress: string
  signature: string
}

export interface IAddressRegisterLoginResponse {
  userId: number
  token: string
}

export interface ILoginUserInfoBox {
  boxAddress: string
  rewardId: number | null
  ranks?: number | null
  rank?: number | null
  avatar?: string | null
  tvl?: string | null
  projectName: string | null
  boxId: string | null
  createTime?: string | null
  boxType: BoxTypes
  airdrop?: {
    address: string
    tokenAmount?: number | string
    status: ClaimAirdropStatus
    twitterFlag: BoxUserBindTwitter
    clubOwner: IsTestnetClubOwner
  }
}

export interface IBoxCheckStatus {
  boxStatus: IBoxUserStatus
  rewardId?: number | null
  ranks?: number | null
  avatar?: string | null
  tvl?: string | null
  projectName?: string | null
  bgImage?: string | null
  volume?: number | null
  createTime?: string | null
  airdrop?: {
    address: string
    tokenAmount?: number | string
    status: ClaimAirdropStatus
    twitterFlag: BoxUserBindTwitter
    clubOwner: IsTestnetClubOwner
  }
}

export interface ILoginUserInfoFollow {
  followers?: number
  following: number
}

export enum IBoxOwnerBoolean {
  NO = 0,
  YES = 1
}

export enum ClaimAirdropStatus {
  NOT_ELIGIBLE = -1,
  ELIGIBLE = 1
}

export enum BoxUserBindTwitter {
  NO,
  YES
}

export enum IsTestnetClubOwner {
  NO,
  YES
}

export enum IBoxUserStatus {
  NOT_OBTAIN = -1,
  UNCLAIMED = 0,
  CLAIMED = 1,
  CREATED = 2
}
export enum ITwitterFollower {
  NOT_FOLLOW = 0,
  FOLLOWING = 1
}
export interface ILoginUserInfoUser {
  userId: number
  eoaAddress: string
  avatar?: string | null
  boxId?: number | null
  boxOwner: IBoxOwnerBoolean
  boxStatus: IBoxUserStatus
  twitterSocialId?: number | null
  twitterFollower?: ITwitterFollower | null
  userName?: string | null
}

export interface ILoginUserInfo {
  box?: ILoginUserInfoBox | null
  follow: ILoginUserInfoFollow | null
  user: ILoginUserInfoUser | null
  didLogin?: boolean
}
export interface IGetUserBoxInfoParams {
  msg: string
  code: number
  boxStatus: IBoxUserStatus
}

export interface IGetUserBoxInfoParams {
  msg: string
  code: number
  boxStatus: IBoxUserStatus
}

export enum FollowType {
  FOLLOW = 1,
  UN_FOLLOW = 0
}
export interface FollowBoxParams {
  boxId: number
  following: FollowType
}
export interface IAuthorizeAddress {
  url: string
}

export interface GetFollowingListParams {
  boxType?: string
  pageNum?: number
  pageSize?: number
}

export interface FollowinglistItem {
  create_time: string
  boxType: BoxTypes
  bgImage: string
  bgMobileImage?: string
  avatar: string
  tvl: string
  userId: number
  rewardId: number
  update_time: string
  isFollower: boolean
  rank: number
  id: number
  projectName: string
  boxId: number
  eoaAddress: string
  description: string
  followCount: number
  userName: string
}

export interface Followinglist {
  total: number
  list: FollowinglistItem[]
}

export interface FollowingCount {
  projectBoxCount: number
  totalCount: number
  userBoxCount: number
}

export enum ActivitiesListFilter {
  FAVORITE = 1,
  PARTICIPATED = 2
}

export interface GetActivitiesListParams {
  pageNum?: number
  pageSize?: number
  filter?: ActivitiesListFilter
  pluginId?: number
}

export interface ActivitiesList {
  total: number
  list: ActivitiesListItem[]
}

export interface ActivitiesListItem {
  token1Name: string
  token0Name: string
  pluginId: number
  poolId: number
  endFlag: boolean
  avatar: string
  projectName: string
  pluginName: IPluginNameType
  boxId: number
  bgImage: string
  bgMobileImage?: string
  collect: boolean
  verified: boolean
}

export interface ActivitiesCount {
  totalCount: number
  pluginList: ActivitiesCountItem[]
}

export interface ActivitiesCountItem {
  pluginName: string
  pluginId: string
  count: number
}

export enum CollectStatus {
  COLLET = 1,
  UN_COLLET = 0
}

export interface CollectPluginParams {
  boxPluginId: number
  collect: CollectStatus
}

export interface GetFollowerlistParams {
  pageNum?: number
  pageSize?: number
  boxType?: string
  user?: number
}

export interface Followerlist {
  total: number
  list: FollowerlistItem[]
}

export interface Friendlist {
  total: number
  list: FriendlistItem[]
}

export interface UserAvatarParams {
  avatar: string
}

export interface UserNameParams {
  userName: string
}

export interface FollowerlistItem {
  userId: string
  eoaAddress: string
  id: number
  userAvatar: string | null
  boxType: BoxTypes | null
  tvl: string | null
  rewardId: number | null
  update_time: string | null
  rank: number | null
  projectName: string | null
  boxAvatar: string | null
  boxId: number | null
  description: string
  followCount: number
  following: boolean
  userName: string
}

export interface FriendlistItem {
  rewardId: number | null
  verified: boolean
  rank?: number | null
  boxType?: BoxTypes | null
  bgImage?: string | null
  avatar: string | null
  tvl?: string | null
  projectName: string | null
  boxId: number
  description: string
  followCount: number
}
export interface FollowerCount {
  projectBoxCount: number
  friendCount: number
  userBoxCount: number
  userCount: number
  totalCount: number
}
