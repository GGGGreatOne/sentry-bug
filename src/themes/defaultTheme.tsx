import { PaletteMode, ThemeOptions } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { defaultThemeColorOptions, defaultThemeDarkColors, defaultThemeLightColors } from './color'
import { getDefaultComponents } from './components'

export const fontFamily = 'IBM Plex Sans'

const TypographyComponent = {
  fontFamily: [`"${fontFamily}"`, 'sans-serif'].join(','),
  h1: { fontSize: 64, lineHeight: 46 / 46 },
  h2: { fontSize: 56, lineHeight: 28 / 20 },
  h3: { fontSize: 28, lineHeight: 26 / 18 },
  h4: { fontSize: 20, lineHeight: 24 / 18 },
  h5: { fontSize: 15, lineHeight: 22 / 22 },
  h6: { fontSize: 13, lineHeight: 15 / 15 },
  caption: { fontSize: 12, lineHeight: 32 / 24 },
  subtitle1: { fontSize: 12, lineHeight: 24 / 20 },
  body1: { fontSize: 16, lineHeight: 20 / 14 },
  body2: { fontSize: 13, lineHeight: 15 / 12 },
  IBM_Plex_Sans: {
    fontFamily: 'IBM Plex Sans!important',
    fontWeight: 500
  }
} as TypographyOptions

export const getDefaultThemeColors = (mode: PaletteMode) =>
  mode === 'light' ? defaultThemeLightColors : defaultThemeDarkColors

export const getDesignSystemTheme = (mode: PaletteMode): ThemeOptions => ({
  components: getDefaultComponents(defaultThemeColorOptions[mode]['text-100'], fontFamily, mode),
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
    ...getDefaultThemeColors(mode)
  }
  // gradient: {
  //   gradient1: '#ffffff linear-gradient(154.62deg, #77C803 9.44%, #28A03E 59.25%);'
  // },
})
