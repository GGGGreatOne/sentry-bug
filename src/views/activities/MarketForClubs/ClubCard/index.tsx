import { Card, Stack, CardContent, CardHeader, Typography, Skeleton } from '@mui/material'
import React from 'react'
import { CardMedia } from './CardMedia'
import { CardAvatar } from './CardAvatar'
import { styles } from './styles'
import { CardActions } from './CardActions'
import { ListClubItem } from 'api/activities/type'
import { shortenStr } from 'utils'

type ClubCardProps = {
  action?: boolean
  ownerInfo?: boolean
  club?: ListClubItem
}

export function ClubCard({ club, ownerInfo = true, action = true }: ClubCardProps) {
  if (!club) {
    return <ClubCardSkeleton ownerInfo={ownerInfo} action={action} />
  }
  return (
    <Card
      component={Stack}
      elevation={0}
      sx={{ position: 'relative', zIndex: 1, aspectRatio: '1/1', borderRadius: '12px' }}
    >
      <CardMedia />
      {ownerInfo && (
        <CardHeader
          sx={styles.header}
          title={
            <CardAvatar avatarSrc={club?.userAvatar || ''} name={club?.userName ? shortenStr(club.userName) : '-'} />
          }
        />
      )}
      <CardContent sx={{ flex: 1 }} alignItems="center" justifyContent="center" component={Stack}>
        <Typography fontSize={28} variant="IBM_Plex_Sans">
          #{club ? club.rewardId : ''}
        </Typography>
      </CardContent>
      {action && <CardActions club={club} />}
    </Card>
  )
}

export function ClubCardSkeleton({ ownerInfo, action }: ClubCardProps) {
  return (
    <Card
      component={Stack}
      elevation={0}
      sx={{
        position: 'relative',
        zIndex: 1,
        aspectRatio: '1/1',
        borderRadius: '12px',
        '.MuiSkeleton-root': {
          bgcolor: 'var(--ps-text-10)'
        }
      }}
    >
      <CardMedia />
      {ownerInfo && <CardHeader sx={styles.header} title={<CardAvatar name="" />} />}

      <CardContent sx={{ flex: 1 }} alignItems="center" justifyContent="center" component={Stack}>
        <Skeleton animation="wave" variant="text" sx={{ height: 50, width: '50%' }} />
      </CardContent>
      {action && <CardActions />}
    </Card>
  )
}
