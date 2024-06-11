import { Box } from '@mui/material'
import { useHasTransactionClubPermissions } from 'hooks/boxes/useClubAuthCallback'
import useGetBoxAddress from 'hooks/boxes/useGetBoxAddress'
import { useGetBoxInfo } from 'hooks/boxes/useGetBoxInfo'
import { useRouter } from 'next/router'
import { useAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/hooks'
import { AuctionCategory } from 'plugins/auction/pages/erc20-create-pool/type'
import FixedSwapPool from 'plugins/auction/plugins/fixed-price/pages/poolDetail'
import StakingPool from 'plugins/auction/plugins/stake/pages/stake-pool-detail'
import { useMemo } from 'react'
export default function Page() {
  const {
    query: { poolId: _poolId, clubId: _clubId }
  } = useRouter()
  const [poolId, clubId] = useMemo(
    (): Array<string | undefined> => [
      _poolId ? _poolId.toString() : undefined,
      _clubId ? _clubId.toString() : undefined
    ],
    [_poolId, _clubId]
  )
  const { data: clubInfo } = useGetBoxInfo(clubId)
  const { boxAddress } = useGetBoxAddress(clubInfo?.rewardId || undefined)

  const { data, refresh } = useAuctionPoolInfo(poolId)
  const props = useMemo(() => ({ ...data, boxAddress }), [boxAddress, data])
  const hasPermission = useHasTransactionClubPermissions(boxAddress, data?.auction?.boxId)
  return (
    <Box mt={70}>
      {data?.auction?.category === AuctionCategory['Fixed Price Auction'] && (
        <FixedSwapPool {...props} {...hasPermission} refreshAuctionInfo={refresh} />
      )}
      {data?.auction?.category === AuctionCategory['Staking Auction'] && (
        <StakingPool {...props} {...hasPermission} refreshAuctionInfo={refresh} />
      )}
    </Box>
  )
}
