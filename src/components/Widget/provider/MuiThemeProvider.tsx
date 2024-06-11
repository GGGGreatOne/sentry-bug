import { CssBaseline, StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material'
import React, { useMemo } from 'react'

import { getCustomTheme, getDesignSystemTheme } from 'themes'

const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useMemo(() => createTheme(getDesignSystemTheme('dark')), [])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
export default MuiThemeProvider

export function MuiCustomThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={createTheme(getCustomTheme())}>{children}</ThemeProvider>
}
