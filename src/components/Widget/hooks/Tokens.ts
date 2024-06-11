import { parseBytes32String } from '@ethersproject/strings'
import { Currency, ETHER, Token } from '@uniswap/sdk'
import { useMemo } from 'react'
import { arrayify } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { NEVER_RELOAD, useSingleCallResult } from 'hooks/multicall'
import { useBytes32TokenContract, useTokenContract } from 'hooks/useContract'
import { TokenInfo } from '@uniswap/token-lists'
import { listToTokenMap } from '../utils/listToTokenMap'
import { checkChainId } from '../utils/utils'
import { isAddress } from 'utils'
import { SupportedChainId } from 'constants/chains'
import flatMap from 'lodash.flatmap'
import { useWidgetData } from './Box'

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  constructor(tokenInfo: TokenInfo) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = {
  readonly [key in SupportedChainId]: Readonly<{
    [tokenAddress: string]: {
      token: WrappedTokenInfo
    }
  }>
}

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    const checkedChainId = checkChainId(chainId)
    if (!chainId || !checkedChainId || !tokenMap?.[checkedChainId]) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[checkedChainId]!).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        const map = tokenMap[checkedChainId]
        if (map) {
          newMap[address] = map[address].token
          return newMap
        } else {
          return newMap
        }
      },
      {}
    )

    return mapWithoutUrls
  }, [chainId, tokenMap])
}

export function useAllTokens(): { [address: string]: Token } {
  const { boxTokenList } = useWidgetData()

  const defaultList = useMemo(() => {
    return listToTokenMap(boxTokenList)
  }, [boxTokenList])

  const map = useTokensFromMap(defaultList)

  return map
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
      bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
      ? parseBytes32String(bytes32)
      : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(chainId, token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    chainId,
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(chainId, token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(
    chainId,
    token ? undefined : tokenContractBytes32,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const decimals = useSingleCallResult(chainId, token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    const checkedChainId = checkChainId(chainId)
    if (token) return token
    if (!chainId || !address || !checkedChainId) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        checkedChainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}

export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress: string | number) => {
            const token = tokens[tokenAddress]
            return Object.keys(tokens)
              .map(key => {
                const base = tokens[key]
                if (base.address === token.address) {
                  return null
                } else {
                  return [base, token]
                }
              })
              .filter((p): p is [Token, Token] => p !== null)
          })
        : [],
    [tokens, chainId]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = generatedPairs.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map(key => keyed[key])
  }, [generatedPairs])
}
