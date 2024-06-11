import { SUPPORT_NETWORK_CHAIN_IDS, SupportedChainId, SupportedChainsInfo } from '../chains'

/**
 * Fallback JSON RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
const CUSTOM_JSON_RPC_FALLBACK_ENDPOINTS: { [x in SupportedChainId]?: string[] } = {
  [SupportedChainId.TESTNET]: [],
  [SupportedChainId.BB_MAINNET]: ['https://fullnode-mainnet.bouncebitapi.com'],
  [SupportedChainId.SEPOLIA]: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161']
}

export const JSON_RPC_FALLBACK_ENDPOINTS: Record<SupportedChainId, string[]> = (() => {
  const list: Record<SupportedChainId, string[]> = {} as Record<SupportedChainId, string[]>
  for (const chainId of SUPPORT_NETWORK_CHAIN_IDS) {
    const custom = CUSTOM_JSON_RPC_FALLBACK_ENDPOINTS?.[chainId]
    const _default: string[] = [
      ...SupportedChainsInfo[chainId].rpcUrls.default.http,
      ...SupportedChainsInfo[chainId].rpcUrls.public.http
    ]
    list[chainId] = custom ? [...custom, ..._default] : _default
  }
  return list
})()

// export const JSON_RPC_FALLBACK_ENDPOINT: Record<SupportedChainId, string> = (() => {
//   const list: Record<SupportedChainId, string> = {} as Record<SupportedChainId, string>
//   for (const chainId of SupportedChainIds) {
//     const costom = CUSTOM_JSON_RPC_FALLBACK_ENDPOINTS?.[chainId]
//     list[chainId] = costom?.[0] || SupportedChainsInfo[chainId].rpcUrl
//   }
//   return list
// })()
