// a list of tokens by chain
import { ChainId, Currency, Token } from '@uniswap/sdk-core'

import { DAI, USDC_MAINNET, USDT, WBTC, WRAPPED_NATIVE_CURRENCY, nativeOnChain } from './tokens'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean)
)

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [ChainId.MAINNET]: [
    nativeOnChain(ChainId.MAINNET),
    DAI,
    USDC_MAINNET,
    USDT,
    WBTC,
    WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET] as Token
  ],
  [ChainId.GOERLI]: [nativeOnChain(ChainId.GOERLI), WRAPPED_NATIVE_CURRENCY[ChainId.GOERLI] as Token],
  [ChainId.SEPOLIA]: [nativeOnChain(ChainId.SEPOLIA), WRAPPED_NATIVE_CURRENCY[ChainId.SEPOLIA] as Token],
  [ChainId.BIT_DEVNET]: [
    nativeOnChain(6000),
    WRAPPED_NATIVE_CURRENCY[ChainId.BIT_DEVNET] as Token
    // new Token(6000, '0xFB767092CB518d2bd3352df9bdD963D5301e2734', 18, 'T1', 'T1'),
    // new Token(6000, '0x18bcbb27D0Cd8605487D9420fF932c2a37bc0b3a', 18, 'T2', 'T2'),
    // new Token(6000, '0x7b204b3AcCcA53DCD97696Cb7C14d23Cb8A91bB1', 18, 'T3', 'T3'),
    // new Token(6000, '0x85748e4DaC60D284435a2B4FCe59A170E6247d60', 18, 'T4', 'T4'),
    // new Token(6000, '0x9f7800Af4E683fDcD79BE67CEffC137B4761Bd67', 18, 'T5', 'T5'),
    // new Token(6000, '0xa5Ac335B0180dB45cEc22d4Fd90f7F1C61f23e27', 18, 'T6', 'T6'),
    // new Token(6000, '0x8937872aa192B39d1Ef47222B5B2C8f4368Bf77a', 18, 'T7', 'T7'),
    // new Token(6000, '0x13F5Da219fEbD11f8761044D3fDCC2300B2512E4', 18, 'TGE', 'TGE'),
    // new Token(6000, '0x33BD2578dFa5b32eC25146A0DC740a3a02548257', 18, 'MUBI', 'MUBI')
  ],
  [ChainId.BIT_MAINNET]: [nativeOnChain(ChainId.BIT_MAINNET), WRAPPED_NATIVE_CURRENCY[ChainId.BIT_MAINNET] as Token]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_CURRENCIES_ONLY[ChainId.MAINNET], DAI, USDC_MAINNET, USDT, WBTC]
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC_MAINNET, USDT],
    [DAI, USDT]
  ]
}
