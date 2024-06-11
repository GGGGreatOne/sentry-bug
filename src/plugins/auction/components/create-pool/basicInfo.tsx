import { Box, Stack, Typography } from '@mui/material'
import FormItem from 'components/FormItem'
import * as yup from 'yup'
import { Formik, useFormikContext } from 'formik'
import { useCreateParams } from 'plugins/auction/pages/erc20-create-pool/provider'
import { BaseBox, FormLayout, OutlinedInput, Title } from './comps'
import MarkdownEditor from './components/markdownEditor'
import { useCallback, useEffect } from 'react'
import { IBasicInformation, ProviderDispatchActionType } from 'plugins/auction/pages/erc20-create-pool/type'
import { NextBtnStyle } from './components/createSubmitBtn'
import FormUpload from './components/FormUpload'
const basicSchema = yup.object({
  auctionName: yup.string().required('Name cannot be empty'),
  PCbannerUrl: yup.string().required('Please upload your PC banner'),
  MobileBannerUrl: yup.string().required('Please upload your mobile banner'),
  dec: yup
    .string()
    .required('Description cannot be empty')
    .min(100, 'Keep your description within 100-500 characters.')
    .max(500, 'Keep your description within 100-500 characters.')
})

export default function Page() {
  const {
    state: { basic }
  } = useCreateParams()
  const { dispatch } = useCreateParams()
  const setBasicInfo = useCallback(
    (values: IBasicInformation) => {
      if (dispatch) {
        dispatch({ type: ProviderDispatchActionType.setBasicInfo, payload: { basicInfo: values } })
        dispatch({ type: ProviderDispatchActionType.nextActive, payload: null })
      }
    },
    [dispatch]
  )
  return (
    <Formik initialValues={basic} onSubmit={setBasicInfo} validationSchema={basicSchema}>
      {({ setFieldValue, values, handleSubmit }) => {
        return (
          <Stack component={'form'} onSubmit={handleSubmit} sx={{ gap: 32 }}>
            <InitValueUpdate />
            <BaseBox>
              <Stack sx={{ gap: 5 }}>
                <Typography
                  sx={{
                    color: '#FFFFE5',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: { xs: 20, md: 28 },
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '140%'
                  }}
                >
                  Basic Information
                </Typography>
                <Typography
                  sx={{
                    color: '#898679',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: '15px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '140%'
                  }}
                >
                  This will be displayed as promotional information
                </Typography>
              </Stack>
              <FormLayout
                title1="Auction Name"
                childForm={
                  <FormItem name="auctionName" fieldType="custom">
                    <OutlinedInput
                      value={values.auctionName}
                      placeholder="Name of the project, eg. Bounce"
                      onChange={e => setFieldValue('auctionName', e.target.value)}
                    />
                  </FormItem>
                }
              />
              <FormLayout
                title1="Banner"
                title2={
                  '(Please upload a picture smaller than 10MB in any of the following file formats: JPEG, PNG, or WEBP.)'
                }
                childForm={
                  <Box
                    sx={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: { xs: 'fr', md: 'minmax(200px,260px) minmax(auto,400px)' },
                      gap: 16
                    }}
                  >
                    <FormItem name="MobileBannerUrl" fieldType="custom">
                      <FormUpload
                        url={values['MobileBannerUrl']}
                        defaultUrl={values['MobileBannerUrl']}
                        filedName="MobileBannerUrl"
                        setFieldValue={setFieldValue}
                      />
                      <Typography
                        mt={16}
                        sx={{
                          color: 'var(--ps-grey-02, #898679)',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '140%'
                        }}
                      >
                        Suggested size: 375px*290px
                      </Typography>
                    </FormItem>
                    <FormItem name="PCbannerUrl" fieldType="custom">
                      <FormUpload
                        url={values['PCbannerUrl']}
                        filedName="PCbannerUrl"
                        setFieldValue={setFieldValue}
                        defaultUrl={values['PCbannerUrl']}
                      />
                      <Typography
                        mt={16}
                        sx={{
                          color: 'var(--ps-grey-02, #898679)',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '140%'
                        }}
                      >
                        Suggested size: 1360px*600px
                      </Typography>
                    </FormItem>
                  </Box>
                }
              />

              <FormLayout
                title1="Describe Your Project (100-500 Words)"
                title2="Please address the following questions in your description."
                childTitle={
                  <Title sx={{ fontSize: 16, fontWeight: 400, color: '#898679' }}>
                    1. What is the project about?
                    <br />
                    2. What makes your project unique? <br />
                    3. History of your project.
                    <br />
                    4. What’s next for your project?
                    <br /> 5. What can your token be used for? (Utility, NOT tokenomics)
                    <br />
                  </Title>
                }
                childForm={
                  <FormItem name="dec">
                    <MarkdownEditor
                      value={values.dec}
                      setEditorValue={value => setFieldValue('dec', value)}
                      placeholder="Project description"
                    />
                  </FormItem>
                }
              />
            </BaseBox>
            <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: 20 }} mt={20}>
              <NextBtnStyle variant="contained" type="submit">
                Next
              </NextBtnStyle>
            </Stack>
          </Stack>
        )
      }}
    </Formik>
  )
}

const InitValueUpdate = () => {
  const { resetForm } = useFormikContext<IBasicInformation>()
  const {
    state: { basic }
  } = useCreateParams()
  useEffect(() => {
    resetForm({ values: basic })
  }, [basic, resetForm])
  return null
}
