import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import utc from 'dayjs/plugin/utc'
import AccessTimeIcon from 'plugins/auction/assets/svg/access-time.svg'
dayjs.extend(utc)
export default function BasicDateTimePicker({
  value,
  onChange,
  minDateTime,
  maxDateTime,
  ...props
}: DateTimePickerProps<Dayjs>) {
  //Tip: Time is displayed in UTC timezone
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        sx={{
          width: '100%',
          borderRadius: 8,
          border: '1px solid var(--ps-gray-03, #959595)',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiOutlinedInput-root': {
            height: 56,
            color: 'var(--ps-gray-03, #959595)',
            '&>input.MuiOutlinedInput-input': {
              paddingBottom: '18px !important'
            }
          },
          '& .MuiInputAdornment-root .MuiButtonBase-root': {
            color: '#000'
          }
        }}
        //false:  show 24 hours
        // true: use 12 hours  AM PM
        ampm
        value={value}
        timezone="UTC"
        onChange={onChange}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        components={{ OpenPickerIcon: AccessTimeIcon }}
        // label="Start Date"
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
          seconds: renderTimeViewClock
        }}
        {...props}
      />
    </LocalizationProvider>
  )
}
