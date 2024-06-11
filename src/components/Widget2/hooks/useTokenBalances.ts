import { supportedChainIdFromGQLChain } from '../graphql/data/util'
import { TokenBalances } from '../lib/hooks/useTokenList/sorting'
import { useMemo } from 'react'
import { PortfolioTokenBalancePartsFragment } from '../lib/uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { useCachedPortfolioBalancesQuery } from '../components/PrefetchBalancesWrapper/PrefetchBalancesWrapper'
import { useActiveWeb3React } from 'hooks'

export function useTokenBalances(): {
  balanceMap: TokenBalances
  balanceList: (PortfolioTokenBalancePartsFragment | undefined)[]
  loading: boolean
} {
  const { account, chainId } = useActiveWeb3React()
  const { data, loading } = useCachedPortfolioBalancesQuery({ account })
  return useMemo(() => {
    const balanceList = data?.portfolios?.[0]?.tokenBalances ?? []
    const balanceMap =
      balanceList?.reduce((balanceMap, tokenBalance) => {
        const address =
          tokenBalance?.token?.standard === 'ERC20'
            ? tokenBalance.token?.address?.toLowerCase()
            : tokenBalance?.token?.symbol ?? 'ETH'
        if (
          tokenBalance?.token?.chain &&
          supportedChainIdFromGQLChain(tokenBalance.token?.chain) === chainId &&
          address &&
          tokenBalance.denominatedValue?.value !== undefined
        ) {
          const usdValue = tokenBalance.denominatedValue?.value
          const balance = tokenBalance.quantity
          balanceMap[address] = { usdValue, balance: balance ?? 0 }
        }
        return balanceMap
      }, {} as TokenBalances) ?? {}
    return { balanceMap, balanceList, loading }
  }, [chainId, data?.portfolios, loading])
}
