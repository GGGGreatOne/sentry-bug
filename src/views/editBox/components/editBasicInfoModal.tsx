import { Button, Popover, Stack, Typography, styled, Box } from '@mui/material'
import { SketchPicker } from 'react-color'
import BaseDialog from 'components/Dialog/baseDialog'
import UploadIcon from 'assets/svg/boxes/upload.svg'
import Input from 'components/Input'
import { useState } from 'react'
import { Form, Formik, FieldArray } from 'formik'
import * as yup from 'yup'
import FormItem from 'components/FormItem'
import { viewControl } from '../modal'
import Upload from 'components/Upload'
import LinkIcon from 'components/LinkIcon'
import { IBackgroundValue } from 'state/boxes/type'
import { useEditBoxBasicInfo } from 'state/boxes/hooks'
import { upload } from 'api/common'
import { toast } from 'react-toastify'
import useBreakpoint from 'hooks/useBreakpoint'
import { LoadingButton } from '@mui/lab'
import { isSocialUrl } from 'utils'
import { BoxTypes } from 'api/boxes/type'
import BannerGroup from './BannerGroup'

interface Props extends IBackgroundValue {
  onCancel?: () => void
  boxType?: BoxTypes
}

const validationSchema = yup.object({
  backgroundImg: yup.string().required('Please choose your backgroundImg'),
  projectName: yup
    .string()
    .required('Please enter your name')
    .test('length', 'The name cannot be longer than 200 characters', async values => {
      if (values) {
        return values.length < 201
      }
      return true
    }),
  title1: yup.string().test('length', 'The slogan cannot be longer than 2000 characters', async values => {
    if (values) {
      return values.length < 2001
    }
    return true
  }),
  introduction: yup.string().test('length', 'The introduction cannot be longer than 2000 characters', async values => {
    if (values) {
      return values.length < 2001
    }
    return true
  }),
  links: yup.array().of(
    yup.object({
      url: yup.string().test('URL', 'Please enter the correct link', (value, content) => {
        if (value) {
          const res = isSocialUrl(content.parent.typeName, value)
          return res
        }
        return true
      })
    })
  )
})

const EditBasicInfoModal = ({
  onCancel,
  backgroundImg,
  textColor,
  projectName,
  introduction,
  title1,
  links,
  id,
  backgroundMobileImg,
  boxType
}: Props) => {
  const isMd = useBreakpoint('md')
  const TitleLabel = styled(Typography)({
    width: '100%',
    textAlign: 'left',
    fontSize: isMd ? 15 : 20,
    fontWeight: 500
  })
  // const { hide } = useModal()
  const [colorAnchorEl, setColorAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const { updateBoxBackgroundCallback } = useEditBoxBasicInfo()
  const initialValues: Props = {
    id: id,
    backgroundImg: backgroundImg,
    textColor: textColor,
    projectName: projectName,
    introduction: introduction,
    title1: title1,
    links: links,
    backgroundMobileImg: backgroundMobileImg
  }
  const handleSubmit = (values: IBackgroundValue) => {
    updateBoxBackgroundCallback(values)
    viewControl.hide('EditBasicInfoModal')
  }

  return (
    <BaseDialog title="Set Banner" close>
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <Stack component={Form} spacing={16}>
              <TitleLabel>Desktop</TitleLabel>
              <FormItem name="backgroundImg" fieldType="custom">
                <Upload
                  imgWidth={'100%'}
                  imgHeight={'100%'}
                  imgRadius={8}
                  styles={{
                    width: '100%',
                    height: isMd ? 'calc((100vw - 80px) / 2.6)' : 110,
                    border: '1px solid var(--ps-text-20)',
                    borderRadius: '8px'
                  }}
                  onSuccess={async ({ file }) => {
                    setLoading(true)
                    const uploadRes = await upload({
                      file
                    })
                    setLoading(false)
                    if (uploadRes.code === 200) {
                      setFieldValue('backgroundImg', uploadRes.data?.url)
                    } else if (uploadRes.code === 401) {
                      toast.error('Sorry, you do not have permission.')
                      return
                    } else {
                      toast.error('Sorry, you failed to upload your image.')
                      return
                    }
                  }}
                  onDelete={() => {
                    setFieldValue('backgroundImg', '')
                  }}
                  file={values.backgroundImg}
                >
                  <Stack
                    width={'100%'}
                    height={isMd ? 'calc((100vw - 80px) / 1.8)' : 110}
                    justifyContent={'center'}
                    spacing={6}
                    sx={{ backgroundColor: 'var(--ps-text-primary)', borderRadius: '8px' }}
                    p={21}
                  >
                    <UploadIcon style={{ margin: '0 auto', transform: isMd ? 'scale(.8)' : 'scale(1)' }} />
                    <Typography
                      variant="h2"
                      sx={{ fontSize: isMd ? 15 : 20, lineHeight: '26px', fontWeight: 500, textAlign: 'center' }}
                    >
                      1440x300
                    </Typography>
                  </Stack>
                </Upload>
              </FormItem>
              <TitleLabel>Mobile</TitleLabel>
              <FormItem name="backgroundMobileImg" fieldType="custom">
                <Upload
                  imgWidth={110}
                  imgHeight={110}
                  imgRadius={8}
                  styles={{
                    width: '100%',
                    // height: 112,
                    border: '1px solid var(--ps-text-20)',
                    borderRadius: '8px'
                  }}
                  onSuccess={async ({ file }) => {
                    setLoading(true)
                    const uploadRes = await upload({
                      file
                    })
                    setLoading(false)
                    if (uploadRes.code === 200) {
                      setFieldValue('backgroundMobileImg', uploadRes.data?.url)
                    } else if (uploadRes.code === 401) {
                      toast.error('Sorry, you do not have permission.')
                      return
                    } else {
                      toast.error('Sorry, you failed to upload your image.')
                      return
                    }
                  }}
                  onDelete={() => {
                    setFieldValue('backgroundMobileImg', '')
                  }}
                  file={values.backgroundMobileImg}
                >
                  <Stack
                    width={'100%'}
                    height={110}
                    justifyContent={'center'}
                    spacing={6}
                    sx={{ backgroundColor: 'var(--ps-text-primary)', borderRadius: '8px' }}
                    p={21}
                  >
                    <UploadIcon style={{ margin: '0 auto', transform: isMd ? 'scale(.8)' : 'scale(1)' }} />
                    <Typography
                      variant="h2"
                      sx={{ fontSize: isMd ? 15 : 20, lineHeight: '26px', fontWeight: 500, textAlign: 'center' }}
                    >
                      360x360
                    </Typography>
                  </Stack>
                </Upload>
              </FormItem>
              <BannerGroup
                width={isMd ? 'auto' : 514}
                imgWidth={isMd ? 'calc((100vw - 167px) / 2)' : 215}
                imgHeight={80}
                value={values.backgroundImg}
                onChange={e => {
                  setFieldValue('backgroundImg', e.target.value)
                  setFieldValue('backgroundMobileImg', e.target.value)
                }}
              />
              <FormItem name="textColor" fieldType="custom">
                <Stack width={514} justifyContent={'flex-start'} spacing={16}>
                  <TitleLabel>{boxType === BoxTypes.PROJECT ? 'Set Text Color' : 'Set Introduction Color'}</TitleLabel>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      borderRadius: 4,
                      background: values.textColor
                    }}
                    onClick={(event: any) => {
                      setColorAnchorEl(event.currentTarget)
                    }}
                  ></Box>
                  <Popover
                    open={Boolean(colorAnchorEl)}
                    anchorEl={colorAnchorEl}
                    onClose={() => {
                      setColorAnchorEl(null)
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                  >
                    <SketchPicker
                      color={values.textColor}
                      onChange={(newColor: any) => {
                        setFieldValue('textColor', newColor.hex)
                      }}
                    />
                  </Popover>
                </Stack>
              </FormItem>
              <TitleLabel>{boxType === BoxTypes.PROJECT ? 'Set Project Name' : 'Set User Name'}</TitleLabel>
              <FormItem name="projectName">
                <Input height={isMd ? 40 : 43} outlined value={values.projectName} placeholder="Enter..." />
              </FormItem>
              {boxType === BoxTypes.PROJECT && (
                <>
                  <TitleLabel>Set Slogan</TitleLabel>
                  <FormItem name="title1">
                    <Input height={isMd ? 40 : 43} outlined value={values.title1} placeholder="Enter..." />
                  </FormItem>
                </>
              )}
              <TitleLabel>Set Introduction</TitleLabel>
              <FormItem name="introduction">
                <Input height={isMd ? 40 : 43} outlined value={values.introduction} placeholder="About 30 words" />
              </FormItem>
              <TitleLabel>Set Official Links</TitleLabel>
              <FieldArray name="links">
                {({}) => (
                  <>
                    {values.links.map((item, index) => {
                      return (
                        <Stack
                          key={item.typeName + index}
                          gap={12}
                          flexDirection={'row'}
                          alignItems={'center'}
                          justifyContent={'flex-start'}
                        >
                          <Stack
                            alignItems={'center'}
                            justifyContent={'center'}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'var(--ps-text-20)'
                            }}
                          >
                            <LinkIcon type={item.typeName} isMd={isMd} />
                          </Stack>

                          <FormItem name={`links[${index}][url]`} sx={{ flex: 1 }}>
                            <Input
                              height={isMd ? 40 : 43}
                              outlined
                              value={item.url}
                              placeholder={`Insert ${
                                item.typeName.charAt(0).toUpperCase() + item.typeName.slice(1)
                              } Link`}
                            />
                          </FormItem>
                        </Stack>
                      )
                    })}
                  </>
                )}
              </FieldArray>

              <Stack
                width={'100%'}
                justifyContent={isMd ? 'center' : 'flex-end'}
                direction={'row'}
                alignItems={'center'}
                spacing={16}
                sx={{
                  '& button': {
                    width: 133,
                    height: isMd ? 36 : 44,
                    fontSize: isMd ? 13 : 15,
                    fontWeight: 500
                  }
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    onCancel ? onCancel() : viewControl.hide('EditBasicInfoModal')
                  }}
                >
                  Cancel
                </Button>
                <LoadingButton loading={loading} variant="contained" type="submit">
                  Save
                </LoadingButton>
              </Stack>
            </Stack>
          )
        }}
      </Formik>
    </BaseDialog>
  )
}
export default EditBasicInfoModal
