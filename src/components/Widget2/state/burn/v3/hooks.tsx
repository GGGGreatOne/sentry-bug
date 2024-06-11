import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Position } from '@uniswap/v3-sdk'
import { ReactNode, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { selectPercent } from './actions'
import { AppState } from '../..'
import { PositionDetails } from 'components/Widget2/types/position'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'components/Widget2/hooks/Tokens'
import { usePool } from 'components/Widget2/hooks/usePools'
import { Typography } from '@mui/material'
import { useV3PositionFees } from 'components/Widget2/hooks/useV3PositionFees'
import { unwrappedToken } from 'components/Widget2/utils/unwrappedToken'

export function useBurnV3State(): AppState['burnV3'] {
  return useAppSelector(state => state.swap2.burnV3)
}

export function useDerivedV3BurnInfo(
  position?: PositionDetails,
  asWETH = false
): {
  position?: Position
  liquidityPercentage?: Percent
  liquidityValue0?: CurrencyAmount<Currency>
  liquidityValue1?: CurrencyAmount<Currency>
  feeValue0?: CurrencyAmount<Currency>
  feeValue1?: CurrencyAmount<Currency>
  outOfRange: boolean
  error?: ReactNode
} {
  const { account } = useActiveWeb3React()
  const { percent } = useBurnV3State()

  const token0 = useToken(position?.token0)
  const token1 = useToken(position?.token1)

  const [, pool] = usePool(token0 ?? undefined, token1 ?? undefined, position?.fee)

  const positionSDK = useMemo(
    () =>
      pool && position?.liquidity && typeof position?.tickLower === 'number' && typeof position?.tickUpper === 'number'
        ? new Position({
            pool,
            liquidity: position.liquidity.toString(),
            tickLower: position.tickLower,
            tickUpper: position.tickUpper
          })
        : undefined,
    [pool, position]
  )

  const liquidityPercentage = new Percent(percent, 100)

  const discountedAmount0 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient
    : undefined
  const discountedAmount1 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient
    : undefined

  const liquidityValue0 =
    token0 && discountedAmount0
      ? CurrencyAmount.fromRawAmount(asWETH ? token0 : unwrappedToken(token0), discountedAmount0)
      : undefined
  const liquidityValue1 =
    token1 && discountedAmount1
      ? CurrencyAmount.fromRawAmount(asWETH ? token1 : unwrappedToken(token1), discountedAmount1)
      : undefined

  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, position?.tokenId, asWETH)

  const outOfRange =
    pool && position ? pool.tickCurrent < position.tickLower || pool.tickCurrent > position.tickUpper : false

  let error: ReactNode | undefined
  if (!account) {
    error = <Typography>Connect wallet</Typography>
  }
  if (percent === 0) {
    error = error ?? <Typography>Enter a percent</Typography>
  }
  return {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error
  }
}

export function useBurnV3ActionHandlers(): {
  onPercentSelect: (percent: number) => void
} {
  const dispatch = useAppDispatch()

  const onPercentSelect = useCallback(
    (percent: number) => {
      dispatch(selectPercent({ percent }))
    },
    [dispatch]
  )

  return {
    onPercentSelect
  }
}
