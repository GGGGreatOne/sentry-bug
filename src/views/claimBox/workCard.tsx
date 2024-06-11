import { Box, Stack, SxProps, Typography } from '@mui/material'

import FontBG from 'assets/images/claimBox/font-bg.png'

import useBreakpoint from 'hooks/useBreakpoint'
import { ReactNode, useCallback, useEffect, useState } from 'react'
const Card = ({
  number,
  title,
  subTitle,
  sx
}: {
  number: number
  title: string
  subTitle: ReactNode
  sx?: SxProps
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: { md: 450, xs: 320 },
        maxWidth: 450,
        // height: { md: 298, xs: 257 },
        // transform: 'rotate(-5.632deg)',
        padding: { md: '24px 24px 48px', xs: '24px' },
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: '24px',
        border: '1px solid var(--ps-text-20)',
        background: 'var(--ps-text-primary-10, rgba(13, 13, 13, 0.10))',
        backdropFilter: 'blur(5px)',
        ...sx
      }}
    >
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          width: 40,
          height: 40,
          padding: 8,
          borderRadius: 100,
          border: '1px solid var(--ps-text-100)'
        }}
      >
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: 'SF Pro Display',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 1
          }}
        >
          {number}
        </Typography>
      </Stack>
      <Typography
        sx={{
          color: 'var(--ps-text-100)',
          fontFamily: 'IBM Plex Sans',
          fontSize: { md: 28, xs: 20 },
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '140%',
          marginTop: 20
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: 'var(--ps-text-100)',
          fontFamily: 'SF Pro Display',
          fontSize: { md: 20, xs: 15 },
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '130%',
          marginTop: { md: 40, xs: 20 }
        }}
      >
        {subTitle}
      </Typography>
    </Box>
  )
}
export default function Page() {
  const isSm = useBreakpoint('sm')
  const [zoom, setZoom] = useState(1)
  const handleZoom = useCallback(() => {
    if (!isSm) {
      const w = window.innerWidth
      w <= 1440 && setZoom(w / 1440)
    } else {
      setZoom(1)
    }
  }, [isSm])
  useEffect(() => {
    handleZoom()
    window.addEventListener('resize', handleZoom)
    return () => {
      window.removeEventListener('resize', handleZoom)
    }
  }, [handleZoom])
  if (isSm) {
    return (
      <Box
        mt={193}
        sx={{
          width: '100%',
          position: 'relative',
          height: 641,
          zoom: zoom
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            color: 'var(--ps-text-10)',
            textAlign: 'center',
            fontFamily: 'New York',
            fontSize: '120px',
            fontStyle: 'normal',
            fontWeight: '496',
            lineHeight: '100%'
          }}
        >
          How it works?
        </Box>

        <Box sx={{ width: '100%', maxWidth: 1440, height: '100%', margin: '0 auto', position: 'relative' }}>
          <Card
            sx={{
              position: 'absolute',
              left: -11.5,
              top: 0,
              transform: 'rotate(-6deg)',
              transformOrigin: 'left',
              zIndex: 1
            }}
            number={1}
            title={'Check your eligibility.'}
            subTitle={`Connect your wallet to check if you’re eligible to claim a BounceClub and/or receive $BB airdrop.`}
          />
          <Card
            sx={{
              position: 'absolute',
              right: -11.5,
              bottom: '50%',
              transform: 'translateY(55%) rotate(11.575deg)',
              transformOrigin: 'left',
              zIndex: 2
            }}
            number={2}
            title={'Claim a BounceClub and receive $BB airdrop if eligible'}
            subTitle={
              <>
                {`1) If your connected address qualifies for owning a BounceClub, click "Claim"; if not, click “Get Club” to join our daily raffle for a chance to win a BounceClub.`}
                <br></br>
                {`2) If your connected address participated in the BounceClub Testnet event and is eligible for $BB airdrop, you will automatically receive the displayed amount of $BB.`}
              </>
            }
          />
          <Card
            sx={{
              position: 'absolute',
              left: -5.88,
              bottom: -50,
              transform: 'rotate(-6.32deg)',
              zIndex: 1,
              transformOrigin: 'center'
            }}
            number={3}
            title={'Start setting up your club!'}
            subTitle={`Let the fun begin and customize your own club! `}
          />
        </Box>
      </Box>
    )
  }
  return (
    <Box
      mt={120}
      sx={{
        width: '100%',
        position: 'relative',
        height: 534,
        zoom: zoom
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '193.2px',
          left: 0,
          width: '100%',
          height: '255.85px',
          background: `url(${FontBG.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      />
      <Box sx={{ width: '100%', maxWidth: 1440, height: '100%', margin: '0 auto', position: 'relative' }}>
        <Card
          sx={{
            position: 'absolute',
            left: 54,
            top: 10,
            transform: 'rotate(-6deg) translateZ(0)',
            transformOrigin: 'right',
            zIndex: 1
          }}
          number={1}
          title={'Check your eligibility.'}
          subTitle={`Connect your wallet to check if you’re eligible to claim a BounceClub and/or receive $BB airdrop.`}
        />
        <Card
          sx={{
            position: 'absolute',
            left: '50%',
            top: 208.3,
            transform: 'translateX(-47%) rotate(-6.32deg) translateZ(0)',
            transformOrigin: 'left',
            zIndex: 2
          }}
          number={2}
          title={'Claim a BounceClub and receive $BB airdrop if eligible'}
          subTitle={
            <>
              {`1) If your connected address qualifies for owning a BounceClub, click "Claim"; if not, click “Get Club” to join our daily raffle for a chance to win a BounceClub.`}
              <br></br>
              {`2) If your connected address participated in the BounceClub Testnet event and is eligible for $BB airdrop, you will automatically receive the displayed amount of $BB.`}
            </>
          }
        />
        <Card
          sx={{
            position: 'absolute',
            right: 58,
            top: 81,
            transform: 'rotate(11.575deg) translateZ(0)',
            zIndex: 3,
            transformOrigin: 'left'
          }}
          number={3}
          title={'Start setting up your club!'}
          subTitle={`Let the fun begin and customize your own club!`}
        />
      </Box>
    </Box>
  )
}
