import { Box, Button, CircularProgress, InputBase, Stack, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import SeachSvg from 'assets/svg/search.svg'
import AddPluginSvg from 'assets/svg/addPlugin.svg'
import DefaultImage from 'assets/images/account/default_followings_item.png'
import DefaultSvg from 'assets/svg/bouncebit.svg'
import CloseSvg from 'assets/svg/activeties/close.svg'
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft } from '@mui/icons-material'
import { useGetPluginList, PlugListData, PluginCategory } from 'plugins/hooks/useGetPluginList'
import { useEditBoxPluginListName } from 'state/boxes/hooks'
import { IPluginNameType } from 'state/boxes/type'
import { useUserInfo } from 'state/user/hooks'
import { IBoxTypes } from 'api/boxes/type'
// import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { viewControl } from '../modal'
import EmptyData from 'components/EmptyData'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  transition: '1s',
  fontSize: 13,
  fontWeight: 400,
  lineHeight: 1.4,
  color: 'var(--ps-text-100)',
  '& .MuiInputBase-input': {
    height: 44,
    padding: theme.spacing(1, 1, 1, 0)
  }
}))
const StyleTitle = styled(Typography)(() => ({
  fontWeight: 500,
  lineHeight: '26px'
}))
const StyledSearch = styled(SeachSvg)<{ color?: string }>(({ theme, color }) => ({
  cursor: 'pointer',
  '& g': {
    stroke: color ? color : theme.palette.text.primary
  }
}))

const StyledCloseSvg = styled(CloseSvg)<{ color?: string }>(({ theme, color }) => ({
  cursor: 'pointer',
  position: 'absolute',
  right: 24,
  '& g': {
    stroke: color ? theme.palette.text.secondary : theme.palette.text.primary
    // stroke: theme.palette.text.secondary
  }
}))

const StyleCard = styled(Box)(({ theme }) => ({
  maxWidth: '514px',
  width: '100%',
  backgroundColor: 'var(--ps-text-10)',
  padding: '16px',
  borderRadius: '16px',
  height: 124,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    gap: 10,
    padding: '16px',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative'
  }
}))

const StyleBanner = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '314px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  svg: {
    path: {
      fill: '#000'
    }
  },
  [theme.breakpoints.down('md')]: {
    height: '104px',
    borderRadius: '8px'
  }
}))

const Image = styled('img')(() => ({}))

const PluginInfo = ({
  pluginId,
  pluginData,
  onSubmit
}: {
  pluginId: number
  pluginName: IPluginNameType | undefined
  pluginData: PlugListData | undefined
  onSubmit?: () => void
}) => {
  const { pluginList, updateBoxPluginListNameCallback } = useEditBoxPluginListName()

  const addHandle = useCallback(() => {
    updateBoxPluginListNameCallback(pluginId ? [...pluginList, pluginId] : pluginList).finally(() => {
      onSubmit?.()
    })
    viewControl.hide('AddPlugin')
  }, [onSubmit, pluginId, pluginList, updateBoxPluginListNameCallback])
  return (
    <Stack
      spacing={32}
      sx={{
        maxWidth: 514,
        marginTop: { xs: 16, md: 12 }
      }}
    >
      <Stack spacing={{ xs: 16, md: 32 }}>
        <StyleBanner
          sx={{
            border: pluginData?.banner ? 'unset' : '1px solid var(--ps-text-20)',
            backgroundColor: pluginData?.banner ? 'var(--ps-neutral2)' : '#ECECEC'
          }}
        >
          {pluginData?.banner ? (
            <Image
              src={pluginData?.banner.split(',')?.[0]}
              alt="png"
              width={'100%'}
              height={'100%'}
              style={{
                objectFit: 'cover'
              }}
            />
          ) : (
            <DefaultSvg />
          )}
        </StyleBanner>

        <Typography
          variant="h5"
          lineHeight={'21px'}
          color={'var(--ps-text-80)'}
          sx={{
            'list-style-type': 'disc',
            overflowY: 'auto',
            maxHeight: { xs: 'auto', md: 130 },
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {pluginData?.description}
        </Typography>
      </Stack>
      <Button
        onClick={addHandle}
        disabled={pluginData?.hasPlug || pluginData?.status !== IBoxTypes.Normal}
        variant="contained"
        sx={{
          width: '100%',
          height: 44
        }}
      >
        {pluginData?.status !== IBoxTypes.Normal ? 'Coming Soon' : pluginData?.hasPlug ? 'Already Added' : '+ Add'}
      </Button>
    </Stack>
  )
}

const PluginList = ({
  setPluginId,
  setPluginName,
  setPluginData,
  isMd,
  boxType
}: {
  setPluginId: Dispatch<SetStateAction<number | undefined>>
  setPluginName: Dispatch<SetStateAction<IPluginNameType | undefined>>
  setPluginData: Dispatch<SetStateAction<PlugListData | undefined>>
  isMd: boolean
  boxType?: number
}) => {
  const { data, loading } = useGetPluginList()
  const inputRef = useRef<HTMLInputElement>(null)
  boxType
  const [value, setValue] = useState('')
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const [category, setCategory] = useState<PluginCategory>(PluginCategory.ALL)
  const handleCategoryChange = useCallback((category: PluginCategory) => {
    setCategory(category)
  }, [])

  const filterData = useMemo(() => {
    const regex = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, ''), 'i')
    return data?.listData
      .filter(item => !value || regex.test(item.pluginName))
      .filter(item => category === PluginCategory.ALL || item.category === category)
    // .filter(i => i.status === IBoxTypes.Normal)
  }, [category, data?.listData, value])
  return (
    <>
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={12}
        sx={{
          background: 'var(--ps-text-10)',
          padding: '0 24px 0 12px',
          borderRadius: 8,
          position: 'relative'
        }}
      >
        <StyledSearch color={'var(--ps-neutral4)'} />
        <StyledInputBase
          inputRef={inputRef}
          placeholder="Search by App Name"
          inputProps={{ 'aria-label': 'search' }}
          value={value}
          onChange={handleChange}
          sx={{
            width: '100%',
            paddingRight: 32
          }}
        />
        {value && (
          <StyledCloseSvg
            onClick={() => {
              setValue('')
            }}
          />
        )}
      </Box>
      {loading && (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minWidth: isMd ? 'calc(100vw - 88px)' : 514, height: isMd ? 'calc(100vh - 252.8px)' : 526 }}
        >
          <CircularProgress color="inherit" />
        </Stack>
      )}
      {!loading && (
        <Stack spacing={16} marginTop={isMd ? 16 : 32}>
          <Box
            sx={{
              display: 'flex',
              gap: 10,
              maxWidth: '514px',
              flexWrap: 'wrap'
            }}
          >
            {data?.categorys.map(v => (
              <Button
                variant="contained"
                key={v}
                sx={{
                  minWidth: 'auto',
                  padding: isMd ? '12px 16px' : '12px 24px',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--ps-neutral2)',
                  color: 'var(--ps-text-100)',
                  borderRadius: '32px'
                }}
                onClick={() => {
                  handleCategoryChange(v)
                }}
              >
                {v}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 4
            }}
          >
            <StyleTitle
              color={'var(--ps-text-100)'}
              sx={{ fontSize: isMd ? 15 : 20, lineHeight: isMd ? '19.2px' : '26px' }}
            >
              App Store
            </StyleTitle>
            <StyleTitle
              color={'var(--ps-text-40)'}
              sx={{ fontSize: isMd ? 15 : 20, lineHeight: isMd ? '19.2px' : '26px' }}
            >
              ( Total {filterData?.filter(v => v.status === IBoxTypes.Normal).length} apps available now )
            </StyleTitle>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minWidth: isMd ? 'calc(100vw - 88px)' : 514,
              height: isMd ? 'calc(100vh - 356px)' : '400px',
              overflowY: 'auto',
              // paddingRight: '8px',
              '::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            {!!filterData?.length ? (
              filterData?.map(v => (
                <PluginItem
                  data={v}
                  key={v.id}
                  setPluginData={setPluginData}
                  setPluginId={setPluginId}
                  setPluginName={setPluginName}
                  soon={v.status === IBoxTypes.Normal ? false : true}
                  isMd={isMd}
                />
              ))
            ) : (
              <EmptyData
                size={isMd ? 15 : 20}
                color="var(--ps-neutral4)"
                height={140}
                sx={{
                  width: { xs: '100%', md: 514 }
                }}
              />
            )}
          </Box>
        </Stack>
      )}
    </>
  )
}

const PluginItem = ({
  data,
  setPluginId,
  setPluginName,
  setPluginData,
  soon,
  isMd
}: {
  data: PlugListData
  setPluginId: Dispatch<SetStateAction<number | undefined>>
  setPluginName: Dispatch<SetStateAction<IPluginNameType | undefined>>
  setPluginData: Dispatch<SetStateAction<PlugListData | undefined>>
  soon: boolean
  isMd?: boolean
}) => {
  return (
    <>
      {isMd ? (
        <StyleCard
          sx={{}}
          onClick={() => {
            setPluginData(data)
            setPluginId(data.id)
            setPluginName(data.pluginName as IPluginNameType)
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              position: 'absolute',
              right: 10,
              top: 10
            }}
          >
            {!data.hasPlug && <AddPluginSvg transform="scale(.8)" />}
          </Box>
          <Stack gap={8} flexDirection={'row'}>
            <Image
              src={data.icon ? data.icon : DefaultImage.src}
              alt="png"
              height={64}
              width={64}
              style={{ borderRadius: 8 }}
            />
            <Stack flexDirection={'column'} spacing={8} sx={{ height: '100%', width: '100%' }}>
              <StyleTitle color={'var(--ps-text-100)'} fontSize={15} sx={{ lineHeight: '19.5px' }}>
                {data.pluginName}
              </StyleTitle>
              <Typography fontSize={12} lineHeight={'12px'} fontWeight={500} color={'var(--ps-text-100)'}>
                ({data.used ? data.used : '0'} Used)
              </Typography>
              {data.free && (
                <Typography fontSize={12} lineHeight={'12px'} fontWeight={500} color={'var(--ps-text-80)'}>
                  Free plan available
                </Typography>
              )}
            </Stack>
          </Stack>
          {soon && (
            <Typography
              variant="caption"
              fontWeight={500}
              color={'#E1F25C'}
              lineHeight={'12px'}
              textTransform={'capitalize'}
            >
              Coming Soon
            </Typography>
          )}
          {data.hasPlug && (
            <Typography variant="caption" color={'var(--ps-green)'} lineHeight={'12px'} textTransform={'capitalize'}>
              Already Added
            </Typography>
          )}
          <Typography
            fontSize={12}
            fontWeight={500}
            color={'var(--ps-text-60)'}
            lineHeight={'16.8px'}
            sx={{
              height: 50.4,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {data.introduction}
          </Typography>
        </StyleCard>
      ) : (
        <StyleCard
          onClick={() => {
            setPluginData(data)
            setPluginId(data.id)
            setPluginName(data.pluginName as IPluginNameType)
          }}
          style={{
            // opacity: data.hasPlug || soon ? 0.7 : 1,
            cursor: 'pointer'
          }}
        >
          <Image
            src={data.icon ? data.icon : DefaultImage.src}
            alt="png"
            height={72}
            width={72}
            style={{ borderRadius: 15 }}
          />
          <Stack spacing={8} sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
              <StyleTitle color={'var(--ps-text-100)'}>{data.pluginName}</StyleTitle>
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                  position: 'absolute',
                  right: -3,
                  top: -3
                }}
              >
                {soon && (
                  <Typography
                    fontSize={'13px'}
                    fontWeight={500}
                    color={'#E1F25C'}
                    lineHeight={'13px'}
                    textTransform={'capitalize'}
                  >
                    Coming Soon
                  </Typography>
                )}
                {data.hasPlug ? (
                  <Typography color={'var(--ps-green)'} textTransform={'capitalize'}>
                    already added
                  </Typography>
                ) : (
                  <AddPluginSvg />
                )}
              </Box>
            </Box>
            <Box display={'flex'}>
              <Typography fontSize={13} fontWeight={500} color={'var(--ps-text-100)'}>
                ({data.used ? data.used : '0'} Used)&nbsp;•
              </Typography>
              {data.free && (
                <Typography fontSize={13} fontWeight={500} color={'var(--ps-text-80)'}>
                  &nbsp;Free plan available
                </Typography>
              )}
            </Box>
            <Typography
              fontSize={12}
              fontWeight={500}
              color={'var(--ps-text-60)'}
              sx={{
                maxHeight: 32,
                lineHeight: '16px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {data.introduction}
            </Typography>
          </Stack>
        </StyleCard>
      )}
    </>
  )
}

const AddPlugin = ({ cb, boxType }: { cb?: () => void; boxType?: number }) => {
  const isMd = useBreakpoint('md')
  const user = useUserInfo()
  // const router = useRouter()
  const [pluginId, setPluginId] = useState<number>()
  const [pluginName, setPluginName] = useState<IPluginNameType>()
  const [pluginData, setPluginData] = useState<PlugListData>()
  useEffect(() => {
    if (!user.token) {
      viewControl.hide('AddPlugin')
    }
  }, [user.token])

  const onClose = () => {
    setPluginId(undefined)
    setPluginName(undefined)
  }
  const onSubmit = () => {
    cb?.()
    onClose()
  }
  return (
    <BaseDialog
      mt={isMd ? 1 : 28}
      onClose={onClose}
      title={!!pluginId ? '' : 'Add An App'}
      sx={{ '& .MuiDialogContent-root': { textAlign: 'left' } }}
      headerEl={
        !!pluginId &&
        pluginName && (
          <Stack
            direction={'row'}
            sx={{
              position: 'absolute',
              top: 32,
              width: '100%',
              maxWidth: { xs: 'calc(100vw - 88px)', sm: 514 },
              justifyContent: 'space-between',
              pr: { xs: '40px', md: '64px' }
            }}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              spacing={{ xs: 4, md: 8 }}
              onClick={onClose}
              sx={{
                cursor: 'pointer'
              }}
            >
              <ChevronLeft />
              <Stack spacing={4}>
                <Typography variant={isMd ? 'h5' : 'h4'}>{pluginName}</Typography>
                {pluginData?.free && <Typography variant="h6">Free & All Clubs</Typography>}
              </Stack>
            </Stack>
            <Stack
              onClick={() => {
                // viewControl.hide('AddPlugin')
                // router.push(ROUTES.appStore.pluginDetail(Number(pluginId)))
                window.open(ROUTES.appStore.pluginDetail(Number(pluginId)), '_blank')
              }}
              flexDirection={'row'}
              sx={{ cursor: 'pointer', alignItems: 'center' }}
            >
              <Typography variant="h6">View in App Store</Typography>

              <ChevronLeft style={{ transform: 'rotate(180deg)' }} />
            </Stack>
          </Stack>
        )
      }
    >
      {!!pluginId ? (
        <PluginInfo pluginData={pluginData} pluginId={pluginId} pluginName={pluginName} onSubmit={onSubmit} />
      ) : (
        <PluginList
          isMd={isMd}
          setPluginData={setPluginData}
          setPluginId={setPluginId}
          setPluginName={setPluginName}
          boxType={boxType}
        />
      )}
    </BaseDialog>
  )
}
export default AddPlugin
