import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FreeMode } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import LeftArrow from 'assets/svg/home/leftArrow.svg'
import TagSvg from 'assets/svg/home/tag_icon.svg'
// import PatchCheckFll from 'assets/svg/home/patchCheckFll.svg'
import VerifyIcon from 'assets/svg/verifiedIconSm.svg'
import { Pagination } from './Banner'
import { useGetHotClubPlugin } from 'hooks/boxes/useGetClubPlugin'
import { HotClubPluginProps } from 'api/home/type'
import { useRouter } from 'next/router'
import CollectBtn from './CollectBtn'
import Image from 'components/Image'
import DefaultImage from 'assets/images/account/default_followings_item.png'

const StyledTagSvg = styled(TagSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: theme.palette.text.primary
  }
}))

// const StyledLogo = styled(LogoSvg)(({ theme }) => ({
//   cursor: 'pointer',
//   '& g': {
//     fill: theme.palette.background.default
//   }
// }))

const StyledLeftArrow = styled(LeftArrow)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: theme.palette.text.primary,
    fill: theme.palette.text.primary
  }
}))

export const ActivityItem = ({ item }: { item: HotClubPluginProps }) => {
  const isMd = useBreakpoint('md')
  const router = useRouter()
  const collectHanle = useCallback(() => {}, [])
  return (
    <Box
      sx={{
        width: isMd ? 240 : 288,
        borderRadius: 12,
        backgroundColor: 'var(--ps-neutral)',
        overflow: 'hidden',
        cursor: 'pointer',
        marginTop: 10,
        marginBottom: 10,
        transition: 'all 0.3s linear',
        position: 'relative',
        '&:hover': {
          '.bannerClass': {
            scale: '1.1',
            transition: 'all 0.3s linear'
          },
          scale: '1.02',
          background: 'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-neutral)'
        }
      }}
      onClick={() => {
        router.push({
          pathname: `/club/${item.boxId}`,
          query: { appId: item.pluginId }
        })
      }}
    >
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        gap={4}
        sx={{
          position: 'absolute',
          top: 14,
          left: 14,
          padding: '2px 8px',
          background: 'var(--ps-neutral5)',
          borderRadius: 90
        }}
      >
        <StyledTagSvg />
        <Typography variant="h6" fontWeight={400} lineHeight={'16.8px'} color={'#0D0D0D'}>
          {item.pluginName}
        </Typography>
      </Stack>
      <Box
        className="bannerClass"
        sx={{
          height: 160,
          // width: isMd ? 240 : 288,
          backgroundImage: `url(${item.bgImage || item.bgMobileImage || ''})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Stack
        sx={{
          padding: '16px 16px 20px'
        }}
        direction={'column'}
        justifyContent={'flex-start'}
        alignItems={'center'}
      >
        <Stack
          sx={{
            width: '100%'
          }}
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={10}
        >
          <Typography
            variant="h5"
            sx={{
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: isMd ? 13 : 15,
              color: 'var(--ps-text-100)'
            }}
          >
            {item.projectName || '--'}
          </Typography>
          <CollectBtn boxId={item.boxId} isCollect={item.collect} pluginId={item.pluginId} callback={collectHanle} />
        </Stack>
        <Stack
          sx={{
            width: '100%'
          }}
          direction={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <Box
            sx={{
              borderRadius: '50%',
              backgroundColor: 'var(--ps-text-100)',
              width: 24,
              height: 24,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            mr={8}
          >
            <Image
              altSrc={DefaultImage.src}
              src={item.avatar || DefaultImage.src}
              width={24}
              height={24}
              alt={''}
              style={{
                borderRadius: '50%'
              }}
            />
          </Box>
          <Typography
            noWrap
            variant="subtitle1"
            mr={4}
            sx={{
              fontSize: 12
            }}
          >
            {item.projectName || '--'}
          </Typography>
          {item.verified && <VerifyIcon width={17} />}
        </Stack>
      </Stack>
    </Box>
  )
}
export default function HotActivities({ whithoutAnimation = false }: { whithoutAnimation?: boolean }) {
  const { data: HotClubPluginList } = useGetHotClubPlugin({ pageNum: 1, pageSize: 10 })
  const swiper = useSwiper()
  const [swiperInstance, setSwiperInstance] = useState(swiper)
  const [activeIndex, setActiveIndex] = useState(0)
  const isMd = useBreakpoint('md')
  const [windowWidth, setWindowWidth] = useState(0)
  console.log('HotClubPluginList', HotClubPluginList)

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

  const slidesPerView = useMemo(() => {
    return Number(((windowWidth - 40) / 240).toFixed(2))
  }, [windowWidth])
  const slidesPcPerView = useMemo(() => {
    if (windowWidth < 1200) {
      return Number((windowWidth / 300).toFixed(2))
    }
    return 4
  }, [windowWidth])
  if (isMd) {
    return (
      <Stack
        alignItems={'center'}
        sx={{
          width: '100%',
          maxWidth: '100vw',
          marginBottom: 100
        }}
      >
        <WithAnimation
          Component={Stack}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{
            width: '100%',
            padding: '0 20px',
            margin: '0 auto 30px'
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
            Hot Activities
          </Typography>
          {/* <Button variant="contained">Explore more</Button> */}
        </WithAnimation>
        <WithAnimation
          Component={Box}
          sx={{
            position: 'relative',
            width: '100%',
            margin: '0 auto',
            paddingLeft: 20
          }}
        >
          <Swiper
            slidesPerView={slidesPerView}
            modules={[FreeMode]}
            onSlideChange={(swiperCore: { activeIndex: any; snapIndex: any; previousIndex: any; realIndex: any }) => {
              const { realIndex } = swiperCore
              setActiveIndex(realIndex)
            }}
          >
            {HotClubPluginList?.map((item: HotClubPluginProps, j: number) => {
              return (
                <SwiperSlide key={'swiper' + j} style={{ width: 240 }}>
                  <ActivityItem item={item} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </WithAnimation>
        <WithAnimation
          Component={Pagination}
          length={HotClubPluginList?.length}
          activeIndex={activeIndex}
          style={{
            marginTop: 30,
            marginBottom: 30
          }}
        />
      </Stack>
    )
  }
  if (whithoutAnimation) {
    return (
      <Box mt={200}>
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
            Hot Activities
          </Typography>
          {/* <Button variant="contained" size="large">
            Explore more
          </Button> */}
        </Stack>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto 200px'
          }}
        >
          <Swiper
            slidesPerView={slidesPcPerView}
            onSlideChange={() => console.log('slide change')}
            onSwiper={setSwiperInstance}
            style={{
              paddingLeft: '5px'
            }}
          >
            {HotClubPluginList?.map((item: HotClubPluginProps, i: number) => {
              return (
                <SwiperSlide key={'swiper' + i}>
                  <ActivityItem item={item} />
                </SwiperSlide>
              )
            })}
          </Swiper>
          {!!HotClubPluginList?.length && HotClubPluginList.length > 4 && (
            <>
              <Box
                sx={{
                  borderRadius: '50%',
                  background: 'var(--ps-text-primary-80)',
                  position: 'absolute',
                  left: -28,
                  top: '50%',
                  zIndex: 1,
                  width: 60,
                  height: 60,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transform: 'translateY(-50%)',
                  '&:hover': {
                    background:
                      'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-text-primary-80)'
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
                  borderRadius: '50%',
                  background: 'var(--ps-text-primary-80)',
                  position: 'absolute',
                  right: -18,
                  top: '50%',
                  zIndex: 1,
                  width: 60,
                  height: 60,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transform: 'translateY(-50%) rotateZ(180deg)',
                  '&:hover': {
                    background:
                      'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-text-primary-80)'
                  }
                }}
                onClick={() => {
                  swiperInstance && swiperInstance?.slideNext()
                }}
              >
                <StyledLeftArrow />
              </Box>
            </>
          )}
        </Box>
      </Box>
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
          Hot Activities
        </Typography>
        <Button variant="contained" size="large">
          Explore more
        </Button>
      </WithAnimation>
      <WithAnimation
        Component={Box}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 200px'
        }}
      >
        <Swiper
          slidesPerView={slidesPcPerView}
          onSlideChange={() => console.log('slide change')}
          onSwiper={setSwiperInstance}
        >
          {HotClubPluginList?.map((item: HotClubPluginProps, i: number) => {
            return (
              <SwiperSlide key={'swiper' + i}>
                <ActivityItem item={item} />
              </SwiperSlide>
            )
          })}
        </Swiper>
        <Box
          sx={{
            borderRadius: '50%',
            background: 'var(--ps-text-primary-80)',
            position: 'absolute',
            left: -28,
            top: '50%',
            zIndex: 1,
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transform: 'translateY(-50%)',
            '&:hover': {
              background:
                'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-text-primary-80)'
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
            borderRadius: '50%',
            background: 'var(--ps-text-primary-80)',
            position: 'absolute',
            right: -18,
            top: '50%',
            zIndex: 1,
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transform: 'translateY(-50%) rotateZ(180deg)',
            '&:hover': {
              background:
                'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-text-primary-80)'
            }
          }}
          onClick={() => {
            swiperInstance && swiperInstance?.slideNext()
          }}
        >
          <StyledLeftArrow />
        </Box>
      </WithAnimation>
    </>
  )
}
