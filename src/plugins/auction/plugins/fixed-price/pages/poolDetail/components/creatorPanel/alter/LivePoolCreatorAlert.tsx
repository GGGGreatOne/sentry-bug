import { Alert, Typography } from '@mui/material'
import ErrorIcon from 'plugins/auction/assets/svg/error-icon.svg'
const LivePoolCreatorAlert = () => {
  return (
    <Alert
      variant="outlined"
      icon={<ErrorIcon />}
      sx={{ borderRadius: 20, borderColor: '#D1D4D8', width: 'fit-content', border: 'none' }}
    >
      <Typography variant="body1" sx={{ color: '#FFFFE5' }}>
        You can only claim your fund raised after your auction is finished.
      </Typography>
    </Alert>
  )
}

export default LivePoolCreatorAlert
