import { Currency } from 'constants/token'
import { AllocationStatus, AuctionType, IReleaseType, TokenType } from '../../constants/type'
import { Dayjs } from 'dayjs'

export interface ICreateFixedPricePool {
  tokenType: TokenType
  amountTotal0: Currency | undefined
  amountTotal1: Currency | undefined
  swapRatio: string
  allocationPerWallet: string
  allocationStatus: AllocationStatus
  startTime: Dayjs | undefined
  endTime: Dayjs | undefined
  delayUnlockingTime: Dayjs | undefined
  auctionType: AuctionType
  maxParticipantAllowed?: number
  releaseType: IReleaseType
  totalSupply: string
}
export const createFixedPriceVal: ICreateFixedPricePool = {
  tokenType: TokenType.ERC20,
  amountTotal0: undefined,
  amountTotal1: undefined,
  swapRatio: '',
  allocationPerWallet: '',
  allocationStatus: AllocationStatus.NoLimits,
  startTime: undefined,
  endTime: undefined,
  delayUnlockingTime: undefined,
  auctionType: AuctionType.FIXED_PRICE,
  releaseType: IReleaseType.Instant,
  totalSupply: '',
  maxParticipantAllowed: 0
}
