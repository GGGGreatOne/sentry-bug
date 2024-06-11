import { Avatar, Skeleton, Stack, Typography } from '@mui/material'
import { useLazyImage } from 'hooks/useLazyImage'
import React, { useMemo } from 'react'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
type CardAvatarProps = {
  avatarSrc?: string
  name: string
  size?: number
}

export function CardAvatar({ avatarSrc, size = 36, name }: CardAvatarProps) {
  const { src: lazySrc } = useLazyImage(avatarSrc)

  const icon = useMemo(() => {
    if (!avatarSrc) {
      return <Avatar src={DefaultAvatar.src} sx={{ width: size, height: size }} />
    }

    if (avatarSrc && lazySrc) {
      return <Avatar src={lazySrc} sx={{ width: size, height: size }} />
    }

    return <Skeleton variant="circular" width={size} height={size} animation="wave" />
  }, [lazySrc, size, avatarSrc])

  return (
    <Stack
      direction="row"
      spacing={8}
      alignItems="center"
      sx={{
        display: 'inline-flex',
        p: 4,
        height: 44,
        borderRadius: '22px',
        minWidth: 110,
        background: 'rgba(13, 13, 13, 0.4)'
      }}
    >
      <div>{icon}</div>
      <Stack spacing={2}>
        <Typography lineHeight={1} variant="IBM_Plex_Sans" fontSize="13px" color="var(--ps-text-80)">
          Owner
        </Typography>
        {name ? (
          <Typography lineHeight={1} color="var(--ps-text-100)" variant="IBM_Plex_Sans" fontSize={15}>
            {name}
          </Typography>
        ) : (
          <Skeleton variant="text" animation="wave" sx={{ fontSize: 15 }} />
        )}
      </Stack>
    </Stack>
  )
}
