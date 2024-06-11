import React from 'react'
import { Box, SxProps, Theme, Typography } from '@mui/material'
import NoDataSVG from 'assets/svg/no_data.svg'
import NoDataSVG1 from 'assets/svg/no_data1.svg'

export interface INoDataProps {
  svgColor?: string
  color?: string
  children?: JSX.Element | string | number
  sx?: SxProps<Theme> | undefined
  widthSvg?: boolean
}

const NoData: React.FC<INoDataProps> = ({ svgColor, color, children, sx, widthSvg }) => {
  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: 20, ...sx }}>
      {widthSvg ? (
        <NoDataSVG1
          style={{
            maxWidth: '100%',
            margin: 'auto'
          }}
        />
      ) : (
        <NoDataSVG
          style={{
            maxWidth: '100%',
            margin: 'auto',
            color: svgColor ? svgColor : 'var(--ps-gray-50)',
            minHeight: 308
          }}
        />
      )}

      {children ? (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            m: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {children}
        </Box>
      ) : (
        <Typography
          variant="h4"
          color={color ? color : 'var(--ps-gray-300)'}
          sx={{
            position: 'absolute',
            width: 90,
            height: 25,
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            m: 'auto'
          }}
        >
          No data
        </Typography>
      )}
    </Box>
  )
}

export default NoData
