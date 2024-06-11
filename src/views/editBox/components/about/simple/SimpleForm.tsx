import { Button, Stack, Typography, styled } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { viewControl } from 'views/editBox/modal'
import useBreakpoint from 'hooks/useBreakpoint'

interface Props {
  title?: string
  content?: string
  index: number
  onCancel?: () => void
  onHide?: () => void
}

const validationSchema = yup.object({
  title: yup.string().required('Please enter title')
})

const SimpleForm = ({ title = '', content = '', index, onCancel, onHide }: Props) => {
  const isMd = useBreakpoint('md')
  const TitleLabel = styled(Typography)({
    width: '100%',
    textAlign: 'left',
    fontSize: isMd ? 15 : 20,
    fontWeight: 500
  })
  const { updateBoxAboutSimpleDataCallback } = useEditBoxAboutData()
  const initialValues = {
    content: content,
    title: title.toUpperCase()
  }
  const handleSubmit = async (values: any) => {
    await updateBoxAboutSimpleDataCallback(index, values)
    onHide ? onHide() : viewControl.hide('SimpleDialog')
  }
  return (
    <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => {
        return (
          <Stack component={Form} spacing={16}>
            <TitleLabel>Set Title</TitleLabel>
            <FormItem name="title">
              <Input
                height={isMd ? 40 : 50}
                outlined
                value={values.title}
                multiline
                placeholder="Insert your title..."
              />
            </FormItem>
            <TitleLabel>Set Content</TitleLabel>
            <FormItem name="content">
              <Input
                height={isMd ? 40 : 50}
                outlined
                value={values.content}
                multiline
                placeholder="Insert your content..."
              />
            </FormItem>
            <Stack
              gap={16}
              flexDirection={'row'}
              justifyContent={isMd ? 'center' : 'flex-end'}
              sx={{
                '& button': {
                  marginTop: isMd ? 16 : 33,
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
                  onCancel ? onCancel() : viewControl.hide('SimpleDialog')
                }}
              >
                {onCancel ? 'Back' : 'Cancel'}
              </Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Stack>
          </Stack>
        )
      }}
    </Formik>
  )
}

export default SimpleForm
