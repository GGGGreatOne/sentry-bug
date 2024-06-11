import { Box, Stack, Typography, styled } from '@mui/material'
import Img1 from 'assets/images/home/ac2.png'
import CircleGreenSvg from 'assets/images/boxes/list/circle-green.svg'
import CertificationSvg from 'assets/svg/certification.svg'
import CertificationSmallSvg from 'assets/svg/certification-small.svg'
import useBreakpoint from 'hooks/useBreakpoint'
const Page = () => {
  const isSm = useBreakpoint('sm')
  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 12, sm: 16 },
        padding: 16,
        borderRadius: 12,
        background: 'var(--ps-neutral)',
        boxShadow: '2px 4px 12px 0px var(--ps-text-08)',
        cursor: 'pointer'
      }}
    >
      <Stack flexDirection={'row'} alignItems={'center'}>
        <Box
          sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, display: 'flex', alignItems: 'center' }}
          mr={16}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img style={{ width: '100%', height: '100%' }} src={Img1.src} />
        </Box>
        <Box sx={{ width: { xs: 'calc(100% - 76px)', sm: 'calc(100% - 96px)' } }}>
          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Box>
              <Stack
                flexDirection={'row'}
                alignItems={'center'}
                sx={{
                  svg: {
                    xs: { width: '12', height: '13', viewBox: '0 0 12 13' },
                    sx: { width: '17', height: '17', viewBox: '0 0 17 17' }
                  }
                }}
              >
                <Typography color={'primary'} sx={{ fontSize: { xs: 15, sm: 20 }, lineHeight: '130%' }} mr={8.16}>
                  Bounce Finance
                </Typography>
                {isSm ? <CertificationSmallSvg /> : <CertificationSvg />}
              </Stack>
              <Typography
                mt={4}
                sx={{ color: 'var(--ps-neutral4)', fontSize: { xs: 12, sm: 13 }, lineHeight: 1, fontWeight: 500 }}
              >
                Club ID #3578970 · 2k Followers
              </Typography>
            </Box>
            <ActionBox status="noFollowing" />
          </Stack>
          <Box mt={8}>
            <Typography
              sx={{
                fontSize: 12,
                color: 'var(--ps-neutral3)',
                lineHeight: '140%',
                display: '-webkit-box',
                '-webkit-line-clamp': { xs: '1', sm: '2' },
                '-webkit-box-orient': 'vertical',
                overflow: 'hidden'
              }}
            >
              Bounce Finance is a Bounce Finance is a Bounce Finance is a Bounce Finance is a Bounce Finance is a Bounce
              Finance Finance Finance Finance Finance Finance Finance Finance Finance Finance Finance Finance Finance
              Finance Finance Finance Finance ...
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Stack
        flexDirection={'row'}
        sx={{ padding: { xs: '8px', sm: '12.24px' }, borderRadius: 10.2, backgroundColor: 'var(--ps-text-primary)' }}
      >
        <StatusBox />
        <Typography sx={{ color: 'var(--ps-neutral3) ', fontSize: { xs: 12, sm: 13.26 }, lineHeight: 1.4 }} ml={12.24}>
          Token Fixed Price Auction
          <Typography component={'span'} sx={{ color: 'var(--ps-neutral5)', fontSize: { xs: 12, sm: 13.26 } }}>
            &nbsp; ‘Bounce Finance Christmas’
          </Typography>
        </Typography>
      </Stack>
    </Box>
  )
}

const StatusBox = () => {
  return (
    <Stack
      flexDirection={'row'}
      alignItems={'center'}
      sx={{ height: 'fit-content', borderRadius: 100, backgroundColor: 'var(--ps-neutral2)', padding: '3.06px 8.16px' }}
    >
      <CircleGreenSvg />
      <Typography sx={{ color: 'var(--ps-text-100)', fontSize: 12, lineHeight: 1.4 }} ml={6.12}>
        LIVE
      </Typography>
    </Stack>
  )
}

const ActionBoxStyle = styled(Box)(() => ({
  padding: '6px 16px',
  borderRadius: 100,

  fontFamily: 'SF Pro Display',
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '140%',
  boxShadow: '2px 4px 8px 0px var(--ps-text-08)',
  '&.following': {
    backgroundColor: 'var(--ps-neutral3)',
    color: 'var(--ps-neutral2)'
  },
  '&.no-following': {
    backgroundColor: 'var(--ps-text-100)',
    color: 'var(--ps-text-primary)'
  }
}))

const ActionBox = ({ status }: { status: string }) => {
  // TODO:add definite type
  const map: Record<string, any> = {
    following: { text: 'Following', classNames: 'following' },
    noFollowing: { text: 'Follow', classNames: 'no-following' }
  }
  const { text, classNames } = map[status]
  return <ActionBoxStyle className={classNames}>{text}</ActionBoxStyle>
}
export default Page
