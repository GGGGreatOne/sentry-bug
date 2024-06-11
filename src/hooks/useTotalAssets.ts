import { useMemo } from 'react'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { useCurrencyBalances } from './useToken'
import { useActiveWeb3React } from 'hooks'
import { Currency } from 'constants/token'
import { useGetTokenPrice } from './boxes/useGetTokenPrice'
import BigNumber from 'bignumber.js'
export interface IAssetsItem {
  token: Currency | undefined
  balance: BigNumber
  price: number
  value: BigNumber
}
interface IAssetsResult {
  totalAssets?: BigNumber
  list?: IAssetsItem[]
}
export default function useTotalAssets(): IAssetsResult {
  const { account, chainId } = useActiveWeb3React()
  const { pluginTokenList: tokenList } = useGetPluginTokenListData()

  const tokenAdds = useMemo<string[]>(() => tokenList.map(i => i.contractAddress || '').filter(Boolean), [tokenList])
  const tokenPrices = useGetTokenPrice(tokenAdds).map(i => i || 0)
  const tokenCurrencys = useMemo(() => {
    if (!chainId) {
      return []
    }
    return tokenList.map(i => {
      if (i.contractAddress) {
        return new Currency(
          chainId,
          i.contractAddress,
          i.decimals || 18,
          i.tokenSymbol || '',
          i.tokenName,
          i.smallImg || i.bigImg || ''
        )
      }
      return
    })
  }, [chainId, tokenList])

  const tokenBalances = useCurrencyBalances(account, tokenCurrencys, chainId)
  const tokenBalancesRaw = useMemo(
    () => tokenBalances.map(i => new BigNumber(i?.toExact() || 0).dp(6)),
    [tokenBalances]
  )
  const assetsItem = useMemo(() => {
    const lenArr = [...new Set([tokenCurrencys.length, tokenPrices.length, tokenBalancesRaw.length])]
    if (lenArr.length !== 1) {
      return
    }
    return tokenBalancesRaw
      .map<IAssetsItem>((item, index) => {
        return {
          token: tokenCurrencys[index],
          balance: item,
          price: new BigNumber(tokenPrices[index]).toNumber(),
          value: item.times(tokenPrices[index])
        }
      })
      .filter(i => i.balance.gt(new BigNumber(0)))
  }, [tokenBalancesRaw, tokenCurrencys, tokenPrices])

  const totalAssets = useMemo(() => {
    return assetsItem?.reduce((item, curVal) => curVal.value.plus(item), new BigNumber(0))
  }, [assetsItem])
  return {
    totalAssets,
    list: assetsItem
  }
}
