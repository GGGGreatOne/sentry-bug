import { PoolStatus } from 'api/type'
import BigNumber from 'bignumber.js'
import { Currency, CurrencyAmount } from 'constants/token'
import { AuctionType } from './plugins/fixed-price/constants/type'

export interface IBaseAuctionPoolInfo {
  token0?: Currency
  token1?: Currency
  poolStatus?: PoolStatus
  swapRatio?: CurrencyAmount
  creatorClaimed?: boolean
  amountTotal0?: BigNumber
  amountTotal1?: BigNumber
  closeAt?: number
  openAt?: number
  claimAt?: number
  txFeeRatio?: BigNumber
  creator?: string
  auctionType?: AuctionType
  currencyAmountTotal0?: CurrencyAmount
  currencyAmountTotal1?: CurrencyAmount
  poolId: string | undefined
  currencyAmountSwap0?: CurrencyAmount
  currencyAmountSwap1?: CurrencyAmount
  owner?: string
  txFee?: string
}
