/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react'
import { getDefaultAvatar } from '../utils'
import { api } from '../api'
import { Avatar } from '@mui/material'
import { RoomMember } from 'sendingnetwork-js-sdk'

// const morePagePersonIcon =
//   'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF80MjlfMjg2ODciIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxNCIgZmlsbD0iI0U3RUFGMyIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfNDI5XzI4Njg3KSI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTQiIGZpbGw9IiNFN0VBRjMiLz4KPHBhdGggZD0iTTI1IDEwMC43NTZWODcuMjIyMkMyNSA3NC45NDg5IDM1LjcyNjEgNjUgNDguOTU4MyA2NUM2Mi4xOTA1IDY1IDcyLjkxNjcgNzQuOTQ4OSA3Mi45MTY3IDg3LjIyMjJWOTkuNzZDNjUuMDU2MSAxMDMuMjIxIDU2LjQ2MTcgMTA1LjAxMSA0Ny43NjA0IDEwNUMzOS42ODg5IDEwNSAzMS45OTgyIDEwMy40ODkgMjUgMTAwLjc1NloiIGZpbGw9IiMzREEzM0IiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxwYXRoIGQ9Ik0xOC43NSA0OEMxOC43NSA1NS42OTEzIDIxLjkzMjcgNjMuMDY3NSAyNy41OTc4IDY4LjUwNjFDMzMuMjYzIDczLjk0NDYgNDAuOTQ2NiA3NyA0OC45NTgzIDc3QzU2Ljk3MDEgNzcgNjQuNjUzNyA3My45NDQ2IDcwLjMxODggNjguNTA2MUM3NS45ODQgNjMuMDY3NSA3OS4xNjY3IDU1LjY5MTMgNzkuMTY2NyA0OEM3OS4xNjY3IDQwLjMwODcgNzUuOTg0IDMyLjkzMjUgNzAuMzE4OCAyNy40OTM5QzY0LjY1MzcgMjIuMDU1MyA1Ni45NzAxIDE5IDQ4Ljk1ODMgMTlDNDAuOTQ2NiAxOSAzMy4yNjMgMjIuMDU1MyAyNy41OTc4IDI3LjQ5MzlDMjEuOTMyNyAzMi45MzI1IDE4Ljc1IDQwLjMwODcgMTguNzUgNDhaIiBmaWxsPSIjRjY4NTFCIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L2c+Cjwvc3ZnPgo='

const AvatarComp = ({ url = '' }: { url: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<undefined | string>(undefined)

  useEffect(() => {
    if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
      setAvatarUrl(url)
    } else {
      const avatar_http = api._client.mxcUrlToHttp(url)
      setAvatarUrl(avatar_http)
    }
  }, [url])

  return (
    /* style={{ backgroundImage: 'url(' + morePagePersonIcon + ')', width: '100%', height: '100%' }} */
    <>{avatarUrl && <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl} />}</>
  )
}

export default function Page({ member, user }: { user: any | undefined; member: RoomMember }) {
  const renderAvatar = useCallback((user: any, member: RoomMember) => {
    let url
    if (user) {
      url = user.avatarUrl || user.avatar_url
    } else if (member) {
      url = member.getMxcAvatarUrl()
    }
    if (!url) {
      const id = user?.userId || user?.user_id || member?.userId
      url = getDefaultAvatar(id)
    }
    return <AvatarComp url={url} />
  }, [])

  return renderAvatar(user, member)
}
