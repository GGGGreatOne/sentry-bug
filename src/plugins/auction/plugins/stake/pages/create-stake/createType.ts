import { Currency } from 'constants/token'
import { Dayjs } from 'dayjs'
import { TokenType, AuctionType, IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'

export interface ICreateStakePool {
  tokenType: TokenType
  token0Currency: Currency | undefined
  token1Currency: Currency | undefined
  amountTotal0: string
  amountTotal1: string
  startTime: Dayjs | undefined
  endTime: Dayjs | undefined
  delayUnlockingTime: Dayjs | undefined
  auctionType: AuctionType
  releaseType: IReleaseType
  releaseDuration: 1
  clubShare: number
}
export const createStakeVal: ICreateStakePool = {
  tokenType: TokenType.ERC20,
  startTime: undefined,
  endTime: undefined,
  delayUnlockingTime: undefined,
  auctionType: AuctionType.STAKING_AUCTION,
  token0Currency: undefined,
  token1Currency: undefined,
  amountTotal0: '',
  amountTotal1: '',
  releaseType: IReleaseType.Instant,
  releaseDuration: 1,
  clubShare: 0
}
