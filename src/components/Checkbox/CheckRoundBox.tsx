import { Box } from '@mui/material'
import CheckedboxIcon from 'assets/svg/checkedbox-white-circle.svg'
import CheckboxIcon from 'assets/svg/checkbox-white-circle.svg'

export function CheckRoundBox({
  onChange,
  curryCheck,
  value
}: {
  onChange: () => void
  curryCheck: number
  value: number
}) {
  return (
    <Box
      onClick={onChange}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {value === curryCheck ? <CheckedboxIcon /> : <CheckboxIcon />}
    </Box>
  )
}
