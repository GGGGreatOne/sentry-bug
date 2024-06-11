import { ChainId, Currency } from '@uniswap/sdk'
import { CHAINS, SupportedChainId } from 'constants/chains'

export function getSymbol(token: Currency | undefined | null, chainId?: ChainId | SupportedChainId | null) {
  return token
    ? token.symbol === 'ETH'
      ? CHAINS[chainId ?? ChainId.BIT_DEVNET]?.nativeCurrency.symbol
      : token.symbol === 'WETH'
        ? 'W' + CHAINS[chainId ?? ChainId.BIT_DEVNET]?.nativeCurrency.symbol
        : token.symbol
    : ''
}

export function getName(token: Currency | undefined, chainId?: ChainId | SupportedChainId | null) {
  return token ? (token.symbol === 'ETH' ? CHAINS[chainId ?? ChainId.BIT_DEVNET]?.nativeCurrency.name : token.name) : ''
}
