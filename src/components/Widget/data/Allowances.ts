import { Token, TokenAmount } from '@uniswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useTokenContract } from 'hooks/useContract'
import { useMemo } from 'react'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(chainId, contract, 'allowance', inputs).result

  return useMemo(
    () => (token && allowance ? new TokenAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  )
}
