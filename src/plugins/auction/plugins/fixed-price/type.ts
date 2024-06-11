import BigNumber from 'bignumber.js'
import { CurrencyAmount } from 'constants/token'
import { IReleaseType } from './constants/type'
import { IBaseAuctionPoolInfo } from 'plugins/auction/type'

export interface IPoolsResult {
  creator: string
  token0: string
  token1: string
  amountTotal0: BigNumber
  amountTotal1: BigNumber
  openAt: number
  closeAt: number
  claimAt: number
  txFeeRatio: BigNumber
}

export interface IFixedPricePoolInfo extends IBaseAuctionPoolInfo {
  currencyAmountMySwap0: CurrencyAmount | undefined
  currencyAmountMySwap1: CurrencyAmount | undefined
  myClaimed: boolean
  isPlayableAuction: boolean
  maxAmount1PerWallet: CurrencyAmount | undefined
  releaseType: IReleaseType | undefined
  amountBid0: BigNumber
  amountBid1: BigNumber
  isJoined: boolean
  isUserClaim: boolean
}
