import { Stack, styled, SxProps, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import { Currency } from 'constants/token'
import { OutlinedInput } from '../FormInputAmount'
import { useCurrencyBalance } from 'hooks/useToken'
import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import { InfoPair } from 'views/auction/components/list/launchpadItem'

interface IProps {
  value: string
  onChange: (v: string) => void
  inputToken: Currency | undefined
  max?: BigNumber
  sx?: SxProps
}
const InputStyle = styled(OutlinedInput)`
  &.MuiInputBase-root {
    border-color: transparent !important;
    height: 54px;
    padding: 20px 16px;
    border-radius: 8px !important;
    background: rgba(255, 255, 229, 0.2) !important;
    color: rgba(255, 255, 229, 0.8);
    font-family: 'Public Sans';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 21px */
    letter-spacing: -0.28px;
    &.Mui-focused {
      border-color: transparent !important;
    }
    & button {
      border-color: transparent !important;
      background-color: transparent !important;
      color: #7190ff;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
      text-decoration: underline;
    }
    & button ~ span {
      color: rgba(255, 255, 229, 0.8);
      font-family: 'Public Sans';
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 150%;
      letter-spacing: -0.32px;
    }
    & input ~ span {
      padding-right: 0 !important;
    }
  }
`
// Reserve 0.01 as transaction gas
const reserveGas = 0.01
export default function BidInput({ inputToken, max, value, onChange, sx }: IProps) {
  const { account, chainId } = useActiveWeb3React()
  const balance = useCurrencyBalance(account, inputToken, chainId)

  const handleMax = useCallback(() => {
    if (!max) {
      onChange?.('0')
    }
    if (!!max && max.lt(new BigNumber(balance?.toExact() || '0'))) {
      onChange(max.toString())
      return
    }
    // Reserve 0.01 eth as transaction gas
    if (balance?.currency.isNative) {
      const laveEth = new BigNumber(balance?.toExact() || '0').minus(reserveGas)
      if (laveEth.gt(0)) {
        onChange(laveEth.toString())
        return
      }
      onChange('0')
      return
    }
    onChange(balance?.toExact() || '0')
  }, [balance, max, onChange])
  return (
    <Stack sx={{ gap: 12, ...sx }}>
      <InfoPair
        sx={{ '&>div>p': { fontSize: 16, color: '#626262', opacity: 1 } }}
        label="Your Bid Amount"
        text={
          <Typography
            sx={{
              color: 'var(--black, #908E96)',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '150%'
            }}
          >
            Balance: {balance?.toSignificant(6)} {balance?.currency.symbol?.toLocaleUpperCase() || '--'}
          </Typography>
        }
      />
      <InputStyle
        value={value}
        onChange={e => {
          onChange(e.target.value)
        }}
        onMax={handleMax}
        unit={inputToken ? inputToken.symbol?.toLocaleUpperCase() : ''}
        placeholder="Enter  amount"
      />
    </Stack>
  )
}
