import { Stack, Box } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Upload from 'components/Upload'
import Avatar from 'assets/svg/boxes/set-avatar.svg'
import { upload } from 'api/common/index'
import { useCallback, useState } from 'react'
import { viewControl } from 'views/editBox/modal'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import useBreakpoint from 'hooks/useBreakpoint'
import { SetUserName, UserAvatar } from 'api/user'
import Input from 'components/Input'
import { useRefreshUserInfo } from 'state/user/hooks'

export enum EditInfoType {
  AVATAR,
  USERNAME
}
interface Props {
  avatar?: string
  userName?: string
  type: EditInfoType
}
const EditUserInfo = ({ avatar, type, userName }: Props) => {
  const refreshUserInfo = useRefreshUserInfo()
  const isMd = useBreakpoint('md')
  // const { updateBoxAvatarCallback } = useEditBoxBasicInfo()
  const [avatarUrl, setAvatarUrl] = useState(() => avatar)
  const [userNameValue, setUserNameValue] = useState(() => userName)
  const [loading, setLoading] = useState(false)
  const saveHandle = useCallback(async () => {
    if (type === EditInfoType.AVATAR && avatarUrl) {
      try {
        const avatarRes = await UserAvatar({ avatar: avatarUrl })
        if (avatarRes.code !== 200) toast.error(avatarRes.msg)
      } catch (error) {}
    }

    if (type === EditInfoType.USERNAME && userNameValue) {
      try {
        const nameRes = await SetUserName({ userName: userNameValue })
        if (nameRes.code !== 200) toast.error(nameRes.msg)
      } catch (error) {}
    }
    refreshUserInfo()
    viewControl.hide('EditUserInfo')
  }, [avatarUrl, refreshUserInfo, type, userNameValue])
  console.log('avatarUrl', avatarUrl)

  const isNotEmptyOrSpaces = (str: any) => {
    return !(str && str.trim() !== '')
  }
  return (
    <BaseDialog
      title={type === EditInfoType.AVATAR ? 'Set Avatar' : 'Set Username'}
      onClose={() => {
        setTimeout(function () {
          setAvatarUrl(avatar)
        }, 500)
      }}
    >
      <Stack flexDirection={'column'} alignItems={'center'}>
        {type === EditInfoType.AVATAR && (
          <>
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
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMd ? 100 : 130,
                  height: isMd ? 100 : 130
                }}
              >
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
          </>
        )}
        {type === EditInfoType.USERNAME && (
          <>
            <Input
              value={userNameValue ? userNameValue : ''}
              onChange={(event: any) => {
                const { value } = event.target
                setUserNameValue(value)
              }}
            ></Input>
            <LoadingButton
              loading={loading}
              disabled={isNotEmptyOrSpaces(userNameValue)}
              sx={{ marginTop: 32, width: isMd ? '100%' : 133, height: isMd ? 36 : 44 }}
              variant="contained"
              onClick={saveHandle}
            >
              Save
            </LoadingButton>
          </>
        )}
      </Stack>
    </BaseDialog>
  )
}

export default EditUserInfo
