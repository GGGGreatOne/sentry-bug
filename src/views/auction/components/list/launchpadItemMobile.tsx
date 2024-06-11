import { Box, Stack, Typography } from '@mui/material'
import { IBoxAuctionPoolListDataItem } from 'plugins/auction/api/type'
import CategoryBox from './categoryBox'
import { parseBanner } from 'plugins/auction/utils'
import React, { useMemo } from 'react'
import PoolStatusBox from 'plugins/auction/components/poolDetail/PoolStatus'
import { useAllAuctionPoolInfo } from 'plugins/auction/hooks/useAuctionPoolInfo'
import { formatGroupNumber } from 'utils'
import { useAuctionHistory } from 'plugins/auction/pages/erc20-create-pool/hooks'
// import CollectBtn from 'views/home/components/CollectBtn'
// import { IClubPluginId } from 'state/boxes/type'
// import { useUserInfo } from 'state/user/hooks'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import { PoolStatus } from 'api/type'
import { useCountDown } from 'ahooks'
import { LoadingButton } from '@mui/lab'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
interface IProps {
  itemData: IBoxAuctionPoolListDataItem
  editing: boolean
}
const LaunchpadItemMobile = ({ itemData }: IProps) => {
  const bannerSrc = useMemo(() => {
    const { MobileBannerUrl } = parseBanner(itemData.banner)
    return MobileBannerUrl
  }, [itemData.banner])
  const poolInfo = useAllAuctionPoolInfo(itemData.factoryPoolId, itemData.category, { creator: itemData.creator })
  const { data } = useAuctionHistory(itemData.id)
  //   const { box } = useUserInfo()
  const router = useRouter()
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({ targetDate: (poolInfo?.openAt || 0) * 1000 })
  const auctionBtnProps = useMemo((): React.ComponentProps<typeof LoadingButton> => {
    if (poolInfo?.poolStatus === PoolStatus.Upcoming && countdown > 0) {
      return {
        children: <Typography>Start In {`${days}d : ${hours}h : ${minutes}m : ${seconds}s`}</Typography>,
        className: 'bg-gray'
      }
    }
    if (poolInfo?.poolStatus === PoolStatus.Live) {
      return {
        children: <Typography>Join</Typography>,
        className: 'bg-yellow'
      }
    }
    if (poolInfo?.poolStatus === PoolStatus.Closed) {
      return {
        children: <Typography>Ended on {dayjs(poolInfo.closeAt || '').format('D MMMM HH:mm')}</Typography>,
        className: 'bg-gray'
      }
    }
    if (poolInfo?.poolStatus === PoolStatus.Cancelled) {
      return {
        children: <Typography>Cancelled </Typography>,
        className: 'bg-gray'
      }
    }
    return {
      children: <Typography>Loading...</Typography>,
      className: 'bg-gray'
    }
  }, [countdown, days, hours, minutes, poolInfo?.closeAt, poolInfo?.poolStatus, seconds])
  return (
    <Box
      sx={{
        width: '100%',
        height: 304,
        borderRadius: 12,
        background: '#1B1B1B',
        boxShadow: '0px 0px 1.827px 0px rgba(0, 0, 0, 0.25)'
      }}
      onClick={() => {
        router.push(ROUTES.auction.poolDetail(`${itemData.boxId}`, itemData.id))
      }}
    >
      <Box sx={{ width: '100%', height: 160, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ width: 'fit-content', height: 'fit-content', position: 'absolute', left: 10, top: 10, zIndex: 1 }}>
          <CategoryBox category={itemData.category} />
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: `url(${bannerSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '12px 12px 0px 0px'
          }}
        />
      </Box>
      <Box mt={12} px={16}>
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 4 }}>
            <PoolStatusBox
              style={{ height: '29px' }}
              status={poolInfo?.poolStatus}
              claimAt={poolInfo?.claimAt || 0}
              openTime={poolInfo?.openAt || 0}
              closeTime={poolInfo?.closeAt || 0}
            />
            <Box
              sx={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontFamily: '"SF Pro Display"',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: '20.3px'
              }}
            >
              •
            </Box>
            <Typography
              sx={{
                overflow: 'hidden',
                color: 'rgba(255, 255, 255, 0.60)',
                textOverflow: 'ellipsis',
                fontFamily: '"SF Pro Display"',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: '150%'
              }}
            >
              {formatGroupNumber(data?.count || 0, '', 2)} participants
            </Typography>
          </Stack>
          {/* <Box>
            <CollectBtn
              isCollect={true}
              callback={() => {}}
              pluginId={IClubPluginId.Auction}
              boxId={box?.boxId || ''}
            />
          </Box> */}
        </Stack>
        <Typography
          mt={4}
          sx={{
            color: '#FFF',
            fontFamily: '"SF Pro Display"',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '150%',
            letterSpacing: '-0.32px',
            textTransform: 'uppercase'
          }}
        >
          {itemData.name}
        </Typography>
        <Stack mt={5} flexDirection={'row'} alignItems={'center'} sx={{ gap: 8 }}>
          <Box sx={{ width: 20, height: 20, overflow: 'hidden', borderRadius: '100%' }}>
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              style={{
                width: '100%',
                height: '100%'
              }}
              src={itemData.avatar || itemData.sourceClubAvatar || DefaultAvatar.src}
              alt=""
              onError={(e: any) => {
                e.target.onerror = null
                e.target.src = DefaultAvatar.src
              }}
            />
          </Box>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.60)',
              textOverflow: 'ellipsis',
              fontFamily: '"SF Pro Display"',
              fontSize: '12.788px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '150%'
            }}
          >
            {itemData.projectName || ''}
          </Typography>
        </Stack>
        <LoadingButton
          {...auctionBtnProps}
          sx={{
            mt: 5,
            width: '100%',
            height: 25,
            color: '#FFF',
            textAlign: 'center',
            fontFamily: '"SF Pro Display"',
            fontSize: '13px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '150%',
            textTransform: 'capitalize',
            borderRadius: '4px',

            backdropFilter: 'blur(5.000000476837158px)',
            '&.bg-gray': {
              background: 'rgba(255, 255, 255, 0.20)'
            },
            '&.bg-yellow': {
              background: '#E1F25C',
              color: '#323232'
            }
          }}
        />
      </Box>
    </Box>
  )
}
export default LaunchpadItemMobile
