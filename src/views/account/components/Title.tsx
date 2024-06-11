import { Box, Typography } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { ReactNode } from 'react'
interface TitleProps {
  value: string
  children?: ReactNode
}
const Title = ({ value, children }: TitleProps) => {
  const isMd = useBreakpoint('md')
  const isLg = useBreakpoint('lg')
  return (
    <Box
      display={'flex'}
      flexDirection={isMd ? 'column' : 'row'}
      justifyContent={isMd ? 'start' : 'space-between'}
      alignItems={isMd ? 'start' : 'center'}
      gap={isMd ? 16 : 0}
      ml={isLg ? 10 : 0}
    >
      <Typography fontSize={'40px'} color={'--ps-text-100'} fontWeight={600} lineHeight={'140%'}>
        {value}
      </Typography>
      <Box sx={{ width: isMd ? '100%' : undefined }}>{children}</Box>
    </Box>
  )
}
export default Title
