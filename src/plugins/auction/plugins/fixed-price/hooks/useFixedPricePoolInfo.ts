import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useFixedSwapERC20Contract } from './useContract'
import { useCallback, useMemo, useState } from 'react'
import { IFixedPricePoolInfo, IPoolsResult } from '../type'
import { useTokens } from 'hooks/useToken'
import { CurrencyAmount } from 'constants/token'
import { AuctionType, IReleaseType } from '../constants/type'
import { getCurrentTimeStamp } from 'utils'
import { PoolStatus } from 'api/type'
import BigNumber from 'bignumber.js'
import { useInterval } from 'ahooks'

const useFixedPricePoolInfo = (poolId?: string): IFixedPricePoolInfo => {
  const { chainId, account } = useActiveWeb3React()
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()
  const poolsCallResult = useSingleCallResult(chainId, fixedSwapERC20Contract, 'pools', [poolId])
  // const amountSwap0PRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'amountSwap0P', [chainId]).result
  const amountSwap1PRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'amountSwap1P', [poolId]).result
  const creatorClaimedPRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'creatorClaimedP', [poolId]).result
  const myAmountSwapped0Res = useSingleCallResult(chainId, fixedSwapERC20Contract, 'myAmountSwapped0', [
    account,
    poolId
  ]).result
  const myAmountSwapped1Res = useSingleCallResult(chainId, fixedSwapERC20Contract, 'myAmountSwapped1', [
    account,
    poolId
  ]).result
  const myClaimedRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'myClaimed', [account, poolId]).result
  const isPlayableAuctionRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'isPlayableAuction', [
    poolId
  ]).result
  const maxAmount1PerWalletRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'maxAmount1PerWalletP', [
    poolId
  ]).result
  const releaseTypeRes = useSingleCallResult(chainId, fixedSwapERC20Contract, 'releaseTypes', [poolId]).result
  const ownerResult = useSingleCallResult(chainId, fixedSwapERC20Contract, 'owner', [], undefined).result
  const pools = useMemo(() => {
    return poolsCallResult.result as IPoolsResult | undefined
  }, [poolsCallResult.result])
  const tokens = useTokens([pools?.token0, pools?.token1], chainId)
  const [token0, token1] = useMemo(() => [tokens?.[0], tokens?.[1]], [tokens])

  const txFee = useMemo(
    () => new BigNumber(pools?.txFeeRatio?.toString() || 0).div(new BigNumber(10).pow(18)).times(100).toFixed(2),
    [pools?.txFeeRatio]
  )

  const [currencyAmountTotal0, currencyAmountTotal1] = useMemo(() => {
    return [
      token0 ? CurrencyAmount.fromRawAmount(token0, pools?.amountTotal0.toString() || '0') : undefined,
      token1 ? CurrencyAmount.fromRawAmount(token1, pools?.amountTotal1.toString() || '0') : undefined
    ]
  }, [pools, token0, token1])

  const swapRatio = useMemo(() => {
    if (!currencyAmountTotal1 || !currencyAmountTotal0) {
      return undefined
    }
    return currencyAmountTotal1?.div(currencyAmountTotal0)
  }, [currencyAmountTotal0, currencyAmountTotal1])
  const [currencyAmountSwap1] = useMemo(() => {
    return [token1 ? CurrencyAmount.fromRawAmount(token1, amountSwap1PRes?.[0]?.toString() || '0') : undefined]
  }, [amountSwap1PRes, token1])
  const [amountBid0, amountBid1] = useMemo(() => {
    const bid0 =
      currencyAmountSwap1 && swapRatio
        ? new BigNumber(currencyAmountSwap1?.toExact() || '0').div(swapRatio?.toExact() || '0')
        : new BigNumber(0)

    return [bid0, new BigNumber(currencyAmountSwap1?.toExact() || '0')]
  }, [currencyAmountSwap1, swapRatio])
  const currencyAmountSwap0 = useMemo(() => {
    return token0 ? CurrencyAmount.fromAmount(token0, amountBid0.toString() || '0') : undefined
  }, [amountBid0, token0])
  const [currencyAmountMySwap0, currencyAmountMySwap1] = useMemo(() => {
    return [
      token0 ? CurrencyAmount.fromRawAmount(token0, myAmountSwapped0Res?.[0].toString() || '0') : undefined,
      token1 ? CurrencyAmount.fromRawAmount(token1, myAmountSwapped1Res?.[0].toString() || '0') : undefined
    ]
  }, [myAmountSwapped0Res, myAmountSwapped1Res, token0, token1])

  const [creatorClaimed, myClaimed] = useMemo(() => {
    return [!!creatorClaimedPRes?.[0], !!myClaimedRes?.[0]]
  }, [creatorClaimedPRes, myClaimedRes])

  const [maxAmount1PerWallet] = useMemo(() => {
    return [token1 ? CurrencyAmount.fromRawAmount(token1, maxAmount1PerWalletRes?.[0].toString() || '0') : undefined]
  }, [maxAmount1PerWalletRes, token1])
  const releaseType = useMemo((): IReleaseType | undefined => {
    if (!releaseTypeRes) {
      return undefined
    }
    return Number(releaseTypeRes[0])
  }, [releaseTypeRes])
  const isPlayableAuction = useMemo(() => !!isPlayableAuctionRes?.[0], [isPlayableAuctionRes])
  const isJoined = useMemo(() => !!currencyAmountMySwap1?.greaterThan('0'), [currencyAmountMySwap1])

  // loop calculate status
  const [poolStatus, setPoolStatus] = useState<PoolStatus>(PoolStatus.Upcoming)
  const loopGetStatus = useCallback((): PoolStatus => {
    const currentTime = getCurrentTimeStamp()
    if (!pools) {
      return PoolStatus.Upcoming
    }
    const { openAt, closeAt, claimAt } = pools
    if (currentTime < openAt) {
      if (!!creatorClaimed) {
        return PoolStatus.Cancelled
      }
      return PoolStatus.Upcoming
    } else if (currentTime >= openAt && currentTime < closeAt) {
      return PoolStatus.Live
    } else if (currentTime >= closeAt && currentTime < claimAt) {
      // if (amountBid0.eq('0') && amountBid1.eq('0')) {
      //   return PoolStatus.Cancelled
      // }
      return PoolStatus.Closed
    } else {
      return PoolStatus.Closed
    }
  }, [creatorClaimed, pools])

  useInterval(() => {
    const _status = loopGetStatus()
    setPoolStatus(_status)
  }, 300)

  const isUserClaim = useMemo(() => {
    if (poolStatus === PoolStatus.Closed && currencyAmountMySwap1?.greaterThan('0')) {
      if (releaseType === IReleaseType.Instant) {
        return true
      }
      if (isJoined && myClaimed) {
        return true
      }
    }
    return false
  }, [currencyAmountMySwap1, isJoined, myClaimed, poolStatus, releaseType])
  return useMemo(() => {
    return {
      poolId,
      ...pools,
      token0,
      token1,
      currencyAmountTotal0,
      currencyAmountTotal1,
      currencyAmountSwap0,
      currencyAmountSwap1,
      currencyAmountMySwap0,
      currencyAmountMySwap1,
      creatorClaimed,
      myClaimed,
      isPlayableAuction,
      auctionType: AuctionType.FIXED_PRICE,
      maxAmount1PerWallet,
      poolStatus,
      swapRatio,
      releaseType,
      amountBid0,
      amountBid1,
      isJoined,
      isUserClaim,
      txFee,
      owner: ownerResult?.[0]
    }
  }, [
    poolId,
    pools,
    token0,
    token1,
    currencyAmountTotal0,
    currencyAmountTotal1,
    currencyAmountSwap0,
    currencyAmountSwap1,
    currencyAmountMySwap0,
    currencyAmountMySwap1,
    creatorClaimed,
    myClaimed,
    isPlayableAuction,
    maxAmount1PerWallet,
    poolStatus,
    swapRatio,
    releaseType,
    amountBid0,
    amountBid1,
    isJoined,
    isUserClaim,
    txFee,
    ownerResult
  ])
}
export default useFixedPricePoolInfo
