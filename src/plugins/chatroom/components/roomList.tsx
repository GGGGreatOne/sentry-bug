import { Stack, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react'
import MainMenu from './mainMenu'
import SeachSvg from 'assets/svg/search.svg'
import { StyledInputBase } from 'components/Header/Search'
import { useLogout } from 'state/user/hooks'

interface Props {
  menuFuncs: string
  closeModalms: string
  setPageType: Dispatch<SetStateAction<string>>
}

export default function Page({ menuFuncs, setPageType, closeModalms }: Props) {
  const inputRef = useRef(null)
  const [filterStr, setFilterStr] = useState('')
  const { logout } = useLogout()
  const isShowMenus = useMemo(() => {
    if (menuFuncs !== undefined && typeof menuFuncs === 'string') {
      return menuFuncs.includes('Invite') || menuFuncs.includes('Settings') || menuFuncs.includes('Logout')
    } else {
      return true
    }
  }, [menuFuncs])

  const menuClick = useCallback(
    (type: string) => {
      switch (type) {
        case 'create':
          setPageType('invitePage')
          break
        case 'set':
          setPageType('setPage')
          break
        case 'logout':
          logout()
          break
      }
    },
    [logout, setPageType]
  )
  return (
    <Stack>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography>Messages</Typography>
        {isShowMenus && <MainMenu menuFuncs={menuFuncs} closeModalms={closeModalms} menuClick={menuClick} />}
      </Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={8} sx={{}}>
        <SeachSvg />
        <StyledInputBase
          inputRef={inputRef}
          placeholder="Search"
          sx={{
            width: '100%'
          }}
          inputProps={{ 'aria-label': 'search' }}
          value={filterStr}
          onChange={e => setFilterStr(e.target.value)}
        />
      </Stack>
      <Typography>Invitations</Typography>
      <Typography width={'100%'} textAlign={'center'}>
        Tap &apos;New Chat&apos; in the right corner to connect
        <br />
        instantly. Send messages to any wallets
      </Typography>
    </Stack>
  )
}
