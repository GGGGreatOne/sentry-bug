import { useUSDPrice } from '../../hooks/useUSDPrice'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ThemedText } from '../../theme/components'
import { NumberType, useFormatter } from '../../utils/formatNumbers'
import tryParseCurrencyAmount from 'components/Widget2/lib/utils/tryParseCurrencyAmount'
import { Currency, Price } from '@uniswap/sdk-core'

interface TradePriceProps {
  price: Price<Currency, Currency>
  color?: string
}

const StyledPriceContainer = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  grid-template-columns: 1fr auto;
  grid-gap: 0.25rem;
  display: flex;
  flex-direction: row;
  text-align: left;
  flex-wrap: wrap;
  user-select: text;
`

export default function TradePrice({ price, color }: TradePriceProps) {
  const { formatNumber, formatPrice } = useFormatter()

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const { baseCurrency, quoteCurrency } = price
  const { data: usdPrice } = useUSDPrice(tryParseCurrencyAmount('1', showInverted ? baseCurrency : quoteCurrency))

  const formattedPrice = useMemo(() => {
    try {
      return formatPrice({ price: showInverted ? price : price.invert(), type: NumberType.TokenTx })
    } catch {
      return '0'
    }
  }, [formatPrice, price, showInverted])

  const label = showInverted
    ? `${
        price.quoteCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
          ? 'BB'
          : price.quoteCurrency?.symbol?.toLocaleUpperCase()
      }`
    : `${
        price.baseCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
          ? 'BB'
          : price.baseCurrency?.symbol?.toLocaleUpperCase()
      } `
  const labelInverted = showInverted
    ? `${
        price.baseCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
          ? 'BB'
          : price.baseCurrency?.symbol?.toLocaleUpperCase()
      } `
    : `${
        price.quoteCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
          ? 'BB'
          : price.quoteCurrency?.symbol?.toLocaleUpperCase()
      }`
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted])

  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ?? '-'} ${label}`

  return (
    <StyledPriceContainer
      onClick={e => {
        e.stopPropagation() // dont want this click to affect dropdowns / hovers
        flipPrice()
      }}
      title={text}
    >
      <ThemedText.BodySmall
        style={{
          color: color ?? '#121212'
        }}
      >
        {text}
      </ThemedText.BodySmall>{' '}
      {usdPrice && (
        <ThemedText.BodySmall color="neutral2">
          <>
            (
            {formatNumber({
              input: usdPrice,
              type: NumberType.FiatTokenPrice
            })}
            )
          </>
        </ThemedText.BodySmall>
      )}
    </StyledPriceContainer>
  )
}
