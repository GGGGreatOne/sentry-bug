import { Box } from '@mui/material'
import HomeContentFaker from './HomeContentFaker'
import useBreakpoint from 'hooks/useBreakpoint'
export default function ContainScroll({ children }: { children?: React.ReactNode }) {
  const isMd = useBreakpoint('md')
  return (
    <>
      {!isMd && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 2,
            transformStyle: `preserve-3d`,
            //   transform: `translateZ(-100px)`,
            perspective: `2750px`
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 78,
              top: -29,
              width: '1px',
              height: 99,
              transformOrigin: 'right bottom',
              transform: 'rotate(-45deg)',
              background: `var(--ps-text-10)`,
              zIndex: 100
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              right: 78,
              top: -29,
              width: '1px',
              height: 99,
              transformOrigin: 'left bottom',
              transform: 'rotate(45deg)',
              background: `var(--ps-text-10)`,
              zIndex: 100
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              left: 78,
              bottom: -29,
              width: '1px',
              height: 99,
              transformOrigin: 'right top',
              transform: 'rotate(45deg)',
              background: `var(--ps-text-10)`,
              zIndex: 100
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              right: 77,
              bottom: -29,
              width: '1px',
              height: 99,
              transformOrigin: 'left top',
              transform: 'rotate(-45deg)',
              background: `var(--ps-text-10)`,
              zIndex: 100
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              top: 70,
              left: '50%',
              width: '100%',
              maxWidth: 'calc(100vw - 172px)',
              height: 'calc(100vh - 140px)',
              border: '1px solid var(--ps-text-10)',
              transform: 'translate3D(-50%, 0, 0)',
              zIndex: 100
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 3
        }}
      >
        {children}
      </Box>
      {!isMd && <HomeContentFaker />}
    </>
  )
}
