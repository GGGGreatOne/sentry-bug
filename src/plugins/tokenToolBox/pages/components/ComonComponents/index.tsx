import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { ReactNode } from 'react'
import CopyIcon from 'assets/svg/boxes/copy.svg'
import { LoadingButton } from '@mui/lab'
import useBreakpoint from 'hooks/useBreakpoint'

export const LineCom = styled(Box)(() => ({
  width: '100%',
  height: '1px',
  background: 'var(--ps-text-10)',
  margin: '30px 0'
}))

export const StyledCopyIcon = styled(CopyIcon)(({}) => ({
  cursor: 'pointer',
  '& path': {
    fill: 'var(--ps-text-60)'
  }
}))

export const CusLineLoadingButton = styled(LoadingButton)`
  &.Mui-disabled {
    color: var(--ps-text-40);
  }
`

export const CusButton = styled(Button)`
  ${props => props.theme.breakpoints.down('md')} {
    height: 29px;
  }
`

export const SectionItem = ({
  label,
  children,
  rightItem
}: {
  children?: ReactNode
  rightItem?: ReactNode
  label: string
}) => {
  const idMd = useBreakpoint('md')
  return (
    <Stack width={'100%'}>
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Typography
          fontFamily={'IBM Plex Sans'}
          fontSize={idMd ? 15 : 20}
          fontWeight={500}
          lineHeight={1.3}
          color={'var(--ps-text-100)'}
        >
          {label}
        </Typography>
        <Box>{rightItem}</Box>
      </Stack>
      <Box mt={16}>{children}</Box>
    </Stack>
  )
}

export const RowItem = ({
  label,
  children,
  hasBorderBottom = true,
  direction = 'row'
}: {
  children?: ReactNode
  label: string
  hasBorderBottom?: boolean
  direction?: 'row' | 'column'
}) => {
  return (
    <Stack
      sx={{ borderBottom: hasBorderBottom ? '1px solid var(--ps-text-10)' : null }}
      py={15}
      flexDirection={direction}
      justifyContent={'space-between'}
      gap={direction === 'column' ? 16 : 0}
    >
      <Typography
        fontFamily={'IBM Plex Sans'}
        fontSize={16}
        fontWeight={400}
        lineHeight={1.4}
        color={'var(--ps-grey-03)'}
      >
        {label}
      </Typography>
      <Box>{children}</Box>
    </Stack>
  )
}
