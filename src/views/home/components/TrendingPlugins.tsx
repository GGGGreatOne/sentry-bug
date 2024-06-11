import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import RealStar from '../../../assets/svg/home/realStar.svg'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { useGetPluginList } from 'state/pluginListConfig/hooks'
import { GetPluginListItem, IBoxTypes } from 'api/boxes/type'
import { useEffect, useMemo, useState } from 'react'
import LeftArrow from 'assets/svg/home/leftArrow.svg'

import 'swiper/css'

import _ from 'lodash'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
const StyledRealStar = styled(RealStar)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: theme.palette.text.primary,
    fill: theme.palette.text.primary
  }
}))

const StyleActivityItems = styled(Box)(({ theme }) => ({
  width: '100%',
  gap: '16px',
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
}))

const ActivityCart = ({ item }: { item: GetPluginListItem }) => {
  return (
    <StyleActivityItems key={item.id}>
      <Link href={ROUTES.appStore.pluginDetail(item.id)} style={{ width: '100%', flex: 1 }}>
        <Stack
          sx={{
            height: 114,
            borderRadius: 12,
            backgroundColor: 'var(--ps-neutral)',
            overflow: 'hidden',
            cursor: 'pointer',
            padding: '16px',
            boxSizing: 'border-box',
            '&:hover': {
              background: 'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-neutral)'
            }
          }}
          direction={'row'}
        >
          <Image
            src={item.icon}
            width={80}
            height={80}
            alt={''}
            style={{
              borderRadius: 12,
              marginRight: 16
            }}
          />
          <Stack
            sx={{
              flex: 1,
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
            direction={'column'}
            justifyContent={'center'}
            alignItems={'flex-start'}
          >
            <Typography
              variant="h5"
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                color: 'var(--ps-text-100)'
              }}
              mb={8}
            >
              {item.pluginName || '--'}
            </Typography>
            <Stack
              sx={{
                width: '100%'
              }}
              direction={'row'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              mb={8}
              spacing={4}
            >
              <Typography variant="h6" mr={4} color={'var(--ps-text-100)'}>
                5
              </Typography>
              <StyledRealStar />
              <Typography
                variant="h6"
                sx={{
                  color: 'var(--ps-neutral3)'
                }}
                mr={4}
              >
                {`(${item.used || 0})`}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'var(--ps-text-100)'
                }}
                mr={4}
              >
                {'•'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'var(--ps-text-100)'
                }}
                mr={4}
              >
                {item.free ? 'Free' : ''}
              </Typography>
            </Stack>
            <Typography
              noWrap
              variant="h6"
              sx={{
                width: '100%',
                maxWidth: 260,
                color: 'var(--ps-neutral3)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
            >
              {item.description || '--'}
            </Typography>
          </Stack>
        </Stack>
      </Link>
    </StyleActivityItems>
  )
}

const ActivityCartItem = ({ chunkItem }: { chunkItem: GetPluginListItem[] }) => {
  return (
    <Stack gap={8}>
      {chunkItem.map(item => (
        <ActivityCart key={item.id + Math.random()} item={item} />
      ))}
    </Stack>
  )
}

const ActivityItem = ({ item, total }: { item: GetPluginListItem[]; total?: number }) => {
  const isMd = useBreakpoint('md')
  const swiper = useSwiper()
  const [swiperInstance, setSwiperInstance] = useState(swiper)
  const chunkList: GetPluginListItem[][] = _.chunk(item, 2)

  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize)
      setWindowWidth(window.innerWidth)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return () => {}
  }, [isMd])

  const slidesPcPerView = useMemo(() => {
    if (windowWidth < 1200) {
      return Number((windowWidth / 400).toFixed(2))
    }
    return 3
  }, [windowWidth])

  if (isMd) {
    return (
      <Stack gap={8}>
        {item.map(item => (
          <ActivityCart item={item} key={item.id + Math.random()} />
        ))}
      </Stack>
    )
  }
  return (
    <Box position={'relative'}>
      {!!windowWidth && (
        <Swiper slidesPerView={slidesPcPerView} onSwiper={setSwiperInstance}>
          {chunkList.map((item, index: number) => (
            <SwiperSlide key={'swiper' + index + Math.random()}>
              <ActivityCartItem chunkItem={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <Box
        sx={{
          display: total ? (total > 0 ? 'flex' : 'none') : 'flex',
          borderRadius: '50%',
          background: 'var(--ps-text-primary-80)',
          position: 'absolute',
          left: -28,
          top: '50%',
          zIndex: 1,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transform: 'translateY(-50%)',
          '&:hover': {
            background: 'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-text-primary-80)'
          }
        }}
        onClick={() => {
          swiperInstance && swiperInstance?.slidePrev()
        }}
      >
        <StyledLeftArrow />
      </Box>
      <Box
        sx={{
          display: total ? (total > 0 ? 'flex' : 'none') : 'flex',
          borderRadius: '50%',
          background: 'var(--ps-text-primary-80)',
          position: 'absolute',
          right: -18,
          top: '50%',
          zIndex: 1,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transform: 'translateY(-50%) rotateZ(180deg)',
          '&:hover': {
            background: 'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-text-primary-80)'
          }
        }}
        onClick={() => {
          swiperInstance && swiperInstance?.slideNext()
        }}
      >
        <StyledLeftArrow />
      </Box>
    </Box>
  )
}
export default function TrendingPlugins({ whithoutAnimation = false }: { whithoutAnimation?: boolean }) {
  const router = useRouter()
  const { data: pluginList } = useGetPluginList({ boxes: '0' })
  const dataList = useMemo(() => pluginList?.list.filter(i => i.status === IBoxTypes.Normal), [pluginList?.list])

  const isMd = useBreakpoint('md')

  if (isMd) {
    return (
      <>
        <WithAnimation
          Component={Stack}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{
            width: '100%',
            margin: '0 auto 30px',
            padding: '0 20px'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              fontSize: 20,
              color: 'var(--ps-text-100)'
            }}
          >
            Trending Apps
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              router.push(ROUTES.appStore.index)
            }}
          >
            Explore more
          </Button>
        </WithAnimation>
        <WithAnimation
          Component={Box}
          sx={{
            position: 'relative',
            width: 'calc(100% - 40px)',
            margin: '0 auto 0',
            boxSizing: 'border-box'
          }}
        >
          {dataList && <ActivityItem item={dataList} total={dataList.length} />}
        </WithAnimation>
      </>
    )
  }
  if (whithoutAnimation) {
    return (
      <>
        <Stack
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto 37px'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              color: 'var(--ps-text-100)'
            }}
          >
            Trending Apps
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              router.push(ROUTES.appStore.index)
            }}
          >
            Explore more
          </Button>
        </Stack>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto 0'
          }}
        >
          {dataList && <ActivityItem item={dataList} total={dataList.length} />}
        </Box>
      </>
    )
  }
  return (
    <>
      <WithAnimation
        Component={Stack}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 37px'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-text-100)'
          }}
        >
          Trending Apps
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            router.push(ROUTES.appStore.index)
          }}
        >
          Explore more
        </Button>
      </WithAnimation>
      <WithAnimation
        Component={Box}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 0'
        }}
      >
        {dataList && <ActivityItem item={dataList} total={dataList.length} />}
      </WithAnimation>
    </>
  )
}

const StyledLeftArrow = styled(LeftArrow)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: theme.palette.text.primary,
    fill: theme.palette.text.primary
  }
}))
