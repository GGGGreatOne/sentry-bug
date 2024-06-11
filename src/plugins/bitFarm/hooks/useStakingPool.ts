import { useCallback, useMemo, useState } from 'react'
import { useStakingContract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { Currency, CurrencyAmount } from 'constants/token'
import { useUserHasSubmittedRecords } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useToken } from 'hooks/useToken'
import { useRequest } from 'ahooks'
import { GetStakePoolList } from 'api/boxes'
import BigNumber from 'bignumber.js'

export interface IStakingPool {
  stakeToken: Currency
  rewardToken: Currency
  startTime: number | undefined
  duration: number | undefined
  endTime: number | undefined
  curTotalStakedAmount: CurrencyAmount // current pool staked stakeToken
  myStakedOf: CurrencyAmount | undefined // my staked of stakeToken
  myClaimedOf: CurrencyAmount | undefined // my claimed reward of rewardToken
  myClaimableOf: CurrencyAmount | undefined // my claimable reward of rewardToken
  rewardTokenAmount: CurrencyAmount // all reward token amount when they are created
  allocatedRewardAmount: CurrencyAmount | undefined // current pool allocated reward
}

export interface ExtraInfoData {
  duration?: number
  reward?: string
  start_time?: number
  title?: string
}

export enum POOL_TYPE {
  TOKEN,
  LP_TOKEN_V2,
  LP_TOKEN_V3
}

export function useStakingPool(
  boxContractAddr: string | undefined,
  stakingAddress: string | undefined,
  Summary?: {
    stakeSummary?: string
    unStakeSummary?: string
  }
) {
  const { account, chainId } = useActiveWeb3React()
  const stakingContract = useStakingContract(stakingAddress)

  const claimableOf: string | undefined = useSingleCallResult(chainId, stakingContract, 'claimableOf', [
    account
  ]).result?.[0]?.toString()
  const claimedOf: string | undefined = useSingleCallResult(chainId, stakingContract, 'claimedOf', [
    account
  ]).result?.[0]?.toString()
  const _stakeToken: string | undefined = useSingleCallResult(
    chainId,
    stakingContract,
    'stakeToken'
  ).result?.[0]?.toString()
  const _rewardToken: string | undefined = useSingleCallResult(
    chainId,
    stakingContract,
    'rewardToken'
  ).result?.[0]?.toString()
  const stakedOf: string | undefined = useSingleCallResult(chainId, stakingContract, 'stakedOf', [
    account
  ]).result?.[0]?.toString()
  const totalStakedAmount: string | undefined = useSingleCallResult(
    chainId,
    stakingContract,
    'totalStakedAmount'
  ).result?.[0]?.toString()
  const _rewardTokenAmount: string | undefined = useSingleCallResult(
    chainId,
    stakingContract,
    'rewardTokenAmount'
  ).result?.[0]?.toString()
  const allocatedReward: string | undefined = useSingleCallResult(chainId, stakingContract, 'allocatedRewardRealTime')
    .result?.[0]

  const startTime: BigNumber | undefined = useSingleCallResult(chainId, stakingContract, 'startTime').result?.[0]
  const duration: BigNumber | undefined = useSingleCallResult(chainId, stakingContract, 'duration').result?.[0]

  const endTime = useMemo(() => {
    if (startTime && duration) {
      return startTime?.toNumber() + duration?.toNumber()
    }
    return undefined
  }, [duration, startTime])

  const stakeToken = useToken(_stakeToken || '')
  const rewardToken = useToken(_rewardToken || '')

  const pool: IStakingPool | undefined = useMemo(() => {
    if (!duration || !startTime || !totalStakedAmount || !rewardToken || !stakeToken || !_rewardTokenAmount) {
      return undefined
    }
    const curTotalStakedAmount = CurrencyAmount.fromRawAmount(stakeToken, totalStakedAmount)
    const myStakedOf = stakedOf ? CurrencyAmount.fromRawAmount(stakeToken, stakedOf) : undefined

    const rewardTokenAmount = CurrencyAmount.fromRawAmount(rewardToken, _rewardTokenAmount)
    const myClaimedOf = claimedOf ? CurrencyAmount.fromRawAmount(rewardToken, claimedOf) : undefined
    const myClaimableOf = claimableOf ? CurrencyAmount.fromRawAmount(rewardToken, claimableOf) : undefined
    const allocatedRewardAmount = allocatedReward
      ? CurrencyAmount.fromRawAmount(rewardToken, allocatedReward)
      : undefined

    return {
      stakeToken,
      rewardToken,
      startTime: startTime?.toNumber(),
      duration: duration?.toNumber(),
      endTime,
      curTotalStakedAmount,
      myStakedOf,
      myClaimedOf,
      myClaimableOf,
      rewardTokenAmount,
      allocatedRewardAmount
    }
  }, [
    _rewardTokenAmount,
    allocatedReward,
    claimableOf,
    claimedOf,
    duration,
    endTime,
    rewardToken,
    stakeToken,
    stakedOf,
    startTime,
    totalStakedAmount
  ])

  const stakeAction = 'bitStaking_stake'
  const stakeSubmitted = useUserHasSubmittedRecords(account, stakeAction, stakingAddress)
  const { runWithModal: stakeRunWithModal } = useBoxExecute(
    boxContractAddr,
    {
      toContract: stakingContract,
      toFunc: 'stake',
      toData: []
    },
    {
      key: stakingAddress,
      summary: Summary?.stakeSummary ?? 'Successfully stake',
      action: stakeAction
    }
  )
  const stakeCallback = useCallback(
    (amount: CurrencyAmount) => {
      const args = [amount.raw.toString()]
      return stakeRunWithModal(args, amount.currency.isNative ? amount.raw.toString() : undefined)
    },
    [stakeRunWithModal]
  )

  const unStakeAction = 'bitStaking_unStake'
  const unStakeSubmitted = useUserHasSubmittedRecords(account, stakeAction, stakingAddress)
  const { runWithModal: unStakeRunWithModal } = useBoxExecute(
    boxContractAddr,
    {
      toContract: stakingContract,
      toFunc: 'unstake',
      toData: []
    },
    {
      key: stakingAddress,
      summary: Summary?.unStakeSummary ?? 'Successfully unStake',
      action: unStakeAction
    }
  )
  const unStakeCallback = useCallback(
    (amount: CurrencyAmount) => {
      const args = [amount.raw.toString()]
      return unStakeRunWithModal(args)
    },
    [unStakeRunWithModal]
  )

  const claimAction = 'bitStaking_claim'
  const claimSubmitted = useUserHasSubmittedRecords(account, claimAction, stakingAddress)
  const { runWithModal: claimRunWithModal } = useBoxExecute(
    boxContractAddr,
    {
      toContract: stakingContract,
      toFunc: 'claim',
      toData: []
    },
    {
      key: stakingAddress,
      summary: pool
        ? `Successfully claim ${pool.myClaimableOf?.toSignificant(4)} ${pool.rewardToken.symbol} reward `
        : 'Successfully claim reward',
      action: claimAction
    }
  )
  const claimCallback = useCallback(() => claimRunWithModal(), [claimRunWithModal])

  const refundAction = 'refund'
  const refundSubmitted = useUserHasSubmittedRecords(account, claimAction, stakingAddress)
  const { runWithModal: refundRunWithModal } = useBoxExecute(
    boxContractAddr,
    {
      toContract: stakingContract,
      toFunc: 'refund',
      toData: []
    },
    {
      key: stakingAddress,
      summary: 'Refund successfully claimed',
      action: refundAction
    }
  )
  const refundRunCallback = useCallback(() => refundRunWithModal(), [refundRunWithModal])

  return {
    pool,
    stakeSubmitted,
    stakeCallback,
    unStakeSubmitted,
    unStakeCallback,
    claimSubmitted,
    claimCallback,
    refundSubmitted,
    refundRunCallback
  }
}

export function useStakePoolList(boxId?: string | undefined, pluginId?: string | undefined) {
  const [total, setTotal] = useState<number>(0)
  const pageSize = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false)

  const { data, loading } = useRequest(
    async () => {
      try {
        const res = await GetStakePoolList({ pluginId, boxId, pageSize, pageNum: currentPage })
        setTotal(res.data.total)
        setPaginationLoading(false)
        return res.data
      } catch (err) {
        console.error(err)
        setPaginationLoading(false)
        return undefined
      }
    },
    {
      refreshDeps: [pluginId, boxId, currentPage],
      pollingInterval: 30000
    }
  )

  const onSetCurrentPage = (e: number) => {
    if (currentPage === e) return
    setCurrentPage(e)
    setPaginationLoading(true)
  }

  return {
    stakePoolList: data,
    loading: (loading && !data) || paginationLoading,
    page: {
      currentPage,
      setCurrentPage: onSetCurrentPage,
      total,
      totalPage: Math.ceil(total / pageSize),
      pageSize
    }
  }
}
