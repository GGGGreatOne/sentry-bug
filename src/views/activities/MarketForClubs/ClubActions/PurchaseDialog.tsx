import { Box, Button, CircularProgress, Stack } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import React from 'react'
import { ClubCard } from '../ClubCard'
import { useErc721Fullfil } from 'hooks/useErc721Swap'
import { viewControl } from '.'
import { ListClubItem } from 'api/activities/type'

export function PurchaseDialog({ club }: { club: ListClubItem }) {
  const { runAsync, loading } = useErc721Fullfil()
  return (
    <BaseDialog minWidth={440} title="BounceClub" onClose={() => {}}>
      <Stack spacing={24}>
        <Box sx={{ width: '100%' }}>
          <ClubCard action={false} club={club} />
        </Box>
        <Button
          size="large"
          variant="contained"
          disabled={loading}
          onClick={() => {
            runAsync({
              id: club.rewardId,
              orderId: club.orderId,
              value: club.wantAmount
            })
              .then(() => {
                viewControl.show('ResultPromptDialog', {
                  title: 'Purchase successful!',
                  onOk: () => {
                    viewControl.hide('ResultPromptDialog')
                  }
                })
              })
              .catch(err => {
                viewControl.show('ResultPromptDialog', {
                  title: 'Purchase failed',
                  msg:
                    err?.message === 'You already own a BounceClub'
                      ? 'Looks like you already own BounceClub! Unfortunately, each account can only have one. Thanks for your enthusiasm!'
                      : err?.message,
                  msgWidth: err?.message === 'You already own a BounceClub' ? 350 : 1,
                  onOk: () => {
                    viewControl.hide('ResultPromptDialog')
                  }
                })
              })
              .finally(() => {
                viewControl.hide('PurchaseDialog')
              })
          }}
        >
          {loading && <CircularProgress size={18} sx={{ color: 'inherit' }} />}&nbsp;&nbsp;Confirm payment
        </Button>
      </Stack>
    </BaseDialog>
  )
}
