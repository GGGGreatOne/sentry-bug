import { Box } from '@mui/material'
import useClubPermissions from 'hooks/boxes/useClubPermissions'
import CreatePool from 'plugins/auction/pages/erc20-create-pool'
import CreatePoolParamsProvider from 'plugins/auction/pages/erc20-create-pool/provider'
export default function Page() {
  useClubPermissions()
  return (
    <Box sx={{ backgroundColor: 'rgba(0,0,0,0)' }}>
      <CreatePoolParamsProvider>
        <CreatePool />
      </CreatePoolParamsProvider>
    </Box>
  )
}
