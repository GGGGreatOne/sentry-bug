import { Box, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input'
import DropDownSvg from '../../../assets/drop-down.svg'
import { control } from '../dialog/modal'
import { QuantosDetails } from '../../../hook/useFactory'
import CurrencyLogo from '../../../../../components/essential/CurrencyLogo'

const Container = styled(Box)`
  padding: 12px;
  border-radius: 10px;
  background: var(--ps-text-primary);
`
const InputStyle = styled(Input)({
  '&.MuiInputBase-root': {
    paddingLeft: 0,
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '130%',
    color: 'var(--ps-neutral4)'
  },
  '&.MuiInputBase-root.Mui-focused': {
    border: 'none !important'
  }
})
export interface ITradeToken {
  token: string
  value: number
}
const PayContainer = ({
  isLimit,
  limitPrice,
  positionSize,
  setLimitPrice,
  setPositionSize,
  leverage,
  tokenSymbol,
  boxQuantos,
  boxAddress,
  tokenAddress
}: {
  isLimit?: boolean
  limitPrice: string
  positionSize: string
  setLimitPrice: (v: string) => void
  setPositionSize: (v: string) => void
  leverage: number
  tokenSymbol: string | undefined
  boxAddress: string
  boxQuantos: QuantosDetails[] | undefined
  tokenAddress: string
}) => {
  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <Container>
          <Typography
            sx={{
              color: 'var(--ps-neutral3)',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '100%'
            }}
          >
            Pay
          </Typography>
          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <InputStyle
              type="number"
              value={positionSize}
              placeholder="0"
              onChange={v => {
                setPositionSize(v.target.value)
              }}
            />

            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                control.show('SelectToken', { isAddLiquidity: false, allQuantos: boxQuantos, boxAddress: boxAddress })
              }
            >
              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: '100%'
                }}
              >
                {tokenSymbol}
              </Typography>
              <CurrencyLogo currencyOrAddress={tokenAddress} size={'16px'} style={{ marginLeft: 4, marginRight: 6 }} />
              <DropDownSvg />
            </Stack>
          </Stack>
        </Container>
      </Box>
      {isLimit && (
        <Container mt={8}>
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Typography
              sx={{
                color: 'var(--ps-neutral3)',
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: '100%'
              }}
            >
              Price
            </Typography>
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: '100%'
                }}
                mr={8}
              >
                Leverage:
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-text-100)',
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: '100%'
                }}
              >
                {leverage}x
              </Typography>
            </Stack>
          </Stack>

          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <InputStyle
              type="uint"
              value={limitPrice}
              placeholder="0"
              onChange={v => {
                setLimitPrice(v.target.value)
              }}
            />
          </Stack>
        </Container>
      )}
    </Box>
  )
}
export default PayContainer
