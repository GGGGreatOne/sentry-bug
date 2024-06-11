import { BigNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useMulticallContract } from './useContract'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const { chainId } = useActiveWeb3React()
  const multicall = useMulticallContract()
  return useSingleCallResult(chainId, multicall, 'getCurrentBlockTimestamp')?.result?.[0]
}
