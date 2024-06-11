import { Alert, Stack, styled, Typography } from '@mui/material'
import DefaultAlertSvg from '../../../assets/svg/detault-alert.svg'
import Image from 'components/Image'
import RedErrorIcon from '../../../assets/imgs/error.png'
import GrayErrorIcon from '@mui/icons-material/Error'
export const Tip = styled(Typography)`
  color: #908e96;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

export const WeightP = styled('span')`
  color: #171717;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

export const DefaultAlert = () => {
  return (
    <Stack
      flexDirection={'row'}
      alignItems={'center'}
      sx={{
        width: '100%',
        padding: '16px',
        gap: 16,
        borderRadius: 8,
        background: 'var(--yellow-light, #F9FCDE)',
        'span,p': { fontSize: { xs: 14 } }
      }}
    >
      <DefaultAlertSvg />
      <Tip sx={{ width: { xs: 'calc(100% - 20px)', md: '100%' } }}>
        <WeightP>Please pay attention.</WeightP> Check the auction creator, token contract and price. Bounce auction is
        a decentralized tool where anyone can launch.
      </Tip>
    </Stack>
  )
}

export const WhitelistAlert = () => {
  return (
    <Stack
      flexDirection={'row'}
      alignItems={'center'}
      sx={{
        width: '100%',
        padding: '16px',
        gap: 16,
        borderRadius: 8,
        background: 'var(--yellow-light, #F9FCDE)',
        'span,p': { fontSize: { xs: 14 } }
      }}
    >
      <Image
        src={RedErrorIcon.src}
        style={{
          width: 20,
          marginRight: 8
        }}
        alt=""
        srcSet=""
      />
      <Typography
        sx={{
          fontFamily: `'Sharp Grotesk DB Cyr Book 20'`,
          fontWeight: 500,
          fontSize: 14,
          color: '#908E96'
        }}
      >
        <span
          style={{
            color: '#FF0000'
          }}
        >
          You are not eligible.
        </span>{' '}
        You are not whitelisted for this auction.
      </Typography>
    </Stack>
  )
}

export const CloseAlert = () => {
  return (
    <Alert
      icon={<GrayErrorIcon sx={{ color: '#171717' }} />}
      sx={{ borderRadius: 20, bgcolor: '#F5F5F5', span: { fontSize: { xs: 14 } } }}
    >
      <Typography variant="body1" component="span">
        Auction closed.&nbsp;
      </Typography>
      <Typography variant="body1" component="span" sx={{ color: '#908E96' }}>
        This auction is finished, please browse other auction pools.
      </Typography>
    </Alert>
  )
}
