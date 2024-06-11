import { Box, SxProps, Theme, Typography } from '@mui/material'

interface Props {
  children?: React.ReactNode
  sx?: SxProps<Theme>
  color?: string
  size?: number
  fontWeight?: number
  height?: number
  gap?: number
  hiddenText?: boolean
}

export default function EmptyData(props: Props) {
  const { children, sx, color, size, fontWeight, height, hiddenText, gap } = props
  return (
    <Box
      sx={{
        height: height ?? '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: gap ?? 0,
        justifyContent: 'center',
        alignItems: 'center',
        ...sx
      }}
    >
      {children ? children : null}

      {hiddenText ? null : (
        <Typography
          color={color ?? 'var(--ps-text-100)'}
          fontSize={size ?? 16}
          fontWeight={fontWeight ?? 400}
          textAlign={'center'}
        >
          No Data
        </Typography>
      )}
    </Box>
  )
}
