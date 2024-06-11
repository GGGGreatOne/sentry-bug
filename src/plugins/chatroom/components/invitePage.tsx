import { Button, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import SeachSvg from 'assets/svg/search.svg'
import SelectedIcon from '../assets/svg/icon4.svg'
import UnselectedIcon from '../assets/svg/icon3.svg'
import CloseIcon from '../assets/svg/closeIcon.svg'
import Image from 'components/Image'
import { getAddressByUserId } from 'utils'
import { toast } from 'react-toastify'
import { api } from '../api'
import { StyledInputBase } from 'components/Header/Search'
import { useRequest } from 'ahooks'

interface Props {
  roomId?: string
  title?: string
  onBack: () => void
}

export default function Page({ roomId, onBack, title }: Props) {
  const inputRef = useRef(null)
  const [filterStr, setFilterStr] = useState('')
  const [searchList, setSearchList] = useState<any[]>([])
  const [selectList, setSelectList] = useState<any[]>([])
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [currId, setCurrId] = useState<NodeJS.Timeout>()
  console.log('🚀 ~ Page ~ showInputDialog:', showInputDialog, currId, filterStr)

  const isSearchUserSelected = useCallback(
    (user: { user_id: any }) => {
      const isSelect = selectList.find(u => u.user_id === user.user_id)
      return isSelect ? true : false
    },
    [selectList]
  )

  const handleBackClick = useCallback(() => {
    setFilterStr('')
    setSelectList([])
    setSearchList([])
    onBack()
  }, [onBack])

  const checkRoomExist = async (_roomId: any) => {
    await new Promise(resolve => {
      const hasRoomInterval = setInterval(() => {
        const room = api._client.getRoom(_roomId)
        console.log('widget__interval', room)
        if (room) {
          clearInterval(hasRoomInterval)
          resolve('wasm live: success')
        }
      }, 100)
    })
  }

  const handleSearchListClick = useCallback(
    (user: { user_id: any; isSelected: any }) => {
      const arr = JSON.parse(JSON.stringify(selectList))
      const arrSearch = JSON.parse(JSON.stringify(searchList))
      const index = arr.findIndex((v: { user_id: any }) => v.user_id === user.user_id)
      const indexSearch = arrSearch.findIndex((v: { user_id: any }) => v.user_id === user.user_id)

      if (index !== -1) {
        arr.splice(index, 1)
      } else {
        arr.push({
          ...user,
          isSelected: true
        })
        setFilterStr('')
        // if (inputRef && inputRef.current) {
        //   inputRef.current.focus()
        // }
      }
      arrSearch.splice(indexSearch, 1, {
        ...user,
        isSelected: !user.isSelected
      })
      setSelectList(arr)
      setSearchList(arrSearch)
    },
    [searchList, selectList]
  )

  const handleSelectListClick = (user: { user_id: any }) => {
    const arr = JSON.parse(JSON.stringify(selectList))
    const index = arr.findIndex((v: { user_id: any }) => v.user_id === user.user_id)
    arr.splice(index, 1)
    setSelectList(arr)
  }

  const handleConfirmClick = async () => {
    if (selectList.length <= 0) return
    if (roomId) {
      handleCreateAndInvite(roomId)
    } else {
      // single person not show dialog
      if (selectList.length === 1) {
        const targetId = selectList[0].user_id
        api.chatToAddress(getAddressByUserId(targetId))
      } else {
        setShowInputDialog(true)
      }
    }
  }

  const handleCreateAndInvite = useCallback(
    async (roomId: any, roomName?: any) => {
      // setShowDialog(true)
      let tmpRoomId = roomId
      let created = false
      if (!tmpRoomId) {
        if (selectList.length > 1) {
          tmpRoomId = await api.createPublicRoom(roomName)
        } else {
          tmpRoomId = await api.createDMRoom(selectList[0])
        }
        created = true
      }
      await checkRoomExist(tmpRoomId)
      const room = api._client.getRoom(tmpRoomId)
      let inviteCount = 0
      await selectList.map(m => {
        const member = room.getMember(m.user_id)
        if (member == null || member.membership !== 'join') {
          api.invite(tmpRoomId, m.user_id)
          inviteCount++
        }
      })
      if (inviteCount) {
        if (created) {
          toast.success('The room is created successfully!')
          window.joinToPublicRoomWatch(tmpRoomId)
        } else {
          toast.success(`${inviteCount > 1 ? 'Invitations' : 'Invitation'} sent`)
        }
      } else {
        if (selectList.length > 1) {
          toast.error('These members are already part of the group')
        } else {
          toast.error('This member is already part of the group')
        }
      }
      // setDialogStatus('success')
    },
    [selectList]
  )

  const { data } = useRequest(
    async () => {
      if (!filterStr) return
      await api._client
        ?.searchUserDirectory({
          term: filterStr,
          limit: 10
        })
        .then((resp: { results: any[] }) => {
          if (resp && resp.results && resp.results.length > 0) {
            const tmpArr = resp.results.map(item => {
              return {
                ...item,
                isSelected: isSearchUserSelected(item)
              }
            })
            setSearchList(tmpArr)
          }
        })
        .catch((err: any) => {
          console.log('🚀 ~ applySearch ~ err:', err)
          setSearchList([])
        })
      return
    },
    {
      manual: false,
      refreshDeps: [filterStr],
      debounceWait: 500
    }
  )

  console.log('🚀 ~ Page ~ data:', data, filterStr)
  useEffect(() => {
    if (data) {
      setCurrId(data)
    }
  }, [data])

  const spawnInvitedUserItem = (list: string | any[]) => {
    const arr = []
    for (let i = 0; i < list.length; i++) {
      const user = list[i]
      arr.push(
        <span className="invited-item" key={user.user_id}>
          <span className="invited-user">
            <span className="avatar">
              <Image src={user.avatar_url} alt="avatar" />
            </span>
            <span className="name">{user.display_name}</span>
          </span>
          <div
            className="btn-close svg-btn svg-btn-fill"
            onClick={() => {
              handleSelectListClick(user)
            }}
          >
            <CloseIcon />
          </div>
        </span>
      )
    }
    return arr
  }

  return (
    <Stack>
      <Stack
        direction={'row'}
        spacing={8}
        alignItems={'center'}
        sx={{
          cursor: 'pointer'
        }}
        onClick={handleBackClick}
      >
        &lt;&nbsp;&nbsp;&nbsp;&nbsp;
        <Typography>{title || 'New Chat'}</Typography>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-start'}>
        {selectList.length ? spawnInvitedUserItem(selectList) : <SeachSvg />}
        <StyledInputBase
          ref={inputRef}
          placeholder="Search"
          value={filterStr}
          onChange={e => setFilterStr(e.target.value)}
        />
      </Stack>
      <Stack>
        {searchList.map((item: any, index) => {
          return (
            <Stack
              key={index}
              onClick={() => {
                handleSearchListClick(item)
              }}
            >
              <div className="members_item_select">{item.isSelected ? <SelectedIcon /> : <UnselectedIcon />}</div>
              <div className="members_item_avatar">
                <Image src={item.avatar_url} alt="avatar" />
              </div>
              <div className="members_item_desc">
                <p className="members_item_desc_name">{item.display_name}</p>
                <p className="members_item_desc_addr">{getAddressByUserId(item.user_id)}</p>
              </div>
            </Stack>
          )
        })}
      </Stack>
      <Button variant="contained" disabled={selectList.length === 0} onClick={handleConfirmClick}>
        <span>Selected </span>
        {selectList.length > 0 && <span> ({selectList.length}) </span>}
      </Button>
    </Stack>
  )
}
