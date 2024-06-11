import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Popper, { PopperPlacementType } from '@mui/material/Popper'
import React, { useEffect, useRef, useState } from 'react'
import useBreakpoint from '../../hooks/useBreakpoint'

export default function PopperCard({
  popperSx,
  sx,
  targetElement,
  closeHandler,
  handleClick,
  children,
  placement,
  open
}: {
  popperSx?: SxProps<Theme>
  sx?: SxProps<Theme>
  targetElement: JSX.Element
  children: JSX.Element | string | number
  closeHandler?: () => void
  handleClick?: () => void
  placement?: PopperPlacementType
  open?: boolean
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openPopper, setOpenPopper] = useState(false)
  const isSm = useBreakpoint('sm')
  const targetRef = useRef<null | HTMLElement>(null)
  const handleDefaultClick = () => {
    setOpenPopper(!openPopper)
  }
  const closeDefaultHandler = () => {
    setOpenPopper(false)
  }
  useEffect(() => {
    setAnchorEl(targetRef.current)
  }, [])

  useEffect(() => {
    if (open) {
      setOpenPopper(true)
    } else {
      setOpenPopper(false)
    }
  }, [open])

  return (
    <ClickAwayListener
      onClickAway={() => {
        closeHandler ? closeHandler() : closeDefaultHandler()
      }}
    >
      <Box>
        <Box ref={targetRef} onClick={handleClick ? handleClick : handleDefaultClick}>
          {targetElement}
        </Box>
        <Popper
          open={openPopper}
          anchorEl={anchorEl}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            top: isSm ? 0 : '10px !important',
            zIndex: theme => theme.zIndex.modal,
            ...popperSx
          }}
          placement={placement}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '8px',
              padding: { xs: 12, sm: 6 },
              ...sx
            }}
          >
            {children}
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}
