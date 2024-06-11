import { Stack, Tooltip, Typography } from '@mui/material'
import Icon from '../../../assets/svg/boxes/info.svg'

export default function ItemWithTooltip({ text, title }: { text: string; title: string }) {
  return (
    <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} spacing={6}>
      <Typography fontSize={14} color={'#FFFFFF99'}>
        {text}
      </Typography>
      <Tooltip title={<div>{title}</div>} arrow>
        <Stack>
          <Icon />
        </Stack>
      </Tooltip>
    </Stack>
  )
}
