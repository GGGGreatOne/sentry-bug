import { ChainId, Currency, NativeCurrency, Token, UNI_ADDRESSES, WETH9 } from '@uniswap/sdk-core'
import { USD_BIT_MAINNET } from '@uniswap/smart-order-router'
import invariant from 'tiny-invariant'

// eslint-disable-next-line no-restricted-syntax
export const NATIVE_CHAIN_ID = 'NATIVE'

export const USDC_MAINNET = new Token(
  ChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDC_GOERLI = new Token(ChainId.GOERLI, '0x07865c6e87b9f70255377e024ace6630c1eaa37f', 6, 'USDC', 'USD//C')
export const USDC_SEPOLIA = new Token(
  ChainId.SEPOLIA,
  '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5',
  6,
  'USDC',
  'USD//C'
)

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')

export const MATIC_MAINNET = new Token(
  ChainId.MAINNET,
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  18,
  'MATIC',
  'Polygon Matic'
)

export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')

export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

export const UNI: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESSES[ChainId.MAINNET], 18, 'UNI', 'Uniswap'),
  [ChainId.GOERLI]: new Token(ChainId.GOERLI, UNI_ADDRESSES[ChainId.GOERLI], 18, 'UNI', 'Uniswap'),
  [ChainId.SEPOLIA]: new Token(ChainId.SEPOLIA, UNI_ADDRESSES[ChainId.SEPOLIA], 18, 'UNI', 'Uniswap')
}

export const LDO = new Token(ChainId.MAINNET, '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', 18, 'LDO', 'Lido DAO Token')
export const NMR = new Token(ChainId.MAINNET, '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671', 18, 'NMR', 'Numeraire')
export const MNW = new Token(
  ChainId.MAINNET,
  '0xd3E4Ba569045546D09CF021ECC5dFe42b1d7f6E4',
  18,
  'MNW',
  'Morpheus.Network'
)

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WETH9 as Record<ChainId, Token>),

  [ChainId.SEPOLIA]: new Token(
    ChainId.SEPOLIA,
    '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    18,
    'WETH',
    'Wrapped Ether'
  )
}
export function isBounceBit(chainId: number): boolean {
  return chainId === ChainId.BIT_DEVNET || chainId === ChainId.BIT_MAINNET
}

class BounceBitNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isBounceBit(this.chainId)) throw new Error('Not BounceBit')
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: number) {
    if (!isBounceBit(chainId)) throw new Error('Not BounceBit')
    super(chainId, 18, 'BB', 'BounceBit')
  }
}

class ExtendedEther extends NativeCurrency {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  protected constructor(chainId: number) {
    super(chainId || 1, 18, 'ETH', 'Ethereum')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token
  if (chainId === ChainId.BIT_DEVNET) {
    nativeCurrency = new BounceBitNativeCurrency(chainId)
  } else {
    nativeCurrency = ExtendedEther.onChain(chainId)
  }

  return (cachedNativeCurrency[chainId] = nativeCurrency)
}

export const TOKEN_SHORTHANDS: { [shorthand: string]: { [chainId in ChainId]?: string } } = {
  USDC: {
    [ChainId.MAINNET]: USDC_MAINNET.address,
    [ChainId.GOERLI]: USDC_GOERLI.address,
    [ChainId.SEPOLIA]: USDC_SEPOLIA.address
  }
}

const STABLECOINS: { [chainId in ChainId]?: Token[] } = {
  [ChainId.MAINNET]: [USDC_MAINNET, DAI, USDT],
  [ChainId.BIT_MAINNET]: [USD_BIT_MAINNET]
  // [ChainId.GOERLI]: [USDC_GOERLI],
  // [ChainId.SEPOLIA]: [USDC_SEPOLIA]
}

export function isStablecoin(currency?: Currency): boolean {
  if (!currency) return false
  if (!STABLECOINS) return false
  if (!STABLECOINS[currency.chainId as ChainId]) return false
  return (
    STABLECOINS?.[(currency.chainId || ChainId.MAINNET) as ChainId]?.some(stablecoin => stablecoin.equals(currency)) ||
    false
  )
}

export const UNKNOWN_TOKEN_SYMBOL = 'UNKNOWN'
export const UNKNOWN_TOKEN_NAME = 'Unknown Token'
