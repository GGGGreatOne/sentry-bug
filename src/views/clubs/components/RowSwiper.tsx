/* eslint-disable @next/next/no-img-element */
import { Box, Stack, Typography, styled } from '@mui/material'
import handImg from 'assets/images/boxes/Hand.png'
import { useCallback, useEffect, useState } from 'react'
import { FreeMode } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { BoxListItem } from 'api/boxes/type'
import { formatGroupNumber, shortenAddress } from 'utils'
import DefaultCover from 'assets/images/boxes/default_cover.png'
import { ROUTES } from 'constants/routes'
import Image from 'components/Image'
import { useRouter } from 'next/router'
import FollowButton from './FollowButton'
import VerifiedIcon from 'assets/svg/verifyIcon.svg'
import BigNumber from 'bignumber.js'
import DefaultImage from 'assets/images/account/default_followings_item.png'
const AvatarBox = styled(Box)`
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 100%;
`
const BoxCardItem = ({
  item,
  isFocus,
  handleClick
}: {
  item: BoxListItem
  isFocus: boolean
  handleClick: () => void
}) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 175px)',
        maxHeight: 600,
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: `url(${handImg.src}), pointer`
      }}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {item.bgImage || item.bgMobileImage ? (
            <Image
              alt=""
              src={item.bgMobileImage || item.bgImage || ''}
              onError={(e: any) => {
                e.target.onerror = null
                e.target.src = DefaultCover.src
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'var(--ps-neutral2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                alt=""
                src={DefaultCover.src}
                width={400}
                height={400}
                style={{
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}
        </Box>
        {(isFocus || isHover) && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
              padding: 12
            }}
          >
            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: 56,
                  fontWeight: 500,
                  lineHeight: '140%',
                  textShadow: ' 2px 2px 4px rgba(0, 0, 0, 0.5)',
                  maxWidth: '400px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}
                mb={10}
              >
                {item.projectName}
              </Typography>
              {item.isFollower !== undefined && (
                <Box mt={15} sx={{}}>
                  <FollowButton hasShadow={true} isFollower={item.isFollower} boxId={item.boxId} callBack={() => {}} />
                </Box>
              )}
            </Stack>

            <Stack
              direction={'row'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              sx={{
                width: 'fit-content',
                padding: '8px',
                borderRadius: '75.74px',
                background: 'rgba(13, 13, 13, 0.40)',
                backdropFilter: `blur(3.7869999408721924px)`
              }}
              gap={8}
            >
              {!!item.rank && (
                <Box
                  sx={{
                    borderRadius: `75.74px`,
                    background: `#282828`,
                    padding: '4px 8px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 9
                    }}
                  >
                    Rank{item.rank}
                  </Typography>
                </Box>
              )}
              <Typography
                sx={{
                  fontSize: 11,
                  marginLeft: 0
                }}
              >
                {`${formatGroupNumber(item.tvl ? new BigNumber(item.tvl).toNumber() : 0, '', 2)} TVL`}
              </Typography>
            </Stack>
            <Stack
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                padding: 9,
                borderRadius: `6.059px`,
                background: `var(--ps-text-primary-40)`,
                backdropFilter: `blur(3.7869999408721924px)`
              }}
              direction={'row'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              gap={9}
            >
              <AvatarBox>
                {item.avatar ? (
                  <Image
                    alt=""
                    onError={(e: any) => {
                      e.target.onerror = null
                      e.target.src = DefaultImage.src
                    }}
                    src={item.avatar}
                    width={60}
                    height={60}
                  />
                ) : (
                  <Image alt="" src={DefaultImage.src} width={60} height={60} />
                )}
                {item?.verified && (
                  <VerifiedIcon width={24} style={{ position: 'absolute', bottom: 'calc(50% - 30px)', left: 50 }} />
                )}
              </AvatarBox>
              <Stack direction={'column'} justifyContent={'center'} alignItems={'flex-start'}>
                <Typography
                  sx={{
                    fontSize: 20
                  }}
                >
                  {shortenAddress(item.ownerAddress)}
                </Typography>
                <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={3}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    #{item.rewardId}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    •
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    {item.followCount} Followers
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>
      {!isFocus && !isHover && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#0D0D0D',
            opacity: 0.8
          }}
        ></Box>
      )}
    </Box>
  )
}
const RowSwiper = ({
  data,
  initialSlide,
  style,
  handleSlide
}: {
  data: BoxListItem[]
  initialSlide: number
  style?: React.CSSProperties
  handleSlide?: (index: number) => void
}) => {
  const [activeIndex, setActiveIndex] = useState(1)
  const [slidesPerView, setSlidesPerView] = useState(3)
  const [swiperEl, setSwiperEl] = useState<any>(null)
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setSlidesPerView(w / 600)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data])
  useEffect(() => {
    if (swiperEl && initialSlide !== activeIndex && data.length) {
      swiperEl && swiperEl?.slideTo(initialSlide, 1000)
    }
    return () => {}
  }, [initialSlide, activeIndex, swiperEl, data.length])

  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )
  return (
    <Swiper
      key={'rowSwiper'}
      loop={false}
      initialSlide={initialSlide}
      centeredSlides={true}
      centeredSlidesBounds={true}
      slidesPerView={slidesPerView}
      modules={[FreeMode]}
      onSwiper={swiper => setSwiperEl(swiper)}
      onSlideChange={swiperCore => {
        const { activeIndex } = swiperCore
        setActiveIndex(activeIndex)
        handleSlide && handleSlide(activeIndex)
      }}
      spaceBetween={60}
      style={{
        width: '100%',
        ...style
      }}
    >
      {data.map((item, index) => {
        return (
          <SwiperSlide key={'rowSwiper' + index}>
            <Stack
              sx={{
                width: '600px'
                // height: 'calc(100vh - 75px - 100px)'
              }}
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <BoxCardItem
                handleClick={() => {
                  // todo link to boxes detail
                  swiperEl && swiperEl?.slideTo(index)
                  routeTo(item.boxId)
                }}
                key={'rowSwiperCol' + index}
                isFocus={activeIndex === index}
                item={item}
              />
            </Stack>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
export default RowSwiper
