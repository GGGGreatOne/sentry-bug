import { Button } from '@mui/material'
import React from 'react'
import { viewControl } from '.'
import { ListClubItem } from 'api/activities/type'

export function PutOnSellButton({ club, onRefresh }: { club: ListClubItem; onRefresh?: () => void }) {
  // No Data || Internally Reserved 0 - 1000
  if (!club?.rewardId || Number(club?.rewardId) < 1001) {
    return null
  }
  return (
    <>
      <Button
        variant="outlined"
        sx={{
          width: 150,
          height: { xs: 36, md: 44 }
        }}
        onClick={() => {
          viewControl.show('PutOnSellDialog', {
            club,
            onRefresh
          })
        }}
      >
        Put on sale
      </Button>
      {/* <Button
        variant="outlined"
        onClick={() => {
          viewControl.show('ResultPromptDialog', {
            title: 'Listing successful!',
            onOk: () => {
              viewControl.hide('ResultPromptDialog')
            }
          })
        }}
      >
        List Success
      </Button> */}
    </>
  )
}
