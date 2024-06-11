import { PoolStatus, PoolType } from 'api/type'
import { SupportedChainId } from 'constants/chains'
import { CurrencyAmount } from 'constants/token'

export enum IReleaseType {
  Instant, // 0
  Cliff, // 1
  Linear, // 2
  Fragment // 3
}
// TODO: add time type
export interface IReleaseData {
  startAt: any
  // entAt in timestamp or ratio in 1e18
  endAt?: any
  ratio?: string
}
export enum TokenType {
  ERC20 = 'ERC20'
}
export enum WhitelistType {
  ONLY_ADDRESS,
  ADDRESS_AND_AMOUNT
}
export enum ParticipantStatus {
  'Public' = 'PUBLIC',
  'Whitelist' = 'WHITELIST',
  'WhitelistWithAmount' = 'WhitelistWithAmount'
}
export enum AllocationStatus {
  'NoLimits' = 'NO_LIMITS',
  'Limited' = 'LIMITED'
}
export enum PriceSegmentType {
  'BySecond' = 'BY_SECOND',
  'ByMinute' = 'BY_MINUTE',
  'Staged' = 'STAGED'
}
export enum CreationStep {
  'TOKEN_INFORMATION',
  'AUCTION_PARAMETERS',
  'ADVANCED_SETTINGS',
  'CREATION_CONFIRMATION'
}
export type CompletedSteps = { [k: number]: boolean }
export enum AuctionType {
  FIXED_PRICE = 'Fixed Price',
  STAKING_AUCTION = 'Staking'
  // RANDOM_SELECTION_AUCTION = 'Random Selection Auction'
}
export interface AuctionPool {
  tokenType: TokenType
  auctionChainId?: string
  amountTotal0: CurrencyAmount | undefined
  amountTotal1: CurrencyAmount | undefined
  swapRatio: string
  poolSize: string
  allocationPerWallet: string
  priceSegmentType: PriceSegmentType
  allocationStatus: AllocationStatus
  poolName: string
  startTime: any
  endTime: any
  shouldDelayUnlocking: boolean
  delayUnlockingTime: any
  releaseType: IReleaseType | 1000
  releaseDataArr: IReleaseData[]
  whitelist: string[]
  whitelistWithAmount?: string
  activeStep: CreationStep
  completed: CompletedSteps
  participantStatus: ParticipantStatus
  priceFloor?: string
  amountMinIncr1?: string
  auctionType?: AuctionType
  winnerNumber?: number
  ticketPrice?: string
  maxParticipantAllowed?: number
  enableReverse?: boolean
  startPrice?: string
  reservePrice?: string
  segmentAmount?: string
  endPrice?: string
  closeHour?: string
  closeMinute?: string
  claimHour?: string
  claimMinute?: string
  delayUnlockingHour?: string
  delayUnlockingMinute?: string
  creatorRatio?: string
  prevBidderRatio?: string
  lastBidderRatio?: string
  tgToken?: string
  auctionInChain: SupportedChainId
}
export interface CreatorUserInfo {
  avatar: string
  companyAvatar: string
  companyIntroduction: string
  companyName: string
  name: string
  publicRole?: string[]
  userId: number
  userType: number
}
export interface TokenFromApi {
  address: string
  coingeckoId: string
  currentPrice: number
  decimals: number
  largeUrl?: string
  name: string
  smallUrl?: string
  symbol: string
  thumbUrl?: string
}
export enum BackedTokenType {
  TOKEN = 1,
  NFT = 2
}
export interface FixedSwapPool {
  amountTotal0: string
  amountTotal1: string
  category: PoolType
  chainId: number
  claimAt: number
  closeAt: number
  contract: string
  createdTxHash: string
  creator: string
  creatorClaimed: boolean
  creatorUserInfo: CreatorUserInfo
  description: string
  id: number
  currentTotal0: string
  currentTotal1: string
  enableWhiteList: boolean
  maxAmount1PerWallet: string
  name: string
  openAt: number
  participant: {
    address?: string
    claimed?: boolean
    regreted?: boolean
    swappedAmount0?: string
    is721?: 1 | 2 // 2 721
    tokenId?: string
  }
  ifCollect: boolean
  poolId: string
  poolPrice: number
  ratio: string
  status: PoolStatus
  swappedAmount0: string
  token0: TokenFromApi
  token1: TokenFromApi
  tokenId: string
  tokenType: BackedTokenType
  is721?: 1 | 2
  poolVersion?: number
}
export interface FixedSwapPoolProp extends FixedSwapPool {
  currencyAmountTotal0: CurrencyAmount
  currencyAmountTotal1: CurrencyAmount
  currencySwappedAmount0: CurrencyAmount
  currencyMaxAmount1PerWallet: CurrencyAmount
  currencySurplusTotal0: CurrencyAmount
  currencySwappedTotal1: CurrencyAmount
  ethChainId: SupportedChainId
  currentBounceContractAddress: string | undefined
  participant: {
    address?: string
    claimed?: boolean
    regreted?: boolean
    swappedAmount0?: string
    currencySwappedAmount0: CurrencyAmount | undefined // all token0
    currencySwappedAmount1: CurrencyAmount | undefined
    currencyCurReleasableAmount?: CurrencyAmount | undefined // current releasable
    currencyCurClaimableAmount?: CurrencyAmount | undefined // current claimable
    currencyMyReleased?: CurrencyAmount | undefined //current my Released token
  }
  totalShare?: string | number
  maxPlayere?: string | number
  curPlayer?: string | number
  releaseType?: IReleaseType | undefined
  enableReverses?: boolean
  releaseData?: { startAt: number; endAt: number | undefined; ratio: string | undefined }[]
  whitelistData?: {
    isUserInWhitelist: boolean | undefined
    isPermit: boolean | undefined
    loading: boolean
  }
  isPlayableAuction?: boolean
}
