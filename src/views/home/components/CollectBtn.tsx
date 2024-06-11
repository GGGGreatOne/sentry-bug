import StarSvg from 'assets/svg/home/star.svg'
import { Box, styled } from '@mui/material'
import { useCallback, useState } from 'react'
import { CollectPlugin } from 'api/user'
import { CollectStatus } from 'api/user/type'
import { toast } from 'react-toastify'

const StyledStar = styled(StarSvg)<{ isCollect: boolean }>(({ theme, isCollect }) => ({
  cursor: 'pointer',
  fill: isCollect ? theme.palette.text.primary : '',
  '& path': {
    stroke: theme.palette.text.primary
  }
}))

const CollectBtn = ({
  isCollect = false,
  pluginId,
  callback,
  boxId
}: {
  isCollect: boolean
  pluginId: number
  boxId: number | string
  callback: () => void
}) => {
  const [isSuccess, setIsSuccess] = useState(isCollect)

  const collectHanle = useCallback(
    async (event: React.SyntheticEvent) => {
      event.stopPropagation()
      const params = {
        boxPluginId: pluginId,
        collect: isSuccess ? CollectStatus.UN_COLLET : CollectStatus.COLLET,
        boxId: boxId
      }
      try {
        const res = await CollectPlugin(params)
        if (res.code !== 200) return toast.error(res.msg)
        setIsSuccess(!isSuccess)
        return callback()
      } catch (error) {
        return null
      }
    },
    [boxId, callback, isSuccess, pluginId]
  )
  return (
    <Box onClick={collectHanle}>
      <StyledStar isCollect={isSuccess} />
    </Box>
  )
}
export default CollectBtn
