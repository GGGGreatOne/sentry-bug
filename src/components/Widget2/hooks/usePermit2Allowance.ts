import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { AVERAGE_L1_BLOCK_TIME } from '../constants/chainInfo'
import { PermitSignature, usePermitAllowance, useUpdatePermitAllowance } from '../hooks/usePermitAllowance'
import { useRevokeTokenAllowance, useTokenAllowance, useUpdateTokenAllowance } from './useTokenAllowance'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { InterfaceTrade, TradeFillType } from '../state/routing/types'
import { useHasPendingApproval, useHasPendingRevocation } from '../state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'
import useInterval from 'ahooks/lib/useInterval'
import { PERMIT2_ADDRESS } from '@uniswap/universal-router-sdk'
import { useTransactionAdder } from 'state/transactions/hooks'

enum ApprovalState {
  PENDING,
  SYNCING,
  SYNCED
}

export enum AllowanceState {
  LOADING,
  REQUIRED,
  ALLOWED
}

interface AllowanceRequired {
  state: AllowanceState.REQUIRED
  token: Token
  isApprovalLoading: boolean
  isApprovalPending: boolean
  isRevocationPending: boolean
  approveAndPermit: () => Promise<void>
  approve: () => Promise<void>
  permit: () => Promise<void>
  revoke: () => Promise<void>
  needsSetupApproval: boolean
  needsPermitSignature: boolean
  allowedAmount: CurrencyAmount<Token>
}

export type Allowance =
  | { state: AllowanceState.LOADING }
  | {
      state: AllowanceState.ALLOWED
      permitSignature?: PermitSignature
    }
  | AllowanceRequired

export default function usePermit2Allowance(
  amount?: CurrencyAmount<Token>,
  spender?: string,
  tradeFillType?: TradeFillType,
  trade?: InterfaceTrade
): Allowance {
  const { account } = useActiveWeb3React()
  const token = amount?.currency

  const { tokenAllowance, isSyncing: isApprovalSyncing } = useTokenAllowance(token, account, PERMIT2_ADDRESS)
  const updateTokenAllowance = useUpdateTokenAllowance(amount, '0x89a053Bca16b3fA7494a203a9Fd420dB8dCAdf6f')
  const revokeTokenAllowance = useRevokeTokenAllowance(token, '0x89a053Bca16b3fA7494a203a9Fd420dB8dCAdf6f')
  const isApproved = useMemo(() => {
    if (!amount || !tokenAllowance) return false
    return tokenAllowance.greaterThan(amount) || tokenAllowance.equalTo(amount)
  }, [amount, tokenAllowance])

  // Marks approval as loading from the time it is submitted (pending), until it has confirmed and another block synced.
  // This avoids re-prompting the user for an already-submitted but not-yet-observed approval, by marking it loading
  // until it has been re-observed. It wll sync immediately, because confirmation fast-forwards the block number.
  const [approvalState, setApprovalState] = useState(ApprovalState.SYNCED)
  const isApprovalLoading = approvalState !== ApprovalState.SYNCED
  const isApprovalPending = useHasPendingApproval(token, PERMIT2_ADDRESS)
  const isRevocationPending = useHasPendingRevocation(token, PERMIT2_ADDRESS)

  useEffect(() => {
    if (isApprovalPending) {
      setApprovalState(ApprovalState.PENDING)
    } else {
      setApprovalState(state => {
        if (state === ApprovalState.PENDING && isApprovalSyncing) {
          return ApprovalState.SYNCING
        } else if (state === ApprovalState.SYNCING && !isApprovalSyncing) {
          return ApprovalState.SYNCED
        }
        return state
      })
    }
  }, [isApprovalPending, isApprovalSyncing])

  // Signature and PermitAllowance will expire, so they should be rechecked at an interval.
  // Calculate now such that the signature will still be valid for the submitting block.
  const [now, setNow] = useState(Date.now() + AVERAGE_L1_BLOCK_TIME)
  useInterval(
    useCallback(() => setNow((Date.now() + AVERAGE_L1_BLOCK_TIME) / 1000), []),
    AVERAGE_L1_BLOCK_TIME
  )

  const [signature, setSignature] = useState<PermitSignature>()
  const isSigned = useMemo(() => {
    if (!amount || !signature) return false
    return signature.details.token === token?.address && signature.spender === spender && signature.sigDeadline >= now
  }, [amount, now, signature, spender, token?.address])

  const { permitAllowance, expiration: permitExpiration, nonce } = usePermitAllowance(token, account, spender)
  const updatePermitAllowance = useUpdatePermitAllowance(token, spender, nonce, setSignature)
  const isPermitted = useMemo(() => {
    if (!amount || !permitAllowance || !permitExpiration) return false
    return (permitAllowance.greaterThan(amount) || permitAllowance.equalTo(amount)) && permitExpiration >= now
  }, [amount, now, permitAllowance, permitExpiration])

  const shouldRequestApproval = !(isApproved || isApprovalLoading)

  // UniswapX trades do not need a permit signature step in between because the swap step _is_ the permit signature
  const shouldRequestSignature = tradeFillType === TradeFillType.Classic && !(isPermitted || isSigned)

  const addTransaction = useTransactionAdder()
  const approveAndPermit = useCallback(async () => {
    if (shouldRequestApproval) {
      const { response } = await updateTokenAllowance()
      addTransaction(response, {
        summary: `Approve and Permit ${trade?.inputAmount.toExact()} ${
          trade?.inputAmount.currency.symbol?.toLocaleUpperCase() === 'ETH'
            ? 'BB'
            : trade?.inputAmount.currency.symbol?.toLocaleUpperCase()
        }`
      })
    }
    if (shouldRequestSignature) {
      await updatePermitAllowance()
    }
  }, [
    addTransaction,
    shouldRequestApproval,
    shouldRequestSignature,
    trade?.inputAmount,
    updatePermitAllowance,
    updateTokenAllowance
  ])

  const approve = useCallback(async () => {
    const { response } = await updateTokenAllowance()
    addTransaction(response, {
      summary: `Approve ${trade?.inputAmount.toExact()} ${
        trade?.inputAmount.currency.symbol?.toLocaleUpperCase() === 'ETH'
          ? 'BB'
          : trade?.inputAmount.currency.symbol?.toLocaleUpperCase()
      }`
    })
  }, [addTransaction, trade?.inputAmount, updateTokenAllowance])

  const revoke = useCallback(async () => {
    const { response } = await revokeTokenAllowance()
    addTransaction(response, {
      summary: `Revoke ${
        trade?.inputAmount.currency.symbol?.toLocaleUpperCase() === 'ETH'
          ? 'BB'
          : trade?.inputAmount.currency.symbol?.toLocaleUpperCase()
      }`
    })
  }, [addTransaction, revokeTokenAllowance, trade?.inputAmount.currency.symbol])

  return useMemo(() => {
    if (token) {
      if (!tokenAllowance || !permitAllowance) {
        return { state: AllowanceState.LOADING }
      } else if (shouldRequestSignature) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading: false,
          isApprovalPending,
          isRevocationPending,
          approveAndPermit,
          approve,
          permit: updatePermitAllowance,
          revoke,
          needsSetupApproval: !isApproved,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance
        }
      } else if (!isApproved) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading,
          isApprovalPending,
          isRevocationPending,
          approveAndPermit,
          approve,
          permit: updatePermitAllowance,
          revoke,
          needsSetupApproval: true,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance
        }
      }
    }
    return {
      token,
      state: AllowanceState.ALLOWED,
      permitSignature: !isPermitted && isSigned ? signature : undefined,
      needsSetupApproval: false,
      needsPermitSignature: false
    }
  }, [
    approve,
    approveAndPermit,
    isApprovalLoading,
    isApprovalPending,
    isApproved,
    isPermitted,
    isSigned,
    updatePermitAllowance,
    permitAllowance,
    revoke,
    isRevocationPending,
    shouldRequestSignature,
    signature,
    token,
    tokenAllowance
  ])
}
