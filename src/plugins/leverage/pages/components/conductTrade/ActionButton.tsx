import { Button } from '@mui/material'
import { useActiveWeb3React } from 'hooks'

const ActionButton = ({ children, sx, ...props }: React.ComponentProps<typeof Button>) => {
  const { account } = useActiveWeb3React()
  if (!account) {
    return (
      <Button
        variant="contained"
        sx={{ width: '100%', height: 44, backgroundColor: 'var(--ps-text-100)', marginTop: 18 }}
      >
        Connect Wallet
      </Button>
    )
  }
  return (
    <Button
      variant="contained"
      sx={{ width: '100%', height: 44, backgroundColor: 'var(--ps-text-100)', marginTop: 18, ...sx }}
      {...props}
    >
      {children}
    </Button>
  )
}

export default ActionButton
