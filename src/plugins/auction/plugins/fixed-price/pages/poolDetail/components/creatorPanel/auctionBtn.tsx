import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import { LoadingButtonStyle } from '../BidButton'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'
import { globalDialogControl } from 'components/Dialog'
import { PoolStatus } from 'api/type'
import BigNumber from 'bignumber.js'
import { useFixedSwapCreatorClaim } from 'plugins/auction/plugins/fixed-price/hooks/useFixedSwapHooks'
import { useUserInfo } from 'state/user/hooks'
import { IClaimAuctionFeeResult } from 'plugins/auction/hooks/useClaimAuctionFee'
import { Stack } from '@mui/material'

interface IProps {
  poolInfo: IFixedPricePoolInfo
  boxAddress: string | undefined
  auctionFeeInfo: IClaimAuctionFeeResult
  hasPermission: boolean
}
type IButtonStatus = React.ComponentProps<typeof LoadingButtonStyle>
export default function AuctionBtn({ poolInfo, auctionFeeInfo, hasPermission }: IProps) {
  const { account, chainId } = useActiveWeb3React()
  const WalletModalToggle = useWalletModalToggle()
  const hasToken0 = useMemo(() => {
    const amountSwap0 = new BigNumber(poolInfo.currencyAmountSwap0?.toExact() || '0')
    const amountTotal0 = new BigNumber(poolInfo.amountTotal0?.toString() || '0')
    return !!amountTotal0.isLessThanOrEqualTo(amountSwap0)
  }, [poolInfo.amountTotal0, poolInfo.currencyAmountSwap0])
  const userInfo = useUserInfo()
  const { runWithModal: toClaim, submitted } = useFixedSwapCreatorClaim(
    userInfo.box?.boxAddress,
    poolInfo.poolId,
    poolInfo
  )
  const buttonStatus = useMemo((): IButtonStatus | IButtonStatus[] | null => {
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
    if (poolInfo.poolStatus === PoolStatus.Closed) {
      const arr: IButtonStatus[] = []
      if (!poolInfo.creatorClaimed) {
        arr.push({
          children: <span>{!hasToken0 ? 'Claim your unswapped tokens and fund raised' : 'Claim fund raised'}</span>,
          onClick: () => {
            toClaim()
          },
          loading: submitted.pending,
          disabled: !hasPermission
        })
      }
      if (auctionFeeInfo.isCanClaimTxFee && auctionFeeInfo.amount.gt(0)) {
        arr.push({
          children: <span>Claim club proxy sales earned</span>,
          onClick: () => {
            auctionFeeInfo.claimFee()
          },
          loading: auctionFeeInfo.claimFeeSubmitted.pending,
          disabled: !hasPermission
        })
      }
      if (arr.length) {
        return arr.length === 1 ? arr[0] : arr
      }
    }

    if (poolInfo.poolStatus === PoolStatus.Upcoming && !poolInfo.creatorClaimed) {
      return {
        children: ' Cancel',
        onClick: () => {
          toClaim()
        },
        loading: submitted.pending,
        disabled: !hasPermission
      }
    }
    return null
  }, [
    WalletModalToggle,
    account,
    auctionFeeInfo,
    chainId,
    hasPermission,
    hasToken0,
    poolInfo.creatorClaimed,
    poolInfo.poolStatus,
    submitted.pending,
    toClaim
  ])
  return (
    <>
      {buttonStatus && !Array.isArray(buttonStatus) && (
        <LoadingButtonStyle
          sx={{
            height: 50,
            borderRadius: 100,
            border: '1px solid  rgba(255, 255, 229, 0.60)',
            backgroundColor: 'transparent',
            color: '#FFFFE5',
            fontSize: { xs: 14, md: 16 }
          }}
          variant="contained"
          {...buttonStatus}
        />
      )}
      {buttonStatus && Array.isArray(buttonStatus) && (
        <Stack sx={{ gap: 20 }}>
          <LoadingButtonStyle
            sx={{
              height: 50,
              borderRadius: 100,
              border: '1px solid  rgba(255, 255, 229, 0.60)',
              backgroundColor: 'transparent',
              color: '#FFFFE5',
              fontSize: { xs: 14, md: 16 }
            }}
            variant="contained"
            {...buttonStatus[0]}
          />
          <LoadingButtonStyle
            sx={{
              height: 50,
              borderRadius: 100,
              border: '1px solid  rgba(255, 255, 229, 0.60)',
              backgroundColor: '#E6E6CE',
              color: '#1B1B1B',
              fontSize: { xs: 14, md: 16 }
            }}
            variant="contained"
            {...buttonStatus[1]}
          />
        </Stack>
      )}
    </>
  )
}
