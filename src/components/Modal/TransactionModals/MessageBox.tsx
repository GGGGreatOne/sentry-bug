import React from 'react'
import { Box, Typography, Button, useTheme } from '@mui/material'
import Modal from '../'
import SuccessIcon from 'assets/svg/statusIcon/success_icon.svg'
import FailureIcon from 'assets/svg/statusIcon/failure_icon.svg'
import SupportIcon from 'assets/svg/statusIcon/support_icon.svg'
import Error from 'assets/svg/statusIcon/error_icon.svg'
import Warning from 'assets/svg/statusIcon/warning_icon.svg'
import useModal from 'hooks/useModal'
import Spinner from 'components/Spinner'

interface Props {
  type: 'success' | 'failure' | 'support' | 'error' | 'warning' | 'pending'
  beforeClose?: () => void
  children?: React.ReactNode
  width?: string
  header?: string
  action?: () => void
  actionText?: string
}

export default function MessageBox({
  type,
  children,
  beforeClose,
  width = '480px',
  header,
  action,
  actionText
}: Props) {
  const { hideModal } = useModal()
  const theme = useTheme()

  const icon =
    type === 'success' ? (
      <SuccessIcon />
    ) : type === 'failure' ? (
      <FailureIcon />
    ) : type === 'support' ? (
      <SupportIcon />
    ) : type === 'warning' ? (
      <Warning />
    ) : type === 'pending' ? (
      <Spinner size="40px" />
    ) : (
      <Error />
    )

  return (
    <Modal width={width} closeIcon>
      <Box display={'grid'} alignItems={'center'} padding={'40px'} justifyItems="center" gap="20px">
        <Box>{icon}</Box>
        {header && <Typography variant="h4">{header}</Typography>}
        <Box
          fontSize="16px"
          color={theme.palette.text.secondary}
          textAlign="center"
          display="grid"
          justifyItems="center"
          width="100%"
          maxWidth={600}
          sx={{ wordBreak: 'break-word' }}
        >
          {children}
        </Box>

        <Box display="flex" justifyContent="space-around" width="100%" marginTop="10px">
          <Button
            size="large"
            variant="contained"
            fullWidth
            onClick={() => {
              beforeClose && beforeClose()
              hideModal()
            }}
          >
            Close
          </Button>
          {type === 'failure' && actionText && (
            <Button onClick={action} size="large">
              {actionText}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
