import React from 'react'
import {
  Dialog as MuiDialog,
  DialogContent,
  Typography,
  DialogTitle,
  DialogProps as MuiDialogProps,
  styled,
  IconButton,
  SxProps,
  Theme
} from '@mui/material'

import { useModal } from '@ebay/nice-modal-react'
import CloseSvg from 'assets/svg/close-light.svg'
import { useUpdateThemeMode } from 'state/application/hooks'
import useBreakpoint from 'hooks/useBreakpoint'

export interface BaseDialogProps extends Omit<MuiDialogProps, 'open' | 'content'> {
  onClose?: () => void
  children: React.ReactNode
  title?: string
  close?: boolean
  disableBackClick?: boolean
  minWidth?: number
  hiddenTitle?: boolean
  closeIcon?: React.ReactNode
  headerEl?: React.ReactNode
  mt?: string | number
  sx?: SxProps<Theme>
  bottomChild?: React.ReactNode
}
const BaseMuiDialog = styled(MuiDialog)(() => ({
  '& .MuiModal-backdrop': {
    background: 'rgba(13, 13, 13, 0.80)',
    backdropFilter: 'blur(24px)'
  },
  '& .MuiDialog-paper': {
    padding: '32px 24px',
    borderRadius: 16,
    backgroundColor: 'var(--ps-neutral)',
    backgroundImage: 'none',
    width: 'fit-content',
    border: '1px solid var(--ps-text-10)',
    boxShadow: '0px 4px 14px 0px var(--text-08)'
  },
  '& .MuiDialogContent-root': {
    textAlign: 'unset'
  }
}))
const BaseDialog = (props: BaseDialogProps) => {
  const { mode } = useUpdateThemeMode()
  const {
    sx,
    mt,
    children,
    title,
    onClose,
    hiddenTitle,
    close,
    closeIcon,
    disableBackClick,
    minWidth,
    headerEl,
    bottomChild,
    ...rest
  } = props
  const modal = useModal()
  const isSm = useBreakpoint('sm')
  const handleClose = () => {
    if (disableBackClick) return
    onClose?.()
    modal.remove()
  }

  const runClose = () => {
    onClose?.()
    modal.remove()
  }

  return (
    <BaseMuiDialog
      open={modal.visible}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          padding: isSm ? '32px 20px' : '32px 24px',
          minWidth: isSm ? 'calc(100vw - 40px)' : minWidth,
          margin: isSm ? 20 : 32
        },
        ...sx
      }}
      {...rest}
    >
      {!hiddenTitle && (
        <DialogTitle component={'div'} sx={{ padding: 0, height: 37 }}>
          <Typography
            variant="h3"
            sx={{
              width: isSm ? 200 : 400,
              fontSize: isSm ? 20 : 28,
              color: 'var(--ps-text-100)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'Hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
        </DialogTitle>
      )}
      {headerEl && headerEl}
      {close !== false && (
        <IconButton
          sx={{
            width: 'fit-content',
            height: isSm ? 25.2 : 'fit-content',
            p: 0,
            'svg>rect': { fill: mode === 'light' ? '#F5F5F7' : '#717171' },
            position: 'absolute',
            right: 24,
            top: 32
          }}
          onClick={runClose}
        >
          {closeIcon ?? <CloseSvg style={{ transform: isSm ? 'scale(.7)' : 'scale(1)' }} />}
        </IconButton>
      )}
      <DialogContent
        sx={{
          textAlign: 'center',
          mt: mt !== undefined ? mt : 28,
          p: 0,
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {children}
      </DialogContent>
      {bottomChild}
    </BaseMuiDialog>
  )
}

export default BaseDialog
