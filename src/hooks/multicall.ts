import { SkipFirst } from 'components/Widget2/types/tuple'
import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import multicall from 'state/multicall'

export type { CallStateResult } from '@uniswap/redux-multicall' // re-export for convenience
export { NEVER_RELOAD } from '@uniswap/redux-multicall' // re-export for convenience
type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<Parameters<T>, 2>

// Create wrappers for hooks so consumers don't need to get latest block themselves

type MulticallParams<
  T extends (chainId: SupportedChainId | undefined, latestBlock: number | undefined, ...args: any) => any
> = Parameters<T> extends [any, any, ...infer P] ? P : never

export function useMultipleContractSingleData(
  chainId: SupportedChainId | undefined,
  ...args: MulticallParams<typeof multicall.hooks.useMultipleContractSingleData>
) {
  const [queryChainId, latestBlock] = useCallContext(chainId)
  return multicall.hooks.useMultipleContractSingleData(queryChainId, latestBlock, ...args)
}

export function useSingleCallResult(
  chainId: SupportedChainId | undefined,
  ...args: MulticallParams<typeof multicall.hooks.useSingleCallResult>
) {
  const [queryChainId, latestBlock] = useCallContext(chainId)
  return multicall.hooks.useSingleCallResult(queryChainId, latestBlock, ...args)
}

export function useSingleContractMultipleData(
  chainId: SupportedChainId | undefined,
  ...args: MulticallParams<typeof multicall.hooks.useSingleContractMultipleData>
) {
  const [queryChainId, latestBlock] = useCallContext(chainId)
  return multicall.hooks.useSingleContractMultipleData(queryChainId, latestBlock, ...args)
}

export function useSingleContractWithCallData(
  chainId: SupportedChainId | undefined,
  ...args: MulticallParams<typeof multicall.hooks.useSingleContractWithCallData>
) {
  const [queryChainId, latestBlock] = useCallContext(chainId)
  return multicall.hooks.useSingleContractWithCallData(queryChainId, latestBlock, ...args)
}

function useCallContext(chainId?: number) {
  const { chainId: curChainId } = useActiveWeb3React()
  const queryChainId = useMemo(() => chainId || curChainId, [chainId, curChainId])

  const latestBlock = useBlockNumber(queryChainId)
  return [queryChainId, latestBlock]
}

export function useMainnetSingleCallResult(
  chainId: SupportedChainId | undefined,
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>
) {
  const latestMainnetBlock = useBlockNumber()
  return multicall.hooks.useSingleCallResult(chainId, latestMainnetBlock, ...args)
}
