import { PaletteMode, ThemeOptions } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { customThemeColors, defaultThemeColorOptions } from './color'
import { getDefaultComponents } from './components'

export const fontFamily = 'Poppins'

const TypographyComponent = {
  fontFamily: [`"${fontFamily}"`, 'sans-serif'].join(','),
  h1: { fontSize: 36, lineHeight: 46 / 36, color: 'red' },
  h2: { fontSize: 22, lineHeight: 28 / 22 },
  h3: { fontSize: 18, lineHeight: 26 / 18 },
  h4: { fontSize: 16, lineHeight: 24 / 16 },
  h5: { fontSize: 14, lineHeight: 22 / 14 },
  h6: { fontSize: 12, lineHeight: 15 / 12 },
  caption: { fontSize: 12, lineHeight: 32 / 24 },
  body1: { fontSize: 14, lineHeight: 20 / 14 },
  body2: { fontSize: 12, lineHeight: 15 / 12 },
  IBM_Plex_Sans: {
    fontFamily: 'IBM Plex Sans!important',
    fontWeight: 500
  }
} as TypographyOptions

const mode: PaletteMode = 'light'
export const getCustomTheme = (): ThemeOptions => ({
  components: getDefaultComponents('#222', fontFamily, mode),
  typography: TypographyComponent,
  spacing: 1,
  shape: {
    borderRadius: 1
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 860,
      lg: 1200,
      xl: 1440
    }
  },
  palette: {
    mode,
    common: { ...defaultThemeColorOptions[mode] },
    ...customThemeColors
  }
  // gradient: {
  //   gradient1: '#ffffff linear-gradient(154.62deg, #77C803 9.44%, #28A03E 59.25%);'
  // },
})
