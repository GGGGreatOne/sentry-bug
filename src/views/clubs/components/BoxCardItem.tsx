/* eslint-disable @next/next/no-img-element */
import { Box, Stack, Typography, styled } from '@mui/material'
import { BoxListItem } from 'api/boxes/type'
import handImg from 'assets/images/boxes/Hand.png'
import lineBgImg from 'assets/images/boxes/outer.png'
import Image from 'components/Image'
import { GlobalCoordsParam } from 'pages/clubs/index'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import DefaultCover from 'assets/images/boxes/default_cover.png'
import DefaultImage from 'assets/images/account/default_followings_item.png'
import { shortenAddress } from 'utils'
import { formatGroupNumber } from 'utils'
import SmVerifiedIcon from 'assets/svg/verifiedIconSm.svg'
import BigNumber from 'bignumber.js'

const AvatarBox = styled(Box)`
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 100%;
`

const BoxCardItem = ({
  globalCoords,
  item,
  isFocus,
  handleClick
}: {
  globalCoords: GlobalCoordsParam
  item: BoxListItem
  isFocus: boolean
  handleClick: () => void
}) => {
  const { ref, inView } = useInView({})
  const { x, y } = globalCoords
  const refItem = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const maxRotateX = 50
  const maxRotateY = 10
  const [isHover, setIsHover] = useState(false)
  const [itemRotateXY, setItemRotateXY] = useState<GlobalCoordsParam>({ x: 0, y: 0 })
  //   console.log('x, y >>>', x, y)
  useEffect(() => {
    if (!refItem?.current) return
    setWidth(refItem?.current.offsetWidth)
    setHeight(refItem?.current.offsetHeight)
  }, [])
  useEffect(() => {
    if (!refItem?.current || !inView) return
    const itemOriginX = refItem?.current.getBoundingClientRect().left + width / 2
    const itemOriginY = refItem?.current.getBoundingClientRect().top - 70 + height / 2
    // console.log('itemX, itemY >>>', x, y, itemOriginX, itemOriginY)
    setItemRotateXY({
      x:
        itemOriginX > x
          ? -((itemOriginX - x) / window.innerWidth) * 2 * maxRotateX
          : ((x - itemOriginX) / window.innerWidth) * 2 * maxRotateX,
      y:
        itemOriginY > y
          ? ((itemOriginY - y) / window.innerHeight) * 2 * maxRotateY
          : -(((y - itemOriginY) / window.innerHeight) * 2) * maxRotateY
    })
    return () => {}
  }, [x, y, width, height, inView])
  return (
    <Box
      ref={refItem}
      sx={{
        position: 'relative',
        width: '20vw',
        height: '100%',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center',
        transform: `rotateY(${itemRotateXY.x}deg) rotateX(${itemRotateXY.y}deg) translateZ(-20px)`,
        transition: 'all 0.2s',
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
      {isFocus && (
        <Box sx={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10 }}>
          <Image
            alt=""
            src={lineBgImg.src}
            style={{
              // objectFit:"cover",
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      )}
      <Box
        ref={ref}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10 }}>
          {item.bgImage || item.bgMobileImage ? (
            <Image
              alt=""
              src={item.bgMobileImage || item.bgImage || DefaultCover.src}
              onError={(e: any) => {
                e.target.onerror = null
                e.target.src = DefaultCover.src
              }}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
            />
          ) : (
            <Image
              alt=""
              src={DefaultCover.src}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
            />
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
              sx={{
                fontSize: 30,
                textShadow: ' 2px 2px 4px rgba(0, 0, 0, 0.5)',
                maxWidth: '200px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
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
                width: 'max-content',
                padding: '3px 8px',
                borderRadius: '75.74px',
                background: 'rgba(13, 13, 13, 0.40)',
                backdropFilter: `blur(3.7869999408721924px)`
              }}
              gap={6}
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
                  fontSize: 11
                }}
              >
                ${`${formatGroupNumber(item.tvl ? new BigNumber(item.tvl).toNumber() : 0, '', 2)} TVL`}
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
                <Image
                  alt=""
                  altSrc={DefaultImage.src}
                  src={item.avatar || DefaultImage.src}
                  width={30}
                  height={30}
                  onError={(e: any) => {
                    e.target.onerror = null
                    e.target.src = DefaultImage.src
                  }}
                />
                {item?.verified && (
                  <SmVerifiedIcon width={17} style={{ position: 'absolute', bottom: 'calc(50% - 17px)', left: 30 }} />
                )}
              </AvatarBox>

              <Stack direction={'column'} justifyContent={'center'} alignItems={'flex-start'}>
                <Typography
                  sx={{
                    fontSize: 11
                  }}
                >
                  {shortenAddress(item.ownerAddress)}
                </Typography>
                <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={3}>
                  <Typography
                    sx={{
                      fontSize: 9,
                      color: `rgba(255, 255, 255, 0.60)`
                    }}
                  >
                    #{item.rewardId}
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
            opacity: 0.3
          }}
        ></Box>
      )}
    </Box>
  )
}
export default BoxCardItem
