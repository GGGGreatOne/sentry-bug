/* eslint-disable @next/next/no-img-element */
import { Box, styled, Typography } from '@mui/material'
import Image from 'next/image'
// import RankItem from './RankItem'
import { FollowerlistItem } from 'api/user/type'
// import { formatGroupNumber } from 'utils'
// import StatusItem from './StatusItem'
// import { PoolType } from 'api/type'
import FollowButton from 'views/clubs/components/FollowButton'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'

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

// const RankBox = styled(Box)`
//   display: flex;
//   padding: 12px;
//   align-items: center;
//   gap: 12px;
//   align-self: stretch;
//   border-radius: 10px;
//   background: var(--ps-text-primary);
// `

// const PoolTypeText: Record<PoolType, string> = {
//   [PoolType.FIXED_SWAP]: 'Token Fixed Price Auction'
// }

export const ClampTypography = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-height: 1.2em;
  max-height: 2.4em;

  ${props => props.theme.breakpoints.down('md')} {
    -webkit-line-clamp: 1;
    max-width: 300px;
  }
  ${props => props.theme.breakpoints.down('sm')} {
    -webkit-line-clamp: 1;
    width: 200px;
  }
`

export const EllipsisTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const BorderRadius = styled(Box)`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 12px;

  ${props => props.theme.breakpoints.down('md')} {
    width: 60px;
    height: 60px;
  }
`

const NoBox = ({ item, index, mutate }: { item: FollowerlistItem; index: number; mutate: any }) => {
  const { boxAvatar, userName, eoaAddress, boxId } = item
  const isMd = useBreakpoint('md')
  console.log('list', index, mutate)
  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )

  return (
    <ItemComtainer
      onClick={(event: React.SyntheticEvent) => {
        event.stopPropagation()
        if (!boxId) return
        routeTo(boxId)
      }}
    >
      <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={16}>
        <BorderRadius>
          {boxAvatar ? (
            <img
              src={boxAvatar}
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
        <Box flex={1} width={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={8}>
          <EllipsisTypography
            width={isMd ? 150 : 280}
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

const FollowerCarItem = ({ item, index, mutate }: { item: FollowerlistItem; index: number; mutate: any }) => {
  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )
  const isMd = useBreakpoint('md')
  const { boxAvatar, userName, projectName, boxId, rewardId, description, followCount, eoaAddress } = item
  if (!boxId) return <NoBox item={item} index={index} mutate={mutate} />

  return (
    <ItemComtainer
      onClick={event => {
        event.stopPropagation()
        if (!boxId) return
        routeTo(boxId)
      }}
    >
      <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={16}>
        <BorderRadius>
          {boxAvatar ? (
            <img
              src={boxAvatar}
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
                  width={isMd ? 90 : 180}
                  fontWeight={500}
                  lineHeight={'130%'}
                  fontSize={isMd ? 15 : 20}
                  color="var(--ps-text-100)"
                >
                  {boxId ? projectName : userName ? userName : eoaAddress}
                </EllipsisTypography>
                <FollowButton
                  boxId={boxId}
                  isFollower={item.following}
                  callBack={() => {
                    // mutate((data: Followinglist) => {
                    //   return {
                    //     list: [...data.list],
                    //     total: data.total
                    //   }
                    // })
                  }}
                ></FollowButton>
              </Box>
              <Typography fontWeight={500} lineHeight={'100%'} fontSize={isMd ? 12 : 13} color="var(--ps-neutral4)">
                {`Club ID #${rewardId} · ${followCount} Followers`}
              </Typography>
            </Box>
          </Box>
          <ClampTypography lineHeight={'140%'} fontSize={12} color="var(--ps-neutral3)">
            {description}
          </ClampTypography>
        </Box>
      </Box>
      {/* <RankBox>
        <RankItem rank={rank} />
        <Box display={'flex'} gap={5}>
          <Typography color="var(--ps-neutral5)" fontSize={13} lineHeight={'140%'}>
            {`${formatGroupNumber(tvl ? tvl : 0, '', 2)} BIT`}
          </Typography>
        </Box>
      </RankBox> */}
    </ItemComtainer>
  )
}
export default FollowerCarItem
