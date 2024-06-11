import { Box, Button, Stack, styled, Typography } from '@mui/material'
import * as yup from 'yup'
import { Form, Formik, FieldArray } from 'formik'
import FormItem from 'components/FormItem'
import Input from 'components/Input'
import Draggable from 'components/Draggable'
import { useState, useMemo, useEffect } from 'react'
import DragIcon from 'assets/svg/boxes/dragIcon.svg'
import DeleteSvg from 'assets/svg/boxes/delete.svg'
import { viewControl } from 'views/editBox/modal'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { IBoxAboutSectionTypeTokenomicColor, IBoxAboutSectionTypeTokenomicValue } from 'state/boxes/type'
import useBreakpoint from 'hooks/useBreakpoint'
import { CSSTransition } from 'react-transition-group'
import SectionModule from '../SectionModule'
import PieChart from 'components/CreatChart/PieCharts'
import BarCharts from 'components/CreatChart/BarCharts'
import { useUpdateThemeMode } from 'state/application/hooks'
import { PieChartsProps } from 'components/CreatChart'
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

interface Shares {
  id: number
  purpose: string
  percentage: string | number
}

interface Props {
  value?: IBoxAboutSectionTypeTokenomicValue
  onCancel?: () => void
  onHide?: () => void
}
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const validationSchema = yup.object({
  totalSupply: yup.string().required('Total supply is required'),
  tokenAdress: yup
    .string()
    .required('Token Adress is required')
    .test('TokenAdress', 'Token Adress format error', value => {
      if (!value) {
        return true
      }
      return ADDRESS_REGEX.test(value)
    }),
  shares: yup.array().of(
    yup.object({
      purpose: yup.string().required('Purpose is required'),
      percentage: yup
        .string()
        .required('Percentage is required')
        .test('0', 'Percentage cannot be equal to 0', value => {
          if (value !== undefined) {
            return value !== '0'
          }
          return true
        })
    })
  )
})
const moduleData: PieChartsProps[] = [
  {
    name: 'one',
    value: 525,
    percent: '2.5%'
  },
  {
    name: 'two',
    value: 525,
    percent: '2.5%'
  },
  {
    name: 'three',
    value: 1050,
    percent: '5%'
  },
  {
    name: 'four',
    value: 1050,
    percent: '5%'
  },
  {
    name: 'five',
    value: 2100,
    percent: '10%'
  },
  {
    name: 'six',
    value: 2625,
    percent: '12.5%'
  },
  {
    name: 'seven',
    value: 2625,
    percent: '12.5%'
  },
  {
    name: 'eight',
    value: 10500,
    percent: '50%'
  }
]
const TokenomicForm = ({
  value = { style: '0', totalSupply: '', tokenAdress: '', shares: [] },
  onCancel,
  onHide
}: Props) => {
  const isMd = useBreakpoint('md')
  const [showMessage, setShowMessage] = useState(false)
  const [total, setTotal] = useState(value.totalSupply)
  const [styleType, setStyleType] = useState<string>(value.style)
  const [step, setStep] = useState<number>(1)
  const { mode } = useUpdateThemeMode()
  const moduleList = [
    {
      value: '0',
      component: (
        <PieChart
          width={isMd ? 109 : 176}
          height={isMd ? 109 : 176}
          total={21000}
          data={moduleData}
          textTop={'40%'}
          titleSize={isMd ? 5 : 8}
          textColor={mode === 'light' ? 'rgba(13, 13, 13, 0.60)' : 'rgba(255, 255, 255, 0.60)'}
          subtextSize={isMd ? 6.7 : 10.6}
          subtextColor={mode === 'light' ? '#1B1B1B' : '#FFFFFF'}
          colorList={IBoxAboutSectionTypeTokenomicColor}
        />
      )
    },
    {
      value: '1',
      component: (
        <Box>
          <Typography
            sx={{
              fontSize: isMd ? 5.8 : 9,
              fontWeight: 500,
              lineHeight: isMd ? '5.8px' : '9px'
            }}
          >
            Total Supply
          </Typography>
          <Typography
            sx={{
              fontSize: isMd ? 13.4 : 21,
              fontWeight: 500,
              lineHeight: isMd ? '18.7px' : '29.7px',
              marginBottom: 10
            }}
          >
            {(21000).toLocaleString()}
          </Typography>
          <BarCharts
            width={isMd ? 200 : 152}
            height={moduleData.length * 16}
            barHeight={8}
            total={21000}
            data={moduleData}
            colorList={IBoxAboutSectionTypeTokenomicColor}
          />
        </Box>
      )
    }
  ]
  const TitleLabel = styled(Typography)({
    width: '100%',
    textAlign: 'left',
    fontSize: isMd ? 15 : 20,
    fontWeight: 500
  })
  useEffect(() => {
    let timer: any
    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [showMessage])
  const { updateBoxAboutTokenomicCallback } = useEditBoxAboutData()
  const sharesData: Shares[] = useMemo(() => {
    if (!value.shares.length) {
      return [
        {
          id: 0,
          purpose: '',
          percentage: ''
        }
      ]
    } else {
      return value.shares.map((item, index) => {
        return {
          id: index,
          purpose: item.purpose,
          percentage: item.percentage
        }
      })
    }
  }, [value.shares])
  const [draggableItems, setDraggableItems] = useState(sharesData)
  const initialValues = {
    totalSupply: total ? total : value.totalSupply,
    tokenAdress: value.tokenAdress,
    shares: draggableItems
  }

  const sortList = (values: any, data: Shares[]) => {
    const teamList: Shares[] = []
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < values.shares.length; j++) {
        if (data[i].id === values.shares[j].id) {
          teamList.push({
            id: values.shares[j].id,
            purpose: values.shares[j].purpose,
            percentage: values.shares[j].percentage
          })
        }
      }
    }
    return teamList
  }

  const handleSubmit = (values: any) => {
    const sum: number = values.shares.reduce((acc: number, item: any) => acc + Number(item.percentage), 0)
    if (sum !== 100) {
      setShowMessage(true)
    } else {
      const List: any[] = []
      for (let i = 0; i < draggableItems.length; i++) {
        for (let j = 0; j < values.shares.length; j++) {
          if (draggableItems[i].id === values.shares[j].id) {
            List.push({
              purpose: values.shares[j].purpose,
              percentage: values.shares[j].percentage
            })
          }
        }
      }
      const result: IBoxAboutSectionTypeTokenomicValue = {
        style: styleType,
        totalSupply: values.totalSupply,
        tokenAdress: values.tokenAdress,
        shares: List
      }
      updateBoxAboutTokenomicCallback(result)
      onHide ? onHide() : viewControl.hide('TokenomicDialog')
    }
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
                    {/* <TitleLabel>Set Token Contract</TitleLabel> */}
                    <FormItem name="tokenAdress">
                      <Input height={isMd ? 40 : 50} outlined value={values.tokenAdress} placeholder="Token Contract" />
                    </FormItem>
                    {/* <TitleLabel>Set Total Supply</TitleLabel> */}
                    <FormItem name="totalSupply">
                      <Input
                        type="number"
                        height={isMd ? 40 : 50}
                        outlined
                        value={String(values.totalSupply)}
                        placeholder="Total Supply"
                        onValue={value => {
                          setTotal(value)
                        }}
                      />
                    </FormItem>

                    <TitleLabel>Set Items</TitleLabel>
                    <FieldArray name="shares">
                      {({}) => (
                        <Draggable
                          itemList={draggableItems}
                          setItemList={list => {
                            const data = sortList(values, list)
                            setFieldValue('shares', data)
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
                              sx={{ paddingLeft: 30, position: 'relative', zIndex: 10000 }}
                            >
                              <Stack gap={8} flexDirection={'column'} width={'100%'} paddingRight={30}>
                                <FormItem name={`shares[${index}].purpose`}>
                                  <Input height={isMd ? 40 : 50} outlined value={value.purpose} placeholder="Purpose" />
                                </FormItem>
                                <FormItem name={`shares[${index}].percentage`}>
                                  <Input
                                    height={isMd ? 40 : 50}
                                    outlined
                                    type="number"
                                    value={value.percentage}
                                    placeholder="Share Percentage"
                                  />
                                </FormItem>
                              </Stack>
                              <StyledPenDragIcon
                                tabIndex={-1}
                                data-movable-handle
                                isDragged={isDragged}
                                style={{ transform: isMd ? 'translateY(-50%) scale(.9)' : 'translateY(-50%)' }}
                              />
                              {values.shares.length > 1 && (
                                <StyledDeleteSvg
                                  onClick={() => {
                                    if (index !== undefined) {
                                      const data = [...values.shares]
                                      data.splice(index, 1)
                                      data.forEach((item, index) => {
                                        item.id = index
                                      })
                                      setFieldValue('shares', data)
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
                    {showMessage && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#FA0E0E',
                          fontWeight: 400,
                          textAlign: 'left',
                          padding: '0 14px'
                        }}
                      >
                        {'The sum of percentage should be equal 100'}
                      </Typography>
                    )}
                    {values.shares.length < 8 && (
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
                          const data = [...values.shares]
                          data.push({
                            id: values.shares.length,
                            purpose: '',
                            percentage: ''
                          })
                          setFieldValue('shares', data)
                          setDraggableItems(data)
                        }}
                      >
                        {`+ ADD A SHARE (UP TO 8)`}
                      </Stack>
                    )}
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
                          onCancel ? onCancel() : viewControl.hide('TokenomicDialog')
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
          )}
        </>
      </CSSTransition>
    </Box>
  )
}

export default TokenomicForm
