import {
  Box,
  FormHelperText,
  FormControlLabel as MuiFormControlLabel,
  Radio,
  Stack,
  Typography,
  styled
} from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { Field, Formik } from 'formik'
import FormItem from 'components/FormItem'
import { AuctionType, IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useCreateParams } from 'plugins/auction/pages/erc20-create-pool/provider'
import { BaseBox, FormLayout, Title } from 'plugins/auction/components/create-pool/comps'
import RadioGroupFormItem from 'plugins/auction/components/create-pool/components/RadioGroupFormItem'
import FormSelectAuctionType from 'plugins/auction/components/create-pool/components/FormSelectAuctionType'
import FormSelectToken from 'plugins/auction/components/create-pool/components/FormSelectToken'
import { ICreateStakePool } from './createType'
import * as yup from 'yup'
import FormTimePicker from 'plugins/auction/components/create-pool/components/FormTimePicker'
import { ProviderDispatchActionType } from 'plugins/auction/pages/erc20-create-pool/type'
import { CancelBtnStyle, NextBtnStyle } from 'plugins/auction/components/create-pool/components/createSubmitBtn'
import FormInputAmount from 'plugins/auction/components/create-pool/components/FormInputAmount'
import auctionDialogControl from 'plugins/auction/components/create-pool/modal'
import { useAuthorized } from 'plugins/auction/pages/erc20-create-pool/hooks'
import { toast } from 'react-toastify'
import { InputNumericalStyle } from 'plugins/auction/components/create-pool/participantSettings'
import { ZERO_ADDRESS } from 'constants/index'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useUserInfo } from 'state/user/hooks'
import { useGetBoxDraftInfo } from 'state/boxes/hooks'
import { viewControl } from 'views/editBox/modal'
import CheckIcon from 'plugins/auction/assets/svg/check_#6e.svg'
import NotCheckIcon from 'plugins/auction/assets/svg/no_check.svg'
import FormNumberInput from 'plugins/auction/components/FormNumberInput'
const stakePoolSchema = yup.object({
  token0Currency: yup.mixed().required('Please select a token'),
  token1Currency: yup
    .mixed()
    .required('Please select a token')
    .test(
      'Two tokens cannot be the same',
      'Two tokens cannot be the same',
      (curToken, ctx) => curToken?.address?.toLowerCase() !== ctx.parent.token0Currency?.address?.toLowerCase()
    ),
  amountTotal0: yup
    .string()
    .required('Selling Token Amount cannot be empty')
    .test('amountTotal0_LESS_THAN_6', 'Selling Token Amount must be greater than 0', value => Number(value) > 0),
  amountTotal1: yup
    .string()
    .required('Funding Currency Amount cannot be empty')
    .test('amountTotal1_LESS_THAN_6', 'Funding Currency Amount must be greater than 0', value => Number(value) > 0),
  startTime: yup.mixed().required('Please select a starting date'),
  endTime: yup.mixed().required('Please select a closure date'),
  delayUnlockingTime: yup.mixed().when('releaseType', {
    is: IReleaseType.Cliff,
    then: yup.mixed().required('Please select an unlock date')
  }),
  clubShare: yup
    .string()
    .required('Raised Fund Share cannot be empty')
    .test(
      'Raised Fund Share_LESS_THAN_100',
      'Raised Fund Share must be greater than or equal to 0 and less than or equal to 100',
      value => Number(value) >= 0 && Number(value) <= 100
    )
})
const SubTitle = styled(Typography)`
  color: #898679;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`
export const OutlinedInput = styled(FormNumberInput)`
  &.MuiInputBase-root {
    color: rgba(255, 255, 229, 0.4);
    opacity: 0.7;
    background-color: transparent !important;
    border-color: rgba(255, 255, 229, 0.2) !important;
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
  const isSm = useBreakpoint('sm')
  const { dispatch, state } = useCreateParams()
  const { importWhitelist, setBasicInfo } = useAuthorized()
  const userInfo = useUserInfo()
  const { data: draftInfo } = useGetBoxDraftInfo(userInfo.box?.boxId || undefined)
  const handleSubmit = (value: ICreateStakePool) => {
    dispatch?.({
      type: ProviderDispatchActionType.setPoolValue,
      payload: { auctionType: AuctionType.STAKING_AUCTION, poolValue: value }
    })
    setBasicInfo
      .runAsync({ ...state, poolInfo: value })
      .then(auth => {
        auctionDialogControl.show('CreateErc20StakingConfirm', { state: { ...state, poolInfo: value, auth }, dispatch })
      })
      .catch(err => {
        toast.error(err)
      })
  }
  const handleCancel = () => {
    dispatch?.({ type: ProviderDispatchActionType.prevActive, payload: null })
  }
  return (
    <Box>
      <Formik
        enableReinitialize
        validationSchema={stakePoolSchema}
        initialValues={state.poolInfo as ICreateStakePool}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, handleSubmit }) => {
          return (
            <Box component={'form'} onSubmit={handleSubmit}>
              <BaseBox>
                <Title sx={{ color: '#FFFFE5', fontSize: 28 }}>Auction Information</Title>
                <Stack flexDirection={'column'} gap={isSm ? 16 : 32}>
                  <FormSelectAuctionType
                    curAuctionType={values.auctionType}
                    onChange={v => {
                      setFieldValue('auctionType', v)
                    }}
                  />
                  <Stack>
                    <FormSelectToken
                      errors={errors}
                      onChange={c => {
                        setFieldValue('token0Currency', c)
                      }}
                      title="Select Selling Token"
                      curToken={values.token0Currency}
                      name="token0Currency"
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
                  </Stack>

                  <FormSelectToken
                    errors={errors}
                    onChange={c => {
                      setFieldValue('token1Currency', c)
                    }}
                    title="Funding Currency"
                    curToken={values.token1Currency}
                    name="token1Currency"
                    shieldTokens={[values.token0Currency]}
                  />
                  <FormLayout
                    title1="Selling Token Amount"
                    childForm={<FormInputAmount name="amountTotal0" tokenField="token0Currency" />}
                  />

                  <FormLayout
                    title1="Funding Currency Amount"
                    childForm={
                      <FormItem name="amountTotal1">
                        <OutlinedInput
                          value={`${values.amountTotal1}`}
                          endAdornment={
                            <Stack flexDirection={'row'} alignItems={'center'}>
                              <CurrencyLogo currencyOrAddress={values.token1Currency} />
                              <Typography sx={{ ml: 8 }}>
                                {values.token1Currency?.symbol?.toLocaleUpperCase()}
                              </Typography>
                            </Stack>
                          }
                        />
                      </FormItem>
                    }
                  />
                  <Box>
                    <Title mb={5} sx={{ fontSize: 20, fontWeight: 500, color: 'rgba(255, 255, 229, 0.80)' }}>
                      Time
                    </Title>
                    <Typography sx={{ fontSize: 14, color: '#898679' }}>Time is displayed in UTC timezone</Typography>
                    <Stack flexDirection={'row'} justifyContent={'space-between'} sx={{ gap: 20, mt: 16 }}>
                      <FormTimePicker name={'startTime'} maxTime={values['endTime']} />
                      <FormTimePicker name={'endTime'} minTime={values['startTime']} />
                    </Stack>
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
                  <Stack sx={{ gap: 16 }}>
                    <Title>Raised Fund Sharing</Title>
                    <SubTitle>
                      If your auction is held in other Clubs, they can receive a share of the sales generated in their
                      Club. You can set the percentage here.
                    </SubTitle>
                    <InputNumericalStyle
                      value={`${values.clubShare}`}
                      placeholder="0-100"
                      onChange={e => {
                        setFieldValue('clubShare', e.target.value)
                      }}
                      onBlur={e => {
                        !Number(e.target.value) && setFieldValue('clubShare', 0)
                      }}
                      endAdornment={<Typography>%</Typography>}
                    />
                    {errors['clubShare'] && (
                      <FormHelperText sx={{ color: '#FA0E0E' }}>{errors['clubShare']}</FormHelperText>
                    )}
                  </Stack>
                </Stack>
              </BaseBox>
              <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{ gap: 20 }} mt={20}>
                <CancelBtnStyle variant="text" onClick={handleCancel}>
                  Back
                </CancelBtnStyle>
                <NextBtnStyle
                  type="submit"
                  variant="contained"
                  loading={setBasicInfo.loading || importWhitelist.loading}
                >
                  Submit
                </NextBtnStyle>
              </Stack>
            </Box>
          )
        }}
      </Formik>
    </Box>
  )
}
