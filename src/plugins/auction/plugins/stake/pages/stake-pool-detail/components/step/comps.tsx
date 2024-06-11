import { LoadingButton } from '@mui/lab'
import { Box, StepContent, StepLabel, Stepper, styled, Typography } from '@mui/material'

export const StepperStyle = styled(Stepper)(({ theme }) => ({
  '.MuiStepConnector-root': {
    marginLeft: '16px'
  },
  '.MuiStepLabel-root': {
    padding: 0
  },
  '.MuiStepLabel-iconContainer': {
    padding: 0,
    svg: {
      width: 32,
      height: 32,
      color: '#D7D6D9',
      '.MuiStepIcon-text': {
        fill: '#fff'
      }
    }
  },
  '& .MuiStepConnector-line': {
    borderColor: '#D7D6D9'
  },
  '.Mui-completed': {
    svg: {
      path: {
        fill: '#000'
      }
    }
  },
  '.Mui-active': {
    svg: {
      color: '#E1F25C',
      '.MuiStepIcon-text': {
        fill: '#121212'
      }
    }
  },
  [theme.breakpoints.down('md')]: {
    '.MuiStepLabel-iconContainer': {
      svg: {
        width: 24,
        height: 24
      }
    }
  }
}))

export const StepLabelStyle = styled(StepLabel)(({ theme }) => ({
  '.MuiStepLabel-labelContainer': {
    display: 'grid',
    gap: 4,
    paddingLeft: '24px'
  },
  '.MuiStepLabel-label': {
    color: '#fff !important',
    fontSize: '20px',
    fontWeight: '600 !important',
    lineHeight: '140%',
    letterSpacing: '-0.4px'
  },

  '.MuiTypography-root': {
    color: ' rgba(255, 255, 255, 0.80)',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '150%',
    letterSpacing: '-0.28px'
  },
  [theme.breakpoints.down('md')]: {
    '.MuiStepLabel-labelContainer': {
      paddingLeft: '8px'
    },
    '.MuiStepLabel-label': {
      fontSize: '18px',
      letterSpacing: '0'
    },
    '.MuiTypography-root': {
      fontSize: 13
    }
  }
}))

export const StepContentStyle = styled(StepContent)(({ theme }) => ({
  paddingLeft: 40,
  marginLeft: '16px',
  borderColor: '#D7D6D9',
  [theme.breakpoints.down('md')]: {
    paddingLeft: 16
  }
}))

export const CardLabelStyle = styled(Typography)(({ theme }) => ({
  color: '#000',
  fontSize: '20px',
  fontWeight: '600',
  letterSpacing: '-0.4px',
  [theme.breakpoints.down('md')]: {
    fontSize: '18px',
    letterSpacing: '0'
  }
}))

export const CardContentStyle = styled(Typography)(() => ({
  color: '#959595',
  // fontFamily: 'Inter',
  fontSize: '13px',
  fontWeight: '400'
}))

export const StakeButton = styled(LoadingButton)(({ theme }) => ({
  height: 52,
  width: 424,
  padding: '20px 0',
  display: 'flex',
  gap: 10,
  borderRadius: '8px',
  background: '#121212',
  color: '#fff',
  svg: {
    path: { color: '#fff' }
  },
  '&.Mui-disabled': {
    color: '#959595',
    opacity: 0.5,
    svg: {
      path: { color: '#fff', opacity: 0.5 }
    }
  },
  ':hover': {
    background: '#000',
    opacity: 0.6
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '42px'
  }
}))
export const CountdownBtnStyle = styled(StakeButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 0;
  &.Mui-disabled {
    color: #fff;
  }
`
export const BoldTextStyle = styled(Typography)(({ theme }) => ({
  color: '#121212',
  fontSize: '36px',
  fontWeight: '600',
  letterSpacing: '-0.72px',
  lineHeight: '30px',
  [theme.breakpoints.down('md')]: {
    fontSize: '28px',
    letterSpacing: '0',
    lineHeight: 'normal',
    width: 'auto'
  }
}))

export const CardContentTitleStyle = styled(Typography)(() => ({
  color: '#959595',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '21px',
  letterSpacing: '-0.28px'
}))

export const CardContentBoldTextStyle = styled(Typography)(({ theme }) => ({
  color: '#F6F6F3',
  fontSize: '36px',
  fontWeight: '600',
  letterSpacing: '-0.72px',
  lineHeight: '26px',
  [theme.breakpoints.down('md')]: {
    fontSize: '28px',
    letterSpacing: '0',
    lineHeight: 'normal'
  }
}))
export const NotInvolvedContainer = styled(Box)`
  display: flex;
  width: 420px;
  padding: 30px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  flex-shrink: 0;
  align-self: stretch;
  background: #fff;
`
export const NotInvolvedTitle = styled(Typography)`
  color: #121212;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  letter-spacing: -0.32px;
`
