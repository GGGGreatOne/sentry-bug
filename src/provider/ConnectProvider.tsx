import { configureChains, createConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
// import { infuraProvider } from 'wagmi/providers/infura'
// import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
// import { InjectedConnector } from 'wagmi/connectors/injected'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CHAINS, NETWORK_CHAIN_ID, SUPPORT_NETWORK_CHAIN_IDS, SupportedChainList } from 'constants/chains'
import { WagmiConfig, useNetwork } from 'wagmi'
import { useEffect } from 'react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react'
import { globalDialogControl } from 'components/Dialog'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''
const { chains, publicClient, webSocketPublicClient } = configureChains(
  SUPPORT_NETWORK_CHAIN_IDS.map(item => CHAINS[Number(item) as keyof typeof CHAINS]),
  [
    chain => {
      if (chain.id === NETWORK_CHAIN_ID) {
        return {
          chain: SupportedChainList[0],
          rpcUrls: {
            http: SupportedChainList[0].rpcUrls.default.http
          }
        }
      }
      return null
    },
    alchemyProvider({ apiKey: '74_McmNwAy18tBibLLM2aFmRdiihOcwa' })
  ]
)

const _defaultWagmiConfig = defaultWagmiConfig({ projectId, chains })
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [..._defaultWagmiConfig.connectors],
  publicClient,
  webSocketPublicClient
})

export default function ConnectProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}

export function ErrorNetworkUpdater() {
  const { chain } = useNetwork()

  useEffect(() => {
    if (chain?.unsupported) {
      globalDialogControl.show('SwitchNetworkDialog')
    }
  }, [chain])

  return null
}
