import { AuctionCategory } from '../pages/erc20-create-pool/type'
import useFixedPricePoolInfo from '../plugins/fixed-price/hooks/useFixedPricePoolInfo'
import { useStakingAuctionInfo } from '../plugins/stake/hooks/useStakingInfo'

export function useAllAuctionPoolInfo(
  poolId: string | undefined,
  category: AuctionCategory | undefined,
  config?: {
    creator?: string | undefined
  }
) {
  const fixedSwapPoolInfo = useFixedPricePoolInfo(poolId)
  const stakingPoolInfo = useStakingAuctionInfo(poolId, config?.creator)

  if (category === AuctionCategory['Fixed Price Auction']) {
    return fixedSwapPoolInfo
  }
  if (category === AuctionCategory['Staking Auction']) {
    return stakingPoolInfo
  }
  return null
}
