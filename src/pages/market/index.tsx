import { Box, Button, Container, Stack, Typography } from '@mui/material'
import BannerBg from 'assets/images/activeties/banner-bg.png'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo, useState } from 'react'
import BoxSwiper from '../../views/activities/components/BoxsSwiper'
import Cards from '../../views/activities/components/Cards'
// import SimpleDialog from '../../views/activities/components/ParticipantDialog'
import Head from 'next/head'
import { TimeDown } from '../../components/Activities/TimeDown'
import { useGetLotteryInfo } from '../../hooks/lottery/useGetLotteryInfo'
import { useBet } from '../../hooks/lottery/useBet'
import { useUnBet } from '../../hooks/lottery/useUnBet'
import { useRouter } from 'next/router'
import { useRequest } from 'ahooks'
import { getBoxRewardId, getBoxRewardList } from '../../api/lottery/type'
import { MarketForClubs } from 'views/activities/MarketForClubs'
import dynamic from 'next/dynamic'
const LotteryButton = dynamic(() => import('../../components/Activities/LotteryButton'), { ssr: false })

export default function Activities() {
  const [, setOpen] = useState(false)
  const isMd = useBreakpoint('md')
  const { currentParticipants, userIsBet, paymentInToken, userIsWon, currentEpoch } = useGetLotteryInfo()
  const { data: rewardInfo } = useRequest(async () => {
    const rewardID = await getBoxRewardId()
    const rewardList = await getBoxRewardList()
    if (rewardID.code === 200 && rewardList.code === 200) {
      return {
        id: rewardID.data,
        list: rewardList.data
      }
    } else
      return {
        id: '',
        list: undefined
      }
  })

  const { runWithModal: bet } = useBet(paymentInToken.toString())
  const { runWithModal: unBet } = useUnBet()
  const router = useRouter()
  const handleClickOpen = () => {
    setOpen(true)
  }

  const renderMarket = useMemo(() => <MarketForClubs />, [])

  if (isMd) {
    return (
      <>
        <Head>
          <title>BounceClub - Club Market</title>
        </Head>
        <Stack
          direction={'column'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          sx={{
            minHeight: 'calc(100vh - 70px)',
            background: `url(${BannerBg.src}) no-repeat top 70px center`,
            backgroundSize: '1440px auto',
            overflow: 'hidden'
          }}
        >
          <Stack
            direction={'row'}
            sx={{
              width: '100%',
              padding: '0 20px'
            }}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <WithAnimation
              Component={Stack}
              sx={{
                height: 418
              }}
              justifyContent={'center'}
              alignItems={'flex-start'}
              gap={30}
            >
              <Typography
                className="home-app-step3"
                sx={{
                  fontSize: 36,
                  fontWeight: 500,
                  color: 'var(--ps-text-100)'
                }}
              >
                Club #{rewardInfo?.id}
              </Typography>
              <Stack direction={'row'} gap={20}>
                <Stack gap={16}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: 15,
                      color: 'var(--ps-neutral3)',
                      lineHeight: '15px'
                    }}
                  >
                    Current Number of Participants
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: 20,
                      color: 'var(--ps-text-100)',
                      lineHeight: '20px'
                    }}
                  >
                    {currentParticipants.toNumber()}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: '1px',
                    height: '100%',
                    background: 'var(--ps-neutral3)'
                  }}
                ></Box>
                <TimeDown currentEpoch={currentEpoch.times(1000).toNumber()} isMd={isMd} />
              </Stack>
              <LotteryButton
                userIsBet={userIsBet}
                userIsWon={userIsWon}
                bet={bet}
                currentEpoch={currentEpoch.toNumber()}
              />
            </WithAnimation>
            {/* <Cards /> */}
          </Stack>
          <Stack
            direction={'column'}
            sx={{
              width: '100%',
              padding: '0 0 0 20px'
            }}
            alignItems={'center'}
          >
            <WithAnimation
              Component={Typography}
              variant="h4"
              sx={{
                width: '99%',
                color: 'var(--ps-text-100)',
                textAlign: 'left',
                fontSize: 15
              }}
              mb={24}
            >
              Daily BounceClub Lottery Records
              {((userIsBet && !userIsWon) || userIsBet) && (
                <Button sx={{ ml: userIsWon ? '0' : '16px' }} variant="contained" size="large" onClick={unBet}>
                  {' '}
                  Withdraw my entry
                </Button>
              )}
              {userIsWon && (
                <Button sx={{ ml: '16px' }} variant="contained" size="large" onClick={() => router.push('/claimClub')}>
                  {' '}
                  Claim Club
                </Button>
              )}
            </WithAnimation>
            {rewardInfo?.list && (
              <WithAnimation
                Component={BoxSwiper}
                handleOpenItem={handleClickOpen}
                rewardList={rewardInfo.list}
              ></WithAnimation>
            )}
          </Stack>
          {renderMarket}
        </Stack>
        {/*<SimpleDialog*/}
        {/*  open={open}*/}
        {/*  onClose={() => {*/}
        {/*    setOpen(false)*/}
        {/*  }}*/}
        {/*/>*/}
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Club Market</title>
      </Head>
      <Stack
        direction={'column'}
        justifyContent={'flex-start'}
        alignItems={'center'}
        sx={{
          background: `url(${BannerBg.src}) no-repeat top 70px center`,
          backgroundSize: '1440px auto',
          marginTop: 70
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              '@media (max-width: 1200px)': {
                overflowX: 'hidden'
              }
            }}
          >
            <Stack
              sx={{
                height: 418
              }}
              justifyContent={'center'}
              alignItems={'flex-start'}
              gap={40}
            >
              <Typography
                sx={{
                  fontSize: 64,
                  fontWeight: 500,
                  color: 'var(--ps-text-100)'
                }}
              >
                Club #{rewardInfo?.id}
              </Typography>
              <Stack direction={'row'} gap={20}>
                <Stack gap={16}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'var(--ps-neutral3)',
                      lineHeight: '11px'
                    }}
                  >
                    Current Number of Participants
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'var(--ps-text-100)',
                      lineHeight: '20px'
                    }}
                  >
                    {currentParticipants.toNumber()}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: '1px',
                    height: '100%',
                    background: 'var(--ps-neutral3)'
                  }}
                ></Box>
                <Stack gap={16}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'var(--ps-neutral3)',
                      lineHeight: '11px'
                    }}
                  >
                    Lottery ends in
                  </Typography>
                  <TimeDown currentEpoch={currentEpoch.times(1000).toNumber()} isMd={isMd} />
                </Stack>
              </Stack>
              <LotteryButton
                userIsBet={userIsBet}
                userIsWon={userIsWon}
                bet={bet}
                currentEpoch={currentEpoch.toNumber()}
              />
            </Stack>
            <Cards />
          </Stack>
        </Container>

        <Container maxWidth="lg">
          <Stack
            alignItems="center"
            sx={{
              '@media (max-width: 1200px)': {
                height: 400
              }
            }}
          >
            <Typography
              variant="h4"
              sx={{
                width: '100%',
                color: 'var(--ps-text-100)',
                textAlign: 'left'
              }}
              mb={24}
            >
              Daily BounceClub Lottery Records
              {((userIsBet && !userIsWon) || userIsBet) && (
                <Button sx={{ ml: userIsWon ? '0' : '16px' }} variant="contained" size="large" onClick={unBet}>
                  {' '}
                  Withdraw my entry
                </Button>
              )}
              {userIsWon && (
                <Button sx={{ ml: '16px' }} variant="contained" size="large" onClick={() => router.push('/claimClub')}>
                  {' '}
                  Claim Club
                </Button>
              )}
            </Typography>
            {rewardInfo?.list && <BoxSwiper handleOpenItem={handleClickOpen} rewardList={rewardInfo.list} />}
          </Stack>
        </Container>
      </Stack>
      {renderMarket}
      {/*<SimpleDialog*/}
      {/*  open={open}*/}
      {/*  onClose={() => {*/}
      {/*    setOpen(false)*/}
      {/*  }}*/}
      {/*/>*/}
    </>
  )
}
