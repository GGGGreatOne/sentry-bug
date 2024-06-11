import { useWindowSize } from 'components/Widget2/hooks/useWindowSize'
import { BREAKPOINTS } from 'components/Widget2/theme'
import { Z_INDEX } from 'components/Widget2/theme/zIndex'
import { useEffect } from 'react'
import styled from 'styled-components'

const ScrimBackground = styled.div<{ $open: boolean; $maxWidth?: number; $zIndex?: number }>`
  z-index: ${({ $zIndex }) => $zIndex ?? Z_INDEX.modalBackdrop};
  overflow: hidden;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.scrim};

  opacity: 0;
  pointer-events: none;
  @media only screen and (max-width: ${({ theme, $maxWidth }) => `${$maxWidth ?? theme.breakpoint.sm}px`}) {
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity ${({ theme }) => theme.transition.duration.medium} ease-in-out;
  }
`

interface ScrimBackgroundProps extends React.ComponentPropsWithRef<'div'> {
  $open: boolean
  $maxWidth?: number
  $zIndex?: number
}

export const Scrim = (props: ScrimBackgroundProps) => {
  const { width } = useWindowSize()

  useEffect(() => {
    if (width && width < BREAKPOINTS.sm && props.$open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [props.$open, width])

  return <ScrimBackground {...props} />
}
