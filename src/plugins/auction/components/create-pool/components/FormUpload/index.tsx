import { Box, CircularProgress, Stack, styled, SxProps } from '@mui/material'
import { upload } from 'api/common'
import Upload from 'components/Upload'
import { toast } from 'react-toastify'
import UploadAddSvg from '../../../../assets/svg/upload-add.svg'
import { useRequest } from 'ahooks'
import { useEffect, useState } from 'react'
interface IProps {
  filedName: string
  setFieldValue: (name: string, value: any) => void
  url?: string
  sx?: SxProps
  defaultUrl?: string
}
const UploadAddStyle = styled(UploadAddSvg)`
  & > path {
    fill: #898679;
  }
`
const FormUpload = ({ setFieldValue, filedName, url, sx, defaultUrl }: IProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined | null>(url)

  // If there is an id, imgSrc will be empty.
  // so we need to set the defaultUrl to imgSrc
  // defaultUrl is the url of the image that is already uploaded
  useEffect(() => {
    if (!imgSrc && defaultUrl) {
      setImgSrc(defaultUrl)
    }
  }, [defaultUrl, imgSrc])
  const { loading, run: uploadRun } = useRequest(
    async ({ file, url }: { file: File; url: string }) => {
      try {
        const res = await upload({ file })
        if (res.code === 200) {
          setFieldValue(filedName, res.data.url)
          setImgSrc(url)
        } else {
          setImgSrc(null)
          toast.error('Sorry, you failed to upload your avatar.')
        }
      } catch (error) {
        setImgSrc(null)
        toast.error('Sorry, you failed to upload your avatar.')
      }
    },
    {
      manual: true
    }
  )
  return (
    <Upload onSuccess={uploadRun} isShowDefaultUploadEl={false}>
      <Box>
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            width: '100%',
            height: 180,
            borderRadius: 8,
            border: ' 1px dashed  #898679',
            position: 'relative',
            ...sx
          }}
        >
          {!imgSrc && <UploadAddStyle />}
          {imgSrc && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `url(${imgSrc}) center no-repeat`,
                backgroundSize: 'contain'
              }}
            />
          )}
          {loading && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,.5)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)'
              }}
            >
              <Stack justifyContent={'center'} alignItems={'center'} sx={{ width: '100%', height: '100%' }}>
                <CircularProgress sx={{ color: 'rgba(0,0,0,.5)' }} size={30} />
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Upload>
  )
}
export default FormUpload
