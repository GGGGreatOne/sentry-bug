import { useMemo } from 'react'
import { BaseContract } from 'ethers/lib/ethers'
import type { AddressMap } from '@uniswap/smart-order-router'
import { ChainId } from '@uniswap/sdk-core'
import { useActiveWeb3React } from 'hooks'
import { isSupportedChain } from '../constants/chains'
import { getContract } from 'utils/contract'
import { useNetworkProviders } from './useNetworkProviders'

type ContractMap<T extends BaseContract> = { [key: number]: T }

export function useContractMultichain<T extends BaseContract>(
  addressMap: AddressMap,
  ABI: any,
  chainIds?: ChainId[]
): ContractMap<T> {
  const { chainId: walletChainId, library: walletProvider } = useActiveWeb3React()
  const networkProviders = useNetworkProviders()

  return useMemo(() => {
    const relevantChains =
      chainIds ??
      Object.keys(addressMap)
        .map(chainId => parseInt(chainId))
        .filter(chainId => isSupportedChain(chainId))

    return relevantChains.reduce((acc: ContractMap<T>, chainId) => {
      const provider =
        walletProvider && walletChainId === chainId
          ? walletProvider
          : isSupportedChain(chainId)
            ? networkProviders[chainId]
            : undefined
      if (provider) {
        acc[chainId] = getContract(addressMap[chainId] ?? '', ABI, provider) as T
      }
      return acc
    }, {})
  }, [ABI, addressMap, chainIds, networkProviders, walletChainId, walletProvider])
}
