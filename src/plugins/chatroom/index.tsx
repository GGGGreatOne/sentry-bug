import { Button, Stack, styled } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import RoomPage from './roomPage/roomPage'
import { api } from './api'
import { dragging, filterLibrary, isMobile } from './utils'
import useBreakpoint from 'hooks/useBreakpoint'
// import { toast } from 'react-toastify'
import { useActiveWeb3React } from '../../hooks'
import { useIsDiDLogin, useUserInfo } from '../../state/user/hooks'
import useDebounce from '../../hooks/useDebounce'
import { toast } from 'react-toastify'
import { JoinChatRoom } from '../../api/boxes'
import { useGetBoxInfo } from '../../hooks/boxes/useGetBoxInfo'

const IndexRootStack = styled(Stack)`
  padding: 0 !important;
  background-color: unset !important;
`

export default function Page({
  roomId,
  boxId,
  userJoinRoom
}: {
  roomId: string
  boxId: string | number
  userJoinRoom?: boolean
}) {
  const { account, library: provider } = useActiveWeb3React()
  const widgetRootRef = useRef(null)
  const isMd = useBreakpoint('md')
  // const menuFuncs = 'Invite,Settings,Logout'
  const useTouristMode = undefined
  const filterWords = undefined
  const useWidgetBtn = ''
  const [btnUnReadCount, setBtnUnReadCount] = useState(0)
  const [pageType, setPageType] = useState<string>('')
  const [, setCloseModalms] = useState('')
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userLogin, setUserLogin] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(false)
  const { token } = useUserInfo()
  const didLogin = useIsDiDLogin()
  const _customIsOpen = useMemo(() => !!account && !token, [account, token])
  const DIDLogging = useMemo(() => didLogin, [didLogin])
  const customIsOpen = useDebounce(_customIsOpen, 50)
  const baseUrl = process.env.NEXT_PUBLIC_CHATROOM_BASEURL || ''
  const { run } = useGetBoxInfo(boxId.toString())

  const onRoom = useCallback(() => {
    const rooms = api._client.getRooms()
    setRooms(() => [...rooms])
    api.eventEmitter && api.eventEmitter.emit && api.eventEmitter.emit('unReadCount')
  }, [])

  const start = useCallback(async () => {
    if (DIDLogging) return
    await api._client.startClient()
    const user = api._client.getUser(localStorage.getItem('sdn_user_id'))
    user.setWalletAddress(localStorage.getItem('sdn_user_address') ?? account ?? '')
    if (user) {
      setUserLogin(true)
    }
    api._client.on('Room', onRoom)
    api._client.on('Room.myMembership', onRoom)
    api._client.on('RoomState.events', onRoom)
    api._client.on('Room.timeline', onRoom)
    // api._client.on('Session.logged_out', onSessionLogout)
  }, [onRoom, account, DIDLogging])

  const stop = useCallback(() => {
    api._client.removeListener('Room', onRoom)
    api._client.removeListener('RoomState.events', onRoom)
    api._client.removeListener('Room.myMembership', onRoom)
    api._client.removeListener('Room.timeline', onRoom)
    // api._client.removeListener('Session.logged_out', onSessionLogout)
    api._client.stopClient()
  }, [onRoom])

  const handleLoginClick = useCallback(async () => {
    try {
      setIsLoading(true)
      await api
        .DIDLogin(provider, account, res => {
          console.log('await res')
          if (res) {
            toast.success('Login successfully!')
          } else {
            toast.error('failed, please try again')
          }
        })
        .then(async () => {
          console.log('login susses')
          await api.getUserData()
          await start()
          setUserLogin(true)
          setIsLoading(false)
          setPageType('invitePage')
        })
    } catch (e) {
      toast.error('Login failed, please try again')
      setIsLoading(false)
    }
  }, [account, provider, start])

  const initDragging = useCallback(() => {
    if (!useWidgetBtn || isMd) return
    const rootDom = widgetRootRef.current
    rootDom && dragging(rootDom).enable()

    api.on('unReadCount', num => {
      if (!num) {
        setBtnUnReadCount(0)
      } else if (num !== btnUnReadCount) {
        setBtnUnReadCount(num)
      }
    })
  }, [btnUnReadCount, isMd])

  const initFunc = useCallback(async () => {
    await api.init(baseUrl)
    filterLibrary.init(filterWords)
    initDragging()
    const access_token = localStorage.getItem('sdn_access_token')
    const user_id = localStorage.getItem('sdn_user_id')
    if (!access_token || !user_id) {
      if (useTouristMode) {
        setPageType('touristPage')
      } else {
        setPageType('loginPage')
      }
      return
    }
    // here has logined
    await api.getUserData()
    await start()
    return
  }, [baseUrl, filterWords, initDragging, start, useTouristMode])

  const JoinBackRoom = useCallback(
    async (userId: string | undefined) => {
      if (!userId) return
      setJoiningRoom(true)
      try {
        await JoinChatRoom(boxId, userId).then(async () => {
          await api.joinRoom(roomId, () => {
            toast.success('Successfully joined the room!')
          })
        })
      } catch (e) {
        console.error('join failed!', e)
      } finally {
        console.log('finally')
        await run()
        setJoiningRoom(false)
      }
    },
    [boxId, run, roomId]
  )

  const clubRoom = useMemo(() => {
    return rooms.filter(room => room.roomId === roomId)?.[0]
  }, [rooms, roomId])
  const isInvite = useMemo(() => {
    if (clubRoom?.selfMembership) return clubRoom.selfMembership === 'invite'
    else return false
  }, [clubRoom?.selfMembership])

  // console.log(
  //   '🚀 ~ Page ~ pageType:',
  //   pageType + '\n',
  //   'roomId',
  //   roomId,
  //   +'\n',
  //   'userId' + api?.getUserId() + '\n',
  //   'Rooms',
  //   rooms,
  //   'clubRoom',
  //   clubRoom,
  //   '\n' + 'userJoinRoom',
  //   userJoinRoom + '\n',
  //   'isInvite',
  //   isInvite + '\n'
  // )

  useEffect(() => {
    initFunc().then()
    return stop
  }, [initFunc, stop])

  useEffect(() => {
    if (!userLogin) {
      setPageType('loginPage')
      return
    }
    if (!clubRoom && userLogin && !userJoinRoom) {
      setPageType('invitePage')
      return
    }
    if (clubRoom && isInvite && userLogin) {
      setPageType('acceptPage')
      return
    }
    setPageType('roomPage')
  }, [clubRoom, pageType, userLogin, userJoinRoom, isInvite])

  useEffect(() => {
    if (customIsOpen) {
      api._client.logout(() => {
        const eventEmitter = api.eventEmitter
        const keyList = ['sdn_access_token', 'sdn_user_id', 'sdn_user_address']
        keyList.map(key => localStorage.removeItem(key))
        setRooms([])
        setUserLogin(false)
        api.setUserData(null)
        api.resetEventEmitter()
        api.clearClient()
        api.init(baseUrl)
        filterLibrary.init(filterWords)
        eventEmitter && eventEmitter.emit && eventEmitter.emit('logout')
      })
    }
  }, [customIsOpen, filterWords, baseUrl])

  return (
    <IndexRootStack
      className="index_root_stack"
      sx={{
        maxWidth: 924,
        width: '100%',
        margin: '0 auto !important',
        background: 'var(--ps-neutral2)',
        padding: '7px 16px',
        borderRadius: '12px'
      }}
      onClick={() => {
        setCloseModalms(new Date().getTime().toString())
      }}
    >
      {pageType === 'loginPage' &&
        (isLoading ? (
          <Button variant="contained">Logging...</Button>
        ) : (
          <Button variant="contained" onClick={handleLoginClick}>
            Log in ChatRoom
          </Button>
        ))}

      {/*{pageType === 'mainPage' && (*/}
      {/*  <RoomList menuFuncs={menuFuncs} setPageType={setPageType} closeModalms={closeModalms} />*/}
      {/*)}*/}
      {pageType === 'invitePage' &&
        (userJoinRoom ? (
          <Button key="key1" variant="contained" onClick={() => JoinBackRoom(api?._client?.getUserId() ?? undefined)}>
            Loading Room...
          </Button>
        ) : (
          <Button key="key2" variant="contained" onClick={() => JoinBackRoom(api?._client?.getUserId() ?? undefined)}>
            {joiningRoom ? 'Join Room ...' : 'Join Room'}
          </Button>
        ))}
      {pageType === 'acceptPage' && clubRoom && (
        <Button
          variant="contained"
          onClick={() =>
            api.joinRoom(clubRoom.roomId, async () => {
              await run()
            })
          }
        >
          Enter Room
        </Button>
      )}
      {pageType === 'roomPage' && clubRoom && (
        <RoomPage
          widgetWidth={isMobile() ? '100vw' : '375px'}
          widgetHeight={isMobile() ? '100vh' : '667px'}
          roomViewBgUrl={''}
          useRoomFuncs={'SendImage'}
          roomId={clubRoom.roomId}
          clubRoom={clubRoom}
        />
      )}
    </IndexRootStack>
  )
}
