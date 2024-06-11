import { Button, useTheme } from '@mui/material'
// import Spinner from 'components/Spinner'
import { Typography } from '@mui/material'
import { AlertCicle } from 'components/Widget/assets/svg'

export default function ActionButton({
  error,
  pending,
  success,
  onAction,
  actionText,
  pendingText,
  height,
  width,
  disableAction,
  successText,
  isBlackBg
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  onAction: (() => void) | undefined
  actionText: string
  pendingText?: string
  successText?: string
  height?: string
  width?: string
  disableAction?: boolean
  isBlackBg?: boolean
}) {
  const theme = useTheme()

  return (
    <>
      {error ? (
        <>
          <hr style={{ border: 'none', borderTop: isBlackBg ? '1px solid #ffffff20' : '1px solid #626262' }} />
          <Typography
            color={isBlackBg ? '#ffffff' : '#121212'}
            display={'flex'}
            alignItems={'center'}
            gap={10}
            mt={12}
            fontSize={12}
          >
            <AlertCicle style={{ stroke: isBlackBg ? '#ffffff' : '#121212' }} />
            {error}
          </Typography>
        </>
      ) : pending ? (
        <Button
          disabled
          sx={{ height, width, background: theme.palette.action.disabledBackground, color: '#BCBCBC' }}
          size="large"
        >
          {
            <>
              {/* <Spinner marginRight={16} /> */}
              {pendingText + '...' || 'Waiting Confirmation'}
            </>
          }
        </Button>
      ) : success ? (
        <Button disabled sx={{ height: height, width }} size="large">
          <Typography variant="inherit">{successText ?? actionText}</Typography>
        </Button>
      ) : (
        <Button
          size="large"
          sx={{
            height: height,
            width,
            background: isBlackBg ? '#ffffff' : '#121212',
            padding: '20px 60px',
            color: isBlackBg ? '#121212' : '#ffffff',
            fontWeight: 500,
            '&:hover': {
              background: isBlackBg ? '#ffffff' : '#121212',
              color: isBlackBg ? '#121212' : '#ffffff',
              opacity: 0.9
            },
            '&:disabled': {
              border: '1px solid transparent',
              borderColor: isBlackBg ? '#ffffff' : '#121212',
              background: 'transparent',
              color: isBlackBg ? '#ffffff' : '#121212',
              opacity: 0.6
            }
          }}
          onClick={onAction}
          disabled={disableAction}
        >
          {actionText}
        </Button>
      )}
    </>
  )
}
