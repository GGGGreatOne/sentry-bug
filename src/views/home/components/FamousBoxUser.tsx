import { Box, Stack, Typography } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { FreeMode } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide } from 'swiper/react'
import P1img from '../../../assets/images/home/p1.png'
import P2img from '../../../assets/images/home/p2.png'
import P3img from '../../../assets/images/home/p3.png'
import P4img from '../../../assets/images/home/p4.png'
import P5img from '../../../assets/images/home/p5.png'
import P6img from '../../../assets/images/home/p6.png'

interface ItemParams {
  img: StaticImageData
  name: string
}
interface ListParams {
  title: string
  list: ItemParams[]
}
export default function FamousBoxUser() {
  const textData: ListParams[] = useMemo(() => {
    return [
      {
        title: 'Communities',
        list: [
          { img: P1img, name: 'Useraec edscv' },
          { img: P2img, name: 'Useraec edscv' },
          { img: P3img, name: 'Useraec edscv' },
          { img: P4img, name: 'Useraec edscv' },
          { img: P5img, name: 'Useraec edscv' },
          { img: P6img, name: 'Useraec edscv' }
        ]
      },
      {
        title: 'Projects',
        list: [
          { img: P1img, name: 'Useraec edscv' },
          { img: P2img, name: 'Useraec edscv' },
          { img: P3img, name: 'Useraec edscv' },
          { img: P4img, name: 'Useraec edscv' },
          { img: P5img, name: 'Useraec edscv' },
          { img: P6img, name: 'Useraec edscv' }
        ]
      },
      {
        title: 'Celebrities',
        list: [
          { img: P1img, name: 'Useraec edscv' },
          { img: P2img, name: 'Useraec edscv' },
          { img: P3img, name: 'Useraec edscv' },
          { img: P4img, name: 'Useraec edscv' },
          { img: P5img, name: 'Useraec edscv' },
          { img: P6img, name: 'Useraec edscv' }
        ]
      }
    ]
  }, [])

  const [windowWidth, setWindowWidth] = useState(0)

  const isMd = useBreakpoint('md')

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
    return Number(((windowWidth - 40) / 280).toFixed(2))
  }, [windowWidth])

  if (isMd) {
    return (
      <Stack
        alignItems={'center'}
        sx={{
          background: 'var(--ps-neutral)',
          padding: '0px 0 120px'
        }}
      >
        <WithAnimation>
          <Typography
            variant="h1"
            sx={{
              color: 'var(--ps-text-100)',
              fontWeight: 500,
              textAlign: 'center',
              fontSize: 36
            }}
            mb={40}
          >
            Famous Club User
          </Typography>
        </WithAnimation>

        <WithAnimation
          Component={Box}
          sx={{
            width: '100%',
            height: 291,
            paddingLeft: '20px'
          }}
        >
          {!!windowWidth && (
            <Swiper spaceBetween={16} slidesPerView={slidesPerView} modules={[FreeMode]} initialSlide={0}>
              {textData.map((item: ListParams, j: number) => {
                return (
                  <SwiperSlide key={'swiper' + j}>
                    <Box
                      key={'box' + j}
                      sx={{
                        width: 289,
                        borderRadius: '20px',
                        background: theme => theme.palette.background.default,
                        padding: '24px 0 32px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexFlow: 'column nowrap'
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 500,
                          color: 'var(--ps-text-100)',
                          textAlign: 'center',
                          marginBottom: 20,
                          fontSize: 15
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Stack
                        sx={{
                          width: '100%'
                        }}
                        direction={'row'}
                        flexWrap={'wrap'}
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                        gap={16}
                      >
                        {item.list.map((item: ItemParams, j: number) => {
                          return (
                            <Box
                              key={'pic' + j}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <Image width={64} height={64} src={item.img} alt={''} />
                              <Typography
                                sx={{
                                  color: 'var(--ps-text-100)',
                                  fontSize: 12,
                                  lineHeight: 1
                                }}
                                variant="body2"
                                mt={12}
                              >
                                {item.name}
                              </Typography>
                            </Box>
                          )
                        })}
                      </Stack>
                    </Box>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </WithAnimation>
      </Stack>
    )
  }
  return (
    <Stack
      alignItems={'center'}
      sx={{
        background: 'var(--ps-neutral)',
        padding: '0px 0 160px'
      }}
    >
      <WithAnimation>
        <Typography
          variant="h1"
          sx={{
            color: 'var(--ps-text-100)',
            fontWeight: 500,
            textAlign: 'center'
          }}
          mb={90}
        >
          Famous Club User
        </Typography>
      </WithAnimation>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(384px, 1fr))',
          gridGap: 24
        }}
      >
        {textData.map((item: ListParams, j: number) => {
          return (
            <WithAnimation
              Component={Box}
              key={'box' + j}
              sx={{
                borderRadius: '20px',
                background: (theme: any) => theme.palette.background.default,
                padding: '24px 20px',
                boxSizing: 'border-box'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  color: 'var(--ps-text-100)',
                  textAlign: 'center',
                  marginBottom: 24
                }}
              >
                {item.title}
              </Typography>
              <Stack
                sx={{
                  width: '100%'
                }}
                direction={'row'}
                flexWrap={'wrap'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                gap={24}
              >
                {item.list.map((item: ItemParams, j: number) => {
                  return (
                    <Box
                      key={'pic' + j}
                      sx={{
                        width: 'calc(33.3% - 24px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Image width={90} height={90} src={item.img} alt={''} />
                      <Typography
                        sx={{
                          color: 'var(--ps-text-100)'
                        }}
                        variant="body2"
                        mt={12}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
            </WithAnimation>
          )
        })}
      </Box>
    </Stack>
  )
}
