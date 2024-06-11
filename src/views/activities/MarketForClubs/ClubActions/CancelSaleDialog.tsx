import { Box, Button, CircularProgress, Stack } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import React from 'react'
import { ClubCard } from '../ClubCard'
import { useErc721UnList } from 'hooks/useErc721Swap'
import { viewControl } from '.'
import { ListClubItem } from 'api/activities/type'

export function CancelSaleDialog({ club, onRefresh }: { club: ListClubItem; onRefresh?: () => void }) {
  const { runAsync, loading } = useErc721UnList()

  return (
    <BaseDialog minWidth={440} title="Detail" onClose={() => {}}>
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
              orderId: club.orderId
            }).then(() => {
              onRefresh?.()
              viewControl.hide('CancelSaleDialog')
              viewControl.show('ResultPromptDialog', {
                title: 'Cancel successful!',
                onOk: () => {
                  viewControl.hide('ResultPromptDialog')
                }
              })
            })
          }}
        >
          {loading && <CircularProgress size={18} sx={{ color: 'inherit' }} />}&nbsp;&nbsp;Cancel listing
        </Button>
      </Stack>
    </BaseDialog>
  )
}
