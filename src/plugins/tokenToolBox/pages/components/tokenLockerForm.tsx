import {
  Formik,
  Form,
  FormikErrors
  // , Field
} from 'formik'
import { useActiveWeb3React } from 'hooks'
import { IReleaseType } from 'plugins/tokenToolBox/type'
import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
// import ControlPointIcon from '@mui/icons-material/ControlPoint'
import * as yup from 'yup'
import { isAddress } from 'utils'
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Currency, CurrencyAmount } from 'constants/token'

import {
  Box,
  Select,
  Stack,
  Switch,
  SwitchProps,
  Typography,
  styled,
  OutlinedInput,
  // FormControlLabel,
  // Radio,
  // FormHelperText,
  Button,
  Grid
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import FormItem from 'components/FormItem'
// import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import {
  TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES,
  SupportedChainId,
  TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES
} from 'plugins/tokenToolBox/constants'
// import Image from 'components/Image'
import { TokenlockResponse, useErc20TokenDetail } from 'plugins/tokenToolBox/hook/useTokenLocakCallback'
// import RadioGroupFormItem from './RadioGroupFormItem'
// import DateTimePickerFormItem from './DateTimePickerFormItem'
// import NumberInput from './NumberInput'
import ConnectWalletButton from './ConnectWalletButton'
import SwitchNetworkButton from './SwitchNetworkButton'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  useDeployUniswapV2Timelock,
  // useTokenTimeLinearlock,
  // useTokenTimeStagelock,
  useTokenTimelock
} from 'plugins/tokenToolBox/hook/useTokenTimelock'
// import BigNumber from 'bignumber.js'
import SelectToken, { useGetPairToken } from 'plugins/tokenToolBox/pages/components/SelectToken'
import { CusOutLineInput } from './TokenMinter'
import { CusLineLoadingButton, RowItem, SectionItem } from './ComonComponents'
import useBreakpoint from 'hooks/useBreakpoint'
import { TokenType } from 'api/common/type'
import { useToken } from 'hooks/useToken'
import BasicDateTimePicker from 'components/DatePicker/DateTimePicker'

export const ToolBoxSelect = styled(Select)(() => ({
  border: '0',
  borderRadius: '8px',
  background: '#F6F6F3',
  '.MuiSelect-outlined': {
    border: '0',
    padding: '16px !important'
  },
  '&:hover': {
    border: '0',
    background: '#F6F6F3'
  },
  '&.Mui-focused': {
    border: '0',
    background: '#F6F6F3'
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: '0'
  }
}))

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

export const AddBtn = styled(Button)(() => ({
  height: 44,
  width: 'max-content',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#121212',
  color: '#fff',
  '.text': {
    fontFamily: `'Inter'`,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    marginLeft: '8px'
  },
  '&:hover': {
    background: '#121212'
  }
}))

// const defaultFragmentRelease = {
//   startAt: null,
//   radio: ''
// }
// function SetFragmentReleaseTime({
//   releaseTimes,
//   minDateTime,
//   errors,
//   sizeError,
//   setFragmentReleaseTimes
// }: {
//   setFragmentReleaseTimes: (val: IFragmentReleaseTimes[]) => void
//   minDateTime: Dayjs | null
//   releaseTimes: IFragmentReleaseTimes[]
//   errors?: any
//   sizeError?: any
// }) {
//   const setItemValue = useCallback(
//     (idx: number, _key: keyof IFragmentReleaseTimes, val: any) => {
//       const ret = [...releaseTimes]
//       ret[idx] = {
//         ...ret[idx],
//         [_key]: val
//       }
//       setFragmentReleaseTimes(ret)
//     },
//     [releaseTimes, setFragmentReleaseTimes]
//   )

//   const addOne = useCallback(() => {
//     if (releaseTimes.length <= 39) {
//       setFragmentReleaseTimes([...releaseTimes, { ...defaultFragmentRelease, key: Math.random() }])
//     }
//   }, [releaseTimes, setFragmentReleaseTimes])

//   const removeOne = useCallback(
//     (idx: number) => {
//       if (idx < releaseTimes.length) {
//         const ret = [...releaseTimes]
//         ret.splice(idx, 1)
//         setFragmentReleaseTimes(ret)
//       }
//     },
//     [releaseTimes, setFragmentReleaseTimes]
//   )

//   return (
//     <Stack spacing={5}>
//       <Box display="grid" gap={10} gridTemplateColumns="60fr 30fr 20px">
//         <Typography
//           fontFamily={'IBM Plex Sans'}
//           fontSize={20}
//           fontWeight={500}
//           lineHeight={1.3}
//           color={'var(--ps-text-100)'}
//         >
//           Release start time (UTC time)
//         </Typography>
//         <Typography
//           fontFamily={'IBM Plex Sans'}
//           fontSize={20}
//           fontWeight={500}
//           lineHeight={1.3}
//           color={'var(--ps-text-100)'}
//         >
//           Release ratio
//         </Typography>
//       </Box>
//       <Box sx={{ paddingTop: 10 }}>
//         {releaseTimes.map((item, idx) => (
//           <Box key={item.key || idx}>
//             <Box>
//               <Box display="grid" gap={10} gridTemplateColumns="60fr 30fr 20px">
//                 <Field
//                   component={DateTimePickerFormItem}
//                   disablePast
//                   name={`startAt[${item.key || idx}]`}
//                   value={item.startAt}
//                   onChange={(e: any) => {
//                     setItemValue(idx, 'startAt', e)
//                   }}
//                   minDateTime={minDateTime}
//                   textField={{
//                     sx: {
//                       width: '100%',
//                       fieldset: { borderRadius: 4 },
//                       '& input': {
//                         height: 41,
//                         padding: '0 16px'
//                       }
//                     }
//                   }}
//                 />
//                 <FormItem label="radio">
//                   <NumberInput
//                     sx={{ borderRadius: 4 }}
//                     value={item.radio}
//                     onBlur={() => {
//                       setItemValue(idx, 'radio', Number(item.radio).toFixed(2))
//                     }}
//                     onUserInput={value => {
//                       setItemValue(idx, 'radio', value.toString())

//                       // if (val > 100) {
//                       //   setItemValue(idx, 'radio', '100')
//                       // } else if (val < 0.01) {
//                       //   setItemValue(idx, 'radio', '')
//                       // } else {
//                       //   setItemValue(idx, 'radio', val)
//                       // }
//                     }}
//                     endAdornment={<>%</>}
//                   />
//                 </FormItem>

//                 <RemoveCircleOutlineIcon
//                   sx={{ opacity: idx > 0 ? 1 : 0.5, cursor: 'pointer', alignSelf: 'center' }}
//                   onClick={() => idx > 0 && removeOne(idx)}
//                 />
//               </Box>
//               <Box display="grid" gap={10} gridTemplateColumns="60fr 30fr 20px">
//                 <FormHelperText error={!!errors?.length}>
//                   {typeof errors !== 'string' && errors?.[idx]?.startAt}
//                 </FormHelperText>
//                 <FormHelperText error={!!errors?.length}>
//                   {typeof errors !== 'string' && errors?.[idx]?.radio}
//                 </FormHelperText>
//               </Box>
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       <FormHelperText error={!!sizeError}>{sizeError}</FormHelperText>
//       <AddBtn onClick={addOne}>
//         <ControlPointIcon onClick={addOne} sx={{ cursor: 'pointer' }} />
//         <Typography component={'span'} className={'text'} noWrap>
//           Add Stage
//         </Typography>
//       </AddBtn>
//     </Stack>
//   )
// }

const Title = styled(Typography)`
  font-family: Inter;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.4px;
  text-align: left;
  color: #20201e;
`

export const ToolBoxInput = styled(OutlinedInput)(() => ({
  color: '#20201e',
  border: '0',
  fieldset: {
    border: '0'
  },
  '&:hover': {
    border: '0'
  }
}))

interface ReleaseItemParam {
  startAt: string
  radio: number | string
}

interface IFragmentReleaseTimes {
  startAt: Dayjs | null
  radio: string
  key?: number
}

interface ISeller {
  tokenAddress: string
  chainId: SupportedChainId
  tokanName: string
  tokenSymbol: string
  tokenDecimal: number
  balance: string
  title: string
  amount: string
  releaseType: IReleaseType
  delayUnlockingTime: Dayjs | null
  linearUnlockingStartTime: Dayjs | null
  linearUnlockingEndTime: Dayjs | null
  releaseDataArr: ReleaseItemParam[]
  fragmentReleaseTimes: IFragmentReleaseTimes[]
  segmentAmount?: string
  fragmentReleaseSize?: string
}

const sellerValidationSchema = yup.object({
  tokenAddress: yup
    .string()
    .required('Token Address is a required')
    .test('is-address', 'Please input a valid token address', value => {
      return !!isAddress(value || '')
    }),
  title: yup.string().required('Title is a required'),
  amount: yup.number().typeError('Please input valid number').required('Amount is a required'),
  delayUnlockingTime: yup
    .date()
    .nullable(true)
    .when('releaseType', {
      is: (val: any) => Number(val) === IReleaseType.Cliff,
      then: yup
        .date()
        .typeError('Please select a valid time')
        .required('Please select a valid time')
        .test({
          name: 'check-delayUnlockingTime',
          test: (input, context) => {
            if (dayjs(input) < dayjs()) {
              return context.createError({ message: 'Please select a time earlier than current time' })
            }
            return true
          }
        })
    }),
  linearUnlockingStartTime: yup
    .date()
    .nullable(true)
    .when('releaseType', {
      is: (val: any) => Number(val) === IReleaseType.Linear,
      then: yup
        .date()
        .typeError('Please select a valid time')
        .required('Please select a valid time')
        .test({
          name: 'check-linearUnlockingStartTime',
          test: (input, context) => {
            if (dayjs(input) < dayjs()) {
              return context.createError({ message: 'Please select a time earlier than current time' })
            }
            return true
          }
        })
    }),
  linearUnlockingEndTime: yup
    .date()
    .nullable(true)
    .when('releaseType', {
      is: (val: any) => Number(val) === IReleaseType.Linear,
      then: yup
        .date()
        .typeError('Please select a valid time')
        .required('Please select a valid time')
        .test({
          name: 'check-linearUnlockingEndTime',
          test: (input, context) => {
            if (dayjs(input) < dayjs()) {
              return context.createError({ message: 'Please select a time earlier than current time' })
            }
            if (
              !(
                !context.parent.linearUnlockingStartTime.valueOf() ||
                (input?.valueOf() || 0) > context.parent.linearUnlockingStartTime.valueOf()
              )
            ) {
              return context.createError({ message: 'Please select a time later than linear unlocking end time' })
            }
            return true
          }
        })
    }),
  fragmentReleaseTimes: yup.array().when('releaseType', {
    is: (val: any) => Number(val) === IReleaseType.Fragment,
    then: yup.array().of(
      yup.object().shape({
        startAt: yup
          .date()
          .typeError('Please select a valid time')
          .required('Please select a valid time')
          .test({
            name: 'check-fragmentReleaseTimes',
            test: (input, context) => {
              if (dayjs(input) < dayjs()) {
                return context.createError({ message: 'Please select a time earlier than current time' })
              }
              return true
            }
          }),
        radio: yup.string().required('Must enter the release ratio')
      })
    )
  }),
  fragmentReleaseSize: yup.string().when('releaseType', {
    is: (val: any) => Number(val) === IReleaseType.Fragment,
    then: yup.string().test('TEST_FRAGMENT_TOTAL', 'Release ratio must add up to 100%', (_, context) => {
      const endTime = context.parent.endTime?.valueOf() || 0
      for (const item of context.parent.fragmentReleaseTimes) {
        if (Number(item.radio) === 0) {
          return context.createError({ message: 'Release ratio must more than 0' })
        }
        if (endTime && item.startAt && (item.startAt?.valueOf() || 0) < endTime) {
          return context.createError({ message: 'Please select a time later than end time' })
        }
      }
      return (
        context.parent.fragmentReleaseTimes
          .map((item: { radio: string }) => item.radio)
          .reduce((a: any, b: any) => (Number(a) || 0) + (Number(b) || 0), [0]) === 100
      )
    })
  })
})

const TokenLockerForm = ({
  boxAddress,
  chainId: propsChainId,
  token
}: {
  chainId?: SupportedChainId
  token?: Currency
  boxAddress: string
}) => {
  const [checkToken, setCheckToken] = useState<Currency | undefined>()
  const { chainId: CurrenChainId, account } = useActiveWeb3React()
  const isMd = useBreakpoint('md')
  // const switchChain = useSwitchNetwork()
  const [chainId, setChainId] = useState<SupportedChainId>(
    Number(propsChainId ? propsChainId : CurrenChainId) as SupportedChainId
  )
  const [releaseType, setReleaseType] = useState<IReleaseType>(IReleaseType.Cliff)

  const tokenType = useRef(TokenType.TOKEN)

  useEffect(() => {
    if (!token) {
      setCheckToken(undefined)
      return
    }
    setCheckToken(token)
  }, [token])

  const defaultFragmentRelease = useMemo(() => {
    return {
      startAt: null,
      radio: ''
    }
  }, [])
  const sellerValue: ISeller = useMemo(() => {
    return {
      tokenAddress: checkToken?.address || '',
      chainId: chainId,
      tokanName: '',
      tokenSymbol: '',
      tokenDecimal: 18,
      balance: '',
      title: '',
      amount: '',
      releaseType: IReleaseType.Cliff,
      delayUnlockingTime: null,
      linearUnlockingStartTime: null,
      linearUnlockingEndTime: null,
      fragmentReleaseTimes: [{ ...defaultFragmentRelease, key: Math.random() }],
      releaseDataArr: [],
      segmentAmount: '',
      fragmentReleaseSize: ''
    }
  }, [chainId, checkToken?.address, defaultFragmentRelease])
  const { toLockHandle, submitted: lockSubmitted } = useTokenTimelock(chainId, boxAddress)
  // const { toTimeStagelockHandle, submitted: timeStagelockSubmitted } = useTokenTimeStagelock(
  //   chainId,
  //   boxAddress
  // )
  // const { toLockLinearHandle, submitted: lockLinearSubmitted } = useTokenTimeLinearlock(
  //   chainId,
  //   boxAddress
  // )

  const { toLockV2Handle, submitted: lockLpV2Submitted } = useDeployUniswapV2Timelock(chainId, boxAddress)

  const onSubmit = async (value: ISeller) => {
    const amoutAraw = erc20TokenDeatail?.tokenCurrency
      ? CurrencyAmount.fromAmount(erc20TokenDeatail.tokenCurrency, value.amount)
      : undefined
    switch (tokenType.current) {
      case TokenType.TOKEN:
        toLockHandle(value.title, value.tokenAddress, account || '', amoutAraw, value?.delayUnlockingTime?.unix())
        break
      case TokenType.V2LP:
        toLockV2Handle(value.title, value.tokenAddress, account || '', amoutAraw, value?.delayUnlockingTime?.unix())
        break
      // case IReleaseType.Fragment:
      //   const releaseTimeAndRadio = value?.fragmentReleaseTimes
      //     .sort((a, b) => {
      //       if (a.startAt === null || b.startAt === null) {
      //         if (a.startAt === null && b.startAt === null) {
      //           return 0
      //         } else if (a.startAt === null) {
      //           return 1
      //         } else {
      //           return -1
      //         }
      //       }
      //       return a.startAt.diff(b.startAt)
      //     })
      //     .map(item => {
      //       return [item?.startAt?.unix() + '', BigNumber(item.radio).times('0.01').times(1e18).toString()]
      //     })
      //   toTimeStagelockHandle(
      //     value.title,
      //     value.tokenAddress,
      //     account || '',
      //     amoutAraw,
      //     releaseTimeAndRadio
      //   )
      //   break
      // case IReleaseType.Linear:
      //   toLockLinearHandle(
      //     value.title,
      //     value.tokenAddress,
      //     account || '',
      //     value.linearUnlockingStartTime?.unix() || 0,
      //     value.linearUnlockingEndTime?.diff(value.linearUnlockingStartTime, 'seconds') + '', // duration, endTime - startTime
      //     amoutAraw
      //   )
      // break
    }
    try {
    } catch (error) {}
  }

  const erc20TokenDeatail = useErc20TokenDetail(checkToken?.address || '', chainId, releaseType)
  const { token0Address, token1Address } = useGetPairToken(checkToken?.address || '')
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const isCurrentChainEqualChainOfPool = useMemo(() => {
    return Number(chainId) === Number(CurrenChainId)
  }, [chainId, CurrenChainId])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Start time', end: 'End time' }}>
      <Formik
        enableReinitialize
        initialValues={sellerValue}
        validationSchema={sellerValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, setFieldValue, handleSubmit }) => {
          console.log('🚀 ~ values:', values)
          setChainId(values.chainId)
          setReleaseType(Number(values.releaseType))

          return (
            <Form style={{ marginTop: 32 }} onSubmit={handleSubmit}>
              <Stack gap={32}>
                <SectionItem label={'Select token/LP'}>
                  <FormItem name={'tokenAddress'}>
                    <SelectToken
                      onSelect={(e, type) => {
                        tokenType.current = type
                      }}
                      checkToken={checkToken}
                      setCheckToken={setCheckToken}
                    />
                  </FormItem>
                </SectionItem>
                <Box>
                  <RowItem direction={isMd ? 'column' : 'row'} label={'Token name'}>
                    <Typography
                      fontFamily={'IBM Plex Sans'}
                      fontSize={16}
                      fontWeight={400}
                      lineHeight={1.4}
                      color={'var(--ps-text-100)'}
                    >
                      {erc20TokenDeatail?.tokenCurrency?.name || '--'}
                    </Typography>
                  </RowItem>
                  <RowItem direction={isMd ? 'column' : 'row'} label={'Token symbol'}>
                    <Typography
                      fontFamily={'IBM Plex Sans'}
                      fontSize={16}
                      fontWeight={400}
                      lineHeight={1.4}
                      color={'var(--ps-text-100)'}
                    >
                      {token0
                        ? `${token0?.symbol} / ${token1?.symbol}`
                        : erc20TokenDeatail?.tokenCurrency?.symbol || '--'}
                    </Typography>
                  </RowItem>
                  <RowItem direction={isMd ? 'column' : 'row'} label={'Token decimal'}>
                    <Typography
                      fontFamily={'IBM Plex Sans'}
                      fontSize={16}
                      fontWeight={400}
                      lineHeight={1.4}
                      color={'var(--ps-text-100)'}
                    >
                      {erc20TokenDeatail?.tokenCurrency?.decimals || '--'}
                    </Typography>
                  </RowItem>
                  <RowItem direction={isMd ? 'column' : 'row'} hasBorderBottom={false} label={'Balance'}>
                    <Typography
                      fontFamily={'IBM Plex Sans'}
                      fontSize={16}
                      fontWeight={400}
                      lineHeight={1.4}
                      color={'var(--ps-text-100)'}
                    >
                      {erc20TokenDeatail?.balance?.toSignificant() || '--'}
                    </Typography>
                  </RowItem>
                </Box>
                <SectionItem label={'Title'}>
                  <FormItem name={'title'}>
                    <CusOutLineInput value={values.title} placeholder={'Please enter locker title'} />
                  </FormItem>
                </SectionItem>

                <SectionItem label={'Amount'}>
                  <FormItem name={'amount'}>
                    <Box sx={{ position: 'relative' }}>
                      <CusOutLineInput
                        type="number"
                        onChange={e => {
                          const value = e.target.value
                          // let filtered = value.replace(/[^0-9.]/g, '').replace(/(\.\d{8})[\d.]+/g, '$1')
                          // if (filtered.startsWith('.')) {
                          //   filtered = '0' + filtered
                          // }
                          // const decimalIndex = filtered.indexOf('.')
                          // if (decimalIndex !== -1) {
                          //   filtered =
                          //     filtered.slice(0, decimalIndex + 1) + filtered.slice(decimalIndex + 1).replace(/\./g, '')
                          // }
                          // if (
                          //   erc20TokenDeatail &&
                          //   erc20TokenDeatail.balance &&
                          //   Number(filtered) > Number(erc20TokenDeatail.balance.toExact())
                          // ) {
                          //   filtered = erc20TokenDeatail.balance.toExact()
                          // }
                          setFieldValue('amount', value)
                        }}
                        value={values.amount}
                        placeholder={'Please enter amount'}
                      />
                      <Button
                        sx={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          borderRadius: 4,
                          height: 29,
                          width: 55
                        }}
                        variant="contained"
                        onClick={() => {
                          setFieldValue('amount', erc20TokenDeatail.max)
                        }}
                      >
                        Max
                      </Button>
                    </Box>
                  </FormItem>
                </SectionItem>

                {/* <SectionItem label={'Locking model'}>
                  <Field component={RadioGroupFormItem} row name="releaseType">
                    <FormControlLabel value={IReleaseType.Cliff} control={<Radio />} label="Normal" />
                    <FormControlLabel value={IReleaseType.Linear} control={<Radio />} label="Linear" />
                    <FormControlLabel value={IReleaseType.Fragment} control={<Radio />} label="Stage" />
                  </Field>
                </SectionItem> */}

                {Number(values.releaseType) === IReleaseType.Cliff && (
                  <SectionItem label={'Lock until(UTC time)'}>
                    <FormItem name="delayUnlockingTime" fieldType="custom">
                      <BasicDateTimePicker
                        value={values.delayUnlockingTime}
                        minDateTime={dayjs()}
                        onChange={v => {
                          setFieldValue('delayUnlockingTime', v)
                        }}
                      />
                    </FormItem>
                  </SectionItem>
                )}

                {/* {Number(values.releaseType) === IReleaseType.Linear && (
                  <Stack flexDirection={'row'} gap={10}>
                    <SectionItem label="Start Date">
                      <FormItem name="linearUnlockingStartTime" fieldType="custom">
                        <BasicDateTimePicker
                          value={values.linearUnlockingStartTime || undefined}
                          minDateTime={dayjs()}
                          maxDateTime={values.linearUnlockingEndTime || undefined}
                          onChange={v => {
                            setFieldValue('linearUnlockingStartTime', v)
                          }}
                        />
                      </FormItem>
                    </SectionItem>

                    <SectionItem label="End Date">
                      <FormItem name="linearUnlockingEndTime" fieldType="custom">
                        <BasicDateTimePicker
                          value={values.linearUnlockingEndTime || undefined}
                          minDateTime={values.linearUnlockingStartTime || undefined}
                          onChange={v => {
                            setFieldValue('linearUnlockingEndTime', v)
                          }}
                        />
                      </FormItem>
                    </SectionItem>
                  </Stack>
                )} */}

                {/* {Number(values.releaseType) === IReleaseType.Fragment && (
                  <SetFragmentReleaseTime
                    minDateTime={dayjs()}
                    errors={errors.fragmentReleaseTimes}
                    sizeError={errors.fragmentReleaseSize}
                    releaseTimes={values.fragmentReleaseTimes}
                    setFragmentReleaseTimes={(val: IFragmentReleaseTimes[]) =>
                      setFieldValue('fragmentReleaseTimes', val)
                    }
                  />
                )} */}
              </Stack>
              {!account && <ConnectWalletButton />}
              {account && !isCurrentChainEqualChainOfPool && <SwitchNetworkButton targetChain={values.chainId} />}
              {account && isCurrentChainEqualChainOfPool && (
                <BidBlock
                  formValues={values}
                  erc20TokenDeatail={erc20TokenDeatail}
                  errors={errors}
                  // loading={lockSubmitted.pending || timeStagelockSubmitted.pending || lockLinearSubmitted.pending}
                  loading={lockSubmitted.pending || lockLpV2Submitted.pending}
                  handleSubmit={() => {
                    handleSubmit()
                  }}
                />
              )}
            </Form>
          )
        }}
      </Formik>
    </LocalizationProvider>
  )
}

const BidBlock = ({
  formValues,
  erc20TokenDeatail,
  errors,
  handleSubmit,
  loading
}: {
  formValues: ISeller
  erc20TokenDeatail: TokenlockResponse
  errors: FormikErrors<ISeller>
  handleSubmit: () => void
  loading: boolean
}) => {
  const isMd = useBreakpoint('md')
  const lockAmount = useMemo(() => {
    return erc20TokenDeatail?.tokenCurrency && formValues.amount
      ? CurrencyAmount.fromAmount(erc20TokenDeatail?.tokenCurrency, formValues.amount)
      : undefined
  }, [erc20TokenDeatail?.tokenCurrency, formValues.amount])

  const contractAddress = useMemo(() => {
    return Number(formValues.releaseType) === IReleaseType.Linear
      ? TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES[formValues.chainId]
      : TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES[formValues.chainId]
  }, [formValues.chainId, formValues.releaseType])
  const [approvalState, approveACallback] = useApproveCallback(lockAmount, contractAddress, true)
  // console.log('🚀 ~ contractAddress ~ contractAddress:', contractAddress, approvalState)

  const approveBtn: {
    disabled?: boolean
    loading?: boolean
    text?: string
    run?: () => void
  } = useMemo(() => {
    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return {
          text: `Approving use of ${erc20TokenDeatail?.tokenCurrency?.symbol} ...`,
          loading: true
        }
      }
      if (approvalState === ApprovalState.UNKNOWN) {
        return {
          text: 'Loading...',
          loading: true
        }
      }
      if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          text: `Approve use of ${erc20TokenDeatail?.tokenCurrency?.symbol}`,
          run: approveACallback
        }
      }
    }
    return {
      run: approveACallback
    }
  }, [approvalState, approveACallback, erc20TokenDeatail?.tokenCurrency?.symbol])

  return (
    <FormLayout
      childForm={
        <Stack gap={'32px'} mt={'24px'}>
          <Grid container spacing={{ xs: 10, xl: 18 }} justifyContent={'center'}>
            {!!lockAmount && approvalState !== ApprovalState.APPROVED && (
              <Grid item xs={6}>
                <CusLineLoadingButton
                  sx={{
                    width: '100%',
                    fontSize: isMd ? 13 : 15
                  }}
                  loadingPosition="start"
                  variant="outlined"
                  loading={approveBtn.loading}
                  onClick={() => {
                    approveBtn.run && approveBtn.run()
                  }}
                >
                  {approveBtn.text}
                </CusLineLoadingButton>
              </Grid>
            )}

            <Grid item xs={6}>
              <LoadingButton
                variant="contained"
                loading={loading}
                sx={{
                  width: '100%'
                }}
                disabled={approvalState !== ApprovalState.APPROVED || JSON.stringify(errors) !== '{}'}
                onClick={() => {
                  handleSubmit && handleSubmit()
                }}
              >
                Lock
              </LoadingButton>
            </Grid>
          </Grid>
        </Stack>
      }
    />
  )
}

export const FormLayout = ({
  title1,
  childForm,
  isShowByChecked,
  checkedHandle,
  description
}: {
  title1?: string | React.ReactNode
  isShowByChecked?: boolean
  checkedHandle?: (value: boolean) => void
  childForm: React.ReactElement
  description?: string
}) => {
  const [show, setShow] = useState(!isShowByChecked)
  return (
    <Stack sx={{ flexDirection: 'column', marginBottom: '0px' }}>
      <Stack mb={'12px'} sx={{ flexDirection: 'row' }} justifyContent={'flex-start'} alignItems={'center'} gap={'16px'}>
        {title1 && typeof title1 === 'string' ? (
          <Title sx={{ color: '#20201E', fontSize: 20, lineHeight: '28px' }}>{title1}</Title>
        ) : (
          title1
        )}
        {isShowByChecked && (
          <IOSSwitch
            onChange={() => {
              setShow(!show)
              checkedHandle && checkedHandle(!show)
            }}
            sx={{ m: 1 }}
            defaultChecked={false}
          />
        )}
      </Stack>
      {show && childForm}
      {show && description && (
        <Typography
          fontFamily={'IBM Plex Sans'}
          sx={{ marginTop: '8px', fontFamily: `'Inter'`, fontSize: '12px', textAlign: 'left', color: '#959595' }}
        >
          {description}
        </Typography>
      )}
    </Stack>
  )
}

export default TokenLockerForm
