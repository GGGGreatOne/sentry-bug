import BasicDateTimePicker from 'components/DatePicker/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { Field, FieldProps, useFormikContext } from 'formik'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import FormItem from 'components/FormItem'
import { Box, FormHelperText } from '@mui/material'
import AccessTimeIcon from 'plugins/auction/assets/svg/access-time.svg'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
interface Props {
  name: string
  minTime?: Dayjs
  maxTime?: Dayjs
  canEqMaxTime?: boolean
}

const nullValErr: Record<string, string> = {
  startTime: 'starting date',
  endTime: 'closure date',
  delayUnlockingTime: 'unlock date'
}
const FormTimePicker = ({ name, minTime, maxTime, canEqMaxTime = false }: Props) => {
  const { values, touched, submitCount } = useFormikContext<any>()
  const errRef = useRef<string | undefined>()
  const selectTime = useRef<Dayjs | null>()
  const validate = useCallback(() => {
    // why can't use formik validate value?
    // this value is err
    const value = selectTime.current
    if (!value) {
      return `please select a ${nullValErr[name] || name}`
    }
    if (!minTime && value.unix() <= dayjs().unix()) {
      return `Please select a time in the future`
    }
    if (minTime && value.unix() === minTime.unix() && !canEqMaxTime) {
      return `Please select a time earlier than ${minTime.format('MM/DD/YYYY hh:mm A')}`
    }
    if (minTime && value.unix() < minTime.unix()) {
      return `Please select a time earlier than ${minTime.format('MM/DD/YYYY hh:mm A')}`
    }
    if (maxTime && value.unix() > maxTime.unix()) {
      return `Please select a time later ${maxTime.format('MM/DD/YYYY hh:mm A')}`
    }
    return undefined
  }, [canEqMaxTime, maxTime, minTime, name])

  // When minTime and maxTime change, manually trigger verification
  const manualValidate = useCallback(() => {
    selectTime.current = values[name]
    const err = validate()
    // Use ref to receive errors
    // Because the values in the validate function are sometimes not synchronized
    errRef.current = err
  }, [name, validate, values])

  useEffect(() => {
    manualValidate()
  }, [manualValidate])

  const isShowError = useMemo(() => touched[name] || submitCount > 0, [name, submitCount, touched])
  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          // height: 44,
          color: '#85878C',
          border: '1px solid rgba(230, 230, 206, 0.20)',
          borderRadius: 0
        },
        '& .MuiFormControl-root': {
          border: 'none'
        }
      }}
    >
      <FormItem
        fieldType="custom"
        // name={name}
        sx={{
          '& .MuiFormLabel-root': {
            '&.Mui-focused': {
              color: '#85878C'
            }
          }
        }}
      >
        <Field validate={validate} name={name}>
          {({ field, form: { setFieldValue, setFieldTouched } }: FieldProps) => {
            return (
              <>
                <BasicDateTimePicker
                  value={field.value || null}
                  onChange={(value: Dayjs | null) => {
                    selectTime.current = value
                    setFieldValue(name, value, true)
                    setFieldTouched(name, true, true)
                  }}
                  onClose={() => {
                    setFieldTouched(name, true, true)
                  }}
                  maxDateTime={maxTime}
                  minDateTime={minTime || dayjs()}
                  components={{ OpenPickerIcon: AccessTimeIcon }}
                />
                {!!errRef.current && isShowError && (
                  <FormHelperText sx={{ color: '#FA0E0E' }}>{errRef.current}</FormHelperText>
                )}
              </>
            )
          }}
        </Field>
      </FormItem>
    </Box>
  )
}
export default FormTimePicker
