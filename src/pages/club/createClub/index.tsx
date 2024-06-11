import { Box, Typography, styled, useTheme } from '@mui/material'
import { IBoxUserStatus } from 'api/user/type'
import { BoxTypes } from 'api/boxes/type'
import { useEffect, useMemo, useState } from 'react'
import { useUserInfo } from 'state/user/hooks'
import Link from 'next/link'
import CreateBoxBanner from 'assets/images/boxes/create-box-banner.png'
import CreateBoxBanner2 from 'assets/images/boxes/create-box-banner-2.png'
import GridBG from 'assets/images/boxes/grid-bg.png'
import SolidBG from 'assets/images/boxes/solid-bg.png'
import { useRouter } from 'next/router'
import Head from 'next/head'
import BoxAnimation from 'views/createClub/boxAnimation/index'
import { viewControl } from 'views/editBox/modal'
import { ROUTES } from 'constants/routes'
const BoxContainer = styled(Box)`
  max-width: 540px;
  max-height: 500px;
  border-radius: 32px;
  background: var(--ps-neutral2);
  overflow: hidden;
  cursor: pointer;
  & .title1 {
    color: var(--ps-text-100);
    text-align: center;
    font-family: 'SF Pro Display';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }

  & .title2 {
    color: var(--ps-text-100);
    text-align: center;
    font-family: 'SF Pro Display';
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
  }

  & .title3 {
    color: var(--ps-text-80);
    text-align: center;
    font-family: 'SF Pro Display';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-height: 360px;
    & .title1 {
      font-size: 15px;
    }
    & .title2 {
      font-size: 24px;
    }
    & .title3 {
      font-size: 15px;
    }
  }
`

export default function Page() {
  const userInfo = useUserInfo()
  const router = useRouter()
  const boxStatus = useMemo(() => userInfo.user?.boxStatus, [userInfo.user?.boxStatus])
  useEffect(() => {
    if (!userInfo.token) {
      router.replace('/')
      return
    }
    if (userInfo.box?.boxAddress) {
      router.push(ROUTES.club.editClub)
    }
  }, [router, userInfo.box?.boxAddress, userInfo.token])
  const theme = useTheme()
  const [showAnimationBox, setShowAnimationBox] = useState(false)
  const [isFirstClick, setIsFirstClick] = useState(true)
  // const [showUserAnimationBox] = useState(false)
  const [showUserAnimationBox, setShowUserAnimationBox] = useState(false)
  const [isUserFirstClick, setIsUserFirstClick] = useState(true)
  return (
    <Box
      sx={{
        minHeight: { xs: '100%', md: `calc(100vh - 70px - 128px )` },
        mt: 70,
        mb: { xs: 64, md: 0 },
        background: `url(${GridBG.src})`
      }}
    >
      <Head>
        <title>BounceClub - Create Club</title>
      </Head>
      <Box sx={{ width: '100%', maxWidth: 1156, margin: '0 auto' }}>
        {Number(boxStatus) >= IBoxUserStatus.CLAIMED && !userInfo.box?.boxAddress && (
          <>
            <Box sx={{ textAlign: 'center', pt: { xs: 0, md: 42 } }}>
              <Typography
                sx={{
                  color: 'var(--ps-text-60)',
                  fontFamily: 'SF Pro Display',
                  fontSize: { xs: 15, md: 16 },
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '140%' // 22.4px
                }}
              >
                Your BounceClub number
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-text-100)',
                  fontFamily: 'SF Pro Display',
                  fontSize: { xs: 20, md: 28 },
                  mt: { xs: 5, md: 0 },
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: '140%'
                }}
              >
                #{userInfo.box?.rewardId}
              </Typography>
            </Box>
            <Typography
              sx={{
                textAlign: { xs: 'center', md: 'right' },
                mt: { xs: 10, md: 0 },
                a: {
                  color: 'var(--ps-text-100)',
                  fontFamily: 'SF Pro Display',
                  fontSize: { xs: 12, md: 13 },
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '18.2px'
                }
              }}
            >
              <Link href={ROUTES.market}>{`Create Later, Go to Trade >>`}</Link>
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 76,
                mt: 24,
                [theme.breakpoints.down('md')]: {
                  gridTemplateColumns: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 20
                }
              }}
            >
              <BoxContainer
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    maxHeight: showAnimationBox ? 400 : 'auto',
                    height: 400
                  }
                }}
                onClick={() => {
                  if (isFirstClick) {
                    setShowAnimationBox(true)
                    setIsFirstClick(false)
                    return
                  }
                  viewControl.show('CreateProjectBoxModal', { boxType: BoxTypes.PROJECT })
                }}
              >
                <Box
                  sx={{ padding: { xs: '32px 40px 36px', md: showAnimationBox ? '32px 40px 56px' : '32px 40px 86px' } }}
                >
                  <Typography className="title1">Create a </Typography>
                  <Typography className="title2" sx={{ marginTop: 12 }}>
                    Project Club for Free
                  </Typography>
                  <Typography className="title3" sx={{ marginTop: { xs: 15, md: 24 } }}>
                    One-click landing page with no-code development, manage your community, hold AMAs, play games…
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: '232px' }}>
                  {!showAnimationBox && (
                    <Box
                      sx={{
                        width: '100%',
                        height: '232px',
                        background: `url(${CreateBoxBanner.src})`,
                        backgroundSize: { xs: 'contain', md: 'cover' }
                      }}
                    />
                  )}
                  {showAnimationBox && <BoxAnimation boxType={BoxTypes.PROJECT} />}
                </Box>
              </BoxContainer>

              <BoxContainer
                sx={{
                  // cursor: 'not-allowed',
                  [theme.breakpoints.down('sm')]: {
                    maxHeight: showUserAnimationBox ? 400 : 'auto',
                    height: 400
                  }
                }}
                onClick={() => {
                  if (isUserFirstClick) {
                    setShowUserAnimationBox(true)
                    setIsUserFirstClick(false)
                    return
                  }
                  viewControl.show('CreateProjectBoxModal', { boxType: BoxTypes.USER })
                }}
              >
                <Box sx={{ padding: { xs: '32px 40px 36px', md: '32px 40px 86px' } }}>
                  <Typography className="title1">Create a </Typography>
                  <Typography className="title2" sx={{ marginTop: 12 }}>
                    User Social Club for Free
                  </Typography>
                  <Typography className="title3" sx={{ marginTop: { xs: 15, md: 24 } }}>
                    One-click landing page with no-code development, manage your community, hold AMAs, play games…
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: '232px' }}>
                  {!showUserAnimationBox && (
                    <Box
                      sx={{
                        width: '100%',
                        height: '232px',
                        background: `url(${CreateBoxBanner2.src})`,
                        backgroundSize: { xs: 'contain', md: 'cover' }
                      }}
                    />
                  )}
                  {showUserAnimationBox && <BoxAnimation boxType={BoxTypes.USER} />}
                </Box>
              </BoxContainer>
            </Box>
          </>
        )}
        {boxStatus === IBoxUserStatus.NOT_OBTAIN && (
          <Box textAlign={'center'} pt={20}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 970,
                height: { xs: 369, md: 748 },
                background: `url(${SolidBG.src})`,
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around'
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: 'var(--ps-text-100)',
                    textAlign: 'center',
                    fontFamily: 'SF Pro Display',
                    fontSize: { xs: 24, md: 40 },
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: { xs: '140%', md: '56px' }
                  }}
                >
                  Sorry, you do not have a<br /> club serial number.
                </Typography>
                <Typography
                  component={'a'}
                  href={ROUTES.claimClub}
                  sx={{
                    display: 'inline-flex',
                    height: '44px',
                    padding: '12px 24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '100px',
                    border: '1px solid #000',
                    background: 'var(--ps-text-100)',
                    color: 'var(--ps-text-primary)',
                    fontFamily: 'SF Pro Display',
                    fontSize: { xs: 13, md: 15 },
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '100%',
                    marginTop: { xs: 20, md: 302 }
                  }}
                >{`Participate in the Lottery to Win a Club `}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
