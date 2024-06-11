import { Box, Stack, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import BBLogo from 'assets/images/claimBox/logo.png'
import { WithAnimation } from 'components/WithAnimation'
import Image from 'components/Image'

const CardItem = ({ time, winner, style }: { time: string; winner: string; style?: React.CSSProperties }) => {
  return (
    <Stack
      spacing={10}
      direction={'row'}
      sx={{
        pl: 10,
        height: '110px',
        borderRadius: '8.684px',
        border: `0.76px solid #7D7D7D`,
        background: `var(--ps-text-primary)`,
        boxShadow: `14.473px 21.709px 21.709px 0px rgba(0, 0, 0, 0.16)`,
        ...style
      }}
      alignItems={'center'}
    >
      <Image src={BBLogo.src} alt="logo" height={88} width={88} />
      <Stack
        sx={{
          padding: 10
        }}
        justifyContent={'center'}
        alignItems={'flex-start'}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 500,
            color: 'var(--ps-text-100)'
          }}
        >
          Club #33587966
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            color: `var(--ps-neutral3)`,
            lineHeight: '11px'
          }}
        >
          Lottery
        </Typography>
        <Stack
          sx={{
            width: '100%'
          }}
          direction={'row'}
          justifyContent={'flex-start'}
          mt={12}
          gap={8}
        >
          <Stack alignItems={'flex-start'} spacing={4}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: `var(--ps-neutral3)`,
                lineHeight: '11px',
                zoom: 0.6
              }}
            >
              Minted
            </Typography>
            <Typography
              variant="body1"
              noWrap
              sx={{
                fontSize: '12px',
                color: `var(--ps-text-100)`,
                lineHeight: '11px',
                zoom: 0.9
              }}
            >
              {time}
            </Typography>
          </Stack>
          <Stack alignItems={'flex-start'} spacing={4}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: `var(--ps-neutral3)`,
                lineHeight: '11px',
                zoom: 0.6
              }}
            >
              Winner
            </Typography>
            <Typography
              variant="body1"
              noWrap
              sx={{
                fontSize: '12px',
                color: `var(--ps-text-100)`,
                lineHeight: '11px',
                zoom: 0.9
              }}
            >
              {winner}
            </Typography>
          </Stack>
          <Stack alignItems={'flex-start'} spacing={4}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: `var(--ps-neutral3)`,
                lineHeight: '11px',
                zoom: 0.6
              }}
            >
              Participants
            </Typography>
            <Typography
              variant="body1"
              noWrap
              sx={{
                fontSize: '12px',
                color: `var(--ps-text-100)`,
                lineHeight: '11px',
                zoom: 0.9
              }}
            >
              1,258
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
const useWithAnimationStyles = makeStyles(() => ({
  awaitInView: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    transform: 'rotateZ(10deg)',
    transformOrigin: 'right bottom',
    transition: 'all 0.8s'
  },
  inView: {
    '&&': {
      position: 'absolute',
      bottom: 20,
      right: 0,
      transform: 'rotateZ(-5deg)',
      transformOrigin: 'right bottom'
    }
  }
}))
const Cards = () => {
  const styleTrans = useWithAnimationStyles()

  return (
    <Box
      sx={{
        position: 'relative',
        width: 430,
        height: 418,
        '@media (max-width: 1200px)': {
          height: 400
        }
      }}
    >
      <WithAnimation
        delay={0}
        defaultAnimation={false}
        className={styleTrans.awaitInView}
        addClassInView={styleTrans.inView}
      >
        <CardItem time="January 04, 2024" winner="David" />
      </WithAnimation>
      <CardItem
        time="March 23, 2024"
        winner="Henry"
        style={{
          position: 'absolute',
          bottom: 30,
          right: 10,
          transform: 'rotateZ(10deg)',
          transformOrigin: 'right bottom'
        }}
      />
      <CardItem
        time="July 25, 2024"
        winner="Tom"
        style={{
          position: 'absolute',
          bottom: 50,
          right: 20,
          transform: 'rotateZ(25deg)',
          transformOrigin: 'right bottom'
        }}
      />
    </Box>
  )
}
export default Cards
