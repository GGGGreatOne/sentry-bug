import { Box, Button, Stack, Typography, styled } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik, FieldArray } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import Twitter from 'assets/svg/boxes/twitter.svg'
import Draggable from 'components/Draggable'
import { useState, useMemo } from 'react'
import DragIcon from 'assets/svg/boxes/dragIcon.svg'
import DeleteSvg from 'assets/svg/boxes/delete.svg'
import { viewControl } from 'views/editBox/modal'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { IBoxAboutSectionTypeSocialContentValue, ILinksValue } from 'state/boxes/type'
import { isSocialUrl } from 'utils/index'
import useBreakpoint from 'hooks/useBreakpoint'
const defaulUrl = ''

export interface Socials extends ILinksValue {
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
  value?: IBoxAboutSectionTypeSocialContentValue
  onCancel?: () => void
  onHide?: () => void
}

const validationSchema = yup.object({
  data: yup.array().of(
    yup.object().shape({
      url: yup
        .string()
        .required('The url is required')
        .test('URL', 'Please enter the twitter link', value => {
          if (value) {
            const res = isSocialUrl('twitter', value)
            return res
          }
          return true
        })
    })
  )
})

const SocialsForm = ({
  value = {
    style: '0',
    socialItem: []
  },
  onCancel,
  onHide
}: Props) => {
  const isMd = useBreakpoint('md')
  const { updateBoxAboutSocalCallback } = useEditBoxAboutData()

  const socalData: Socials[] = useMemo(() => {
    if (value?.socialItem?.length) {
      return value.socialItem.map((item, index) => {
        return {
          id: index,
          typeName: item.typeName,
          url: item.url
        }
      })
    } else {
      return [
        {
          id: 0,
          typeName: 'twitter',
          url: defaulUrl
        }
      ]
    }
  }, [value])
  const [draggableItems, setDraggableItems] = useState(socalData)
  const initialValues = {
    data: draggableItems
  }
  const sortList = (values: any, data: Socials[]) => {
    const list: Socials[] = []
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < values.data.length; j++) {
        if (data[i].id === values.data[j].id) {
          list.push({
            id: values.data[j].id,
            typeName: values.data[j].typeName,
            url: values.data[j].url
          })
        }
      }
    }
    return list
  }
  const handleSubmit = (values: any) => {
    const socialList: ILinksValue[] = []
    for (let i = 0; i < draggableItems.length; i++) {
      for (let j = 0; j < values.data.length; j++) {
        if (draggableItems[i].id === values.data[j].id) {
          socialList.push({
            typeName: values.data[j].typeName,
            url: values.data[j].url
          })
        }
      }
    }

    updateBoxAboutSocalCallback({
      style: '0',
      socialItem: socialList
    })

    onHide ? onHide() : viewControl.hide('SocialDialog')
  }
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
          lineHeight: '26px',
          color: 'var(--ps-text-100)',
          textAlign: 'left',
          marginBottom: 32
        }}
      >
        Add featured content with previews here!
      </Typography>
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
                        {...props}
                        sx={{ paddingLeft: isMd ? 25 : 30, position: 'relative', zIndex: 10000 }}
                      >
                        <Stack justifyContent={'center'}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '100%',
                              overflow: 'hidden',
                              width: isMd ? 32 : 34,
                              height: isMd ? 32 : 34,
                              backgroundColor: ' var(--ps-text-20)'
                            }}
                          >
                            <Twitter style={{ transform: isMd ? 'scale(.9)' : 'none' }} />
                          </Box>
                        </Stack>
                        <Stack gap={8} flexDirection={'column'} width={'100%'} paddingRight={30}>
                          <FormItem name={`data[${index}].url`}>
                            <Input height={isMd ? 40 : 50} outlined value={value.url} placeholder="Insert your link" />
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
                    typeName: 'twitter',
                    url: defaulUrl
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
                    onCancel ? onCancel() : viewControl.hide('SocialDialog')
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
    </Box>
  )
}

export default SocialsForm
