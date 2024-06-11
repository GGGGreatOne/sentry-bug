import { styled, Box, useTheme, Typography, Button, Stack } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import AppStoreBanner from 'views/appStore/components/banner'
import CreateClubBox from 'views/appStore/components/createClubCard'
import PluginCard from 'views/appStore/components/pluginCard'
import DeFiList from 'views/appStore/deFiList'
import { WithAnimation } from 'components/WithAnimation'
import Head from 'next/head'

const StyleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1440px',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    paddingTop: '70px'
  }
}))

export default function Page() {
  const theme = useTheme()
  const isSm = useBreakpoint('sm')
  return (
    <StyleBox
      sx={{
        overflowX: 'hidden'
      }}
    >
      <Head>
        <title>BounceClub - App Store</title>
      </Head>
      <AppStoreBanner />
      <Stack spacing={60} padding={{ xs: '0 0 0 20px', md: '0 120px' }}>
        <PluginCard />
        <CreateClubBox />
      </Stack>
      <Box
        sx={{
          padding: '0 120px',
          marginTop: '64px',
          [theme.breakpoints.down('sm')]: {
            padding: '0 0 0 20px'
          }
        }}
      >
        <DeFiList />
      </Box>
      <Box
        mt={isSm ? 64 : 160}
        sx={{
          py: { xs: 48, md: 84 },
          background: 'var(--ps-neutral2)',
          [theme.breakpoints.down('sm')]: {
            px: 20
          }
        }}
      >
        <Box sx={{ width: isSm ? 'calc(100vw - 40px)' : '100%', maxWidth: 959, margin: '0 auto', textAlign: 'center' }}>
          <WithAnimation>
            <Typography
              sx={{
                color: 'var(--ps-text-100)',
                fontFamily: 'SF Pro Display',
                fontSize: { xs: 36, md: 64 },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '100%',
                padding: isSm ? '0 20px' : 0
              }}
            >
              Want to list your DApp here?
            </Typography>
          </WithAnimation>
          <WithAnimation>
            <Typography
              my={30}
              sx={{
                color: '#A8A29F',
                fontFamily: 'SF Pro Display',
                fontSize: { xs: 15, md: 20 },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '130%'
              }}
            >
              Calling all developers: Submit your protocols to be featured on the BounceBit App Store.
            </Typography>
          </WithAnimation>
          <WithAnimation>
            <Button
              variant="contained"
              sx={{
                height: 44,
                padding: '12px 24px',
                background:
                  'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
                color: 'var(--ps-text-100)',
                fontFamily: 'SF Pro Display',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '100%'
              }}
              onClick={() => {
                window.open('https://github.com/BounceBit-Labs/BounceBit-App-Store', '_blank')
              }}
            >
              Submit an App
            </Button>
          </WithAnimation>
        </Box>
      </Box>
    </StyleBox>
  )
}
