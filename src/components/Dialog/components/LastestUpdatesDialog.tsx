import React, { useMemo } from 'react'
import { Typography, Box, Stack } from '@mui/material'
import LutipSvg from 'assets/svg/home/lutip.svg'
import { shortenAddress } from 'utils'
import BaseDialog from '../baseDialog'
import { ClubInfoProps, ClubPluginProps } from 'api/home/type'
import { NewType } from 'views/home/components/LatestUpdates'
import router from 'next/router'
import { useGetPluginInfo } from 'state/pluginListConfig/hooks'
import { globalDialogControl } from '..'

export interface PendingTipDialogProps {
  title: string
  clubInfoList?: ClubInfoProps[] | undefined
  clubPluginList?: ClubPluginProps[] | undefined
}

const LastestUpdatesDialog = (props: PendingTipDialogProps) => {
  console.log('🚀 ~ LastestUpdatesDialog ~ props:', props)
  const { clubPluginList, clubInfoList, title } = props

  return (
    <BaseDialog title={title} close>
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto'
        }}
      >
        <>
          {NewType.Clubs === title &&
            !!clubInfoList?.length &&
            clubInfoList?.map((item: ClubInfoProps, index: number) => {
              return <ClubItems key={index.toString + 'key'} item={item} />
            })}
        </>

        <>
          {NewType.Apps === title &&
            !!clubPluginList?.length &&
            clubPluginList?.map((item: ClubPluginProps, index: number) => {
              return <AppItems key={index.toString + 'key'} item={item} />
            })}
        </>
      </Box>
    </BaseDialog>
  )
}

const ClubItems = ({ item }: { item?: ClubInfoProps | undefined }) => {
  const Time = useMemo(() => {
    if (item?.firstPublishTime) {
      const date = new Date(item?.firstPublishTime)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
    return undefined
  }, [item?.firstPublishTime])

  return (
    <Stack spacing={{ xs: 8, md: 'unset' }} sx={{ padding: '16px 0' }}>
      <Stack justifyContent={'flex-start'} alignItems={'center'} direction={'row'} gap={16}>
        <Box
          sx={{
            flex: 1,
            maxWidth: 20
          }}
        >
          <LutipSvg
            style={{
              backgroundColor: 'var(--ps-text-20)',
              borderRadius: '50%'
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'var(--ps-neutral3)'
          }}
        >
          {item?.ownerAddress ? shortenAddress(item.ownerAddress) : '--'} created a new Club{' '}
          <span
            onClick={() => {
              globalDialogControl.hide('LastestUpdatesDialog')
              router.push({
                pathname: `/club/${item?.boxId}`
              })
            }}
            style={{ cursor: 'pointer', color: 'var(--ps-text-100)' }}
          >
            {` `}‘{item?.projectName || '--'}’
          </span>
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 400,
          color: 'var(--ps-neutral3)',
          paddingLeft: 37
        }}
      >
        {Time || '--'}
      </Typography>
    </Stack>
  )
}
const AppItems = ({ item }: { item?: ClubPluginProps | undefined }) => {
  console.log('🚀 ~ AppItems ~ item:', item)
  const PluginInfo = useGetPluginInfo(item?.pluginId)

  const Time = useMemo(() => {
    if (item?.createTime) {
      const date = new Date(item?.createTime)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
    return undefined
  }, [item?.createTime])

  return (
    <Stack spacing={{ xs: 8, md: 'unset' }} sx={{ padding: '16px 0' }}>
      <Stack justifyContent={'flex-start'} alignItems={'center'} direction={'row'} gap={16}>
        <LutipSvg
          style={{
            backgroundColor: 'var(--ps-text-20)',
            borderRadius: '50%'
          }}
        />
        <Typography
          variant={'h5'}
          sx={{
            flex: 1,
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'var(--ps-neutral3)',
            wordBreak: 'break-all'
          }}
        >
          {item?.ownerAddress ? shortenAddress(item.ownerAddress) : '--'}
          {/* {NewEventType.Create === item?.eventType
            ? ' Created new App '
            : NewEventType.Create === item?.eventType
              ? ' Closed the App '
              : '--'} */}
          {' added the App '}
          <span
            onClick={() => {
              globalDialogControl.hide('LastestUpdatesDialog')
              router.push({
                pathname: `/club/${item?.boxId}`,
                query: { appId: item?.pluginId }
              })
            }}
            style={{ cursor: 'pointer', color: 'var(--ps-text-100)' }}
          >
            ‘{PluginInfo?.pluginName || '--'}’
          </span>
          {' to ' + item?.projectName || '--'}
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 400,
          color: 'var(--ps-neutral3)',
          paddingLeft: 37
        }}
      >
        {Time || '--'}
      </Typography>
    </Stack>
  )
}

export default LastestUpdatesDialog
