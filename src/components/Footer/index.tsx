import { Box, Stack, Typography, styled } from '@mui/material'
import LogoSvg from 'assets/svg/black-logo.svg'
import GithubSvg from 'assets/svg/github.svg'
import MediumSvg from 'assets/svg/medium.svg'
import TgSvg from 'assets/svg/telegram.svg'
import TwitterSvg from 'assets/svg/twitter.svg'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUpdateThemeMode } from 'state/application/hooks'

const StyledLogo = styled(LogoSvg, { shouldForwardProp: prop => prop !== 'themeMode' })(({ theme }) => ({
  cursor: 'pointer',
  '& g': {
    '& g': {
      fill: theme.palette.text.primary
    }
  }
}))

const MediumLogo = styled(MediumSvg, { shouldForwardProp: prop => prop !== 'themeMode' })<{ themeMode?: string }>(
  ({ themeMode }) => ({
    cursor: 'pointer',
    '& rect': {
      fill: 'var(--ps-neutral5)'
    },
    '& g': {
      fill: themeMode === 'light' ? '#F5F5F7' : '#0D0D0D'
    }
  })
)
const TgLogo = styled(TgSvg, { shouldForwardProp: prop => prop !== 'themeMode' })<{ themeMode?: string }>(
  ({ themeMode }) => ({
    cursor: 'pointer',
    '& rect': {
      fill: 'var(--ps-neutral5)'
    },
    '& path': {
      fill: themeMode === 'light' ? '#F5F5F7' : '#0D0D0D'
    }
  })
)
const TwitterLogo = styled(TwitterSvg, { shouldForwardProp: prop => prop !== 'themeMode' })<{ themeMode?: string }>(
  ({ themeMode }) => ({
    cursor: 'pointer',
    '& rect': {
      fill: 'var(--ps-neutral5)'
    },
    '& path': {
      fill: themeMode === 'light' ? '#F5F5F7' : '#0D0D0D'
    }
  })
)
const GithubLogo = styled(GithubSvg, { shouldForwardProp: prop => prop !== 'themeMode' })<{ themeMode?: string }>(
  ({ themeMode }) => ({
    cursor: 'pointer',
    '& rect': {
      fill: 'var(--ps-neutral5)'
    },
    '& path': {
      fill: themeMode === 'light' ? '#F5F5F7' : '#0D0D0D'
    }
  })
)

interface SocialParams {
  img: any
  link: string
}
interface LInkItmsParams {
  label: string
  link: string
}
const SocialLinks = ({ themeMode }: { themeMode: string }) => {
  const links: SocialParams[] = [
    {
      img: <MediumLogo themeMode={themeMode} />,
      link: 'https://medium.com/@bouncebit'
    },
    {
      img: <TgLogo themeMode={themeMode} />,
      link: 'https://t.me/bouncebit_io'
    },
    {
      img: <TwitterLogo themeMode={themeMode} />,
      link: 'https://twitter.com/bounce_bit'
    },
    {
      img: <GithubLogo themeMode={themeMode} />,
      link: 'https://github.com/BounceBit-Labs'
    }
  ]
  return (
    <Stack direction={'row'} gap={8}>
      {links.map((item: SocialParams, index: number) => {
        return (
          <Link key={'social' + index} href={item.link} target="_">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              {item.img}
            </Box>
          </Link>
        )
      })}
      {/* <Link href="https://docs.bouncebit.io" target="_blank">
        <Box
          sx={{
            width: 36,
            height: 36,
            backgroundColor: 'var(--ps-neutral5)',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography
            sx={{
              color: 'var(--ps-text-primary)',
              fontSize: 13,
              lineHeight: 'normal'
            }}
          >
            API
          </Typography>
        </Box>
      </Link> */}
    </Stack>
  )
}
export default function Footer() {
  const menuLink1: LInkItmsParams[] = [
    {
      label: 'Explore',
      link: '/'
    },
    {
      label: 'Clubs',
      link: ROUTES.clubs.index
    },
    {
      label: 'App Store',
      link: ROUTES.appStore.index
    }
  ]
  const menuLink2: LInkItmsParams[] = [
    {
      label: 'Terms of Use',
      link: 'https://docs.bouncebit.io/terms-of-use'
    },
    {
      label: 'Privacy Policy',
      link: 'https://docs.bouncebit.io/privacy-policy'
    }
  ]
  const router = useRouter()
  const hiddenRoutes = [ROUTES.clubs.index]
  const isMd = useBreakpoint('md')
  const islg = useBreakpoint('lg')
  const { mode: themeMode } = useUpdateThemeMode()
  if (hiddenRoutes.indexOf(router.pathname) > -1) {
    return <></>
  }
  return (
    <Box
      className="EvenBastardHasAName"
      id={'GlobalBottomInfoZone'}
      sx={{
        position: 'relative',
        width: '100%',
        padding: isMd ? '40px 20px' : '64px 0',
        backgroundColor: theme => theme.palette.background.default,
        zIndex: 4
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: isMd ? 'calc(100vw - 40px)' : '1200px',
          margin: '0 auto',
          padding: islg && !isMd ? '0 20px' : 'unset'
        }}
      >
        <Stack
          direction={isMd ? 'column' : 'row'}
          justifyContent={'space-between'}
          alignItems={'flex-start'}
          sx={{
            borderBottom: `1px solid var(--ps-text-10)`,
            paddingBottom: 40
          }}
        >
          <Stack direction={'column'} gap={24}>
            <StyledLogo />
            <SocialLinks themeMode={themeMode} />
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={isMd ? 'space-between' : 'flex-start'}
            alignItems={'flex-start'}
            gap={40}
            sx={{
              width: isMd ? '100%' : 'inline',
              marginTop: isMd ? '40px' : 0
            }}
          >
            <Box
              sx={{
                width: 180
              }}
            >
              <Typography
                variant="h5"
                mb={48}
                sx={{
                  color: theme => theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: isMd ? 13 : 15
                }}
              >
                BounceClub
              </Typography>
              <Stack direction={'column'} gap={32}>
                {menuLink1.map((item: LInkItmsParams, j: number) => {
                  return (
                    <Link href={item.link} key={'menu1' + j}>
                      <Typography
                        variant="body2"
                        sx={{
                          width: 'max-content',
                          color: 'var(--ps-text-40)',
                          cursor: 'pointer',
                          borderBottom: '1px solid transparent',
                          paddingBottom: 5,
                          '&:hover': {
                            borderBottom: '1px solid var(--ps-text-100)'
                          }
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Link>
                  )
                })}
              </Stack>
            </Box>
            <Box
              sx={{
                width: 180
              }}
            >
              <Typography
                variant="h5"
                mb={48}
                sx={{
                  color: theme => theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: isMd ? 13 : 15
                }}
              >
                Legal
              </Typography>
              <Stack direction={'column'} gap={32}>
                {menuLink2.map((item: LInkItmsParams, j: number) => {
                  return (
                    <Typography
                      key={'menu1' + j}
                      variant="body2"
                      sx={{
                        width: 'max-content',
                        color: 'var(--ps-text-40)',
                        cursor: 'pointer',
                        paddingBottom: 5,
                        borderBottom: '1px solid transparent',
                        '&:hover': {
                          borderBottom: '1px solid var(--ps-text-100)'
                        }
                      }}
                      onClick={() => {
                        item.link && window.open(item.link, '_blank')
                      }}
                    >
                      {item.label}
                    </Typography>
                  )
                })}
              </Stack>
            </Box>
          </Stack>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--ps-text-40)',
            marginTop: 40,
            fontSize: isMd ? 12 : 15
          }}
        >
          ©2024 BounceBit Ltd. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
