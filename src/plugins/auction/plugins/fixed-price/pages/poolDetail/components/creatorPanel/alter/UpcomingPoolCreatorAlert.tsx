import { Alert, Typography } from '@mui/material'
import ErrorIcon from 'plugins/auction/assets/svg/error-icon.svg'
import BigNumber from 'bignumber.js'

const UpcomingPoolCreatorAlert = ({ txFeeRatio }: { txFeeRatio: BigNumber | undefined }): JSX.Element => {
  return (
    <Alert variant="outlined" icon={<ErrorIcon />} sx={{ border: 'none' }}>
      <Typography sx={{ color: '#FFFFE5' }}>
        After the start of the auction you can only claim your fund raised after your auction is finished. There is a
        {new BigNumber(txFeeRatio?.toString() || 0).div(new BigNumber(10).pow(18)).times(100).toFixed(2)}% platform feed
        charged automatically from fund raised.
      </Typography>
    </Alert>
  )
}

export default UpcomingPoolCreatorAlert
