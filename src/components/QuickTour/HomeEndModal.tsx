import { Box, Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { viewControl } from '../../views/editBox/modal'
import useBreakpoint from 'hooks/useBreakpoint'
import { useWalletModalToggle } from 'state/application/hooks'
import { useUserInfo } from 'state/user/hooks'
export default function HomeEndModal() {
  const isMd = useBreakpoint('md')
  const WalletModalToggle = useWalletModalToggle()
  const userInfo = useUserInfo()
  return (
    <BaseDialog
      sx={{
        zIndex: '1298 !important',
        '& .MuiDialogContent-root': {
          width: isMd ? 'calc(100vw - 42px)' : 562,
          marginTop: 0
        },
        '& .MuiDialog-paper': {
          padding: 0,
          minWidth: isMd ? 'calc(100vw - 40px)' : 562
        },
        '& .MuiModal-backdrop': {
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(0px)'
        }
      }}
      disableBackClick
      hiddenTitle={true}
      close={false}
    >
      <Box
        sx={{
          background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)',
          padding: 2,
          borderRadius: 16
        }}
      >
        <Box
          sx={{
            background: 'var(--ps-neutral)',
            padding: isMd ? '40px 20px' : '64px 40px',
            borderRadius: 16
          }}
        >
          <Typography
            variant={isMd ? 'h3' : 'h4'}
            sx={{
              fontWeight: 500,
              lineHeight: '140%'
            }}
          >
            {'Begin your exploration of BounceBit now'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginTop: isMd ? 24 : 40,
              fontWeight: 400,
              lineHeight: '22.4px'
            }}
          >
            {`Ready to experience BounceClub? Connect your wallet to sign in!`}
          </Typography>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-start'} marginTop={64}>
            <Button
              variant="contained"
              onClick={() => {
                viewControl.hide('HomeEndModal')
                userInfo.user === null && WalletModalToggle()
              }}
              sx={{
                fontSize: isMd ? 13 : 15,
                width: isMd ? 116 : 145,
                height: isMd ? 36 : 44,
                padding: isMd ? '8px 16px' : '12px 24px',
                color: '#FFFFFF',
                background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)'
              }}
            >
              {userInfo.user === null ? 'Sign in' : 'Start'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </BaseDialog>
  )
}
