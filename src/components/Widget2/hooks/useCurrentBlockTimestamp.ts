import { useMemo } from 'react'

import { ListenerOptions } from '@uniswap/redux-multicall'
import { useInterfaceMulticall } from 'hooks/useContract'
import { BigNumber } from 'ethers'
import { useSingleCallResult } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(options?: ListenerOptions): BigNumber | undefined {
  const { chainId } = useActiveWeb3React()
  const multicall = useInterfaceMulticall()
  const resultStr: string | undefined = useSingleCallResult(
    chainId,
    multicall,
    'getCurrentBlockTimestamp',
    undefined,
    options
  )?.result?.[0]?.toString()
  return useMemo(() => (typeof resultStr === 'string' ? BigNumber.from(resultStr) : undefined), [resultStr])
}
