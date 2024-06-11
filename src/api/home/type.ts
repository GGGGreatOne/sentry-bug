export interface RecommendedClubListResponse {
  rewardId: number
  followCount: number
  avatar: string
  boxId: number
  bgImage?: string | null
  bgMobileImage?: string
  projectName: string
  rank?: number | null
  tvl?: string | null
  pluginName?: string | null
}

export interface PowerfulResponse {
  totalTvl: number
  userCount: number
  clubCount: number
  pluginCount: number
}

export interface ClubPluginProps {
  createTime: string
  pluginId: number
  poolId: number
  ownerAddress: string
  eventType: number
  projectName: string
  boxId: number
  userName: string
  token1Contract?: string | null
  token0Name?: string | null
  token0Contract?: string | null
  token1Name?: string | null
}

export interface ClubPluginListProps extends ClubPluginProps {
  eventName: string
  pluginMsg: string
}

export interface ClubPluginResponse {
  total: number
  list: ClubPluginProps[]
}

export interface basicParams {
  pageNum?: number
  pageSize?: number
}

export interface ClubPluginParams extends basicParams {
  boxId?: number | string
}

export enum NewEventType {
  Create = 1,
  Closed = 2
}

export interface ClubInfoProps {
  volume: number
  rewardId: number
  followCount: number
  boxType: number
  ownerAddress: string
  userName: string
  projectName: string
  firstPublishTime: string
  boxId: number
  rank?: number | null
  avatar?: string | null
  tvl?: string | null
  userId?: number | null
  bgImage?: string | null
  bgMobleImage?: string | null
  verified?: boolean
}

export interface ClubListResponse {
  total: number
  list: ClubInfoProps[]
}

export interface ClubListParams {
  pageNum?: number
  pageSize?: number
  projectName?: string
  boxType?: string
  isAsc?: string
  orderByColumn?: string
  verified?: boolean
}

export interface HotClubPluginResponse {
  total: number
  list: HotClubPluginProps[]
}

export interface HotClubPluginProps {
  pluginName: string
  pluginId: number
  projectName: string
  avatar: string
  bgImage: string
  bgMobileImage?: string
  boxId: number | string
  collect: boolean
  verified: boolean
}
