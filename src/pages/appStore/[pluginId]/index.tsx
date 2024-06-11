/* eslint-disable @next/next/no-img-element */
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { usePluginListDatas } from 'state/pluginListConfig/hooks'
import LogoSvg from 'assets/svg/appStore/logo.svg'
import Bitleverage1 from 'assets/images/appStore/plugin/Bitleverage1.png'
import Bitleverage2 from 'assets/images/appStore/plugin/Bitleverage2.png'
import Bitstable1 from 'assets/images/appStore/plugin/Bitstable1.png'
import Bitstable2 from 'assets/images/appStore/plugin/Bitstable2.png'
import Bitstaking1 from 'assets/images/appStore/plugin/Bitstaking1.png'
import Bitstaking2 from 'assets/images/appStore/plugin/Bitstaking2.png'
import Bitswap1 from 'assets/images/appStore/plugin/Bitswap1.png'
import Bitswap2 from 'assets/images/appStore/plugin/Bitswap2.png'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import ArrowPrvSvg from 'assets/svg/appStore/plugin/arrow-prv.svg'
import ArrowNextSvg from 'assets/svg/appStore/plugin/arrow-next.svg'
import { useGetHotClubPlugin } from 'hooks/boxes/useGetClubPlugin'
import { ActivityItem } from 'views/home/components/HotActivities'
import Head from 'next/head'
import { useEditBoxPluginListName } from 'state/boxes/hooks'
import { IBoxTypes } from 'api/boxes/type'
import Updater from 'state/boxes/updater'
import { useUserInfo } from 'state/user/hooks'

const GrayLine = () => {
  return <Box sx={{ width: '100%', height: '1px', background: 'var(--ps-text-20)' }} />
}
export enum DefaultPluginNum {
  Bitswap = 1,
  Bitstable = 2,
  Bitleverage = 3,
  Bitstaking = 4
}
const pluginData: Record<DefaultPluginNum, { dec: ReactNode; banner: string[]; about: ReactNode }> = {
  [DefaultPluginNum.Bitswap]: {
    dec: 'Bitswap operates as an Automated Market Maker (AMM) that provides token swap and liquidity function.',
    banner: [Bitswap1.src, Bitswap2.src],
    about: (
      <>
        <Typography
          fontFamily={'SF Pro Display'}
          color={'var(--ps-text-80)'}
          lineHeight={1.4}
          fontSize={{
            xs: 12,
            md: 15
          }}
        >
          Bitswap operates as an Automated Market Maker (AMM) that provides token swap functionality and liquidity
          provision. The formula is simple: x * y = k. Prices are determined by the amount of each token in a pool, with
          x and y representing the two tokens in a liquidity pool. No intermediaries are needed. Bitswap allows your
          club to have its own decentralized exchange (DEX).
        </Typography>
        <Typography
          fontFamily={'SF Pro Display'}
          color={'var(--ps-text-80)'}
          lineHeight={1.4}
          fontSize={{
            xs: 12,
            md: 15
          }}
        >
          When adding Bitswap to their club, a BounceClub owner can choose which types of tokens they wish to support
          for token swapping. Users who interact with Bitswap within a BounceClub can swap any supported tokens and
          manage liquidity. Each transaction made in the liquidity pool incurs a 3% fee based on the token swap volume.
        </Typography>
      </>
    )
  },
  [DefaultPluginNum.Bitstable]: {
    dec: 'Bitstable is a decentralized lending protocol that enables users to draw interest-free loans through the collateralization of BTC.',
    banner: [Bitstable1.src, Bitstable2.src],
    about: (
      <>
        <Typography
          fontFamily={'SF Pro Display'}
          color={'var(--ps-text-80)'}
          lineHeight={1.4}
          fontSize={{
            xs: 12,
            md: 15
          }}
        >
          Bitstable is a decentralized lending protocol that enables users to draw interest-free loans through the
          collateralization of BTC. The loans are paid out in stablecoins which can be staked in a stablecoin pool to
          participate in lending and liquidation processes for earning returns. Bitstable creates a more capital
          efficient and user-friendly way to borrow stablecoins. Stable-value assets are an essential element for
          decentralized applications and are needed for transactions of all kinds.
        </Typography>
        <Typography
          fontFamily={'SF Pro Display'}
          color={'var(--ps-text-80)'}
          lineHeight={1.4}
          fontSize={{
            xs: 12,
            md: 15
          }}
        >
          When adding Bitstable to their club, a BounceClub owner can either select existing stablecoins provided by the
          BounceBit App Store, or add a new stablecoin by entering its symbol.
        </Typography>
      </>
    )
  },
  [DefaultPluginNum.Bitleverage]: {
    dec: 'Krav is a decentralized perpetual quanto smart contract that allows users to open long or short contracts by staking any supported token.',
    banner: [Bitleverage1.src, Bitleverage2.src],
    about: (
      <>
        <Typography fontFamily={'SF Pro Display'} fontSize={15} color={'var(--ps-text-80)'} lineHeight={1.4}>
          {`Krav is a decentralized perpetual quanto smart contract that allows users to open long or short
          contracts by staking any supported token. The first highlight feature of Krav is its perpetual aspect,
          which means contracts do not have an expiry date, allowing positions to remain open as long as the margin
          requirements are met. "Quanto" is a term used in finance to describe a type of derivative in which the
          underlying security is denominated in one currency, but the derivative itself is settled in another currency
          at a fixed exchange rate. These derivatives are particularly useful for hedging and managing currency risk.
          The “quanto” characteristic allows users to stake assets that are not native to the blockchain on which
          Krav operates, in this case the BounceBit network.`}
        </Typography>
        <div>
          <Typography
            fontSize={{
              xs: 12,
              md: 15
            }}
            fontFamily={'SF Pro Display'}
            color={'var(--ps-text-80)'}
            lineHeight={1.4}
          >
            There are several types of quanto derivatives, including:
          </Typography>
          <ul style={{ paddingLeft: 30 }}>
            <Typography
              component={'li'}
              fontFamily={'SF Pro Display'}
              fontSize={{
                xs: 12,
                md: 15
              }}
              color={'var(--ps-text-80)'}
              lineHeight={1.4}
            >
              Quanto Futures Contract: A futures contract where the investor is exposed to price movements on an index
              or commodity, but without any currency risk.
            </Typography>
            <Typography
              component={'li'}
              fontFamily={'SF Pro Display'}
              fontSize={{
                xs: 12,
                md: 15
              }}
              color={'var(--ps-text-80)'}
              lineHeight={1.4}
            >
              Quanto Options: Similar to a futures contract, a quanto option allows an investor to take a position on an
              asset without exposure to currency risk.
            </Typography>
            <Typography
              component={'li'}
              fontFamily={'SF Pro Display'}
              fontSize={{
                xs: 12,
                md: 15
              }}
              color={'var(--ps-text-80)'}
              lineHeight={1.4}
            >
              Quanto Swaps: This is an interest rate swap where one party pays a foreign interest rate to the other, but
              the notional amount is in domestic currency.
            </Typography>
          </ul>
        </div>
        <Typography>
          When adding Bitleverage to their club, a BounceClub Owner can choose which types of tokens they wish to
          support for staking.
        </Typography>
      </>
    )
  },
  [DefaultPluginNum.Bitstaking]: {
    dec: 'Bitstaking is the app for everything related to staking. It facilitates yield generation by enabling the staking of a variety of tokens except BTC and stablecoins.',
    banner: [Bitstaking1.src, Bitstaking2.src],
    about: (
      <>
        <Typography>
          Bitstaking is the app for everything related to staking. It facilitates yield generation by enabling the
          staking of a variety of tokens except BTC and stablecoins. Bitstaking can serve as the foundation for your
          BounceClub by being an easy way to stake & lock tokens safely.
        </Typography>
        <Typography>
          A BounceClub owner can easily add Bitstaking to their club, offering club members a way to conveniently earn
          yield while contributing to the credibility, stability and s of the BounceClub.
        </Typography>
      </>
    )
  }
}
export default function Page() {
  const swiper = useSwiper()
  const [swiperInstance, setSwiperInstance] = useState(swiper)
  const router = useRouter()
  const pluginListDatas = usePluginListDatas()
  const userInfo = useUserInfo()

  const pluginId = useMemo(
    () => (router.query.pluginId ? (Number(router.query.pluginId.toString()) as DefaultPluginNum) : undefined),
    [router.query.pluginId]
  )
  const curPluginData = useMemo(
    () => pluginListDatas.list.find(i => i.id === pluginId),
    [pluginId, pluginListDatas.list]
  )
  const { data: HotClubPluginList } = useGetHotClubPlugin()
  const pluginHotActives = useMemo(
    () => HotClubPluginList?.filter(i => i.pluginId === pluginId).slice(0, 4),
    [HotClubPluginList, pluginId]
  )

  const isSm = useBreakpoint('sm')
  const theme = useTheme()
  const staticPluginData = useMemo(() => {
    if (!pluginId) return
    return pluginData[pluginId]
  }, [pluginId])

  const { pluginList, updateBoxPluginListNameCallback } = useEditBoxPluginListName()
  console.log('🚀 ~ Page ~ pluginList:', pluginList)

  const isHasPlugin = useMemo(() => {
    if (!pluginId) return false
    return pluginList.includes(pluginId as number)
  }, [pluginId, pluginList])

  const addPluginHandle = useCallback(() => {
    if (isHasPlugin || curPluginData?.status !== IBoxTypes.Normal) return
    updateBoxPluginListNameCallback(pluginId ? [...pluginList, pluginId] : pluginList)
  }, [curPluginData?.status, isHasPlugin, pluginId, pluginList, updateBoxPluginListNameCallback])

  return (
    <>
      {userInfo.box?.boxId && <Updater selfBoxId={userInfo.box?.boxId} changeNum={0} />}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          margin: '0 auto',
          mt: isSm ? 90 : 140,
          '& .item': { px: { xs: 20, md: 120 } },
          '& .special': { padding: { xs: '0 0 0 20px', md: '0 120px' } }
        }}
      >
        <Head>
          <title>BounceClub - App Store</title>
        </Head>
        <Stack className="item" flexDirection={'row'} sx={{ gap: 24, height: 100 }}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={curPluginData?.icon}
            style={{ width: isSm ? 64 : 100, height: isSm ? 64 : 100, borderRadius: isSm ? 10.894 : 17.021 }}
            alt=""
          />
          <Stack justifyContent={'space-between'}>
            <Box>
              <Stack flexDirection={'row'} sx={{ gap: 8 }} alignItems={'center'}>
                <Typography
                  sx={{
                    color: 'var(--ps-text-100)',
                    fontFamily: 'SF Pro Display',
                    fontSize: { xs: 20, md: 28 },
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '140%'
                  }}
                >
                  {curPluginData?.pluginName}
                </Typography>
                <Stack
                  flexDirection={'row'}
                  sx={{
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 90,
                    background: 'var(--ps-neutral4)',
                    alignItems: 'center',
                    height: 21
                  }}
                >
                  <LogoSvg />
                  <Typography
                    sx={{
                      color: '#000',
                      fontFamily: 'SF Pro Display',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '140%' /* '16.8px' */,
                      textTransform: 'capitalize',
                      height: 'fit-content'
                    }}
                  >
                    {curPluginData?.category}
                  </Typography>
                </Stack>
              </Stack>
              <Typography
                sx={{
                  mt: 8,
                  color: 'var(--ps-neutral3)',
                  fontFamily: 'SF Pro Display',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%' /* '16.8px' */,
                  textTransform: 'capitalize',
                  span: {
                    color: '#0B57D0',
                    pl: 4
                  }
                }}
              >
                Developed by <span>{curPluginData?.developer}</span>
              </Typography>
            </Box>
            <Stack flexDirection={'row'} alignItems={'center'}>
              {userInfo.box?.boxId && (
                <Button
                  disabled={isHasPlugin || curPluginData?.status !== IBoxTypes.Normal}
                  variant="contained"
                  sx={{
                    padding: '8px 16px',
                    height: 29,
                    color: 'var(--ps-text-primary)',
                    fontFamily: 'SF Pro Display',
                    fontSize: '13px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '100%'
                  }}
                  onClick={addPluginHandle}
                >
                  {curPluginData?.status !== IBoxTypes.Normal
                    ? 'Coming Soon'
                    : isHasPlugin
                      ? 'Already Added'
                      : 'Add to Club'}
                </Button>
              )}

              <Typography
                sx={{
                  color: 'var(--ps-neutral3)',
                  fontFamily: 'SF Pro Display',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '130%',
                  pl: 12
                }}
              >
                Free & All Clubs
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Box my={isSm ? 24 : 32} className="item">
          <GrayLine />
        </Box>
        <Typography
          className="item"
          fontSize={{
            xs: 12,
            md: 15
          }}
          sx={{
            color: 'var(--ps-text-80)',
            fontFamily: 'SF Pro Display',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '140%'
          }}
        >
          {/* {curPluginData?.description} */}
          {staticPluginData?.dec ? staticPluginData?.dec : curPluginData?.introduction}
        </Typography>
        <Stack
          className="special"
          flexDirection={'row'}
          alignItems={'center'}
          sx={{ mt: isSm ? 25 : 32, width: '100%', gap: 7 }}
        >
          {!isSm && Number(staticPluginData?.banner.length) > 2 && (
            <Box onClick={() => swiperInstance && swiperInstance.slidePrev()} sx={{ cursor: 'pointer' }}>
              <ArrowPrvSvg />
            </Box>
          )}
          <Swiper
            onSwiper={setSwiperInstance}
            slidesPerView={isSm ? 1.15 : 2}
            spaceBetween={16}
            style={{ width: '100%' }}
          >
            {curPluginData?.banner?.split(',').map((item: string, j: number) => {
              return (
                <SwiperSlide key={'swiper' + j} style={{ width: isSm ? 'calc(100vw - 60px)' : 389 }}>
                  <Box
                    sx={{
                      img: {
                        width: { xs: '100%', md: '100%' }
                        // maxWidth: 389
                      }
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item} alt="" />
                  </Box>
                </SwiperSlide>
              )
            })}
            {!curPluginData?.banner &&
              staticPluginData?.banner.map((v, index) => {
                return (
                  <SwiperSlide key={'swiper' + index} style={{ width: isSm ? 'calc(100vw - 60px)' : 389 }}>
                    <Box
                      sx={{
                        img: {
                          width: { xs: '100%', md: '100%' }
                          // maxWidth: 389
                        }
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v} alt="" />
                    </Box>
                  </SwiperSlide>
                )
              })}
          </Swiper>
          {!isSm && Number(staticPluginData?.banner.length) > 2 && (
            <Box onClick={() => swiperInstance && swiperInstance.slideNext()} sx={{ cursor: 'pointer' }}>
              <ArrowNextSvg />
            </Box>
          )}
        </Stack>

        {/* {!staticPluginData?.banner && curPluginData?.banner && (
          <Box sx={{ width: 'unset', margin: !isSm ? '0 120px' : '0 20px' }}>
            <img width={'50%'} src={curPluginData.banner} alt="banner" />
          </Box>
        )} */}
        <Box mt={32} className="item">
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: 'SF Pro Display',
              fontSize: { xs: 15, md: 20 },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '130%'
            }}
          >
            About this app
          </Typography>

          <Typography
            component={Stack}
            mt={16}
            sx={{
              gap: 16,
              '&>p,&>li': {
                color: 'var(--ps-text-80)',
                fontFamily: 'SF Pro Display',
                fontSize: { xs: 12, md: 15 },
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '140%'
              }
            }}
          >
            {staticPluginData?.about ? staticPluginData?.about : curPluginData?.description}
          </Typography>
        </Box>
        <Box my={32} className="item">
          <GrayLine />
        </Box>
        <Box className="item">
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontFamily: 'SF Pro Display',
              fontSize: { xs: 15, md: 20 },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '130%'
            }}
          >
            Popular activities using this app
          </Typography>
          <Stack
            mt={isSm ? 16 : 24}
            flexDirection={isSm ? 'column' : 'row'}
            alignItems={'center'}
            sx={{
              gap: 16,
              [theme.breakpoints.down('sm')]: {
                '&>div': {
                  width: '100%',
                  img: {
                    width: '100%'
                  }
                }
              }
            }}
          >
            {pluginHotActives?.map(i => <ActivityItem key={i.projectName + i.pluginName} item={i} />)}
          </Stack>
        </Box>
        <Box
          mt={isSm ? 80 : 120}
          sx={{
            py: { xs: 48, md: 84 },
            background: 'var(--ps-neutral2)',
            [theme.breakpoints.down('sm')]: {
              px: 20
            }
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 959, margin: '0 auto', textAlign: 'center' }}>
            <Typography
              sx={{
                color: 'var(--ps-text-100)',
                fontFamily: 'SF Pro Display',
                fontSize: { xs: 36, md: 64 },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '100%'
              }}
            >
              Want to list your DApp here?
            </Typography>

            <Typography
              my={30}
              sx={{
                color: '#A8A29F',
                fontFamily: 'SF Pro Display',
                fontSize: { xs: 15, md: 20 },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '130%'
              }}
            >
              Calling all developers: Submit your protocols to be featured on the BounceBit App Store.
            </Typography>

            <Button
              variant="contained"
              sx={{
                height: 44,
                padding: '12px 24px',
                background:
                  'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
                color: 'var(--ps-text-100)',
                fontFamily: 'SF Pro Display',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '100%'
              }}
              onClick={() => {
                window.open('https://github.com/BounceBit-Labs/BounceBit-App-Store', '_blank')
              }}
            >
              Submit an App
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}
