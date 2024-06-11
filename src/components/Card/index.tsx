import { Paper, SxProps, Theme } from '@mui/material'
import React from 'react'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

const Card = styled(Box)<{ width?: string; padding?: string; border?: string; $borderRadius?: string }>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1rem'};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '16px'};
  border: ${({ border }) => border};
`

export const LightCard = styled(Card)`
  border: 1px solid #ffffff33;
  background-color: ${({ theme }) => theme.surface2};
`
export const DarkCard = styled(Card)`
  background-color: ${({ theme }) => theme.surface1};
  border: 1px solid #ffffff33;
`
export default Card

export function OutlinedCard({
  children,
  color,
  padding,
  width,
  style
}: {
  children: JSX.Element | React.ReactNode
  color?: string
  padding?: string | number
  width?: string | number
  style?: React.CSSProperties & SxProps<Theme>
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: 'transparent',
        border: `1px solid ${color ?? 'rgba(0, 0, 0, 0.1)'}`,
        padding,
        width,
        ...style
      }}
    >
      {children}
    </Paper>
  )
}
