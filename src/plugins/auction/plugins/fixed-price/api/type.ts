import { PoolType } from 'api/type'
import { IReleaseType, WhitelistType } from '../constants/type'

export interface GetWhitelistMerkleTreeRootParams {
  addresses: string[]
  category: PoolType
  chainId: any
  amounts?: string[]
  whitelistType?: WhitelistType
}
export interface GetPoolCreationSignatureParams {
  amountTotal0: string
  amountTotal1?: string
  category: PoolType
  chainId: any
  claimAt: number
  closeAt: number
  creator: string
  maxAmount1PerWallet?: string
  maxAmount0PerWallet?: string
  merkleroot: string
  name: string
  openAt: number
  token0: string
  token1: string
  tokenId?: string
  tokenIds?: string[]
  amountMinIncr1?: string
  amountMin1?: string
  amountMax1?: string
  amountStart1?: string
  amountEnd1?: string
  times?: number
  fragments?: string
  is721?: boolean
  maxPlayer?: number
  totalShare?: string | number
  nShare?: string | number
  releaseType?: IReleaseType
  releaseData?: {
    startAt: number | string
    endAtOrRatio: number | string
  }[]
}
