import Twitter from 'assets/svg/boxes/twitter.svg'
import Telegram from 'assets/svg/boxes/telegram.svg'
import Medium from 'assets/svg/boxes/medium.svg'
import Discord from 'assets/svg/boxes/discord.svg'
import Facebook from 'assets/svg/boxes/facebook.svg'
import Youtube from 'assets/svg/boxes/youtube.svg'
import { IPluginNameType } from 'state/boxes/type'

export enum BoxTypes {
  PROJECT = 1,
  USER = 2
}
export type IUploadValue = {
  fileName: string
  fileSize: number
  fileThumbnailUrl: string
  fileType: string
  fileUrl: string
  id: number
}

export const LinkSvgList = {
  twitter: Twitter,
  telegram: Telegram,
  medium: Medium,
  discord: Discord,
  facebook: Facebook,
  youtube: Youtube
}

export enum PluginStatus {
  NORMAL = 0,
  SOON = 1
}

export interface IPluginNameInfo {
  createTime: string
  updateTime: string
  id: string
  pluginName: IPluginNameType
  icon: null | string
  banner: null | string
  free: boolean
  fee: null | string
  boxTypes: BoxTypes
  developer: null
  description: null | string
  category: null | string
  factoryAddress: null | string
  delFlag?: 0 | 1
}

export interface ICreateBoxParams {
  projectName: string
  avatar: string
  description: string
  boxType: BoxTypes
  bgImage: string
  plugins: string
}
export interface ICreateBoxResult {
  boxId: string
  singature: string
  address: string
  expiredTime: number
}

export enum IBoxTypes {
  Normal = 0,
  ComingSoom = 1
}

export interface PluginListResult {
  id: number
  pluginName: string
  icon: string
  createTime: string
  updateTime: string
  category: string
  boxTypes: string
  free: boolean
  status: IBoxTypes
  developer: string
  factoryAddress: string
  delFlag: number
  banner?: string | null
  fee?: string | null
  introduction?: string | null
  description?: string | null
  language?: string | null
  used?: number | null
}

export interface EnablePluginListResult {
  banner: string
  id: string
  pluginName: string
  icon: string
  category: string
  url: string
  status: number
}

// export enum BoxFilterType {
//   // VerifiedOnly = 'VerifiedOnly',
//   ProjectBoxes = 'ProjectBoxes',
//   UserBoxes = 'UserBoxes'
// }

export type BoxSearchValue = {
  id: string
  name: string
  url: string
  boxId: string
  followers: number
  type: BoxTypes
}

export enum OrderType {
  RANKS = 'ranks',
  TVL = 'tvl',
  ID = 'id',
  TXTS = 'txTs'
}

export enum IListOrder {
  DESC = 'desc',
  ASC = 'asc'
}

export type GetBoxListParams = {
  pageNum?: number
  pageSize?: number
  projectName?: string
  boxType?: string
  orderByColumn?: OrderType
  isAsc?: IListOrder
}

export interface BoxListSimpleResult {
  total: number
  list: BoxListSimpleItem[]
}

export type BoxListSimpleItem = {
  followCount: number
  tvl: string | null
  projectName: string
  isFollower: boolean | undefined
  boxId: number
  description: string
  rank: number | null
  avatar: string
  rewardId: number
  verified: boolean
}
export interface BoxListResult {
  total: number
  list: BoxListItem[]
}
export interface BoxListItem extends BoxListSimpleItem {
  ownerAddress: string
  boxType: BoxTypes
  bgImage: string | null
  bgMobileImage?: string
  userId: number
}
export interface IStablecoinListParams {
  token0Name?: string | null
  token0Contract?: string | null
  pageSize?: number
  pageNum?: number
}

export interface StableListResult {
  total: number
  list: StableListItem[]
}

export type TroveListItem = {
  createTime: string | null
  updateTime: string | null
  id: string | null
  boxId: string | null
  chainId: number | null
  borrower: string | null
  debt: number | null
  coll: number | null
  stake: number | null
  status: number | null
  ratio: number | null
}

export interface StablecoinTroveListResult {
  total: number
  list: TroveListItem[]
}

export type StableListItem = {
  instanceAddress: string | null
  token0Contract: string
  token0Name: string | null
  token0Symbol: string | null
  smallImg: string | null
  bigImg: string | null
  id: number
  boxId: number
  boxAddress: string
}

export interface IPluginListParams {
  boxTypes?: string
  category?: string
  id?: number
  isAsc?: string
  orderByColumn?: string
  status?: number
  boxes?: string
  pageSize?: number | null
  pageNum?: number | null
}

export interface ClubRanksListParams {
  clubId?: string | number
  params?: IPluginListParams
}

export interface IStablecoinTroveParams extends IPluginListParams {
  boxId?: string | null
}

export type GetPluginListItem = {
  pluginName: string
  createTime: string
  boxTypes: string
  id: number
  used: number
  free: boolean
  category: string
  status: IBoxTypes
  icon: string
  banner: string
  description: string
  language: string
  factoryAddress: string
  developer: string
  introduction: string
}

export interface IPluginListResult {
  total: number
  list: GetPluginListItem[]
}

export enum BoxFilterType {
  VerifiedOnly = 'VerifiedOnly',
  ProjectBoxes = 'ProjectBoxes',
  UserBoxes = 'UserBoxes'
}

export interface ClubRankInfo {
  rank: number
  userName: string
  userId: number
  boxId: number
  avatar?: string | null
}

export interface ClubRanksResult {
  total: number
  rank: number
  list: ClubRankInfo[]
}

export interface TokenPriceInfo {
  coinId: string
  price: string
}

export interface IPluginLeverageHistoryParams {
  pageSize?: number
  pageNum?: number
  boxId?: number
  tradeTrader?: string
  tradePairIndex?: number
  tradeIndex?: number
}

export interface LeverageHistory {
  createTime: string
  updateTime: string
  id: string
  boxId: string
  chainId: number
  orderId: number
  limitIndex: number
  tradeTrader: string
  tradePairIndex: string
  tradeIndex: string
  // TODO tradeInitialPosToken and tradePositionSizeDai Returns scientific notation
  tradeInitialPosToken: number
  tradePositionSizeDai: number
  tradeOpenPrice: number
  tradeBuy: number
  tradeLeverage: number
  tradeTp: number
  tradeSl: number
  marketOpen: number
  limitNftHolder: string
  limitOrderType: number
  price: number
  priceImpactP: number
  positionSizeDai: number
  percentProfit: number
  daiSentToTrader: number
  executeTime: string
  token: string
  status: number
  marketType: string
}

export interface LeverageHistoryReturnData {
  list: LeverageHistory[]
  total: number
}

export interface StakePoolParams {
  id: string
  boxId: number
  pluginId: number
  instanceAddress: string
  token0Type?: number
  token0Name?: string
  token0Contract?: string
  token0Symbol?: string
  token0Id?: number
  token1Name?: string
  token1Contract?: string
  token1Symbol?: string
  token1Id?: number
  fee?: string
  tiketSize?: string
  initialLp?: string
  extraInfo?: string
  sort?: number
  display?: number
  endFlag?: number
  delFlag?: number
  createTime?: string
  updateTime?: string
}

export interface StakePoolListResult {
  list: StakePoolParams[]
  total: number
}

export interface GetStakePoolListParams {
  boxId?: string
  pluginId?: string
  pageSize: number
  pageNum: number
}
export enum TokenVerified {
  Verified,
  NotVerified
}
export enum TokenType {
  TOKEN,
  V2LP,
  V3LP
}
export interface ITokenListParams {
  boxId?: number
  pluginId?: number
  tokenName?: string
  verified?: TokenVerified
  pageSize?: number
  pageNum?: number
  contractAddress?: string
}

export interface ITokenListRet {
  id: string
  boxId: string
  creator: string
  tokenType: TokenType
  tokenName: string
  tokenSymbol: string
  contractAddress: string
  decimals: number
  smallImg: string
  bigImg: string
  pluginId: number
  token0Contract: string
  token1Contract: string
  delFlag: number
  price: string
  supply: string
  hash: string
  txTs: string
  blockHeight: string
  verified: TokenVerified
  coinId: string
}

export interface ITokenListResult {
  total: number
  data: ITokenListRet[]
}

export interface GetClubNetWorthListResult {
  total: number
  totalVolume: number
  totalTvl: number
  list: ClubNetWorthLisItem[]
}

export type ClubNetWorthLisItem = {
  box_id: string
  volume: string
  plugin_id: string
  tvl_rank: string | null
  pluginName: string
  icon: string
  volume_rank: number | null
  id: number
  tvl: string
}
