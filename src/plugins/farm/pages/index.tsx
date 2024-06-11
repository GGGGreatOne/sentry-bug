import { Box } from '@mui/material'
import Staking from './staking'
import { useEditBoxPluginBitstakingData } from 'state/boxes/hooks'
import { useEffect } from 'react'

const Page = ({ boxContactAddr, editing }: { boxContactAddr: string; editing: boolean }) => {
  const { stakingData, updateBoxPluginStakingDataCallback } = useEditBoxPluginBitstakingData()
  useEffect(() => {
    if (!stakingData && editing) {
      // updateBoxPluginStakingDataCallback('add')
      console.log('add')
    }
  }, [stakingData, updateBoxPluginStakingDataCallback, editing])

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Staking boxContactAddr={boxContactAddr} />
    </Box>
  )
}
export default Page
