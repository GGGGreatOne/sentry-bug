import { ChainId } from '@uniswap/sdk-core'
import AppJsonRpcProvider from '../rpc/AppJsonRpcProvider'

import ConfiguredJsonRpcProvider from '../rpc/ConfiguredJsonRpcProvider'
import { CHAIN_IDS_TO_NAMES, SupportedInterfaceChain } from './chains'
import { APP_RPC_URLS } from './networks'

const providerFactory = (chainId?: SupportedInterfaceChain, i = 0) =>
  new ConfiguredJsonRpcProvider(APP_RPC_URLS?.[chainId || ChainId.MAINNET]?.[i], {
    chainId: chainId || ChainId.MAINNET,
    name: CHAIN_IDS_TO_NAMES[chainId || ChainId.MAINNET] || ''
  })

function getAppProvider(chainId?: SupportedInterfaceChain) {
  return new AppJsonRpcProvider([
    new ConfiguredJsonRpcProvider(APP_RPC_URLS?.[ChainId.MAINNET]?.[0], {
      chainId: chainId || ChainId.MAINNET,
      name: CHAIN_IDS_TO_NAMES[chainId || ChainId.MAINNET] || ''
    }),
    new ConfiguredJsonRpcProvider(APP_RPC_URLS?.[ChainId.MAINNET]?.[1], {
      chainId: chainId || ChainId.MAINNET,
      name: CHAIN_IDS_TO_NAMES[chainId || ChainId.MAINNET] || ''
    })
  ])
}

/** These are the only JsonRpcProviders used directly by the interface. */
export const RPC_PROVIDERS = {
  [ChainId.MAINNET]: getAppProvider(ChainId.MAINNET)
} as Record<Partial<SupportedInterfaceChain>, AppJsonRpcProvider>

export const DEPRECATED_RPC_PROVIDERS = {
  [ChainId.MAINNET]: providerFactory(ChainId.MAINNET),
  [ChainId.BIT_DEVNET]: providerFactory(ChainId.BIT_DEVNET),
  [ChainId.BIT_MAINNET]: providerFactory(ChainId.BIT_MAINNET)
} as Record<Partial<SupportedInterfaceChain>, ConfiguredJsonRpcProvider>
