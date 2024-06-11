import { Box } from '@mui/material'
import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import AuctionBtn from './auctionBtn'
import UpcomingPoolCreatorAlert from './alter/UpcomingPoolCreatorAlert'
import LivePoolCreatorAlert from './alter/LivePoolCreatorAlert'
import SuccessfullyClaimedAlert from './alter/SuccessfullyClaimedAlert'
import { PoolStatus } from 'api/type'
import { IClaimAuctionFeeResult } from 'plugins/auction/hooks/useClaimAuctionFee'

interface IProps {
  poolInfo: IFixedPricePoolInfo
  boxAddress: string | undefined
  auctionFeeInfo: IClaimAuctionFeeResult
  hasPermission: boolean
}
export default function CreatorPanel({ poolInfo, boxAddress, auctionFeeInfo, hasPermission }: IProps) {
  return (
    <Box>
      <AuctionBtn
        poolInfo={poolInfo}
        boxAddress={boxAddress}
        auctionFeeInfo={auctionFeeInfo}
        hasPermission={hasPermission}
      />
      <Box mt={10}>
        {poolInfo.poolStatus === PoolStatus.Upcoming && <UpcomingPoolCreatorAlert txFeeRatio={poolInfo.txFeeRatio} />}
        {poolInfo.poolStatus === PoolStatus.Live && <LivePoolCreatorAlert />}
        {(poolInfo.poolStatus === PoolStatus.Closed || poolInfo.poolStatus === PoolStatus.Cancelled) &&
          poolInfo.creatorClaimed && <SuccessfullyClaimedAlert />}
      </Box>
    </Box>
  )
}
