import { Box, Button, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input'
import Image from 'next/image'
import BTCBImg from '../../../assets/btcb.png'
const InputStyle = styled(Input)`
  &.MuiInputBase-root {
    height: 44px;
    padding: 16px 0;
    border-radius: 4px;
    background-color: transparent;
    font-family: 'SF Pro Display';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    color: var(--ps-text-60);
    &.Mui-focused {
      color: var(--ps-text100);
    }
  }
  & .MuiInputBase-input {
    padding-right: 155px;
  }
`
interface Props {
  label: string
  balance: string
  token: string
  amount: string
  changeAmount: (v: string) => void
}
// TODO: edit props type
const InputPanel = ({ label, balance, token, amount, changeAmount }: Props) => {
  return (
    <Box
      mt={16}
      sx={{ width: '100%', padding: 16, borderRadius: 12, background: 'var(--ps-text-primary)', textAlign: 'left' }}
    >
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontSize: '13px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: 'SF Pro Display',
            fontSize: '13px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          Max:<span style={{ marginLeft: 8, color: 'var(--ps-text-100)' }}>{balance}</span>
        </Typography>
      </Stack>
      <Box sx={{ position: 'relative' }}>
        <InputStyle value={amount} type="number" placeholder="0.00" onChange={e => changeAmount(e.target.value)} />
        <Stack
          flexDirection={'row'}
          sx={{ gap: 8, position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
          alignItems={'center'}
        >
          <Button
            variant="contained"
            sx={{ padding: '6px 16px', backgroundColor: 'var(--ps-text-100)', width: 58, height: 29, borderRadius: 4 }}
          >
            MAX
          </Button>
          <Image src={BTCBImg.src} width={24} height={24} alt="" />
          <Typography
            sx={{
              color: 'var(--ps-neutral5)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              fontSize: '15px',
              fontWeight: '500',
              lineHeight: '100%'
            }}
          >
            {token}
          </Typography>
        </Stack>
      </Box>
      <Typography
        sx={{
          color: 'var(--ps-neutral3)',
          textAlign: 'right',
          fontFamily: '"SF Pro Display"',
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '140%' /* 16.8px */,
          textTransform: 'capitalize'
        }}
      >
        ≈ 0.5ETH
      </Typography>
    </Box>
  )
}
export default InputPanel
