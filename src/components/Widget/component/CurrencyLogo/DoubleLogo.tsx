import { styled } from '@mui/material'
import _CurrencyLogo from '.'
import { Currency } from '@uniswap/sdk'

const Wrapper = styled('div')({
  position: 'relative',
  flexDirection: 'row',
  display: 'flex'
})

interface DoubleCurrencyLogoProps {
  margin?: string
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({ currency0, currency1, size = 24, margin }: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sx={{ marginRight: margin, width: (size * 14) / 8, height: size }}>
      {currency0 && <_CurrencyLogo currency={currency0} size={size.toString() + 'px'} />}
      {currency1 && (
        <_CurrencyLogo
          currency={currency1}
          size={size.toString() + 'px'}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 2
          }}
        />
      )}
    </Wrapper>
  )
}
