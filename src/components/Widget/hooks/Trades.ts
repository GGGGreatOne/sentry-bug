import { ChainId, Currency, CurrencyAmount, Pair, Token, Trade } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { useMemo } from 'react'

import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { isTradeBetter } from '../utils/trades'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { BASES_TO_CHECK_TRADES_AGAINST, BETTER_TRADE_LESS_HOPS_THRESHOLD } from '../constant'
import { useUserSingleHopOnly } from 'state/widget/swapUser/hooks'
import { checkChainId } from '../utils/utils'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { ZERO_ADDRESS } from '../../../constants'

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const { chainId } = useActiveWeb3React()
  const { pluginTokenList } = useGetPluginTokenListData()

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, checkChainId(chainId)), wrappedCurrency(currencyB, checkChainId(chainId))]
    : [undefined, undefined]

  const bases: Token[] = useMemo(() => {
    if (!chainId) return []
    if (!checkChainId(chainId)) return []

    // const common = checkChainId(chainId) ? BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [] : []
    const common = pluginTokenList
      .filter(i => i.contractAddress && i.contractAddress !== ZERO_ADDRESS)
      .map(
        item =>
          new Token(
            chainId as unknown as ChainId,
            item.contractAddress || '',
            item.decimals || 18,
            item.tokenSymbol || '',
            item.tokenName
          )
      )

    return [...common, ...(BASES_TO_CHECK_TRADES_AGAINST[chainId] || [])]
  }, [chainId, pluginTokenList])

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base: any): [Token, Token][] => bases.map(otherBase => [base, otherBase])),
    [bases]
  )

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
        : [],
    [tokenA, tokenB, bases, basePairs]
  )

  const allPairs = usePairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result: any): result is [PairState.EXISTS, Pair] =>
            Boolean(result[0] === PairState.EXISTS && result[1])
          )
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {})
      ),
    [allPairs]
  )
}

const MAX_HOPS = 3

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut)

  const [singleHopOnly] = useUserSingleHopOnly()

  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        )
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade | null = null
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade: Trade | null =
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: i, maxNumResults: 1 })[0] ??
          null
        // if current trade is best yet, save it
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }

    return null
  }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency)

  const [singleHopOnly] = useUserSingleHopOnly()

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        )
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade | null = null
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade =
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: i, maxNumResults: 1 })[0] ??
          null
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }
    return null
  }, [currencyIn, currencyAmountOut, allowedPairs, singleHopOnly])
}
