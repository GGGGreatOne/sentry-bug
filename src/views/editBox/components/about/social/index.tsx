import { Box } from '@mui/material'
import { IBoxAboutSectionTypeSocialContentValue } from 'state/boxes/type'
import { XEmbed } from 'react-social-media-embed'
import useBreakpoint from 'hooks/useBreakpoint'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Pagination } from 'views/home/components/Banner'
import { useEffect, useMemo, useRef, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
const Socal = ({ data }: { data: IBoxAboutSectionTypeSocialContentValue }) => {
  const isMd = useBreakpoint('md')
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperRef>(null)
  const handleSlideChange = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index)
    }
  }
  const [windowWidth, setWindowWidth] = useState(0)
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
    return Number(((windowWidth - 72) / 280).toFixed(2))
  }, [windowWidth])
  return (
    <>
      {isMd ? (
        <Box
          sx={{
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            '& .swiper-button-prev, & .swiper-button-next': {
              display: 'none'
            }
          }}
        >
          {windowWidth && (
            <Swiper
              ref={swiperRef}
              slidesPerView={slidesPerView}
              navigation
              onSlideChange={(swiperCore: { activeIndex: any; snapIndex: any; previousIndex: any; realIndex: any }) => {
                const { realIndex } = swiperCore
                setActiveIndex(realIndex)
              }}
            >
              {data?.socialItem.map((item, index) => {
                const match = item.url.match(/\/status\/(\d+)\??/)
                if (!match) return
                const tweetId = match[1]
                return (
                  <SwiperSlide key={'swiper' + index}>
                    <XEmbed
                      width={260}
                      url={item.url}
                      twitterTweetEmbedProps={{ tweetId: tweetId, options: { theme: 'dark' } }}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
          <Pagination
            style={{ marginBottom: 0 }}
            length={data.socialItem.length}
            activeIndex={activeIndex}
            handleClick={handleSlideChange}
          />
          <ChevronLeftIcon
            sx={{ position: 'absolute', bottom: -9, left: 0 }}
            onClick={() => {
              if (activeIndex !== 0) handleSlideChange(activeIndex - 1)
            }}
          />
          <ChevronRightIcon
            sx={{ position: 'absolute', bottom: -9, right: 0 }}
            onClick={() => {
              if (activeIndex !== data.socialItem.length) handleSlideChange(activeIndex + 1)
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gridGap: 10
          }}
        >
          {data.socialItem.map((item, index) => {
            const match = item.url.match(/\/status\/(\d+)\??/)
            if (!match) return
            const tweetId = match[1]
            return (
              <Box key={item.url + index}>
                <XEmbed
                  width={260}
                  url={item.url}
                  twitterTweetEmbedProps={{ tweetId: tweetId, options: { theme: 'dark' } }}
                />
              </Box>
            )
          })}
        </Box>
      )}
    </>
  )
}

export default Socal
