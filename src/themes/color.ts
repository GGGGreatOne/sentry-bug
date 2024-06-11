import { darken } from '@mui/material'
import { IDefaultColor } from './types'

export const defaultThemeColorOptions: IDefaultColor = {
  light: {
    'text-primary': '#F5F5F7',
    'text-primary-10': 'rgba(255, 255, 255, 0.10)',
    'text-primary-40': 'rgba(255, 255, 255, 0.40)',
    'text-primary-80': 'rgba(255, 255, 255, 0.80)',
    'text-08': 'rgba(0, 0, 0, 0.08)',
    'text-10': 'rgba(13, 13, 13, 0.10)',
    'text-20': 'rgba(13, 13, 13, 0.20)',
    'text-40': 'rgba(13, 13, 13, 0.40)',
    'text-60': 'rgba(13, 13, 13, 0.60)',
    'text-80': 'rgba(13, 13, 13, 0.80)',
    'text-100': '#1B1B1B',
    'Light-grey-01': '#F7F7F7',
    'Dark-white': '#DEDEDE',
    'grey-01': '#20201E',
    'grey-03': '#959595',
    'grey-04': '#D7D6D9',
    'grey-05': '#E8E9E4',
    'grey-06': '#F6F6F3',
    'black-100': '#121212',
    neutral: '#FFFFFF',
    neutral2: '#BCBCBC',
    neutral3: '#717171',
    neutral4: '#282828',
    neutral5: '#0D0D0D',
    neutral6: '#0D0D0D',
    neutral7: '#E6E6E6',
    red: '#FF3030',
    green: '#30AD44',
    green2: '#D7FAD1',
    'light-green': '#E1F25C',
    blue: '#4E6EF3',
    black: '1B1B1B',
    white: '#FFFFFF',
    'yellow-light': '#F9FCDE'
  },
  dark: {
    'text-primary': '#0D0D0D',
    'text-primary-10': 'rgba(13, 13, 13, 0.10)',
    'text-primary-40': 'rgba(13, 13, 13, 0.40)',
    'text-primary-80': 'rgba(13, 13, 13, 0.80)',
    'text-08': 'rgba(0, 0, 0, 0.08)',
    'text-10': 'rgba(255, 255, 255, 0.10)',
    'text-20': 'rgba(255, 255, 255, 0.20)',
    'text-40': 'rgba(255, 255, 255, 0.40)',
    'text-60': 'rgba(255, 255, 255, 0.60)',
    'text-80': 'rgba(255, 255, 255, 0.80)',
    'text-100': '#FFFFFF',
    'Light-grey-01': '#F7F7F7',
    'Dark-white': '#DEDEDE',
    'grey-01': '#20201E',
    'grey-03': '#959595',
    'grey-04': '#D7D6D9',
    'grey-05': '#E8E9E4',
    'grey-06': '#F6F6F3',
    'black-100': '#121212',
    neutral: '#1B1B1B',
    neutral2: '#282828',
    neutral3: '#717171',
    neutral4: '#BCBCBC',
    neutral5: '#F5F5F7',
    neutral6: '#F5F5F7',
    neutral7: '#E6E6E6',
    red: '#FF3030',
    green: '#30AD44',
    green2: '#D7FAD1',
    'light-green': '#E1F25C',
    blue: '#4E6EF3',
    black: '#1B1B1B',
    white: '#FFFFFF',
    'yellow-light': '#F9FCDE'
  }
}

export const defaultThemeLightColors = {
  primary: {
    main: '#1B1B1B',
    dark: 'rgba(27, 27, 27, 0.80)',
    contrastText: '#fff'
  },
  secondary: {
    main: '#717171',
    dark: darken('#717171', 0.3),
    contrastText: '#323232'
  },
  error: {
    main: '#FA0E0E'
  },
  warning: {
    main: '#F0B90B'
  },
  info: {
    main: '#1F9898'
  },
  success: {
    main: '#31B047'
  },
  background: {
    default: '#F5F5F7',
    paper: '#FFFFFF'
  },
  text: {
    primary: '#0D0D0D',
    secondary: '#717171',
    disabled: '#828282'
  },
  action: {
    disabledBackground: '#717171',
    disabled: '#323232'
  }
}

export const defaultThemeDarkColors = {
  primary: {
    main: '#fff',
    dark: 'rgba(255, 255, 255, 0.80)',
    contrastText: '#0D0D0D'
  },
  secondary: {
    main: '#717171',
    dark: darken('#717171', 0.2),
    contrastText: '#323232'
  },
  error: {
    main: '#FA0E0E'
  },
  warning: {
    main: '#F0B90B'
  },
  info: {
    main: '#1F9898'
  },
  success: {
    main: '#31B047'
  },
  background: {
    default: '#0D0D0D',
    paper: '#1B1B1B'
  },
  text: {
    primary: '#fff',
    secondary: '#717171',
    disabled: '#61666A'
  },
  action: {
    disabledBackground: '#717171',
    disabled: '#323232'
  }
}

export const customThemeColors = {
  palette: {
    primary: {
      light: '#3F8CFF',
      main: '#0049C6',
      dark: '#002685',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#FFEBF6',
      main: '#FFA2C0',
      dark: '#FFB7F5',
      contrastText: '#ffffff'
    },
    error: {
      main: '#E46767'
    },
    warning: {
      main: '#FFCE73'
    },
    info: {
      main: '#F0B90B'
    },
    success: {
      main: '#31B047'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#3f5170',
      secondary: '#808191',
      disabled: '#b4b2b2'
    },
    action: {
      disabledOpacity: 0.8
    },
    grey: {
      A700: '#191919',
      A400: '#252525',
      A200: '#303030',
      A100: '#A1A1A1'
    }
  },
  borderRadius: {
    default: '8px'
  },
  boxShadow: {
    bs1: 'inset 0px -1px 0px #E4E4E4',
    bs2: 'rgb(174 174 174 / 20%) 0px 0px 5px'
  },
  gradient: {
    gradient1: '#ffffff linear-gradient(154.62deg, #77C803 9.44%, #28A03E 59.25%);'
  },
  height: {
    header: '80px',
    mobileHeader: '50px'
  },
  width: {
    sidebar: '250px',
    maxContent: '1110px'
  },
  shape: {
    border: '1px solid',
    borderRadius: 8
  },
  zIndex: {
    modal: 99999
  },
  spacing: (factor: number) => `${1 * factor}px`
  // gray: {
  //   main: '#333333',
  //   dark: '#262626',
  // },
}
