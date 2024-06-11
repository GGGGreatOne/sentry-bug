import { Box, Button, Stack, styled } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik, FieldArray } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import Draggable from 'components/Draggable'
import { useState, useMemo } from 'react'
import DragIcon from 'assets/svg/boxes/dragIcon.svg'
import EducationIcon from 'assets/svg/boxes/education.svg'
import Upload from 'components/Upload'
import DeleteSvg from 'assets/svg/boxes/delete.svg'
import { viewControl } from 'views/editBox/modal'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { ExperienceValueItem, IBoxAboutSectionTypeExperienceValue } from 'state/boxes/type'
import { upload } from 'api/common'
import { toast } from 'react-toastify'
import useBreakpoint from 'hooks/useBreakpoint'
export interface Educations extends ExperienceValueItem {
  id: number
}

const StyledDeleteSvg = styled(DeleteSvg)(() => ({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  '& path': {
    fill: 'var(--ps-neutral4)'
  }
}))

const StyledPenDragIcon = styled(DragIcon)<{ isDragged: boolean }>(({ isDragged }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  cursor: isDragged ? 'grabbing' : 'grab',
  '& path': {
    stroke: 'var(--ps-neutral4)'
  }
}))

interface Props {
  value?: IBoxAboutSectionTypeExperienceValue
  onCancel?: () => void
  onHide?: () => void
}

const validationSchema = yup.object({
  data: yup.array().of(
    yup.object().shape({
      name: yup.string().required('School Name is required'),
      title: yup.string().required('Position is required'),
      description: yup.string().required('Major is required')
    })
  )
})

const EducationForm = ({ value = { style: '0', experienceItem: [] }, onCancel, onHide }: Props) => {
  const isMd = useBreakpoint('md')
  const { updateBoxAboutEducationCallback } = useEditBoxAboutData()
  const teamData: Educations[] = useMemo(() => {
    if (value.experienceItem.length) {
      return value.experienceItem.map((item, index) => {
        return {
          id: index,
          name: item.name,
          title: item.title,
          description: item.description,
          picture: item.picture
        }
      })
    } else {
      return [
        {
          id: 0,
          name: '',
          title: '',
          description: '',
          picture: ''
        }
      ]
    }
  }, [value])
  const [draggableItems, setDraggableItems] = useState(teamData)
  const initialValues = {
    data: draggableItems
  }
  const sortList = (values: any, data: Educations[]) => {
    const educationList: Educations[] = []
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < values.data.length; j++) {
        if (data[i].id === values.data[j].id) {
          educationList.push({
            id: values.data[j].id,
            name: values.data[j].name,
            title: values.data[j].title,
            picture: values.data[j].picture,
            description: values.data[j].description
          })
        }
      }
    }
    return educationList
  }

  const handleSubmit = (values: any) => {
    const educationList: ExperienceValueItem[] = []
    for (let i = 0; i < draggableItems.length; i++) {
      for (let j = 0; j < values.data.length; j++) {
        if (draggableItems[i].id === values.data[j].id) {
          educationList.push({
            name: values.data[j].name,
            title: values.data[j].title,
            picture: values.data[j].picture,
            description: values.data[j].description
          })
        }
      }
    }
    updateBoxAboutEducationCallback({
      style: '0',
      experienceItem: educationList
    })
    onHide ? onHide() : viewControl.hide('EducationDialog')
  }
  return (
    <Box>
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <Stack component={Form} spacing={16}>
              <FieldArray name="data">
                {({}) => (
                  <Draggable
                    itemList={draggableItems}
                    setItemList={list => {
                      const data = sortList(values, list)
                      setFieldValue('data', data)
                      setDraggableItems(list)
                    }}
                    parentItem={({ children, props }) => (
                      <Stack {...props} spacing={16}>
                        {children}
                      </Stack>
                    )}
                    childItem={({ value, isDragged, props, index }) => (
                      <Stack
                        gap={8}
                        flexDirection={'row'}
                        alignItems={'center'}
                        {...props}
                        sx={{ paddingLeft: isMd ? 25 : 30, position: 'relative', zIndex: 10000 }}
                      >
                        <Box sx={{ width: 48, height: 48 }}>
                          <FormItem name={`data[${index}].picture`}>
                            <Upload
                              imgHeight={48}
                              imgWidth={48}
                              onSuccess={async ({ file }) => {
                                const uploadRes = await upload({
                                  file
                                })

                                if (uploadRes.code === 200) {
                                  const newArray = [...values.data]
                                  if (index !== undefined) {
                                    newArray[index].picture = uploadRes.data.url
                                    setFieldValue('data', newArray)
                                    setDraggableItems(newArray)
                                  }
                                } else if (uploadRes.code === 401) {
                                  toast.error('Sorry, you do not have permission.')
                                  return
                                } else {
                                  toast.error('Sorry, you failed to upload your picture.')
                                  return
                                }
                              }}
                              onDelete={() => {
                                const newArray = [...values.data]

                                if (index !== undefined) {
                                  newArray[index].picture = ''
                                  setFieldValue('data', newArray)
                                  setDraggableItems(newArray)
                                }
                              }}
                              file={value.picture}
                            >
                              <Stack
                                width={48}
                                height={48}
                                justifyContent={'center'}
                                sx={{ backgroundColor: 'var(--ps-text-20)', borderRadius: '50%' }}
                              >
                                <EducationIcon style={{ margin: '0 auto', transform: isMd ? 'scale(.75)' : 'none' }} />
                              </Stack>
                            </Upload>
                          </FormItem>
                        </Box>

                        <Stack gap={8} flexDirection={'column'} flex={1} paddingRight={30}>
                          <FormItem name={`data[${index}][name]`}>
                            <Input height={isMd ? 40 : 50} outlined value={value.name} placeholder="School Name" />
                          </FormItem>
                          <FormItem name={`data[${index}][title]`}>
                            <Input height={isMd ? 40 : 50} outlined value={value.title} placeholder="School Position" />
                          </FormItem>
                          <FormItem name={`data[${index}][description]`}>
                            <Input height={isMd ? 40 : 50} outlined value={value.title} placeholder="Major Name" />
                          </FormItem>
                        </Stack>
                        <StyledPenDragIcon
                          tabIndex={-1}
                          data-movable-handle
                          isDragged={isDragged}
                          style={{ transform: isMd ? 'translateY(-50%) scale(.9)' : 'translateY(-50%)' }}
                        />
                        {values.data.length > 1 && (
                          <StyledDeleteSvg
                            onClick={() => {
                              if (index !== undefined) {
                                const data = [...values.data]
                                data.splice(index, 1)
                                data.forEach((item, index) => {
                                  item.id = index
                                })
                                setFieldValue('data', data)
                                setDraggableItems(data)
                              }
                            }}
                          />
                        )}
                      </Stack>
                    )}
                  />
                )}
              </FieldArray>
              <Stack
                sx={{
                  maxWidth: 924,
                  margin: isMd ? '30px auto 0 !important' : '40px auto 0 !important',
                  borderRadius: 4,
                  padding: isMd ? 12 : 16,
                  color: 'var(--ps-text-primary)',
                  fontSize: isMd ? 15 : 16,
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 400,
                  lineHeight: isMd ? '21px' : '22.4px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--ps-text-100)'
                }}
                onClick={() => {
                  const data = [...values.data]
                  data.push({
                    id: data.length,
                    name: '',
                    title: '',
                    picture: '',
                    description: ''
                  })
                  setFieldValue('data', data)
                  setDraggableItems(data)
                }}
              >
                + ADD NEW
              </Stack>
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
                    onCancel ? onCancel() : viewControl.hide('EducationDialog')
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </Stack>
          )
        }}
      </Formik>
    </Box>
  )
}

export default EducationForm
