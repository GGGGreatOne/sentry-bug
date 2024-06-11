import { Box, Button, Typography } from '@mui/material'
// import ClaimBG2 from 'assets/images/claimBox/claim-bg-2.png'
// import ClaimBGMobile2 from 'assets/images/claimBox/claim-bg-2-mobile.png'
// import ClaimBG3 from 'assets/images/claimBox/claim-bg-3.png'
// import ClaimBGMobile3 from 'assets/images/claimBox/claim-bg-3-mobile.png'
import LotusPc1 from 'assets/images/claimBox/lotus-pc-1.png'
import LotusPc2 from 'assets/images/claimBox/lotus-pc-2.png'
import LotusMobile1 from 'assets/images/claimBox/lotus-mobile-1.png'
import LotusMobile2 from 'assets/images/claimBox/lotus-mobile-2.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { WithAnimation } from 'components/WithAnimation'
export default function Page() {
  const isSm = useBreakpoint('sm')

  return (
    <Box sx={{ width: '100%', marginTop: isSm ? 205 : 160 }}>
      <Box sx={{ width: '100%', maxWidth: 1440, height: isSm ? 451 : 713.6, margin: '0 auto', position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1440,
            height: isSm ? 220.6 : 400,
            position: 'absolute',
            left: 0,
            top: 0,
            'mix-blend-mode': 'color-dodge'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `url(${isSm ? LotusMobile1.src : LotusPc1.src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom'
            }}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1440,
            height: isSm ? 137.1 : 282,
            position: 'absolute',
            left: 0,
            bottom: isSm ? 93 : 31,
            'mix-blend-mode': ' color-dodge'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `url(${isSm ? LotusMobile2.src : LotusPc2.src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'top'
            }}
          />
        </Box>

        <Box
          sx={{
            width: isSm ? '100%' : 'fit-content',
            position: 'absolute',
            left: '50%',
            top: isSm ? -94 : 20,
            transform: 'translateX(-50%)',
            textAlign: 'center',
            px: isSm ? 20 : 0
          }}
        >
          <WithAnimation>
            <Typography
              sx={{
                color: 'var(--ps-neutral5)',
                textAlign: 'center',
                fontFamily: 'New York',
                fontSize: { xs: 32, md: 48 },
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '110%'
              }}
            >
              BB Airdrop Also Available <br />
              to BounceBit TVL Contributors!
            </Typography>
          </WithAnimation>
          <WithAnimation>
            <Typography
              sx={{
                color: 'var(--ps-neutral3)',
                whiteSpace: isSm ? 'pre-wrap' : 'wrap',
                margin: isSm ? '24px 0' : '40px 0',
                '&,& a': {
                  fontFamily: 'IBM Plex Sans',
                  fontSize: { xs: 16, md: 20 },
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '130%'
                },
                '& a': {
                  color: 'var(--ps-text-100)'
                }
              }}
            >
              {` If you’ve deposited on BounceBit’s Water Margin (Points Paradise) Event and earned BounceBit points, confirm your eligible $BB airdrop at `}
              <a href="https://portal.bouncebit.io/" target="_blank" rel="noreferrer">
                https://portal.bouncebit.io
              </a>
            </Typography>
          </WithAnimation>
          <WithAnimation>
            <Button
              sx={{
                width: isSm ? 117 : 206,
                height: isSm ? 36 : 44,
                padding: isSm ? '8px 16px' : '12px 24px',
                borderRadius: 100,
                fontSize: isSm ? 13 : 15,
                background: 'var(--ps-text-100)'
              }}
              onClick={() => window.open('https://portal.bouncebit.io/', '_blank')}
              variant="contained"
            >
              Check now
            </Button>
          </WithAnimation>
        </Box>
      </Box>
    </Box>
  )
}
