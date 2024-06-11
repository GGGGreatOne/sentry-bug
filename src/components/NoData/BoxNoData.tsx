import React from 'react'
import { Box, SxProps, Theme, Typography } from '@mui/material'

export interface IBoxNoDataProps {
  svgChildren?: JSX.Element | string | number
  sx?: SxProps<Theme> | undefined
  textSx?: SxProps<Theme> | undefined
  textColor?: string
  fontSize?: string | number
}

const NoData: React.FC<IBoxNoDataProps> = ({ svgChildren, sx, textColor, fontSize, textSx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 1,
        gap: 16,
        ...sx
      }}
    >
      {svgChildren ? svgChildren : null}

      <Typography
        variant="h3"
        color={textColor ? textColor : 'var(--ps-text-100)'}
        fontSize={fontSize ? fontSize : 28}
        sx={{
          fontWeight: 700,
          lineHeight: '140%',
          ...textSx
        }}
      >
        No Data
      </Typography>
    </Box>
  )
}

export default NoData
