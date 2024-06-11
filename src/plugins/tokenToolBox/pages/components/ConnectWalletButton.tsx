import { useWalletModalToggle } from 'state/application/hooks'
import { Button } from '@mui/material'

const ConnectWalletButton = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const WalletModalToggle = useWalletModalToggle()

  return (
    <Button size={size} variant="contained" fullWidth onClick={() => WalletModalToggle()}>
      Connect Wallet
    </Button>
  )
}

export default ConnectWalletButton
