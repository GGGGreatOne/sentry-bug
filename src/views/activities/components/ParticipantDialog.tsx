import { Box, Stack, styled } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import CloseSvg from 'assets/svg/activeties/close.svg'
import UserSvg from 'assets/svg/activeties/user.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { shortenAddress } from 'utils'

const StyledCloseSvg = styled(CloseSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& g': {
    stroke: theme.palette.background.paper
  }
}))

export interface SimpleDialogProps {
  open: boolean
  onClose: () => void
}
interface ListItamParam {
  headIcon: any
  address: string
  date: string
}
function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props
  const listData: ListItamParam[] = [
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    },
    {
      headIcon: <UserSvg />,
      address: '0x7B922BC0C27Fd119F67eC53828C8F7FF20a7c708',
      date: '2023-5-11 18:49:14'
    }
  ]
  const handleClose = () => {
    onClose()
  }
  const isMd = useBreakpoint('md')
  return (
    <Dialog
      fullScreen={isMd}
      onClose={handleClose}
      open={open}
      sx={{
        padding: isMd ? '16px' : '',
        '.MuiPaper-root': {
          borderRadius: 24,
          overflow: 'hidden'
        }
      }}
    >
      <Stack
        sx={{
          position: 'relative',
          width: isMd ? '100%' : 576,
          height: isMd ? '100%' : '60vh',
          minHeight: 400,
          paddingTop: 76,
          background: 'var(--ps-neutral)',
          borderRadius: 24,
          overflow: 'hidden'
        }}
        direction={'column'}
        justifyContent={'flex-start'}
        alignItems={'center'}
      >
        <Stack
          sx={{
            position: 'absolute',
            top: 24,
            right: 16,
            width: 36,
            height: 36,
            background: 'var(--ps-neutral3)',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={handleClose}
        >
          <StyledCloseSvg />
        </Stack>
        <Typography
          variant="h3"
          sx={{
            color: 'var(--ps-text-100)',
            fontSize: isMd ? 20 : 28
          }}
          mb={24}
        >
          Participants for Club #33587966
        </Typography>
        <Box
          sx={{
            width: '100%',
            flex: 1,
            overflowY: 'auto',
            padding: isMd ? '6px 16px 6px' : '6px 48px 30px',
            '::-webkit-scrollbar': {
              width: 10,
              height: 10
            }
          }}
        >
          {listData.map((item: ListItamParam, index: number) => {
            return (
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                key={'row' + index}
                sx={{
                  width: '100%',
                  padding: isMd ? '16px 0' : '24px 0',
                  borderBottom: `1px solid var(--ps-text-10)`
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: 12,
                    color: 'var(--ps-text-100)'
                  }}
                >
                  {index + 1}
                </Typography>
                <Stack direction={'row'} alignItems={'center'} gap={8}>
                  {item.headIcon}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: 12,
                      color: 'var(--ps-text-100)'
                    }}
                  >
                    {shortenAddress(item.address)}
                  </Typography>
                </Stack>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: 12,
                    color: 'var(--ps-text-100)'
                  }}
                >
                  {item.date}
                </Typography>
              </Stack>
            )
          })}
        </Box>
      </Stack>
    </Dialog>
  )
}
export default SimpleDialog
