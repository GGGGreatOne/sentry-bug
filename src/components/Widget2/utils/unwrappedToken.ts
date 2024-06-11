import { Currency } from '@uniswap/sdk-core'

import { nativeOnChain, WRAPPED_NATIVE_CURRENCY } from '../constants/tokens'
import { asSupportedChain } from '../constants/chains'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = asSupportedChain(currency.chainId)
  if (formattedChainId && WRAPPED_NATIVE_CURRENCY[formattedChainId]?.equals(currency))
    return nativeOnChain(currency.chainId)
  return currency
}
