import { SkipToken, skipToken } from '@reduxjs/toolkit/query/react'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { GetQuoteArgs, INTERNAL_ROUTER_PREFERENCE_PRICE, RouterPreference } from '../../../state/routing/types'
import { currencyAddressForSwapQuote } from '../../../state/routing/utils'
import { FeatureFlags } from '../../../lib/uniswap/src/features/experiments/flags'
import { useFeatureFlag } from '../../../lib/uniswap/src/features/experiments/hooks'
import store from 'state'

/**
 * Returns query arguments for the Routing API query or undefined if the
 * query should be skipped. Input arguments do not need to be memoized, as they will
 * be destructured.
 */
export function useRoutingAPIArguments({
  account,
  tokenIn,
  tokenOut,
  amount,
  tradeType,
  routerPreference
}: {
  account?: string
  tokenIn?: Currency
  tokenOut?: Currency
  amount?: CurrencyAmount<Currency>
  tradeType: TradeType
  routerPreference: RouterPreference | typeof INTERNAL_ROUTER_PREFERENCE_PRICE
}): GetQuoteArgs | SkipToken {
  const uniswapXForceSyntheticQuotes = useFeatureFlag(FeatureFlags.UniswapXSyntheticQuote)
  // Don't enable fee logic if this is a quote for pricing
  const sendPortionEnabled = routerPreference !== INTERNAL_ROUTER_PREFERENCE_PRICE

  const gasPrice = store.getState().application.chainGasPrice

  return useMemo(
    () =>
      !tokenIn || !tokenOut || !amount || tokenIn.equals(tokenOut) || tokenIn.wrapped.equals(tokenOut.wrapped)
        ? skipToken
        : {
            account,
            amount: amount.quotient.toString(),
            tokenInAddress: currencyAddressForSwapQuote(tokenIn),
            tokenInChainId: tokenIn.chainId,
            tokenInDecimals: tokenIn.wrapped.decimals,
            tokenInSymbol: tokenIn.wrapped.symbol,
            tokenOutAddress: currencyAddressForSwapQuote(tokenOut),
            tokenOutChainId: tokenOut.wrapped.chainId,
            tokenOutDecimals: tokenOut.wrapped.decimals,
            tokenOutSymbol: tokenOut.wrapped.symbol,
            routerPreference,
            tradeType,
            needsWrapIfUniswapX: tokenIn.isNative,
            uniswapXForceSyntheticQuotes,
            sendPortionEnabled,
            gasPrice: gasPrice || undefined
          },
    [
      tokenIn,
      tokenOut,
      amount,
      account,
      routerPreference,
      tradeType,
      uniswapXForceSyntheticQuotes,
      sendPortionEnabled,
      gasPrice
    ]
  )
}
