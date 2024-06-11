import { Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { ROUTES } from 'constants/routes'
import { useRouter } from 'next/router'
import WarningIcon from 'assets/svg/statusIcon/warning_icon.svg'
import { viewControl } from '../modal'
import { useWalletModalToggle } from 'state/application/hooks'
import { useActiveWeb3React } from 'hooks'

export default function IntermediatePageModal({ id }: { id?: string }) {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()

  return (
    <BaseDialog
      sx={{
        zIndex: '1298 !important'
      }}
      title="Reminder"
      close={false}
      disableEscapeKeyDown
      disableBackClick
    >
      <Stack spacing={16}>
        <Stack
          sx={{
            '& svg': {
              margin: '0 auto'
            }
          }}
        >
          <WarningIcon />
        </Stack>
        <Typography width="100%" px={40} textAlign={'center'} fontSize={16}>
          The current page is restricted. Please connect your wallet to access this page.
        </Typography>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={20}>
          <Button
            variant="outlined"
            onClick={() => {
              setTimeout(() => {
                viewControl.hide('IntermediatePageModal')
              }, 200)
              router.back()
            }}
            sx={{
              width: 160,
              height: 44,
              padding: '12px 24px'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!account) {
                WalletModalToggle()
                return
              }
              viewControl.hide('IntermediatePageModal')
              router.replace(ROUTES.claimClub + (id ? `?a=${id}#jump` : `#jump`))
            }}
            sx={{
              width: 160,
              height: 44,
              padding: '12px 24px',
              backgroundColor: 'var(--ps-text-100)'
            }}
          >
            {account ? 'Go To Check' : 'Connect Wallet'}
          </Button>
        </Stack>
      </Stack>
    </BaseDialog>
  )
}
