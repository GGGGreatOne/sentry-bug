import { Box, SxProps, Typography, useTheme } from '@mui/material'
import Leaderboard1 from 'assets/images/claimBox/Leaderboard1.jpeg'
import Leaderboard2 from 'assets/images/claimBox/Leaderboard2.jpeg'
import Leaderboard3 from 'assets/images/claimBox/Leaderboard3.jpeg'
import Leaderboard1Mobile from 'assets/images/claimBox/Leaderboard1-mobile.jpeg'
import Leaderboard2Mobile from 'assets/images/claimBox/Leaderboard2-mobile.jpeg'
import Leaderboard3Mobile from 'assets/images/claimBox/Leaderboard3-mobile.jpeg'
import useBreakpoint from 'hooks/useBreakpoint'
const BoxCard = ({ num, img, sx }: { num: string; img: string; sx: SxProps }) => {
  return (
    <Box
      pt={40}
      sx={{
        position: 'absolute',
        width: { xs: 248, md: 344 },
        height: { xs: 328, md: 424 },
        padding: { xs: 4, md: 12 },
        border: '1px solid var(--ps-text-20)',
        borderRadius: { xs: 24, md: 32 },
        ...sx
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          zIndex: 3,
          transform: { xs: 'translate(-50%, -50%)', md: 'translate(-50%, -50%)' }
        }}
      >
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            textAlign: 'center',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 36, md: 64 },
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '100%'
          }}
        >
          {num}
        </Typography>
      </Box>
      <Box
        sx={{
          width: { xs: 240, md: 320 },
          height: { xs: 320, md: 400 },
          // border: '4px solid var(--ps-text-20)',
          background: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), url(${img}) lightgray 50% / cover no-repeat`,
          filter: 'blur(4px)',
          borderRadius: { xs: 24, md: 32 }
        }}
      />
      <Box
        sx={{
          width: { xs: 'calc(100% - 24px)', md: 'calc(100% - 40px)' },
          position: 'absolute',
          padding: '12px 0px',
          borderRadius: '12px',
          background: 'var(--ps-text-primary-40)',
          left: { xs: '49%', md: '50%' },
          bottom: { xs: 12, md: 25 },
          transform: 'translateX(-49%)',
          textAlign: 'center',
          '& p': {
            textAlign: 'center',
            fontFamily: 'SF Pro Display',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%',
            '&.t1': {
              color: 'var(--ps-text-100)',
              fontSize: { xs: 13, md: 15 }
            },
            '&.t2': {
              color: 'var(--ps-text-100)',
              fontSize: { xs: 20, md: 28 },
              margin: '6px 0'
            },
            '&.t3': {
              color: 'var(--ps-text-80)',
              fontSize: { xs: 12, md: 13 }
            }
          }
        }}
      >
        <Typography className="t1">Bryan Wolf</Typography>
        <Typography className="t2">258,000.5 TVL</Typography>
        <Typography className="t3">125,908 followers</Typography>
      </Box>
    </Box>
  )
}
export default function Page() {
  const isSm = useBreakpoint('sm')
  const theme = useTheme()
  return (
    <Box>
      <Typography
        sx={{
          color: 'var(--ps-text-40)',
          textAlign: 'center',
          fontFamily: 'New York',
          fontSize: { xs: 50, md: 160 },
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '100%'
        }}
      >
        Club
        <br />
        Leaderboard
      </Typography>
      <Box
        sx={{
          width: { xs: '100%', md: 1132 },
          height: { xs: 1106, md: 653 },
          margin: '0 auto',
          position: 'relative',
          mt: { xs: 60, md: 0 }
        }}
      >
        <BoxCard
          img={isSm ? Leaderboard1Mobile.src : Leaderboard1.src}
          num={'02'}
          sx={{
            position: 'absolute',
            left: 60.47,
            top: 90.44,
            transform: 'rotate(-4.867deg)',
            transformOrigin: 'top',
            [theme.breakpoints.down('sm')]: {
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(-4.867deg)',
              transformOrigin: 'left'
            }
          }}
        />
        <BoxCard
          img={isSm ? Leaderboard2Mobile.src : Leaderboard2.src}
          num={'01'}
          sx={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', zIndex: 1 }}
        />
        <BoxCard
          img={isSm ? Leaderboard3Mobile.src : Leaderboard3.src}
          num={'03'}
          sx={{
            position: 'absolute',
            right: { xs: '50%', md: 60 },
            bottom: 0,
            transform: { xs: 'rotate(5.708deg) translateX(50%)', md: 'rotate(5.708deg)' },
            transformOrigin: 'right'
          }}
        />
      </Box>
    </Box>
  )
}
// sx={{ position: 'absolute', right: 60, bottom: 0, transform: 'rotate(5.708deg)', transformOrigin: 'right' }}
