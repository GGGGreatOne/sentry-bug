import { Box, Stack } from '@mui/material'
import ChatRoomCard from '../../../plugins/chatroom/index'
import useBreakpoint from 'hooks/useBreakpoint'

type ChatroomProps = {
  roomId?: string | null
  boxId?: string | number
  userJoinRoom?: boolean
}

export default function Page({ roomId, boxId, userJoinRoom }: ChatroomProps) {
  const isMd = useBreakpoint('md')

  return (
    <Stack direction={'column'} spacing={isMd ? 16 : 24} justifyContent={'center'}>
      {roomId && boxId && <ChatRoomCard roomId={roomId} boxId={boxId} userJoinRoom={userJoinRoom} />}
      {!roomId && <Box sx={{ textAlign: 'center' }}>No room yet.</Box>}
    </Stack>
  )
}
