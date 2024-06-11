import { Currency } from '@uniswap/sdk-core'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { Stack } from '@mui/material'

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false
}: DoubleCurrencyLogoProps) {
  return (
    <Stack
      direction={'row'}
      sx={{
        position: 'relative',
        marginLeft: `${margin && (size / 3 + 8).toString() + 'px'}`
      }}
    >
      {currency0 && (
        <Stack sx={{ zIndex: 1 }}>
          <CurrencyLogo currency={currency0} size={`${size}px`} />
        </Stack>
      )}
      {currency1 && (
        <Stack
          sx={{
            position: 'absolute',
            left: `-${(size / 2).toString() + 'px !important'}`
          }}
        >
          <CurrencyLogo currency={currency1} size={`${size}px`} />
        </Stack>
      )}
    </Stack>
  )
}
