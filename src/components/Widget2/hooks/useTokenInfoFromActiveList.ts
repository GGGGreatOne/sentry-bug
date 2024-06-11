import { Currency } from '@uniswap/sdk-core'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
const activeList = {} as any

/** Returns a TokenFromList from the active token lists when possible, or the passed token otherwise. */
export function useTokenInfoFromActiveList(currency: Currency) {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return
    if (currency.isNative) return currency

    try {
      return activeList[chainId][currency.wrapped.address].token
    } catch (e) {
      return currency
    }
  }, [chainId, currency])
}
