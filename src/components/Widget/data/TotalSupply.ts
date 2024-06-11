import { Token, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useTokenContract } from 'hooks/useContract'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const contract = useTokenContract(token?.address, false)

  const totalSupply: BigNumber = useSingleCallResult(chainId, contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}
