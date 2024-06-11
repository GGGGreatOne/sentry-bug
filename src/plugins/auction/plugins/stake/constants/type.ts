import { Currency, CurrencyAmount } from 'constants/token'
import { Dayjs } from 'dayjs'
import { BigNumber } from 'ethers'
import { IBaseAuctionPoolInfo } from 'plugins/auction/type'

export interface ICreateParams {
  token0: Currency | undefined
  token1: Currency | undefined
  amountTotal0: string
  amountTotal1: string
  openAt: Dayjs | null
  closeAt: Dayjs | null
  releaseAt: Dayjs | null
  releaseDuration: 1
  txFeeRatio: string
}
export interface CoinResultType extends IBaseAuctionPoolInfo {
  token1Amount?: BigNumber
  totalParticipants?: BigNumber
  myToken1Amount?: CurrencyAmount
  myToken1Claimed?: boolean
  creatorClaimed?: boolean
  finalAllocation?: FinalAllocationType
  claimedToken0?: BigNumber
  releaseDuration?: number
}
export type PoolInfoType = {
  amountTotal0: BigNumber
  amountTotal1: BigNumber
  closeAt: number
  creator: string
  openAt: number
  releaseAt: number
  releaseDuration: number
  token0: string
  token1: string
  txFeeRatio: number
}
export type FinalAllocationType = {
  mySwappedAmount0: BigNumber
  myUnSwappedAmount1: BigNumber
}
