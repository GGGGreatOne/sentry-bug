import { Stack } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { useCallback, useState } from 'react'
import { viewControl } from 'views/editBox/modal'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import useBreakpoint from 'hooks/useBreakpoint'
import DropZone from 'components/DropZone/DropZone'
import { TokenUploadimg } from 'api/toolbox'
import { upload } from 'api/common'

export enum EditInfoType {
  AVATAR,
  USERNAME
}
interface Props {
  imageUrl?: string
  tokenContract?: string
  hideCallBack?: (url: string | undefined) => any
}
const EditTokenImage = ({ imageUrl, tokenContract, hideCallBack }: Props) => {
  const isMd = useBreakpoint('md')
  // const { updateBoxAvatarCallback } = useEditBoxBasicInfo()
  const [tokenImageUrl, setTokenImageUrl] = useState(() => imageUrl)
  const [loading, setLoading] = useState(false)
  const saveHandle = useCallback(async () => {
    try {
      const nameRes = await TokenUploadimg({ tokenContract: tokenContract || '', imageUrl: tokenImageUrl || '' })
      if (nameRes.code !== 200) toast.error(nameRes.msg)
      hideCallBack && hideCallBack(tokenImageUrl)
    } catch (error) {}
    viewControl.hide('EditTokenImage')
  }, [hideCallBack, tokenContract, tokenImageUrl])

  const cancelHandle = useCallback(() => {
    setTokenImageUrl('')
  }, [])

  return (
    <BaseDialog
      title={'Upload Token image'}
      onClose={() => {
        setTimeout(function () {
          setTokenImageUrl(tokenImageUrl)
        }, 500)
      }}
    >
      <Stack flexDirection={'column'} alignItems={'center'}>
        <DropZone
          accept={{
            'image/jpeg': [],
            'image/png': []
          }}
          getFile={async file => {
            try {
              if (!['image/jpeg', 'image/png'].includes(file.type)) {
                return toast.error('Please upload PNG or JPG files only for intelligent submission.')
              }
              setLoading(true)
              const uploadRes = await upload({
                file
              })
              setLoading(false)
              if (uploadRes.code === 200) {
                setTokenImageUrl(uploadRes.data?.url)
                return
              } else if (uploadRes.code === 401) {
                toast.error('Sorry, you do not have permission.')
                return
              } else {
                toast.error('Sorry, you failed to upload your avatar.')
                return
              }
            } catch (error) {}
            return
          }}
        />
        <Stack flexDirection={'row'} gap={12}>
          <LoadingButton
            loading={loading}
            disabled={tokenImageUrl === ''}
            sx={{ marginTop: 32, width: isMd ? '100%' : 133, height: isMd ? 36 : 44 }}
            variant="contained"
            onClick={cancelHandle}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={loading}
            disabled={tokenImageUrl === ''}
            sx={{ marginTop: 32, width: isMd ? '100%' : 133, height: isMd ? 36 : 44 }}
            variant="contained"
            onClick={saveHandle}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </BaseDialog>
  )
}

export default EditTokenImage
