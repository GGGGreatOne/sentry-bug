import { Stack, Box } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Upload from 'components/Upload'
import Avatar from 'assets/svg/boxes/set-avatar.svg'
import { upload } from 'api/common/index'
import { useEditBoxBasicInfo } from 'state/boxes/hooks'
import { useCallback, useState } from 'react'
import { viewControl } from 'views/editBox/modal'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import useBreakpoint from 'hooks/useBreakpoint'
interface Props {
  avatar: string
}
const EditAvatar = ({ avatar }: Props) => {
  const isMd = useBreakpoint('md')
  const { updateBoxAvatarCallback } = useEditBoxBasicInfo()
  const [avatarUrl, setAvatarUrl] = useState(avatar)
  const [loading, setLoading] = useState(false)
  const saveHandle = useCallback(() => {
    if (avatarUrl) {
      updateBoxAvatarCallback(avatarUrl)
      viewControl.hide('EditAvatar')
    }
  }, [avatarUrl, updateBoxAvatarCallback])
  return (
    <BaseDialog
      title="Set Avatar"
      onClose={() => {
        setTimeout(function () {
          setAvatarUrl(avatar)
        }, 500)
      }}
    >
      <Stack flexDirection={'column'} alignItems={'center'}>
        <Upload
          imgHeight={isMd ? 100 : 130}
          imgWidth={isMd ? 100 : 130}
          onSuccess={async ({ file }) => {
            try {
              setLoading(true)
              const uploadRes = await upload({
                file
              })
              setLoading(false)
              if (uploadRes.code === 200) {
                setAvatarUrl(uploadRes.data?.url)
                return
              } else if (uploadRes.code === 401) {
                toast.error('Sorry, you do not have permission.')
                return
              } else {
                toast.error('Sorry, you failed to upload your avatar.')
                return
              }
            } catch (error) {}
          }}
          onDelete={() => {
            setAvatarUrl('')
          }}
          file={avatarUrl}
          styles={{
            width: isMd ? 100 : 130,
            height: isMd ? 100 : 130,
            borderRadius: 100,
            background: 'var(--ps-neutral2)',
            margin: '0 auto',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Avatar style={{ transform: isMd ? 'scale(.75)' : 'none' }} />
          </Box>
        </Upload>
        <LoadingButton
          loading={loading}
          disabled={avatarUrl === ''}
          sx={{ marginTop: 32, width: isMd ? '100%' : 133, height: isMd ? 36 : 44 }}
          variant="contained"
          onClick={saveHandle}
        >
          Save
        </LoadingButton>
      </Stack>
    </BaseDialog>
  )
}

export default EditAvatar
