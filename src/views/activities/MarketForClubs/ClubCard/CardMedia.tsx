import React from 'react'
import { SxProps, CardMedia as MuiCardMedia } from '@mui/material'
import { useLazyImage } from 'hooks/useLazyImage'

type CardMediaProps = {
  src?: string
}

const sx = {
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1
} as SxProps

export function CardMedia({ src }: CardMediaProps) {
  const { src: lazySrc } = useLazyImage(src)
  if (src && lazySrc) {
    return <MuiCardMedia sx={sx} component="img" src={lazySrc} />
  }

  // Default
  return <MuiCardMedia sx={sx} component="img" src="/assets/imgs/views/activities/cube-bg.jpg" />

  // Effect
  //   return (
  //     <MuiCardMedia
  //       sx={{ ...sx, mixBlendMode: 'exclusion', borderRadius: '12px', height: '100%', objectFit: 'cover' }}
  //       autoPlay
  //       muted
  //       loop
  //       component="video"
  //       poster="/assets/imgs/views/activities/cube-bg.jpg"
  //       src="/assets/imgs/views/activities/cube-bg.mp4"
  //     />
  //   )
}
