/* eslint-disable @next/next/no-img-element */
import { Box, styled, Typography } from '@mui/material'
import { IPluginNameType } from 'state/boxes/type'
import { PlugsSvgs } from 'views/home/components/Banner'
import { ActivitiesListItem } from 'api/user/type'
// import StatusItem from './StatusItem'
// import { PoolType } from 'api/type'
import ActiveHistoryDefault from 'assets/images/account/active_history_default.png'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { ROUTES } from 'constants/routes'
import CollectBtn from 'views/home/components/CollectBtn'
import useBreakpoint from 'hooks/useBreakpoint'
import { EllipsisTypography } from './FollowerCarItem'

const ItemComtainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  border-radius: 12px;
  background: var(--ps-neutral);
  box-shadow: 2px 4px 12px 0px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  & .bgImg {
    transition: transform 0.3s ease-in-out;
    transform: scale(1);
  }
  &:hover {
    background: var(--ps-text-10);

    & .bgImg {
      transform: scale(1.02);
    }
  }
`

const PluginItemBox = styled(Box)`
  position: absolute;
  top: 16px;
  left: 16px;
  width: min-content;
  display: flex;
  padding: 2px 8px;
  align-items: center;
  gap: 4px;
  border-radius: 90.752px;
  background: var(--ps-neutral4);
  z-index: 2;
`
const BottomBox = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  gap: 20px;

  ${props => props.theme.breakpoints.down('md')} {
    gap: 8px;
  }
`

const RowBetten = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const AvatarBox = styled(Box)`
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 100%;
`

const PluginItem = ({ pluginType }: { pluginType: IPluginNameType | undefined }) => {
  return (
    <PluginItemBox>
      <Box>{pluginType && PlugsSvgs[pluginType]?.smIcon}</Box>
      <Typography fontSize={12} color={'var(--ps-text-primary)'} lineHeight={'140%'}>
        {pluginType && PlugsSvgs[pluginType]?.name}
      </Typography>
    </PluginItemBox>
  )
}

const ActivityHistoryCarItem = ({
  item,
  isNomal
}: {
  item: ActivitiesListItem
  index: number
  mutate: any
  isNomal: boolean
}) => {
  const isMd = useBreakpoint('md')
  const { bgImage, pluginName, projectName, avatar } = item
  console.log('🚀 ~ item:', item)
  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )
  // const collectionHandle = useCallback(() => {}, [])
  return (
    <ItemComtainer
      onClick={(event: React.SyntheticEvent) => {
        event.stopPropagation()
        if (isNomal) return
        routeTo(item.boxId)
      }}
    >
      <Box
        sx={{
          background: `url(${bgImage ? bgImage : ActiveHistoryDefault.src})`,
          position: 'relative'
        }}
        padding={16}
        width={'100%'}
        height={160}
        overflow={'hidden'}
      >
        {pluginName && <PluginItem pluginType={pluginName} />}
        <img
          className="bgImg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          src={bgImage}
          alt=""
          onError={(e: any) => {
            e.target.onerror = null
            e.target.src = ActiveHistoryDefault.src
          }}
        />
      </Box>
      <BottomBox px={16}>
        <RowBetten>
          <EllipsisTypography
            width={isMd ? 200 : 250}
            fontSize={isMd ? 13 : 15}
            lineHeight={'21px'}
            color="var(--ps-text-100)"
          >
            {projectName || '--'}
          </EllipsisTypography>
          <CollectBtn isCollect={item.collect} callback={() => {}} pluginId={item.pluginId} boxId={item.boxId} />
        </RowBetten>
        <Box display={'flex'} gap={8} width={'100%'} flexDirection={'row'} alignItems={'center'}>
          <AvatarBox>
            <img
              style={{
                width: '100%',
                height: '100%'
              }}
              src={avatar}
              alt=""
              onError={(e: any) => {
                e.target.onerror = null
                e.target.src = DefaultAvatar.src
              }}
            />
          </AvatarBox>
          <EllipsisTypography width={200} fontWeight={500} lineHeight={'130%'} fontSize={13} color="var(--ps-neutral4)">
            {projectName || '--'}
          </EllipsisTypography>
        </Box>
      </BottomBox>
    </ItemComtainer>
  )
}
export default ActivityHistoryCarItem
