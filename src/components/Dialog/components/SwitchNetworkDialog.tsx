import { Stack, Typography } from '@mui/material'
import BaseDialog from '../baseDialog'
import { useCallback } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import { CHAIN_LOGO, NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import DisconnectIcon from 'assets/svg/disconnect.svg'
import { globalDialogControl } from 'components/Dialog'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useLogout } from 'state/user/hooks'

const SwitchNetworkDialog = () => {
  const isSm = useBreakpoint('sm')
  const { chainId } = useActiveWeb3React()
  const { logout } = useLogout()
  const run = useSwitchNetwork()

  const runDisconnect = useCallback(async () => {
    logout()
    globalDialogControl.hide('SwitchNetworkDialog')
  }, [logout])

  const runSwitchNetwork = useCallback(() => {
    run(NETWORK_CHAIN_ID)
    globalDialogControl.hide('SwitchNetworkDialog')
  }, [run])

  return (
    <BaseDialog hiddenTitle close={false} minWidth={393} onClose={runDisconnect} disableBackClick>
      <Stack width={'100%'} maxWidth={393} overflow={'hidden'} alignItems={'center'} spacing={20}>
        <Typography variant={isSm ? 'h4' : 'h3'}>Switch Network</Typography>
        <Typography fontSize={{ xs: 13, sm: 15 }} color="var(--ps-neutral3)" width={'100%'} textAlign={'center'}>
          This app does not support the current connected network. Switch or disconnect to continue.
        </Typography>
        <Stack
          width={'100%'}
          direction={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          spacing={16}
          onClick={runSwitchNetwork}
          sx={{
            cursor: 'pointer',
            background: 'var(--ps-neutral2)',
            padding: 16,
            borderRadius: '12px',
            ':hover': {
              opacity: 0.8
            }
          }}
        >
          <Image src={CHAIN_LOGO[chainId || SupportedChainId.BB_MAINNET]} width={40} height={40} alt="chain logo" />
          <Typography fontSize={15} fontWeight={500}>
            BounceBit Mainnet
          </Typography>
        </Stack>
        <Typography fontSize={16} color={'var(--ps-neutral3)'}>
          OR
        </Typography>
        <Stack
          direction={'row'}
          spacing={16}
          width={'100%'}
          alignItems={'center'}
          justifyContent={'flex-start'}
          onClick={runDisconnect}
          sx={{
            cursor: 'pointer',
            padding: 16,
            background: 'var(--ps-neutral2)',
            borderRadius: '12px',
            ':hover': {
              opacity: 0.8
            }
          }}
        >
          <DisconnectIcon />
          <Typography fontSize={15} fontWeight={500}>
            Disconnect
          </Typography>
        </Stack>
      </Stack>
    </BaseDialog>
  )
}

export default SwitchNetworkDialog
