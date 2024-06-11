import React from 'react'
import { styled, SxProps, Typography, Box, IconButton, ButtonBase, useTheme } from '@mui/material'
import Settings from './Settings'
import MuiCloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const Root = styled('div')(() => ({
  position: 'relative',
  borderRadius: 20,
  background: '#1b1b1b',
  justifyContent: 'center',
  boxSizing: 'border-box',
  overflow: 'auto',
  margin: '0px auto 80px'
}))

interface Props {
  children: React.ReactNode
  width?: number | string
  onReturnClick?: () => void
  title?: string
  maxWidth?: string
  closeIcon?: boolean
  setting?: boolean
  sx?: SxProps
}

export default function AppBody(props: Props) {
  const { children, closeIcon, onReturnClick, title, setting, sx } = props

  return (
    <Root
      sx={{
        width: { xs: '100%', md: 488 },
        padding: 4,
        ...sx
      }}
    >
      <Box display="flex" justifyContent="space-between" padding={onReturnClick ? '24px 24px 10px' : undefined}>
        <Box display="flex" gap={20} alignItems="center">
          {onReturnClick && <BackBtn onClick={onReturnClick} />}
          {title && <Typography fontSize={14}>{title}</Typography>}
        </Box>
        {setting && <Settings />}
      </Box>

      {closeIcon && (
        <CloseIcon
          onClick={onReturnClick}
          sx={{
            position: 'absolute',
            top: 24,
            right: 32
          }}
        />
      )}
      {children}
    </Root>
  )
}

export function CloseIcon({
  onClick,
  variant = 'button',
  sx
}: {
  onClick?: () => void
  variant?: 'button' | 'plain'
  sx?: SxProps
}) {
  const theme = useTheme()

  if (variant === 'plain') {
    return (
      <ButtonBase onClick={onClick} sx={{ position: 'absolute', ...sx }}>
        <MuiCloseIcon
          sx={{ fontSize: 20, color: theme.palette.text.secondary, '&:hover': { color: theme.palette.text.primary } }}
        />
      </ButtonBase>
    )
  }

  return (
    <IconButton
      onClick={onClick}
      sx={{
        padding: 0,
        position: 'absolute',
        background: theme.palette.background.default,
        borderRadius: '8px',
        width: 22,
        height: 22,
        '&:hover': {
          background: '#1F9898'
        },
        '&:hover path': {
          fill: '#FFFFFF'
        },
        ...sx
      }}
    >
      <MuiCloseIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
    </IconButton>
  )
}

export function BackBtn({ onClick, sx }: { onClick?: () => void; sx?: SxProps }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        padding: 0,
        width: 22,
        height: 22,
        background: 'transparent',
        borderRadius: '50%',
        ...sx
      }}
    >
      <ArrowBackIosNewIcon sx={{ color: theme => theme.palette.grey[500], size: 13, height: 14, width: 14 }} />
    </IconButton>
  )
}
