/* eslint-disable @next/next/no-img-element */
import { Box, styled, Typography } from '@mui/material'
import RankItem from './RankItem'
import { FollowinglistItem } from 'api/user/type'
import { formatGroupNumber } from 'utils'
// import StatusItem from './StatusItem'
// import { PoolType } from 'api/type'
import FollowButton from 'views/clubs/components/FollowButton'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { BorderRadius, ClampTypography, EllipsisTypography } from 'views/account/profile/components/FollowerCarItem'
import BigNumber from 'bignumber.js'
const ItemComtainer = styled(Box)`
  width: 100%;
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  border-radius: 12px;
  background: var(--Neutral-1, #1b1b1b);
  box-shadow: 2px 4px 12px 0px rgba(0, 0, 0, 0.08);
  cursor: pointer;
`

const RankBox = styled(Box)`
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 10px;
  background: var(--ps-text-primary);
`

// const PoolTypeText: Record<PoolType, string> = {
//   [PoolType.FIXED_SWAP]: 'Token Fixed Price Auction'
// }

const NoBox = ({ item, index, mutate }: { item: FollowinglistItem; index: number; mutate: any }) => {
  const { avatar, userName, eoaAddress } = item
  console.log('list', index, mutate)
  const isMd = useBreakpoint('md')

  return (
    <ItemComtainer>
      <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={16}>
        <img src={avatar} alt="" width={isMd ? 60 : 80} height={isMd ? 60 : 80}></img>
        <Box width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={8}>
          <EllipsisTypography
            width={isMd ? 150 : 200}
            fontWeight={500}
            lineHeight={'130%'}
            fontSize={isMd ? 15 : 20}
            color="var(--ps-text-100)"
          >
            {userName ? userName : eoaAddress}
          </EllipsisTypography>
        </Box>
      </Box>
    </ItemComtainer>
  )
}

const FollowingsCarItem = ({
  item,
  index,
  mutate,
  isNomal
}: {
  item: FollowinglistItem
  index: number
  mutate: any
  isNomal: boolean
}) => {
  const isMd = useBreakpoint('md')
  const {
    avatar,
    tvl,
    isFollower,
    rank,
    userName,
    projectName,
    boxId,
    rewardId,
    eoaAddress,
    description,
    followCount
  } = item
  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )
  if (!boxId) return <NoBox item={item} index={index} mutate={mutate} />
  return (
    <ItemComtainer
      onClick={(event: React.SyntheticEvent) => {
        event.stopPropagation()
        if (isNomal) return
        routeTo(item.boxId)
      }}
    >
      <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={16}>
        <BorderRadius>
          {avatar ? (
            <img
              src={avatar}
              alt=""
              width={isMd ? 60 : 80}
              height={isMd ? 60 : 80}
              onError={(e: any) => {
                e.target.onerror = null
                e.target.src = DefaultAvatar.src
              }}
            ></img>
          ) : (
            <Image src={DefaultAvatar.src} alt="" width={isMd ? 60 : 80} height={isMd ? 60 : 80}></Image>
          )}
        </BorderRadius>
        <Box flex={1} width={'100%'} display={'flex'} flexDirection={'column'} gap={8}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
            <Box display={'flex'} width={'100%'} flexDirection={'column'} gap={4}>
              <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={8}
              >
                <EllipsisTypography
                  width={isMd ? 90 : 200}
                  fontWeight={500}
                  lineHeight={'130%'}
                  fontSize={isMd ? 15 : 20}
                  color="var(--ps-text-100)"
                >
                  {boxId ? projectName : userName ? userName : eoaAddress}
                </EllipsisTypography>
                <FollowButton
                  boxId={boxId}
                  isFollower={isFollower}
                  callBack={() => {
                    // mutate((data: Followinglist) => {
                    //   data.list.splice(index, 1)
                    //   return {
                    //     list: [...data.list],
                    //     total: data.total - 1
                    //   }
                    // })
                  }}
                ></FollowButton>
              </Box>
              <Typography
                fontWeight={500}
                lineHeight={'100%'}
                fontSize={13}
                color="var(--ps-neutral4)"
              >{`Club ID #${rewardId} · ${followCount} Followers`}</Typography>
            </Box>
          </Box>
          <ClampTypography lineHeight={'140%'} fontSize={12} color="var(--ps-neutral3)">
            {description}
          </ClampTypography>
        </Box>
      </Box>
      <RankBox>
        <RankItem rank={rank} />
        <Box display={'flex'} gap={5}>
          <Typography color="var(--ps-neutral5)" fontSize={13} lineHeight={'140%'}>
            {`${formatGroupNumber(tvl ? new BigNumber(tvl).toNumber() : 0, '', 2)} TVL`}
          </Typography>
        </Box>
      </RankBox>
    </ItemComtainer>
  )
}
export default FollowingsCarItem
