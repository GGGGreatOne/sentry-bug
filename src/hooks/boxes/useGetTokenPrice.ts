import { useMemo } from 'react'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { useGetPluginTokenPriceData } from 'state/pluginTokenPriceConfig/hooks'

export const useGetTokenPrice = (tokenAddr: string[]) => {
  const { pluginTokenList } = useGetPluginTokenListData()
  const { pluginTokenPriceList } = useGetPluginTokenPriceData()
  const pluginData = tokenAddr?.map(i => pluginTokenList?.filter(p => p?.contractAddress === i))
  const price = pluginData?.map(i => i.map(item => pluginTokenPriceList?.find(p => p?.coinId === item.coinId)))
  const list = useMemo(() => {
    if (price) {
      const ret = price?.flat().map(item => item?.price)
      return ret
    }
    return []
  }, [price])
  const ret = useMemo(() => list, [list])
  return ret
}
