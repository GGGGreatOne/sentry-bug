import { Box, Button, Stack, Typography, styled } from '@mui/material'
// import JoinSvg from 'assets/svg/activeties/join.svg'
// import NotjoinSvg from 'assets/svg/activeties/notjoin.svg'
import NoDataBoxSvg from 'assets/svg/noDataBox.svg'
import LeftArrowSvg from 'assets/svg/home/leftArrow.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { useEffect, useMemo, useState } from 'react'
import { FreeMode } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { BoxRewardList, RewardRecord } from '../../../api/lottery'
import EmptyData from 'components/EmptyData'

const StyledNoDataBoxSvg = styled(NoDataBoxSvg)(() => ({
  '& path': {
    stroke: 'var(--ps-text-20)'
  }
}))
//
// const StyledNotjoinSvg = styled(NotjoinSvg)(({ theme }) => ({
//   cursor: 'pointer',
//   '& path': {
//     fill: theme.palette.background.default
//   }
// }))

const StyledLeftArrowSvg = styled(LeftArrowSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    fill: theme.palette.text.primary,
    stroke: theme.palette.text.primary
  }
}))

const BoxItem = ({ item, handleClick, isMd }: { item: RewardRecord; handleClick?: () => void; isMd: boolean }) => {
  // const [hoverClaim, setHoverClain] = useState(false)
  return (
    <Box
      sx={{
        width: 184,
        height: 180,
        borderRadius: '12px',
        background: true
          ? 'var(--ps-neutral)'
          : 'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-neutral)',
        border: true ? 'none' : '1px solid var(--ps-text-100)',
        boxShadow: false ? 'none' : '2px 4px 16px 0px rgba(0, 0, 0, 0.16)',
        padding: '8px',
        cursor: 'pointer',
        boxSizing: 'border-box'
      }}
    >
      <Stack
        sx={{
          position: 'relative',
          width: 168,
          borderRadius: 10,
          padding: isMd ? '20px 8px 8px' : '24px 0',
          background: 'var(--ps-text-10)'
        }}
        justifyContent={'center'}
        alignItems={'center'}
        mb={12}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-text-100)',
            fontSize: 13
          }}
        >
          #{item.id}
        </Typography>
        {/*{!isMd && hoverClaim && (*/}
        {/*  <Button*/}
        {/*    variant="contained"*/}
        {/*    size="large"*/}
        {/*    disabled={false}*/}
        {/*    sx={{*/}
        {/*      width: 155,*/}
        {/*      height: 29,*/}
        {/*      marginTop: 8,*/}
        {/*      boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.08)'*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Claim*/}
        {/*  </Button>*/}
        {/*)}*/}
        {/*{!isMd && !hoverClaim && (*/}
        {/*  <Box*/}
        {/*    sx={{*/}
        {/*      position: 'absolute',*/}
        {/*      bottom: 8,*/}
        {/*      right: 8,*/}
        {/*      width: 24,*/}
        {/*      height: 24,*/}
        {/*      display: 'flex',*/}
        {/*      justifyContent: 'center',*/}
        {/*      alignItems: 'center',*/}
        {/*      background: 'var(--ps-text-40)',*/}
        {/*      borderRadius: '50%'*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {item.rewardAddress ? <StyledJoinSvg /> : <StyledNotjoinSvg />}*/}
        {/*  </Box>*/}
        {/*)}*/}
        {/*{isMd && (*/}
        {/*  <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} mt={20} gap={4}>*/}
        {/*    <Box*/}
        {/*      sx={{*/}
        {/*        width: 24,*/}
        {/*        height: 24,*/}
        {/*        display: 'flex',*/}
        {/*        justifyContent: 'center',*/}
        {/*        alignItems: 'center',*/}
        {/*        background: 'var(--ps-text-40)',*/}
        {/*        borderRadius: '50%'*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {false ? <StyledJoinSvg /> : <StyledNotjoinSvg />}*/}
        {/*    </Box>*/}
        {/*  </Stack>*/}
        {/*)}*/}
      </Stack>
      <Stack direction={'row'} justifyContent={'flex-start'} justifyItems={'center'} gap={6} mb={10}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-neutral3)',
            fontSize: 12
          }}
        >
          Born
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-text-100)',
            fontSize: 12
          }}
        >
          {item.createTime}
        </Typography>
      </Stack>
      <Stack direction={'row'} justifyContent={'flex-start'} justifyItems={'center'} gap={6} mb={10}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-neutral3)',
            fontSize: 12
          }}
        >
          Winner
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-text-100)',
            fontSize: 12
          }}
        >
          {item.rewardAddress
            ? `${item.rewardAddress.substring(
                0,
                item.rewardAddress.length > 6 ? 6 : item.rewardAddress.length
              )}...${item.rewardAddress.substring(
                item.rewardAddress.length > 6 ? item.rewardAddress.length - 6 : 0,
                item.rewardAddress.length
              )}`
            : ''}
        </Typography>
      </Stack>
      <Stack
        onClick={() => {
          handleClick && handleClick()
        }}
        direction={'row'}
        justifyContent={'flex-start'}
        justifyItems={'center'}
        gap={6}
        mb={10}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-neutral3)',
            fontSize: 12
          }}
        >
          Participants
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            color: 'var(--ps-text-100)',
            fontSize: 12
          }}
        >
          {item.participants}
        </Typography>
        {/*<StyledLeftArrowSvg*/}
        {/*  style={{*/}
        {/*    position: 'relative',*/}
        {/*    top: 3,*/}
        {/*    transform: 'rotate(180deg)',*/}
        {/*    zoom: 0.6*/}
        {/*  }}*/}
        {/*/>*/}
      </Stack>
    </Box>
  )
}
const BoxSwiper = ({ handleOpenItem, rewardList }: { rewardList: BoxRewardList; handleOpenItem?: () => void }) => {
  const boxList = rewardList.list
  const swiper = useSwiper()
  const [swiperInstance, setSwiperInstance] = useState(swiper)

  const isMd = useBreakpoint('md')
  const [windowWidth, setWindowWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    if (isMd) {
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
    }
    return () => {}
  }, [isMd])

  const slidesPerView = useMemo(() => {
    if (isMd && windowWidth) {
      return Number(((windowWidth - 40) / 184).toFixed(2))
    }
    return 5.3
  }, [isMd, windowWidth])
  return (
    <Stack
      sx={{
        width: '100%',
        display: 'flex'
      }}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={16}
    >
      {!isMd && (
        <Button
          disabled={swiperInstance?.destroyed || activeIndex === 0}
          sx={{
            background: 'var(--ps-text-10)',
            width: 60,
            height: 180
          }}
          onClick={() => {
            swiperInstance && swiperInstance?.slidePrev()
          }}
        >
          <StyledLeftArrowSvg />
        </Button>
      )}

      <Stack
        sx={{
          position: 'relative',
          flex: 1,
          height: 180,
          overflow: 'hidden'
        }}
      >
        {!isMd && activeIndex !== 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 115,
              height: 180,
              background: 'linear-gradient(270deg, rgba(13, 13, 13, 0.00) 0%, var(--ps-text-primary) 100%)',
              zIndex: 99
            }}
          ></Box>
        )}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          {boxList?.length ? (
            <Swiper
              onSwiper={setSwiperInstance}
              spaceBetween={16}
              slidesPerView={slidesPerView}
              modules={[FreeMode]}
              onSlideChange={(swiperCore: { activeIndex: any; snapIndex: any; previousIndex: any; realIndex: any }) => {
                const { realIndex } = swiperCore
                setActiveIndex(realIndex)
              }}
            >
              {boxList?.map((item, j: number) => {
                return (
                  <SwiperSlide key={'swiper' + j}>
                    <BoxItem
                      item={item}
                      isMd={isMd}
                      key={'swiperitem' + j}
                      handleClick={() => {
                        handleOpenItem && handleOpenItem()
                      }}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          ) : (
            <EmptyData gap={16} color="var(--ps-text-60)">
              <StyledNoDataBoxSvg />
            </EmptyData>
          )}
        </Box>
        {!isMd && activeIndex !== boxList?.length - Math.floor(slidesPerView) && (
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 115,
              height: 180,
              background: 'linear-gradient(90deg, rgba(13, 13, 13, 0.00) 0%, var(--ps-text-primary) 100%)',
              zIndex: 99
            }}
          ></Box>
        )}
      </Stack>
      {!isMd && (
        <Button
          disabled={swiperInstance?.destroyed || activeIndex === boxList?.length - Math.floor(slidesPerView)}
          sx={{
            background: 'var(--ps-text-10)',
            width: 60,
            height: 180
          }}
          onClick={() => {
            swiperInstance && swiperInstance?.slideNext()
          }}
        >
          <StyledLeftArrowSvg
            style={{
              transform: 'rotate(180deg)'
            }}
          />
        </Button>
      )}
    </Stack>
  )
}
export default BoxSwiper
