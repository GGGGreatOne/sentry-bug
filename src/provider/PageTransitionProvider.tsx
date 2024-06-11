import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import LoadingAnimation from 'components/Loading'
import useDebounce from 'hooks/useDebounce'
import { ROUTES } from 'constants/routes'

export default function AppTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsFirstMount(false)
    }, 400)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return <div className={`app-transition ${isFirstMount ? 'app-no-transition' : ''}`}>{children}</div>
}

export function PageTransition() {
  const router = useRouter()
  const [pageTransition, setPageTransition] = useState(false)
  const curPageTransition = useDebounce(pageTransition, 200)
  const endTime = 1715594400000

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      if (typeof window !== 'object') return
      if (
        now < endTime &&
        router.pathname !== ROUTES.claimClub &&
        window.location.hostname.includes('app.bouncebit.io')
      ) {
        router.replace(ROUTES.claimClub)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url === router.asPath) {
        router.events.emit('routeChangeError')
        // throw new Error('Abort route change. You are already on the page.')
      }
      setPageTransition(true)
    }

    const handleComplete = () => {
      setPageTransition(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
    }
  }, [router.asPath, router.events])

  return (
    <CSSTransition in={curPageTransition} timeout={400} classNames="page-transition" unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 9999,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
          pointerEvents: 'none',
          backgroundColor: 'rgba(0,0,0,0.85)'
        }}
      >
        <CSSTransition in={curPageTransition} timeout={400} classNames="page-transition" unmountOnExit>
          <LoadingAnimation />
        </CSSTransition>
      </Box>
    </CSSTransition>
  )
}
