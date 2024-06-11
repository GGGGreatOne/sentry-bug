import { Button, Stack, Typography, styled } from '@mui/material'
import { useCountDown } from 'ahooks'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Clock = styled(Stack)({
  width: 225,
  borderRadius: '16px',
  padding: 32,
  fontWeight: 500,
  textAlign: 'center',
  fontSize: 134,
  background: '#1C1C19'
})

export function Countdown() {
  const isMd = useBreakpoint('sm')
  const [show, setShow] = useState(false)
  const router = useRouter()
  const endTime = 1715594400000
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({ targetDate: endTime })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      if (now < endTime && router.pathname !== ROUTES.claimClub) {
        setShow(true)
        return
      }
      setShow(false)
    }, 1000)
    return () => clearInterval(interval)
  }, [router.pathname])

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [show])

  return (
    <Stack
      sx={{
        position: 'fixed',
        zIndex: 89999,
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: show ? 'grid' : 'none',
        alignItems: 'center',
        justifyItems: 'center',
        backdropFilter: 'blur(5px)',
        backgroundColor: '#0C0C0C66'
      }}
    >
      <Stack spacing={80} justifyContent={'center'} width={'100%'}>
        <Typography
          fontSize={isMd ? 30 : 47}
          fontWeight={700}
          textAlign={'center'}
          width={500}
          margin={'0 auto !important'}
        >
          BounceClub Mainnet Goes Live In
        </Typography>
        <Stack direction={'row'} spacing={10} margin={'80px auto 0 !important'}>
          <Stack spacing={20}>
            <Clock>{countdown > 0 ? days : '00'}</Clock>
            <Typography fontSize={20} fontWeight={600} textAlign={'center'} width={'100%'}>
              DAYS
            </Typography>
          </Stack>
          <Stack spacing={20}>
            <Clock>{countdown > 0 ? hours : '00'}</Clock>
            <Typography fontSize={20} fontWeight={600} textAlign={'center'} width={'100%'}>
              HOURS
            </Typography>
          </Stack>
          <Stack spacing={20}>
            <Clock>{countdown > 0 ? minutes : '00'}</Clock>
            <Typography fontSize={20} fontWeight={600} textAlign={'center'} width={'100%'}>
              MINUTES
            </Typography>
          </Stack>
          <Stack
            spacing={20}
            sx={{
              justifyContent: 'center'
            }}
          >
            <Clock>{countdown > 0 ? seconds : '00'}</Clock>
            <Typography fontSize={20} fontWeight={600} textAlign={'center'} width={'100%'}>
              SECONDS
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          sx={{
            width: 160,
            height: 44,
            fontSize: 15,
            color: '#fff',
            fontWeight: 500,
            margin: '20px auto !important',
            background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)'
          }}
          onClick={() => router.push(ROUTES.claimClub)}
        >
          Check Eligibility
        </Button>
      </Stack>
    </Stack>
  )
}
