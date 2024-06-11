import { Box, Stack, Typography } from '@mui/material'
import DownArrowImg from 'assets/svg/claimBox/arrow-down-blue.svg'
import ClaimBoxPanel from 'views/claimBox/claimBoxPanel'
import BoxesLeaderboard from 'views/claimBox/boxesLeaderboard'
import AboutBounceBit from 'views/claimBox/aboutBounceBit'
import AboutBounceBitTestnet from 'views/claimBox/aboutBounceBitTestnet'
import useBreakpoint from 'hooks/useBreakpoint'
import WorkCard from 'views/claimBox/workCard'
import TestnetBBTotal from 'views/claimBox/bounceTestnetBBTotal'
import { WithAnimation } from 'components/WithAnimation'
import Head from 'next/head'
import { Link } from 'react-scroll'

// const BoxStyle = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   maxWidth: '282px',
//   width: '100%',
//   height: '80px',
//   borderRadius: '24px',
//   padding: '24px 32px',
//   backdropFilter: ' blur(5px)',
//   cursor: 'pointer',
//   '& .title': {
//     color: 'var(--ps-text-100)',
//     fontFamily: 'SF Pro Display',
//     fontSize: '20px',
//     fontStyle: 'normal',
//     fontWeight: '500',
//     lineHeight: '130%'
//   },
//   [theme.breakpoints.down('md')]: {
//     maxWidth: '100%',
//     height: '60px',
//     padding: '16px 24px',
//     borderRadius: '12px',
//     '& .title': {
//       fontSize: '15px'
//     }
//   }
// }))

export default function Page() {
  const isMd = useBreakpoint('md')
  const isSm = useBreakpoint('sm')
  // const router = useRouter()
  return (
    <Box sx={{ width: '100%', height: '100%', mt: 70 }}>
      <Head>
        <title>BounceClub - Claim Club</title>
      </Head>
      <Box sx={{ width: '100%', maxWidth: 1440, margin: '0 auto', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', px: { md: 120, xs: 20, sm: 60 } }}>
          <WithAnimation>
            <Stack
              sx={{
                flexDirection: { md: 'row', xs: 'column' },
                justifyContent: { md: 'space-between', xs: 'flex-start' },
                alignItems: { md: 'flex-end', xs: 'flex-start' },
                pt: { md: 80, xs: 20 },
                gap: 24
              }}
            >
              <Typography
                sx={{
                  color: 'var(--ps-neutral5)',
                  fontFamily: 'New York',
                  fontSize: { xs: 50, lg: 100, sm: 70 },
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '100%'
                }}
              >
                Welcome to <br />
                BounceClub Mainnet
              </Typography>
              <Box>
                <Typography
                  sx={{
                    color: 'var(--ps-text-100)',
                    fontFamily: 'SF Pro Display',
                    fontSize: { lg: 20, xs: 15 },
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: '26px'
                  }}
                  mb={10}
                >
                  Check your eligibility & create your club
                </Typography>
                <Link
                  to="get-club"
                  smooth={true}
                  duration={500}
                  offset={-350}
                  style={{
                    display: 'flex',
                    width: 'max-content'
                  }}
                >
                  <Stack
                    spacing={4}
                    maxWidth={'max-content'}
                    direction={'row'}
                    sx={{ cursor: 'pointer', color: '#4E6EF3', display: 'flex', alignItems: 'center', fontSize: 15 }}
                  >
                    <Typography sx={{ color: '#4E6EF3', fontSize: 15 }}>View More</Typography>
                    {!isMd && <DownArrowImg />}
                  </Stack>
                </Link>
              </Box>
            </Stack>
          </WithAnimation>
        </Box>
        {/* <Box sx={{ width: '100%', px: { md: 120, xs: 0 } }}>
          <WithAnimation>
            <Box
              sx={{
                width: '100%',
                px: { xs: 20, md: 0 },
                overflow: 'scroll',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                scrollbarWidth: 'none'
              }}
            >
              <Box
                mt={isMd ? 30 : 92}
                sx={{
                  display: 'flex',
                  flexDirection: isMd ? 'column' : 'row',
                  gap: 24,
                  width: '100%'
                }}
              >
                <BoxStyle
                  onClick={() => router.push(ROUTES.appStore.pluginDetail(DefaultPluginNum.Bitswap))}
                  sx={{ background: '#D8AB15' }}
                >
                  <Stack
                    width={'100%'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    sx={{ gap: 12, height: 'max-content' }}
                  >
                    <Icon1 />
                    <Typography className="title">Bitswap</Typography>
                  </Stack>
                </BoxStyle>
                <BoxStyle
                  sx={{ background: `#14A85C` }}
                  onClick={() => router.push(ROUTES.appStore.pluginDetail(DefaultPluginNum.Bitstaking))}
                >
                  <Stack width={'100%'} flexDirection={'row'} alignItems={'center'} sx={{ gap: 12 }}>
                    <Icon2 />
                    <Typography className="title">Bitstaking</Typography>
                  </Stack>
                </BoxStyle>
                <BoxStyle
                  sx={{ background: `#21627B` }}
                  onClick={() => router.push(ROUTES.appStore.pluginDetail(DefaultPluginNum.Bitleverage))}
                >
                  <Stack width={'100%'} flexDirection={'row'} alignItems={'center'} sx={{ gap: 12 }}>
                    <Icon3 />
                    <Typography className="title">Krav</Typography>
                  </Stack>
                </BoxStyle>
                <BoxStyle
                  sx={{ background: `#F7931B` }}
                  onClick={() => router.push(ROUTES.appStore.pluginDetail(DefaultPluginNum.Bitstable))}
                >
                  <Stack width={'100%'} flexDirection={'row'} alignItems={'center'} sx={{ gap: 12 }}>
                    <Icon4 />
                    <Typography className="title">Bitstable</Typography>
                  </Stack>
                </BoxStyle>
              </Box>
            </Box>
          </WithAnimation>
        </Box> */}

        <WithAnimation>
          <WorkCard />
        </WithAnimation>

        <WithAnimation>
          <TestnetBBTotal />
        </WithAnimation>

        <WithAnimation>
          <Box
            sx={{
              width: '100%',
              maxWidth: 1440,
              margin: isMd ? '160px auto 0' : '240px auto 0',
              padding: { xs: '0 20px', sm: '0 40px', md: '0 60px', lg: '0 80px' }
            }}
          >
            <ClaimBoxPanel />
          </Box>
        </WithAnimation>

        {/* <BounceClubOwner /> */}

        <Box
          px={120}
          sx={{
            width: '100%',
            maxWidth: 1440,
            margin: '0 auto',
            padding: { xs: '0 20px', sm: '0 40px', md: '0 60px', lg: '0 80px' }
          }}
        >
          <WithAnimation>
            {' '}
            <Box mt={160} mb={160}>
              <Typography
                sx={{
                  color: 'var(--ps-text-100)',
                  fontFamily: 'SF Pro Display',
                  fontSize: { xs: 24, md: 40 },
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '140%'
                }}
              >
                Other Features You Might Need
              </Typography>
              <Box mt={40}>
                <Stack
                  flexDirection={isSm ? 'column' : 'row'}
                  justifyContent={'space-between'}
                  sx={{ padding: '24px 32px', borderRadius: 24, background: 'var(--ps-neutral)' }}
                >
                  <Typography
                    mb={isSm ? 10 : 0}
                    sx={{
                      color: 'var(--ps-text-100)',
                      fontFamily: 'SF Pro Display',
                      fontSize: { xs: 15, md: 20 },
                      fontWeight: 500,
                      lineHeight: '130%'
                    }}
                  >
                    Portal
                  </Typography>
                  <a
                    style={{
                      color: 'var(--ps-blue)',
                      fontFamily: 'SF Pro Display',
                      fontSize: isSm ? 15 : 20,
                      fontWeight: 500,
                      lineHeight: '130%'
                    }}
                    href={'https://portal.bouncebit.io'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit ↗
                  </a>
                </Stack>

                <Stack
                  mt={isSm ? 12 : 18}
                  flexDirection={isSm ? 'column' : 'row'}
                  justifyContent={'space-between'}
                  sx={{ padding: '24px 32px', borderRadius: 24, background: 'var(--ps-neutral)' }}
                >
                  <Typography
                    mb={isSm ? 10 : 0}
                    sx={{
                      color: 'var(--ps-text-100)',
                      fontFamily: 'SF Pro Display',
                      fontSize: { xs: 15, md: 20 },
                      fontWeight: 500,
                      lineHeight: '130%'
                    }}
                  >
                    Bridge
                  </Typography>
                  <a
                    style={{
                      color: 'var(--ps-blue)',
                      fontFamily: 'SF Pro Display',
                      fontSize: isSm ? 15 : 20,
                      fontWeight: 500,
                      lineHeight: '130%'
                    }}
                    href="https://portal.bouncebit.io/bridge"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit ↗
                  </a>
                </Stack>

                <Stack
                  mt={isSm ? 12 : 18}
                  flexDirection={isSm ? 'column' : 'row'}
                  justifyContent={'space-between'}
                  sx={{ padding: '24px 32px', borderRadius: 24, background: 'var(--ps-neutral)' }}
                >
                  <Typography
                    mb={isSm ? 10 : 0}
                    sx={{
                      color: 'var(--ps-text-100)',
                      fontFamily: 'SF Pro Display',
                      fontSize: { xs: 15, md: 20 },
                      fontWeight: 500,
                      lineHeight: '130%'
                    }}
                  >
                    Explorer
                  </Typography>
                  <a
                    style={{
                      color: 'var(--ps-blue)',
                      fontFamily: 'SF Pro Display',
                      fontSize: isSm ? 15 : 20,
                      fontWeight: 500,
                      lineHeight: '130%'
                    }}
                    href={'https://mainnet.bbscan.io'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Automatic RPC Node Configuration ↗
                  </a>
                </Stack>
              </Box>
            </Box>
          </WithAnimation>
          <WithAnimation>
            <Box mt={160} sx={{ padding: { xs: '0 20px', sm: '0 40px', md: '0 60px', lg: '0 80px' } }}>
              <BoxesLeaderboard />
            </Box>
          </WithAnimation>

          <WithAnimation>
            <Box mt={160}>
              <AboutBounceBit />
            </Box>
          </WithAnimation>
          <WithAnimation>
            <Box mt={160} mb={isSm ? 120 : 160}>
              <AboutBounceBitTestnet />
            </Box>
          </WithAnimation>
        </Box>
      </Box>
    </Box>
  )
}
