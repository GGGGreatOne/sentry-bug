import { ChainId, NativeCurrency, Token } from '@uniswap/sdk-core'
import { nativeOnChain } from '../../constants/tokens'
import { useMemo } from 'react'
import { SupportedChainId } from 'constants/chains'

export default function useNativeCurrency(
  chainId: ChainId | null | undefined | SupportedChainId
): NativeCurrency | Token {
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(ChainId.MAINNET),
    [chainId]
  )
}
