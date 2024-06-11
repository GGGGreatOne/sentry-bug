/* eslint-disable @next/next/no-img-element */
import { Box, Stack, Typography, Dialog } from '@mui/material'
import handImg from 'assets/images/boxes/Hand.png'
// import Image from 'next/image'
import { useState } from 'react'
import 'swiper/swiper-bundle.css'
import { BoxListItem } from 'api/boxes/type'
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
          {(item.bgImage || item.bgMobileImage) && (
            <img alt="" src={item.bgMobileImage || item.bgImage || ''} width={'100%'} height={'100%'} />
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
            <Typography
              variant="h1"
              sx={{
                fontSize: 30
              }}
              mb={10}
            >
              {item.projectName}
            </Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              sx={{
                padding: '3px',
                borderRadius: '75.74px',
                background: 'rgba(13, 13, 13, 0.40)',
                backdropFilter: `blur(3.7869999408721924px)`
              }}
              gap={8}
            >
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
                  item.subTitle
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 11
                }}
              >
                {item.tvl}
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
                background: `rgba(13, 13, 13, 0.40))`,
                backdropFilter: `blur(3.7869999408721924px)`
              }}
              direction={'row'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              gap={9}
            >
              <img alt="" src={item.avatar} width={30} height={30} />
              <Stack direction={'column'} justifyContent={'center'} alignItems={'flex-start'}>
                <Typography
                  sx={{
                    fontSize: 11
                  }}
                >
                  item.username
                </Typography>
                <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={3}>
                  <Typography
                    sx={{
                      fontSize: 9,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    {item.boxId}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 9,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    •
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 9,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    {item.followCount}
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
const SearchSwiper = ({ data }: { data: BoxListItem }) => {
  return (
    <Dialog open={true}>
      <BoxCardItem handleClick={() => {}} isFocus={false} item={data} />
    </Dialog>
  )
}
export default SearchSwiper
