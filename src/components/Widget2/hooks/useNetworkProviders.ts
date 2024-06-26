import { DEPRECATED_RPC_PROVIDERS, RPC_PROVIDERS } from '../constants/providers'
import { FeatureFlags } from '../lib/uniswap/src/features/experiments/flags'
import { useFeatureFlag } from '../lib/uniswap/src/features/experiments/hooks'

export function useNetworkProviders() {
  return useFeatureFlag(FeatureFlags.FallbackProvider) ? RPC_PROVIDERS : DEPRECATED_RPC_PROVIDERS
}
