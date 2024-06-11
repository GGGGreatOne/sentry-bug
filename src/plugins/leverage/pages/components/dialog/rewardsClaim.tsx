import { Box, Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import BTCBImg from '../../../assets/btcb.png'
import RedWarnSvg from '../../../assets/red-warn.svg'
import Image from 'next/image'
const RewardsClaim = () => {
  return (
    <BaseDialog title="Rewards Claim">
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
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
          Amount
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: '"SF Pro Display"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          Available: 589,587.25 USDT≈58 BTC
        </Typography>
      </Stack>
      <Box
        mt={12}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr',
          borderRadius: 10,
          background: 'var(--ps-text-primary)',
          height: 84,
          padding: 12
        }}
        alignItems={'center'}
      >
        <Image src={BTCBImg.src} width={40} height={40} alt="" />
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '20px',
            fontWeight: '500',
            lineHeight: '130%',
            marginLeft: 12
          }}
        >
          BTCU
        </Typography>
        <Box sx={{ textAlign: 'end' }}>
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              fontSize: '15px',
              fontWeight: '500',
              lineHeight: '100%'
            }}
          >
            56,789.12 BTCU
          </Typography>
          <Typography
            sx={{
              color: 'var(--ps-neutral3)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '140%',
              marginTop: 4
            }}
          >
            ~ $ 456,789.00
          </Typography>
        </Box>
      </Box>
      <Box
        mt={8}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr',
          borderRadius: 10,
          background: 'var(--ps-text-primary)',
          height: 84,
          padding: 12
        }}
        alignItems={'center'}
      >
        <Image src={BTCBImg.src} width={40} height={40} alt="" />
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: '"SF Pro Display"',
            fontStyle: 'normal',
            fontSize: '20px',
            fontWeight: '500',
            lineHeight: '130%',
            marginLeft: 12
          }}
        >
          USDT
        </Typography>
        <Box sx={{ textAlign: 'end' }}>
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              fontSize: '15px',
              fontWeight: '500',
              lineHeight: '100%'
            }}
          >
            56,789.12 BTCU
          </Typography>
          <Typography
            sx={{
              color: 'var(--ps-neutral3)',
              fontFamily: '"SF Pro Display"',
              fontStyle: 'normal',
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '140%',
              marginTop: 4
            }}
          >
            ~ $ 456,789.00
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{
          width: '100%',
          height: 44,
          padding: '12px 24px',
          marginTop: 32,
          background: 'var(--ps-text-100)',
          color: 'var(--ps-text-primary)',
          fontFamily: '"SF Pro Display"',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '100%'
        }}
      >
        Claim
      </Button>
      <Stack
        mt={12}
        flexDirection={'row'}
        sx={{ padding: '12px 16px', gap: 12, borderRadius: 12, background: 'rgba(255, 48, 48, 0.10)' }}
        alignItems={'center'}
      >
        <RedWarnSvg />
        <Typography
          sx={{
            width: 'calc(100% - 32px)',
            color: 'var(--ps-red)',
            fontFamily: '"SF Pro Display"',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%' /* 16.8px */,
            textTransform: 'capitalize',
            textAlign: 'left'
          }}
        >
          Your perpetual trade account margin level has reached 80%. To avoid forced liquidation, please deposit more
          margin...
        </Typography>
      </Stack>
    </BaseDialog>
  )
}
export default RewardsClaim
