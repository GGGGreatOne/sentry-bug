import { L2_CHAIN_IDS } from '../constants/chains'
import { L2_DEADLINE_FROM_NOW } from '../constants/misc'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from 'state/hooks'

import { useInterfaceMulticall } from 'hooks/useContract'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { useActiveWeb3React } from 'hooks'
import { BigNumber } from 'ethers'

export default function useTransactionDeadline(): BigNumber | undefined {
  const { chainId } = useActiveWeb3React()
  const ttl = useAppSelector(state => state.swap2.user.userDeadline)
  const blockTimestamp = useCurrentBlockTimestamp()
  return useMemo(() => timestampToDeadline(chainId, blockTimestamp, ttl), [blockTimestamp, chainId, ttl])
}

/**
 * Returns an asynchronous function which will get the block timestamp and combine it with user settings for a deadline.
 * Should be used for any submitted transactions, as it uses an on-chain timestamp instead of a client timestamp.
 */
export function useGetTransactionDeadline(): () => Promise<BigNumber | undefined> {
  const { chainId } = useActiveWeb3React()
  const ttl = useAppSelector(state => state.swap2.user.userDeadline)
  const multicall = useInterfaceMulticall()
  return useCallback(async () => {
    const blockTimestamp = await multicall?.getCurrentBlockTimestamp()
    return timestampToDeadline(chainId, blockTimestamp, ttl)
  }, [chainId, multicall, ttl])
}

function timestampToDeadline(chainId?: number, blockTimestamp?: BigNumber, ttl?: number) {
  if (blockTimestamp && chainId && (L2_CHAIN_IDS as any).includes(chainId))
    return blockTimestamp.add(L2_DEADLINE_FROM_NOW)
  if (blockTimestamp && ttl) return blockTimestamp.add(ttl)
  return undefined
}
