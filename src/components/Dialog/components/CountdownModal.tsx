import { Box, Stack, Typography } from '@mui/material'
import ClubIcon from 'assets/svg/not-round-club.svg'
import { LoadingButton } from '@mui/lab'
import { useWeb3Login } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import BaseDialog from '../baseDialog'
import { useCountDown } from 'ahooks'

const CountdownModal = () => {
  const isSm = useBreakpoint('sm')
  const { loading: isLoading, runAsync: toLogin } = useWeb3Login()
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({ targetDate: 1715594400000 })

  return (
    <BaseDialog hiddenTitle close={false} minWidth={440} onClose={undefined} disableBackClick>
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
        <Box width={'100%'} display={'grid'} gap="20px">
          <LoadingButton
            loading={isLoading}
            disabled
            loadingPosition="start"
            variant="contained"
            color="primary"
            onClick={toLogin}
            sx={{
              fontSize: { xs: 13, sm: 15 },
              whiteSpace: 'nowrap'
            }}
          >
            Mainnet Launch At {countdown > 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` : '00d 00h 00m 00s'}
          </LoadingButton>
        </Box>
      </Stack>
    </BaseDialog>
  )
}

export default CountdownModal
