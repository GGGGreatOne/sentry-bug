import { Box, styled, Typography, SxProps, Stack, FormLabel } from '@mui/material'
import Input from 'components/Input'
import { ReactNode } from 'react'
export const CardBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 24
})
export const BaseBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  borderRadius: '24px',
  background: '#1C1C19',
  padding: '40px 48px',
  '@media(max-width:600px)': {
    padding: '20px 28px',
    gap: 16
  }
})
export const Title = styled(Typography)({
  color: ' rgba(255, 255, 229, 0.80)',
  fontFamily: 'IBM Plex Sans',
  fontSize: '20px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '130%',
  '@media(max-width:600px)': {
    fontSize: 16
  }
})
export const FormLayout = ({
  title1,
  title2,
  childTitle,
  childForm,
  sxStyle
}: {
  title1: string
  title2?: string
  childTitle?: React.ReactElement
  childForm: React.ReactElement
  sxStyle?: SxProps
}) => {
  return (
    <Stack sx={{ flexDirection: 'column', gap: 16, ...sxStyle }}>
      <Stack sx={{ flexDirection: 'column', gap: 8 }}>
        <Title>{title1}</Title>
        {title2 && <Title sx={{ color: '#898679', fontWeight: 400, fontSize: 16 }}>{title2}</Title>}
        {childTitle && childTitle}
      </Stack>
      {childForm}
    </Stack>
  )
}
export function LabelTitle({ children }: { children: ReactNode }) {
  return <FormLabel sx={{ fontWeight: 600, color: '#222223', mt: 10 }}>{children}</FormLabel>
}
export const OutlinedInput = styled(Input)`
  &.MuiInputBase-root {
    border-radius: 4px;
    background-color: transparent !important;
    border-color: rgba(255, 255, 229, 0.2) !important;
    &.Mui-focused {
      border-color: rgba(255, 255, 229, 0.2) !important;
    }
  }
  & input,
  & input::placeholder {
    color: var(--text-60, rgba(230, 230, 206, 0.6));
    font-family: 'IBM Plex Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
`
