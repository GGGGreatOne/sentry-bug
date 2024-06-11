import JSBI from 'jsbi'
import { ChainId, WETH, Token, Percent } from '@uniswap/sdk'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import { WETH9 } from '@uniswap/sdk-core'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const INITIAL_ALLOWED_SLIPPAGE = 50

export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))

export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%

export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01

type ChainTokenList = {
  readonly [chainId in SupportedChainId]?: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.SEPOLIA]: [WETH[ChainId.SEPOLIA]]
}

const _ROUTER_ADDRESS: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.BIT_DEVNET]: '0xEDa8E59B4fcf2999831f666727ce65189995c83a',
  [SupportedChainId.BB_MAINNET]: '0x2307D78A37C8b730DE93681e724DC72d9585C3fC',
  [SupportedChainId.TESTNET]: '0xEDa8E59B4fcf2999831f666727ce65189995c83a'
}

export const ROUTER_ADDRESS = _ROUTER_ADDRESS[NETWORK_CHAIN_ID]

export const COMMON_CURRENCIES = ['SepoliaETH', 'WETH', 'WBB']

const _WBB: {
  [chainId in SupportedChainId]: {
    name: string
    address: string
    symbol: string
    decimals: number
    chainId: number
  }
} = {
  [SupportedChainId.SEPOLIA]: {
    name: 'Wrapped BounceBit',
    address: '',
    symbol: 'WETH',
    decimals: 18,
    chainId: 11155111
  },
  [SupportedChainId.BIT_DEVNET]: {
    name: 'Wrapped BounceBit',
    address: '0x1c895F3586bB25bEa02FC0A06fd21b69dD5C3dAB',
    symbol: 'WBB',
    decimals: 18,
    chainId: 9000
  },
  [SupportedChainId.TESTNET]: {
    name: 'Wrapped BounceBit',
    address: WETH9[SupportedChainId.TESTNET].address,
    symbol: 'WBB',
    decimals: 18,
    chainId: 6000
  },
  [SupportedChainId.BB_MAINNET]: {
    name: 'Wrapped BounceBit',
    address: WETH9[SupportedChainId.BB_MAINNET].address,
    symbol: 'WBB',
    decimals: 18,
    chainId: 6001
  }
}

export const WBB = _WBB[NETWORK_CHAIN_ID]

export const DEFAULT_TOKEN_LIST = {
  tokens: [
    {
      name: 'Wrapped Ether',
      address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
      symbol: 'WETH',
      decimals: 18,
      chainId: 11155111,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png'
    },
    {
      name: 'Test Token',
      symbol: 'TEST',
      decimals: 18,
      chainId: 11155111,
      address: '0x4aF535fD65976F7D0C8EeEd3501C026895cDe5B2',
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc778417E063141139Fce010982780140Aa0cD5Ab/logo.png'
    },
    WBB,
    {
      name: 'BTCT',
      address: '0x8cd91AAEC8CE5945987E96a13837400174e9c683',
      symbol: 'BTCB',
      decimals: 18,
      chainId: 9000
    }
  ]
}

export const PRECISION_6_LIST = ['USDT']
