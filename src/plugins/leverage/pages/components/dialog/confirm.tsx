import { Box, Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Image from 'next/image'
import BTCBImg from '../../../assets/btcb.png'
const Confirm = () => {
  return (
    <BaseDialog title="Confirm" sx={{ '& .MuiDialogContent-root': { textAlign: 'left' } }}>
      <Box sx={{ padding: 12, borderRadius: '10px', background: 'var(--ps-text-primary)' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Target Market
        </Typography>
        <Stack mt={16} flexDirection={'row'}>
          <Image src={BTCBImg.src} width={40} height={40} alt="" />
          <Box ml={12}>
            <Typography
              sx={{
                color: 'var(--ps-text-100)',
                fontFamily: '"SF Pro Display"',
                fontSize: '20px',
                fontWeight: '500',
                lineHeight: '130%'
              }}
            >
              DOGE
            </Typography>
            <Typography
              sx={{
                color: 'var(--ps-neutral3)',
                fontFamily: '"SF Pro Display"',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '140%'
              }}
            >
              Dogecoin
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Box mt={8} sx={{ padding: 12, borderRadius: '10px', background: 'var(--ps-text-primary)' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Token Collateral
        </Typography>
        <Stack mt={16} flexDirection={'row'}>
          <Image src={BTCBImg.src} width={40} height={40} alt="" />
          <Box ml={12}>
            <Typography
              sx={{
                color: 'var(--ps-text-100)',
                fontFamily: '"SF Pro Display"',
                fontSize: '20px',
                fontWeight: '500',
                lineHeight: '130%'
              }}
            >
              DOGE
            </Typography>
            <Typography
              sx={{
                color: 'var(--ps-neutral3)',
                fontFamily: '"SF Pro Display"',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '140%'
              }}
            >
              Dogecoin
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Box
        my={32}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          rowGap: 8,
          '& p': {
            fontFamily: '"SF Pro Display"',
            fontSize: '13px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%',
            '&.label': {
              color: 'var(--ps-neutral3, #717171)'
            },
            '&.value': {
              color: 'var(--ps-text-100)',
              textAlign: 'end'
            }
          }
        }}
      >
        <Typography className="label">Set Ticket Size</Typography>
        <Typography className="value">1 BTC=2000 DOGE</Typography>
        <Typography className="label">Deposit Amount/Initial LP Provision</Typography>
        <Typography className="value">2000 DOGE</Typography>
      </Box>
      <Button
        variant="contained"
        sx={{
          width: '100%',
          height: 44,
          padding: '12px 24px',
          backgroundColor: 'var(--ps-text-100)'
        }}
      >
        Confirm
      </Button>
    </BaseDialog>
  )
}
export default Confirm
