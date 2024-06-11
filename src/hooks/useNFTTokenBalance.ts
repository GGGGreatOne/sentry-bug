import { SupportedChainId } from '../constants/chains'
import { useERC1155Contract, useERC721Contract } from './useContract'
import { useSingleCallResult, useSingleContractMultipleData } from './multicall'
import { useMemo } from 'react'

export function useERC1155Balance(
  tokenAddress: string | undefined,
  account: string | undefined,
  tokenId: number | string | undefined,
  queryChainId?: SupportedChainId
): string | undefined {
  const contract = useERC1155Contract(tokenAddress)
  const res = useSingleCallResult(queryChainId, tokenId && account ? contract : null, 'balanceOf', [
    account,
    tokenId
  ]).result

  return res?.[0].toString()
}
export function useERC721Balance(
  tokenAddress: string | undefined,
  account: string | undefined,
  queryChainId?: SupportedChainId
): string | undefined {
  const contract = useERC721Contract(tokenAddress)
  const res = useSingleCallResult(queryChainId, account ? contract : null, 'balanceOf', [account]).result
  return res?.[0].toString()
}

export function useERC721MultiOwner(
  tokenAddress: string | undefined,
  account: string | undefined,
  tokenIds: string[],
  queryChainId?: SupportedChainId
) {
  const contract = useERC721Contract(tokenAddress)

  const res = useSingleContractMultipleData(
    queryChainId,
    tokenIds.length && account ? contract : null,
    'ownerOf',
    tokenIds.map(i => [i])
  )

  return useMemo(() => {
    const ret: string[] = []
    for (const idx in tokenIds) {
      if (Object.prototype.hasOwnProperty.call(tokenIds, idx)) {
        if (account && res?.[idx].result?.toString().toLowerCase() === account.toLowerCase()) {
          ret.push(tokenIds[idx])
        }
      }
    }
    return {
      loading: res?.[0]?.loading || false,
      ownerIds: ret
    }
  }, [account, res, tokenIds])
}
