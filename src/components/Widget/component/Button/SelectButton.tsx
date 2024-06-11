import React from 'react'
import { ButtonBase, useTheme, Box, SxProps } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  children?: React.ReactNode
  disabled?: boolean
  style?: SxProps
  selected?: boolean
}

export default function SelectButton(props: Props) {
  const { onClick, disabled, style = {}, children } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={Object.assign(
        {
          width: 'max-content',
          borderRadius: '60px',
          height: 36,
          // backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.default,
          color: '#20201E',
          fontSize: 16,
          fontWeight: 400,
          transition: '.3s',
          padding: '4px 5px 4px 10px',
          position: 'relative',
          whiteSpace: 'nowrap',
          '& *': {
            zIndex: 2
          },
          '&:before': {
            background: '#ffffff',
            position: 'absolute',
            borderRadius: '60px',
            top: 1,
            right: 1,
            bottom: 1,
            left: 1,
            content: '""',
            pointerEvents: 'none !important'
          },
          '&:hover, :active': {
            borderRadius: '60px',

            backgroundClip: 'padding-box',
            zIndex: 1,
            '&:before': { background: '#eeeeee' }
          },
          display: 'flex',
          justifyContent: 'space-between',
          '&.MuiButtonBase-root.Mui-disabled': {
            opacity: theme.palette.action.disabledOpacity
          }
        },
        style
      )}
    >
      <Box>{children}</Box>
      <ExpandMoreIcon />
    </ButtonBase>
  )
}
