import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Input from 'components/Input'
import React, { useMemo, useState } from 'react'
import { ClubCard } from '../ClubCard'
import { useErc721List, useNFTSwapApproveState } from 'hooks/useErc721Swap'
import { viewControl } from '.'
import { ListClubItem } from 'api/activities/type'
import { formatDecimals } from 'utils/parseAmount'
import { BigNumber } from 'bignumber.js'
import { ApprovalState } from 'hooks/useApproveCallback'

export function PutOnSellDialog({ club, onRefresh }: { club: ListClubItem; onRefresh?: () => void }) {
  const { runAsync, loading } = useErc721List()
  const [amount, setAmount] = useState<string>('')
  const [state, approve] = useNFTSwapApproveState()

  const action = useMemo(() => {
    const _loading = state === ApprovalState.PENDING
    if (state === ApprovalState.NOT_APPROVED || _loading) {
      return (
        <Button
          size="large"
          variant="contained"
          disabled={_loading}
          onClick={() => {
            approve()
          }}
        >
          {_loading && <CircularProgress size={18} sx={{ color: 'inherit' }} />}&nbsp;&nbsp; Approve Club #
          {club.rewardId}
        </Button>
      )
    }
    const sellAmount = new BigNumber(amount || 0).shiftedBy(18)
    return (
      <Button
        size="large"
        variant="contained"
        disabled={loading || sellAmount.lte(0)}
        onClick={() => {
          runAsync({
            tokenId: club.rewardId,
            sellAmount: sellAmount.toString()
          }).then(() => {
            onRefresh?.()
            viewControl.hide('PutOnSellDialog')
            viewControl.show('ResultPromptDialog', {
              title: 'Listing successful!',
              onOk: () => {
                viewControl.hide('ResultPromptDialog')
              }
            })
          })
        }}
      >
        {loading && <CircularProgress size={18} sx={{ color: 'inherit' }} />}&nbsp;&nbsp;Put on sale
      </Button>
    )
  }, [amount, approve, club.rewardId, loading, onRefresh, runAsync, state])

  return (
    <BaseDialog minWidth={800} title="Put on sale" onClose={() => {}}>
      <Stack spacing={24}>
        <Typography
          fontSize={16}
          fontFamily="IBM Plex Sans"
          sx={{
            p: 24,
            borderRadius: '12px',
            color: 'rgba(255, 48, 48, 1)',
            background: 'rgba(209, 42, 31, 0.1)'
          }}
        >
          Selling your club will also transfer all associated followers and rights. Please proceed with caution.
        </Typography>
        <Stack
          direction={{
            xs: 'column',
            md: 'row'
          }}
          spacing={32}
        >
          <Stack spacing={32} sx={{ flex: 1 }}>
            <Stack spacing={16}>
              <Typography variant="IBM_Plex_Sans" fontSize={20}>
                Sale price
              </Typography>
              <Input
                outlined
                value={amount}
                placeholder="0.00"
                onChange={ev => {
                  setAmount(formatDecimals(ev.target.value))
                }}
                endAdornment={<Typography>BB</Typography>}
              />
            </Stack>

            <Stack spacing={8} sx={{ fontFamily: 'IBM Plex Sans', fontSize: 15 }}>
              <Stack direction="row" justifyContent="space-between">
                <span>You will receive</span>
                <span>{amount || '0'} BB</span>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <span>Service charge</span>
                <span>0%</span>
              </Stack>
            </Stack>
            {action}
          </Stack>

          <Box sx={{ width: { xs: '100%', md: 248 } }}>
            <ClubCard ownerInfo={false} action={false} club={club} />
          </Box>
        </Stack>
      </Stack>
    </BaseDialog>
  )
}
