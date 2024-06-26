import { ReactNode } from 'react'
import { FieldProps, getIn } from 'formik'
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps
} from '@mui/x-date-pickers-pro'
import { TextField, TextFieldProps } from '@mui/material'
import { Dayjs } from 'dayjs'

interface DatePickerProps extends FieldProps, Omit<MuiDateTimePickerProps<Dayjs, Dayjs>, 'name' | 'value' | 'error'> {
  textField?: TextFieldProps
}

function createErrorHandler(
  fieldError: unknown,
  fieldName: string,
  setFieldError: (field: string, message?: string) => void
) {
  return (error?: ReactNode) => {
    if (error !== fieldError && error !== '') {
      setFieldError(fieldName, error ? String(error) : undefined)
    }
  }
}

function fieldToDatePicker({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: { onChange: _onChange, ...field },
  form: { isSubmitting, touched, errors, setFieldValue, setFieldError, setFieldTouched },
  textField: { helperText, onBlur, ...textField } = {},
  disabled,
  label,
  onChange,
  onError,
  renderInput,
  firstVery = false,
  ...props
}: DatePickerProps & { firstVery?: boolean }): MuiDateTimePickerProps<Dayjs, Dayjs> {
  const fieldError = getIn(errors, field.name)
  const showError = firstVery || (getIn(touched, field.name) && !!fieldError)

  return {
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    disableMaskedInput: true,
    renderInput:
      renderInput ??
      (params => (
        <TextField
          {...params}
          error={showError}
          helperText={showError ? fieldError : helperText}
          label={label}
          onBlur={
            onBlur ??
            function () {
              setFieldTouched(field.name, true, true)
            }
          }
          {...textField}
        />
      )),
    disabled: disabled ?? isSubmitting,
    onChange:
      onChange ??
      function (date) {
        setFieldTouched(field.name, true, false)
        setFieldValue(field.name, date, true)
      },
    onError: onError ?? createErrorHandler(fieldError, field.name, setFieldError),
    ...field,
    ...props
  }
}

function DateTimePickerFormItem({ children, ...props }: DatePickerProps & { firstVery?: boolean }) {
  return (
    <MuiDateTimePicker
      // open
      {...fieldToDatePicker(props)}
      DialogProps={{
        sx: {
          '& .MuiDialog-paper': {
            borderRadius: '16px !important'
          },
          '& .MuiButton-root': {
            color: 'var(--ps-text-100)'
          }
        }
      }}
      PaperProps={{
        sx: {
          '&': {
            borderRadius: '16px !important'
          }

          // '& .MuiClockPicker-root': {
          //   '&:after': {
          //     content: props.field.value ? `'${props.field.value?.format('hh:mm A')}'` : `''`,
          //     position: 'absolute',
          //     top: 22,
          //     left: 24,
          //     fontSize: 16,
          //     fontFamily: `'Sharp Grotesk DB Cyr Medium 22'`,
          //     fontWeight: 400
          //   },
          //   '& .MuiClock-root': {
          //     '& .MuiClock-clock': {
          //       mt: 64,
          //       mb: 36,
          //       bgcolor: 'var(--ps-neutral)',
          //       '& .MuiClock-pin': {
          //         bgcolor: '#171717'
          //       },
          //       '& .MuiClockPointer-root': {
          //         bgcolor: '#171717',
          //         '& .MuiClockPointer-thumb': {
          //           bgcolor: '#171717'
          //         }
          //       },
          //       '& .MuiClock-wrapper': {
          //         '& .Mui-selected': {
          //           color: '#FFFFFF',
          //           bgcolor: '#171717'
          //         }
          //       }
          //     },
          //     '& .MuiClock-amButton': {
          //       bottom: 24,
          //       width: 48,
          //       height: 32,
          //       borderRadius: 20,
          //       bgcolor: props.field.value?.hour() < 12 ? '#171717' : '#F7F8FB',
          //       '& .MuiTypography-root': {
          //         fontSize: 14,
          //         color: props.field.value?.hour() < 12 ? '#FFFFFF' : undefined
          //       }
          //     },
          //     '& .MuiClock-pmButton': {
          //       bottom: 24,
          //       width: 48,
          //       height: 32,
          //       borderRadius: 20,
          //       bgcolor: props.field.value?.hour() >= 12 ? '#171717' : '#F7F8FB',
          //       '& .MuiTypography-root': {
          //         fontSize: 14,
          //         color: props.field.value?.hour() >= 12 ? '#FFFFFF' : undefined
          //       }
          //     }
          //   }
          // }
        }
      }}
      dayOfWeekFormatter={day => day.slice(0, 2)}
    >
      {children}
    </MuiDateTimePicker>
  )
}

export default DateTimePickerFormItem
