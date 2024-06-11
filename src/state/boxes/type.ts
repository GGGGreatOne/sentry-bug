import { EnablePluginListResult } from 'api/boxes/type'

export type ILinksTypeName = 'twitter' | 'telegram' | 'facebook' | 'youtube' | 'discord' | 'website' | 'medium'

export type ILinksValue = {
  typeName: ILinksTypeName
  url: string
}

export enum IsLogin {
  Unlogin,
  UnPermissions,
  Permissions
}

export enum ICoinId {
  AMMX = 'ammx',
  AUCTION = 'auction',
  BinanceBitcoin = 'binance-bitcoin',
  Bitstable = 'bitstable-finance',
  COMORDI = 'com-ordinals',
  DAII = 'daii',
  ETH = 'ethereum',
  MOGCOIN = 'mog-coin',
  MUBI = 'multibit',
  OOFP = 'oofp',
  ORDINALS = 'ordinals',
  RABBIT = 'rabbit-games',
  SATOSHIVM = 'satoshivm',
  SATS = 'sats-ordinals',
  TETHER = 'tether',
  ZOOPIA = 'zoopia'
}

export type IBackgroundValue = {
  id: string
  projectName: string
  introduction: string
  title1: string
  textColor: string
  backgroundImg: string | undefined
  backgroundMobileImg?: string
  links: ILinksValue[]
}

export enum IBoxAboutSectionTypeName {
  SIMPLE = 'SIMPLE',
  SOCIAL_CONTENT = 'SOCIAL CONTENT',
  TOKENOMIC = 'TOKENOMIC',
  ROADMAP = 'ROADMAP',
  TEAM = 'TEAM',
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  FRIENDS = 'FRIENDS'
}

export enum IClubPluginId {
  ALL = 0,
  BITSWAP = 1,
  BITSTABLE = 2,
  BITLEVERAGE = 3,
  BITSTAKING = 4,
  GOBANG = 11,
  LINK = 12,
  PUZZLE = 13,
  BOX = 14,
  TETRIS = 15,
  Auction = 6,
  MailZero = 5,
  AllDeFi = 7,
  USDX = 8,
  PicWe = 9,
  SendingMe = 1006
}

export interface IBoxAboutSectionTypeSimpleValue {
  title: string
  content: string
}

export interface IntroValueItem {
  name: string
  text: string
}

export interface TeamValueItem {
  avatar: string
  name: string
  position: string
}

export interface IBoxAboutSectionTypeTeamValue {
  style: string
  teamItem: TeamValueItem[]
}

export enum TokenomicType {
  PIE = '0',
  BAR = '1'
}
export interface IBoxAboutSectionTypeTokenomicValue {
  totalSupply: string
  tokenAdress: string
  style: string
  shares: {
    id?: number
    purpose: string
    percentage: number | string
  }[]
}

export interface ExperienceValueItem {
  picture: string
  name: string
  title: string
  description: string
}

export interface IBoxAboutSectionTypeExperienceValue {
  style: string
  experienceItem: ExperienceValueItem[]
}

export interface IBoxAboutSectionTypeFriendsValue {
  isCertified: boolean
  avatar: string
  name: string
  position: string
}

export const IBoxAboutSectionTypeTokenomicColor = [
  '#FA816D',
  '#60ACFC',
  '#63D5B2',
  '#A165DE',
  '#F7931B',
  '#D15B7F',
  '#D4EC59',
  '#714EFF'
]

export interface RoadmapDataType {
  date: string
  eventName: string
  description: string
  future: boolean
}

export interface IBoxAboutSectionTypeRoadmapValue {
  style: string
  roadmapItem: RoadmapDataType[]
}

export type IBoxAboutSectionTypeSocialContentValue = {
  style: string
  socialItem: ILinksValue[]
}

export interface IBoxAboutSectionTypeValue {
  [IBoxAboutSectionTypeName.SIMPLE]: IBoxAboutSectionTypeSimpleValue
  [IBoxAboutSectionTypeName.SOCIAL_CONTENT]: IBoxAboutSectionTypeSocialContentValue
  [IBoxAboutSectionTypeName.ROADMAP]: IBoxAboutSectionTypeRoadmapValue
  [IBoxAboutSectionTypeName.TOKENOMIC]: IBoxAboutSectionTypeTokenomicValue
  [IBoxAboutSectionTypeName.TEAM]: IBoxAboutSectionTypeTeamValue
  [IBoxAboutSectionTypeName.EXPERIENCE]: IBoxAboutSectionTypeExperienceValue
  [IBoxAboutSectionTypeName.EDUCATION]: IBoxAboutSectionTypeExperienceValue
  [IBoxAboutSectionTypeName.FRIENDS]: IBoxAboutSectionTypeTeamValue
}

export enum IPluginNameType {
  PicWe = 'PicWe',
  USDX = 'USDX',
  MailZero = 'MailZero',
  AllDeFi = 'AllDeFi',
  Bitswap = 'Bitswap',
  Bitstaking = 'Bitstaking',
  Bitstable = 'Bitstable',
  Bitleverage = 'Krav',
  FiveInARow = 'Five-In-A-Row',
  ShisenSho = 'Shisen-Sho',
  JigsawPuzzle = 'Jigsaw Puzzle',
  BoxStack = 'Box Stack',
  FallingBlocks = 'Falling Blocks',
  Auction = 'Bounce'
}

export interface IPluginAboutData<T extends IBoxAboutSectionTypeName> {
  type: T
  value: IBoxAboutSectionTypeValue[T]
}

export interface IBoxBasicInfoValue extends IBackgroundValue {
  avatar: string
  boxId: string | number
  isTour?: boolean
}

export interface IBoxBasicAnotherInfoValue {
  followCount?: number
  rank?: number | null
  tvl?: string | null
}

export type IBoxValue = {
  editing: boolean
  boxBasicInfo: IBoxBasicInfoValue
  about: Array<IPluginAboutData<IBoxAboutSectionTypeName>>
  pluginList: IClubPluginId[]
  pluginData: IBoxPluginBasicItemData[]
  roomId?: string
  isJoinRoom?: boolean
  fee?: string
}

export enum IFlag {
  FALSE = 0,
  TRUE = 1
}

export interface IBoxesJsonData {
  id: string
  boxId: string
  userId: string
  projectName: string
  roomId?: string | null
  avatar: string
  rewardId?: number | null
  description?: string | null
  about?: string | null
  plugins?: string | null
  page?: string | null
  pluginInfo?: string | null
  links?: string | null
  bgImage?: string | null
  boxAddress?: string | null
  pluginList?: EnablePluginListResult[] | null
  fee?: string | null
  listingStatus?: boolean
  listingInfo?: any
}

interface PublishJsonData extends IBoxesJsonData {
  followCount: number
  ownerAddress: string
  boxType: number
  isFollow: boolean
  verified: boolean
  remark?: string | null
  twitterId?: string | null
  twitterAvatar?: string | null
  twitterScreenName?: string | null
  rewardId?: number | null
  rank?: number | null
  tvl?: string | null
  ownerName?: string | null
  roomId?: string | null
  isJoinClubRoom?: boolean
  publishStatus: 0 | 1
}

export type IBoxesPublishJsonData = Omit<PublishJsonData, 'boxId'>

export interface IBoxPluginBasicItemData {
  id?: number
  boxId: number
  pluginId: IClubPluginId
  sort: number
  sourceBoxAddress?: string
  token0Name?: string
  token1Name?: string
  token0Contract?: string
  token1Contract?: string
  display?: IFlag
  delFlag?: IFlag
  editFlag?: IFlag
}
