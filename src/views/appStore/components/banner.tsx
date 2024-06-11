import { styled, Box, Typography, Stack, Button } from '@mui/material'

import PcBanner from 'assets/images/appStore/banner_pc.png'
import MobileBanner from 'assets/images/appStore/banner_mobile.png'
import Image from 'next/image'
import useBreakpoint from 'hooks/useBreakpoint'

const StyleBanner = styled(Box)(({ theme }) => ({
  padding: '16px',
  width: '100%',
  position: 'relative',
  borderRadius: '24px',
  [theme.breakpoints.down('md')]: {
    borderRadius: '16px'
  }
}))

const AppStoreBanner = () => {
  const IsMd = useBreakpoint('md')

  if (IsMd) {
    return (
      <StyleBanner>
        <Stack
          sx={{
            position: 'absolute',
            padding: '40px 0 0 16px',
            zIndex: 9
          }}
          spacing={40}
        >
          <Stack spacing={16}>
            <Typography fontSize={36} lineHeight={1} fontWeight={500} color={'var(--ps-text-100)'}>
              BounceBit
            </Typography>
            <Typography className="home-app-step4" variant="h4" lineHeight={'14px'}>
              App Store
            </Typography>
          </Stack>
          <Typography maxWidth={288} lineHeight={'21px'}>
            {'Explore a suite of pre-built apps. Unlock a fun, innovative Web3 experience.'}
          </Typography>
          <Button
            variant="contained"
            sx={{ width: 100, fontSize: 16 }}
            onClick={() => window.open('https://github.com/BounceBit-Labs/BounceBit-App-Store', '_blank')}
          >
            APPLY
          </Button>
        </Stack>
        <Image
          src={MobileBanner}
          style={{
            width: '100%',
            height: '422px',
            borderRadius: '16px',
            objectFit: 'cover'
          }}
          alt="banner"
        />
      </StyleBanner>
    )
  }
  return (
    <StyleBanner>
      <Stack
        sx={{
          position: 'absolute',
          padding: '116px 0 0 80px',
          zIndex: 9
        }}
        spacing={40}
      >
        <Stack spacing={16}>
          <Typography variant="h1">BounceBit</Typography>
          <Typography variant="h3" lineHeight={'20px'}>
            App Store
          </Typography>
        </Stack>
        <Typography fontSize={16} fontWeight={500} lineHeight={1.4}>
          {'Explore a suite of pre-built apps. Unlock a fun, innovative Web3 experience.'}
        </Typography>
        <Button
          variant="contained"
          sx={{ width: 180, height: 44, fontSize: 20 }}
          onClick={() => window.open('https://github.com/BounceBit-Labs/BounceBit-App-Store', '_blank')}
        >
          APPLY
        </Button>
      </Stack>
      <Image
        src={PcBanner}
        style={{
          width: '100%',
          height: '422px',
          borderRadius: '24px',
          objectFit: 'cover'
        }}
        alt="banner"
      />
    </StyleBanner>
  )
}

export default AppStoreBanner
