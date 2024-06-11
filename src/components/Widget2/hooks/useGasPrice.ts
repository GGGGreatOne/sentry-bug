import useENSAddress from 'components/Widget/hooks/useENSAddress'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useContract } from 'hooks/useContract'
import JSBI from 'jsbi'
import { useMemo } from 'react'

const CHAIN_DATA_ABI = [
  {
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

/**
 * Returns the price of 1 gas in WEI for the currently selected network using the chainlink fast gas price oracle
 */
export default function useGasPrice(skip = false): JSBI | undefined {
  const { chainId } = useActiveWeb3React()
  const { address } = useENSAddress('fast-gas-gwei.data.eth')
  const contract = useContract(address ?? undefined, CHAIN_DATA_ABI, false)

  const resultStr = useSingleCallResult(chainId, skip ? undefined : contract, 'latestAnswer').result?.[0]?.toString()
  return useMemo(() => (typeof resultStr === 'string' ? JSBI.BigInt(resultStr) : undefined), [resultStr])
}
