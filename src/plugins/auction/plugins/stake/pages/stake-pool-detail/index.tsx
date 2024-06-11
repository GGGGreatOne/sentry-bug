import { useActiveWeb3React } from 'hooks'
import { Steps } from './Step'
import { Box, Stack, styled } from '@mui/material'
import { useStakingAuctionInfo } from '../../hooks/useStakingInfo'
import { IAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import PoolHeader from '../../../../components/poolDetail/Header'
import PoolHistoryAndDec from 'plugins/auction/components/poolDetail/PoolHistoryAndDec'
import { useStakingCreatorClaim } from '../../hooks/useStakeHooks'
import { LoadingButton } from '@mui/lab'
import JoinPoolTip from 'plugins/auction/components/poolDetail/JoinPoolTip'
import { IClubAuthContainer } from 'hooks/boxes/useClubAuthCallback'
import useClaimAuctionFee from 'plugins/auction/hooks/useClaimAuctionFee'

const StakeButton = styled(LoadingButton)(({ theme }) => ({
  height: 36,
  width: '100%',
  maxWidth: 200,
  padding: '20px 0',
  display: 'flex',
  gap: 10,
  borderRadius: '100px',
  background: '#121212',
  color: '#fff',
  svg: {
    path: { color: '#fff' }
  },
  ':hover': {
    background: '#000',
    opacity: 0.6
  },
  '&.Mui-disabled': {
    color: '#fff'
  },
  [theme.breakpoints.down('md')]: {
    width: 200,
    height: '42px'
  }
}))
const nowTime = () => new Date().getTime()
const Page = (
  props: IAuctionPoolInfo & { refreshAuctionInfo: () => void } & { boxAddress: string | undefined } & IClubAuthContainer
) => {
  const { account } = useActiveWeb3React()
  const poolId = props.auction?.factoryPoolId
  const stakingInfo = useStakingAuctionInfo(poolId, account)
  const { claimFee, claimFeeSubmitted, isCanClaimTxFee, amount } = useClaimAuctionFee(
    stakingInfo || undefined,
    props.auction?.boxId
  )

  const { runWithModal: toClaim, submitted } = useStakingCreatorClaim(stakingInfo, poolId, props?.boxAddress)
  if (!stakingInfo) {
    return null
  }
  return (
    <Box mt={70} sx={{ backgroundColor: '#1d1d1d' }}>
      <PoolHeader
        auction={props.auction}
        claimAt={stakingInfo?.claimAt}
        closeAt={stakingInfo?.closeAt}
        openAt={stakingInfo?.openAt}
        poolStatus={stakingInfo?.poolStatus}
        tokenCurrency={stakingInfo?.token0}
        swapRatio={stakingInfo?.swapRatio}
        token0Amount={stakingInfo?.currencyAmountTotal0}
        token1Currency={stakingInfo?.token1}
      />
      {props.auction && props.auction.factoryPoolId && (
        <>
          <Box mt={73}>
            <JoinPoolTip poolInfo={stakingInfo} {...props} />
          </Box>
          <Box pb={20} style={{ background: '#1d1d1d' }}>
            <Steps
              hasPermission={props.hasUserPermissions}
              coinInfo={stakingInfo}
              auctionInfo={props}
              boxAddress={props?.boxAddress}
            />
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={'row'}
              sx={{ width: '100%', gap: 20, padding: { xs: '0 20px', md: 0 }, mt: { xs: 10, md: 0 } }}
            >
              {stakingInfo &&
                account &&
                account === stakingInfo.creator &&
                nowTime() > Number(stakingInfo.claimAt) * 1000 + Number(stakingInfo.releaseDuration) * 1000 && (
                  <StakeButton
                    loading={submitted.pending}
                    onClick={() => toClaim()}
                    disabled={
                      account === undefined ||
                      stakingInfo?.creator !== account ||
                      stakingInfo.creatorClaimed ||
                      !props.hasClubOwnerPermissions
                    }
                  >
                    Creator Claim
                  </StakeButton>
                )}
              {stakingInfo &&
                account &&
                account === stakingInfo.creator &&
                nowTime() < Number(stakingInfo.openAt) * 1000 &&
                props.hasClubOwnerPermissions && (
                  <StakeButton
                    loading={submitted.pending}
                    onClick={() => toClaim()}
                    disabled={
                      account === undefined ||
                      stakingInfo?.creator !== account ||
                      stakingInfo.creatorClaimed ||
                      !props.hasClubOwnerPermissions
                    }
                  >
                    Creator Cancel
                  </StakeButton>
                )}
              {isCanClaimTxFee && amount.gt(0) && (
                <LoadingButton
                  sx={{
                    width: '100%',
                    maxWidth: 200,
                    borderRadius: 36,
                    // border: '1px solid #171717',
                    backgroundColor: '#FFFFE5',
                    color: '#1C1C19',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '150%',
                    letterSpacing: '-0.28px',
                    '&:hover': {
                      backgroundColor: '#FFFFE5'
                    }
                  }}
                  onClick={() => {
                    claimFee()
                  }}
                  loading={claimFeeSubmitted.pending}
                  disabled={!props.hasClubOwnerPermissions}
                >
                  Claim fund raised
                </LoadingButton>
              )}
            </Stack>
          </Box>
        </>
      )}
      <PoolHistoryAndDec hideHistory swapRatio={stakingInfo.swapRatio?.toExact()} auction={props.auction} />
    </Box>
  )
}
export default Page
