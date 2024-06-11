import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import dayjs, { Dayjs } from 'dayjs'
import { Currency, CurrencyAmount } from 'constants/token'
import {
  // TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES,
  TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES
} from 'plugins/tokenToolBox/constants'
import { useEffect, useMemo, useState } from 'react'
import {
  useDeployUniswapV2Timelock
  // useDeployUniswapV3Timelock,
  // useGetExchangeList
} from 'plugins/tokenToolBox/hook/useTokenTimelock'
import { IReleaseType } from 'plugins/tokenToolBox/type'
import {
  TokenlockResponse,
  useErc20TokenDetail
  // useErc721TokenDetail
} from 'plugins/tokenToolBox/hook/useTokenLocakCallback'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import * as yup from 'yup'
import { isAddress } from 'utils'
import { Field, Form, Formik, FormikErrors } from 'formik'
import { FormLayout } from './tokenLockerForm'
import FormItem from 'components/FormItem'
import { Box, Button, Grid, Stack, Typography, styled } from '@mui/material'
import ConnectWalletButton from './ConnectWalletButton'
import DateTimePickerFormItem from './DateTimePickerFormItem'
import SwitchNetworkButton from './SwitchNetworkButton'
import { globalDialogControl } from 'components/Dialog'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { LoadingButton } from '@mui/lab'
// import { useNFTApproveAllCallback } from 'hooks/useNFTApproveAllCallback'
import { useUserInfo } from 'state/user/hooks'
import { RowItem, SectionItem } from './ComonComponents'
import SelectToken from './SelectToken'
import { CusOutLineInput } from './TokenMinter'
import { TokenType } from 'api/common/type'

export interface Token721lockResponse {
  isApprovedAll: any
  balance: string | undefined
}

export const Title = styled(Typography)`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  letter-spacing: -0.56px;
  text-transform: capitalize;
  text-align: left;
  color: #20201e;
`

const sellerValidationSchema = yup.object({
  tokenAddress: yup
    .string()
    .required('Token Address is a required')
    .test('is-address', 'Please input a valid token address', value => {
      return !!isAddress(value || '')
    }),
  // exchangeId: yup.string().required('Exchange is a required'),
  // anotherTokenAddress: yup
  //   .string()
  //   .test('is-address', 'Please input a valid address', function (value) {
  //     const anotherTokenChecked = this.parent.anotherTokenChecked
  //     if (anotherTokenChecked && !isAddress(value || '')) {
  //       return false
  //     }
  //     return true
  //   })
  //   .test('is-another-token', 'Token Address is a required', function (value) {
  //     const anotherTokenChecked = this.parent.anotherTokenChecked
  //     if (anotherTokenChecked && !value) {
  //       return false
  //     }
  //     return true
  //   }),
  title: yup.string().required('Title is a required'),
  amount: yup
    .number()
    .nullable(true)
    .when('version', {
      is: (val: any) => Number(val) === VersionType.v2,
      then: yup.number().typeError('Please input valid number').required('Amount is a required')
    }),
  delayUnlockingTime: yup
    .date()
    .nullable(true)
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
})

export enum VersionType {
  'v2' = 0,
  'v3' = 1
}

interface ISeller {
  tokenAddress: string
  chainId: SupportedChainId
  nftId?: number | string
  version: VersionType
  exchangeId: string
  tokanName: string
  tokenSymbol: string
  uniswapAddress: string
  tokenDecimal: number
  balance: string
  title: string
  amount: string
  delayUnlockingTime: Dayjs | null
  segmentAmount?: string
}

const V2BidBlock = ({
  formValues,
  erc20TokenDeatail,
  errors,
  handleSubmit
}: {
  formValues: ISeller
  erc20TokenDeatail: TokenlockResponse
  errors: FormikErrors<ISeller>
  handleSubmit: () => void
}) => {
  const { account } = useActiveWeb3React()
  const isNeedToApprove = useMemo(() => {
    return erc20TokenDeatail?.allowance && Number(formValues.amount) > Number(erc20TokenDeatail?.allowance?.toExact())
  }, [erc20TokenDeatail?.allowance, formValues.amount])
  const lockAmount = useMemo(() => {
    return erc20TokenDeatail?.tokenCurrency && formValues.amount
      ? CurrencyAmount.fromAmount(erc20TokenDeatail?.tokenCurrency, formValues.amount)
      : undefined
  }, [erc20TokenDeatail?.tokenCurrency, formValues.amount])
  const contractAddress = useMemo(() => {
    return TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES[formValues.chainId]
  }, [formValues.chainId])
  const [approvalState, approveACallback] = useApproveCallback(lockAmount, contractAddress, true)

  const approveBtn: {
    disabled?: boolean
    loading?: boolean
    text?: string
    run?: () => void
  } = useMemo(() => {
    if (!account) {
      return {
        text: 'Connect wallet',
        run: () => globalDialogControl.show('SignLoginDialog')
      }
    }
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
  }, [account, approvalState, approveACallback, erc20TokenDeatail?.tokenCurrency?.symbol])

  return (
    <FormLayout
      childForm={
        <Stack gap={'32px'} mt={'24px'}>
          <Grid container spacing={{ xs: 10, xl: 18 }} justifyContent={'center'}>
            {isNeedToApprove && (
              <Grid item xs={6}>
                <LoadingButton
                  sx={{
                    width: '100%'
                  }}
                  variant="outlined"
                  loading={approveBtn.loading}
                  onClick={() => {
                    approveBtn.run && approveBtn.run()
                  }}
                >
                  {approveBtn.text}
                </LoadingButton>
              </Grid>
            )}
            <Grid item xs={6}>
              <LoadingButton
                sx={{
                  width: '100%'
                }}
                variant="contained"
                disabled={isNeedToApprove || (JSON.stringify(errors) !== '{}' && !erc20TokenDeatail?.tokenCurrency)}
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

// const V3BidBlock = ({
//   formValues,
//   erc721TokenDeatail,
//   errors,
//   handleSubmit
// }: {
//   formValues: ISeller
//   erc721TokenDeatail: Token721lockResponse
//   errors: FormikErrors<ISeller>
//   handleSubmit: () => void
// }) => {
//   const isNeedToApprove = useMemo(() => {
//     return formValues.tokenAddress && !erc721TokenDeatail?.isApprovedAll
//   }, [erc721TokenDeatail?.isApprovedAll, formValues.tokenAddress])
//   const contractAddress = useMemo(() => {
//     return TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES[formValues.chainId]
//   }, [formValues.chainId])
//   const [approvalState, approveCallback] = useNFTApproveAllCallback(formValues?.tokenAddress, contractAddress)
//   const toApprove = useCallback(async () => {
//     try {
//       const { transactionReceipt } = await approveCallback()
//       const ret = new Promise((resolve, rpt) => {
//         rpt()
//         transactionReceipt.then(curReceipt => {
//           resolve(curReceipt)
//         })
//       })
//       ret.then(() => {}).catch()
//     } catch (error) {
//       const err: any = error
//       console.error(err)
//     }
//   }, [approveCallback])
//   const approveBtn: {
//     disabled?: boolean
//     loading?: boolean
//     text?: string
//     run?: () => void
//   } = useMemo(() => {
//     if (approvalState !== ApprovalState.APPROVED) {
//       if (approvalState === ApprovalState.PENDING) {
//         return {
//           text: `Approving use of NFT ...`,
//           loading: true
//         }
//       }
//       if (approvalState === ApprovalState.UNKNOWN) {
//         return {
//           text: 'Loading...',
//           loading: true
//         }
//       }
//       if (approvalState === ApprovalState.NOT_APPROVED) {
//         return {
//           text: `Approve use of NFT`,
//           run: toApprove
//         }
//       }
//     }
//     return {
//       run: toApprove
//     }
//   }, [approvalState, toApprove])

//   return (
//     <FormLayout
//       childForm={
//         <Stack gap={'32px'} mt={'24px'}>
//           <Grid container spacing={{ xs: 10, xl: 18 }} justifyContent={'center'}>
//             {isNeedToApprove && (
//               <Grid item xs={6}>
//                 <LoadingButton
//                   sx={{
//                     width: '100%',
//                     border: '1px solid #121212',
//                     '&:hover': {
//                       background: '#121212',
//                       color: '#fff'
//                     }
//                   }}
//                   loading={approveBtn.loading}
//                   onClick={() => {
//                     approveBtn.run && approveBtn.run()
//                   }}
//                 >
//                   {approveBtn.text}
//                 </LoadingButton>
//               </Grid>
//             )}
//             <Grid item xs={6}>
//               <LoadingButton
//                 sx={{
//                   width: '100%',
//                   background: '#121212',
//                   color: '#fff',
//                   '&:hover': {
//                     background: '#121212',
//                     color: '#fff'
//                   }
//                 }}
//                 disabled={isNeedToApprove || JSON.stringify(errors) !== '{}'}
//                 onClick={() => {
//                   handleSubmit && handleSubmit()
//                 }}
//               >
//                 Lock
//               </LoadingButton>
//             </Grid>
//           </Grid>
//         </Stack>
//       }
//     />
//   )
// }

const TokenLockerL2L3Form = ({
  chainId: propsChainId,
  token,
  tokenType,
  lockInfo
}: {
  chainId?: SupportedChainId
  token?: Currency
  tokenType: TokenType
  lockInfo?: LockInfo
}) => {
  const userInfo = useUserInfo()
  const { account, chainId: CurrenChainId } = useActiveWeb3React()
  // const router = useRouter()
  // const [version, setVersion] = useState<VersionType>(tokenType === TokenType.V2LP ? VersionType.v2 : VersionType.v3)
  const [chainId, setChainId] = useState<SupportedChainId>(
    Number(propsChainId ? propsChainId : CurrenChainId) as SupportedChainId
  )
  const [checkToken, setCheckToken] = useState<Currency | undefined>()

  useEffect(() => {
    if (!token) return
    setCheckToken(token)
  }, [token])

  const sellerValue: ISeller = useMemo(() => {
    return {
      tokenAddress: checkToken?.address || '',
      chainId: chainId,
      nftId: '',
      exchangeId: '',
      tokanName: '',
      tokenSymbol: '',
      uniswapAddress: '',
      version: VersionType.v2,
      tokenDecimal: 18,
      balance: '',
      title: '',
      amount: '',
      delayUnlockingTime: null,
      segmentAmount: ''
    }
  }, [chainId, checkToken?.address])

  useEffect(() => {
    if (tokenType) {
      const versionResult = tokenType === TokenType.V2LP ? VersionType.v2 : VersionType.v3
      // setVersion(versionResult)
      sellerValue.version = versionResult
    }
    return () => {}
  }, [sellerValue, tokenType])

  // const { data: exchangeList } = useGetExchangeList(CurrenChainId || 0, version === VersionType.v2 ? 2 : 3)
  const erc20TokenDeatail = useErc20TokenDetail(checkToken?.address || '', chainId, IReleaseType.Fragment)

  // const erc721TokenDetail = useErc721TokenDetail(checkToken?.address || '', chainId)

  const { toLockV2Handle } = useDeployUniswapV2Timelock(chainId, userInfo.box?.boxAddress)

  // const toLockV3Handle = useDeployUniswapV3Timelock(chainId, userInfo.box?.boxAddress)

  const onSubmit = async (value: ISeller) => {
    try {
      const amoutAraw = erc20TokenDeatail?.tokenCurrency
        ? CurrencyAmount.fromAmount(erc20TokenDeatail?.tokenCurrency, value.amount)
        : undefined
      const type = Number(value.version)
      // const resultItem = exchangeList?.find(item => Number(item.id) === Number(value.exchangeId))
      switch (type) {
        case VersionType.v2:
          toLockV2Handle(value.title, value.tokenAddress, account || '', amoutAraw, value?.delayUnlockingTime?.unix())
          break
        // case VersionType.v3:
        //   toLockV3Handle(
        //     resultItem?.uniswap || '',
        //     value.title,
        //     value.tokenAddress,
        //     value.nftId + '' || '',
        //     account || '',
        //     value?.delayUnlockingTime?.unix() + ''
        //   )
        //   break
      }
    } catch (e) {}
  }

  const isCurrentChainEqualChainOfPool = useMemo(() => {
    console.log('isCurrentChainEqualChainOfPool', chainId, CurrenChainId)

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
          setChainId(values.chainId)

          return (
            <Form onSubmit={handleSubmit}>
              <Stack gap={32}>
                {/* <FormItem>
                  <Stack my={20} direction={'row'} justifyContent={'flex-start'} flexWrap={'nowrap'} gap={'12px'}>
                    <Button
                      sx={{
                        width: '120px',
                        height: '44px',
                        border: '1px solid #E1F25C',
                        background: values.version === VersionType.v2 ? '#E1F25C' : '#fff',
                        color: values.version === VersionType.v2 ? '#121212' : '#959595'
                      }}
                      onClick={() => {
                        setFieldValue('version', VersionType.v2)
                        setVersion(VersionType.v2)
                      }}
                    >
                      V2
                    </Button>
                    <Button
                      sx={{
                        width: '120px',
                        height: '44px',
                        border: '1px solid #E1F25C',
                        background: values.version === VersionType.v3 ? '#E1F25C' : '#fff',
                        color: values.version === VersionType.v3 ? '#121212' : '#959595'
                      }}
                      onClick={() => {
                        setFieldValue('version', VersionType.v3)
                        setVersion(VersionType.v3)
                      }}
                    >
                      V3
                    </Button>
                  </Stack>
                </FormItem> */}
                <SectionItem label={'Select token'}>
                  <FormItem name={'tokenAddress'}>
                    <SelectToken checkToken={checkToken} setCheckToken={setCheckToken} />
                  </FormItem>
                </SectionItem>

                {/* {values.version === VersionType.v3 && (
                  <FormLayout
                    childForm={
                      <FormItem name={'nftId'}>
                        <ToolBoxInput
                          sx={{
                            color: '#121212'
                          }}
                          value={values.tokenAddress}
                          onChange={e => {
                            if (isAddress(e.target.value)) {
                              setFieldValue('nftId', e.target.value)
                            }
                          }}
                          placeholder={'NFT ID'}
                        />
                      </FormItem>
                    }
                  />
                )} */}

                {values.version === VersionType.v2 && (
                  <Box>
                    <RowItem label={'Token name'}>
                      <Typography fontSize={16} fontWeight={400} lineHeight={1.4} color={'var(--ps-text-100)'}>
                        {lockInfo?.name}
                      </Typography>
                    </RowItem>
                    <RowItem label={'Token symbol'}>
                      <Typography fontSize={16} fontWeight={400} lineHeight={1.4} color={'var(--ps-text-100)'}>
                        {erc20TokenDeatail?.tokenCurrency?.symbol || '--'}
                      </Typography>
                    </RowItem>
                    <RowItem label={'Token decimal'}>
                      <Typography fontSize={16} fontWeight={400} lineHeight={1.4} color={'var(--ps-text-100)'}>
                        {erc20TokenDeatail?.tokenCurrency?.decimals || '--'}
                      </Typography>
                    </RowItem>
                    <RowItem label={'Balance'}>
                      <Typography fontSize={16} fontWeight={400} lineHeight={1.4} color={'var(--ps-text-100)'}>
                        {erc20TokenDeatail?.balance?.toExact() || '--'}
                      </Typography>
                    </RowItem>
                  </Box>
                )}
                {/* {values.version === VersionType.v3 && (
                  <Box>
                    <RowItem label={'Balance'}>
                      <Typography fontSize={16} fontWeight={400} lineHeight={1.4} color={'var(--ps-text-100)'}>
                        {erc721TokenDetail?.balance || '--'}
                      </Typography>
                    </RowItem>
                    <RowItem label={'Approved All'} hasBorderBottom={false}>
                      <Typography fontSize={16} fontWeight={400} lineHeight={1.4} color={'var(--ps-text-100)'}>
                        {erc721TokenDetail?.isApprovedAll ? 'true' : 'false'}
                      </Typography>
                    </RowItem>
                  </Box>
                )} */}
                <SectionItem label={'Title'}>
                  <FormItem name={'title'}>
                    <CusOutLineInput value={values.title} placeholder={'Please enter locker title'} />
                  </FormItem>
                </SectionItem>

                {values.version === VersionType.v2 && (
                  <SectionItem label={'Amount'}>
                    <FormItem name={'amount'}>
                      <Box sx={{ position: 'relative' }}>
                        <CusOutLineInput
                          onChange={e => {
                            const value = e.target.value
                            let filtered = value.replace(/[^0-9.]/g, '').replace(/(\.\d{8})[\d.]+/g, '$1')
                            if (filtered.startsWith('.')) {
                              filtered = '0' + filtered
                            }
                            const decimalIndex = filtered.indexOf('.')
                            if (decimalIndex !== -1) {
                              filtered =
                                filtered.slice(0, decimalIndex + 1) +
                                filtered.slice(decimalIndex + 1).replace(/\./g, '')
                            }
                            if (
                              erc20TokenDeatail &&
                              erc20TokenDeatail.balance &&
                              Number(filtered) > Number(erc20TokenDeatail.balance.toExact())
                            ) {
                              filtered = erc20TokenDeatail.balance.toExact()
                            }
                            setFieldValue('amount', filtered)
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
                )}

                <SectionItem label={'Lock until(UTC time)'}>
                  <Field
                    component={DateTimePickerFormItem}
                    disablePast
                    name="delayUnlockingTime"
                    minDateTime={dayjs()}
                    textField={{
                      sx: {
                        fieldset: { borderRadius: 4 },
                        width: '100%',
                        '& input': {
                          height: 40,
                          padding: '0 16px'
                        }
                      }
                    }}
                  />
                </SectionItem>
              </Stack>
              {!account && <ConnectWalletButton />}
              {account && !isCurrentChainEqualChainOfPool && <SwitchNetworkButton targetChain={values.chainId} />}
              {account && isCurrentChainEqualChainOfPool && values.version === VersionType.v2 && (
                <V2BidBlock
                  formValues={values}
                  erc20TokenDeatail={erc20TokenDeatail}
                  errors={errors}
                  handleSubmit={() => {
                    handleSubmit()
                  }}
                />
              )}
              {/* {account && isCurrentChainEqualChainOfPool && values.version === VersionType.v3 && (
                <V3BidBlock
                  formValues={values}
                  erc721TokenDeatail={erc721TokenDetail}
                  errors={errors}
                  handleSubmit={() => {
                    handleSubmit()
                  }}
                />
              )} */}
            </Form>
          )
        }}
      </Formik>
    </LocalizationProvider>
  )
}
export default TokenLockerL2L3Form
