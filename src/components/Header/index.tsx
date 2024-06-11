import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Drawer, Stack, SwipeableDrawer, Typography, styled } from '@mui/material'
import { IBoxUserStatus } from 'api/user/type'
import BtcSvg from 'assets/svg/btc.svg'
import MenuSvg from 'assets/svg/menu.svg'
import WhiteHeaderLogoSvg from 'assets/svg/white-logo.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useUserInfo } from 'state/user/hooks'
import Search from './Search'
import ArrowIcon from 'assets/svg/account/arrow.svg'
import { useHeaderBgOpacity } from 'hooks/useScroll'
import { ROUTES } from 'constants/routes'
import { SupportedChainList } from 'constants/chains'
import { IUserState } from 'state/user/type'
import { boxCheckStatus } from 'api/boxes'
import { useUpdateThemeMode } from 'state/application/hooks'
const Web3Status = dynamic(() => import('./Web3Status'), { ssr: false })

const StyledLogo = styled(WhiteHeaderLogoSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& g': {
    '& g': {
      fill: theme.palette.text.primary
    }
  }
}))

const StyledMenu = styled(MenuSvg)(({ theme }) => ({
  width: 24,
  height: 24,
  cursor: 'pointer',
  '& path': {
    fill: theme.palette.text.primary
  }
}))

// const StyledClose = styled(CloseIcon)(({ theme }) => ({
//   cursor: 'pointer',
//   '& path': {
//     fill: theme.palette.text.primary
//   }
// }))

const StyleLabel = styled(Box)(({}) => ({
  width: 'fit-content',
  textDecoration: 'none',
  cursor: 'pointer',
  color: 'var(--ps-text-40)',
  fontWeight: 500,
  lineHeight: '15px',
  '&:hover': {
    color: 'var(--ps-text-100)'
  }
}))

const StyleClaimButton = styled(Button)(({ theme }) => ({
  height: 44,
  borderRadius: '100px',
  padding: '12px 24px',
  background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)',
  color: 'var(--px-text-100)',
  fontSize: '15px',
  ':hover': {
    background: 'var(--px-text-100)'
  },
  ':hover>span': {
    background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}))

interface RouteLinkParams {
  label: string
  link: string
  active: string
  type: 'link' | 'menu' | 'outLink'
  children?: RouteLinkParams[]
  className?: string
}

interface BoxAction {
  text: string
  click: () => void
}

const MenuDrawer = ({
  open,
  handleClose,
  links,
  boxAction,
  isMd,
  onOpen,
  userInfo
}: {
  open: boolean
  handleClose: () => void
  links: RouteLinkParams[]
  boxAction: BoxAction | null
  isMd?: boolean
  onOpen?: () => void
  userInfo: IUserState
}) => {
  console.log('🚀 ~ userInfo:', userInfo.user?.boxStatus)
  const [tab, setTab] = useState<number | null>(null)
  const router = useRouter()

  const LinkAppItems = ({ list, isChildren }: { list: RouteLinkParams[]; isChildren?: boolean }) => {
    return (
      <Stack
        direction={'column'}
        gap={{ xs: isChildren ? 20 : 24, md: isChildren ? 20 : 32 }}
        sx={{ padding: isChildren ? '16px 20px' : '0 20px', transition: 'all 0.5s' }}
      >
        {list.map((item: RouteLinkParams, index: number) => {
          return (
            <Box key={'route' + index}>
              <Stack
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                sx={{
                  cursor: 'pointer',
                  '& svg': {
                    transform: 'rotate(90deg) scale(1.2)',
                    '& path': {
                      fill: 'var(--ps-text-primary)'
                    }
                  },
                  ':hover': {
                    opacity: 0.7
                  }
                }}
                onClick={() => {
                  if (item.type === 'link') {
                    if (router.pathname !== item.link) {
                      router.push(item.link)
                      handleClose()
                    }
                  } else if (item.type === 'outLink') {
                    window.open(item.link, '_blank')
                    handleClose()
                  } else {
                    setTab(tab ? null : index)
                  }
                }}
              >
                {item.label === 'Claim Club' ? (
                  <>
                    {router.pathname !== ROUTES.claimClub &&
                      userInfo.token &&
                      userInfo.user?.boxStatus === IBoxUserStatus.CLAIMED && (
                        <StyleClaimButton
                          onClick={() => {
                            if (item.type === 'link') {
                              if (router.pathname !== item.link) {
                                router.push(item.link)
                              }
                            } else {
                              window.open(item.link, '_blank')
                            }
                          }}
                          variant="contained"
                        >
                          <Typography component={'span'} sx={{ fontSize: '15px', fontWeight: 500 }}>
                            {item.label}
                          </Typography>
                        </StyleClaimButton>
                      )}
                  </>
                ) : (
                  <Typography
                    variant="h3"
                    className={item.label === 'Claim Club' ? `claim ${item.className}` : `${item.className}`}
                    sx={{
                      color: theme => theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
                {item.type === 'menu' && <ArrowIcon />}
              </Stack>
              {item.children && tab === index && <LinkAppItems list={item.children} isChildren />}
            </Box>
          )
        })}
      </Stack>
    )
  }
  if (isMd) {
    return (
      <Drawer anchor="top" open={open}>
        <Box sx={{ minHeight: '100vh', background: 'var(--ps-text-primary)' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
              padding: '24px 20px 12px'
            }}
            onClick={handleClose}
          >
            <CloseIcon sx={{ color: theme => theme.palette.text.primary }} />
          </Box>
          <LinkAppItems list={links} />
          {boxAction && (
            <Button
              variant="contained"
              size="large"
              onClick={boxAction.click}
              sx={{
                width: 'calc(100vw - 40px)',
                margin: '24px 20px 0',
                fontSize: 18,
                fontWeight: 500,
                lineHeight: '18px'
              }}
            >
              {boxAction.text}
            </Button>
          )}
        </Box>
      </Drawer>
    )
  }
  return (
    <SwipeableDrawer
      anchor="top"
      open={open}
      onOpen={() => {
        onOpen?.()
      }}
      onClose={() => handleClose()}
      sx={{
        '.MuiPaper-root': {
          marginTop: '70px'
        }
      }}
    >
      <Box sx={{ minHeight: '50vh', position: 'relative', background: 'var(--ps-text-primary)' }}>
        <Box maxWidth={1200} margin={'20px auto'}>
          <LinkAppItems list={links} />
        </Box>
      </Box>
    </SwipeableDrawer>
  )
}

const LinkItem = ({ item, isLg, userInfo }: { item: RouteLinkParams; isLg: boolean; userInfo: IUserState }) => {
  const router = useRouter()
  const isActive = (active: string) => {
    if (router.pathname === '/' && active === '/') {
      return true
    } else {
      if (active === '/') {
        return false
      }
      return router.pathname.indexOf(active) > -1
    }
  }
  return (
    <Box>
      {(item.type === 'link' || item.type === 'outLink') && (
        <>
          {item.label === 'Claim Club' ? (
            <>
              {router.pathname !== ROUTES.claimClub &&
                userInfo.user?.boxStatus === IBoxUserStatus.CLAIMED &&
                userInfo.token && (
                  <StyleClaimButton
                    onClick={() => {
                      if (item.type === 'link') {
                        if (router.pathname !== item.link) {
                          router.push(item.link)
                        }
                      } else {
                        window.open(item.link, '_blank')
                      }
                    }}
                    variant="contained"
                  >
                    <Typography component={'span'} sx={{ fontSize: '15px' }} className={item.className}>
                      {item.label}
                    </Typography>
                  </StyleClaimButton>
                )}
            </>
          ) : (
            <StyleLabel
              className={item.className}
              sx={{
                fontSize: isLg ? 12 : 15,
                color: isActive(item.active) ? 'var(--ps-text-100)' : 'var(--ps-text-40)',
                '&.claim': {
                  background:
                    'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }
              }}
              onClick={() => {
                if (item.type === 'link') {
                  if (router.pathname !== item.link) {
                    router.push(item.link)
                  }
                } else {
                  window.open(item.link, '_blank')
                }
              }}
            >
              {item.label}
            </StyleLabel>
          )}
        </>
      )}
      {item.type === 'menu' && (
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          sx={{
            cursor: 'pointer',
            position: 'relative',
            '& svg': {
              transform: 'rotate(90deg) scale(.8)',
              '& path': {
                fill: 'var(--ps-text-40)'
              }
            },
            '&:hover': {
              '& .label': {
                color: 'var(--ps-text-100)'
              },
              '& svg': {
                '& path': {
                  fill: 'var(--ps-text-100)'
                }
              },
              '& .children': {
                display: 'block'
              }
            }
          }}
        >
          <StyleLabel
            className={`label ${item.className}`}
            sx={{
              fontSize: isLg ? 12 : 15
            }}
          >
            {item.label}
          </StyleLabel>
          <ArrowIcon />
          <Box
            className="children"
            sx={{
              width: 110,
              display: 'none',
              position: 'absolute',
              top: '100%',
              borderRadius: 6,
              background: 'var(--ps-neutral)',
              padding: '16px 16px 0 16px'
            }}
          >
            {item.children?.map((temp: RouteLinkParams, index: number) => {
              return (
                <Box key={index} mb={16}>
                  <StyleLabel
                    sx={{
                      fontSize: isLg ? 12 : 15
                    }}
                    onClick={() => {
                      if (temp.type === 'link') {
                        router.push(temp.link)
                      } else {
                        window.open(temp.link, '_blank')
                      }
                    }}
                  >
                    {temp.label}
                  </StyleLabel>
                </Box>
              )
            })}
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default function Header({
  mobileStyle,
  open,
  setOpen,
  isCountdown
}: {
  mobileStyle?: React.CSSProperties
  open: boolean
  setOpen: (e: boolean) => void
  isCountdown?: boolean
}) {
  const { mode } = useUpdateThemeMode()
  const router = useRouter()
  const isClub = useMemo(() => {
    if (router.pathname === '/club/[clubId]' || router.pathname === '/club/editClub') return true
    return false
  }, [router.pathname])
  const userInfo: IUserState = useUserInfo()

  const headerBgOpacity = useHeaderBgOpacity()

  // const IsAppStorePath = useMemo(() => {
  //   return router.asPath === ROUTES.appStore.index
  // }, [router.asPath])

  const boxAction: BoxAction | null = useMemo(() => {
    const boxStatus = userInfo.user?.boxStatus
    if (Number(boxStatus) >= IBoxUserStatus.UNCLAIMED && !userInfo.box?.boxAddress) {
      return {
        text: 'Create Club',
        click: async () => {
          if (Number(boxStatus) === IBoxUserStatus.UNCLAIMED) {
            const res = await boxCheckStatus()
            if (res.code === 200) {
              router.push(`/club/createClub`)
            }
          } else {
            router.push(`/club/createClub`)
          }
        }
      }
    }
    if (userInfo.box?.boxAddress) {
      return {
        text: 'Enter My Club →',
        click: () => {
          setOpen(false)
          router.push(`/club/editClub`)
        }
      }
    }
    return null
  }, [router, setOpen, userInfo.box?.boxAddress, userInfo.user?.boxStatus])

  const links: RouteLinkParams[] = [
    {
      label: 'Explore',
      link: ROUTES.home,
      active: '/',
      type: 'link',
      className: 'home-step'
    },
    {
      label: 'Clubs',
      link: ROUTES.club.index,
      active: '/club',
      type: 'link',
      className: 'home-step2'
    },
    {
      label: 'Club Market',
      link: ROUTES.market,
      active: '/market',
      type: 'link',
      className: 'home-step3'
    },
    {
      label: 'Ecosystem',
      link: '/',
      active: '/appStore',
      type: 'menu',
      className: 'home-step4',
      children: [
        { label: 'App Store', link: ROUTES.appStore.index, active: '/appStore', type: 'link' },
        {
          label: 'Apply',
          link: 'https://github.com/BounceBit-Labs/BounceBit-App-Store',
          active: '/appStore',
          type: 'outLink'
        }
      ]
    },
    {
      label: 'BB',
      link: '/',
      active: '/Chain',
      type: 'menu',
      className: 'home-step5',
      children: [
        {
          label: 'Explorer',
          link: SupportedChainList[0].blockExplorers?.default.url || '',
          active: '/Chain',
          type: 'outLink'
        },
        { label: 'Staking', link: 'https://bbscan.io/stake', active: '/Chain', type: 'outLink' },
        { label: 'Portal', link: 'https://portal.bouncebit.io/deposit', active: '/Chain', type: 'outLink' }
      ]
    },
    {
      label: 'Claim Club',
      link: ROUTES.claimClub,
      active: '/claimClub',
      type: 'link'
    }
  ]
  const isLg = useBreakpoint('lg')
  const isMd = useBreakpoint('md')

  if (isMd) {
    return (
      <Box>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            maxWidth: '100vw',
            height: 70,
            zIndex: 999,
            padding: isLg ? '0 20px' : '0',
            background:
              mode === 'light'
                ? isClub
                  ? headerBgOpacity
                    ? `rgba(230,230,206,${headerBgOpacity})`
                    : `linear-gradient(180deg, rgba(230,230,206,1) 0%, rgba(255, 255, 255, 0.00) 100%)`
                  : `rgba(230,230,206,${headerBgOpacity})`
                : isClub
                  ? headerBgOpacity
                    ? `rgba(0,0,0,${headerBgOpacity})`
                    : 'linear-gradient(180deg, #0D0D0D 0%, rgba(13, 13, 13, 0.00) 100%)'
                  : `rgba(0,0,0,${headerBgOpacity})`,
            ...mobileStyle
          }}
        >
          <Stack
            sx={{
              height: 70,
              ...mobileStyle
            }}
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            gap={24}
          >
            <Box
              style={{ position: 'relative' }}
              onClick={() => {
                if (router.pathname !== '/') {
                  router.push('/')
                }
              }}
            >
              <StyledLogo />
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  background: 'linear-gradient(180deg, #F9AA4B -2.4%, #F7931A 9999%)',
                  borderRadius: '50%',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  transform: 'translate(25px,-10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BtcSvg />
              </Box>
            </Box>
          </Stack>
          <Stack
            display={isCountdown === true ? 'flex' : 'none'}
            direction={'row'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={16}
          >
            <Search hasBoxAction={boxAction} />
            <Web3Status />
            <StyledMenu
              onClick={() => {
                setOpen(!open)
              }}
            />
          </Stack>
        </Stack>
        <MenuDrawer
          open={open}
          boxAction={boxAction}
          handleClose={() => {
            setOpen(false)
          }}
          links={links}
          userInfo={userInfo}
          isMd
        />
      </Box>
    )
  }
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1201,
        background:
          mode === 'light'
            ? isClub
              ? headerBgOpacity
                ? `rgba(230,230,206,${headerBgOpacity})`
                : `linear-gradient(180deg, rgba(230,230,206,1) 0%, rgba(255, 255, 255, 0.00) 100%)`
              : `rgba(230,230,206,${headerBgOpacity})`
            : isClub
              ? headerBgOpacity
                ? `rgba(0,0,0,${headerBgOpacity})`
                : 'linear-gradient(180deg, #0D0D0D 0%, rgba(13, 13, 13, 0.00) 100%)'
              : `rgba(0,0,0,${headerBgOpacity})`
      }}
    >
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          height: 70,
          margin: '0 auto'
          // backgroundColor: IsAppStorePath ? 'transparent' : theme => theme.palette.background.default
        }}
      >
        <Stack
          sx={{
            height: 70
          }}
          direction={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          gap={isLg ? 10 : 40}
        >
          <Box
            sx={{
              position: 'relative',
              marginRight: isLg ? 20 : 0
            }}
            onClick={() => {
              if (router.pathname !== '/') {
                router.push('/')
              }
            }}
          >
            <StyledLogo />
            <Box
              sx={{
                width: 20,
                height: 20,
                background: 'linear-gradient(180deg, #F9AA4B -2.4%, #F7931A 9999%)',
                borderRadius: '50%',
                position: 'absolute',
                right: 0,
                top: 0,
                transform: 'translate(25px,-5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BtcSvg />
            </Box>
          </Box>
          <Stack
            display={isCountdown === true ? 'flex' : 'none'}
            gap={isLg ? 10 : 32}
            direction={'row'}
            flex={1}
            justifyContent={'flex-start'}
            alignItems={'center'}
          >
            {links.map((item: RouteLinkParams, j: number) => {
              return <LinkItem key={'route' + j} item={item} isLg={isLg} userInfo={userInfo} />
            })}
          </Stack>
        </Stack>
        <Stack
          display={isCountdown === true ? 'flex' : 'none'}
          direction={'row'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          gap={12}
          height={'100%'}
        >
          <Search hasBoxAction={boxAction} />
          {boxAction && (
            <Button variant="contained" size="large" onClick={boxAction.click}>
              {boxAction.text}
            </Button>
          )}
          <Stack>
            <Web3Status />
          </Stack>

          {/* {!open ? (
            <StyledMenu
              onClick={() => {
                setOpen(true)
              }}
            />
          ) : (
            <StyledClose onClick={() => setOpen(false)} />
          )} */}
        </Stack>
      </Stack>
      <MenuDrawer
        open={open}
        boxAction={boxAction}
        onOpen={() => {
          setOpen(true)
        }}
        handleClose={() => {
          setOpen(false)
        }}
        userInfo={userInfo}
        links={links}
      />
    </Box>
  )
}
