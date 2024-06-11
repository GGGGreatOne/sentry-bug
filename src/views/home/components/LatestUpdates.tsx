import { Box, Stack, Typography, styled } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import Link from 'next/link'
import { shortenAddress } from 'utils'
import Lu1Svg from '../../../assets/svg/home/lu1.svg'
import Lu2Svg from '../../../assets/svg/home/lu2.svg'
import LutipSvg from '../../../assets/svg/home/lutip.svg'
import { useGetClubPlugin } from 'hooks/boxes/useGetClubPlugin'
import { ClubInfoProps, ClubPluginListProps } from 'api/home/type'
import { useGetPluginInfo } from 'state/pluginListConfig/hooks'
import { useGetClubList } from 'hooks/boxes/useGetClubList'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { globalDialogControl } from 'components/Dialog'

const StyledLu1 = styled(Lu1Svg)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    fill: theme.palette.text.primary
  }
}))

const StyledLu2 = styled(Lu2Svg)(({ theme }) => ({
  cursor: 'pointer',
  '& path': {
    fill: theme.palette.text.primary
  }
}))

export enum NewType {
  Clubs = 'News on Clubs',
  Apps = 'News on Apps'
}

const ClubsNews = ({ item, isMd }: { item: ClubInfoProps; isMd: boolean }) => {
  const router = useRouter()
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
    <Stack
      spacing={{ xs: 8, md: 'unset' }}
      sx={{ padding: '16px 0', borderBottom: isMd ? 'none' : '1px solid var(--ps-text-10)' }}
    >
      <Stack justifyContent={'flex-start'} alignItems={'center'} direction={'row'} gap={16}>
        <LutipSvg
          style={{
            backgroundColor: 'var(--ps-text-20)',
            borderRadius: '50%'
          }}
        />

        {isMd ? (
          <Box>
            <Typography
              component={'span'}
              variant="h5"
              sx={{
                fontWeight: 400,
                lineHeight: 1.4,
                color: 'var(--ps-neutral3)'
              }}
            >
              {item?.ownerAddress ? shortenAddress(item.ownerAddress) : '--'} created a new Club{' '}
            </Typography>

            <span
              onClick={() => {
                router.push(`/club/${item.boxId}`)
              }}
              style={{ cursor: 'pointer', color: 'var(--ps-text-100)' }}
            >
              ‘{item?.projectName || '--'}’
            </span>
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              color: 'var(--ps-neutral3)',
              wordBreak: 'break-all'
            }}
          >
            {item?.ownerAddress ? shortenAddress(item.ownerAddress) : '--'} created a new Club{' '}
            <Link href={'club/' + item.boxId} style={{ color: 'var(--ps-text-100)' }}>
              {' '}
              ‘{item?.projectName || '--'}’
            </Link>
          </Typography>
        )}
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

export const AppsNews = ({ item, isMd }: { item: ClubPluginListProps; isMd: boolean }) => {
  console.log('item=>', item)
  const router = useRouter()
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
    <Stack
      spacing={{ xs: 8, md: 'unset' }}
      sx={{ padding: '16px 0', borderBottom: isMd ? 'none' : '1px solid var(--ps-text-10)' }}
    >
      <Stack justifyContent={'flex-start'} alignItems={'center'} direction={'row'} gap={16}>
        <LutipSvg
          style={{
            backgroundColor: 'var(--ps-text-20)',
            borderRadius: '50%'
          }}
        />
        <Typography
          variant={isMd ? 'h5' : 'body1'}
          sx={{
            flex: 1,
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'var(--ps-neutral3)',
            wordBreak: 'break-all'
          }}
        >
          {item?.ownerAddress ? shortenAddress(item.ownerAddress) : '--'}
          {/* {item.eventName + item.pluginMsg + 'App '} */}
          {' added the App '}
          <span
            onClick={() => {
              router.push({
                pathname: `/club/${item.boxId}`,
                query: { appId: item.pluginId }
              })
            }}
            style={{ cursor: 'pointer', color: 'var(--ps-text-100)' }}
          >
            ‘{PluginInfo?.pluginName || '--'}’
          </span>
          {' to ' + item.projectName || '--'}
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

export default function LatestUpdates({ whithoutAnimation = false }: { whithoutAnimation?: boolean }) {
  const isMd = useBreakpoint('md')
  const { data: ClubPluginList } = useGetClubPlugin({ pageSize: 30, pageNum: 1 })

  const { data: ClubList } = useGetClubList({
    pageSize: 30,
    pageNum: 1,
    orderByColumn: 'firstPublishTime',
    isAsc: 'desc'
  })

  if (isMd) {
    return (
      <Stack
        direction={'column'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        sx={{
          width: '100%',
          margin: '100px auto'
        }}
      >
        <WithAnimation
          style={{
            width: '100%'
          }}
        >
          <Typography
            component={Typography}
            variant="h3"
            sx={{
              width: '100%',
              fontWeight: 500,
              fontSize: 20,
              padding: '0 20px'
            }}
            mb={30}
          >
            Latest Updates
          </Typography>
        </WithAnimation>
        <Stack
          sx={{
            width: '100%',
            padding: '0 16px'
          }}
          direction={'column'}
          gap={16}
        >
          <WithAnimation
            Component={Stack}
            sx={{
              flex: 1,
              borderRadius: 16,
              background: `var(--ps-neutral)`,
              boxSizing: 'border-box',
              padding: '24px'
            }}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexFlow: 'row nowrap',
                position: 'relative'
              }}
              onClick={() => {
                if (!ClubList?.length) return
                globalDialogControl.show('LastestUpdatesDialog', {
                  title: NewType.Clubs,
                  clubInfoList: ClubList
                })
              }}
            >
              <StyledLu1
                style={{
                  marginRight: 16
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: 'var(--ps-text-100)',
                  fontWeight: 500,
                  fontSize: 15
                }}
              >
                News On Clubs
              </Typography>
              {!!ClubList?.length && (
                <Typography
                  variant={'h5'}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 16,
                    lineHeight: '25px',
                    fontSize: 13,
                    color: 'var(--ps-blue)'
                  }}
                >
                  View More
                </Typography>
              )}
            </Box>
            <Box>
              {/* {!!ClubList?.length &&
                ClubList?.map((item, index) => {
                  return <ClubsNews key={index} item={item} isMd={isMd} />
                })} */}
              {!!ClubList?.length ? (
                <ClubsNews key={ClubList[0]?.boxId} item={ClubList[0]} isMd={isMd} />
              ) : (
                <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
                  No updates.
                </Typography>
              )}
            </Box>
          </WithAnimation>
          <WithAnimation
            Component={Stack}
            sx={{
              flex: 1,
              height: 328,
              borderRadius: 16,
              background: `var(--ps-neutral)`,
              boxSizing: 'border-box',
              padding: '24px'
            }}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexFlow: 'row nowrap',
                position: 'relative'
              }}
              onClick={() => {
                if (!ClubPluginList?.length) return
                globalDialogControl.show('LastestUpdatesDialog', {
                  title: NewType.Apps,
                  clubPluginList: ClubPluginList
                })
              }}
            >
              <StyledLu2
                style={{
                  marginRight: 16
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: 15
                }}
              >
                News On Apps
              </Typography>
              {!!ClubPluginList?.length && (
                <Typography
                  variant={'h5'}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 16,
                    lineHeight: '25px',
                    fontSize: 13,
                    color: 'var(--ps-blue)'
                  }}
                >
                  View More
                </Typography>
              )}
            </Box>
            <Box>
              {!!ClubPluginList?.length ? (
                <AppsNews key={ClubPluginList[0]?.boxId} item={ClubPluginList[0]} isMd={isMd} />
              ) : (
                <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
                  No updates.
                </Typography>
              )}
            </Box>
          </WithAnimation>
        </Stack>
      </Stack>
    )
  }
  if (whithoutAnimation) {
    return (
      <Stack
        direction={'column'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '203px auto 0',
          paddingBottom: '200px'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            width: '100%',
            fontWeight: 500,
            fontSize: 28,
            padding: '0',
            color: 'var(--ps-text-100)'
          }}
          mb={40}
        >
          Latest Updates
        </Typography>
        <Stack
          sx={{
            width: '100%'
          }}
          direction={'row'}
          gap={16}
        >
          <Stack
            sx={{
              flex: 1,
              borderRadius: 16,
              background: `var(--ps-neutral)`,
              padding: '24px'
            }}
          >
            <Stack
              sx={{ paddingBottom: 24 }}
              justifyContent={'flex-start'}
              alignItems={'center'}
              direction={'row'}
              gap={16}
            >
              <StyledLu1 />
              <Typography
                variant="h4"
                sx={{
                  color: 'var(--ps-text-100)',
                  fontWeight: 500
                }}
              >
                {NewType.Clubs}
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 254,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
            >
              {!!ClubList?.length &&
                ClubList?.map((item, index) => {
                  return <ClubsNews key={index} item={item} isMd={isMd} />
                })}
              {!ClubList?.length && (
                <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
                  No updates.
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack
            sx={{
              flex: 1,
              borderRadius: 16,
              background: `var(--ps-neutral)`,
              padding: '24px'
            }}
          >
            <Stack
              sx={{ paddingBottom: 24 }}
              justifyContent={'flex-start'}
              alignItems={'center'}
              direction={'row'}
              gap={16}
            >
              <StyledLu2 />
              <Typography
                variant="h4"
                sx={{
                  color: 'var(--ps-text-100)',
                  fontWeight: 500
                }}
              >
                {NewType.Apps}
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 254,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
            >
              {!!ClubPluginList?.length &&
                ClubPluginList?.map((item, index) => {
                  return <AppsNews key={index} item={item} isMd={isMd} />
                })}
              {!ClubPluginList?.length && (
                <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
                  No updates.
                </Typography>
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    )
  }
  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      justifyContent={'flex-start'}
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '203px auto 0',
        paddingBottom: '200px'
      }}
    >
      <WithAnimation
        Component={Typography}
        variant="h3"
        sx={{
          width: '100%',
          fontWeight: 500,
          fontSize: 28,
          padding: '0',
          color: 'var(--ps-text-100)'
        }}
        mb={40}
      >
        Latest Updates
      </WithAnimation>
      <Stack
        sx={{
          width: '100%'
        }}
        direction={'row'}
        gap={16}
      >
        <WithAnimation
          Component={Stack}
          sx={{
            flex: 1,
            borderRadius: 16,
            background: `var(--ps-neutral)`,
            padding: '24px'
          }}
        >
          <Stack
            sx={{ paddingBottom: 24 }}
            justifyContent={'flex-start'}
            alignItems={'center'}
            direction={'row'}
            gap={16}
          >
            <StyledLu1 />
            <Typography
              variant="h4"
              sx={{
                color: 'var(--ps-text-100)',
                fontWeight: 500
              }}
            >
              {NewType.Clubs}
            </Typography>
          </Stack>
          <Box
            sx={{
              height: 254,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {!!ClubList?.length &&
              ClubList?.map((item, index) => {
                return <ClubsNews key={index} item={item} isMd={isMd} />
              })}
            {!ClubList?.length && (
              <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
                No updates.
              </Typography>
            )}
          </Box>
        </WithAnimation>
        <WithAnimation
          Component={Stack}
          sx={{
            flex: 1,
            borderRadius: 16,
            background: `var(--ps-neutral)`,
            padding: '24px'
          }}
        >
          <Stack
            sx={{ paddingBottom: 24 }}
            justifyContent={'flex-start'}
            alignItems={'center'}
            direction={'row'}
            gap={16}
          >
            <StyledLu2 />
            <Typography
              variant="h4"
              sx={{
                color: 'var(--ps-text-100)',
                fontWeight: 500
              }}
            >
              {NewType.Clubs}
            </Typography>
          </Stack>
          <Box
            sx={{
              height: 254,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {!!ClubPluginList?.length &&
              ClubPluginList?.map((item, index) => {
                return <AppsNews key={index} item={item} isMd={isMd} />
              })}
            {!ClubPluginList?.length && (
              <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
                No updates.
              </Typography>
            )}
          </Box>
        </WithAnimation>
      </Stack>
    </Stack>
  )
}
