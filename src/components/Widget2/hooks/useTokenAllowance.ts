import { ContractTransaction } from '@ethersproject/contracts'
import { CurrencyAmount, MaxUint256, Token } from '@uniswap/sdk-core'

import { useTokenContract } from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApproveTransactionInfo, TransactionType } from '../state/transactions/types'
import { UserRejectedRequestError } from '../utils/errors'
import { didUserReject } from '../utils/swapErrorToUserReadableMessage'
import { useSingleCallResult } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'

const MAX_ALLOWANCE = MaxUint256.toString()

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string
): {
  tokenAllowance?: CurrencyAmount<Token>
  isSyncing: boolean
} {
  const { chainId } = useActiveWeb3React()
  const contract = useTokenContract(token?.address, false)
  const inputs = useMemo(() => [owner, spender], [owner, spender])

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the tokenAllowance is marked isSyncing upon approval and updated upon being synced.
  const [blocksPerFetch, setBlocksPerFetch] = useState<1>()
  const { result, syncing: isSyncing } = useSingleCallResult(chainId, contract, 'allowance', inputs, {
    blocksPerFetch
  }) as {
    result?: Awaited<ReturnType<NonNullable<typeof contract>['allowance']>>
    syncing: boolean
  }

  const rawAmount = result?.toString() // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount]
  )
  useEffect(() => setBlocksPerFetch(allowance?.equalTo(0) ? 1 : undefined), [allowance])

  return useMemo(() => ({ tokenAllowance: allowance, isSyncing }), [allowance, isSyncing])
}

export function useUpdateTokenAllowance(
  amount: CurrencyAmount<Token> | undefined,
  spender: string
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const contract = useTokenContract(amount?.currency.address)

  return useCallback(async () => {
    try {
      if (!amount) throw new Error('missing amount')
      if (!contract) throw new Error('missing contract')
      if (!spender) throw new Error('missing spender')

      const allowance = amount.equalTo(0) ? '0' : MAX_ALLOWANCE
      const response = await (async () => {
        try {
          return await contract.approve(spender, allowance)
        } catch (error) {
          if (didUserReject(error)) {
            const symbol = amount?.currency.symbol ?? 'Token'
            throw new UserRejectedRequestError(`${symbol} token allowance failed: User rejected`)
          } else {
            throw error
          }
        }
      })()

      return {
        response,
        info: {
          type: TransactionType.APPROVAL,
          tokenAddress: contract.address,
          spender,
          amount: allowance
        }
      }
    } catch (error: unknown) {
      if (error instanceof UserRejectedRequestError) {
        throw error
      } else {
        const symbol = amount?.currency.symbol ?? 'Token'
        throw new Error(`${symbol} token allowance failed: ${error instanceof Error ? error.message : error}`)
      }
    }
  }, [amount, contract, spender])
}

export function useRevokeTokenAllowance(
  token: Token | undefined,
  spender: string
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const amount = useMemo(() => (token ? CurrencyAmount.fromRawAmount(token, 0) : undefined), [token])

  return useUpdateTokenAllowance(amount, spender)
}
