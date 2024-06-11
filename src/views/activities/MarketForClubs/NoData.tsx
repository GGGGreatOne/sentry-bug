import React from 'react'
import NoDataPNG from 'assets/images/activeties/no-data2x.png'
import { Stack, Typography } from '@mui/material'

export function NoData() {
  return (
    <Stack alignItems="center" spacing={32} sx={{ pb: 60 }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          p: {
            xs: 32,
            md: 60
          },
          bgcolor: 'var(--ps-text-10)',
          maxWidth: 400,
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: '50%',
          img: { maxWidth: '100%' }
        }}
      >
        <picture>
          <img src={NoDataPNG.src} alt="no data" />
        </picture>
      </Stack>
      <Typography variant="IBM_Plex_Sans" fontSize={28}>
        No Data
      </Typography>
    </Stack>
  )
}
