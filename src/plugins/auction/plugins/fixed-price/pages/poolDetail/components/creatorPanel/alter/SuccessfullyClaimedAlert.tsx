import { Alert, SxProps, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export interface SuccessfullyClaimedAlertProps {
  sx?: SxProps
}

const SuccessfullyClaimedAlert = ({ sx }: SuccessfullyClaimedAlertProps): JSX.Element => {
  return (
    <Alert
      variant="outlined"
      icon={<CheckCircleIcon sx={{ color: '#2DAB50' }} />}
      sx={{ ...sx, borderRadius: 20, borderColor: '#D1D4D8' }}
    >
      <Typography variant="body1">You have successfully claimed your tokens. See you next time!</Typography>
    </Alert>
  )
}

export default SuccessfullyClaimedAlert
