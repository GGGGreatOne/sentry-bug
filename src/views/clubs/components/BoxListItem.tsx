/* eslint-disable @next/next/no-img-element */
import { Box, styled, Typography } from '@mui/material'
// import Verified from 'assets/svg/account/verified.svg'
import RankItem from 'views/account/profile/components/RankItem'
// import StatusItem from './StatusItem'
// import { PoolType } from 'api/type'
import SmVerifiedIcon from 'assets/svg/verifiedIconSm.svg'
import VerifiedIcon from 'assets/svg/verifyIcon.svg'
import { BoxListSimpleItem } from 'api/boxes/type'
import DefaultImage from 'assets/images/account/default_followings_item.png'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { ROUTES } from 'constants/routes'
import FollowButton from './FollowButton'
import { formatGroupNumber } from 'utils'
import BigNumber from 'bignumber.js'
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
  background: var(--ps-neutral);
  box-shadow: 2px 4px 12px 0px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background: var(--ps-neutral2);
  }
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

const ClampTypography = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-height: 1.2em;
  max-height: 2.4em;
`

const EllipsisTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

function BoxListItem({ item, callBack }: { item: BoxListSimpleItem; callBack: () => void }) {
  const { followCount, avatar, isFollower, rank, tvl, projectName, boxId, rewardId, description } = item
  const route = useRouter()
  const routeTo = useCallback(() => {
    route.push(ROUTES.club.cusBox(item.boxId.toString()))
  }, [item.boxId, route])
  const isMd = useBreakpoint('md')

  if (isMd) {
    return (
      <ItemComtainer onClick={routeTo}>
        <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={16}>
          <Box position={'relative'}>
            <img
              src={avatar}
              alt=""
              srcSet=""
              width={60}
              height={60}
              style={{
                borderRadius: 10
              }}
              onError={(e: any) => {
                e.target.onerror = null
                e.target.src = DefaultImage.src
              }}
            />
            {item?.verified && <SmVerifiedIcon width={24} style={{ position: 'absolute', top: 48, left: 50 }} />}
          </Box>

          <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={8}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
              <Box display={'flex'} flexDirection={'column'} gap={4} width={'100%'}>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  width={'100%'}
                >
                  <EllipsisTypography
                    width={isMd ? 155 : 300}
                    fontWeight={500}
                    lineHeight={'130%'}
                    fontSize={20}
                    color="var(--ps-text-100)"
                  >
                    {projectName}
                  </EllipsisTypography>
                  {isFollower !== undefined && (
                    <FollowButton boxId={boxId} isFollower={isFollower} callBack={callBack} />
                  )}
                </Box>
                <Typography
                  fontWeight={500}
                  lineHeight={'100%'}
                  fontSize={13}
                  color="var(--ps-neutral4)"
                  sx={{
                    wordWrap: 'break-word'
                  }}
                >{`Club ID #${rewardId} · ${followCount} Followers`}</Typography>
              </Box>
            </Box>
            <ClampTypography lineHeight={'140%'} fontSize={12} color="var(--ps-neutral3)">
              {description}
            </ClampTypography>
          </Box>
        </Box>
        {!!rank && (
          <RankBox>
            <RankItem rank={rank} />
            {/* <StatusItem status={status}></StatusItem> */}
            <Box display={'flex'} gap={5}>
              <Typography color="var(--ps-neutral5)" fontSize={13} lineHeight={'140%'}>
                ${`${formatGroupNumber(tvl ? new BigNumber(tvl).toNumber() : 0, '', 2)}  TVL`}
              </Typography>
            </Box>
          </RankBox>
        )}
      </ItemComtainer>
    )
  }

  return (
    <ItemComtainer onClick={routeTo}>
      <Box width={'100%'} display={'flex'} flexDirection={'row'} gap={16}>
        <Box position={'relative'}>
          <img
            src={avatar}
            alt=""
            srcSet=""
            width={80}
            height={80}
            style={{
              borderRadius: 10
            }}
            onError={(e: any) => {
              e.target.onerror = null
              e.target.src = DefaultImage.src
            }}
          />
          {item?.verified && (
            <VerifiedIcon width={24} style={{ position: 'absolute', bottom: 'calc(50% - 40px)', left: 65 }} />
          )}
        </Box>

        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={8}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
            <Box display={'flex'} flexDirection={'column'} gap={4}>
              <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={8}>
                <EllipsisTypography
                  width={isMd ? 100 : 300}
                  fontWeight={500}
                  lineHeight={'130%'}
                  fontSize={20}
                  color="var(--ps-text-100)"
                >
                  {projectName}
                </EllipsisTypography>
              </Box>
              <Typography
                fontWeight={500}
                lineHeight={'100%'}
                fontSize={13}
                color="var(--ps-neutral4)"
              >{`Club ID #${rewardId} · ${followCount} Followers`}</Typography>
            </Box>
            {isFollower !== undefined && <FollowButton boxId={boxId} isFollower={isFollower} callBack={callBack} />}
          </Box>
          <ClampTypography width={isMd ? 200 : undefined} lineHeight={'140%'} fontSize={12} color="var(--ps-neutral3)">
            {description}
          </ClampTypography>
        </Box>
      </Box>
      <RankBox>
        <RankItem rank={rank} />
        {/* <StatusItem status={status}></StatusItem> */}
        <Box display={'flex'} gap={5}>
          <Typography color="var(--ps-neutral5)" fontSize={13} lineHeight={'140%'}>
            {tvl ? ` ${`$${formatGroupNumber(new BigNumber(tvl).toNumber(), '', 2)} TVL`}` : '$-- TVL'}
          </Typography>
          {/* <Typography color="var(--ps-neutral3)" fontSize={13} lineHeight={'140%'}>
            {PoolTypeText[item.poolType]}
          </Typography> */}
          {/* <Typography color="var(--ps-neutral5)" fontSize={13} lineHeight={'140%'}>
              {description}
            </Typography> */}
        </Box>
      </RankBox>
    </ItemComtainer>
  )
}
export default BoxListItem
