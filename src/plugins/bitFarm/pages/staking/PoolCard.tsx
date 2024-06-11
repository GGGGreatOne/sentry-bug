import { Box, styled, Button, Stack, Typography, Divider, tooltipClasses } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import ArrowDown from 'assets/svg/boxes/arrow_bottom.svg'
import ArrowTopRight from 'assets/svg/boxes/arrow-top-right.svg'
import AlarmSvg from 'assets/svg/boxes/alarm.svg'
import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import Tooltip from 'components/Tooltip'
import { viewControl } from 'views/editBox/modal'
import { StakePoolParams } from 'api/boxes/type'
import { ExtraInfoData, POOL_TYPE, useStakingPool } from 'plugins/bitFarm/hooks/useStakingPool'
import dayjs from 'dayjs'
import { CurrencyAmount } from 'constants/token'
import isZero, { formatStringLength, shortenAddress } from 'utils'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import { useChainId } from 'wagmi'
import useBreakpoint from 'hooks/useBreakpoint'
import { LoadingButton } from '@mui/lab'
import { usePairContract } from 'components/Widget/hooks/useContract'
import { useSingleCallResult } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'hooks/useToken'
import { useGetAPY } from 'hooks/useGetAPY'

const StyleCard = styled(Box)(({ theme }) => ({
  maxWidth: 360,
  minWidth: 280,
  width: '100%',
  borderRadius: '12px',
  backgroundColor: '#1B1B1B',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    margin: 'auto'
  }
}))

const StyleCardContentBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '310px',
  padding: '24px 16px',
  [theme.breakpoints.down('md')]: {
    height: 292
  }
}))

const StyleCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 500,
  lineHeight: 1.3,
  color: '#fff',
  textTransform: 'capitalize',
  [theme.breakpoints.down('md')]: {
    fontSize: 15
  }
}))

const StyleCardSubtitle = styled(Typography)(() => ({
  fontSize: 12,
  lineHeight: 1.4,
  color: '#959595'
}))

const StyleCardContent = styled(Typography)(({ theme }) => ({
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1,
  color: 'var(--ps-test-100)',
  [theme.breakpoints.down('md')]: {
    fontSize: 13
  }
}))

const StyleContentGray = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1.4,
  color: '#959595',
  [theme.breakpoints.down('md')]: {
    fontSize: 12
  }
}))

const StyleRow = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const StylePoolStatusBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  borderRadius: '0 12px 0 16px',
  padding: '0 12px',
  height: 32,
  position: 'absolute',
  top: 0,
  right: 0,
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    height: 25
  }
}))

const StyleCardBottomTextButton = styled(Typography)(() => ({
  height: 35,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid var(--ps-text-40)',
  width: '100%',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '20px',
  color: 'var(--ps-text-100)',
  gap: '4px',
  cursor: 'pointer',
  padding: '0 16px',
  svg: {
    path: {
      fill: 'var(--ps-text-100)'
    }
  }
}))

const StyleRemoveButton = styled(Box)(() => ({
  height: 20,
  width: 20,
  borderRadius: '50%',
  backgroundColor: 'var(--ps-text-10)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  ':hover': {
    opacity: 0.7
  },
  span: {
    display: 'inline-flex',
    width: '10px',
    height: '1.25px',
    backgroundColor: '#fff'
  }
}))

function PoolStatus({
  isStart,
  isEnd,
  startTime,
  endTime
}: {
  isStart?: boolean
  isEnd?: boolean
  startTime?: number
  endTime?: number
}) {
  if (!startTime || !endTime) {
    return (
      <StylePoolStatusBox
        sx={{
          backgroundColor: 'var(--ps-grey-01)',
          svg: {
            path: {
              fill: 'var(--ps-text-60)'
            }
          }
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'var(--ps-text-60)'
          }}
        >
          loading
        </Typography>

        <AlarmSvg />
      </StylePoolStatusBox>
    )
  }
  if (isEnd) {
    return (
      <>
        <Tooltip
          title={
            <Typography fontSize={12}>
              End Time(UTC time):
              <br />
              {endTime
                ? dayjs(endTime * 1000)
                    .utc()
                    .format('MMM D, YYYY, h:mm A')
                : '--'}
            </Typography>
          }
          sx={{
            maxWidth: 158,
            [`& .${tooltipClasses.tooltip}`]: {
              backgroundColor: '#3D3D3D',
              borderRadius: '8px',
              padding: '8px 12px'
            }
          }}
        >
          <StylePoolStatusBox
            sx={{
              backgroundColor: '#FF3030',
              svg: {
                path: {
                  fill: '#fff'
                }
              }
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.4,
                color: 'var(--ps-green2)'
              }}
            >
              Ended
            </Typography>

            <AlarmSvg />
          </StylePoolStatusBox>
        </Tooltip>
      </>
    )
  }
  if (!isStart) {
    return (
      <Tooltip
        title={
          <Typography fontSize={12}>
            Start Time(UTC time):
            <br />
            {startTime
              ? dayjs(startTime * 1000)
                  .utc()
                  .format('MMM D, YYYY, h:mm A')
              : '--'}
          </Typography>
        }
        sx={{
          maxWidth: 158,
          [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#3D3D3D',
            borderRadius: '8px',
            padding: '8px 12px'
          }
        }}
      >
        <StylePoolStatusBox
          sx={{
            backgroundColor: '#4C6FFF'
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'var(--ps-green2)'
            }}
          >
            Soon
          </Typography>

          <AlarmSvg />
        </StylePoolStatusBox>
      </Tooltip>
    )
  }
  return (
    <>
      <Tooltip
        title={
          <Typography fontSize={12}>
            End Time(UTC time):
            <br />
            {endTime
              ? dayjs(endTime * 1000)
                  .utc()
                  .format('MMM D, YYYY, h:mm A')
              : '--'}
          </Typography>
        }
        sx={{
          maxWidth: 158,
          [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#3D3D3D',
            borderRadius: '8px',
            padding: '8px 12px'
          }
        }}
      >
        <StylePoolStatusBox
          sx={{
            backgroundColor: !isStart ? '#4C6FFF' : '#30AD44'
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'var(--ps-green2)'
            }}
          >
            Live
          </Typography>

          <AlarmSvg />
        </StylePoolStatusBox>
      </Tooltip>
    </>
  )
}

function BottomPoolDetails({
  poolContract,
  totalRewardAmount,
  rewardAmount
}: {
  poolContract?: string | undefined
  totalRewardAmount?: CurrencyAmount | undefined
  rewardAmount?: string | undefined
}) {
  const chainId = useChainId()
  return (
    <Stack
      spacing={10}
      sx={{
        padding: '0 16px 16px'
      }}
    >
      <StyleRow
        sx={{
          paddingTop: '10px',
          borderTop: '1px solid var(--ps-neutral2)'
        }}
      >
        <StyleContentGray>Total Rewards Token</StyleContentGray>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px'
            }}
          >
            {totalRewardAmount?.toSignificant(4) || '--'}
          </Typography>
          <CurrencyLogo currencyOrAddress={totalRewardAmount?.currency.address} size="18px" />
        </Box>
      </StyleRow>
      <StyleRow>
        <StyleContentGray>To Be Released </StyleContentGray>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px'
            }}
          >
            {rewardAmount || 0}
          </Typography>
          <CurrencyLogo currencyOrAddress={totalRewardAmount?.currency.address} size="18px" />
        </Box>
      </StyleRow>
      <StyleRow>
        <StyleContentGray>Pool Contract</StyleContentGray>
        {poolContract ? (
          <Link
            href={getEtherscanLink(chainId, poolContract || '', 'address')}
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px'
              }}
            >
              {poolContract ? shortenAddress(poolContract) : '--'}
            </Typography>
            <ArrowTopRight />
          </Link>
        ) : (
          '--'
        )}
      </StyleRow>
      <StyleRow>
        <StyleContentGray>Reward Token </StyleContentGray>

        {totalRewardAmount?.currency.address && isZero(totalRewardAmount?.currency.address) ? (
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px'
            }}
          >
            {totalRewardAmount.currency.symbol}
          </Typography>
        ) : (
          <>
            {totalRewardAmount ? (
              <Link
                href={getEtherscanLink(chainId, totalRewardAmount?.currency.address || '', 'token')}
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '20px'
                  }}
                >
                  {shortenAddress(totalRewardAmount.currency.address) || '--'}
                </Typography>
                <ArrowTopRight />
              </Link>
            ) : (
              '--'
            )}
          </>
        )}
      </StyleRow>
    </Stack>
  )
}

export const DoubleTokenCard = ({
  boxAddress,
  poolInfo,
  editing,
  listing,
  isPermission
}: {
  boxAddress: string | undefined
  poolInfo: StakePoolParams | undefined
  editing?: boolean | undefined
  listing?: boolean
  isPermission?: boolean
}) => {
  const isMd = useBreakpoint('md')
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false)
  const { pool, claimCallback, refundRunCallback } = useStakingPool(boxAddress, poolInfo?.instanceAddress)
  const [claimLoading, setClaimLoading] = useState<boolean>(false)
  const [refundLoading, setRefundLoading] = useState<boolean>(false)

  const { chainId } = useActiveWeb3React()
  const pairContract = usePairContract(poolInfo?.token0Contract)

  const token0Address = useSingleCallResult(chainId, pairContract, 'token0')?.result?.[0] as string | undefined
  const token1Address = useSingleCallResult(chainId, pairContract, 'token1')?.result?.[0] as string | undefined

  const _LPToken = useToken(poolInfo?.token0Contract || '', chainId)
  const token0 = useToken(token0Address || '', chainId)
  const token1 = useToken(token1Address || '', chainId)

  const APY = useGetAPY({
    stakeLPToken: {
      token0,
      token1
    },
    rewardsTokenAddress: pool?.rewardToken.address,
    totalRewardTokenAmount: pool?.rewardTokenAmount.toExact(),
    duration: pool?.duration,
    totalStakeTokenAmount: pool?.curTotalStakedAmount.toExact()
  })

  const extraInfo: ExtraInfoData = useMemo(() => {
    if (poolInfo?.extraInfo) {
      return JSON.parse(poolInfo?.extraInfo)
    }
    return undefined
  }, [poolInfo?.extraInfo])

  const currentTime = Math.ceil(Date.now() / 1000)

  const refundAmount = useMemo(() => {
    if (
      pool?.allocatedRewardAmount &&
      pool?.rewardTokenAmount &&
      pool?.allocatedRewardAmount?.lessThan(pool?.rewardTokenAmount)
    ) {
      return pool.rewardTokenAmount.subtract(pool.allocatedRewardAmount)
    }
    return undefined
  }, [pool?.allocatedRewardAmount, pool?.rewardTokenAmount])

  const endTime = useMemo(() => {
    return pool?.endTime
  }, [pool?.endTime])

  const isEnd = useMemo(() => {
    if (endTime) {
      if (endTime <= currentTime) {
        return true
      }
      return false
    }
    return undefined
  }, [currentTime, endTime])

  const isStart = useMemo(() => {
    if (pool?.startTime) {
      if (pool?.startTime <= currentTime) {
        return true
      }
      return false
    }
    return undefined
  }, [currentTime, pool?.startTime])

  const ClaimRefund = useCallback(async () => {
    setRefundLoading(true)
    try {
      await refundRunCallback()
      setRefundLoading(false)
    } catch (error) {
      console.error(error)
      setRefundLoading(false)
    }
  }, [refundRunCallback])

  const ClaimRewardToken = useCallback(async () => {
    setClaimLoading(true)
    try {
      await claimCallback()
      setClaimLoading(false)
    } catch (error) {
      console.error(error)
      setClaimLoading(false)
    }
  }, [claimCallback])

  return (
    <StyleCard
      sx={{
        height: { xs: isShowDetail ? 465 : 330, md: isShowDetail ? 482 : 345 },
        transition: 'all 0.3s',
        overflow: 'hidden'
      }}
    >
      <PoolStatus isStart={isStart} isEnd={isEnd} startTime={pool?.startTime} endTime={endTime} />
      <StyleCardContentBox>
        <Stack
          spacing={24}
          sx={{
            width: '100%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DoubleCurrencyLogo currency0={token0 || undefined} currency1={token1 || undefined} size={isMd ? 30 : 40} />
            <Stack spacing={4}>
              <StyleCardTitle noWrap maxWidth={200}>
                {extraInfo?.title ?? '--'}
              </StyleCardTitle>
              <StyleCardSubtitle>
                Stake{' '}
                {token0?.symbol && token1?.symbol
                  ? `${formatStringLength(token0?.symbol)} / ${formatStringLength(token1?.symbol)}`
                  : '--'}{' '}
                Earn {formatStringLength(pool?.rewardToken.symbol) || '--'}
              </StyleCardSubtitle>
            </Stack>
          </Box>
          <Stack spacing={16}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                height: { xs: 50, md: 60 }
              }}
            >
              <Stack spacing={4}>
                <Typography
                  sx={{
                    fontSize: { xs: 20, md: 28 },
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: '#4C6FFF',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {APY?.isZero() || !APY ? (
                    '--'
                  ) : (
                    <>
                      {APY?.toFixed(2) || '--'}
                      <b
                        style={{
                          fontSize: 15
                        }}
                      >
                        %
                      </b>
                    </>
                  )}
                </Typography>
                <StyleContentGray>Mining APY</StyleContentGray>
              </Stack>
              <Stack spacing={4} justifyContent={'end'}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4
                  }}
                >
                  <StyleCardContent>{pool?.curTotalStakedAmount?.toSignificant(4) || 0}</StyleCardContent>
                  <DoubleCurrencyLogo currency0={token0 || undefined} currency1={token1 || undefined} size={16} />
                </Box>

                <StyleContentGray>Total Liquidity</StyleContentGray>
              </Stack>
            </Box>
            <Divider
              variant="inset"
              sx={{
                backgroundColor: 'var(--ps-neutral2)'
              }}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Stack spacing={4}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4
                  }}
                >
                  <StyleCardContent>{pool?.myStakedOf?.toSignificant(4) || 0}</StyleCardContent>
                  <DoubleCurrencyLogo currency0={token0 || undefined} currency1={token1 || undefined} size={16} />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '10px',
                    height: 17
                  }}
                >
                  <StyleContentGray>You Staked </StyleContentGray>
                  {pool?.myStakedOf?.greaterThan('0') && (
                    <StyleRemoveButton
                      onClick={() => {
                        viewControl.show('UnStakeTokenModal', {
                          boxAddress,
                          stakingAddress: poolInfo?.instanceAddress,
                          stakeToken: _LPToken || undefined,
                          isLPToken: true,
                          token0: token0 || undefined,
                          token1: token1 || undefined
                        })
                      }}
                    >
                      <span />
                    </StyleRemoveButton>
                  )}
                </Box>
              </Stack>
              <Stack spacing={4}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4
                  }}
                >
                  <StyleCardContent>{pool?.myClaimableOf?.toSignificant(4) || 0}</StyleCardContent>
                  <CurrencyLogo currencyOrAddress={poolInfo?.token1Contract} size="16px" />
                </Box>

                <StyleContentGray>Claimable Rewards</StyleContentGray>
              </Stack>
            </Box>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              gap: 12,
              width: '100%'
            }}
          >
            {isEnd && refundAmount && editing ? (
              <LoadingButton
                loading={refundLoading}
                disabled={listing}
                variant="contained"
                sx={{
                  height: { xs: 36, md: 44 },
                  width: '100%'
                }}
                onClick={ClaimRefund}
              >
                Claim Refund
              </LoadingButton>
            ) : (
              <Button
                disabled={!isStart || isEnd || !isPermission}
                variant="contained"
                sx={{
                  height: { xs: 36, md: 44 },
                  width: '100%'
                }}
                onClick={() => {
                  viewControl.show('StakeTokenModal', {
                    boxAddress,
                    stakingAddress: poolInfo?.instanceAddress,
                    stakeToken: _LPToken || undefined,
                    isLPToken: true,
                    token0: token0 || undefined,
                    token1: token1 || undefined
                  })
                }}
              >
                Stake
              </Button>
            )}
            <LoadingButton
              loading={claimLoading}
              variant="outlined"
              sx={{
                height: { xs: 36, md: 44 },
                width: '100%'
              }}
              onClick={ClaimRewardToken}
              disabled={!pool?.myClaimableOf?.greaterThan('0') || !isPermission}
            >
              Claim
            </LoadingButton>
          </Box>
        </Stack>
      </StyleCardContentBox>
      <Box
        sx={{
          height: 35,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <StyleCardBottomTextButton
          onClick={() => setIsShowDetail(!isShowDetail)}
          sx={{
            svg: {
              transform: isShowDetail ? 'rotate(180deg)' : 'rotate(0)'
            }
          }}
        >
          Details
          <ArrowDown />
        </StyleCardBottomTextButton>
      </Box>
      {isShowDetail && (
        <BottomPoolDetails
          poolContract={poolInfo?.instanceAddress}
          totalRewardAmount={pool?.rewardTokenAmount}
          rewardAmount={refundAmount?.toSignificant(4)}
        />
      )}
    </StyleCard>
  )
}

export const SingleTokenCard = ({
  boxAddress,
  poolInfo,
  editing,
  listing,
  isPermission
}: {
  boxAddress: string | undefined
  poolInfo: StakePoolParams | undefined
  editing?: boolean | undefined
  listing?: boolean
  isPermission?: boolean
}) => {
  const isMd = useBreakpoint('md')

  const [isShowDetail, setIsShowDetail] = useState<boolean>(false)
  const { pool, claimCallback, refundRunCallback } = useStakingPool(boxAddress, poolInfo?.instanceAddress)

  const [claimLoading, setClaimLoading] = useState<boolean>(false)
  const [refundLoading, setRefundLoading] = useState<boolean>(false)

  const APY = useGetAPY({
    stakeTokenAddress: pool?.stakeToken.address,
    rewardsTokenAddress: pool?.rewardToken.address,
    totalRewardTokenAmount: pool?.rewardTokenAmount.toExact(),
    duration: pool?.duration,
    totalStakeTokenAmount: pool?.curTotalStakedAmount.toExact()
  })

  const extraInfo: ExtraInfoData = useMemo(() => {
    if (poolInfo?.extraInfo) {
      return JSON.parse(poolInfo?.extraInfo)
    }
    return undefined
  }, [poolInfo?.extraInfo])

  const currentTime = Math.ceil(Date.now() / 1000)

  const refundAmount = useMemo(() => {
    if (
      pool?.allocatedRewardAmount &&
      pool?.rewardTokenAmount &&
      pool?.allocatedRewardAmount?.lessThan(pool?.rewardTokenAmount)
    ) {
      return pool.rewardTokenAmount.subtract(pool.allocatedRewardAmount)
    }
    return undefined
  }, [pool?.allocatedRewardAmount, pool?.rewardTokenAmount])

  const endTime = useMemo(() => {
    return pool?.endTime
  }, [pool?.endTime])

  const isEnd = useMemo(() => {
    if (endTime) {
      if (endTime <= currentTime) {
        return true
      }
      return false
    }
    return undefined
  }, [currentTime, endTime])

  const isStart = useMemo(() => {
    if (pool?.startTime) {
      if (pool?.startTime <= currentTime) {
        return true
      }
      return false
    }
    return undefined
  }, [currentTime, pool?.startTime])

  const ClaimRefund = useCallback(async () => {
    setRefundLoading(true)
    try {
      await refundRunCallback()
      setRefundLoading(false)
    } catch (error) {
      console.error(error)
      setRefundLoading(false)
    }
  }, [refundRunCallback])

  const ClaimRewardToken = useCallback(async () => {
    setClaimLoading(true)
    try {
      await claimCallback()
      setClaimLoading(false)
    } catch (error) {
      console.error(error)
      setClaimLoading(false)
    }
  }, [claimCallback])

  return (
    <StyleCard
      sx={{
        height: { xs: isShowDetail ? 465 : 330, md: isShowDetail ? 482 : 345 },
        transition: 'all 0.3s',
        overflow: 'hidden'
      }}
    >
      <PoolStatus isStart={isStart} isEnd={isEnd} startTime={pool?.startTime} endTime={endTime} />
      <StyleCardContentBox>
        <Stack
          spacing={24}
          sx={{
            width: '100%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CurrencyLogo currencyOrAddress={poolInfo?.token0Contract} size={isMd ? '30px' : '40px'} />
            <Stack spacing={4}>
              <StyleCardTitle noWrap maxWidth={200}>
                {extraInfo?.title ?? '--'}
              </StyleCardTitle>
              <StyleCardSubtitle>
                Stake {formatStringLength(poolInfo?.token0Symbol) || '--'} Earn{' '}
                {formatStringLength(poolInfo?.token1Symbol) || '--'}
              </StyleCardSubtitle>
            </Stack>
          </Box>
          <Stack spacing={16}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                height: { xs: 50, md: 60 }
              }}
            >
              <Stack spacing={4}>
                <Typography
                  sx={{
                    fontSize: { xs: 20, md: 28 },
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: '#4C6FFF',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {APY?.isZero() || !APY ? (
                    '--'
                  ) : (
                    <>
                      {APY?.toFixed(2) || '--'}
                      <b
                        style={{
                          fontSize: 15
                        }}
                      >
                        %
                      </b>
                    </>
                  )}
                </Typography>
                <StyleContentGray>Mining APY</StyleContentGray>
              </Stack>
              <Stack spacing={4} justifyContent={'end'}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4
                  }}
                >
                  <StyleCardContent>{pool?.curTotalStakedAmount?.toSignificant(4) || 0}</StyleCardContent>
                  <CurrencyLogo currencyOrAddress={poolInfo?.token0Contract} size="16px" />
                </Box>

                <StyleContentGray>Total Liquidity</StyleContentGray>
              </Stack>
            </Box>
            <Divider
              variant="inset"
              sx={{
                backgroundColor: 'var(--ps-neutral2)'
              }}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              <Stack spacing={4}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4
                  }}
                >
                  <StyleCardContent>{pool?.myStakedOf?.toSignificant(4) || 0}</StyleCardContent>
                  <CurrencyLogo currencyOrAddress={poolInfo?.token0Contract} size="16px" />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '10px',
                    height: 17
                  }}
                >
                  <StyleContentGray>You Staked </StyleContentGray>
                  {!isPermission
                    ? null
                    : pool?.myStakedOf?.greaterThan('0') && (
                        <StyleRemoveButton
                          onClick={() => {
                            viewControl.show('UnStakeTokenModal', {
                              boxAddress,
                              stakingAddress: poolInfo?.instanceAddress,
                              stakeToken: pool?.stakeToken || undefined
                            })
                          }}
                        >
                          <span />
                        </StyleRemoveButton>
                      )}
                </Box>
              </Stack>
              <Stack spacing={4}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4
                  }}
                >
                  <StyleCardContent>{pool?.myClaimableOf?.toSignificant(4) || 0}</StyleCardContent>
                  <CurrencyLogo currencyOrAddress={poolInfo?.token1Contract} size="16px" />
                </Box>

                <StyleContentGray>Claimable Rewards</StyleContentGray>
              </Stack>
            </Box>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              gap: 12
            }}
          >
            {isEnd && refundAmount && editing ? (
              <LoadingButton
                loading={refundLoading}
                disabled={listing}
                variant="contained"
                sx={{
                  height: { xs: 36, md: 44 },
                  width: '100%'
                }}
                onClick={ClaimRefund}
              >
                Claim Refund
              </LoadingButton>
            ) : (
              <Button
                disabled={!isStart || isEnd || !isPermission}
                variant="contained"
                sx={{
                  height: { xs: 36, md: 44 },
                  width: '100%'
                }}
                onClick={() => {
                  viewControl.show('StakeTokenModal', {
                    boxAddress,
                    stakingAddress: poolInfo?.instanceAddress,
                    stakeToken: pool?.stakeToken || undefined
                  })
                }}
              >
                Stake
              </Button>
            )}

            <LoadingButton
              loading={claimLoading}
              variant="outlined"
              sx={{
                height: { xs: 36, md: 44 },
                width: '100%'
              }}
              onClick={ClaimRewardToken}
              disabled={!pool?.myClaimableOf?.greaterThan('0') || !isPermission}
            >
              Claim
            </LoadingButton>
          </Box>
        </Stack>
      </StyleCardContentBox>
      <Box
        sx={{
          height: 35,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <StyleCardBottomTextButton
          onClick={() => setIsShowDetail(!isShowDetail)}
          sx={{
            svg: {
              transform: isShowDetail ? 'rotate(180deg)' : 'rotate(0)'
            }
          }}
        >
          Details
          <ArrowDown />
        </StyleCardBottomTextButton>
      </Box>
      {isShowDetail && (
        <BottomPoolDetails
          poolContract={poolInfo?.instanceAddress}
          totalRewardAmount={pool?.rewardTokenAmount}
          rewardAmount={refundAmount?.toSignificant(4)}
        />
      )}
    </StyleCard>
  )
}

export const PoolCard = ({
  boxAddress,
  poolInfo,
  editing,
  listing,
  isPermission
}: {
  boxAddress: string | undefined
  poolInfo: StakePoolParams | undefined
  editing?: boolean | undefined
  listing?: boolean
  isPermission?: boolean
}) => {
  if (poolInfo?.token0Type === POOL_TYPE.LP_TOKEN_V2 || poolInfo?.token0Type === POOL_TYPE.LP_TOKEN_V3) {
    return (
      <DoubleTokenCard
        boxAddress={boxAddress}
        poolInfo={poolInfo}
        editing={editing}
        listing={listing}
        isPermission={isPermission}
      />
    )
  }

  return (
    <SingleTokenCard
      boxAddress={boxAddress}
      poolInfo={poolInfo}
      editing={editing}
      listing={listing}
      isPermission={isPermission}
    />
  )
}
