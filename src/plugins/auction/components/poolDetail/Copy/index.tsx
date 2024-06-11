import React from 'react'
import { Box } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'
import CopyIcon from 'plugins/auction/assets/svg/copy.svg'
interface Props {
  toCopy: string
  children?: React.ReactNode
}

export default function AddressCopy(props: Props) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { toCopy, children } = props

  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        height: 17,
        '& svg': {
          width: 20,
          mr: '10px'
          // path: {
          //   fill: 'var(--ps-neutral3)'
          // }
        }
      }}
      onClick={() => setCopied(toCopy)}
    >
      <Box sx={{ width: 'calc(100% - 24px)' }}>{children}</Box>
      {isCopied ? <CheckIcon sx={{ opacity: 0.6, fontSize: 16 }} /> : <CopyIcon />}
    </Box>
  )
}
