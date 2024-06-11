import { Currency } from '@uniswap/sdk-core'
import { Position } from '@uniswap/v3-sdk'
import JSBI from 'jsbi'
import { ReactNode, useCallback, useState } from 'react'
import { useTheme } from 'styled-components'
import { AutoColumn } from '../Column'
import { ThemedText } from 'components/Widget2/theme/components'
import { RowBetween, RowFixed } from '../Row'
import RangeBadge from '../Badge/RangeBadge'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { Box, Stack, Typography } from '@mui/material'
import { BIPS_BASE } from 'components/Widget2/constants/misc'
import { NumberType, useFormatter } from 'components/Widget2/utils/formatNumbers'
import { Bound } from 'components/Widget2/state/mint/v3/actions'
import { Break } from '../earn/styled'
import { unwrappedToken } from 'components/Widget2/utils/unwrappedToken'
import RateToggle from '../RateToggle'
import DoubleCurrencyLogo from '../DoubleLogo'

export const PositionPreview = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: Currency
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) => {
  const theme = useTheme()
  const { formatCurrencyAmount, formatDelta, formatPrice, formatTickPrice } = useFormatter()

  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
          ? currency1
          : currency0
      : currency0
  )

  const sorted = baseCurrency.equals(currency0)
  const quoteCurrency = sorted ? currency1 : currency0

  const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1)

  const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert()
  const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert()

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0))

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <Box ml={16}>
            <DoubleCurrencyLogo currency0={currency1 as any} currency1={currency0 as any} size={24} />
          </Box>
          <Typography ml="10px" fontSize="24px">
            {currency0?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currency0?.symbol?.toLocaleUpperCase()} /{' '}
            {currency1?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currency1?.symbol?.toLocaleUpperCase()}
          </Typography>
        </RowFixed>
        <RangeBadge removed={removed} inRange={inRange} />
      </RowBetween>

      <Stack
        sx={{
          padding: 20,
          borderRadius: '16px',
          backgroundColor: '#FFFFFF0D'
        }}
      >
        <AutoColumn gap="md">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <Typography ml="8px">
                {currency0?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currency0?.symbol?.toLocaleUpperCase()}
              </Typography>
            </RowFixed>
            <RowFixed>
              <Typography mr="8px">{formatCurrencyAmount({ amount: position.amount0 })}</Typography>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <Typography ml="8px">
                {currency1?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currency1?.symbol?.toLocaleUpperCase()}
              </Typography>
            </RowFixed>
            <RowFixed>
              <Typography mr="8px">{formatCurrencyAmount({ amount: position.amount1 })}</Typography>
            </RowFixed>
          </RowBetween>
          <Break />
          <RowBetween>
            <Typography color={'#fff'} fontSize={16}>
              Fee tier
            </Typography>
            <Typography color={'#fff'} fontSize={16}>
              {formatDelta(position?.pool?.fee / BIPS_BASE)}
            </Typography>
          </RowBetween>
        </AutoColumn>
      </Stack>

      <AutoColumn gap="md">
        <RowBetween>
          {title ? <ThemedText.DeprecatedMain>{title}</ThemedText.DeprecatedMain> : <div />}
          <RateToggle
            currencyA={sorted ? currency0 : currency1}
            currencyB={sorted ? currency1 : currency0}
            handleRateToggle={handleRateChange}
          />
        </RowBetween>

        <RowBetween>
          <Stack
            sx={{
              borderRadius: '16px',
              backgroundColor: '#FFFFFF0D'
            }}
            width="48%"
            padding="8px"
          >
            <AutoColumn gap="4px" justify="center">
              <Typography>Min price</Typography>
              <ThemedText.DeprecatedMediumHeader textAlign="center">
                {formatTickPrice({
                  price: priceLower,
                  atLimit: ticksAtLimit,
                  direction: Bound.LOWER
                })}
              </ThemedText.DeprecatedMediumHeader>
              <ThemedText.DeprecatedMain textAlign="center" fontSize="12px">
                <Typography>
                  {quoteCurrency.symbol?.toLocaleUpperCase() === 'ETH'
                    ? 'BB'
                    : quoteCurrency.symbol?.toLocaleUpperCase()}{' '}
                  per{' '}
                  {baseCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : baseCurrency.symbol?.toLocaleUpperCase()}
                </Typography>
              </ThemedText.DeprecatedMain>
              <ThemedText.DeprecatedSmall textAlign="center" color={theme.neutral3} style={{ marginTop: '4px' }}>
                <Typography>
                  Your position will be 100% composed of{' '}
                  {baseCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                    ? 'BB'
                    : baseCurrency?.symbol?.toLocaleUpperCase()}{' '}
                  at this price
                </Typography>
              </ThemedText.DeprecatedSmall>
            </AutoColumn>
          </Stack>

          <Stack
            sx={{
              borderRadius: '16px',
              backgroundColor: '#FFFFFF0D'
            }}
            width="48%"
            padding="8px"
          >
            <AutoColumn gap="4px" justify="center">
              <Typography>Max price</Typography>
              <ThemedText.DeprecatedMediumHeader textAlign="center">
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: ticksAtLimit,
                  direction: Bound.UPPER
                })}
              </ThemedText.DeprecatedMediumHeader>
              <ThemedText.DeprecatedMain textAlign="center" fontSize="12px">
                <Typography>
                  {quoteCurrency.symbol?.toLocaleUpperCase() === 'ETH'
                    ? 'BB'
                    : quoteCurrency.symbol?.toLocaleUpperCase()}{' '}
                  per{' '}
                  {baseCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : baseCurrency.symbol?.toLocaleUpperCase()}
                </Typography>
              </ThemedText.DeprecatedMain>
              <ThemedText.DeprecatedSmall textAlign="center" color={theme.neutral3} style={{ marginTop: '4px' }}>
                <Typography>
                  Your position will be 100% composed of{' '}
                  {quoteCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                    ? 'BB'
                    : quoteCurrency?.symbol?.toLocaleUpperCase()}{' '}
                  at this price
                </Typography>
              </ThemedText.DeprecatedSmall>
            </AutoColumn>
          </Stack>
        </RowBetween>
        <Stack
          sx={{
            borderRadius: '16px',
            backgroundColor: '#FFFFFF0D'
          }}
          padding="12px "
        >
          <AutoColumn gap="4px" justify="center">
            <ThemedText.DeprecatedMain fontSize="12px">
              <Typography>Current price</Typography>
            </ThemedText.DeprecatedMain>
            <ThemedText.DeprecatedMediumHeader>{`${formatPrice({
              price,
              type: NumberType.TokenTx
            })} `}</ThemedText.DeprecatedMediumHeader>
            <ThemedText.DeprecatedMain textAlign="center" fontSize="12px">
              <Typography>
                {quoteCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : quoteCurrency.symbol?.toLocaleUpperCase()}{' '}
                per{' '}
                {baseCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : baseCurrency.symbol?.toLocaleUpperCase()}
              </Typography>
            </ThemedText.DeprecatedMain>
          </AutoColumn>
        </Stack>
      </AutoColumn>
    </AutoColumn>
  )
}
