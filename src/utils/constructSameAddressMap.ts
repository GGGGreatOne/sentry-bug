import { SupportedChainId } from 'constants/chains'

const DEFAULT_NETWORKS = Object.values(SupportedChainId).map(i => Number(i) as SupportedChainId)

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: SupportedChainId[] = []
): { [chainId: number]: T } {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce<{ [chainId: number]: T }>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}
