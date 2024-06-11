import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FreeMode } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide } from 'swiper/react'
import Box1Img from '../../../assets/images/home/box1.png'
import Box2Img from '../../../assets/images/home/box2.png'
import Box3Img from '../../../assets/images/home/box3.png'
import Box4Img from '../../../assets/images/home/box4.png'
import HeadIcon from '../../../assets/images/home/headIcon.png'
import StarSvg from '../../../assets/svg/home/star.svg'
import { Pagination } from './Banner'

const StyledStar = styled(StarSvg)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    stroke: theme.palette.text.primary
  }
}))

interface TabsTypeItem {
  label: string
  index: number
  handleClick: () => void
}
interface BoxParams {
  img: StaticImageData
  headIcon: StaticImageData
  title: string
  id: number
  followCount: string
  isFollow: boolean
}
const Tabs = ({
  list,
  index,
  handleClick
}: {
  list: TabsTypeItem[]
  index: number
  handleClick: (value: number) => void
}) => {
  const isMd = useBreakpoint('md')
  const [tabIndex, setTabIndex] = useState(index)
  const handleTab = (index: number) => {
    setTabIndex(index)
    handleClick(index)
  }
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        margin: '16px 0 30px',
        justifyContent: isMd ? 'flex-start' : 'center',
        paddingLeft: isMd ? 20 : 0,
        flexFlow: 'row nowrap',
        alignItems: 'center',
        overflowY: 'hidden',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
      gap={isMd ? 16 : 20}
    >
      {list.map((item: TabsTypeItem, i: number) => {
        return (
          <Typography
            key={i}
            variant="h5"
            onClick={() => handleTab(i)}
            noWrap
            sx={{
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: isMd ? 13 : 15,
              color: tabIndex === i ? 'var(--ps-text-100)' : 'var(--ps-text-40)',
              borderBottom: tabIndex === i ? '1px solid var(--ps-text-100)' : '1px solid transparent',
              '&:hover': {
                color: 'var(--ps-text-100)'
              }
            }}
          >
            {item.label}
          </Typography>
        )
      })}
    </Box>
  )
}
export default function FeaturedBoxes({ whithoutAnimation = false }: { whithoutAnimation?: boolean }) {
  const isMd = useBreakpoint('md')
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
    return Number(((windowWidth - 40) / 240).toFixed(2))
  }, [windowWidth])

  const [tabIndex, setTabIndex] = useState(0)

  const [activeIndex, setActiveIndex] = useState(0)

  const handleTab = (index: number) => {
    setTabIndex(index)
  }
  const tabsData: TabsTypeItem[] = [
    {
      label: 'KOL Clubs',
      index: 0,
      handleClick: () => {
        handleTab(0)
      }
    },
    {
      label: 'Top Trading Clubs',
      index: 1,
      handleClick: () => {
        handleTab(1)
      }
    },
    {
      label: 'Hot Farm',
      index: 2,
      handleClick: () => {
        handleTab(2)
      }
    },
    {
      label: 'Hot Airdrops',
      index: 3,
      handleClick: () => {
        handleTab(3)
      }
    }
  ]
  const currentData = useMemo(() => {
    const boxData: BoxParams[][] = [
      [
        {
          img: Box1Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '1k',
          isFollow: false
        },
        {
          img: Box2Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '2k',
          isFollow: false
        },
        {
          img: Box3Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '3k',
          isFollow: false
        },
        {
          img: Box4Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '4k',
          isFollow: false
        },
        {
          img: Box4Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '4k',
          isFollow: false
        }
      ],
      [
        {
          img: Box2Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '2k',
          isFollow: false
        }
      ],
      [
        {
          img: Box3Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '3k',
          isFollow: false
        }
      ],
      [
        {
          img: Box4Img,
          headIcon: HeadIcon,
          title: 'Cool Cat',
          id: 1231412,
          followCount: '4k',
          isFollow: false
        }
      ]
    ]
    return boxData[tabIndex]
  }, [tabIndex])
  console.log('currentData', currentData)

  if (isMd) {
    return (
      <Box
        sx={{
          maxWidth: '100vw',
          marginBottom: 100
        }}
      >
        <Stack
          sx={{
            width: '100%'
          }}
        >
          <WithAnimation>
            <Typography
              variant="h1"
              color={'var(--ps-text-100)'}
              sx={{
                width: '100%',
                fontWeight: 500,
                fontSize: 36,
                paddingLeft: 20
              }}
            >
              Featured Clubs
            </Typography>
          </WithAnimation>
          <WithAnimation>
            <Tabs list={tabsData} index={tabIndex} handleClick={handleTab} />
          </WithAnimation>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              margin: '0 auto',
              paddingLeft: 20
            }}
          >
            <Swiper
              spaceBetween={0}
              slidesPerView={slidesPerView}
              modules={[FreeMode]}
              onSlideChange={(swiperCore: { activeIndex: any; snapIndex: any; previousIndex: any; realIndex: any }) => {
                const { realIndex } = swiperCore
                setActiveIndex(realIndex)
              }}
            >
              {currentData.map((item: BoxParams, j: number) => {
                return (
                  <SwiperSlide key={'swiper' + j} style={{ width: 240 }}>
                    <WithAnimation key={'box' + j}>
                      <Link key={'box' + j} href={'/'}>
                        <Box
                          sx={{
                            width: 240,
                            borderRadius: '12px',
                            background: `var(--ps-neutral)`,
                            boxShadow: `2px 4px 12px 0px rgba(0, 0, 0, 0.08)`,
                            padding: '8px 8px 20px',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: 224,
                              height: 160,
                              overflow: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              background: 'var(--ps-text-primary)',
                              '&:before': {
                                content: `''`,
                                display: 'block',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '270%',
                                height: '1px',
                                background: 'var(--ps-text-100)',
                                transform: 'rotateZ(35.5deg) scale(0.5)',
                                transformOrigin: 'left center'
                              },
                              '&:after': {
                                content: `''`,
                                display: 'block',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                width: '270%',
                                height: '1px',
                                background: 'var(--ps-text-100)',
                                transform: 'rotateZ(-35.5deg) scale(0.5)',
                                transformOrigin: 'right center'
                              }
                            }}
                            mb={16}
                          >
                            <Image
                              width={189}
                              height={136}
                              src={item.img}
                              alt={''}
                              style={{
                                zIndex: 1
                              }}
                            ></Image>
                          </Box>
                          <Stack direction={'row'} justifyContent={'flex-start'}>
                            <Image
                              width={30}
                              height={30}
                              src={item.headIcon}
                              alt={''}
                              style={{
                                marginRight: 12
                              }}
                            ></Image>
                            <Stack
                              justifyContent={'space-between'}
                              sx={{
                                flex: 1
                              }}
                            >
                              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 500,
                                    color: 'var(--ps-text-100)',
                                    fontSize: 13
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <StyledStar />
                              </Stack>
                              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 500,
                                    color: 'var(--ps-neutral3)',
                                    fontSize: 12
                                  }}
                                >
                                  #{item.id}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 500,
                                    color: 'var(--ps-neutral3)',
                                    fontSize: 12
                                  }}
                                >
                                  {item.followCount} followers
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Box>
                      </Link>
                    </WithAnimation>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </Box>
          <WithAnimation>
            <Pagination
              length={currentData.length}
              activeIndex={activeIndex}
              style={{
                marginTop: 30,
                marginBottom: 30
              }}
            />
          </WithAnimation>
        </Stack>
        <WithAnimation>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button variant="contained">Explore more</Button>
          </Box>
        </WithAnimation>
      </Box>
    )
  }
  if (whithoutAnimation) {
    return (
      <Stack
        alignItems={'center'}
        sx={{
          width: '100%',
          maxWidth: isMd ? '100vw' : 1200,
          margin: '0 auto',
          padding: '174px 0 203px'
        }}
      >
        <Typography
          variant="h1"
          color={'var(--ps-text-100)'}
          sx={{
            fontWeight: 500
          }}
          mb={32}
        >
          Featured Clubs
        </Typography>
        <Tabs list={tabsData} index={tabIndex} handleClick={handleTab} />
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            margin: '40px auto',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {currentData.splice(0, 4).map((item: BoxParams, j: number) => {
            return (
              <Link key={'box' + j} href={'/'}>
                <Box
                  sx={{
                    width: 288,
                    height: 288,
                    borderRadius: '12px',
                    background: `var(--ps-neutral)`,
                    boxShadow: `2px 4px 12px 0px rgba(0, 0, 0, 0.08)`,
                    padding: '8px 8px 20px',
                    cursor: 'pointer',
                    transition: '1s',
                    '&:hover': {
                      scale: '1.02',
                      background:
                        'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-neutral)',
                      '& div:before': {
                        display: 'none'
                      },
                      '& div:after': {
                        display: 'none'
                      },
                      '& #img': {
                        width: 272,
                        height: 200
                      }
                    }
                  }}
                  margin={8}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 272,
                      height: 200,
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'var(--ps-text-primary)',
                      '&:before': {
                        content: `''`,
                        display: 'block',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '270%',
                        height: '1px',
                        background: 'var(--ps-text-100)',
                        transform: 'rotateZ(36.3deg) scale(0.5)',
                        transformOrigin: 'left center'
                      },
                      '&:after': {
                        content: `''`,
                        display: 'block',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '270%',
                        height: '1px',
                        background: 'var(--ps-text-100)',
                        transform: 'rotateZ(-36.3deg) scale(0.5)',
                        transformOrigin: 'right center'
                      }
                    }}
                    mb={16}
                  >
                    <Image
                      id="img"
                      width={230}
                      height={170}
                      src={item.img}
                      alt={''}
                      style={{
                        transition: '1s',
                        zIndex: 1
                      }}
                    ></Image>
                  </Box>
                  <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Image
                      width={40}
                      height={40}
                      src={item.headIcon}
                      alt={''}
                      style={{
                        marginRight: 12
                      }}
                    ></Image>
                    <Stack
                      justifyContent={'space-between'}
                      sx={{
                        flex: 1
                      }}
                    >
                      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-text-100)'
                          }}
                        >
                          {item.title}
                        </Typography>
                        <StyledStar />
                      </Stack>
                      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-neutral3)'
                          }}
                        >
                          #{item.id}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-neutral3)'
                          }}
                        >
                          {item.followCount} followers
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Link>
            )
          })}
        </Box>
        <Button variant="contained" size="large">
          Explore more
        </Button>
      </Stack>
    )
  }
  return (
    <Stack
      alignItems={'center'}
      sx={{
        width: '100%',
        maxWidth: isMd ? '100vw' : 1200,
        margin: '0 auto',
        padding: '200px 0 203px'
      }}
    >
      <WithAnimation>
        <Typography
          variant="h1"
          color={'var(--ps-text-100)'}
          sx={{
            fontWeight: 500
          }}
          mb={32}
        >
          Featured Clubs
        </Typography>
      </WithAnimation>
      <WithAnimation>
        <Tabs list={tabsData} index={tabIndex} handleClick={handleTab} />
      </WithAnimation>
      <WithAnimation>
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            margin: '40px auto',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {currentData.splice(0, 4).map((item: BoxParams, j: number) => {
            return (
              <Link key={'box' + j} href={'/'}>
                <Box
                  sx={{
                    width: 288,
                    height: 288,
                    borderRadius: '12px',
                    background: `var(--ps-neutral)`,
                    boxShadow: `2px 4px 12px 0px rgba(0, 0, 0, 0.08)`,
                    padding: '8px 8px 20px',
                    cursor: 'pointer',
                    transition: '1s',
                    '&:hover': {
                      scale: '1.02',
                      background:
                        'linear-gradient(0deg, var(--ps-text-10) 0%, var(--ps-text-10) 100%), var(--ps-neutral)',
                      '& div:before': {
                        display: 'none'
                      },
                      '& div:after': {
                        display: 'none'
                      },
                      '& #img': {
                        width: 272,
                        height: 200
                      }
                    }
                  }}
                  margin={8}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 272,
                      height: 200,
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'var(--ps-text-primary)',
                      '&:before': {
                        content: `''`,
                        display: 'block',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '270%',
                        height: '1px',
                        background: 'var(--ps-text-100)',
                        transform: 'rotateZ(36.3deg) scale(0.5)',
                        transformOrigin: 'left center'
                      },
                      '&:after': {
                        content: `''`,
                        display: 'block',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '270%',
                        height: '1px',
                        background: 'var(--ps-text-100)',
                        transform: 'rotateZ(-36.3deg) scale(0.5)',
                        transformOrigin: 'right center'
                      }
                    }}
                    mb={16}
                  >
                    <Image
                      id="img"
                      width={230}
                      height={170}
                      src={item.img}
                      alt={''}
                      style={{
                        transition: '1s',
                        zIndex: 1
                      }}
                    ></Image>
                  </Box>
                  <Stack direction={'row'} justifyContent={'flex-start'}>
                    <Image
                      width={40}
                      height={40}
                      src={item.headIcon}
                      alt={''}
                      style={{
                        marginRight: 12
                      }}
                    ></Image>
                    <Stack
                      justifyContent={'space-between'}
                      sx={{
                        flex: 1
                      }}
                    >
                      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-text-100)'
                          }}
                        >
                          {item.title}
                        </Typography>
                        <StyledStar />
                      </Stack>
                      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-neutral3)'
                          }}
                        >
                          #{item.id}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-neutral3)'
                          }}
                        >
                          {item.followCount} followers
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Link>
            )
          })}
        </Box>
      </WithAnimation>
      <WithAnimation>
        <Button variant="contained" size="large">
          Explore more
        </Button>
      </WithAnimation>
    </Stack>
  )
}
