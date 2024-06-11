import { useMemo } from 'react'
import { useArgentWalletDetectorContract } from './useContract'
import { useActiveWeb3React } from 'hooks'
import { NEVER_RELOAD, useSingleCallResult } from 'hooks/multicall'

export default function useIsArgentWallet(): boolean {
  const { account, chainId } = useActiveWeb3React()
  const argentWalletDetector = useArgentWalletDetectorContract()
  const inputs = useMemo(() => [account ?? undefined], [account])
  const call = useSingleCallResult(chainId, argentWalletDetector, 'isArgentWallet', inputs, NEVER_RELOAD)
  return Boolean(call?.result?.[0])
}
