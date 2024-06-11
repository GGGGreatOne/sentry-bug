import { Box, IconButton, Stack, SxProps } from '@mui/material'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import useBreakpoint from 'hooks/useBreakpoint'
interface Props {
  imgWidth?: number | string
  imgHeight?: number | string
  imgRadius?: number | string
  children: React.ReactNode
  file?: string | File
  styles?: SxProps
  size?: number
  isImgAlignCenter?: boolean
  uploadNum?: number
  hideHover?: boolean
  isReady?: boolean
  onDelete?: () => void
  onSuccess: ({ url, file }: { url: string; file: File }) => void
  isShowDefaultUploadEl?: boolean
}
const blobToBase64 = (f: File | undefined, callback: (url: string) => void) => {
  if (!f) {
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    callback(reader.result as string)
  }
  reader.readAsDataURL(f)
}
const multiple = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

const verifyFile = (f: File | undefined, size?: number): boolean => {
  if (!f) {
    return false
  }
  if (!multiple.includes(f.type.toLocaleLowerCase())) {
    toast.error(`Only these files are supported png, jpeg, jpg, webp.`)
    return false
  }
  if (f.size > (size ?? 2 * 1024 * 1024)) {
    toast.error(`Only supports images smaller than 2M.`)
    return false
  }

  return true
}

const Upload: React.FC<Props> = ({
  imgWidth = 64,
  imgHeight = 64,
  imgRadius = '50%',
  children,
  file,
  uploadNum,
  styles,
  size,
  onDelete,
  onSuccess,
  isImgAlignCenter = true,
  hideHover = false,
  isReady = false,
  isShowDefaultUploadEl = true
}) => {
  const isMd = useBreakpoint('md')
  const [curFile, setCurFile] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }
  useEffect(() => {
    if (uploadNum && uploadNum > 1) {
      handleClick()
    }
  }, [uploadNum])
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (!target.files?.[0] || !target.files) {
      return
    }
    if (!verifyFile(target.files?.[0], size)) {
      target.value = ''
      return
    }
    blobToBase64(target.files?.[0], url => {
      setCurFile(url)
      onSuccess({ url, file: target.files?.[0] as File })
      target.value = ''
    })
  }
  const onClear = useCallback(() => {
    if (curFile) {
      if (onDelete) onDelete()
      setCurFile('')
    }
  }, [curFile, onDelete])

  useEffect(() => {
    if (file) {
      if (file instanceof Blob) {
        blobToBase64(file, url => {
          setCurFile(url)
        })
      }
      if (typeof file === 'string') {
        setCurFile(file)
      }
    } else {
      setCurFile('')
    }
  }, [file])

  return (
    <Box
      onClick={handleClick}
      sx={{
        img: {
          width: imgWidth,
          height: imgHeight,
          borderRadius: imgRadius,
          objectFit: 'contain'
        },
        cursor: 'pointer',
        ...styles
      }}
    >
      <input
        disabled={isReady}
        type="file"
        ref={inputRef}
        id="upload-input"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          '& .mask': { display: 'none' },
          '&:hover .mask': { display: 'flex' }
        }}
      >
        {(!curFile || !isShowDefaultUploadEl) && children}
        {curFile && isShowDefaultUploadEl && (
          <Stack
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
            flexDirection={'row'}
            justifyContent={isImgAlignCenter ? 'center' : 'flex-start'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={curFile} style={{ objectFit: 'cover' }} />
            {!isMd && !hideHover && (
              <Box
                className="mask"
                sx={{
                  position: 'absolute',
                  left: isImgAlignCenter ? 0 : '-30px',
                  right: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isImgAlignCenter ? 'center' : 'flex-start',
                  gap: 20,
                  backgroundColor: 'var(--ps-text-primary-10)'
                }}
              >
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    handleClick()
                  }}
                >
                  <EditIcon sx={{ color: '#fff' }} />
                </IconButton>
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    onClear()
                  }}
                >
                  <DeleteIcon sx={{ color: '#fff' }} />
                </IconButton>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
export default Upload
