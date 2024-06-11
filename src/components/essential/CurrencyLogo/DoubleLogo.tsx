import { styled } from '@mui/material'
import CurrencyLogo from '.'
import { Currency } from '../../../constants/token/currency'

const Wrapper = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row'
})

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency | string
  currency1?: Currency | string
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sx={{ marginRight: margin ? (size / 3 + 8).toString() + 'px' : undefined }}>
      <CurrencyLogo currencyOrAddress={currency0} size={size.toString() + 'px'} style={{ zIndex: 2 }} />
      <CurrencyLogo
        currencyOrAddress={currency1}
        size={size.toString() + 'px'}
        style={{
          position: 'relative',
          zIndex: 9
        }}
      />
    </Wrapper>
  )
}
