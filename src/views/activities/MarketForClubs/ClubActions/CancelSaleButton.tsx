import { Button } from '@mui/material'
import React from 'react'
import { viewControl } from '.'
import { ListClubItem } from 'api/activities/type'

export function CancelSaleButton({ club, onRefresh }: { club: ListClubItem; onRefresh?: () => void }) {
  return (
    <>
      <Button
        sx={{ height: 30, py: 0, width: { xs: '100%', md: 'auto' } }}
        size="small"
        variant="contained"
        onClick={() => {
          viewControl.show('CancelSaleDialog', {
            club,
            onRefresh
          })
        }}
      >
        Detail
      </Button>
      {/* <Button
        variant="outlined"
        onClick={() => {
          viewControl.show('ResultPromptDialog', {
            title: 'Cancel success!',
            onOk: () => {
              viewControl.hide('ResultPromptDialog')
            }
          })
        }}
      >
        Cancel Success
      </Button> */}
    </>
  )
}
