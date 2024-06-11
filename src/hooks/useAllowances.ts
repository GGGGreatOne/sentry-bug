import { useMemo } from 'react'

import { useTokenContract } from './useContract'
import { useSingleCallResult } from './multicall'
import { CurrencyAmount, Currency } from '../constants/token'

export function useTokenAllowance(token?: Currency, owner?: string, spender?: string): CurrencyAmount | undefined {
  const contract = useTokenContract(!token?.isNative ? token?.address : undefined, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(token?.chainId, contract, 'allowance', inputs, undefined).result

  return useMemo(
    () => (token && allowance ? new CurrencyAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  )
}
