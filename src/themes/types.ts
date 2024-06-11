interface IColor {
  'text-primary': string
  'text-primary-10': string
  'text-primary-40': string
  'text-primary-80': string
  'text-08': string
  'text-10': string
  'text-20': string
  'text-40': string
  'text-60': string
  'text-80': string
  'text-100': string
  'Light-grey-01': string
  'Dark-white': string
  'grey-01': string
  'grey-03': string
  'grey-04': string
  'grey-05': string
  'grey-06': string
  'black-100': string
  neutral: string
  neutral2: string
  neutral3: string
  neutral4: string
  neutral5: string
  neutral6: string
  neutral7: string
  red: string
  green: string
  green2: string
  'light-green': string
  blue: string
  black: string
  white: string
  'yellow-light': string
}

export interface IDefaultColor {
  light: IColor
  dark: IColor
}
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    black: true
  }
}
declare module '@mui/material/styles' {
  interface ButtinVariants {
    black: React.CSSProperties
  }
  interface ButtinVariantsOptions {
    black?: React.CSSProperties
  }

  interface TypographyVariants {
    ChillPixels?: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    IBM_Plex_Sans?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    IBM_Plex_Sans: true
  }
}
