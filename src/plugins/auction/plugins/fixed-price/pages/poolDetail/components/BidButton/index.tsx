import { LoadingButton } from '@mui/lab'
import { Stack, styled, Typography } from '@mui/material'
import { useCountDown } from 'ahooks'
import { PoolStatus } from 'api/type'
import BigNumber from 'bignumber.js'
import { globalDialogControl } from 'components/Dialog/modal'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'
import { CurrencyAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCurrencyBalance } from 'hooks/useToken'
import { IWhiteListResult } from 'plugins/auction/api/type'
import { CheckStatus } from 'plugins/auction/components/create-pool/components/Check'
import { IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useFixedSwapERC20Contract } from 'plugins/auction/plugins/fixed-price/hooks/useContract'
import { useUserClaim } from 'plugins/auction/plugins/fixed-price/hooks/useFixedSwapHooks'
import usePlaceBid from 'plugins/auction/plugins/fixed-price/hooks/useFixedSwapPlaceBid'
import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import React, { useCallback, useMemo } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import SuccessfullyClaimedAlert from '../creatorPanel/alter/SuccessfullyClaimedAlert'
import { IClaimAuctionFeeResult } from 'plugins/auction/hooks/useClaimAuctionFee'

type IButtonStatusResult = React.ComponentProps<typeof LoadingButton>

interface IProps {
  toCheck?: () => void
  checkStatus?: CheckStatus
  amount: string
  poolInfo: IFixedPricePoolInfo
  isEnWhiteList: boolean
  whitelist: IWhiteListResult | undefined
  boxAddress: string | undefined
  resetState: () => void
  auctionFeeInfo: IClaimAuctionFeeResult
  hasPermission: boolean
}
export const LoadingButtonStyle = styled(LoadingButton)`
  width: 100%;
  height: 52px;
  border-radius: 100px;
  background: #ffffe5;
  padding: 20px 0px;
  color: #0c0c0c;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  &:hover {
    background: #ffffe5;
    color: #0c0c0c;
    opacity: 0.8;
  }
  &.Mui-disabled {
    border-radius: 100px;
    background: #ffffe5;
    color: #0c0c0c;
  }
`
export default function BidButton({
  toCheck,
  checkStatus,
  amount,
  poolInfo,
  isEnWhiteList,
  whitelist,
  boxAddress,
  resetState,
  auctionFeeInfo,
  hasPermission
}: IProps) {
  const WalletModalToggle = useWalletModalToggle()
  const { account, chainId } = useActiveWeb3React()
  const amountCurrencyAmount = useMemo(() => {
    if (!poolInfo.currencyAmountTotal1?.currency) {
      return
    }
    return CurrencyAmount.fromAmount(poolInfo.currencyAmountTotal1?.currency, amount)
  }, [amount, poolInfo.currencyAmountTotal1?.currency])
  const {
    swap: { runWithModal: swpRunWithModal }
  } = usePlaceBid({ ...poolInfo, boxAddress, whitelist, amountCurrencyAmount })
  const toSwapBid = useCallback(() => {
    return amountCurrencyAmount && swpRunWithModal(amountCurrencyAmount)
  }, [amountCurrencyAmount, swpRunWithModal])
  const { runWithModal: userClaim, submitted: userClaimSubmitted } = useUserClaim({
    ...poolInfo,
    boxAddress
  })
  const contract = useFixedSwapERC20Contract()
  const [approvalState, approveWithModal] = useApproveCallback(amountCurrencyAmount, contract?.address)

  const balance = useCurrencyBalance(account, poolInfo.currencyAmountTotal1?.currency, chainId)
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({ targetDate: (poolInfo.openAt || 0) * 1000 })
  const [claimCountdown, claimFormattedRes] = useCountDown({
    targetDate: (poolInfo.claimAt || 0) * 1000
  })
  const isInsufficientBalance = useMemo(() => {
    return new BigNumber(amount).gt(new BigNumber(balance?.toExact() || '0'))
  }, [amount, balance])
  const isLimitExceeded = useMemo(() => {
    const maxAmount1PerWallet = new BigNumber(poolInfo.maxAmount1PerWallet?.toExact() || '0')
    const mySwapAmount1 = new BigNumber(poolInfo.currencyAmountMySwap1?.toExact() || '0')
    const currentAmount1 = new BigNumber(amount)
    const amountTotal1 = new BigNumber(poolInfo.currencyAmountTotal1?.toExact() || '0')
    const curBid1Amount = poolInfo.amountBid1
    // Already participated in the maximum number of
    if (
      (maxAmount1PerWallet.gt(new BigNumber(0)) && mySwapAmount1.isGreaterThanOrEqualTo(maxAmount1PerWallet)) ||
      poolInfo.currencyAmountSwap1?.equalTo(poolInfo.currencyAmountTotal1 || '0')
    ) {
      return true
    }
    // has PerWallet
    if (maxAmount1PerWallet.gt(new BigNumber(0)) && mySwapAmount1.plus(currentAmount1).gt(maxAmount1PerWallet)) {
      return true
    }
    // gt leftover
    if (currentAmount1.gt(amountTotal1.minus(curBid1Amount))) {
      return true
    }
    return false
  }, [
    amount,
    poolInfo.amountBid1,
    poolInfo.currencyAmountMySwap1,
    poolInfo.currencyAmountSwap1,
    poolInfo.currencyAmountTotal1,
    poolInfo.maxAmount1PerWallet
  ])

  const buttonStatus = useMemo((): IButtonStatusResult | IButtonStatusResult[] | null => {
    if (!account) {
      return {
        children: 'Connect wallet',
        onClick: () => {
          WalletModalToggle()
        }
      }
    }
    if (!chainId || !SUPPORT_NETWORK_CHAIN_IDS.includes(chainId)) {
      return {
        children: 'Switch network',
        onClick: () => {
          globalDialogControl.show('SwitchNetworkDialog')
        }
      }
    }
    if (poolInfo.poolStatus === PoolStatus.Upcoming && countdown > 0) {
      return {
        children: (
          <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ width: '100%', padding: 20 }}>
            <Typography>Place a Bid</Typography>
            <Typography>{`${days}d : ${hours}h : ${minutes}m : ${seconds}s`}</Typography>
          </Stack>
        ),
        disabled: true
      }
    }
    if (poolInfo.poolStatus === PoolStatus.Closed) {
      const arr: IButtonStatusResult[] = []
      if (
        !poolInfo.myClaimed &&
        poolInfo.currencyAmountMySwap0?.greaterThan('0') &&
        poolInfo.releaseType !== IReleaseType.Instant
      ) {
        if (claimCountdown > 0) {
          arr.push({
            children: (
              <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ width: '100%', padding: 20 }}>
                <Typography>Claim {poolInfo.token0?.symbol?.toUpperCase() || '--'}</Typography>
                <Typography>{`${claimFormattedRes.days}d : ${claimFormattedRes.hours}h :  ${claimFormattedRes.minutes}m : ${claimFormattedRes.seconds}s`}</Typography>
              </Stack>
            ),
            disabled: true
          })
        } else {
          arr.push({
            children: 'Claim Token',
            onClick: () => userClaim(),
            loading: userClaimSubmitted.pending,
            disabled: !hasPermission
          })
        }
      }
      if (auctionFeeInfo.isCanClaimTxFee && auctionFeeInfo.amount.gt('0')) {
        arr.push({
          children: 'Claim Club Proxy Sales Earned',
          onClick: () => auctionFeeInfo.claimFee(),
          loading: auctionFeeInfo.claimFeeSubmitted.pending
        })
      }
      if (arr.length) {
        return arr.length === 1 ? arr[0] : arr
      }
    }
    if (
      (poolInfo.poolStatus === PoolStatus.Closed && !poolInfo.currencyAmountTotal1?.greaterThan('0')) ||
      !isEnWhiteList
    ) {
      return {
        children: 'Place a Bid',
        disabled: true
      }
    }
    if (!poolInfo.currencyAmountTotal0) {
      return {
        children: 'Loading...',
        disabled: true,
        loading: true
      }
    }
    //  At this time, let it enter the confirmation process
    if (poolInfo.poolStatus && checkStatus !== CheckStatus.Checked && poolInfo.poolStatus < PoolStatus.Closed) {
      return {
        children: 'Place a Bid',
        onClick: () => {
          toCheck?.()
        }
      }
    }
    if (isInsufficientBalance && poolInfo.poolStatus === PoolStatus.Live) {
      return {
        children: 'Insufficient balance',
        disabled: true
      }
    }
    if (isLimitExceeded && poolInfo.poolStatus === PoolStatus.Live) {
      return {
        children: 'Limit exceeded',
        disabled: true
      }
    }
    if (approvalState !== ApprovalState.APPROVED && !!Number(amount)) {
      if (approvalState === ApprovalState.PENDING || approvalState === ApprovalState.UNKNOWN) {
        return {
          children: 'Approve',
          disabled: true,
          loading: true
        }
      }
      if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          children: 'Approve',
          onClick: approveWithModal,
          disabled: !hasPermission
        }
      }
    }
    if (poolInfo.poolStatus === PoolStatus.Live && isEnWhiteList) {
      if (!Number(amount)) {
        return {
          children: 'Place a Bid',
          disabled: true
        }
      }
      return {
        children: 'Place a Bid',
        disabled: !hasPermission,
        onClick: () => {
          toSwapBid()?.then(() => resetState())
        }
      }
    }
    return null
  }, [
    WalletModalToggle,
    account,
    amount,
    approvalState,
    approveWithModal,
    auctionFeeInfo,
    chainId,
    checkStatus,
    claimCountdown,
    claimFormattedRes.days,
    claimFormattedRes.hours,
    claimFormattedRes.minutes,
    claimFormattedRes.seconds,
    countdown,
    days,
    hasPermission,
    hours,
    isEnWhiteList,
    isInsufficientBalance,
    isLimitExceeded,
    minutes,
    poolInfo.currencyAmountMySwap0,
    poolInfo.currencyAmountTotal0,
    poolInfo.currencyAmountTotal1,
    poolInfo.myClaimed,
    poolInfo.poolStatus,
    poolInfo.releaseType,
    poolInfo.token0?.symbol,
    resetState,
    seconds,
    toCheck,
    toSwapBid,
    userClaim,
    userClaimSubmitted.pending
  ])
  const isUserClaim = useMemo(() => {
    if (poolInfo.poolStatus === PoolStatus.Closed) {
      if (poolInfo.releaseType === IReleaseType.Instant && poolInfo.isJoined) {
        return true
      }
      if (poolInfo.isJoined && poolInfo.myClaimed) {
        return true
      }
    }
    return false
  }, [poolInfo.isJoined, poolInfo.myClaimed, poolInfo.poolStatus, poolInfo.releaseType])

  return (
    <>
      {isUserClaim && <SuccessfullyClaimedAlert />}

      {!!buttonStatus && !Array.isArray(buttonStatus) && <LoadingButtonStyle variant="contained" {...buttonStatus} />}
      {!!buttonStatus && Array.isArray(buttonStatus) && (
        <Stack sx={{ gap: 20 }}>
          <LoadingButtonStyle variant="contained" {...buttonStatus[0]} />
          <LoadingButtonStyle variant="contained" {...buttonStatus[1]} />
        </Stack>
      )}
    </>
  )
}
