import { Box } from '@mui/material'
import Staking from './staking'

const Page = ({
  boxContactAddr,
  editing,
  boxId,
  pluginId = 4,
  listing
}: {
  boxContactAddr: string
  editing: boolean
  boxId?: number | string
  pluginId?: number
  listing?: boolean
}) => {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Staking boxContactAddr={boxContactAddr} boxId={boxId} pluginId={pluginId} editing={editing} listing={listing} />
    </Box>
  )
}
export default Page
