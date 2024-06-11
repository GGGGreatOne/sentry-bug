import { Field, Formik } from 'formik'
import { Box, FormControlLabel, FormHelperText, OutlinedInput, Radio, Stack, styled, Typography } from '@mui/material'

import { useCreateParams } from 'plugins/auction/pages/erc20-create-pool/provider'
import RadioGroupFormItem from './components/RadioGroupFormItem'
import { ParticipantStatus } from 'plugins/auction/plugins/fixed-price/constants/type'
import FormItem from 'components/FormItem'
import * as yup from 'yup'
import {
  ICreatePoolParams,
  ICreatePoolSettings,
  ProviderDispatchActionType
} from 'plugins/auction/pages/erc20-create-pool/type'
import auctionDialogControl from './modal'
import { CancelBtnStyle, NextBtnStyle } from './components/createSubmitBtn'
import { isAddress } from 'utils'
import { useAuthorized } from 'plugins/auction/pages/erc20-create-pool/hooks'
import { toast } from 'react-toastify'
import { formatInput } from 'plugins/auction/plugins/fixed-price/constants/utils'
import CheckIcon from 'plugins/auction/assets/svg/check_#6e.svg'
import NotCheckIcon from 'plugins/auction/assets/svg/no_check.svg'
import { BaseBox } from './comps'
import FormNumberInput from '../FormNumberInput'
const FormControlLabelStyle = styled(FormControlLabel)`
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
export const InputNumericalStyle = styled(FormNumberInput)`
  &.MuiInputBase-root,
  &.uiInputBase-root.Mui-focused {
    border-radius: 0px;
    border: 1px solid rgba(255, 255, 229, 0.2) !important;
    background: #1c1c19;
    color: rgba(255, 255, 229, 0.6);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
    letter-spacing: -0.32px;
  }
`
const Title = styled(Typography)`
  color: rgba(255, 255, 229, 0.8);
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.4px;
  text-transform: capitalize;
`
const SubTitle = styled(Typography)`
  color: #898679;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`
const validationSchema = yup.object({
  whiteListAddress: yup.string().when('participantStatus', {
    is: ParticipantStatus.Whitelist,
    then: yup
      .string()
      .required('Whitelist cannot be empty')
      .test('VALID_ADDRESS_ARRAY', 'Please make sure all addresses are valid', addressInput => {
        return (
          !addressInput ||
          addressInput
            .trim()
            .split(/[\n,]/g)
            .filter(Boolean)
            .map(i => i.trim())
            .every(input => isAddress(input))
        )
      })
      .test({
        name: 'DIFFERENT_ADDRESSES',
        test: (addressInput, ctx) => {
          if (!addressInput) return true
          const ads = addressInput.split(/[\n,]/g).filter(Boolean)
          for (const item of ads) {
            if (ads.filter(i => item.toLowerCase() === i.toLowerCase()).length > 1) {
              return ctx.createError({ message: `Address Repeat: ${item}` })
            }
          }
          return true
        }
      })
  }),
  whitelistWithAmount: yup
    .string()
    .test(
      'NOT_EMPTY_AMOUNT_ARRAY',
      'whitelistWithAmount cannot be empty',
      (inputValue, context) =>
        context.parent.participantStatus !== ParticipantStatus.WhitelistWithAmount ||
        formatInput(inputValue || '')[2].length > 0
    ),
  clubShare: yup
    .string()
    .required('Raised Fund Share cannot be empty')
    .test(
      'clubShare_LESS_THAN_100',
      'Raised Fund Share must be greater than or equal to 0 and less than or equal to 100',
      value => Number(value) >= 0 && Number(value) <= 100
    )
})

const ParticipantSettings = () => {
  const { dispatch, state } = useCreateParams()
  const { importWhitelist, setBasicInfo } = useAuthorized()
  const initWhitelist = state.settings.whiteListAddress?.join('\n') || ''
  const handleSetValue = (values: ICreatePoolSettings) => {
    const curWhitelist = values.whiteListAddress as string | undefined
    const whitelist =
      values.participantStatus === ParticipantStatus.Whitelist && !!curWhitelist
        ? curWhitelist
            ?.trim()
            .split(/[\n,]/g)
            .filter(Boolean)
            .map(i => i.trim())
        : []
    const _state = { ...state, settings: { ...values, whiteListAddress: whitelist } } as ICreatePoolParams
    return { ..._state }
  }
  const handleSubmit = (values: ICreatePoolSettings) => {
    const _state = handleSetValue(values)
    dispatch?.({ type: ProviderDispatchActionType.setSettingValue, payload: { settingValue: _state.settings } })
    if (values.participantStatus === ParticipantStatus.Public) {
      setBasicInfo
        .runAsync(_state)
        .then(auth => {
          auctionDialogControl.show('Erc20CreatePoolConfirm', { dispatch, state: { ..._state, auth } })
        })
        .catch((err: any) => {
          toast.error(err)
        })
    } else if (
      values.participantStatus === ParticipantStatus.Whitelist ||
      values.participantStatus === ParticipantStatus.WhitelistWithAmount
    ) {
      importWhitelist
        .runAsync(_state)
        .then(auth => {
          auctionDialogControl.show('Erc20CreatePoolConfirm', { dispatch, state: { ..._state, auth } })
        })
        .catch((err: any) => {
          toast.error(err)
        })
    }
  }
  const handleCancel = () => {
    dispatch?.({ type: ProviderDispatchActionType.prevActive, payload: null })
  }
  const openImportWhiteWithAmountDialog = (curValue: string, setFieldValue: (filed: string, value: string) => void) => {
    auctionDialogControl.show('ImportWhitelistWithAmountDialog', {
      whitelistWithAmount: curValue,
      onSubmit(value: string) {
        setFieldValue('whitelistWithAmount', value)
      }
    })
  }
  return (
    <Box>
      <Formik
        initialValues={{ ...state.settings, whiteListAddress: initWhitelist as any }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setFieldValue, errors }) => {
          return (
            <Box component={'form'} onSubmit={handleSubmit}>
              <BaseBox>
                <Typography
                  sx={{
                    color: ' #FFFFE5',
                    fontSize: 28,
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '140%',
                    'letter-spacing': -0.4,
                    textTransform: 'capitalize'
                  }}
                >
                  Distribution Setting
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 600, color: 'rgba(255, 255, 229, 0.80)' }}>
                    Participation Limitation
                  </Typography>
                  <Field component={RadioGroupFormItem} row sx={{ mt: 10 }} name="participantStatus">
                    <Stack sx={{ gap: 15 }} flexDirection={'row'}>
                      <FormControlLabelStyle
                        value={ParticipantStatus.Public}
                        control={<Radio disableRipple checkedIcon={<CheckIcon />} icon={<NotCheckIcon />} />}
                        label="Public"
                      />
                      <FormControlLabelStyle
                        value={ParticipantStatus.Whitelist}
                        control={<Radio disableRipple checkedIcon={<CheckIcon />} icon={<NotCheckIcon />} />}
                        label="Whitelist"
                      />
                      {/* TODO: contract err => not in whitelist  */}
                      {/* <FormControlLabelStyle
                    value={ParticipantStatus.WhitelistWithAmount}
                    control={<Radio disableRipple />}
                    label="Whitelist with amount"
                  /> */}
                    </Stack>
                  </Field>

                  {values.participantStatus === ParticipantStatus.Whitelist && (
                    <Box>
                      <FormItem name="whiteListAddress" fieldType="custom">
                        <OutlinedInput
                          value={values.whiteListAddress}
                          onChange={e => {
                            const _v = e.target.value
                            // .trim().split(/[\n,]/g)
                            setFieldValue('whiteListAddress', _v)
                          }}
                          placeholder="Enter addresses"
                          sx={{
                            mt: 16,
                            pt: '14px !important',
                            pb: '20px !important',
                            borderRadius: 8,
                            color: 'rgba(230, 230, 206, 0.60)',
                            fontFamily: '"Public Sans"',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '150%',
                            letterSpacing: '-0.32px',
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: '1px solid rgba(230, 230, 206, 0.20)',
                              borderColor: 'rgba(230, 230, 206, 0.20) !important'
                            }
                          }}
                          minRows={4}
                          maxRows={14}
                          multiline
                          fullWidth
                        />
                      </FormItem>
                      {errors['whiteListAddress'] && (
                        <FormHelperText sx={{ color: '#FA0E0E' }}>{errors['whiteListAddress']}</FormHelperText>
                      )}
                    </Box>
                  )}
                  {values.participantStatus === ParticipantStatus.WhitelistWithAmount && (
                    <Box>
                      <SubTitle
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => openImportWhiteWithAmountDialog(values.whitelistWithAmount || '', setFieldValue)}
                      >
                        Import Whitelist and Amount
                      </SubTitle>
                      {errors['whitelistWithAmount'] && (
                        <FormHelperText sx={{ color: '#FA0E0E' }}>{errors['whitelistWithAmount']}</FormHelperText>
                      )}
                    </Box>
                  )}
                </Box>
                <Stack sx={{ gap: 20 }}>
                  <Title>Raised Fund Sharing</Title>
                  <SubTitle>
                    If your auction is held in other Clubs, they can receive a share of the sales generated in their
                    Club. You can set the percentage here.
                  </SubTitle>
                  <InputNumericalStyle
                    value={values.clubShare}
                    placeholder="0-100"
                    endAdornment={<Typography>%</Typography>}
                    onChange={e => {
                      setFieldValue('clubShare', e.target.value)
                    }}
                    onBlur={e => {
                      !Number(e.target.value) && setFieldValue('clubShare', 0)
                    }}
                  />
                  {errors['clubShare'] && (
                    <FormHelperText sx={{ color: '#FA0E0E' }}>{errors['clubShare']}</FormHelperText>
                  )}
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

export default ParticipantSettings
