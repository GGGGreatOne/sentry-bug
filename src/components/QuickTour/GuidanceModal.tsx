import { Box, Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { viewControl } from '../../views/editBox/modal'
import TourBg from 'assets/images/boxes/tourBg.png'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
export default function GuidanceModal({
  setIsOpen,
  handleSkip
}: {
  setIsOpen: (e: boolean) => void
  handleSkip?: (e: boolean) => void
}) {
  const isMd = useBreakpoint('md')
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
      <Stack>
        <Image src={TourBg.src} alt="png" width={isMd ? 'calc(100vw - 42px)' : 562} />
        <Box padding={isMd ? '40px 20px' : '64px 40px'}>
          <Typography
            variant={isMd ? 'h4' : 'h3'}
            sx={{
              fontWeight: 500,
              lineHeight: isMd ? '28px' : '39.2px'
            }}
          >
            {'WELCOME TO YOUR CLUB!'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginTop: isMd ? 24 : 40,
              fontWeight: 400,
              lineHeight: '22.4px'
            }}
          >
            {`Ready for some fun? Let's start with a tour on customizing your own club.`}
          </Typography>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-start'} marginTop={64}>
            <Button
              variant="contained"
              onClick={() => {
                viewControl.hide('GuidanceModal')
                setIsOpen(true)
              }}
              sx={{
                fontSize: isMd ? 13 : 15,
                width: isMd ? 110 : 138,
                height: isMd ? 36 : 44,
                padding: isMd ? '8px 16px' : '12px 24px',
                color: '#FFFFFF',
                background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)'
              }}
            >
              QUICK TOUR
            </Button>
            <Box
              onClick={() => {
                handleSkip && handleSkip(false)
                viewControl.hide('GuidanceModal')
              }}
              sx={{
                fontSize: 13,
                lineHeight: 1,
                color: '#4E6EF3',
                cursor: 'pointer',
                marginLeft: 30
              }}
            >
              Skip the tour
            </Box>
          </Stack>
        </Box>
      </Stack>
    </BaseDialog>
  )
}
