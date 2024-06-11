import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'

import { useCallback, useMemo, useState } from 'react'
import { CoinResultType, FinalAllocationType } from '../constants/type'
import { useTokens } from 'hooks/useToken'
import { CurrencyAmount } from 'constants/token'
import { useStakeTokenWithTimeWeightContract } from './useContract'
import { PoolStatus } from 'api/type'
import { getCurrentTimeStamp } from 'utils'
import { useInterval } from 'ahooks'
import BigNumber from 'bignumber.js'

export const useStakingAuctionInfo = (poolId: string | undefined, creator: string | undefined) => {
  const { chainId } = useActiveWeb3React()
  const [poolStatus, setPoolStatus] = useState<PoolStatus>(PoolStatus.Upcoming)
  const contract = useStakeTokenWithTimeWeightContract()
  const pools = useSingleCallResult(chainId, contract, 'pools', [poolId], undefined)
  const totalStake = useSingleCallResult(chainId, contract, 'amountCommitted1', [poolId], undefined)
  const totalParticipants = useSingleCallResult(chainId, contract, 'participantCount', [poolId], undefined)
  const myTotalStake = useSingleCallResult(chainId, contract, 'myAmountCommitted1', [creator, poolId], undefined)
  const swappedtoken0 = useSingleCallResult(chainId, contract, 'completedCommitment', [poolId], undefined)
  const swappedtoken1 = useSingleCallResult(chainId, contract, 'amountCommitted1', [poolId], undefined)
  const myToken1Claimed = useSingleCallResult(chainId, contract, 'myToken1Claimed', [creator, poolId], undefined)
  const finalAllocation = useSingleCallResult(chainId, contract, 'finalAllocation', [poolId, creator], undefined)
  const claimedToken0 = useSingleCallResult(chainId, contract, 'myToken0Claimed', [creator, poolId], undefined)
  const creatorClaimed = useSingleCallResult(chainId, contract, 'creatorClaimed', [poolId], undefined)
  const ownerResult = useSingleCallResult(chainId, contract, 'owner', [], undefined)
  //  TODO : why result not is arr
  const tokens = useTokens([pools.result?.token0, pools.result?.token1], chainId)
  const token = useMemo(() => {
    const token0 = tokens?.[0]
    const token1 = tokens?.[1]
    if (!token0 || !token1) {
      return { currencyAmountTotal0: undefined, token1: undefined, token0: undefined, currencyAmountTotal1: undefined }
    }
    const currencyAmountTotal0 = CurrencyAmount.fromRawAmount(token0, pools.result?.amountTotal0.toString() || '0')
    const currencyAmountTotal1 = CurrencyAmount.fromRawAmount(token1, pools.result?.amountTotal1.toString() || '0')
    return { currencyAmountTotal0, token1, token0, currencyAmountTotal1 }
  }, [pools, tokens])
  const swapRatio = useMemo(() => {
    if (!token?.currencyAmountTotal0 || !token?.currencyAmountTotal1) {
      return undefined
    }
    return token?.currencyAmountTotal1.div(token?.currencyAmountTotal0)
  }, [token?.currencyAmountTotal0, token?.currencyAmountTotal1])
  const loopGetStatus = useCallback((): PoolStatus => {
    if (!pools.result) {
      return PoolStatus.Upcoming
    }
    const currentTime = getCurrentTimeStamp()
    const pool = pools.result
    if (!!creatorClaimed.result?.[0] && currentTime < pool?.releaseAt) {
      return PoolStatus.Cancelled
    }
    if (currentTime < pool?.openAt) {
      return PoolStatus.Upcoming
    } else if (currentTime >= pool?.openAt && currentTime < pool?.closeAt) {
      return PoolStatus.Live
    } else if (currentTime >= pool?.closeAt) {
      // if (new BigNumber(swappedtoken0.result?.[0].toString() || 0).eq('0') && !!creatorClaimed.result?.[0]) {
      //   return PoolStatus.Cancelled
      // }
      return PoolStatus.Closed
    } else {
      return PoolStatus.Closed
    }
  }, [creatorClaimed.result, pools.result])

  useInterval(() => {
    const _status = loopGetStatus()
    setPoolStatus(_status)
  }, 300)
  const txFee = useMemo(
    () =>
      new BigNumber(pools?.result?.txFeeRatio?.toString() || 0).div(new BigNumber(10).pow(18)).times(100).toFixed(2),
    [pools?.result?.txFeeRatio]
  )
  const currencyAmountSwap0 = useMemo(
    () =>
      token?.token0
        ? CurrencyAmount.fromRawAmount(token?.token0, swappedtoken0?.result?.[0]?.toString() || 0)
        : undefined,
    [swappedtoken0?.result, token?.token0]
  )
  const currencyAmountSwap1 = useMemo(
    () =>
      token?.token1
        ? CurrencyAmount.fromRawAmount(token?.token1, swappedtoken1?.result?.[0]?.toString() || 0)
        : undefined,
    [swappedtoken1?.result, token?.token1]
  )
  const myToken1Amount = useMemo(
    () =>
      token.token1 ? CurrencyAmount.fromRawAmount(token.token1, myTotalStake.result?.[0].toString() || '0') : undefined,
    [myTotalStake.result, token.token1]
  )
  const coinInfo = useMemo<CoinResultType | undefined>(() => {
    const result: CoinResultType = {
      poolStatus,
      poolId,
      ...pools.result,
      claimAt: pools?.result?.releaseAt,
      ...token,
      currencyAmountSwap1,
      owner: ownerResult.result?.[0],
      txFee
    }
    if (totalStake.result) {
      result.token1Amount = totalStake.result[0]
    }
    if (totalParticipants.result) {
      result.totalParticipants = totalParticipants.result[0]
    }
    if (myTotalStake.result) {
      result.myToken1Amount = myToken1Amount
    }
    if (swappedtoken0.result) {
      result.currencyAmountSwap0 = currencyAmountSwap0
    }
    if (myToken1Claimed.result) {
      result.myToken1Claimed = myToken1Claimed.result[0]
    }
    if (finalAllocation.result) {
      result.finalAllocation = {
        mySwappedAmount0: finalAllocation.result[0],
        myUnSwappedAmount1: finalAllocation.result[1]
      } as FinalAllocationType
    }
    if (claimedToken0.result) {
      result.claimedToken0 = claimedToken0.result[0]
    }
    if (creatorClaimed.result) {
      result.creatorClaimed = creatorClaimed.result[0]
    }
    if (swapRatio) {
      result.swapRatio = swapRatio
    }
    if (ownerResult.result) {
      result.owner = ownerResult.result[0]
    }
    return result
  }, [
    claimedToken0.result,
    creatorClaimed.result,
    currencyAmountSwap0,
    currencyAmountSwap1,
    finalAllocation.result,
    myToken1Amount,
    myToken1Claimed.result,
    myTotalStake.result,
    ownerResult.result,
    poolId,
    poolStatus,
    pools.result,
    swapRatio,
    swappedtoken0.result,
    token,
    totalParticipants.result,
    totalStake.result,
    txFee
  ])

  return coinInfo
}
