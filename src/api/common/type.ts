export interface UpdataResponse {
  fileName: string
  newFileName: string
  url: string
  originalFilename: string
}

export interface UpdataBodys {
  file: File
}
export interface IPluginTokenListItem {
  bigImg?: string | null
  coinId?: string | null
  contractAddress?: string | null
  decimals?: number | null
  id: string
  pluginId: number
  smallImg?: string | null
  tokenName: string
  tokenSymbol?: string | null
}
export interface IPluginTokenListResult {
  list: IPluginTokenListItem[]
}

export enum IVerified {
  Verified = 0,
  Unverified = 1
}
export interface IGetPluginTokenListParams {
  boxId?: number
  tokenName?: string
  verified: IVerified
  pageSize: number
  pageNum: number
}
export interface IGetTokenImgParams {
  tokenContract: string
}
export interface IGetTokenImgResult {
  bigImg: string
  smallImg: string
}

export interface IGetTokenAssetParams {
  source: string
  tokenContract: string
  amount: number
}
export interface IGetTokenAssetResult {
  bouncebit: IGetTokenAssetParams[]
  b2: IGetTokenAssetParams[]
  merlin: IGetTokenAssetParams[]
  holder: IGetTokenAssetParams[]
  mubi: IGetTokenAssetParams[]
}

export type Verified = {
  Verified: 0
  Unverified: 1
}
export interface IGetTokenListParams {
  boxId?: number
  tokenName?: string
  verified?: Verified
  pageSize?: number
  pageNum?: number
}
export interface ITokenListResult {
  data: ITokenListItem[]
}

export enum TokenType {
  TOKEN = 0,
  V2LP = 1,
  V3LP = 2
}
export interface ITokenListItem {
  id: string
  boxId: string
  creator: string
  tokenName: string
  tokenSymbol: string
  contractAddress: string
  coinId: string | null
  decimals: number
  smallImg: string | null
  bigImg: string | null
  pluginId: number | null
  delFlag: number | null
  supply: string
  hash: string
  txTs: string
  blockHeight: string
  verified: Verified
  tokenType: TokenType
  token0Contract: string
  token1Contract: string
}
