import { Box, Button, Stack, Typography } from '@mui/material'
import BaseDialog from '../baseDialog'
import ClubIcon from 'assets/svg/not-round-club.svg'
import { LoadingButton } from '@mui/lab'
import { useWeb3Login } from 'state/user/hooks'
import { useDisconnect } from 'wagmi'
import { useCallback } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'

const SignLoginDialog = () => {
  const isSm = useBreakpoint('sm')
  const { loading: isLoading, runAsync: toLogin } = useWeb3Login()
  const { disconnectAsync } = useDisconnect()

  const toCancel = useCallback(async () => {
    disconnectAsync()
  }, [disconnectAsync])

  return (
    <BaseDialog hiddenTitle close={false} minWidth={440} onClose={toCancel} disableBackClick>
      <Stack width={'100%'} overflow={'hidden'} alignItems={'center'} spacing={20}>
        <Typography variant={isSm ? 'h4' : 'h3'}>Welcome to BounceClub</Typography>
        <Typography fontSize={{ xs: 14, sm: 16 }} color="var(--ps-neutral4)">
          Connect your wallet to start using BounceClub
        </Typography>
        <Box my={30} sx={{ width: 100, height: 100, border: '1px solid var(--ps-neutral2)', borderRadius: 100 }}>
          <Box sx={{ width: '100%', height: '100%', transform: 'scale(1.8)', transformOrigin: '5% 8%' }}>
            <ClubIcon />
          </Box>
        </Box>
        <Box width={'100%'} display={'grid'} gridTemplateColumns={'1fr 1fr'} gap="20px">
          <Button
            variant="outlined"
            onClick={toCancel}
            sx={{
              fontSize: { xs: 13, sm: 15 },
              whiteSpace: 'nowrap'
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            variant="contained"
            color="primary"
            onClick={toLogin}
            sx={{
              fontSize: { xs: 13, sm: 15 },
              whiteSpace: 'nowrap'
            }}
          >
            Accept and sign
          </LoadingButton>
        </Box>
      </Stack>
    </BaseDialog>
  )
}

export default SignLoginDialog
