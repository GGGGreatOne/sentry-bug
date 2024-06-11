import { useActiveWeb3React } from '../../../hooks'
import { useBTokenContract } from './useContract'
import { useSingleCallResult } from '../../../hooks/multicall'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { withDecimals } from '../utils'

export const useGetUserLiquidityInfo = (bTokenT: string, decimals: number = 18): undefined | BigNumber => {
  const { account, chainId: linkChainId } = useActiveWeb3React()
  const bTokenContract = useBTokenContract(bTokenT)

  const userLiquidityBalance = useSingleCallResult(linkChainId, bTokenContract, 'balanceOf', [account])
  return useMemo(() => {
    if (userLiquidityBalance.loading) return undefined
    if (userLiquidityBalance.result) {
      return withDecimals(new BigNumber(userLiquidityBalance.result[0]._hex), decimals, false)
    } else return undefined
  }, [userLiquidityBalance, decimals])
}
