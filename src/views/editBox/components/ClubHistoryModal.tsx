import { Box, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { useGetClubPlugin } from 'hooks/boxes/useGetClubPlugin'
import useBreakpoint from 'hooks/useBreakpoint'
import { AppsNews } from 'views/home/components/LatestUpdates'

interface Props {
  boxId: number | string
}
const ClubHistoryModal = ({ boxId }: Props) => {
  const isMd = useBreakpoint('md')
  const { data: ClubPluginList } = useGetClubPlugin({ boxId: boxId, pageSize: 30, pageNum: 1 })
  return (
    <BaseDialog title="Club History">
      <Box
        sx={{
          height: 254,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {!!ClubPluginList?.length &&
          ClubPluginList?.map((item, index) => {
            return <AppsNews key={index} item={item} isMd={isMd} />
          })}
        {!ClubPluginList?.length && (
          <Typography variant="h4" color={'var(--ps-text-100)'} textAlign={'center'} mt={50}>
            No history.
          </Typography>
        )}
      </Box>
    </BaseDialog>
  )
}

export default ClubHistoryModal
