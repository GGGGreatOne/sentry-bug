import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from 'hooks/multicall'
import { useBoxContract, useBoxFactoryContract } from 'hooks/useContract'
import { ClubMemberMode } from './types'
import { useCallback, useMemo } from 'react'
import { CurrencyAmount } from 'constants/token'
import { useToken } from 'hooks/useToken'
import { useTransactionAdder, useUserHasSubmittedRecords } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils/contract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionModalWrapper } from 'hooks/useTransactionModalWrapper'
import { SupportedChainId } from 'constants/chains'
import { useGetBoxInfo } from './useGetBoxInfo'

export function useClubAuthCallback(clubAddress: string | undefined) {
  const { account, chainId } = useActiveWeb3React()
  const clubContract = useBoxContract(clubAddress, chainId)
  const boxFactoryContract = useBoxFactoryContract(chainId)
  const boxOwner: string | undefined = useSingleCallResult(chainId, boxFactoryContract, 'ownerOf', [clubAddress])
    .result?.[0]
  const memberMode: ClubMemberMode | undefined = useSingleCallResult(chainId, clubContract, 'memberMode').result?.[0]
  const isMembers: boolean | undefined = useQueryIsMember(clubAddress, chainId, account)

  const getPaymentRes = useSingleCallResult(chainId, clubContract, 'getPayment', [0]).result
  const paymentToken = useToken(getPaymentRes?.[0], chainId)
  const paymentTokenAmount = useMemo(() => {
    if (paymentToken && getPaymentRes?.[1]) {
      return new CurrencyAmount(paymentToken, getPaymentRes?.[1]?.toString())
    }
    return undefined
  }, [getPaymentRes, paymentToken])

  const addTransaction = useTransactionAdder()
  const _setMemberModeAction = 'setClubMemberMode' + clubAddress
  const setMemberModeSubmitted = useUserHasSubmittedRecords(account || undefined, _setMemberModeAction)

  const _setMemberModeToWhiteList = useCallback(
    async (addresses: string[]) => {
      if (!clubContract || !account) throw new Error('Contract not found')
      const data1 = clubContract.interface.encodeFunctionData('setMemberMode', [ClubMemberMode.WHITELIST_MODE])
      const data2 = clubContract.interface.encodeFunctionData('addMembers', [addresses])
      const estimatedGas = await clubContract.estimateGas.multicall([data1, data2]).catch((error: Error) => {
        console.debug('Failed set mode', error)
        throw error
      })
      return clubContract
        .multicall([data1, data2], {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Set member mode for club`,
            userSubmitted: {
              account,
              action: _setMemberModeAction
            }
          })
          return response
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, addTransaction, clubContract]
  )
  const setMemberModeToWhiteList = useTransactionModalWrapper(_setMemberModeToWhiteList)

  const _setMemberModeToPayment = useCallback(
    async (amount: CurrencyAmount) => {
      if (!clubContract || !account) throw new Error('Contract not found')
      const data1 = clubContract.interface.encodeFunctionData('setMemberMode', [ClubMemberMode.PAYMENT_MODE])
      const data2 = clubContract.interface.encodeFunctionData('setPayment', [
        amount.currency.address,
        amount.raw.toString()
      ])
      const estimatedGas = await clubContract.estimateGas.multicall([data1, data2]).catch((error: Error) => {
        console.debug('Failed set mode', error)
        throw error
      })
      return clubContract
        .multicall([data1, data2], {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Set member mode for club`,
            userSubmitted: {
              account,
              action: _setMemberModeAction
            }
          })
          return response
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, addTransaction, clubContract]
  )
  const setMemberModeToPayment = useTransactionModalWrapper(_setMemberModeToPayment)

  const _addMembers = useCallback(
    async (addresses: string[]) => {
      if (!clubContract || !account) throw new Error('Contract not found')
      const estimatedGas = await clubContract.estimateGas.addMembers(addresses).catch((error: Error) => {
        console.debug('Failed to add members', error)
        throw error
      })
      return clubContract
        .addMembers(addresses, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Successfully add membership`
          })
          return response
        })
    },
    [account, addTransaction, clubContract]
  )
  const addMembers = useTransactionModalWrapper(_addMembers)

  const _removeMembers = useCallback(
    async (addresses: string[]) => {
      if (!clubContract || !account) throw new Error('Contract not found')
      const estimatedGas = await clubContract.estimateGas.removeMembers(addresses).catch((error: Error) => {
        console.debug('Failed to add members', error)
        throw error
      })
      return clubContract
        .removeMembers(addresses, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Successfully remove membership`
          })
          return response
        })
    },
    [account, addTransaction, clubContract]
  )
  const removeMembers = useTransactionModalWrapper(_removeMembers)

  const _userSubscribeAction = 'userClubSubscribeAction' + clubAddress
  const userSubscribeSubmitted = useUserHasSubmittedRecords(account || undefined, _userSubscribeAction)

  const _userSubscribe = useCallback(async () => {
    if (!clubContract || !account) throw new Error('Contract not found')
    if (!paymentTokenAmount) throw new Error('paymentToken not found')
    const estimatedGas = await clubContract.estimateGas
      .subscribe(paymentTokenAmount.currency.address, {
        value: paymentTokenAmount.currency.isNative ? paymentTokenAmount.raw.toString() : undefined
      })
      .catch((error: Error) => {
        console.debug('Failed to subscribe', error)
        throw error
      })
    return clubContract
      .subscribe(paymentTokenAmount.currency.address, {
        gasLimit: calculateGasMargin(estimatedGas),
        value: paymentTokenAmount.currency.isNative ? paymentTokenAmount.raw.toString() : undefined
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Successfully subscribe`,
          userSubmitted: {
            account,
            action: _userSubscribeAction
          }
        })
        return response
      })
  }, [_userSubscribeAction, account, addTransaction, clubContract, paymentTokenAmount])
  const userSubscribe = useTransactionModalWrapper(_userSubscribe)

  const isFreeMode = useMemo(() => {
    return memberMode !== ClubMemberMode.PAYMENT_MODE && memberMode !== ClubMemberMode.WHITELIST_MODE
  }, [memberMode])

  return useMemo(() => {
    const isClubOwner = account && boxOwner && boxOwner.toLowerCase() === account.toLowerCase()
    return {
      isFreeMode,
      memberMode,
      paymentToken: paymentToken || undefined,
      paymentTokenAmount,
      setMemberModeSubmitted,
      setMemberModeToWhiteList,
      setMemberModeToPayment,
      addMembers,
      removeMembers,
      userSubscribe,
      userSubscribeSubmitted,
      isMembers: memberMode === ClubMemberMode.FREE_MODE || isClubOwner ? true : isMembers,
      isClubOwner,
      boxOwner
    }
  }, [
    account,
    addMembers,
    boxOwner,
    isFreeMode,
    isMembers,
    memberMode,
    paymentToken,
    paymentTokenAmount,
    removeMembers,
    setMemberModeSubmitted,
    setMemberModeToPayment,
    setMemberModeToWhiteList,
    userSubscribe,
    userSubscribeSubmitted
  ])
}

export function useQueryIsMember(
  clubAddress: string | undefined,
  chainId: SupportedChainId | undefined,
  account: string | undefined
) {
  const clubContract = useBoxContract(clubAddress, chainId)
  const isMembers: boolean | undefined = useSingleCallResult(chainId, clubContract, 'isMembers', [account || undefined])
    .result?.[0]

  return isMembers
}

export interface IClubAuthContainer {
  hasUserPermissions: boolean
  hasClubOwnerPermissions: boolean
}

export function useHasTransactionClubPermissions(
  clubAddress: string | undefined,
  boxId: string | undefined
): IClubAuthContainer {
  const { account } = useActiveWeb3React()
  const { isFreeMode, isMembers: _isMembers, isClubOwner: _isClubOwner } = useClubAuthCallback(clubAddress)

  const isMembers = useMemo(() => {
    if (!isFreeMode) {
      return !!_isClubOwner || _isMembers
    }
    return true
  }, [_isClubOwner, _isMembers, isFreeMode])
  const { data: _data } = useGetBoxInfo(boxId)

  const hasPermission = useMemo(() => {
    if (_data?.listingStatus && account?.toUpperCase() === _data?.ownerAddress?.toLowerCase() && !isMembers) {
      return false
    }
    if (isFreeMode || !_data?.listingStatus) {
      return true
    }
    if (!isFreeMode && isMembers) {
      return true
    }
    return false
  }, [_data?.listingStatus, _data?.ownerAddress, account, isMembers, isFreeMode])

  return useMemo(
    () => ({ hasUserPermissions: hasPermission, hasClubOwnerPermissions: !!_isClubOwner }),
    [_isClubOwner, hasPermission]
  )
}
