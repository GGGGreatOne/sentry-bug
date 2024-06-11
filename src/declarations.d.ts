/// <reference types="next-plugin-svgr/types/svg" />
declare module 'toformat'
declare module 'react-copy-to-clipboard'
declare module 'big.js'
declare module 'ua-parser-js'
declare module 'copy-to-clipboard'
declare module 'lodash'
declare module 'react-transition-group'

interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    send: (...args: any[]) => void
    request?: (...args: any[]) => Promise<any>
    removeListener?: (...args: any[]) => void
    isBraveWallet?: true
    isRabby?: true
    isTrust?: true
    isLedgerConnect?: true
    isCoinbaseWallet?: true
    isBinance?: boolean
  }
  okxwallet?: any
  bitkeep: any
  // eslint-disable-next-line @typescript-eslint/ban-types
  web3?: {
    isMetaMask?: false
    on?: (...args: any[]) => void
    send: (...args: any[]) => Promise<any>
    enable: (...args: any[]) => Promise<any>
    request?: (...args: any[]) => Promise<any>
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: any
    cachedResults?: any
    isDapper?: boolean
    chainId?: number
    netVersion?: number
    networkVersion?: number
    _chainId?: number
    currentProvider: any
  }
  chatWidgetApi: any
  setShowWidget?: (show: boolean) => void
  signWithDevKey?: (message: any) => void
  thirdLoginWatch?: () => void
  chatToAddressWatch?: (addr: string, callback?: (arg0: boolean) => any) => void
  joinToPublicRoomWatch
}
