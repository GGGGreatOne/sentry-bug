import { Stack, CardActions as MuiCardActions, Typography, Chip, Button, Skeleton } from '@mui/material'
import React, { useMemo } from 'react'
import { styles } from './styles'
import { ListClubItem } from 'api/activities/type'
import { viewControl } from '../ClubActions'
import { ROUTES } from 'constants/routes'
import { BigNumber } from 'bignumber.js'
import { useUserInfo } from 'state/user/hooks'

export function CardActions({ club }: { club?: ListClubItem }) {
  const { userId } = useUserInfo()

  const isOwner = useMemo(() => userId === club?.userId, [userId, club?.userId])

  return (
    <MuiCardActions sx={styles.actions}>
      <Stack sx={{ width: '100%' }} spacing={12}>
        <Stack direction="row" justifyContent="space-between" sx={{ flex: 1 }}>
          <div style={{ width: '48%' }}>
            <Typography fontFamily="IBM Plex Sans" fontSize={15} color="var(--text-60, #FFFFFF99)">
              Rank
            </Typography>
            <Stack direction="row" alignItems="center" spacing={8} width={'100%'}>
              {club ? (
                <Stack direction={'row'} spacing={8} width={'100%'}>
                  <Typography variant="IBM_Plex_Sans" sx={{ minWidth: 36, width: '38%' }} fontSize={15}>
                    {club.ranks ? club.ranks : '--'}
                  </Typography>
                  <Chip
                    label={`${club ? club.followCount : '-'} Follower`}
                    size="small"
                    sx={{ height: 23, flex: 1, width: '58%' }}
                  />
                </Stack>
              ) : (
                <Skeleton variant="text" animation="wave" sx={{ width: 36, fontSize: 15 }} />
              )}
            </Stack>
          </div>

          <div style={{ width: '48%' }}>
            <Typography
              fontFamily="IBM Plex Sans"
              sx={{ display: 'inline-block', width: '100%', textAlign: 'right' }}
              fontSize={15}
              color="var(--text-60, #FFFFFF99)"
            >
              Price
            </Typography>
            {club ? (
              <Typography
                variant="IBM_Plex_Sans"
                fontSize={15}
                sx={{ display: 'inline-block', width: '100%', overflowWrap: 'break-word', textAlign: 'right' }}
              >
                {new BigNumber(club.wantAmount).shiftedBy(-18).dp(6).toFormat()}&nbsp;BB
              </Typography>
            ) : (
              <Skeleton variant="text" animation="wave" sx={{ width: 36, fontSize: 15 }} />
            )}
          </div>
        </Stack>

        {club ? (
          <Stack direction="row" spacing={8}>
            <Button variant="outlined" size="large" fullWidth href={ROUTES.club.cusBox(club.id)}>
              Detail
            </Button>
            {isOwner ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  viewControl.show('CancelSaleDialog', {
                    club
                  })
                }}
              >
                Unlist
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  viewControl.show('PurchaseDialog', {
                    club
                  })
                }}
              >
                Purchase
              </Button>
            )}
          </Stack>
        ) : (
          <Skeleton variant="rectangular" animation="wave" width="100%" height={44} />
        )}
      </Stack>
    </MuiCardActions>
  )
}
