import BigNumber from 'bignumber.js'
import { ETH_ONE_HOUR_BLOCK, LIQ_THRESHOLD_P, MAX_GAIN_P, OPEN_FEES } from './constants'

export const withDecimals = (value: BigNumber | string, decimals: number, isAdd: boolean = true) => {
  return new BigNumber(value).div(new BigNumber(isAdd ? 1 / 10 : 10).pow(decimals))
}

export const getLiqPrice = (
  openPrice: BigNumber,
  collateral: BigNumber,
  isLong: boolean,
  leverage: number,
  rolloverFee: BigNumber | number = 0,
  fundingFee: BigNumber | number = 0
) => {
  const collateralImpact = collateral.times(LIQ_THRESHOLD_P).div(100).minus(rolloverFee).minus(fundingFee)
  const liqPriceDistance = openPrice.times(collateralImpact).div(collateral).div(leverage)
  const liqPrice = isLong ? openPrice.minus(liqPriceDistance) : openPrice.plus(liqPriceDistance)
  return liqPrice.isGreaterThan(0) ? liqPrice : new BigNumber(0)
}

export const getTakeProfit = (
  openPrice: BigNumber,
  currentPrice: BigNumber,
  isBuy: boolean,
  leverage: number,
  isSl: boolean
) => {
  const diff = isBuy ? currentPrice.minus(openPrice) : openPrice.minus(currentPrice)
  const p = diff.times(100 * leverage).div(openPrice)
  if (p.isGreaterThan(MAX_GAIN_P)) {
    return new BigNumber(MAX_GAIN_P)
  } else {
    if (isSl) {
      if (p.isLessThan(-100)) return new BigNumber(-100)
      else return p
    } else return p
  }
}

export const getBorrowFees = (fundingFeePerBlockP?: BigNumber) => {
  if (fundingFeePerBlockP) {
    return withDecimals(fundingFeePerBlockP, 10, false).times(ETH_ONE_HOUR_BLOCK)
  } else return new BigNumber(0)
}

export const getOpenFees = (positionDAI: BigNumber, leverage: number) => {
  if (leverage > 51) return new BigNumber(0)
  else return positionDAI.times(leverage).times(OPEN_FEES).times(2)
}
