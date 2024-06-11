import { useRequest } from 'ahooks'
import BigNumber from 'bignumber.js'

export function useV2TokenPriceWithGraph(tokenAddress?: string) {
  const { data } = useRequest(
    async () => {
      if (!tokenAddress) return undefined
      const res = await fetch('https://bitswap-subgraph.bouncebit.io/subgraphs/name/davekaj/uniswap', {
        method: 'POST',
        body: JSON.stringify({
          query: `
          query {
            bundle(id: 1) {
              ethPrice
            }
            token(id: "${tokenAddress.toLowerCase()}") {
              derivedETH
            }
          }
        `
        })
      })
      const { data: _data } = await res.json()
      if (!_data?.bundle || !_data.token) return undefined
      return new BigNumber(_data.bundle.ethPrice).times(_data.token.derivedETH).toString()
    },
    {
      refreshDeps: [tokenAddress]
    }
  )
  return data as string | undefined
}
