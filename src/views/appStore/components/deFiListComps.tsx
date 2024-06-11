import { Box, Stack, Typography, useTheme } from '@mui/material'
import React, { useMemo } from 'react'

import useBreakpoint from 'hooks/useBreakpoint'
import { IBoxTypes } from 'api/boxes/type'
import { WithAnimation } from 'components/WithAnimation'
import Image from 'components/Image'
import { HoverBox } from './pluginCard'

export const GrayLine = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: '100%',
        height: '1px',
        background: 'var(--ps-text-20)',
        [theme.breakpoints.down('sm')]: {
          width: 'calc(100vw - 40px)'
        }
      }}
    />
  )
}
export const DeFiListLayout = ({
  title,
  showLine,
  children
}: {
  title: string
  showLine?: boolean
  children: React.ReactNode
}) => {
  const theme = useTheme()
  return (
    <Box mt={32}>
      <Typography
        sx={{
          color: 'var(--ps-text-100)',
          leadingTrim: 'both',
          textEdge: 'cap',
          fontFamily: 'SF Pro Display',
          fontSize: { xs: 20, md: 28 },
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '140%',
          [theme.breakpoints.down('sm')]: {
            width: 'calc(100vw - 40px)'
          }
        }}
      >
        {title}
      </Typography>
      <Box
        mt={32}
        sx={{
          overflow: 'hidden',
          [theme.breakpoints.down('sm')]: {
            overflowX: 'scroll',
            overflowY: 'hidden'
          },
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none'
        }}
      >
        {children}
      </Box>
      {(showLine ?? true) && (
        <Box sx={{ pr: { xs: 20 }, mt: { xs: 32, md: 64 } }}>
          <GrayLine />
        </Box>
      )}
    </Box>
  )
}

export const DeFiListItem = ({
  imgSrc,
  title,
  subTitle,
  boxStatus,
  click
}: {
  imgSrc: string
  title: string
  subTitle: string
  boxStatus: IBoxTypes
  click?: () => void
}) => {
  const isSm = useBreakpoint('sm')
  const theme = useTheme()
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
    <WithAnimation
      Component={HoverBox}
      onClick={() => click?.()}
      isNoHover={boxStatus === IBoxTypes.ComingSoom}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        width: '100%',
        borderRadius: 16,
        background: '#171717',
        gap: 16,
        alignItems: 'center',
        height: 140,
        [theme.breakpoints.down('sm')]: {
          flex: 'none',
          width: 'calc(100% - 64px)'
        }
      }}
      px={20}
    >
      <Image src={imgSrc} style={{ width: isSm ? 64 : 80, height: isSm ? 64 : 80, borderRadius: 13.617 }} alt="" />
      <Box
        sx={{
          width: '100%',
          maxWidth: 288,
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            minWidth: 171
          }
        }}
      >
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
            WebkitLineClamp: 3
          }}
        >
          {subTitle}
        </Typography>
      </Box>
      {!isSm && (
        <Box
          sx={{
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
      )}
    </WithAnimation>
  )
}
export const DeFiListGamesItem = ({
  logoSrc,
  bannerSrc,
  title,
  subTitle,
  boxStatus,
  click
}: {
  logoSrc: string
  bannerSrc: string
  title: string
  subTitle: string
  boxStatus: IBoxTypes
  click?: () => void
}) => {
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
    <WithAnimation
      onClick={() => click?.()}
      Component={HoverBox}
      isNoHover={boxStatus === IBoxTypes.ComingSoom}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        width: '100%',
        borderRadius: 16,
        background: '#171717',
        gap: isSm ? 32 : 40,
        alignItems: 'center',
        height: 269,
        [theme.breakpoints.down('sm')]: {
          flex: 'none',
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
          <Image src={logoSrc} style={{ width: isSm ? 64 : 96, height: isSm ? 64 : 96, borderRadius: 16.34 }} alt="" />
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
      <Image
        src={bannerSrc}
        style={{ width: '100%', maxWidth: 460, height: isSm ? 173 : '100%', borderRadius: '16px' }}
        alt=""
      />
    </WithAnimation>
  )
}
