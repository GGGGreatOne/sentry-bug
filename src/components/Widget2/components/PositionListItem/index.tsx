import { BigNumber } from '@ethersproject/bignumber'
import { Percent, Price, Token } from '@uniswap/sdk-core'
import { Position } from '@uniswap/v3-sdk'
import { useMemo } from 'react'
import styled from 'styled-components'
import { DAI, USDC_MAINNET, USDT, WBTC, WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { Stack, Typography } from '@mui/material'
import { unwrappedToken } from 'components/Widget2/utils/unwrappedToken'
import useIsTickAtLimit from 'components/Widget2/hooks/useIsTickAtLimit'
import { Bound } from 'components/Widget2/state/mint/v3/actions'
import Loader from '../Icons/LoadingSpinner'
import { HideSmall, SmallOnly, ThemedText } from 'components/Widget2/theme/components'
import RangeBadge from '../Badge/RangeBadge'
import { useToken } from 'components/Widget2/hooks/Tokens'
import { useFormatter } from 'components/Widget2/utils/formatNumbers'
import { usePool } from 'components/Widget2/hooks/usePools'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Box } from 'rebass'
import useBreakpoint from 'hooks/useBreakpoint'
import DoubleArrowIcon from '../../assets/images/doubleArrow.svg'
import { useRoutePushWithQueryParams } from 'hooks/useRoutePushWithQueryParams'

const DoubleArrow = styled.span`
  font-size: 12px;
  margin: 0 2px;
  color: ${({ theme }) => theme.neutral1};
`

const FeeTierText = styled(ThemedText.UtilityBadge)`
  font-size: 16px !important;
  margin-left: 8px !important;
  color: ${({ theme }) => theme.neutral3};
`

interface PositionListItemProps {
  token0: string
  token1: string
  tokenId: BigNumber
  fee: number
  liquidity: BigNumber
  tickLower: number
  tickUpper: number
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [DAI, USDC_MAINNET, USDT]
  if (stables.some(stable => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [...Object.values(WRAPPED_NATIVE_CURRENCY), WBTC]
  if (bases.some(base => base && base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0
  }
}

export default function PositionListItem({
  token0: token0Address,
  token1: token1Address,
  tokenId,
  fee: feeAmount,
  liquidity,
  tickLower,
  tickUpper
}: PositionListItemProps) {
  const { formatDelta, formatTickPrice } = useFormatter()
  const isSm = useBreakpoint('sm')

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

  const removed = liquidity?.eq(0)

  const { swapRoutePush } = useRoutePushWithQueryParams()

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        cursor: 'pointer',
        userSelect: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff',
        padding: { xs: '16px 0', md: 16 },
        mt: 16,
        textDecoration: 'none',
        fontWeight: 535,
        '& > div:not(:first-of-type)': {
          textAlign: 'center'
        }
      }}
      onClick={() => swapRoutePush({ tokenId: tokenId.toString() })}
    >
      <Stack width={'100%'} direction={isSm ? 'column' : 'row'} justifyContent={isSm ? 'flex-start' : 'space-between'}>
        <Stack alignItems={'center'} direction={'row'} alignContent={'flex-start'}>
          <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={18} margin />
          <Typography color={'#fff'} fontSize={16} fontWeight={500}>
            &nbsp;
            {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyQuote?.symbol?.toLocaleUpperCase()}
            &nbsp;/&nbsp;
            {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyBase?.symbol?.toLocaleUpperCase()}
          </Typography>
          <FeeTierText>
            <Typography color={'#FFFFFF99'} ml={8} fontSize={16} fontWeight={500}>
              {formatDelta(parseFloat(new Percent(feeAmount, 1_000_000).toSignificant()))}
            </Typography>
          </FeeTierText>
        </Stack>
        <RangeBadge removed={removed} inRange={!outOfRange} />
      </Stack>

      {priceLower && priceUpper ? (
        <Stack
          direction={isSm ? 'column' : 'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          spacing={8}
          sx={{
            width: '100%',
            fontSize: '14px !important',
            wordBreak: 'break-word',
            padding: '0.25rem 0.25rem',
            borderRadius: '8px'
          }}
        >
          {!isSm && (
            <Typography color={'#FFFFFF99'} fontSize={16} fontWeight={500}>
              Min:
            </Typography>
          )}
          <Typography color={'#fff'} fontSize={16} fontWeight={500} mr={8}>
            {isSm ? <span style={{ color: '#FFFFFF99' }}>Min: </span> : null}
            <span>
              {formatTickPrice({
                price: priceLower,
                atLimit: tickAtLimit,
                direction: Bound.LOWER
              })}{' '}
            </span>
            <span>
              {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyQuote?.symbol?.toLocaleUpperCase()}
            </span>{' '}
            per{' '}
            <span>
              {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : currencyBase?.symbol?.toLocaleUpperCase() ?? ''}
            </span>
          </Typography>
          <HideSmall>
            <DoubleArrow> ↔ </DoubleArrow>{' '}
          </HideSmall>
          <SmallOnly>
            <DoubleArrow>
              <DoubleArrowIcon />
            </DoubleArrow>
          </SmallOnly>
          {!isSm && (
            <Typography color={'#FFFFFF99'} ml={8} fontSize={16} fontWeight={500}>
              Max:
            </Typography>
          )}
          <Typography color={'#fff'} fontSize={16} fontWeight={500}>
            {isSm ? <span style={{ color: '#FFFFFF99' }}>Max: </span> : null}
            <span>
              {formatTickPrice({
                price: priceUpper,
                atLimit: tickAtLimit,
                direction: Bound.UPPER
              })}{' '}
            </span>
            <span>
              {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyQuote?.symbol?.toLocaleUpperCase()}
            </span>{' '}
            per{' '}
            <span>
              {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyBase?.symbol?.toLocaleUpperCase()}
            </span>
          </Typography>
        </Stack>
      ) : (
        <Loader />
      )}
    </Box>
  )
}
