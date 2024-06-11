import { Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import LoadingAnimation from 'components/Loading'
import React from 'react'

export function ResultPromptDialog({
  onOk,
  title,
  msg,
  msgWidth
}: {
  onOk: () => void
  msg?: string
  title: React.ReactNode
  msgWidth?: string | number
}) {
  return (
    <BaseDialog minWidth={440} onClose={() => {}}>
      <Stack spacing={24} alignItems="center">
        <Typography variant="IBM_Plex_Sans" fontSize={28} textAlign="center">
          {title}
        </Typography>
        {msg && (
          <Typography fontSize={18} width={msgWidth}>
            {msg}
          </Typography>
        )}
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 86,
            height: 86,
            borderRadius: '43px',
            mb: 16,
            border: '1px solid #282828'
          }}
        >
          <LoadingAnimation
            sx={{
              height: '100%',
              width: '100%',
              textAlign: 'center',
              transformOrigin: 'center',
              transform: 'scale(0.6)'
            }}
          />
        </Stack>
        <Button size="large" variant="contained" fullWidth onClick={() => onOk()}>
          Ok
        </Button>
      </Stack>
    </BaseDialog>
  )
}
