import { AutoRow } from '../Row'
import { Typography } from '@mui/material'

interface PresetsButtonsProps {
  onSetFullRange: () => void
}

export default function PresetsButtons({ onSetFullRange }: PresetsButtonsProps) {
  return (
    <AutoRow gap="4px" width="auto">
      <Typography color={'#5A7FFF'} sx={{ cursor: 'pointer' }} data-testid="set-full-range" onClick={onSetFullRange}>
        Full range
      </Typography>
    </AutoRow>
  )
}
