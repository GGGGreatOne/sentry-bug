import { useBoxFeeAmount, useClaimFee } from 'hooks/feeDistributor'
import { useUserInfo } from 'state/user/hooks'
import { IBaseAuctionPoolInfo } from '../type'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { PoolStatus } from 'api/type'

export type IClaimAuctionFeeResult = ReturnType<typeof useClaimAuctionFee>

export default function useClaimAuctionFee(
  poolInfo: IBaseAuctionPoolInfo | undefined,
  boxId: number | string | undefined
) {
  const userInfo = useUserInfo()
  const { account } = useActiveWeb3React()
  const { amount, currencyAmount } = useBoxFeeAmount(
    userInfo.box?.boxAddress,
    poolInfo?.currencyAmountTotal1?.currency.address
  )
  const isCanClaimTxFee = useMemo(() => {
    // is owner or box id eq
    if (
      (poolInfo?.creator?.toLocaleLowerCase() === account?.toLocaleLowerCase() ||
        `${boxId}` === `${userInfo.box?.boxId}`) &&
      Number(poolInfo?.poolStatus) >= PoolStatus.Closed
    ) {
      return true
    }
    return false
  }, [account, boxId, poolInfo?.creator, poolInfo?.poolStatus, userInfo.box?.boxId])

  const { runWithModal: claimFee, submitted: claimFeeSubmitted } = useClaimFee(
    userInfo.box?.boxAddress,
    poolInfo?.currencyAmountTotal1?.currency.address,
    currencyAmount
  )
  return useMemo(() => {
    return {
      isCanClaimTxFee,
      claimFee,
      claimFeeSubmitted,
      amount,
      currencyAmount
    }
  }, [amount, claimFee, claimFeeSubmitted, currencyAmount, isCanClaimTxFee])
}
