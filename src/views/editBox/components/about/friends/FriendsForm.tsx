import { Box, Button, Stack, Typography, styled } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik, FieldArray } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import Draggable from 'components/Draggable'
import { useState, useMemo } from 'react'
import DragIcon from 'assets/svg/boxes/dragIcon.svg'
import Avatar from '@mui/icons-material/Person'
import Upload from 'components/Upload'
import DeleteSvg from 'assets/svg/boxes/delete.svg'
import { viewControl } from 'views/editBox/modal'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { IBoxAboutSectionTypeTeamValue, TeamValueItem } from 'state/boxes/type'
import { upload } from 'api/common'
import { toast } from 'react-toastify'
import useBreakpoint from 'hooks/useBreakpoint'
import DefaultAvatar from 'assets/images/boxes/default-avatar.jpg'
import Image from 'next/image'
import { CSSTransition } from 'react-transition-group'
import SectionModule from '../SectionModule'

export interface Teams extends TeamValueItem {
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
  value?: IBoxAboutSectionTypeTeamValue
  onCancel?: () => void
  onHide?: () => void
}

const validationSchema = yup.object({
  data: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Name is required')
      // position: yup.string().required('Position is required')
    })
  )
})
const TeamItem = ({ item, width, isMd }: { item: TeamValueItem; width: string; isMd: boolean }) => {
  return (
    <Stack
      width={width}
      gap={4}
      flexDirection={'column'}
      alignItems={'center'}
      sx={{ background: 'var(--ps-neutral)', padding: '32px 0', borderRadius: isMd ? 8 : 16 }}
    >
      <Box
        sx={{
          width: isMd ? 56 : 87,
          height: isMd ? 56 : 87,
          borderRadius: '50%',
          border: '2px solid var(--ps-neutral4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {item.avatar ? (
          <Image
            width={isMd ? 54 : 85}
            height={isMd ? 54 : 85}
            src={item.avatar}
            alt={''}
            style={{ borderRadius: 'inherit' }}
          />
        ) : (
          <Avatar sx={{ fontSize: 36, color: 'var(--ps-text-20)' }} />
        )}
      </Box>
      <Stack width={'80%'} flexDirection={'column'} alignItems={'center'}>
        <Typography
          variant="h3"
          sx={{
            fontSize: isMd ? 13 : 20,
            color: 'var(--ps-text-100)',
            fontWeight: 500,
            lineHeight: isMd ? '28px' : '39.2px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '90%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: 'var(--ps-text-80)',
            fontWeight: 500,
            fontSize: isMd ? 9 : 14,
            lineHeight: isMd ? '18px' : '11.7px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.position}
        </Typography>
      </Stack>
    </Stack>
  )
}
const TeamItem2 = ({ item, width, isMd }: { item: TeamValueItem; width: string; isMd: boolean }) => {
  return (
    <Stack
      height={205}
      width={width}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'end'}
      sx={{
        backgroundImage: `url(${item.avatar})`,
        backgroundSize: '100% 100%',
        borderRadius: isMd ? 8 : 16
      }}
    >
      <Stack
        gap={2}
        width={'90%'}
        flexDirection={'column'}
        alignItems={'center'}
        sx={{
          borderRadius: 100,
          border: '1px solid #000000',
          padding: '3px 24px 2px',
          marginBottom: 10,
          background: 'var(--ps-text-100)'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: isMd ? 9 : 14,
            color: 'var(--ps-text-primary)',
            fontWeight: 500,
            lineHeight: isMd ? '11.7px' : '18px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '90%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: 'var(--ps-text-primary)',
            fontWeight: 400,
            fontSize: isMd ? 7.3 : 11.1,
            lineHeight: isMd ? '10px' : '15.3px',
            fontStyle: 'normal',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'Hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.position}
        </Typography>
      </Stack>
    </Stack>
  )
}

const TeamForm = ({ value = { style: '0', teamItem: [] }, onCancel, onHide }: Props) => {
  const isMd = useBreakpoint('md')
  const { updateBoxAboutFriendsCallback } = useEditBoxAboutData()
  const [styleType, setStyleType] = useState<string>(value.style)
  const [step, setStep] = useState<number>(1)
  const moduleData = {
    avatar: DefaultAvatar.src,
    name: 'Name',
    position: 'Title'
  }
  const moduleList = [
    {
      value: '0',
      component: <TeamItem item={moduleData} width={isMd ? '70%' : '100%'} isMd={isMd} />
    },
    {
      value: '1',
      component: <TeamItem2 item={moduleData} width={isMd ? '70%' : '100%'} isMd={isMd} />
    }
  ]
  const teamData: Teams[] = useMemo(() => {
    if (value?.teamItem?.length) {
      return value.teamItem.map((item, index) => {
        return {
          id: index,
          name: item.name,
          position: item.position,
          avatar: item.avatar
        }
      })
    } else {
      return [
        {
          id: 0,
          name: '',
          position: '',
          avatar: ''
        }
      ]
    }
  }, [value])
  const [draggableItems, setDraggableItems] = useState(teamData)
  const initialValues = {
    style: '0',
    data: draggableItems
  }
  const sortList = (values: any, data: Teams[]) => {
    const teamList: Teams[] = []
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < values.data.length; j++) {
        if (data[i].id === values.data[j].id) {
          teamList.push({
            id: values.data[j].id,
            name: values.data[j].name,
            position: values.data[j].position,
            avatar: values.data[j].avatar
          })
        }
      }
    }
    return teamList
  }

  const handleSubmit = (values: any) => {
    const teamList: IBoxAboutSectionTypeTeamValue = {
      style: styleType ? styleType : '0',
      teamItem: []
    }
    for (let i = 0; i < draggableItems.length; i++) {
      for (let j = 0; j < values.data.length; j++) {
        if (draggableItems[i].id === values.data[j].id) {
          teamList.teamItem.push({
            name: values.data[j].name,
            position: values.data[j].position,
            avatar: values.data[j].avatar
          })
        }
      }
    }

    updateBoxAboutFriendsCallback(teamList)

    onHide ? onHide() : viewControl.hide('FriendsDialog')
  }
  return (
    <Box>
      <CSSTransition in={step === 1} timeout={300} classNames="createStepLeft-transition" unmountOnExit>
        <>
          {step === 1 && (
            <SectionModule
              isMd={isMd}
              data={moduleList}
              onCancel={onCancel}
              styleType={styleType}
              onChoose={(e: string) => {
                setStyleType(e)
              }}
              onSave={(e: number) => {
                setStep(e)
              }}
            />
          )}
        </>
      </CSSTransition>
      <CSSTransition in={step === 2} timeout={300} classNames="createStepRight-transition" unmountOnExit>
        <>
          {step === 2 && (
            <>
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
                Add people & organization details here!
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
                                alignItems={'center'}
                                {...props}
                                sx={{
                                  paddingLeft: isMd ? 25 : 30,
                                  position: 'relative',
                                  zIndex: 10000
                                }}
                              >
                                <Box sx={{ width: 48, height: 48 }}>
                                  <FormItem name={`data[${index}].avatar`}>
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
                                            newArray[index].avatar = uploadRes.data.url
                                            setFieldValue('data', newArray)
                                            setDraggableItems(newArray)
                                          }
                                        } else if (uploadRes.code === 401) {
                                          toast.error('Sorry, you do not have permission.')
                                          return
                                        } else {
                                          toast.error('Sorry, you failed to upload your avatar.')
                                          return
                                        }
                                      }}
                                      onDelete={() => {
                                        const newArray = [...values.data]

                                        if (index !== undefined) {
                                          newArray[index].avatar = ''
                                          setFieldValue('data', newArray)
                                          setDraggableItems(newArray)
                                        }
                                      }}
                                      file={value.avatar}
                                    >
                                      <Stack
                                        width={48}
                                        height={48}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        sx={{ backgroundColor: 'var(--ps-text-20)', borderRadius: '50%' }}
                                      >
                                        <Avatar sx={{ fontSize: 36, color: 'var(--ps-text-20)' }} />
                                      </Stack>
                                    </Upload>
                                  </FormItem>
                                </Box>

                                <Stack gap={8} flexDirection={'column'} flex={1} paddingRight={30}>
                                  <FormItem name={`data[${index}][name]`}>
                                    <Input
                                      height={isMd ? 40 : 50}
                                      outlined
                                      value={value.name}
                                      placeholder="@Twitter Handle"
                                    />
                                  </FormItem>
                                  <FormItem name={`data[${index}][position]`}>
                                    <Input
                                      height={isMd ? 40 : 50}
                                      outlined
                                      value={value.position}
                                      placeholder="Title(Optional)"
                                    />
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
                            position: '',
                            avatar: ''
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
                            setStep(1)
                          }}
                        >
                          Back
                        </Button>
                        <Button variant="contained" type="submit">
                          Save
                        </Button>
                      </Stack>
                    </Stack>
                  )
                }}
              </Formik>
            </>
          )}
        </>
      </CSSTransition>
    </Box>
  )
}

export default TeamForm
