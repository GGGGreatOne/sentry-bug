import React from 'react'
import { Box, SxProps, Theme } from '@mui/material'
import CopyIcon from 'assets/svg/copy_icon.svg'
import CheckIcon from '@mui/icons-material/Check'
import useCopyClipboard from 'hooks/useCopyClipboard'

interface Props {
  toCopy: string
  children?: React.ReactNode
  sx?: SxProps<Theme>
  height?: string
  margin?: string
  svgColor?: string
  svgWidth?: number
  CopySvg?: React.ReactNode
}

export default function Copy(props: Props) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { toCopy, children, sx, margin, svgColor, CopySvg, svgWidth, height } = props

  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        height: height ?? '17px',
        alignItems: 'center',
        '& svg': {
          width: svgWidth ?? 14,
          margin: margin ?? ' 0 10px 0 0',
          path: {
            fill: svgColor ?? 'var(--ps-neutral3)'
          }
        },
        ...sx
      }}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied ? <CheckIcon sx={{ opacity: 0.6, fontSize: 16 }} /> : CopySvg ?? <CopyIcon />}
      {children}
    </Box>
  )
}
