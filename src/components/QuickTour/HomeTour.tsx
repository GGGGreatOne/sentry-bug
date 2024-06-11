import { useEffect, useState } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import { viewControl } from 'views/editBox/modal'
import QuickTour from '.'
import { Typography, styled, Stack, Box } from '@mui/material'
import { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
const ContentBox = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  color: 'var(--ps-text-80)',
  lineHeight: '18.2px',
  fontSize: 13,
  [theme.breakpoints.down('md')]: {
    fontSize: 12,
    lineHeight: '16.8px'
  }
}))
export default function Page({
  children,
  setOpen,
  open,
  isCountdown
}: {
  children: React.ReactNode
  setOpen: (e: boolean) => void
  open: boolean
  isCountdown?: boolean
}) {
  const isMd = useBreakpoint('md')
  const [run, setRun] = useState(false)
  const [quick, setQuick] = useState(false)
  const route = useRouter()
  useEffect(() => {
    route.events.on('routeChangeComplete', () => {
      const isFirstWeb = localStorage.getItem('isFirstWeb')
      if (!isFirstWeb && !run && quick) {
        setTimeout(
          () => {
            setRun(true)
          },
          isMd ? 1500 : 2000
        )
      }
    })
  }, [isMd, quick, route.events, run])
  const setFirstWeb = () => {
    localStorage.setItem('isFirstWeb', 'true')
  }
  useEffect(() => {
    const isFirstWeb = localStorage.getItem('isFirstWeb')
    if (!isFirstWeb && isCountdown === true) {
      viewControl.show('HomeGuidanceModal', {
        setIsOpen: setRun,
        setFirstWeb: setFirstWeb,
        setQuick: setQuick
      })
    }
  }, [isCountdown, isMd, setRun])
  const steps: Array<Step> = [
    {
      target: isMd ? '.home-app-step' : '.home-step',
      title: 'Start Exploring',
      content:
        'The “Explore” page provides an overview of BounceClub, including trending Clubs, Apps and the latest updates. ',
      disableBeacon: true,
      floaterProps: {
        styles: {
          arrow: {
            color: isMd ? '#FF9314' : '#FF9314'
          }
        }
      }
    },
    {
      target: isMd ? '.home-app-step2' : '.home-step2',
      title: 'Browse All Clubs',
      content: (
        <Stack flexDirection={'column'} gap={16}>
          <ContentBox>
            {
              'Various BounceClubs, each crafted with the unique taste of its owner, offer different access permissions: free, paid, or by whitelist.'
            }
          </ContentBox>
          <ContentBox>{`Once you gain access to a Club, you’re in for a treat! Club owners typically curate a diverse selection of Apps, providing you with exciting Web3 activities and opportunities for yield.`}</ContentBox>
        </Stack>
      ),
      floaterProps: {
        styles: {
          arrow: {
            color: isMd ? '#FF2626' : '#FF9314'
          }
        }
      }
    },
    {
      target: isMd ? '.home-app-step3' : '.home-step3',
      title: 'Get a BounceClub at Club Market',
      content: (
        <Stack flexDirection={'column'} gap={16}>
          <ContentBox>{`Even if you're not yet eligible to claim your own BounceClub, the Club Market offers a daily raffle for a chance to win one! `}</ContentBox>
          <ContentBox>{`Please note that each wallet address can only own one Club. You have complete freedom to trade your Club or purchase one at any time.`}</ContentBox>
        </Stack>
      ),
      floaterProps: {
        styles: {
          arrow: {
            color: isMd ? '#FF2626' : '#FF9314'
          }
        }
      }
    },
    {
      target: isMd ? '.home-app-step4' : '.home-step4',
      title: 'Explore BounceBit App Store',
      content: `The BounceBit App Store features a wide range of plugins built by BounceClub ecosystem partners & developers, enabling BounceClub owners to easily add these prebuilt apps to their Clubs without coding. As a Club member you’ll be able to participate in diverse Apps within the Clubs.`,
      floaterProps: {
        styles: {
          arrow: {
            color: isMd ? '#FF9314' : '#FF9314'
          }
        }
      }
    },

    {
      target: '.home-step5',
      title: 'Navigate the BounceBit Chain',
      content: `Besides BounceClub, you can access additional resources related to the BounceBit Chain, including the chain explorer BBScan and staking on BounceBit.`,
      placement: isMd ? 'top' : 'bottom',
      floaterProps: {
        styles: {
          arrow: {
            color: isMd ? '#FF2626' : '#FF9314'
          }
        }
      }
    },
    {
      target: '.home-step6',
      title: 'View Club Information',
      content: `After entering a Club as a member, you can view all essential descriptions and metrics of the Club. `,
      offset: isMd ? 10 : 20,
      floaterProps: {
        styles: {
          arrow: {
            color: '#FF9314'
          }
        }
      }
    },
    {
      target: '.project-step5',
      title: 'Engage in DApps',
      content:
        'At the bottom of every Club, there’s a navigation bar displaying the “About” section and the Apps added to the Club. To explore and participate in the Apps, make sure to connect your wallet first. ',
      offset: isMd ? 10 : 20,
      floaterProps: {
        styles: {
          arrow: {
            color: '#FF9314'
          }
        }
      }
    }
  ]
  useEffect(() => {
    const isFirstWeb = localStorage.getItem('isFirstWeb')
    if (open && !isFirstWeb) {
      setTimeout(() => {
        setRun(true)
      }, 1000)
    }
  }, [open])
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, status, index, type } = data
    if (!isMd) {
      // if (
      //   (index === 0 || index == 1 || index === 2 || index === 3 || index === 4) &&
      //   type === EVENTS.TARGET_NOT_FOUND
      // ) {
      //   setRun(false)
      //   setOpen(true)
      // }
      if (action === ACTIONS.UPDATE && index === 0) {
        if (route.pathname !== '/') route.push(ROUTES.home)
      }
      if (action === ACTIONS.UPDATE && index === 1) {
        route.push(ROUTES.clubs.allClub)
      }
      if (action === ACTIONS.UPDATE && index === 2) {
        route.push(ROUTES.market)
      }
      if (action === ACTIONS.UPDATE && index === 3) {
        route.push(ROUTES.appStore.index)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (index === 0) {
        setOpen(false)
        if (type === EVENTS.TARGET_NOT_FOUND) {
          setRun(false)
          route.push(ROUTES.home)
        }
      } else if (index === 1) {
        setOpen(false)
        if (type === EVENTS.TARGET_NOT_FOUND) {
          setRun(false)
          route.push(ROUTES.clubs.allClub)
        }
      } else if (index === 2) {
        setOpen(false)
        if (type === EVENTS.TARGET_NOT_FOUND) {
          setRun(false)
          route.push(ROUTES.market)
        }
      } else if (index === 3) {
        setOpen(false)
        if (type === EVENTS.TARGET_NOT_FOUND) {
          setRun(false)
          route.push(ROUTES.appStore.index)
        }
      } else if (index === 4 && type === EVENTS.TARGET_NOT_FOUND) {
        setRun(false)
        setOpen(true)
      }
    }
    if (index === 5 || index === 6) {
      setOpen(false)
      if (type === EVENTS.TARGET_NOT_FOUND) {
        route.push(ROUTES.club.cusBox(1))
        setRun(false)
      }
    }
    if (action === ACTIONS.SKIP || status === STATUS.FINISHED) {
      setOpen(false)
      setRun(false)
    }
    if (status === STATUS.FINISHED) {
      viewControl.show('HomeEndModal')
    }
  }
  return (
    <Box>
      <QuickTour run={run} steps={steps} setRun={setRun} setFirstWeb={setFirstWeb} callback={handleJoyrideCallback} />
      {children}
    </Box>
  )
}
