import BaseDialog from 'components/Dialog/baseDialog'
import { Box, Button, CircularProgress, InputBase, Stack, Typography, styled } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import SeachSvg from 'assets/svg/search.svg'
import CloseSvg from 'assets/svg/activeties/close.svg'
import AddPluginSvg from 'assets/svg/addPlugin.svg'
import DeletePlugin from 'assets/svg/deletePlugin.svg'
import DefaultImage from 'assets/images/account/default_followings_item.png'
// import PlaceholderAvatar from 'assets/svg/placeholder-avatar.svg'
import Upload from 'components/Upload'
import { upload } from 'api/common'
import { createBox, getClubName } from 'api/boxes'
import { BoxTypes, GetPluginListItem, IBoxTypes, ICreateBoxResult } from 'api/boxes/type'
import { useCreateBox } from 'hooks/useBoxCallback'
import { useRefreshUserInfo, useUserInfo } from 'state/user/hooks'
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { LoadingButton } from '@mui/lab'
import DefaultAvatar from 'assets/images/boxes/default-avatar.jpg'
import Image from 'next/image'
import BannerGroup from './BannerGroup'
import { PluginCategory } from 'plugins/hooks/useGetPluginList'
import useBreakpoint from 'hooks/useBreakpoint'
import { toast } from 'react-toastify'
import { useGetPluginList } from 'state/pluginListConfig/hooks'
import EmptyData from 'components/EmptyData'

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
const StyleCard = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  backgroundColor: 'var(--ps-text-10)',
  padding: '16px',
  borderRadius: '16px',
  height: 124,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  [theme.breakpoints.down('md')]: {
    maxWidth: 'calc(100vw - 80px)',
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
const StyledCloseSvg = styled(CloseSvg)<{ color?: string }>(({ theme, color }) => ({
  cursor: 'pointer',
  position: 'absolute',
  right: 24,
  '& g': {
    stroke: color ? theme.palette.text.secondary : theme.palette.text.primary
    // stroke: theme.palette.text.secondary
  }
}))
const initVal = {
  avatar: '',
  name: '',
  introduction: '',
  bgImage: '/banner1.png'
}
const CreateProjectBoxModal = ({ boxType }: { boxType: BoxTypes }) => {
  const [step, setStep] = useState(0)
  const userInfo = useUserInfo()
  const [formData, setFormData] = useState(initVal)
  const [appData, setAppData] = useState<number[]>([])
  const { runWithModal, submitted } = useCreateBox()
  const refreshUserInfo = useRefreshUserInfo()
  const { run, loading } = useRequest(
    async () => {
      try {
        let createResult: ICreateBoxResult | null = null
        const res = await createBox({
          avatar: formData.avatar,
          boxType: boxType,
          description: formData.introduction,
          projectName: formData.name,
          bgImage: formData.bgImage,
          plugins: JSON.stringify(appData)
        })
        if (res.code === 200) {
          createResult = res.data
          setStep(0)
          setAppData([])
          refreshUserInfo()
        } else {
          toast.error(res.msg)
        }
        if (createResult) {
          await runWithModal({
            boxId: createResult.boxId,
            expiredAt: createResult.expiredTime,
            signature: `0x${createResult.singature}`
          })
        }
      } catch (error) {}
    },
    { manual: true }
  )
  const isMd = useBreakpoint('md')

  return (
    <BaseDialog
      onClose={() => {
        setStep(0)
        setAppData([])
      }}
      title={boxType === BoxTypes.PROJECT ? 'Create Project Club' : 'Create Club'}
      sx={{
        '& .MuiDialog-paper': {
          margin: 20,
          padding: '32px 20px',
          maxWidth: '100%',
          width: isMd ? 'calc(100vw - 40px)' : 734
        }
      }}
    >
      <Box
        sx={{
          height: isMd ? 532 : 564,
          width: isMd ? '100%' : 684,
          position: 'relative',
          overflow: 'hidden',
          '& .item': {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s ease-out'
          }
        }}
      >
        <Box
          className="item"
          sx={{
            left: 0,
            transform: step === 0 ? 'translateX(0)' : 'translateX(-104%)'
          }}
        >
          <SimpleForm
            boxType={boxType}
            isMd={isMd}
            handleStep={e => {
              setStep(e)
            }}
            handleSubmit={values => {
              setFormData(values)
            }}
          />
        </Box>
        <Box
          className="item"
          sx={{
            left: '104%',
            transform: step === 1 ? 'translateX(-104%)' : 'translateX(0)'
          }}
        >
          <PluginList isMd={isMd} setAppData={setAppData} appData={appData} boxType={boxType}>
            <Box
              gap={8}
              sx={{
                display: 'flex',
                justifyContent: 'end',
                marginTop: 24,
                paddingRight: 2
              }}
            >
              <Button
                onClick={() => {
                  setStep(0)
                }}
                variant="contained"
                size={isMd ? 'medium' : 'large'}
                sx={{
                  fontSize: isMd ? 16 : 20,
                  fontWeight: 500
                }}
              >
                ←
              </Button>
              <LoadingButton
                loading={loading}
                disabled={submitted.pending || !!userInfo.box?.boxAddress}
                onClick={run}
                variant="contained"
                size={isMd ? 'medium' : 'large'}
                sx={{
                  width: isMd ? 'auto' : '133px',
                  fontSize: isMd ? 13 : 15
                }}
              >
                Create
              </LoadingButton>
            </Box>
          </PluginList>
        </Box>
      </Box>
    </BaseDialog>
  )
}

export default CreateProjectBoxModal

const TitleLabel = styled(Typography)(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontSize: 20,
  fontWeight: 500,
  ineHeight: '26px',
  [theme.breakpoints.down('md')]: {
    fontSize: 15,
    lineHeight: '19.5px'
  }
}))

const SimpleForm = ({
  handleStep,
  handleSubmit,
  boxType,
  isMd
}: {
  handleStep: (e: number) => void
  handleSubmit: (e: any) => void
  boxType: BoxTypes
  isMd: boolean
}) => {
  const [uploadNum, setUploadNum] = useState<number>(1)
  const [verifyName, setVerifyName] = useState('')

  const validationSchema = yup.object({
    // avatar: yup.string().required('Please upload avatar'),
    name: yup
      .string()
      .required('Please enter name')
      .test('Space', 'There cannot be spaces at the beginning and end', async values => {
        if (values) {
          return values.trim() === values
        }
        return true
      })
      .test('Name', 'The name is already taken', async values => {
        if (values) {
          if (verifyName === values) return true
          const { data } = await getClubName(values)
          setVerifyName(values)
          if (data.count) return false
          return true
        }
        return true
      })
      .test('length', 'The name cannot be longer than 200 characters', async values => {
        if (values) {
          return values.length < 201
        }
        return true
      }),
    introduction: yup
      .string()
      .test('length', 'The introduction cannot be longer than 2000 characters', async values => {
        if (values) {
          return values.length < 2001
        }
        return true
      })
  })
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initVal}
      onSubmit={values => {
        handleStep(1)
        handleSubmit(values)
      }}
    >
      {({ values, setFieldValue }) => {
        return (
          <Stack component={Form} spacing={isMd ? 10 : 16} width={isMd ? 'calc(100vw - 80px)' : '100%'}>
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--ps-text-20)',
                alignItems: 'center'
              }}
            >
              <FormItem name="avatar">
                <Upload
                  uploadNum={uploadNum}
                  imgHeight={isMd ? 48 : 64}
                  imgWidth={isMd ? 48 : 64}
                  styles={{ width: isMd ? 48 : 64, height: isMd ? 48 : 64 }}
                  file={values.avatar}
                  onSuccess={async ({ file }) => {
                    const uploadRes = await upload({
                      file
                    })
                    if (uploadRes.code === 200) {
                      const url = uploadRes.data?.url
                      setFieldValue('avatar', url)
                    }
                  }}
                >
                  <Image width={isMd ? 48 : 64} height={isMd ? 48 : 64} src={DefaultAvatar} alt="" />
                </Upload>
              </FormItem>

              <Stack flex={1}>
                <Typography
                  variant={isMd ? 'h5' : 'body1'}
                  sx={{
                    lineHeight: isMd ? '21px' : '22.4px',
                    fontWeight: 400
                  }}
                >
                  {boxType === BoxTypes.PROJECT ? 'Project Avatar' : 'Profile Avatar'}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginTop: 8 }}>
                  {`Please don’t upload pure white images (JPEG, PNG, WEBP Files, Size<2M)`}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    fontSize: isMd ? 12 : 15,
                    width: '62px',
                    height: 30,
                    marginTop: 16,
                    zIndex: 0
                  }}
                  onClick={() => {
                    setUploadNum(uploadNum + 1)
                  }}
                >
                  Edit
                </Button>
              </Stack>
            </Box>

            <TitleLabel>{boxType === BoxTypes.PROJECT ? 'Project Name' : 'User Name'}</TitleLabel>
            <FormItem name="name">
              <Input
                maxWidth={isMd ? '99%' : '100%'}
                onChange={e => setFieldValue('name', e)}
                outlined
                fontSize={isMd ? 15 : 16}
                height={isMd ? 40 : 50}
                value={values.name.trim()}
                multiline
                placeholder={boxType === BoxTypes.PROJECT ? 'Project Name' : 'UserName'}
              />
            </FormItem>
            <TitleLabel>Set Brief Introduction</TitleLabel>
            <FormItem name="introduction">
              <Input
                rows={3}
                maxWidth={isMd ? '99%' : '100%'}
                onChange={e => setFieldValue('introduction', e)}
                outlined
                value={values.introduction}
                fontSize={isMd ? 15 : 16}
                multiline
                placeholder="About 30 words"
              />
            </FormItem>
            <TitleLabel>Set Banner</TitleLabel>
            <BannerGroup
              imgWidth={isMd ? 'calc((100vw - 168px) / 2)' : 120}
              value={values.bgImage}
              onChange={e => setFieldValue('bgImage', e.target.value)}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                marginTop: 0
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size={isMd ? 'medium' : 'large'}
                sx={{
                  width: isMd ? 'auto' : '133px',
                  fontSize: isMd ? 13 : 15,
                  marginRight: 2
                }}
              >
                Continue
              </Button>
            </Box>
          </Stack>
        )
      }}
    </Formik>
  )
}

const PluginList = ({
  isMd,
  setAppData,
  children,
  appData,
  boxType
}: {
  isMd: boolean
  setAppData: Dispatch<SetStateAction<number[]>>
  children: React.ReactNode
  appData: number[]
  boxType: BoxTypes
}) => {
  const { data } = useGetPluginList({ boxTypes: boxType.toString() })
  const categorys = useMemo(() => {
    const result: PluginCategory[] = [PluginCategory.ALL]
    data?.list.map(item => {
      result.push(item.category as PluginCategory)
    })
    return [...new Set(result)]
  }, [data])
  const inputRef = useRef<HTMLInputElement>(null)
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
    return data?.list
      .filter(item => !value || regex.test(item.pluginName))
      .filter(item => category === PluginCategory.ALL || item.category === category)
  }, [category, data, value])
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
      {!data?.list.length && (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minWidth: isMd ? 'calc(100vw - 88px)' : 514, height: isMd ? 'calc(100vh - 252.8px)' : 526 }}
        >
          <CircularProgress color="inherit" />
        </Stack>
      )}
      {data?.list.length && (
        <Stack spacing={12} marginTop={isMd ? 12 : 16}>
          <Box
            sx={{
              display: 'flex',
              gap: 10,
              maxWidth: isMd ? 'calc(100vw - 80px)' : '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {categorys.map(v => (
              <Button
                variant="contained"
                key={v}
                sx={{
                  minWidth: 'auto',
                  padding: isMd ? '12px 16px' : '12px 24px',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--ps-neutral2)',
                  color: 'var(--ps-text-100)',
                  borderRadius: '32px',
                  ':hover': {
                    background: 'var(--px-text-10)'
                  }
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
              height: isMd ? 330 : 340,
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
                  soon={v.status === IBoxTypes.Normal ? false : true}
                  isMd={isMd}
                  setAppData={setAppData}
                  appData={appData}
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
          {children}
        </Stack>
      )}
    </>
  )
}

const PluginItem = ({
  data,
  soon,
  isMd,
  setAppData,
  appData
}: {
  data: GetPluginListItem
  soon: boolean
  isMd?: boolean
  setAppData: Dispatch<SetStateAction<number[]>>
  appData: number[]
}) => {
  const [isChoose, setIsChoose] = useState(appData.includes(data.id))
  const toggleAndSort = (number: number) => {
    const index = appData.indexOf(number)
    if (index !== -1) {
      appData.splice(index, 1)
    } else {
      appData.push(number)
    }
    return appData.sort((a, b) => a - b)
  }
  return (
    <>
      {isMd ? (
        <StyleCard
          sx={{}}
          onClick={() => {
            if (!soon) {
              const list = toggleAndSort(data.id)
              setAppData(list)
              setIsChoose(!isChoose)
            }
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
            {isChoose ? <DeletePlugin transform="scale(.8)" /> : <AddPluginSvg transform="scale(.8)" />}
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
            if (!soon) {
              const list = toggleAndSort(data.id)
              setAppData(list)
              setIsChoose(!isChoose)
            }
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
                {isChoose ? <DeletePlugin /> : <AddPluginSvg />}
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
