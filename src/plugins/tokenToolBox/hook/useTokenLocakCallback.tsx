import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'

import {
  DISPERSE_CONTRACT_ADDRESSES,
  SupportedChainId,
  TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES,
  TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES,
  TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES
} from 'plugins/tokenToolBox/constants'
import { Currency, CurrencyAmount } from 'constants/token'

import { IReleaseType } from '../type'
import { useTokenAllowance } from 'hooks/useAllowances'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { useERC721Contract } from 'hooks/useContract'
import { useGetApproved } from 'hooks/useNFTApproveAllCallback'
import { useSingleCallResult } from 'hooks/multicall'
import { useERC721Balance } from 'hooks/useNFTTokenBalance'

export interface TokenlockResponse {
  tokenCurrency: Currency | undefined
  balance: CurrencyAmount | undefined
  allowance: CurrencyAmount | undefined
  max: string
}
export interface Token721lockResponse {
  isApprovedAll: any
  balance: string | undefined
}

export const useErc20TokenDetail = (
  tokenAddress: string,
  queryChainId: SupportedChainId,
  releaseType: IReleaseType
): TokenlockResponse => {
  const { account } = useActiveWeb3React()
  const res = useToken(tokenAddress, queryChainId)
  const balance = useCurrencyBalance(account, res ?? undefined, queryChainId)
  const contractAddress = useMemo(() => {
    return releaseType === IReleaseType.Linear
      ? TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES[queryChainId]
      : TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES[queryChainId]
  }, [queryChainId, releaseType])

  const currentAllowance = useTokenAllowance(res ?? undefined, account ?? undefined, contractAddress)
  const max = useMemo(() => {
    return balance ? balance?.toExact() : '0'
  }, [balance])
  return useMemo(() => {
    return { tokenCurrency: res || undefined, balance: balance, allowance: currentAllowance, max }
  }, [balance, currentAllowance, max, res])
}

export const useDisperseErc20TokenDetail = (tokenAddress: string, queryChainId: SupportedChainId): any => {
  const { account } = useActiveWeb3React()
  const res = useToken(tokenAddress, queryChainId)

  const balance = useCurrencyBalance(account, res ?? undefined, queryChainId)
  const currentAllowance = useTokenAllowance(
    res ?? undefined,
    account ?? undefined,
    DISPERSE_CONTRACT_ADDRESSES[queryChainId]
  )
  const max = useMemo(() => {
    return balance && currentAllowance
      ? balance?.greaterThan(currentAllowance)
        ? currentAllowance.toExact()
        : balance?.toExact()
      : '0'
  }, [balance, currentAllowance])
  return useMemo(() => {
    return { tokenCurrency: res, balance: balance, allowance: currentAllowance, max }
  }, [balance, currentAllowance, max, res])
}

// TODO delete
export function useErc721BalanceOf(
  tokenAddress: string | undefined,
  account: string | undefined,
  queryChainId: SupportedChainId
): string | undefined {
  const result = useERC721Balance(tokenAddress, account, queryChainId)
  return result
}

export const useErc721TokenDetail = (tokenAddress: string, queryChainId: SupportedChainId): Token721lockResponse => {
  const { account } = useActiveWeb3React()
  const contractAddress = TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES[queryChainId]
  const contract = useERC721Contract(tokenAddress)
  //   const balance = useErc721BalanceOf(tokenAddress, account, queryChainId)
  const balance = useErc721BalanceOf(tokenAddress, account, queryChainId)
  //   const isApprovedAll = useErc721IsApprovedAll(tokenAddress, account, queryChainId)
  const isApprovedAll = useGetApproved(contract || undefined, contractAddress)
  return useMemo(() => {
    return { isApprovedAll, balance }
  }, [balance, isApprovedAll])
}

export function useERC721Owner(
  tokenAddress: string | undefined,
  account: string | undefined,
  queryChainId: SupportedChainId,
  tokenId: string | number
) {
  const contract = useERC721Contract(tokenAddress || '')
  const res = useSingleCallResult(queryChainId, account ? contract : null, 'ownerOf', [tokenId])
  return useMemo(() => {
    if (res.loading || !res.result) return undefined
    return res.result?.[0]
  }, [res.loading, res.result])
}
