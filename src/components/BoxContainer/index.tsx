import { Box } from '@mui/material'
import { ReactNode } from 'react'
import PointerImg from 'assets/images/boxes/pointer.png'
import PointerLightImg from 'assets/images/boxes/pointer_light.png'
import { useUpdateThemeMode } from 'state/application/hooks'

export const BoxContainer = ({
  isWhite = false,
  children,
  style,
  isClub = false,
  ...props
}: {
  isWhite?: boolean
  children: ReactNode
  style?: React.CSSProperties
  props?: any
  isClub?: boolean
}) => {
  const { mode } = useUpdateThemeMode()
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: isWhite ? 'var(--ps-white-100)' : 'var(--ps-black-100)',
        ...style
      }}
      {...props}
    >
      {isClub ? (
        <Box
          sx={{
            background: `url(${mode === 'dark' ? PointerImg.src : PointerLightImg.src}) repeat left top / auto auto`
          }}
          width={'100%'}
          height={'100%'}
        >
          {children}
        </Box>
      ) : (
        children
      )}
    </Box>
  )
}
