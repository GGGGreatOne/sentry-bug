import { Box, Button, Stack, Typography, styled } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik, FieldArray } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import DeleteSvg from 'assets/svg/boxes/delete.svg'
import { viewControl } from 'views/editBox/modal'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { IBoxAboutSectionTypeRoadmapValue, RoadmapDataType } from 'state/boxes/type'
import DatePicker from 'components/DatePicker'
import dayjs from 'dayjs'
import useBreakpoint from 'hooks/useBreakpoint'
import { CSSTransition } from 'react-transition-group'
import SectionModule from '../SectionModule'
import { useState } from 'react'
import ColorfulFlags from 'assets/svg/boxes/colorfulFlags.svg'
import LineSvg from 'assets/svg/boxes/line.svg'
export const StyledLineSvg = styled(LineSvg)<{ color: string }>(({ color }) => ({
  cursor: 'pointer',
  width: 30,
  '& path': {
    stroke: color
  }
}))
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

interface Props {
  value?: IBoxAboutSectionTypeRoadmapValue
  onCancel?: () => void
  onHide?: () => void
}

const validationSchema = yup.object({
  data: yup.array().of(
    yup.object({
      date: yup
        .string()
        .required('ate is required')
        .test('InvalidDate', 'Invalid Date', value => {
          if (value === 'Invalid Date') {
            return false
          }
          return true
        }),
      eventName: yup.string().required('Event name is required'),
      description: yup.string().required('Description is required')
    })
  )
})

const RoadmapItem = ({ data, isMd }: { data: string[]; isMd: boolean }) => {
  return (
    <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} height={isMd ? 98 : 175}>
      {data.map((item, index) => {
        return (
          <Stack
            key={index}
            flexDirection={'column'}
            alignItems={'flex-start'}
            width={index + 1 < data.length ? 75 : 48}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 400,
                fontSize: 6.3,
                lineHeight: '9px',
                fontStyle: 'normal',
                color: 'var(--ps-text-60)',
                marginBottom: 16
              }}
            >
              {item}
            </Typography>
            <Stack gap={4} flexDirection={'row'} alignItems={'center'}>
              <Stack
                alignItems={'center'}
                justifyContent={'center'}
                sx={{
                  width: 38,
                  height: 38,
                  background: 'var(--ps-neutral)',
                  border: `2px solid var(--ps-text-80)`,
                  borderRadius: '50%'
                }}
              >
                <ColorfulFlags transform="scale(.7)" />
              </Stack>
              {index + 1 < data.length && <StyledLineSvg color={'var(--ps-neutral5)'} />}
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}

const RoadmapItem2 = ({ data, isMd }: { data: string[]; isMd: boolean }) => {
  return (
    <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} height={isMd ? 98 : 175}>
      {data.map((item, index) => {
        return (
          <Stack
            key={index}
            flexDirection={'column'}
            alignItems={'flex-start'}
            width={index + 1 < data.length ? 83 : 70}
            sx={{
              borderLeft: `2px solid var(--ps-text-100)`,
              padding: index + 1 < data.length ? '0 15px' : '0 0 0 15px'
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: 30,
                lineHeight: '25px',
                fontWeight: 500,
                marginBottom: 12,
                color: 'var(--ps-text-100)'
              }}
            >
              0{index + 1}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 400,
                fontSize: 6.3,
                lineHeight: '9px',
                fontStyle: 'normal',
                color: 'var(--ps-text-60)'
              }}
            >
              {item}
            </Typography>
          </Stack>
        )
      })}
    </Stack>
  )
}

const RoadmapForm = ({
  value = {
    style: '0',
    roadmapItem: [{ eventName: '', date: dayjs().format('YYYY-MM'), description: '', future: true }]
  },
  onCancel,
  onHide
}: Props) => {
  const isMd = useBreakpoint('md')
  const { updateBoxAboutRoadmapCallback } = useEditBoxAboutData()
  const [styleType, setStyleType] = useState<string>(value.style)
  const [step, setStep] = useState<number>(1)
  const moduleData = ['NOVEMBER 2017', 'NOVEMBER 2017', 'NOVEMBER 2017']
  const moduleList = [
    {
      value: '0',
      component: <RoadmapItem data={moduleData} isMd={isMd} />
    },
    {
      value: '1',
      component: <RoadmapItem2 data={moduleData} isMd={isMd} />
    }
  ]
  const initialValues = {
    style: '0',
    data: value?.roadmapItem?.length
      ? value.roadmapItem
      : [{ eventName: '', date: dayjs().format('YYYY-MM'), description: '', future: true }]
  }
  const compareDates = (a: RoadmapDataType, b: RoadmapDataType) => {
    if (dayjs(a.date).isBefore(dayjs(b.date))) {
      return -1
    }
    if (dayjs(a.date).isAfter(dayjs(b.date))) {
      return 1
    }
    return 0
  }
  const handleSort = (list: RoadmapDataType[]) => {
    if (list.length > 1) {
      list.sort(compareDates)
      return list
    } else {
      return list
    }
  }
  const handleSubmit = (values: any) => {
    const result: IBoxAboutSectionTypeRoadmapValue = {
      style: styleType ? styleType : '0',
      roadmapItem: handleSort(values.data)
    }
    updateBoxAboutRoadmapCallback(result)
    onHide ? onHide() : viewControl.hide('RoadmapDialog')
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
            <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => {
                return (
                  <Stack component={Form} spacing={16}>
                    <FieldArray name="data">
                      {({ remove }) => (
                        <>
                          {values.data.map((item, index) => (
                            <Stack
                              key={index}
                              gap={8}
                              flexDirection={'row'}
                              alignItems={'center'}
                              sx={{ position: 'relative' }}
                            >
                              <Stack gap={8} flexDirection={'column'} width={'100%'} paddingRight={30}>
                                <FormItem name={`data.${index}.date`} fieldType="custom">
                                  <DatePicker
                                    isMd={isMd}
                                    value={dayjs(item.date)}
                                    views={['month', 'year']}
                                    onChange={(value, content) => {
                                      console.log('content', content)

                                      const newArray = [...values.data]
                                      if (value) {
                                        newArray[index].date = dayjs(value).format('YYYY-MM')
                                        setFieldValue('data', newArray)
                                      }
                                    }}
                                    // onClose={() => {
                                    // console.log('close', newDateArray)
                                    // const data = handleSort(newDateArray)
                                    // console.log(data)
                                    // setFieldValue(`data`, data)
                                    // resetForm({
                                    //   values: {
                                    //     data: data
                                    //   }
                                    // })
                                    // }}
                                  />
                                </FormItem>
                                <FormItem name={`data.${index}.eventName`}>
                                  <Input
                                    height={isMd ? 40 : 50}
                                    outlined
                                    value={item.eventName}
                                    placeholder="Event Name"
                                  />
                                </FormItem>
                                <FormItem name={`data.${index}.description`}>
                                  <Input
                                    height={isMd ? 40 : 50}
                                    outlined
                                    value={item.description}
                                    placeholder="Description"
                                  />
                                </FormItem>
                              </Stack>
                              {values.data.length > 1 && (
                                <StyledDeleteSvg
                                  onClick={() => {
                                    remove(index)
                                  }}
                                />
                              )}
                            </Stack>
                          ))}
                          {values.data.length < 8 && (
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
                                const newArray = [...values.data]
                                newArray.push({
                                  eventName: '',
                                  date: dayjs().format('YYYY-MM'),
                                  description: '',
                                  future: true
                                })
                                setFieldValue('data', newArray)
                              }}
                            >
                              {`+ ADD A  MILESTONE (UP TO 8)`}
                            </Stack>
                          )}
                        </>
                      )}
                    </FieldArray>

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
                          onCancel ? onCancel() : viewControl.hide('RoadmapDialog')
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
          )}
        </>
      </CSSTransition>
    </Box>
  )
}

export default RoadmapForm
