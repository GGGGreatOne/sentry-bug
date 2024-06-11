import { styled } from '@mui/material'

export * from './defaultTheme'
export { getCustomTheme } from './customTheme'

export const HideOnMobile = styled('div', {
  shouldForwardProp: () => true
})<{ breakpoint?: 'sm' | 'md' | 'lg' }>(({ theme, breakpoint }) => ({
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'none'
  }
}))

export const ShowOnMobile = styled('div', {
  shouldForwardProp: () => true
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  display: 'none',
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'block'
  }
}))
