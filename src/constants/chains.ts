import { sepolia, Chain } from 'viem/chains'

export type ChainInfo = Chain

const bounceBitTestnet: ChainInfo = {
  id: 6000,
  network: 'BounceBit Testnet',
  name: 'BounceBit Testnet',
  rpcUrls: {
    alchemy: {
      http: ['https://fullnode-testnet.bouncebitapi.com']
    },
    infura: {
      http: ['https://fullnode-testnet.bouncebitapi.com']
    },
    default: {
      http: ['https://fullnode-testnet.bouncebitapi.com']
    },
    public: {
      http: ['https://fullnode-testnet.bouncebitapi.com']
    }
  },
  nativeCurrency: {
    decimals: 18,
    name: 'BB',
    symbol: 'BB'
  },
  blockExplorers: {
    default: {
      name: 'BounceBit Testnet',
      url: 'https://testnet.bbscan.io/'
    }
  }
}

const bounceBitMainnet: ChainInfo = {
  id: 6001,
  network: 'BounceBit Mainnet',
  name: 'BounceBit Mainnet',
  rpcUrls: {
    alchemy: {
      http: ['https://fullnode-mainnet.bouncebitapi.com/']
    },
    infura: {
      http: ['https://fullnode-mainnet.bouncebitapi.com/']
    },
    default: {
      http: ['https://fullnode-mainnet.bouncebitapi.com/']
    },
    public: {
      http: ['https://fullnode-mainnet.bouncebitapi.com/']
    }
  },
  nativeCurrency: {
    decimals: 18,
    name: 'BB',
    symbol: 'BB'
  },
  blockExplorers: {
    default: {
      name: 'BounceBit Mainnet',
      url: 'https://mainnet.bbscan.io/'
    }
  }
}

const bounceBitDevnet: ChainInfo = {
  id: 9000,
  network: 'BounceBit Devnet',
  name: 'BounceBit Devnet',
  rpcUrls: {
    alchemy: {
      http: ['https://fullnode-devnet.bouncebitapi.com/']
    },
    infura: {
      http: ['https://fullnode-devnet.bouncebitapi.com/']
    },
    default: {
      http: ['https://fullnode-devnet.bouncebitapi.com/']
    },
    public: {
      http: ['https://fullnode-devnet.bouncebitapi.com/']
    }
  },
  nativeCurrency: {
    decimals: 18,
    name: 'BB',
    symbol: 'BB'
  },
  blockExplorers: {
    default: {
      name: 'BounceBit Devnet',
      url: 'https://web-bbscan-devnet.vercel.app/'
    }
  }
}

export enum SupportedChainId {
  TESTNET = 6000,
  BB_MAINNET = 6001,
  SEPOLIA = 11155111,
  BIT_DEVNET = 9000
}

export const CHAINS: { [key in SupportedChainId]: ChainInfo } = {
  [SupportedChainId.TESTNET]: bounceBitTestnet,
  [SupportedChainId.BB_MAINNET]: bounceBitMainnet,
  [SupportedChainId.SEPOLIA]: sepolia,
  [SupportedChainId.BIT_DEVNET]: bounceBitDevnet
}

export const CHAIN_LOGO: { [key in SupportedChainId]: string } = {
  [SupportedChainId.TESTNET]: '/favicon.png',
  [SupportedChainId.BB_MAINNET]: '/favicon.png',
  [SupportedChainId.SEPOLIA]: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  [SupportedChainId.BIT_DEVNET]: '/favicon.png'
}

export const NETWORK_CHAIN_ID: SupportedChainId =
  Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID) || SupportedChainId.BB_MAINNET

export const SUPPORT_NETWORK_CHAIN_IDS: SupportedChainId[] = process.env.NEXT_PUBLIC_CHAIN_IDS
  ? process.env.NEXT_PUBLIC_CHAIN_IDS.split(',').map(v => Number(v) as SupportedChainId)
  : [SupportedChainId.BB_MAINNET]

type IEnvironment = 'testnet' | 'dev' | 'prod'
export const CURRENT_ENVIRONMENT = (process.env.NEXT_PUBLIC_VERSION_ENVIRONMENT || 'dev') as IEnvironment

export const SupportedChainsInfo: { [x in SupportedChainId]: ChainInfo } = (() => {
  const list: { [x in SupportedChainId]: ChainInfo } = {} as { [x in SupportedChainId]: ChainInfo }
  for (const item of SUPPORT_NETWORK_CHAIN_IDS) {
    const chain = CHAINS[item]
    if (!chain) {
      throw new Error('Unsupported ChainId')
    }
    list[item] = chain
  }
  return list
})()

export const SupportedChainList = SUPPORT_NETWORK_CHAIN_IDS.map(chain => CHAINS[chain]).filter(i => i) as ChainInfo[]
