import { Box, Stack, Typography } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import { useGetPowerful } from 'hooks/boxes/useGetPowerful'
import useBreakpoint from 'hooks/useBreakpoint'
import { useEffect, useMemo, useState } from 'react'
import { FreeMode } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide } from 'swiper/react'
import CountUp from 'react-countup'
import { formatGroupNumber } from 'utils'
import BigNumber from 'bignumber.js'

interface ItemParams {
  amount: string | number
  subTitle: string
  description: string
  oldCount: number
}

enum CardSubTitle {
  ClubsNow = 'Active Clubs',
  CurrentTVL = 'Current TVL',
  BounceUsers = 'BounceClub Users',
  TotalApps = 'Total Apps'
}

export default function BounceBoxisPowerful() {
  const { data } = useGetPowerful()
  const [newClubCount, setNewClubCount] = useState<number>(0)
  const [oldClubCount, setOldClubCount] = useState<number>(0)
  const [newUserCount, setNewUserCount] = useState<number>(0)
  const [oldUserCount, setOldUserCount] = useState<number>(0)
  const [newAppsCount, setNewAppsCount] = useState<number>(0)
  const [oldAppsCount, setOldAppsCount] = useState<number>(0)

  const Statistics: ItemParams[] = useMemo(() => {
    return [
      {
        oldCount: oldClubCount,
        amount: newClubCount,
        subTitle: CardSubTitle.ClubsNow,
        description: 'Various clubs, diverse vibes: Your Web3 dreams all within BounceClub. '
      },
      {
        oldCount: 0,
        amount: data?.totalTvl
          ? formatGroupNumber(data?.totalTvl ? new BigNumber(data?.totalTvl).toNumber() : 0, '', 2)
          : 0,
        subTitle: CardSubTitle.CurrentTVL,
        description:
          'Trade through different DApps within the clubs. All transactions and Total Value Locked (TVL) are recorded on-chain. '
      },
      {
        oldCount: oldUserCount,
        amount: newUserCount,
        subTitle: CardSubTitle.BounceUsers,
        description: 'BounceClub is designed for everyone: Enjoy Web3 innovations with a growing community.'
      },
      {
        oldCount: oldAppsCount,
        amount: newAppsCount,
        subTitle: CardSubTitle.TotalApps,
        description: 'Explore a variety of plugins built by BounceClub ecosystem partners and developers. '
      }
    ]
  }, [data?.totalTvl, newAppsCount, newClubCount, newUserCount, oldAppsCount, oldClubCount, oldUserCount])

  useEffect(() => {
    if (data?.clubCount || data?.clubCount === 0) {
      setOldClubCount(newClubCount)
      setNewClubCount(data?.clubCount)
    }
    if (data?.userCount || data?.userCount === 0) {
      setOldUserCount(newUserCount)
      setNewUserCount(data?.userCount)
    }
    if (data?.pluginCount || data?.pluginCount === 0) {
      setOldAppsCount(newAppsCount)
      setNewAppsCount(data?.pluginCount - 3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
    return Number(((windowWidth - 40) / 280).toFixed(2))
  }, [windowWidth])
  if (isMd) {
    return (
      <Stack
        alignItems={'center'}
        sx={{
          background: 'var(--ps-neutral)',
          padding: '120px 0 120px'
        }}
      >
        <WithAnimation>
          <Typography
            variant="h1"
            sx={{
              width: 'calc(100vw - 40px)',
              color: 'var(--ps-text-100)',
              fontWeight: 500,
              // width: 460,
              fontSize: 36,
              textAlign: 'center'
            }}
            mb={32}
          >
            Explore, Engage, <br></br>Earn Yield
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: 20,
              color: 'var(--ps-text-100)',
              fontWeight: 500,
              width: '100%',
              textAlign: 'center'
            }}
            mb={40}
          >
            Your{' '}
            <span
              style={{
                background: `linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Web3 Adventure
            </span>{' '}
            Begins Here.
          </Typography>
        </WithAnimation>
        <WithAnimation
          Component={Box}
          sx={{
            width: '100%',
            paddingLeft: '20px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            flexFlow: 'row nowrap'
          }}
        >
          {!!windowWidth && (
            <Swiper spaceBetween={16} slidesPerView={slidesPerView} modules={[FreeMode]} initialSlide={0}>
              {Statistics.map((item: ItemParams, j: number) => {
                return (
                  <SwiperSlide key={'swiper' + j}>
                    <Box
                      key={'box' + j}
                      sx={{
                        width: 280,
                        borderRadius: '16px',
                        background: theme => theme.palette.background.default,
                        padding: '24px',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexFlow: 'column nowrap'
                      }}
                    >
                      {item.subTitle === CardSubTitle.CurrentTVL ? (
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 500,
                            color: 'var(--ps-text-100)',
                            marginLeft: '-4px',
                            lineHeight: '39px',
                            fontSize: 30
                          }}
                        >
                          ${item.amount}
                        </Typography>
                      ) : (
                        <CountUp
                          key={item.subTitle}
                          start={item.oldCount}
                          end={Number(item.amount)}
                          duration={2.5}
                          separator=","
                          decimals={0}
                          delay={0}
                          decimal="."
                          redraw={true}
                        >
                          {({ countUpRef }) => (
                            <Typography
                              variant="h2"
                              sx={{
                                fontWeight: 500,
                                color: 'var(--ps-text-100)',
                                marginLeft: '-4px',
                                lineHeight: '39px',
                                fontSize: 30
                              }}
                            >
                              {' '}
                              <span ref={countUpRef} />
                            </Typography>
                          )}
                        </CountUp>
                      )}

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 500,
                          color: 'var(--ps-text-100)',
                          fontSize: 15,
                          margin: '16px 0 30px'
                        }}
                      >
                        {item.subTitle}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'var(--ps-text-100)',
                          opacity: 0.5,
                          fontSize: 15,
                          minHeight: 80
                        }}
                      >
                        {item.description}
                      </Typography>
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
        padding: '174px 0 203px'
      }}
    >
      <WithAnimation>
        <Typography
          variant="h1"
          sx={{
            color: 'var(--ps-text-100)',
            fontWeight: 500,
            width: '100%',
            textAlign: 'center'
          }}
          mb={40}
        >
          Explore, Engage, Earn Yield
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: 28,
            color: 'var(--ps-text-100)',
            fontWeight: 500,
            width: '100%',
            textAlign: 'center'
          }}
          mb={90}
        >
          Your{' '}
          <span
            style={{
              background: `linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Web3 Adventure
          </span>{' '}
          Begins Here.
        </Typography>
      </WithAnimation>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
        gap={16}
      >
        {Statistics.map((item: ItemParams, j: number) => {
          return (
            <WithAnimation
              Component={Box}
              key={'box' + j}
              sx={{
                width: 'calc(50% - 8px)',
                borderRadius: '16px',
                background: (theme: any) => theme.palette.background.default,
                padding: '48px',
                cursor: 'pointer',
                boxSizing: 'border-box',
                display: 'flex',
                flexFlow: 'column nowrap'
              }}
            >
              {item.subTitle === CardSubTitle.CurrentTVL ? (
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 500,
                    color: 'var(--ps-text-100)',
                    marginLeft: '-4px',
                    lineHeight: '39px'
                  }}
                >
                  ${item.amount}
                </Typography>
              ) : (
                <CountUp
                  key={item.subTitle}
                  start={item.oldCount}
                  end={Number(item.amount)}
                  duration={2.5}
                  separator=","
                  decimals={0}
                  delay={0}
                  decimal="."
                  redraw={true}
                >
                  {({ countUpRef }) => (
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 500,
                        color: 'var(--ps-text-100)',
                        marginLeft: '-4px',
                        lineHeight: '39px'
                      }}
                    >
                      <span ref={countUpRef} />
                    </Typography>
                  )}
                </CountUp>
              )}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  color: 'var(--ps-text-100)',
                  margin: '24px 0 40px'
                }}
              >
                {item.subTitle}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'var(--ps-text-100)',
                  opacity: 0.5
                }}
              >
                {item.description}
              </Typography>
            </WithAnimation>
          )
        })}
      </Box>
    </Stack>
  )
}
