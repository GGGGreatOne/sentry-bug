import { Box, FormControlLabel as MuiFormControlLabel, Radio, Stack, Typography, styled } from '@mui/material'
import { Field, Formik } from 'formik'
import FormItem from 'components/FormItem'
import { AllocationStatus, AuctionType, IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'

import { useCreateParams } from 'plugins/auction/pages/erc20-create-pool/provider'
import { BaseBox, FormLayout, Title } from 'plugins/auction/components/create-pool/comps'
import RadioGroupFormItem from 'plugins/auction/components/create-pool/components/RadioGroupFormItem'
import FormSelectAuctionType from 'plugins/auction/components/create-pool/components/FormSelectAuctionType'
import FormSelectToken from 'plugins/auction/components/create-pool/components/FormSelectToken'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ICreateFixedPricePool } from './createType'
import * as yup from 'yup'
import BigNumber from 'bignumber.js'
import FormInputAmount from 'plugins/auction/components/create-pool/components/FormInputAmount'
import FormTimePicker from 'plugins/auction/components/create-pool/components/FormTimePicker'
import { ProviderDispatchActionType } from 'plugins/auction/pages/erc20-create-pool/type'
import { CancelBtnStyle, NextBtnStyle } from 'plugins/auction/components/create-pool/components/createSubmitBtn'
import { viewControl } from 'views/editBox/modal'
import { ZERO_ADDRESS } from 'constants/index'
import { useUserInfo } from 'state/user/hooks'
import { useGetBoxDraftInfo } from 'state/boxes/hooks'
import CheckIcon from 'plugins/auction/assets/svg/check_#6e.svg'
import NotCheckIcon from 'plugins/auction/assets/svg/no_check.svg'
import FormNumberInput from 'plugins/auction/components/FormNumberInput'
const fixedPriceSchema = yup.object({
  amountTotal0: yup.mixed().required('Please select a token'),
  amountTotal1: yup
    .mixed()
    .required('Please select a token')
    .test(
      'Two tokens cannot be the same',
      'Two tokens cannot be the same',
      (curToken, ctx) => curToken?.address?.toLowerCase() !== ctx.parent.amountTotal0?.address?.toLowerCase()
    ),
  swapRatio: yup
    .string()
    .required('Swap ratio cannot be empty')
    // .typeError('Please input a valid number')
    .test('Swap Ratio must be greater than 0', 'Swap Ratio must be greater than 0', values => Number(values) > 0)
    .test('DIGITS_LESS_THAN_6', 'Should be no more than 6 digits after the decimal point', value => {
      const _value = new BigNumber(value || 0).toFixed()
      return !_value || !String(_value).includes('.') || String(_value).split('.')[1]?.length <= 6
    }),
  totalSupply: yup
    .string()
    .required('total supply cannot be empty')
    .test('totalSupply_LESS_THAN_6', 'total Supply must be greater than 0', value => Number(value) > 0),
  startTime: yup.mixed().required('Please select a starting date'),
  endTime: yup.mixed().required('Please select a closure date'),
  allocationPerWallet: yup
    .number()
    .when('allocationStatus', {
      is: AllocationStatus.Limited,
      then: yup
        .number()
        .required('Allocation limit cannot be empty')
        .test(
          'allocationPerWallet_GT_0',
          'Allocation limit must be greater than 0',
          value => !!Number(value) && Number(value) > 0
        )
    })
    .when('allocationStatus', {
      is: AllocationStatus.Limited,
      then: yup
        .number()
        .test(
          'GREATER_THAN_POOL_SIZE',
          'Allocation per wallet cannnot be greater than pool size times swap ratio',
          (value, context) => {
            return (
              !context.parent.amountTotal0 ||
              !context.parent.swapRatio ||
              (value || 0) <= context.parent.totalSupply * context.parent.swapRatio
            )
          }
        )
    }),
  delayUnlockingTime: yup.mixed().when('releaseType', {
    is: IReleaseType.Cliff,
    then: yup.mixed().required('Please select an unlock date')
  })
})

export const OutlinedInput = styled(FormNumberInput)`
  &.MuiInputBase-root {
    color: rgba(255, 255, 229, 0.4);
    background-color: transparent !important;
    border-color: rgba(255, 255, 229, 0.2) !important;
    border-radius: 0px !important;
    &.Mui-focused {
      border-color: rgba(255, 255, 229, 0.2) !important;
    }
  }
`
const FormControlLabel = styled(MuiFormControlLabel)`
  & .MuiFormControlLabel-label {
    color: #898679;
  }
  & .MuiButtonBase-root {
    color: #898679;
    &.Mui-checked {
      color: #ffffe5;
      & .MuiSvgIcon-root {
        color: var(--ps-neutral);
      }
    }
    &.Mui-checked ~ span {
      color: #ffffe5;
    }
  }
`

export default function Page() {
  const { dispatch, state } = useCreateParams()
  const _handleSubmit = (value: ICreateFixedPricePool) => {
    dispatch?.({
      type: ProviderDispatchActionType.setPoolValue,
      payload: { auctionType: AuctionType.FIXED_PRICE, poolValue: value }
    })
    dispatch?.({ type: ProviderDispatchActionType.nextActive, payload: null })
  }
  const handleCancel = () => {
    dispatch?.({ type: ProviderDispatchActionType.prevActive, payload: null })
  }
  const userInfo = useUserInfo()
  const { data: draftInfo } = useGetBoxDraftInfo(userInfo.box?.boxId || undefined)
  return (
    <Box>
      <Formik
        enableReinitialize
        validationSchema={fixedPriceSchema}
        initialValues={state.poolInfo as ICreateFixedPricePool}
        onSubmit={_handleSubmit}
      >
        {({ values, setFieldValue, errors, handleSubmit }) => {
          return (
            <Box component={'form'} onSubmit={handleSubmit}>
              <BaseBox>
                <Typography
                  sx={{
                    color: '#FFFFE5',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: '28px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '140%'
                  }}
                >
                  Auction Information
                </Typography>
                <FormSelectAuctionType
                  curAuctionType={values.auctionType}
                  onChange={v => {
                    setFieldValue('auctionType', v)
                  }}
                />
                <Box>
                  <FormSelectToken
                    errors={errors}
                    onChange={c => {
                      setFieldValue('amountTotal0', c)
                    }}
                    title="Select Selling Token"
                    curToken={values.amountTotal0}
                    name="amountTotal0"
                    shieldTokens={[ZERO_ADDRESS, 'wbb']}
                  />
                  <Typography
                    onClick={() => {
                      userInfo.box?.boxAddress &&
                        viewControl.show('TokenMinter', {
                          draftInfo: draftInfo,
                          boxAddress: userInfo.box?.boxAddress
                        })
                    }}
                    mt={16}
                    sx={{
                      cursor: 'pointer',
                      color: 'var(--blue-d, #CFB023)',
                      leadingTrim: 'both',
                      textEdge: 'cap',
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '150%',
                      textDecoration: 'underline'
                    }}
                  >
                    ＋ mint a new token
                  </Typography>
                </Box>

                <FormSelectToken
                  errors={errors}
                  onChange={c => {
                    setFieldValue('amountTotal1', c)
                  }}
                  title="Funding Currency"
                  curToken={values.amountTotal1}
                  name="amountTotal1"
                  shieldTokens={[values.amountTotal0]}
                />

                <FormLayout
                  title1="Swap Ratio"
                  childForm={
                    <Stack
                      flexDirection={'row'}
                      sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 15 }}
                    >
                      <Title sx={{ fontSize: 20, color: 'rgba(255, 255, 229, 0.80)', display: 'flex', gap: 5 }}>
                        1{' '}
                        <p
                          style={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {values.amountTotal0?.symbol || '--'}
                        </p>{' '}
                        =
                      </Title>
                      <FormItem placeholder="0.00" sx={{ flex: 1 }} name="swapRatio" fieldType="custom">
                        <OutlinedInput
                          value={`${values.swapRatio}`}
                          onChange={e => setFieldValue('swapRatio', e.target.value)}
                          onBlur={e => !Number(e.target.value) && setFieldValue('swapRatio', '0')}
                          endAdornment={
                            <Stack flexDirection={'row'} alignItems={'center'}>
                              <CurrencyLogo currencyOrAddress={values.amountTotal1} />
                              <Typography
                                sx={{
                                  ml: 8,
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {values.amountTotal1?.symbol}
                              </Typography>
                            </Stack>
                          }
                        />
                      </FormItem>
                    </Stack>
                  }
                />
                <FormLayout
                  title1="Total Supply"
                  childForm={<FormInputAmount name="totalSupply" tokenField="amountTotal0" />}
                />

                <Box>
                  <Title mb={5} sx={{ fontSize: 20, fontWeight: 500, color: 'rgba(255, 255, 229, 0.80)' }}>
                    Time
                  </Title>
                  <Typography sx={{ fontSize: 14, color: '#898679' }}>Time is displayed in UTC timezone</Typography>
                  <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ gap: 20 }} mt={15}>
                    <FormTimePicker name={'startTime'} maxTime={values['endTime']} />
                    <FormTimePicker name={'endTime'} minTime={values['startTime']} />
                  </Stack>
                </Box>
                <Box>
                  <Title>Allocation per Wallet</Title>
                  <Field component={RadioGroupFormItem} row sx={{ mt: 10 }} name="allocationStatus">
                    <FormControlLabel
                      value={AllocationStatus.NoLimits}
                      control={<Radio disableRipple checkedIcon={<CheckIcon />} icon={<NotCheckIcon />} />}
                      label="No Limits"
                    />
                    <FormControlLabel
                      value={AllocationStatus.Limited}
                      control={<Radio disableRipple checkedIcon={<CheckIcon />} icon={<NotCheckIcon />} />}
                      label="Limited"
                    />
                  </Field>
                  {values.allocationStatus === AllocationStatus.Limited && (
                    <Box mt={16}>
                      <FormItem name="allocationPerWallet">
                        <OutlinedInput
                          value={`${values.allocationPerWallet}`}
                          onChange={e => setFieldValue('allocationPerWallet', e.target.value)}
                          endAdornment={
                            <Stack flexDirection={'row'} alignItems={'center'}>
                              <CurrencyLogo currencyOrAddress={values.amountTotal1} />
                              <Typography sx={{ ml: 8 }}>{values.amountTotal1?.symbol}</Typography>
                            </Stack>
                          }
                        />
                      </FormItem>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Stack flexDirection={'row'} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Title sx={{ fontSize: 20, color: 'rgba(255, 255, 229, 0.80)' }}>Token Unlock</Title>
                  </Stack>
                  <Field component={RadioGroupFormItem} row sx={{ mt: 10 }} name="releaseType">
                    <FormControlLabel
                      value={IReleaseType.Instant}
                      control={<Radio disableRipple checkedIcon={<CheckIcon />} icon={<NotCheckIcon />} />}
                      label="Instant"
                    />
                    <FormControlLabel
                      value={IReleaseType.Cliff}
                      control={<Radio disableRipple checkedIcon={<CheckIcon />} icon={<NotCheckIcon />} />}
                      label="Delay"
                    />
                  </Field>
                  <Box mt={15}>
                    {Number(values.releaseType) === IReleaseType.Instant && (
                      <Title sx={{ fontSize: 14 }}>
                        The selling tokens will be unlocked and distributed immediately once the auction ends.
                      </Title>
                    )}
                    {Number(values.releaseType) === IReleaseType.Cliff && (
                      <Stack sx={{ gap: 15 }}>
                        <Title sx={{ fontSize: 14 }}>Specify a time to release the selling tokens.</Title>
                        <FormTimePicker name={'delayUnlockingTime'} minTime={values['endTime']} />
                      </Stack>
                    )}
                  </Box>
                </Box>
              </BaseBox>
              <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: 20 }} mt={20}>
                <CancelBtnStyle variant="outlined" onClick={handleCancel}>
                  Back
                </CancelBtnStyle>
                <NextBtnStyle variant="contained" type="submit">
                  Next
                </NextBtnStyle>
              </Stack>
            </Box>
          )
        }}
      </Formik>
    </Box>
  )
}
