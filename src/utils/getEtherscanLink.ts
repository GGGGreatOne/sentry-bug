import { SupportedChainId, SupportedChainsInfo } from '../constants/chains'

const explorers = {
  etherscan: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  blockscout: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokens/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  harmony: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/address/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  okex: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokenAddr/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },
  moonriver: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokens/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },
  fuse: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokens/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },
  telos: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/transaction/${data}`
      case 'token':
        return `${link}/address/${data}`
      case 'address':
        return `${link}/address/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },
  moonbeam: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokens/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  }
}

interface ChainObject {
  [chainId: number]: {
    builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

// Configure special
const chains: ChainObject = {
  [100]: {
    builder: explorers.blockscout
  },
  [43114]: {
    builder: explorers.blockscout
  },
  [1666600000]: {
    builder: explorers.harmony
  },
  [66]: {
    builder: explorers.okex
  },
  [1285]: {
    builder: explorers.moonriver
  },
  [122]: {
    builder: explorers.fuse
  },
  [40]: {
    builder: explorers.telos
  },
  [1284]: {
    builder: explorers.moonbeam
  },
  [2222]: {
    builder: explorers.blockscout
  }
}

export function getEtherscanLink(
  chainId: SupportedChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const builder = chains[chainId]?.builder || explorers.etherscan
  return builder(SupportedChainsInfo[chainId]?.blockExplorers?.default.url || '', data, type)
}
