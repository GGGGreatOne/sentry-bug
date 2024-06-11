import React, { useCallback } from 'react'
import {
  Dialog as MuiDialog,
  DialogContent,
  Typography,
  DialogTitle,
  DialogProps as MuiDialogProps,
  styled,
  IconButton,
  Stack,
  Button
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useModal } from '@ebay/nice-modal-react'
import CloseSvg from 'assets/svg/close-light.svg'
import { useUpdateThemeMode } from 'state/application/hooks'
import { TransactionReceipt } from '@ethersproject/providers'

export interface BaseTransactionDialogProps extends Omit<MuiDialogProps, 'open' | 'content'> {
  onAgain?: () => void
  onCancel?: () => void
  onClose?: () => void
  actionParams?: TransactionReceipt
  children: React.ReactNode
  title?: string
  cancelBtn?: string
  againBtn?: string
  loading?: boolean
  close?: boolean
  closeIcon?: React.ReactNode
  disabled?: boolean
}
const BaseMuiDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiModal-backdrop': {
    background: 'var(--ps-text-40)',
    backdropFilter: 'blur(24px)'
  },
  '& .MuiDialog-paper': {
    padding: 24,
    maxWidth: 440,
    borderRadius: 20,
    backgroundColor: theme.palette.background.default,
    backgroundImage: 'none',
    width: '100%'
  }
}))
const BaseTransactionDialog = (props: BaseTransactionDialogProps) => {
  const { mode } = useUpdateThemeMode()
  const {
    children,
    title,
    onAgain,
    onClose,
    cancelBtn,
    againBtn,
    disabled,
    onCancel,
    loading,
    close,
    closeIcon,
    ...rest
  } = props
  const modal = useModal()
  const handleCancel = useCallback(() => {
    onCancel?.()
    modal.hide()
  }, [modal, onCancel])
  const handleAgain = () => {
    onAgain?.()
    modal.hide()
  }
  const handleClose = () => {
    onClose?.()
    modal.hide()
  }

  return (
    <BaseMuiDialog open={modal.visible} onClose={handleClose} aria-labelledby="customized-dialog-title" {...rest}>
      <DialogTitle component={'div'} sx={{ padding: 0, height: 37 }}>
        <Typography variant="h3" color={'primary'}>
          {title}
        </Typography>
      </DialogTitle>
      {close !== false && (
        <IconButton
          sx={{
            width: 'fit-content',
            height: 'fit-content',
            p: 0,
            'svg>rect': { fill: mode === 'light' ? '#F5F5F7' : '#898679' },
            position: 'absolute',
            right: 24,
            top: 24
          }}
          onClick={handleClose}
        >
          {closeIcon ?? <CloseSvg />}
        </IconButton>
      )}

      <DialogContent sx={{ p: '12px 16px 0', textAlign: 'center' }}>
        {children}
        <Stack alignItems="center" pb={16}>
          <Stack
            direction="row"
            justifyContent="center"
            columnGap={10}
            sx={{ width: '100%', button: { flex: 1, fontSize: 15 } }}
          >
            {cancelBtn && (
              <Button
                variant={!againBtn ? 'contained' : 'outlined'}
                sx={{
                  p: '20px 30px',
                  minWidth: 132,
                  borderRadius: 100
                  // border: '1px solid var(--text-60, rgba(230, 230, 206, 0.60))',
                  // background: '#FFFFE5'
                }}
                onClick={handleCancel}
              >
                {cancelBtn}
              </Button>
            )}
            {againBtn && (
              <LoadingButton
                loadingPosition="start"
                loading={!!loading}
                variant="contained"
                sx={{ p: '20px 30px', minWidth: 132 }}
                onClick={handleAgain}
                disabled={disabled}
                startIcon={<></>}
              >
                {againBtn}
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </BaseMuiDialog>
  )
}

export default BaseTransactionDialog
