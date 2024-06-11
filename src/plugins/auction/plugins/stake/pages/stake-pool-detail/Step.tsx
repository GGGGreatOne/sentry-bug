import { Box, Stack, Typography, Step, Avatar, styled } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import UserSvg from '../../../../assets/svg/userIcon.svg'
import CheckSvg from '../../../../assets/svg/check_green.svg'
import WonderSvg from '../../../../assets/svg/wonderIcon_black.svg'
import dayjs from 'dayjs'
import { useCountDown } from 'ahooks'
import { useActiveWeb3React } from 'hooks'
import { CurrencyAmount } from 'constants/token'
import FailSVG from '../../../../assets/svg/dark_fail.svg'
import BigNumber from 'bignumber.js'
import {
  BoldTextStyle,
  CardContentBoldTextStyle,
  CardContentStyle,
  CardContentTitleStyle,
  CardLabelStyle,
  CountdownBtnStyle,
  NotInvolvedContainer,
  NotInvolvedTitle,
  StakeButton,
  StepContentStyle,
  StepLabelStyle,
  StepperStyle
} from './components/step/comps'
import { CoinResultType } from '../../constants/type'
import { useCurrencyBalance } from 'hooks/useToken'
import { useWalletModalToggle } from 'state/application/hooks'
import { globalDialogControl } from 'components/Dialog'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'
import { useClaimToken0, useClaimToken1 } from '../../hooks/useStakeHooks'
import stakingDialogControl from '../../components/modal'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { IAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import { useGetBoxInfo } from 'hooks/boxes/useGetBoxInfo'
import AddIcon from '@mui/icons-material/Add'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import { PoolStatus } from 'api/type'

const InterTitle = styled(Typography)`
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
`

export function Steps({
  coinInfo,
  auctionInfo,
  boxAddress,
  hasPermission
}: {
  coinInfo: CoinResultType | undefined
  auctionInfo: IAuctionPoolInfo
  boxAddress: string | undefined
  hasPermission: boolean
}) {
  return (
    <Stack
      // spacing={{ xs: 30, md: 40 }}
      padding={{ xs: '10px 16px', md: '40px 72px' }}
      sx={{ width: '100%', maxWidth: 1440, margin: '0 auto' }}
    >
      <VerticalLinearStepper
        hasPermission={hasPermission}
        auctionInfo={auctionInfo}
        coinInfo={coinInfo}
        boxAddress={boxAddress}
      />
    </Stack>
  )
}
enum TStep {
  'COMING_SOON' = -1,
  'SUBSCRIPTION_PERIOD',
  'FINAL_TOKEN_DISTRIBUTION'
}
const nowDate = () => new Date().getTime()
function VerticalLinearStepper({
  coinInfo,
  auctionInfo,
  boxAddress,
  hasPermission
}: {
  coinInfo: CoinResultType | undefined
  auctionInfo: IAuctionPoolInfo
  boxAddress: string | undefined
  hasPermission: boolean
}) {
  const curStatus = useMemo(() => {
    if (!coinInfo || !Object.keys(coinInfo).length) return TStep.COMING_SOON
    if (coinInfo.poolStatus === PoolStatus.Upcoming) {
      return TStep.COMING_SOON
    }
    if (coinInfo.poolStatus === PoolStatus.Live) {
      return TStep.SUBSCRIPTION_PERIOD
    }
    return TStep.FINAL_TOKEN_DISTRIBUTION
  }, [coinInfo])
  const [activeStep, setActiveStep] = useState<TStep>(TStep.SUBSCRIPTION_PERIOD)
  useEffect(() => {
    setActiveStep(curStatus === TStep.COMING_SOON ? TStep.SUBSCRIPTION_PERIOD : curStatus)
  }, [curStatus])

  const steps = [
    {
      label: 'Staked Calculation Period',
      content: (
        <Step1
          hasPermission={hasPermission}
          status={curStatus}
          coinInfo={coinInfo}
          auctionInfo={auctionInfo}
          boxAddress={boxAddress}
        />
      )
    },
    {
      label: 'Final Token Distribution',
      content: (
        <Step2
          hasPermission={hasPermission}
          status={curStatus}
          coinInfo={coinInfo}
          auctionInfo={auctionInfo}
          boxAddress={boxAddress}
        />
      )
    }
  ]

  const renderTime = useMemo(() => {
    if (!coinInfo || !coinInfo.openAt || !coinInfo.closeAt) return ['--', '--']
    return [
      dayjs(coinInfo.openAt * 1000).format('YYYY-MM-DD HH:mm'),
      dayjs(coinInfo.closeAt * 1000).format('YYYY-MM-DD HH:mm')
    ]
  }, [coinInfo])
  return (
    <Box>
      <StepperStyle activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabelStyle
              optional={
                <Typography variant="caption" sx={{}}>
                  {coinInfo && renderTime[index]}
                </Typography>
              }
            >
              {step.label}
            </StepLabelStyle>
            <StepContentStyle>{step?.content}</StepContentStyle>
          </Step>
        ))}
      </StepperStyle>
    </Box>
  )
}

function Step1({
  status,
  coinInfo,
  auctionInfo,
  boxAddress,
  hasPermission
}: {
  status: TStep
  coinInfo: CoinResultType | undefined
  auctionInfo: IAuctionPoolInfo
  boxAddress: string | undefined
  hasPermission: boolean
}) {
  const { account, chainId } = useActiveWeb3React()
  const { data: userInfo } = useGetBoxInfo(auctionInfo.auction?.boxId)
  const poolId = auctionInfo.auction?.factoryPoolId
  const token1Balance = useCurrencyBalance(account, coinInfo?.token1, chainId)

  const curTime = useMemo(() => {
    if (!coinInfo || !Object.keys(coinInfo).length) {
      return undefined
    }
    if (coinInfo.openAt && status === TStep.COMING_SOON) {
      return coinInfo.openAt * 1000
    }
    if (coinInfo.closeAt) {
      return coinInfo.closeAt * 1000
    }
    return undefined
  }, [coinInfo, status])

  const [, formattedRes] = useCountDown({
    targetDate: curTime
  })
  const { days, hours, minutes, seconds } = formattedRes
  const renderCountDown = useMemo(() => {
    if (!coinInfo || !Object.keys(coinInfo).length) {
      return (
        <>
          <b>--</b> Days <b>--</b> Hours <b>--</b> Mins <b>--</b> Secs
        </>
      )
    }
    return (
      <>
        <b>{days}</b> Days <b>{hours}</b> Hours <b>{minutes}</b> Mins <b>{seconds}</b> Secs
      </>
    )
  }, [coinInfo, days, hours, minutes, seconds])

  const showLoginModal = useWalletModalToggle()

  const handleClickStake = useCallback(() => {
    if (!token1Balance) return
    stakingDialogControl.show('StakeAuctionInput', {
      poolId,
      token1Address: coinInfo?.token1?.address,
      showLoginModal,
      switchNetwork: () => {
        globalDialogControl.show('SwitchNetworkDialog')
      },
      boxAddress
    })
  }, [boxAddress, coinInfo?.token1?.address, poolId, showLoginModal, token1Balance])
  const isBalanceInsufficient = useMemo(() => {
    if (!token1Balance) return false
    return !token1Balance.greaterThan('0')
  }, [token1Balance])
  const _switchNetwork = () => {
    globalDialogControl.show('SwitchNetworkDialog')
  }
  const actionBtn = useMemo(() => {
    if (!account) {
      return <StakeButton onClick={showLoginModal}>Connect Wallet</StakeButton>
    }
    if (!chainId || !SUPPORT_NETWORK_CHAIN_IDS.includes(chainId)) {
      return <StakeButton onClick={() => _switchNetwork()}>Switch Network</StakeButton>
    }
    if (isBalanceInsufficient) {
      return <StakeButton disabled>Insufficient Balance</StakeButton>
    }
    if (status === TStep.COMING_SOON) {
      return (
        <StakeButton disabled endIcon={<AddIcon />}>
          Stake
        </StakeButton>
      )
    }
    if (status === TStep.SUBSCRIPTION_PERIOD) {
      return (
        <StakeButton
          disabled={!token1Balance || !hasPermission}
          onClick={() => handleClickStake()}
          endIcon={<AddIcon />}
        >
          Stake
        </StakeButton>
      )
    }
    return (
      <StakeButton disabled endIcon={<AddIcon />}>
        Stake
      </StakeButton>
    )
  }, [account, chainId, handleClickStake, isBalanceInsufficient, showLoginModal, status, token1Balance, hasPermission])

  return (
    <>
      <Stack spacing={{ xs: 16, md: 24 }} mt={{ xs: 16, md: 24 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 8, md: 16 }}
          height={{ xs: 'auto', md: 24 }}
          alignItems={'center'}
        >
          <InterTitle
            sx={{
              color: ' rgba(255, 255, 255, 0.80)',
              fontSize: '16px'
            }}
          >
            {status === TStep.COMING_SOON ? 'Time left until staked start:' : 'Time left until subscription ends:'}
          </InterTitle>
          <InterTitle
            sx={{
              color: ' rgba(255, 255, 255, 0.80)',
              lineHeight: '14px',
              b: {
                color: '#E1F25C',
                fontSize: 20
              }
            }}
          >
            {renderCountDown}
          </InterTitle>
        </Stack>
        <Box
          sx={{
            width: { xs: '100%', md: 1000 },
            borderRadius: '24px',
            background: '#fff',
            display: { xs: 'grid', md: 'flex' }
          }}
        >
          <Box
            sx={{
              padding: 16
            }}
          >
            <Stack
              spacing={{ xs: 30, md: 40 }}
              sx={{
                width: { xs: '100%', md: '500px' },
                padding: { xs: 16, md: '24px 30px' },
                borderRadius: '20px',
                background: '#f5f5f1',
                height: { xs: 'auto', md: 376 }
              }}
            >
              <Box
                sx={{
                  display: { xs: 'grid', md: 'flex' },
                  gap: { xs: 8, md: 16 }
                }}
              >
                <Avatar
                  src={userInfo?.boxBasicInfo?.avatar || DefaultAvatar.src}
                  sx={{ width: 60, height: 60, borderRadius: '50%' }}
                />
                <Stack spacing={4} maxWidth={{ xs: 'auto', md: 350 }}>
                  <CardLabelStyle
                    sx={{
                      b: {
                        color: '#2B51DA',
                        fontSize: '20px',
                        fontWeight: '600'
                      }
                    }}
                  >
                    {auctionInfo.auction?.name}
                  </CardLabelStyle>
                  <CardContentStyle>
                    Stake ${coinInfo?.token1?.symbol?.toLocaleUpperCase() || '--'} to earn proportional $
                    {coinInfo?.token0?.symbol?.toLocaleUpperCase() || '--'} allocation
                  </CardContentStyle>
                </Stack>
              </Box>
              <Stack spacing={{ xs: 20, md: 30 }}>
                <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}>
                  <Stack spacing={8}>
                    <CardContentStyle>Sale Price</CardContentStyle>
                    <CardLabelStyle>
                      {coinInfo?.swapRatio?.toSignificant()} {coinInfo?.token1?.symbol?.toLocaleUpperCase() || '--'}
                    </CardLabelStyle>
                  </Stack>
                  <Stack spacing={8}>
                    <CardContentStyle>
                      Total Supply of {coinInfo?.token0?.symbol?.toLocaleUpperCase() || '--'}
                    </CardContentStyle>
                    <CardLabelStyle>{coinInfo?.currencyAmountTotal0?.toSignificant() || '--'}</CardLabelStyle>
                  </Stack>
                </Stack>
                <Stack spacing={8}>
                  <CardContentStyle>Total Committed Amount / Total Raise</CardContentStyle>
                  <CardLabelStyle>
                    {coinInfo?.currencyAmountSwap1?.toSignificant() || '--'}{' '}
                    {coinInfo?.token1?.symbol?.toLocaleUpperCase() || '--'} /{' '}
                    {coinInfo?.currencyAmountTotal1?.toSignificant() || '--'}{' '}
                    {coinInfo?.token1?.symbol?.toLocaleUpperCase() || '--'}
                  </CardLabelStyle>
                </Stack>
                <Stack spacing={8}>
                  <CardContentStyle>Participants</CardContentStyle>
                  <CardLabelStyle>
                    {coinInfo?.totalParticipants ? coinInfo?.totalParticipants.toString() : '--'}
                  </CardLabelStyle>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Stack
            spacing={{ xs: 30, md: 50 }}
            sx={{
              padding: { xs: '24px', md: '40px 30px' }
            }}
          >
            <Stack spacing={{ xs: 20, md: 30 }}>
              <Stack spacing={12}>
                <BoldTextStyle>
                  {coinInfo?.token0 && coinInfo?.finalAllocation?.mySwappedAmount0.gt('0')
                    ? CurrencyAmount.fromRawAmount(
                        coinInfo?.token0,
                        coinInfo?.finalAllocation?.mySwappedAmount0.toString()
                      )?.toSignificant()
                    : '0'}{' '}
                  {coinInfo?.token0?.symbol?.toLocaleUpperCase() || '--'}
                </BoldTextStyle>
                <Typography
                  sx={{
                    color: '#959595',
                    fontSize: '16px',
                    lineHeight: '12px'
                  }}
                  variant="body1"
                >
                  My Estimated Allocation
                </Typography>
              </Stack>

              <Stack spacing={8}>
                <CardContentStyle>Your Stake</CardContentStyle>
                <CardLabelStyle>
                  {coinInfo?.myToken1Amount?.toSignificant() || '--'}{' '}
                  {coinInfo?.token1?.symbol?.toLocaleUpperCase() || '--'}
                </CardLabelStyle>
              </Stack>
              <Stack spacing={8}>
                <CardContentStyle>Your Pool Share</CardContentStyle>
                {/* TODO: Number(coinInfo.currencyAmountTotal1) > 0 ???? */}
                <CardLabelStyle>
                  {coinInfo?.currencyAmountSwap1?.greaterThan('0')
                    ? new BigNumber(coinInfo?.myToken1Amount?.toExact() || '0')
                        .div(coinInfo.currencyAmountSwap1.toExact() || '0')
                        .times('100')
                        .toFixed(2)
                    : '0'}
                  %
                </CardLabelStyle>
              </Stack>
            </Stack>
            {actionBtn}
          </Stack>
        </Box>
      </Stack>
    </>
  )
}

function Step2({
  status,
  coinInfo,
  auctionInfo,
  boxAddress,
  hasPermission
}: {
  status: TStep
  coinInfo: CoinResultType | undefined
  auctionInfo: IAuctionPoolInfo
  boxAddress: string | undefined
  hasPermission: boolean
}) {
  const { account, chainId } = useActiveWeb3React()
  const poolId = auctionInfo.auction?.factoryPoolId
  const token0 = coinInfo?.token0
  const token1 = coinInfo?.token1
  const token0TotalAmount = coinInfo?.currencyAmountTotal0
  const [countDown, formattedRes] = useCountDown({
    targetDate: coinInfo?.claimAt ? coinInfo?.claimAt * 1000 : 0
  })
  const canClaimToken0Amount = useMemo(() => {
    if (token0 && coinInfo?.finalAllocation?.mySwappedAmount0.gt('0') && coinInfo.claimedToken0) {
      return CurrencyAmount.fromRawAmount(token0, coinInfo?.finalAllocation?.mySwappedAmount0?.toString())?.subtract(
        CurrencyAmount.fromRawAmount(token0, coinInfo.claimedToken0.toString())
      )
    }
    return undefined
  }, [coinInfo?.claimedToken0, coinInfo?.finalAllocation?.mySwappedAmount0, token0])
  const { runWithModal: claimToken0, submitted: claimToken0Submitted } = useClaimToken0(
    poolId,
    boxAddress,
    canClaimToken0Amount
  )
  const canClaimToken1Amount = useMemo(() => {
    if (token1 && coinInfo?.finalAllocation?.myUnSwappedAmount1?.gt('0')) {
      return CurrencyAmount.fromRawAmount(token1, coinInfo.finalAllocation?.myUnSwappedAmount1.toString())
    }
    return undefined
  }, [coinInfo?.finalAllocation?.myUnSwappedAmount1, token1])
  const { runWithModal: claimToken1, submitted: claimToken1Submitted } = useClaimToken1(
    poolId,
    boxAddress,
    canClaimToken1Amount
  )

  const canClaimToken0 = useMemo(() => {
    if (!coinInfo || !Object.keys(coinInfo).length) return false
    if (coinInfo.claimedToken0?.eq(coinInfo.finalAllocation?.mySwappedAmount0 || '0')) return false
    const now = nowDate()

    if (coinInfo.claimAt && Number(now) > coinInfo.claimAt * 1000) {
      const flag =
        (coinInfo.claimedToken0 &&
          coinInfo.finalAllocation?.mySwappedAmount0 &&
          coinInfo.claimedToken0 &&
          coinInfo.releaseDuration &&
          new BigNumber(coinInfo.finalAllocation?.mySwappedAmount0.toString())
            .times(
              Number(now) > coinInfo.claimAt * 1000 + coinInfo.releaseDuration * 1000
                ? 1
                : (Number(now) - coinInfo.claimAt * 1000) / (coinInfo.releaseDuration * 1000)
            )
            .minus(coinInfo.claimedToken0.toString())
            .gt(0)) ||
        false
      return flag
    }
    return false
  }, [coinInfo])

  const claimableToken0Amount = useMemo(() => {
    if (!coinInfo?.claimedToken0 || !coinInfo?.finalAllocation?.mySwappedAmount0) {
      return undefined
    }
    const now = nowDate()
    if (coinInfo.claimAt && Number(now) > coinInfo.claimAt * 1000) {
      return (
        coinInfo.claimedToken0 &&
        coinInfo.releaseDuration &&
        new BigNumber(coinInfo.finalAllocation.mySwappedAmount0.toString())
          .times(
            Number(now) > coinInfo.claimAt * 1000 + coinInfo.releaseDuration * 1000
              ? 1
              : (Number(now) - coinInfo.claimAt * 1000) / (coinInfo.releaseDuration * 1000)
          )
          .minus(new BigNumber(coinInfo.claimedToken0.toString()))
      )
    }
    return undefined
  }, [
    coinInfo?.claimAt,
    coinInfo?.claimedToken0,
    coinInfo?.finalAllocation?.mySwappedAmount0,
    coinInfo?.releaseDuration
  ])

  const showLoginModal = useWalletModalToggle()
  const _switchNetwork = () => {
    globalDialogControl.show('SwitchNetworkDialog')
  }

  return (
    <Stack spacing={24} mt={24}>
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.80)',
          fontSize: 16,
          maxWidth: 1000
        }}
      >
        The allocation calculation is complete. We will deduct the corresponding{' '}
        {coinInfo?.token0?.symbol?.toLocaleUpperCase() || '--'} from your account based on your final{' '}
        {coinInfo?.token0?.symbol?.toLocaleUpperCase() || '--'}
        allocation, which will be transferred to your spot account along with your remaining{' '}
        {coinInfo?.token1?.symbol?.toLocaleUpperCase() || '--'}.
      </Typography>
      {account &&
        coinInfo?.myToken1Amount?.equalTo('0') &&
        status === TStep.FINAL_TOKEN_DISTRIBUTION &&
        account !== coinInfo?.creator && (
          <NotInvolvedContainer sx={{ width: { xs: '100%', md: 420 } }}>
            <FailSVG />
            <NotInvolvedTitle>
              You did not stake any ${coinInfo.token1?.symbol?.toUpperCase() || '--'} for this session.
            </NotInvolvedTitle>
          </NotInvolvedContainer>
        )}

      {(!account ||
        coinInfo?.creator === account ||
        (coinInfo?.myToken1Amount && coinInfo?.myToken1Amount.greaterThan('0') && coinInfo)) &&
        status === TStep.FINAL_TOKEN_DISTRIBUTION && (
          <Box
            sx={{
              width: { xs: '100%', md: 1000 },
              borderRadius: '24px',
              background: '#fff',
              display: { xs: 'grid', md: 'flex' }
            }}
          >
            <Box
              sx={{
                padding: 16
              }}
            >
              <Stack
                spacing={{ xs: 20, md: 30 }}
                sx={{
                  width: { xs: '100%', md: 500 },
                  padding: { xs: 16, md: '24px 30px' },
                  borderRadius: '20px',
                  background: '#20201E',
                  height: 306
                }}
              >
                <Stack spacing={16}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center'
                    }}
                  >
                    <CurrencyLogo currencyOrAddress={coinInfo?.token0} />

                    <CardContentTitleStyle>Total Committed</CardContentTitleStyle>
                  </Box>
                  <CardContentBoldTextStyle>
                    {coinInfo?.currencyAmountSwap1?.toSignificant() || '0'} {token1?.symbol?.toLocaleUpperCase()}
                  </CardContentBoldTextStyle>
                </Stack>

                <Stack spacing={16}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center'
                    }}
                  >
                    <CurrencyLogo currencyOrAddress={token0} />
                    <CardContentTitleStyle>Token Amount</CardContentTitleStyle>
                  </Box>
                  <CardContentBoldTextStyle>
                    {token0TotalAmount?.toSignificant() || '0'} {token0?.symbol?.toLocaleUpperCase()}
                  </CardContentBoldTextStyle>
                </Stack>

                <Stack spacing={16}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center'
                    }}
                  >
                    <UserSvg />
                    <CardContentTitleStyle>Total Participants</CardContentTitleStyle>
                  </Box>
                  <CardContentBoldTextStyle>{coinInfo?.totalParticipants?.toString()}</CardContentBoldTextStyle>
                </Stack>
              </Stack>
            </Box>

            <Stack
              spacing={{ xs: 30, md: 40 }}
              sx={{
                width: '100%',
                padding: { xs: '24px', md: '40px 30px' }
              }}
            >
              <Stack spacing={{ xs: 20, md: 30 }}>
                <Stack spacing={{ xs: 8, md: 16 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center'
                    }}
                  >
                    <CheckSvg />
                    <CardContentTitleStyle>Your Final Allocation/Total Supply</CardContentTitleStyle>
                  </Box>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <BoldTextStyle style={{ fontSize: 20 }}>
                      {coinInfo?.finalAllocation?.mySwappedAmount0 && coinInfo?.finalAllocation?.mySwappedAmount0.eq(0)
                        ? '0'
                        : (token0 &&
                            coinInfo?.finalAllocation?.mySwappedAmount0 &&
                            CurrencyAmount.fromRawAmount(
                              token0,
                              coinInfo?.finalAllocation?.mySwappedAmount0?.toString()
                            ).toSignificant()) ||
                          '0'}{' '}
                      {token0?.symbol?.toLocaleUpperCase()} /{' '}
                      {claimableToken0Amount && token0 && claimableToken0Amount.gt('0')
                        ? CurrencyAmount.fromAmount(
                            token0,
                            new BigNumber(claimableToken0Amount.toString())
                              .div(new BigNumber('10').pow(token0.decimals))
                              .toString()
                          )?.toSignificant()
                        : '0'}{' '}
                      {token0?.symbol?.toLocaleUpperCase()}
                    </BoldTextStyle>
                    {countDown > 0 ? (
                      <CountdownBtnStyle style={{ width: 150 }} disabled sx={{ color: '#fff' }}>
                        Lock countdown
                        <Typography color={'#fff'}>
                          {formattedRes.days}d {formattedRes.hours}h {formattedRes.minutes}m {formattedRes.seconds}s
                        </Typography>
                      </CountdownBtnStyle>
                    ) : (
                      <StakeButton
                        style={{ width: 150 }}
                        disabled={!canClaimToken0 || !hasPermission}
                        onClick={() => claimToken0()}
                        loading={claimToken0Submitted.pending}
                      >
                        {coinInfo && coinInfo.claimedToken0?.eq(coinInfo.finalAllocation?.mySwappedAmount0 || '0')
                          ? 'Claimed'
                          : 'Claim'}
                      </StakeButton>
                    )}
                  </Stack>
                </Stack>
                <Stack spacing={{ xs: 8, md: 16 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center'
                    }}
                  >
                    <WonderSvg />
                    <CardContentTitleStyle>Total Amount Staked / Remaining Balance</CardContentTitleStyle>
                  </Box>

                  <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <BoldTextStyle style={{ fontSize: 20 }}>
                      {coinInfo?.myToken1Amount?.toSignificant() || '0'} {token1 && token1.symbol?.toLocaleUpperCase()}{' '}
                      /{' '}
                      {coinInfo?.finalAllocation?.myUnSwappedAmount1 && token1 && coinInfo.myToken1Claimed
                        ? '0'
                        : (token1 &&
                            coinInfo?.finalAllocation?.myUnSwappedAmount1.gt('0') &&
                            CurrencyAmount.fromRawAmount(
                              token1,
                              coinInfo.finalAllocation?.myUnSwappedAmount1.toString()
                            ).toSignificant()) ||
                          '0'}{' '}
                      {token1 && token1.symbol?.toLocaleUpperCase()}
                    </BoldTextStyle>
                    {countDown > 0 ? (
                      <CountdownBtnStyle style={{ width: 150 }} disabled sx={{ color: '#fff' }}>
                        Lock countdown
                        <Typography color={'#fff'}>
                          {formattedRes.days}d {formattedRes.hours}h {formattedRes.minutes}m {formattedRes.seconds}s
                        </Typography>
                      </CountdownBtnStyle>
                    ) : (
                      <StakeButton
                        style={{ width: 150 }}
                        disabled={
                          coinInfo?.myToken1Claimed ||
                          !coinInfo?.finalAllocation?.myUnSwappedAmount1.gt(0) ||
                          !hasPermission
                        }
                        onClick={() => claimToken1()}
                        loading={claimToken1Submitted.pending}
                      >
                        {coinInfo?.myToken1Claimed ? 'Claimed' : 'Claim'}
                      </StakeButton>
                    )}
                  </Stack>
                  {!account && <StakeButton onClick={showLoginModal}>Connect Wallet</StakeButton>}
                  {account && chainId && !SUPPORT_NETWORK_CHAIN_IDS.includes(chainId) && (
                    <StakeButton onClick={_switchNetwork}>Switch network</StakeButton>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        )}
    </Stack>
  )
}
