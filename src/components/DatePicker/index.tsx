import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
interface Props {
  value: Dayjs | null
  onChange?: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  onClose?: () => void
  label?: string
  disabled?: boolean
  views?: Array<'day' | 'month' | 'year'>
  isMd?: boolean
}
//Tip: Time is displayed in UTC timezone
export default function MuiDatePicker(props: Props) {
  const { isMd, value, onChange, onClose, label = '', disabled = false, views = ['day', 'month', 'year'] } = props
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={views}
        label={label}
        onChange={onChange}
        onClose={onClose}
        timezone="UTC"
        value={value}
        minDate={dayjs('0100-01-01')}
        disabled={disabled}
        sx={{
          backgroundColor: '#0D0D0D',
          borderRadius: 4,
          height: isMd ? 40 : 50,
          '.MuiInputBase-root': {
            height: isMd ? 40 : 50,
            borderRadius: 4
          },
          '.MuiInputBase-input': {
            padding: isMd ? '7px 14px 7px 16px' : '13.5px 14px 13.5px 16px'
          },
          '.MuiOutlinedInput-notchedOutline': {
            top: 0
          }
        }}
      />
    </LocalizationProvider>
  )
}
