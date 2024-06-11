import { HTMLProps, useCallback } from 'react'
import { IconButton, Link, SxProps, Theme } from '@mui/material'
import React from 'react'
import CloseSvg from 'assets/svg/close-light.svg'
import { useUpdateThemeMode } from 'state/application/hooks'

export function CloseIcon({ onClick }: { onClick?: () => void }) {
  const { mode } = useUpdateThemeMode()
  return (
    <IconButton
      onClick={onClick}
      size="large"
      sx={{
        padding: 0,
        position: 'absolute',
        top: '24px',
        right: '24px',
        'svg>rect': { fill: mode === 'light' ? '#F5F5F7' : '#717171' },
        '&:hover $closeIcon': {
          color: theme => theme.palette.text.primary
        }
      }}
    >
      <CloseSvg />
    </IconButton>
  )
}

export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  style,
  sx,
  className,
  children,
  underline
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  underline?: 'always' | 'hover' | 'none'
  className?: string
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
      } else {
        event.preventDefault()
        window.location.href = href
      }
    },
    [href, target]
  )
  return (
    <Link
      className={className}
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      style={style}
      sx={sx}
      underline={underline ?? 'none'}
    >
      {children}
    </Link>
  )
}
