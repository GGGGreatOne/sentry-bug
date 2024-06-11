import { Stack } from '@mui/material'
import MenuIcon from '../assets/svg/menuIcon.svg'
import Icon0 from '../assets/svg/icon0.svg'
import Icon1 from '../assets/svg/icon1.svg'
import Icon2 from '../assets/svg/icon2.svg'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  menuFuncs: string
  closeModalms: string
  menuClick: (type: string) => void
}

export default function Page({ menuFuncs, closeModalms, menuClick }: Props) {
  const [showSetBox, setShowSetBox] = useState(false)
  console.log('🚀 ~ Page ~ showSetBox:', closeModalms)
  useEffect(() => {
    if (closeModalms) {
      setShowSetBox(false)
    }
  }, [closeModalms])
  const handleMenuClick = useCallback(
    (type: string) => {
      setShowSetBox(false)
      menuClick(type)
    },
    [menuClick]
  )
  return (
    <Stack
      sx={{
        position: 'relative'
      }}
    >
      <Stack
        sx={{
          cursor: 'pointer'
        }}
        onClick={e => {
          e.stopPropagation()
          setShowSetBox(!showSetBox)
        }}
      >
        <MenuIcon />
      </Stack>
      <Stack
        spacing={8}
        onClick={e => {
          e.stopPropagation()
        }}
        sx={{
          display: showSetBox ? 'flex' : 'none',
          position: 'absolute',
          zIndex: 100,
          right: '2px',
          top: '24px',
          width: '148px',
          padding: 8,
          background: 'var(--ps-neutral3)',
          boxShadow: '-2px 4px 10px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px'
        }}
      >
        {menuFuncs && menuFuncs.includes('Invite') && (
          <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            sx={{ cursor: 'pointer' }}
            spacing={8}
            onClick={() => handleMenuClick('create')}
          >
            <Icon0 />
            <span>New Chat</span>
          </Stack>
        )}
        {menuFuncs.includes('Invite') && menuFuncs.includes('Settings') && (
          <Stack
            sx={{
              width: '100%',
              border: '0.5px solid #fff'
            }}
          />
        )}
        {menuFuncs && menuFuncs.includes('Settings') && (
          <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            sx={{ cursor: 'pointer' }}
            spacing={8}
            onClick={() => handleMenuClick('set')}
          >
            <Icon1 />
            <span>Settings</span>
          </Stack>
        )}
        {menuFuncs.includes('Settings') && menuFuncs.includes('Logout') && (
          <Stack
            sx={{
              width: '100%',
              border: '0.5px solid #fff'
            }}
          />
        )}
        {menuFuncs && menuFuncs.includes('Logout') && (
          <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            sx={{ cursor: 'pointer' }}
            spacing={8}
            onClick={() => handleMenuClick('logout')}
          >
            <Icon2 />
            <span>Logout</span>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
