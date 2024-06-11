import { ReactNode, useState } from 'react'
import { Button, Menu, MenuItem, styled } from '@mui/material'

interface Props {
  buttonChild: ReactNode
  menuItemList: {
    label: string
    callBack: () => void
  }[]
  anchorOrigin?: {
    vertical: number | 'top' | 'center' | 'bottom'
    horizontal: number | 'center' | 'left' | 'right'
  }
  transformOrigin?: {
    vertical: number | 'top' | 'center' | 'bottom'
    horizontal: number | 'center' | 'left' | 'right'
  }
}
export default function BasicMenu({ buttonChild, menuItemList, anchorOrigin, transformOrigin }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <CusIconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {buttonChild}
      </CusIconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        PopoverClasses={{
          paper: 'token-menu-paper'
        }}
        open={open}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {menuItemList.map((_, index) => (
          <MenuItem
            onClickCapture={() => {
              _.callBack()
              setAnchorEl(null)
            }}
            key={_.label + index}
            onClick={handleClose}
          >
            {_.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const CusIconButton = styled(Button)`
  padding: 0;
  width: min-content;
  min-width: 0;
  &:hover {
    background: none;
  }
`
