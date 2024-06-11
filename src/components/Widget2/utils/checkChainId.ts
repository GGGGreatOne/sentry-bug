import { ChainId } from '@uniswap/sdk-core'

export function checkChainId(chainId: number | null | undefined): ChainId | undefined {
  if (chainId === null || chainId === undefined) {
    return undefined
  }
  if (Object.values(ChainId).includes(chainId)) {
    return chainId
  } else {
    return undefined
  }
}
