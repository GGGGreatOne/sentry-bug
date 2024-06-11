import { Box, Stack, Typography, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import { IBoxTypes } from 'api/boxes/type'
// import { WithAnimation } from 'components/WithAnimation'
import { useRouter } from 'next/router'

export const GameItem = ({
  logoSrc,
  bannerSrc,
  title,
  subTitle,
  boxStatus,
  maxW,
  link
}: {
  logoSrc: string
  bannerSrc: string
  title: string
  subTitle: string
  boxStatus: IBoxTypes
  maxW?: boolean
  link?: string
}) => {
  const router = useRouter()
  const theme = useTheme()
  const isSm = useBreakpoint('sm')
  const statusBoxInfo = useMemo(() => {
    if (boxStatus === IBoxTypes.Normal) {
      return {
        text: 'Available',
        bgColor: 'var(--ps-green2)',
        textColor: '#016A12'
      }
    }
    if (boxStatus === IBoxTypes.ComingSoom) {
      return {
        text: 'Coming Soon',
        bgColor: '#D1EEFA',
        textColor: 'var(--ps-blue)'
      }
    }
    return {}
  }, [boxStatus])
  return (
    <Box
      onClick={() => {
        console.log('link', link)

        link && router.push(link)
      }}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        width: '100%',
        borderRadius: 16,
        background: '#171717',
        gap: isSm ? 32 : 40,
        alignItems: 'center',
        height: 269,
        cursor: !!link ? 'pointer' : '',
        marginTop: '20px',
        [theme.breakpoints.down('sm')]: {
          flex: 'none',
          width: maxW ? '100%' : 'calc(100% - 64px)',
          display: 'flex',
          flexDirection: 'column',
          height: 'auto'
        }
      }}
    >
      <Stack
        flexDirection={'row'}
        sx={{
          pl: 32,
          gap: isSm ? 32 : 40,
          [theme.breakpoints.down('sm')]: {
            padding: '20px 20px 0px',
            gap: 16
          }
        }}
      >
        <Box>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
          <img src={logoSrc} style={{ width: isSm ? 64 : 96, height: isSm ? 64 : 96, borderRadius: 16.34 }} alt="" />
        </Box>
        <Box sx={{ width: isSm ? 'calc(100vw - 200px)' : '100%', maxWidth: 532 }}>
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: 'SF Pro Display',
              fontSize: { xs: 20, md: 28 },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '140%'
            }}
          >
            {title}
          </Typography>
          <Typography
            mt={10}
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: 'SF Pro Display',
              fontSize: { xs: 12, md: 15 },
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              WebkitLineClamp: 4,
              wordWrap: 'break-word'
            }}
          >
            {subTitle}
          </Typography>
          <Box
            mt={16}
            sx={{
              width: 'fit-content',
              padding: '2px 8px',
              borderRadius: 90.752,
              backgroundColor: statusBoxInfo.bgColor,
              color: statusBoxInfo.textColor,
              fontFamily: 'SF Pro Display',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%',
              textTransform: 'capitalize'
            }}
          >
            {statusBoxInfo.text}
          </Box>
        </Box>
      </Stack>
      {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
      <img src={bannerSrc} style={{ width: '100%', maxWidth: 460, height: isSm ? 173 : '100%' }} alt="" />
    </Box>
  )
}
