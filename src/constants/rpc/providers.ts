import { SupportedChainId, SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'
import AppStaticJsonRpcProvider from './StaticJsonRpcProvider'
import StaticJsonRpcProvider from './StaticJsonRpcProvider'
import { JSON_RPC_FALLBACK_ENDPOINTS } from './jsonRpcEndpoints'
import AppRpcProvider from './AppRpcProvider'

const providerFactory = (chainId: SupportedChainId, i = 0) =>
  new AppStaticJsonRpcProvider(chainId, JSON_RPC_FALLBACK_ENDPOINTS[chainId][i])

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS: { [key in SupportedChainId]: StaticJsonRpcProvider } = (() => {
  const list: { [key in SupportedChainId]: StaticJsonRpcProvider } = {} as {
    [key in SupportedChainId]: StaticJsonRpcProvider
  }
  for (const chainId of SUPPORT_NETWORK_CHAIN_IDS) {
    // list[chainId] = providerFactory(chainId)
    list[chainId] = new AppRpcProvider(
      chainId,
      JSON_RPC_FALLBACK_ENDPOINTS[chainId].map((_, idx) => providerFactory(chainId, idx))
    )
  }
  return list
})()
