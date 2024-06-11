import { Box, Stack, Typography, styled } from '@mui/material'
// import LikeSvg from 'assets/svg/home/like.svg'
import BannerLogo from 'assets/images/home/banner_logo.png'
// import XLogo from 'assets/images/home/logo.png'
// import CoinSvg from 'assets/svg/home/coin.svg'
// import CoinSmSvg from 'assets/svg/home/coin_sm.svg'
// import EyeSvg from 'assets/svg/home/eye.svg'
import FollowSvg from 'assets/svg/home/follow.svg'
// import DollarSvg from 'assets/svg/home/dollar.svg'
import PlugBitleverageSvg from 'assets/svg/home/plug_bitleverage.svg'
import PlugBitleverageSmSvg from 'assets/svg/home/plug_bitleverage_sm.svg'
import PlugBitstableSvg from 'assets/svg/home/plug_bitstable.svg'
import PlugBitstableSmSvg from 'assets/svg/home/plug_bitstable_sm.svg'
import PlugBitstakingSvg from 'assets/svg/home/plug_bitstaking.svg'
import PlugBitstakingSmSvg from 'assets/svg/home/plug_bitstaking_sm.svg'
import PlugBitswapSvg from 'assets/svg/home/plug_bitswap.svg'
import PlugBitswapSmSvg from 'assets/svg/home/plug_bitswap_sm.svg'
// import LogoSvg from 'assets/svg/home/roomlogo.svg'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import { useMemo, useState } from 'react'
import { IPluginNameType } from 'state/boxes/type'
import 'swiper/css'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import LeftArrow from '../../../assets/svg/home/leftArrow.svg'
import { RecommendedClubListResponse } from 'api/home/type'
import Router from 'next/router'
import { ROUTES } from 'constants/routes'
import { getAppPluginId } from 'constants/index'
import { ReactNode } from 'react-markdown'

const StyledPlugBitswapSvg = styled(PlugBitswapSvg)`
  display: flex;
  align-items: center;
  & path {
    stroke: var(--ps-neutral2);
  }
`
const StyledPlugBitstakingSvg = styled(PlugBitstakingSvg)`
  display: flex;
  align-items: center;
  & path {
    stroke: var(--ps-neutral2);
  }
`

const StyledPlugBitleverageSvg = styled(PlugBitleverageSvg)`
  display: flex;
  align-items: center;
  & path {
    fill: var(--ps-neutral2);
    stroke: var(--ps-neutral2);
  }
`

const StyledPlugBitstableSvg = styled(PlugBitstableSvg)`
  display: flex;
  align-items: center;
  & path {
    fill: var(--ps-neutral2);
  }
`

const StyledPlugBitswapSmSvg = styled(PlugBitswapSmSvg)`
  display: flex;
  align-items: center;
  & path {
    fill: var(--ps-neutral2);
  }
`
const StyledPlugBitstakingSmSvg = styled(PlugBitstakingSmSvg)`
  display: flex;
  align-items: center;
  & path {
    fill: var(--ps-neutral2);
  }
`

const StyledPlugBitleverageSmSvg = styled(PlugBitleverageSmSvg)`
  display: flex;
  align-items: center;
  & path {
    fill: var(--ps-neutral2);
    stroke: var(--ps-neutral2);
  }
`

const StyledPlugBitstableSmSvg = styled(PlugBitstableSmSvg)`
  display: flex;
  align-items: center;
  & path {
    fill: var(--ps-neutral2);
  }
`

type PluginSvgInfo = {
  icon: ReactNode
  smIcon: ReactNode
  name: IPluginNameType | 'Krav' | 'Bitstable'
}

export type PlugsSvgsType = {
  [key in IPluginNameType]: PluginSvgInfo
}

export const PlugsSvgs: PlugsSvgsType = {
  [IPluginNameType.PicWe]: {
    icon: <StyledPlugBitswapSvg />,
    smIcon: <StyledPlugBitswapSmSvg />,
    name: IPluginNameType.PicWe
  },
  [IPluginNameType.USDX]: {
    icon: <StyledPlugBitswapSvg />,
    smIcon: <StyledPlugBitswapSmSvg />,
    name: IPluginNameType.USDX
  },
  [IPluginNameType.AllDeFi]: {
    icon: <StyledPlugBitswapSvg />,
    smIcon: <StyledPlugBitswapSmSvg />,
    name: IPluginNameType.AllDeFi
  },
  [IPluginNameType.MailZero]: {
    icon: <StyledPlugBitswapSvg />,
    smIcon: <StyledPlugBitswapSmSvg />,
    name: IPluginNameType.MailZero
  },
  [IPluginNameType.Auction]: {
    icon: <StyledPlugBitswapSvg />,
    smIcon: <StyledPlugBitswapSmSvg />,
    name: IPluginNameType.Auction
  },
  [IPluginNameType.Bitswap]: {
    icon: <StyledPlugBitswapSvg />,
    smIcon: <StyledPlugBitswapSmSvg />,
    name: IPluginNameType.Bitswap
  },
  [IPluginNameType.Bitstaking]: {
    icon: <StyledPlugBitstakingSvg />,
    smIcon: <StyledPlugBitstakingSmSvg />,
    name: IPluginNameType.Bitstaking
  },
  [IPluginNameType.Bitleverage]: {
    icon: <StyledPlugBitleverageSvg />,
    smIcon: <StyledPlugBitleverageSmSvg />,
    name: 'Krav'
  },
  [IPluginNameType.Bitstable]: {
    icon: <StyledPlugBitstableSvg />,
    smIcon: <StyledPlugBitstableSmSvg />,
    name: 'Bitstable'
  },
  [IPluginNameType.FiveInARow]: {
    icon: undefined,
    smIcon: undefined,
    name: IPluginNameType.FiveInARow
  },
  [IPluginNameType.ShisenSho]: {
    icon: undefined,
    smIcon: undefined,
    name: IPluginNameType.ShisenSho
  },
  [IPluginNameType.JigsawPuzzle]: {
    icon: undefined,
    smIcon: undefined,
    name: IPluginNameType.JigsawPuzzle
  },
  [IPluginNameType.BoxStack]: {
    icon: undefined,
    smIcon: undefined,
    name: IPluginNameType.BoxStack
  },
  [IPluginNameType.FallingBlocks]: {
    icon: undefined,
    smIcon: undefined,
    name: IPluginNameType.FallingBlocks
  }
}

// const StyledLogo = styled(LogoSvg)`
//   cursor: pointer;
//   & g {
//     fill: ${({ theme }) => theme.palette.text.primary};
//   }
// `

const StyledFollowSvg = styled(FollowSvg)`
  cursor: pointer;
  & path {
    fill: ${({ theme }) => theme.palette.text.primary};
  }
`
// const StyledDollarSvg = styled(DollarSvg)`
//   cursor: pointer;
//   & path {
//     fill: ${({ theme }) => theme.palette.text.primary};
//   }
// `
// const StyledCoinSmSvg = styled(CoinSmSvg)`
//   cursor: pointer;
//   & path {
//     fill: ${({ theme }) => theme.palette.text.primary};
//   }
// `

// const StyledLike = styled(LikeSvg)(({ theme }) => ({
//   cursor: 'pointer',
//   '& path': {
//     fill: theme.palette.text.primary,
//     stroke: theme.palette.text.primary
//   }
// }))

const BannerBottomBox = styled(Box)`
  display: flex;
  padding: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  background: var(--ps-text-80);
  backdrop-filter: blur(5px);
  border-radius: 12px;

  ${props => props.theme.breakpoints.down('md')} {
    gap: 8px;
  }
`

const BannerBottomBoxItemBox = styled(Box)`
  display: flex;
  padding: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 8px;
  background: var(--ps-text-primary-10);

  &:hover {
    background: linear-gradient(0deg, var(--ps-text-primary-10) 0%, var(--ps-text-primary-10) 100%),
      var(--ps-text-primary-10);
  }

  ${props => props.theme.breakpoints.down('md')} {
    padding: 12px;
    flex: 1 1 48%;
    flex-direction: row;
    gap: 8px;
  }
`

const BannerTopBorder = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  overflow: hidden;
`

const BannerTop = ({ item }: { item: RecommendedClubListResponse | undefined }) => {
  const isMd = useBreakpoint('md')
  return (
    <Box
      sx={{
        display: 'flex',
        width: isMd ? '100%' : 'fit-content',
        padding: isMd ? 8 : '8px 24px 8px 8px',
        alignItems: 'center',
        gap: 14,
        borderRadius: isMd ? 12 : 100,
        background: 'var(--ps-text-primary-40)'
      }}
    >
      <BannerTopBorder
        sx={{
          background: `url(${item?.avatar || BannerLogo.src}) no-repeat`,
          backgroundSize: '100% 100%'
        }}
      />
      <Stack gap={4}>
        <Typography
          fontSize={isMd ? '15px' : '20px'}
          color={'var(--ps-text-100)'}
          lineHeight={isMd ? '19.5px' : '26px'}
          maxWidth={{ xs: '220px', md: 'auto' }}
          noWrap
        >
          {item?.projectName || 'Bounce Project Club'}
        </Typography>
        <Stack direction={'row'} columnGap={16} rowGap={4} flexWrap={'wrap'}>
          <Typography fontSize={'12px'} color={'var(--ps-text-40)'} lineHeight={'16.8px'}>
            Club ID # {item?.rewardId || '--'}
          </Typography>
          <Stack direction={'row'} alignItems={'center'} gap={4}>
            <StyledFollowSvg />
            <Typography fontSize={'12px'} color={'var(--ps-text-40)'} lineHeight={'16.8px'}>
              {item?.followCount?.toLocaleString() || 0} followers
            </Typography>
          </Stack>
          {!isMd && (
            <Stack direction={'row'} alignItems={'center'} gap={4}>
              {/* <StyledDollarSvg /> */}
              <Typography fontSize={'12px'} color={'var(--ps-text-40)'} lineHeight={'12px'}>
                {item?.tvl?.toLocaleString() || 0} TVL
              </Typography>
            </Stack>
          )}
        </Stack>
        {isMd && (
          <Stack direction={'row'} alignItems={'center'} gap={4}>
            {/* <StyledDollarSvg /> */}
            <Typography fontSize={'12px'} color={'var(--ps-text-40)'} lineHeight={'12px'}>
              {item?.tvl?.toLocaleString() || 0} TVL
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

const BannerBottom = ({ item }: { item: RecommendedClubListResponse | undefined }) => {
  const isMd = useBreakpoint('md')
  const handle = (e: any) => {
    e.stopPropagation()
  }

  const PluginList = useMemo(() => {
    const list = item?.pluginName?.split(',')
    const enumValues = Object.values(IPluginNameType)
    if (!!list?.length) {
      return (list as IPluginNameType[]).filter(value => enumValues.includes(value))
    }
    return []
  }, [item?.pluginName])

  console.log('🚀 ~ PluginList is:', item)

  if (!PluginList.length) return null
  return (
    <BannerBottomBox onClick={handle}>
      {!!PluginList.length &&
        PluginList?.map(v => (
          <BannerBottomBoxItemBox
            key={v}
            onClick={() => {
              item?.boxId && Router.push(ROUTES.club.cusBox(item?.boxId) + `?appId=${getAppPluginId(v)}`)
            }}
          >
            {isMd ? PlugsSvgs[v as IPluginNameType].smIcon : PlugsSvgs[v as IPluginNameType].icon}
            <Typography color={'var(--ps-neutral2)'} fontSize={isMd ? '15px' : '20px'} lineHeight={'130%'}>
              {PlugsSvgs[v as IPluginNameType].name}
            </Typography>
          </BannerBottomBoxItemBox>
        ))}
    </BannerBottomBox>
  )
}

const RoomItem = ({ clubInfo, handleClick }: { clubInfo: RecommendedClubListResponse; handleClick?: () => void }) => {
  const isSm = useBreakpoint('sm')
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 156,
        cursor: 'pointer',
        opacity: 0.6,
        '&:hover': {
          opacity: 1
        }
      }}
      onClick={() => {
        handleClick?.()
      }}
    >
      <Image
        altSrc={BannerLogo.src}
        src={(isSm ? clubInfo.bgMobileImage : clubInfo.bgImage) || ''}
        style={{
          height: 156,
          width: '100%',
          borderRadius: '12px'
        }}
        alt={'png'}
      />

      <Stack
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          height: 32,
          borderRadius: '100px',
          background: `var(--ps-text-primary-40)`,
          backdropFilter: `blur(5px)`,
          padding: '0 12px 0 4px'
        }}
        justifyContent={'space-between'}
        alignItems={'center'}
        direction={'row'}
        maxWidth={'50%'}
      >
        <Box
          style={{
            borderRadius: '50%',
            backgroundColor: 'var(--ps-text-primary)',
            width: 24,
            height: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          mr={8}
        >
          <Image
            altSrc={BannerLogo.src}
            src={clubInfo.avatar}
            alt="avatar"
            style={{
              height: '24px',
              width: '24px',
              borderRadius: '50%'
            }}
          />
        </Box>

        <Typography
          noWrap
          variant="h6"
          color={'var(--ps-text-100)'}
          sx={{
            fontWeight: 500
          }}
        >
          {clubInfo.projectName || 'Bounce Finance'}
        </Typography>
      </Stack>
      <Stack
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          height: 32,
          borderRadius: '100px',
          background: `var(--ps-text-primary-40)`,
          padding: '0 12px 0 4px',
          gap: 4
        }}
        justifyContent={'space-between'}
        alignItems={'center'}
        direction={'row'}
      >
        {/* <CoinSvg /> */}
        <Typography
          variant="h6"
          color={'var(--ps-text-100)'}
          sx={{
            fontWeight: 500
          }}
        >
          {clubInfo.tvl?.toLocaleString() || 0} TVL
        </Typography>
      </Stack>
    </Box>
  )
}

export const Pagination = ({
  length,
  activeIndex,
  style,
  handleClick
}: {
  length: number
  activeIndex: number
  style?: React.CSSProperties
  handleClick?: (index: number) => void
}) => {
  return (
    <Stack
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      mt={16}
      mb={120}
      gap={12}
      sx={{
        ...style
      }}
    >
      {Array(length)
        .fill(0)
        .map((item: any, index: number) => {
          return (
            <Box
              key={'pagination' + index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: activeIndex === index ? 'var(--ps-text-100)' : 'var(--ps-text-40)'
              }}
              onClick={() => {
                handleClick && handleClick(index)
              }}
            ></Box>
          )
        })}
    </Stack>
  )
}
export default function Banner({ recommendedClubList }: { recommendedClubList: RecommendedClubListResponse[] }) {
  const isMd = useBreakpoint('md')
  const isSm = useBreakpoint('sm')
  const swiper = useSwiper()
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState(swiper)
  const [MainClub, setMainClub] = useState<RecommendedClubListResponse | undefined>(
    !!recommendedClubList.length ? recommendedClubList[0] : undefined
  )

  if (isMd) {
    return (
      <Stack
        direction={'column'}
        sx={{
          width: '100%',
          padding: '70px 20px 0'
        }}
        justifyContent={'flex-start'}
        alignItems={'center'}
      >
        {/* <Stack
          sx={{
            width: '100%'
          }}
          direction={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'var(--ps-text-60)',
              fontWeight: 500,
              fontSize: 36,
              wordWrap: 'nowrap'
            }}
          >
            BounceClub
          </Typography>
        </Stack>
        <Typography
          className="home-app-step"
          variant="body1"
          sx={{
            fontSize: 15,
            margin: '24px 0 60px'
          }}
        >
          {
            'An on-chain Web3 universe that empowers everyone to customize, launch and engage in diverse applications all within BounceClub.'
          }
        </Typography> */}
        <Box
          className="home-app-step"
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 'calc(100vw - 40px)',
            margin: '10px auto 0'
          }}
        >
          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            onSlideChange={(swiperCore: { activeIndex: any; snapIndex: any; previousIndex: any; realIndex: any }) => {
              const { realIndex } = swiperCore
              setActiveIndex(realIndex)
            }}
            onSwiper={setSwiperInstance}
          >
            {recommendedClubList?.map((item: RecommendedClubListResponse, i: number) => {
              return (
                <SwiperSlide key={'swiper' + i}>
                  <Stack
                    sx={{
                      width: '100%'
                    }}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 12,
                        width: '100%',
                        height: '500px',
                        borderRadius: 12,
                        background: `url(${item.bgMobileImage || item.bgImage}) no-repeat`,
                        // backgroundSize: '100% 100%'
                        backgroundSize: 'cover'
                      }}
                      onClick={() => {
                        Router.push(item?.boxId ? '/club/' + item?.boxId : '/')
                      }}
                    >
                      <BannerTop item={item} />
                      <BannerBottom item={item} />
                    </Box>
                  </Stack>
                </SwiperSlide>
              )
            })}
          </Swiper>
          <Box
            sx={{
              position: 'absolute',
              left: -30,
              top: '50%',
              zIndex: 1,
              width: 60,
              height: 60,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transform: 'translateY(-50%)'
            }}
            onClick={() => {
              swiperInstance && swiperInstance?.slidePrev()
            }}
          >
            <LeftArrow
              width={16}
              style={{
                objectFit: 'contain'
              }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: -30,
              top: '50%',
              zIndex: 1,
              width: 60,
              height: 60,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transform: 'translateY(-50%) rotateZ(180deg)'
            }}
            onClick={() => {
              swiperInstance && swiperInstance?.slideNext()
            }}
          >
            <LeftArrow
              width={16}
              style={{
                objectFit: 'contain'
              }}
            />
          </Box>
        </Box>
        <Pagination length={recommendedClubList.length} activeIndex={activeIndex} />
      </Stack>
    )
  }
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh'
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'space-between'}
        sx={{
          position: 'absolute',
          top: 70,
          left: '50%',
          width: '100%',
          maxWidth: '1200px',
          transform: 'translateX(-50%)',
          height: '710px'
        }}
      >
        {/* <WithAnimation>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            sx={{
              paddingTop: 50
            }}
          >
            <Stack direction={'row'} justifyContent={'flex-start'} mr={40}>
              <Typography
                variant="h1"
                sx={{
                  color: 'var(--ps-text-60)',
                  fontWeight: 500,
                  wordWrap: 'nowrap'
                }}
              >
                BounceClub
              </Typography>
            </Stack>

            <Typography variant="body1" maxWidth={665}>
              {
                'An on-chain Web3 universe that empowers everyone to customize, launch and engage in diverse applications all within BounceClub.'
              }
            </Typography>
          </Stack>
        </WithAnimation> */}
        <WithAnimation>
          <Stack
            direction={'row'}
            sx={{
              height: 600,
              paddingTop: 100
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                flex: 1,
                cursor: 'pointer',
                background: `url(${
                  (isSm ? MainClub?.bgMobileImage : MainClub?.bgImage) ||
                  'https://oss.bouncebit.io/box_images/2024/03/06/b61c21418b47c9de1532f32311c8864b_20240306065347A002.jpeg'
                }) no-repeat`,
                backgroundSize: '100% 100%',
                padding: '12px',
                borderRadius: '12px'
              }}
              mr={!!recommendedClubList.length ? 16 : 0}
              onClick={() => {
                Router.push(MainClub?.boxId ? '/club/' + MainClub?.boxId : '/')
              }}
            >
              <BannerTop item={MainClub} />
              <BannerBottom item={MainClub} />
            </Box>

            {!!recommendedClubList.length && (
              <Stack
                gap={16}
                sx={{
                  position: 'relative',
                  height: '100%',
                  width: 284,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
                justifyContent={'flex-start'}
              >
                {recommendedClubList?.map((item, index) => (
                  <RoomItem key={index} clubInfo={item} handleClick={() => setMainClub(item)} />
                ))}
              </Stack>
            )}
          </Stack>
        </WithAnimation>
      </Stack>
    </Box>
  )
}
