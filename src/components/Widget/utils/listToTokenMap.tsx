import { SupportedChainId } from 'constants/chains'
import { TokenInfo } from '@uniswap/token-lists'
import { WrappedTokenInfo } from '../hooks/Tokens'
import { ZERO_ADDRESS } from 'constants/index'

type TokenAddressMap = {
  readonly [SupportedChainId.SEPOLIA]: Readonly<{
    [tokenAddress: string]: {
      token: WrappedTokenInfo
    }
  }>
  readonly [SupportedChainId.BIT_DEVNET]: Readonly<{
    [tokenAddress: string]: {
      token: WrappedTokenInfo
    }
  }>
  readonly [SupportedChainId.TESTNET]: Readonly<{
    [tokenAddress: string]: {
      token: WrappedTokenInfo
    }
  }>
  readonly [SupportedChainId.BB_MAINNET]: Readonly<{
    [tokenAddress: string]: {
      token: WrappedTokenInfo
    }
  }>
}

const EMPTY_LIST: TokenAddressMap = {
  [SupportedChainId.SEPOLIA]: {},
  [SupportedChainId.BIT_DEVNET]: {},
  [SupportedChainId.TESTNET]: {},
  [SupportedChainId.BB_MAINNET]: {}
}

export function listToTokenMap(list: { tokens: TokenInfo[] }): TokenAddressMap {
  const map = list.tokens?.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      if (tokenInfo.address === ZERO_ADDRESS) {
        return tokenMap
      }
      const token = new WrappedTokenInfo(tokenInfo)
      if (tokenMap[token.chainId][token.address] !== undefined) {
        return tokenMap
      }
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token
          }
        }
      }
    },
    { ...EMPTY_LIST }
  )

  return map
}
