import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material'
import CheckboxIcon from '../../assets/svg/checkbox.svg'
import CheckboxCheckedIcon from '../../assets/svg/checkbox_checked.svg'
import CheckboxIconLight from '../../assets/svg/checkbox_light.svg'
import CheckboxCheckedIconLight from '../../assets/svg/checkbox_light_checked.svg'
import { useUpdateThemeMode } from 'state/application/hooks'

interface Props {
  checked: boolean
  onChange?: (e: any) => void
  label?: string
  disabled?: boolean
  name?: string
}

export default function Checkbox(props: Props) {
  const { checked, onChange, label = '', disabled, name } = props
  const { mode } = useUpdateThemeMode()

  return (
    <FormControlLabel
      sx={{ margin: 0, fontSize: 16, fontWeight: 400, color: 'var(--ps-neutral3)' }}
      control={
        <MuiCheckbox
          sx={{ padding: 0, marginRight: '12px' }}
          icon={mode === 'dark' ? <CheckboxIcon /> : <CheckboxIconLight />}
          checkedIcon={mode === 'dark' ? <CheckboxCheckedIcon /> : <CheckboxCheckedIconLight />}
          name={name}
        />
      }
      label={label}
      labelPlacement="end"
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
  )
}
