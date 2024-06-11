import { Typography } from '@mui/material'
import { Currency } from '@uniswap/sdk-core'
import { ToggleElement, ToggleWrapper } from '../Toggle/MultiToggle'

// the order of displayed base currencies from left to right is always in sort order
// currencyA is treated as the preferred base currency
export default function RateToggle({
  currencyA,
  currencyB,
  handleRateToggle
}: {
  currencyA: Currency
  currencyB: Currency
  handleRateToggle: () => void
}) {
  const tokenA = currencyA?.wrapped
  const tokenB = currencyB?.wrapped

  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  return tokenA && tokenB ? (
    <div
      style={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer',
        padding: 4,
        borderRadius: '8px'
      }}
      onClick={handleRateToggle}
    >
      <ToggleWrapper width="fit-content">
        <ToggleElement isActive={isSorted} fontSize="12px">
          <Typography>
            {isSorted
              ? currencyA.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : currencyA.symbol?.toLocaleUpperCase()
              : currencyB.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : currencyB.symbol?.toLocaleUpperCase()}
          </Typography>
        </ToggleElement>
        <ToggleElement isActive={!isSorted} fontSize="12px">
          <Typography>
            {isSorted
              ? currencyB.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : currencyB.symbol?.toLocaleUpperCase()
              : currencyA.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : currencyA.symbol?.toLocaleUpperCase()}
          </Typography>
        </ToggleElement>
      </ToggleWrapper>
    </div>
  ) : null
}
