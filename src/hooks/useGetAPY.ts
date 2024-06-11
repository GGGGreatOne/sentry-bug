import { useV2TokenPriceWithGraph } from './useTokenPriceWithGraph'
import isZero from 'utils'
import { WBB } from 'components/Widget/constant'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { ONE_YEAR_TIMESTAMP } from 'plugins/leverage/constants'
import { usePair } from 'components/Widget/data/Reserves'
import { useTotalSupply } from 'components/Widget/data/TotalSupply'
import { Currency as SDKCurrency, Token } from '@uniswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { Currency } from 'constants/token'

interface Props {
  stakeTokenAddress?: string | undefined
  stakeLPToken?: { token0: Currency | null | undefined; token1: Currency | null | undefined }
  rewardsTokenAddress: string | undefined
  totalRewardTokenAmount: string | number | undefined
  duration: number | undefined
  totalStakeTokenAmount: string | number | undefined
}

export function useGetAPY({
  stakeTokenAddress,
  stakeLPToken,
  rewardsTokenAddress,
  totalRewardTokenAmount,
  duration = ONE_YEAR_TIMESTAMP / 1000, // Default one year
  totalStakeTokenAmount
}: Props) {
  const { chainId } = useActiveWeb3React()

  const _stakeTokenPrice = useV2TokenPriceWithGraph(
    stakeTokenAddress ? (isZero(stakeTokenAddress) ? WBB.address : stakeTokenAddress) : undefined
  )

  const rewardsTokenPrice = useV2TokenPriceWithGraph(
    rewardsTokenAddress ? (isZero(rewardsTokenAddress) ? WBB.address : rewardsTokenAddress) : undefined
  )

  const token0Address = stakeLPToken?.token0?.address
  const token1Address = stakeLPToken?.token1?.address
  const token0 = stakeLPToken?.token0
  const token1 = stakeLPToken?.token1

  const token0Price = useV2TokenPriceWithGraph(
    token0Address ? (isZero(token0Address) ? WBB.address : token0Address) : undefined
  )
  const token1Price = useV2TokenPriceWithGraph(
    token1Address ? (isZero(token1Address) ? WBB.address : token1Address) : undefined
  )

  const pairToken0: SDKCurrency | undefined = useMemo(() => {
    if (token0 && chainId) {
      const tokenAddress = isZero(token0.address) ? WBB.address : token0.address
      return new Token(chainId as number, tokenAddress, token0.decimals, token0.symbol, token0.name)
    }
    return undefined
  }, [token0, chainId])

  const pairToken1: SDKCurrency | undefined = useMemo(() => {
    if (token1 && chainId) {
      const tokenAddress = isZero(token1.address) ? WBB.address : token1.address
      return new Token(chainId as number, tokenAddress, token1.decimals, token1.symbol, token1.name)
    }
    return undefined
  }, [token1, chainId])

  const [, pairToken] = usePair(pairToken0, pairToken1)

  const totalSupply = useTotalSupply(pairToken?.liquidityToken)

  const LPTokenTvl = useMemo(() => {
    if (pairToken?.reserve0 && token0Price) {
      return new BigNumber(pairToken?.reserve0.toExact()).times(new BigNumber(token0Price)).times(2)
    }

    if (pairToken?.reserve1 && token1Price) {
      return new BigNumber(pairToken?.reserve1.toExact()).times(new BigNumber(token1Price)).times(2)
    }
    return undefined
  }, [pairToken?.reserve0, pairToken?.reserve1, token0Price, token1Price])

  const LPPrice = useMemo(() => {
    if (totalSupply && LPTokenTvl) {
      return LPTokenTvl.div(totalSupply.toExact())
    }
    return undefined
  }, [LPTokenTvl, totalSupply])

  const stakeTokenPrice = LPPrice ?? _stakeTokenPrice

  const APY = useMemo(() => {
    if (
      !!duration &&
      !!totalRewardTokenAmount &&
      totalRewardTokenAmount !== '0' &&
      !!rewardsTokenPrice &&
      rewardsTokenPrice !== '0' &&
      !!stakeTokenPrice &&
      stakeTokenPrice !== '0' &&
      !!totalStakeTokenAmount &&
      totalStakeTokenAmount !== '0'
    ) {
      const r = new BigNumber(totalRewardTokenAmount)
        .times(new BigNumber(rewardsTokenPrice).times(ONE_YEAR_TIMESTAMP / 1000 / duration))
        ?.div(new BigNumber(totalStakeTokenAmount).times(stakeTokenPrice))

      return r?.times(100)
    }
    return undefined
  }, [totalRewardTokenAmount, rewardsTokenPrice, duration, stakeTokenPrice, totalStakeTokenAmount])

  return APY
}
