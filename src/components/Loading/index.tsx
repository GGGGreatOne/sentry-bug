import { SxProps, Theme, Box, styled } from '@mui/material'
import Loading from 'assets/svg/bouncebit.svg'
import React from 'react'

const LoadingMove = styled(Loading)<{ duration: number }>(({ duration }) => ({
  animation: `rotate-loading ${duration}s ease-in 0s infinite`,
  '& path': {
    fill: 'var(--ps-text-100)'
  },
  '& g': {
    fill: 'var(--ps-text-100)',
    animation: `point-loading ${duration}s linear 0s infinite`
  },
  '@keyframes point-loading': {
    '0%': {
      opacity: 1
    },
    '30%': {
      opacity: 0
    },
    '60%': {
      opacity: 1
    },
    '75%': {
      opacity: 1
    },
    '100%': {
      opacity: 1
    }
  },
  '@keyframes rotate-loading': {
    '0%': {
      transform: 'rotate(0)'
    },
    '25%': {
      transform: 'rotate(0)'
    },
    '50%': {
      transform: 'rotate(0)'
    },
    '80%': {
      transform: 'rotate(0)'
    },
    '100%': {
      transform: 'rotate(180deg)'
    }
  }
}))

export default function LoadingAnimation({
  sx,
  scale = 1,
  duration = 3
}: {
  sx?: SxProps<Theme>
  scale?: string | number
  duration?: number
}) {
  return (
    <Box sx={sx}>
      <LoadingMove duration={duration} sx={{ transform: `scale(${scale})` }} />
    </Box>
  )
}
