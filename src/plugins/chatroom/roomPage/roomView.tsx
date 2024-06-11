/* eslint-disable @next/next/no-img-element */
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  calculateRoomName,
  EmojiBaseProps,
  EmojiProps,
  filterLibrary,
  formatTextLastElide,
  formatTextLength,
  getDayStr,
  getEmojis,
  getEndOfDay,
  getFrequentThumbUpEmojiList,
  getGroupDateStr,
  getMemberName,
  renderTs
} from '../utils'
import { api } from '../api'
import { EventTimeline, IEvent, Room, RoomMember, SendingNetworkEvent } from 'sendingnetwork-js-sdk'
import { Box, styled } from '@mui/material'
import { clone } from 'lodash'
import Censor from 'mini-censor'
import { msgMoreOptIcon } from '../assets'
import dynamic from 'next/dynamic'
const MessageItem = dynamic(() => import('plugins/chatroom/roomPage/messageItem'))
import { Relations } from 'sendingnetwork-js-sdk/lib/models/relations'
import ToBottomIcon from '../assets/svg/toBottom.svg'
import UrlPreviewComp from './UrlPreviewComp'

interface RoomViewProps {
  widgetWidth: string | number | undefined
  widgetHeight: string | number | undefined
  roomViewBgUrl: string
  // useRoomFuncs,
  roomId: string
  room: Room
  timelineWindow: any
  loadTimeline: (eventId: string | undefined) => Promise<any>
  openUrlPreviewWidget: (url: string) => void
  pinnedIds: string[]
  pinEventSync: any
  moreOperateMsg: any
  setMoreOperateMsg: any
  setShowReplyOrEditMsgDialog: any
  inputFocus: any
  setInputFocus: any
  showMoreThumbsUpEmojiPanelRef: any
  showMoreMenu: { left: number; top: number; wWidth: number; wHeight: number } | false
  setShowMoreMenu: Dispatch<SetStateAction<{ left: number; top: number; wWidth: number; wHeight: number } | false>>
  showMoreThumbsUpEmojiPanel: boolean
  setShowMoreThumbsUpEmojiPanel: Dispatch<SetStateAction<boolean>>
  setShowMsgDeleteDialog: Dispatch<SetStateAction<boolean>>
  // showMsgDeleteDialog,
  // delStamp,
  memberAvatarClick: (id: string) => void
  showCheckbox: boolean
  onStartSelect: (sdnEvent: SendingNetworkEvent) => void
  onCheckChanged: (sdnEvent: SendingNetworkEvent, checked: boolean) => void
  setShowForward: () => void
  handleJump: (eventId: string) => Promise<void>
  keepFocus: () => void
  focusEventId: string
  setFocusEventId: Dispatch<SetStateAction<string>>
  setPinnedIds?: Dispatch<SetStateAction<string[]>>
}

interface messageWithChange extends IEvent {
  isEdited: boolean
  isDeleted: boolean
}

const DateSeparator = styled('div')`
  text-align: center;
  margin-top: 5px;
  span {
    background-color: #454545;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    color: white;
    font-weight: bold;
  }
`
const RoomViewBox = styled(Box)`
  @media (max-width: 900px) {
    height: calc(100vh - 64px - 16px * 3 - 70px - 68px - 16px * 2 - 14px * 2);
  }
  @media (min-width: 900px) {
    height: calc(100vh - 64px - 16px * 3 - 70px - 68px - 16px * 2 - 14px * 2);
  }
  position: relative;
  flex-shrink: 0;
  scrollbar-width: none;
  background-color: #262626 !important;
  // border-top-left-radius: 24px;
  // border-top-right-radius: 24px;
  .room-scroll {
    padding-bottom: 15px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .roomView_scroll_noMore {
    text-align: center;
    font-size: 10px;
  }
`

const MsgMoreWrap = styled(Box)`
  // position: relative;
  width: 100%;
  height: 100%;
`
const MsgMore_bg_color = '#262626'
const MsgMore_border_color = '#FFFFFF33'
const MsgMoreContainer = styled('div')`
  position: fixed;
  z-index: 1000;
  height: 40px;
  border-radius: 8px;
  // background: #fff;
  background-color: ${MsgMore_bg_color};
  border: 1px solid ${MsgMore_border_color};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  cursor: pointer;
  box-shadow: 0px 0px 12px 4px rgba(0, 0, 0, 0.08);
  .msgBox_more_frequent_thumbsUp_emojs_item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    font-size: 18px;
  }
  .msgBox_more_frequent_thumbsUp_emojs_item:hover {
    background: #12121266;
  }
  .msgBox_more_menu {
    position: absolute;
    /* z-index: 3; */
    left: 0;
    top: 48px;
    width: 105px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: ${MsgMore_bg_color};
    border: 1px solid ${MsgMore_border_color};
    box-shadow: 0px 0px 12px 4px rgba(0, 0, 0, 0.08);
  }

  .msgBox_more_menu_item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 25px;
    padding: 10px 16px;
    font-size: 14px;
    color: white;
    cursor: pointer;
  }

  .msgBox_more_menu_item:first-child {
    border-radius: 10px 10px 0 0;
  }
  .msgBox_more_menu_item:last-child {
    border-radius: 0 0 10px 10px;
  }
  .msgBox_more_menu_item:hover {
    background-color: #868585;
  }
  .msgBox_more_opt_item_icon {
    height: 14px;
    padding-right: 12px;
  }
  .msgBox_more_opt_item_text {
    color: white;
  }
  .delete .msgBox_more_opt_item_text {
    color: #ff543d;
  }
`

const PreviewImg = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100vh;
    max-height: 100vw;
  }
`

export default function Page({
  // widgetWidth,
  // widgetHeight,
  roomViewBgUrl,
  // useRoomFuncs,
  roomId,
  room,
  timelineWindow,
  loadTimeline,
  openUrlPreviewWidget,
  // pinnedIds,
  // setPinnedIds,
  pinEventSync,
  moreOperateMsg,
  setMoreOperateMsg,
  setShowReplyOrEditMsgDialog,
  inputFocus,
  setInputFocus,
  showMoreThumbsUpEmojiPanelRef,
  showMoreMenu,
  setShowMoreMenu,
  showMoreThumbsUpEmojiPanel,
  setShowMoreThumbsUpEmojiPanel,
  setShowMsgDeleteDialog,
  // showMsgDeleteDialog,
  // delStamp,
  memberAvatarClick,
  showCheckbox,
  onStartSelect,
  onCheckChanged,
  // setShowForward,
  handleJump,
  keepFocus,
  focusEventId,
  setFocusEventId
}: RoomViewProps) {
  const frequentThumbUpEmojiList = getFrequentThumbUpEmojiList() // frequent thumbup emojis list
  const moreThumbsUpEmojiList = getEmojis() // more thumbup emojis list
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const moreMenuRef = useRef<HTMLDivElement | null>(null)
  // const room = api._client.getRoom(roomId);
  const censor = useMemo(() => {
    return new Censor(filterLibrary.get())
  }, [])

  const [messages, setMessages] = useState<[] | SendingNetworkEvent[]>([])
  // const [currId, setCurrId] = useState<NodeJS.Timeout | number>(0)
  const [members, setMembers] = useState<[] | RoomMember[]>([])
  const [previewImgUrl, setPreviewImgUrl] = useState('')
  const [isShowPreviewImg, setIsShowPreviewImg] = useState(false)
  const [fetchBackwardLoading, setBackwardLoading] = useState(false)
  const [fetchForwardLoading, setForwardLoading] = useState(false)
  const [canStartFetchData, setCanStartFetchData] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [bottomDistance, setBottomDistance] = useState(1)
  const [lastDir, setLastDir] = useState('')
  const [loadingCount, setLoadingCount] = useState(0)
  const [, setFirstPageGap] = useState(0)
  const [isMounted, setIsMounted] = useState(true)
  const [showBottomBtn, setShowBottomBtn] = useState(false)
  const [, setScrolled] = useState(false)
  const [lastMsgTs, setLastMsgTs] = useState(0)
  // const [showMoreMenu, setShowMoreMenu] = useState(false); // whether display context menu when ringht click one msg
  // const [showMoreThumbsUpEmojiPanel, setShowMoreThumbsUpEmojiPanel] = useState(false); // whether display more thumbup emojis panel dialog
  const [showMoreThumbsUpEmojiPanelTop, setShowMoreThumbsUpEmojiPanelTop] = useState(0) // display more thumbup emojis panel dialog top position
  const [curReactions, setCurReactions] = useState<null | Relations>(null) // EventTile

  const getReactions = () => {
    // ReactionsPicker
    if (!curReactions) {
      return {}
    }
    const userId = api.getUserId()
    const myAnnotations = curReactions.getAnnotationsBySender()[userId] || []
    return Object.fromEntries(
      [...myAnnotations]
        .filter(event => !event.isRedacted())
        .map(event => [event.getRelation()?.key ?? '', event.getId()])
    )
  }

  const handlePinEvent = useCallback(
    (events: SendingNetworkEvent[]) => {
      for (const index in events) {
        if (events[index].event.type === 'm.room.pinned_events') {
          pinEventSync(events[index])
          break
        }
      }
    },
    [pinEventSync]
  )

  const msgCensorFilter = useCallback(
    (msgArr: any[]) => {
      const resultArr = msgArr || []
      for (let i = 0; i < resultArr.length; i++) {
        const msg = resultArr[i]?.event
        if (msg && msg.content && msg.content.msgtype === 'm.text') {
          const { text } = censor.filter(msg.content.body || '', { replace: true })
          resultArr[i]['event']['content']['body'] = text
        }
      }
      return resultArr
    },
    [censor]
  )

  const getAliasMsg = (
    eventId: string,
    sdnEvent: SendingNetworkEvent | undefined,
    replied_event_sender: string,
    value: string,
    msg: string,
    ts: number | undefined,
    isEdited: boolean
  ) => {
    const address = replied_event_sender.split(':')?.[1]
    const user = formatTextLength(address ?? '', 13, 5)
    return (
      <div className="alias_msg">
        {sdnEvent ? (
          <div className="alias_target_msg" onClick={() => handleJump(sdnEvent?.event.event_id ?? '')}>
            <div className="alias_target_msg_user">{user}</div>
            <div className="alias_target_msg_value">{value}</div>
          </div>
        ) : eventId ? (
          <div className="alias_target_msg">
            <div className="alias_target_loading">
              <div className="loading">loading...</div>
            </div>
          </div>
        ) : null}
        <span className="alias_treply_msg">{msg}</span>
        <p className="msg_time">{`${isEdited ? '(edited) ' : ''}${renderTime(ts)}`}</p>
      </div>
    )
  }

  // const onTimeLine = useCallback(
  //   (
  //     event: SendingNetworkEvent,
  //     room: Room,
  //     atStart: boolean,
  //     removed: boolean,
  //     data: { liveEvent: boolean; timeline: EventTimeline }
  //   ) => {
  //     console.log('onTimeLine event', event)
  //     if (event.getRoomId() !== roomId) return
  //     if (event.getType() == 'm.call.invite') return
  //     if (!data || !data.liveEvent) return
  //
  //     const eventArr = msgCensorFilter([event])
  //     handlePinEvent(eventArr)
  //     setMessages(messages => {
  //       return [...messages, ...eventArr]
  //     })
  //   },
  //   [handlePinEvent, msgCensorFilter, roomId]
  // )

  const onTimeLine = (
    event: SendingNetworkEvent,
    room: Room,
    atStart: boolean,
    removed: boolean,
    data: { liveEvent: boolean; timeline: EventTimeline }
  ) => {
    if (event.getRoomId() !== roomId) return
    if (event.getType() == 'm.call.invite') return
    if (!data || !data.liveEvent) return

    const eventArr = msgCensorFilter([event])
    handlePinEvent(eventArr)
    setMessages(messages => {
      return [...messages, ...eventArr]
    })
  }

  const initMessage = useCallback(() => {
    const events = timelineWindow.getEvents()
    // console.log('initMessage', events);
    msgCensorFilter(events)
    setMessages([...events])
    setBackwardLoading(false)
    if (events && events.length && events[0].getType() == 'm.room.create') {
      onAllLoaded()
    }
  }, [msgCensorFilter, timelineWindow])

  const initMembers = useCallback(() => {
    const members = room.getJoinedMembers()
    // members.forEach((m) => {
    //   if (!m.user) {
    //     const user = api._client.getUser(m.userId);
    //     const [, address] = m.userId.split(":");
    //     user.setWalletAddress(`0x${address}`);
    //     m.user = user;
    //   }
    // });
    setMembers(members)
  }, [room])

  const roomViewStart = useCallback(() => {
    // console.log('roomViewStart', messages);
    if (!lastMsgTs) {
      setTimeout(() => scrollToBottom, 200)
    }
    setLoadingCount(0)
    if (!messages || messages.length < 1) {
      initMembers()
      initMessage()
    } else {
      initMessage()
    }
  }, [lastMsgTs, messages, initMembers, initMessage])

  const queryMessage = useCallback(
    (oh: any, dir: undefined | 'f' | 'b') => {
      const direction = dir ?? 'b'
      if (direction === 'b') {
        setBackwardLoading(true)
      } else {
        setForwardLoading(true)
      }
      timelineWindow
        .paginate(direction, 20)
        .then(() => {
          if (!isMounted) return
          setLastDir(direction)
          setBackwardLoading(false)
          setForwardLoading(false)
          const events = timelineWindow.getEvents()
          if (!timelineWindow.canPaginate('b' as any)) {
            onAllLoaded()
          }
          msgCensorFilter(events)
          setMessages([...events])

          if (direction === 'b') {
            setTimeout(() => {
              // scrollToBottom(oh);
              keepDistance(oh)
            }, 200)
          }
        })
        .catch((e: any) => {
          console.log('paginate error', e)
          setBackwardLoading(false)
          setForwardLoading(false)
        })
    },
    [isMounted, msgCensorFilter, timelineWindow]
  )

  const handleScroll = useCallback(
    (e: any | undefined) => {
      if (e && !canStartFetchData) return
      if (fetchForwardLoading || fetchBackwardLoading) return
      if (wrapperRef?.current) {
        const { scrollTop, clientHeight, scrollHeight } = wrapperRef.current
        if (e) {
          setBottomDistance(scrollHeight - scrollTop)
          if (scrollTop + clientHeight - scrollHeight > -1) {
            setShowBottomBtn(false)
            if (timelineWindow && timelineWindow.canPaginate('f' as any) && !fetchForwardLoading) {
              wrapperRef.current.scrollTop = scrollHeight - 1
              queryMessage(0, 'f')
            }
          } else {
            setShowBottomBtn(true)
          }
          if (scrollTop < 1 && !fetchBackwardLoading && hasMore) {
            setBottomDistance(scrollHeight - 1)
            wrapperRef.current.scrollTop = 1
            queryMessage(scrollHeight - 1, undefined)
          }
        } else if (scrollHeight <= clientHeight && hasMore) {
          queryMessage(clientHeight - 1, undefined)
        }
      } else {
        setShowBottomBtn(false)
      }
    },
    [canStartFetchData, fetchBackwardLoading, fetchForwardLoading, hasMore, queryMessage, timelineWindow]
  )

  const applyMessages = useCallback(
    (messages: SendingNetworkEvent[]) => {
      const msg = messages[messages.length - 1]
      const ts = msg?.getTs()
      if (ts && ts > lastMsgTs) {
        setLastMsgTs(ts)
        if (msg.getType() === 'm.room.message') {
          scrollToBottom()
        }
      }
      setCanStartFetchData(true)
      handleScroll(undefined)
    },
    [handleScroll, lastMsgTs]
  )

  useEffect(() => {
    //TODO roomViewStart will cause update depth exceeded (messages change)
    setIsMounted(true)
    if (timelineWindow) {
      setCanStartFetchData(false)
      console.log('room view start execute')
      // console.log('timelineWindow changed', timelineWindow);
      roomViewStart()
      room.on('Room.timeline', onTimeLine)
    } else {
      setMessages([])
      setBackwardLoading(true)
    }
    return () => {
      setIsMounted(false)
      room.removeListener('Room.timeline', onTimeLine)
      api.eventEmitter && api.eventEmitter.emit && api.eventEmitter.emit('unReadCount')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineWindow])

  useLayoutEffect(() => {
    if (wrapperRef?.current && messages?.length) {
      // if (currId) {
      //   clearTimeout(currId)
      // }
      setTimeout(() => {
        applyMessages(messages)
      }, 10)
      // setCurrId(id)
    }
  }, [messages, applyMessages])

  // useEffect(() => {
  //   roomViewStart();
  // }, [delStamp])

  // const backLoad = (dir: 'f' | 'b') => {
  //   // console.log('backLoad', dir);
  //   if (timelineWindow && timelineWindow.canPaginate(dir as Direction)) {
  //     timelineWindow.paginate(dir as Direction, 100).then(() => {
  //       setTimeout(() => {
  //         backLoad(dir as Direction)
  //       }, 100)
  //     })
  //   } else {
  //     const messages = timelineWindow.getEvents()
  //     setMessages(messages)
  //     if (dir === 'f') {
  //       setLastMsgTs(messages[messages.length - 1]?.getTs())
  //     }
  //   }
  // }

  // fun

  const onAllLoaded = () => {
    setHasMore(false)
    if (scrollRef && scrollRef.current) {
      const total = scrollRef.current.clientHeight
      setFirstPageGap(Math.max(0, total))
    }
  }

  const formatSender = (sender: RoomMember | undefined) => {
    if (sender) {
      return formatTextLength(getMemberName(sender) ?? '', 13, 5)
    }
    return ''
  }

  const httpString = (s: any) => {
    if (!s) return null
    const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
    s = s.match(reg)
    return s
  }

  const replaceUrl = (str: string) => {
    const re = /(f|ht){1}(tp|tps):\/\/([\w-]+\S)+[\w-]+([\w-?%#&=]*)?(\/[\w- ./?%#&=]*)?/g
    str = str.replace(re, function (url: string) {
      return `<a class="url" href="${url}" target="_blank">${url}</a>`
    })
    return str
  }

  const replaceMention = (str: string) => {
    const re = /@\S*/g
    str = str.replace(re, function (url) {
      const name = url.slice(1, url.length)
      if (members.length > 0) {
        const member = members.find((m: RoomMember) => {
          return m.name === name || m.user?.displayName === name || m.userId === name
        })
        if (member) {
          return `<a class="mention" href="${url}">${url}</a>`
        } else {
          return url
        }
      }
      return str
    })
    return str
  }

  const renderTime = (time: any) => {
    return renderTs(time)
  }

  // const highlightAt = (bodyStr) => {
  //   let resultArr = [];
  //   if (bodyStr.indexOf(atUserName) !== -1) {
  //     const arr = bodyStr.split(atUserName);
  //     for (let i = 0; i < arr.length - 1; i++) {
  //       resultArr.push(arr[i]);
  //       resultArr.push(atUserName);
  //     }
  //     resultArr.push(arr[arr.length - 1]);
  //   }
  //   return resultArr
  // }

  const formatTextMsg = (body: string) => {
    if (!body) {
      return <span />
    }
    const urls = httpString(body)
    let dangrous = false
    if (urls && urls.length) {
      body = replaceUrl(body)
      dangrous = true
    }
    if (body.indexOf('\n') > -1) {
      body = body.replaceAll('\n', '<br/>')
      dangrous = true
    }
    if (body.indexOf('@') > -1) {
      body = replaceMention(body)
      dangrous = true
    }

    if (dangrous) {
      return <span dangerouslySetInnerHTML={{ __html: body }} />
    } else {
      return <span>{body}</span>
    }
  }

  const renderMsgContent = (
    room: Room,
    sdnEvent: SendingNetworkEvent,
    messages: SendingNetworkEvent[],
    globalPinned: { value: string[] }
  ) => {
    const message = sdnEvent.event as messageWithChange
    const { sender } = sdnEvent
    const senderUserId = sender.userId
    const senderName = formatSender(sender)
    const { content, type, origin_server_ts, unsigned } = message
    let msgContent = null
    if (type === 'm.room.pinned_events' && content) {
      const { pinned = [] } = content
      const userNick = formatSender(sender)
      // use prev content
      if (message.unsigned && message.unsigned.prev_content) {
        globalPinned.value = message.unsigned.prev_content.pinned || []
      }
      if (pinned.length > globalPinned.value.length) {
        msgContent = `${userNick} pinned a message`
      } else if (pinned.length < globalPinned.value.length) {
        msgContent = `${userNick} unpinned a message`
      } else if (pinned.length > 0) {
        msgContent = `${userNick} changed the pinned message`
      }
      globalPinned.value = pinned
    } else if (type === 'm.room.customized_events' && content) {
      const { body, icon, link, link_text } = content
      const userNick = formatSender(sender)
      msgContent = (
        <span className="red_envelope_event_item_cont">
          <img src={icon} alt="" />
          <a className="sender" onClick={() => memberAvatarClick(senderUserId)}>
            {userNick}
          </a>
          <span>{body.replace(link_text, '')}</span>
          <a className="link" onClick={() => openUrlPreviewWidget(link)}>
            {link_text}
          </a>
        </span>
      )
    } else if (type === 'm.room.create') {
      // debugger
      // console.log('alex061225: ', content, room)
      const roomName = room?.name ? calculateRoomName(room, true) : ''
      msgContent = (
        <p>
          <span className="member_event_item_highlight" onClick={() => memberAvatarClick(senderUserId)}>
            {senderName}&nbsp;
          </span>
          created the group {formatTextLastElide(roomName, 24)}
        </p>
      )
    } else if (type === 'm.room.member' && content) {
      // debugger
      // console.log('alex061225 m.room.member: ', content, sender, members)
      const { displayname, membership } = content
      if (membership === 'invite') {
        const targetName = formatTextLength(displayname ?? '', 13, 5)
        msgContent = (
          <p>
            <span className="member_event_item_highlight" onClick={() => memberAvatarClick(senderUserId)}>
              {senderName}&nbsp;
            </span>
            invited {targetName}
          </p>
        )
      } else if (
        membership === 'join' &&
        unsigned &&
        (!unsigned.prev_content || unsigned.prev_content?.membership === 'invite')
      ) {
        const joinName = formatTextLength(displayname || senderName, 13, 5)
        msgContent = (
          <p>
            <span className="member_event_item_highlight" onClick={() => memberAvatarClick(senderUserId)}>
              {joinName}&nbsp;
            </span>
            joined the room.
          </p>
        )
      }
    } else if (message.isDeleted && type !== 'm.reaction') {
      // debugger
      //
      msgContent = (
        <div className="deleted_msg">
          <img className="deleted_msg_icon" src={''} alt="" />
          <span className="deleted_msg_text">Message deleted</span>
        </div>
      )
    } else if (type === 'm.room.message' && content) {
      const { body, msgtype, ...other } = content
      const formatedBody = formatTextMsg(body)
      switch (msgtype) {
        case 'm.text':
          const urls = httpString(body)
          if (content?.['m.new_content']) {
            // edit msg -> only edited by myself -> sdm and sdn must edit msg in identical format
            // const edited_event_user = members.find(m => m.userId === senderUserId) // the user whose msg was edited
            msgContent = content?.['m.new_content'].body
            // @ts-expect-error: sdk missing type
          } else if (content && content?.['m.relates_to'] && content['m.relates_to']?.['m.in_reply_to']) {
            // reply msg
            // @ts-expect-error: sdk missing type
            const replied_event_Id = content['m.relates_to']?.['m.in_reply_to']?.event_id // replied msg‘s id
            const replied_event = room.findEventById(replied_event_Id ?? '') // replied msg(wrapped)
            const replied_event_sender = replied_event?.event?.sender // replied msg’s sender
            const replied_event_content = replied_event?.event?.content // replied msg's userid and content
            // const replied_event_user = members.find(m => m.userId === replied_event_sender) // replied msg's user
            // const user = formatSender(replied_event_user)
            let value = ''
            let msg = ''
            // const ts = renderTime(origin_server_ts)
            if (content?.body.match(/<@sdn_.+>/)) {
              // msg replied by sdm
              const index = content?.body.lastIndexOf(' ')
              const [, y] = content?.body.slice(index + 1).split('\n\n')
              if (
                replied_event_content &&
                replied_event_content?.body &&
                replied_event_content?.body.match(/<@sdn_.+>/)
              ) {
                // once parse -> handle later
                const _index = replied_event_content.body.lastIndexOf(' ')
                const [, _y] = replied_event_content.body.slice(_index + 1).split('\n\n')
                value = _y
                msg = y
              } else {
                value = replied_event_content?.body
                msg = y
              }
            } else {
              // msg edited by sdn
              value = replied_event_content?.body
              msg = content.body
            }
            msgContent = getAliasMsg(
              replied_event_Id,
              replied_event,
              replied_event_sender ?? '',
              value,
              msg,
              origin_server_ts,
              message?.isEdited
            )
          } else if (urls) {
            // msg contains link address
            const [urlBody] = urls
            msgContent = (
              <UrlPreviewComp
                url={urlBody}
                message={formatedBody}
                ts={origin_server_ts}
                time={`${message.isEdited ? '(edited) ' : ''}${renderTime(origin_server_ts)}`}
                isRight={senderUserId === room.myUserId}
                openUrlPreviewWidget={openUrlPreviewWidget}
                onPreviewLoaded={onPreviewLoaded}
                previewStart={previewStart}
              />
            )
          } else if (
            content?.format &&
            (content.format === 'org.sdn.custom.html' || content.format === 'org.matrix.custom.html')
          ) {
            // msg contains @somebody
            msgContent = formatedBody
          } else {
            msgContent = formatedBody
          }
          break
        case 'm.image':
        case 'm.gif':
          // debugger
          let url = other.url
          if (/^mxc\:\/\/.+/.test(url)) {
            url = api._client.mxcUrlToHttp(url)
          }
          msgContent = (
            <img
              style={{ maxWidth: '100%', cursor: 'pointer', marginTop: '2px' }}
              src={`${url}`}
              onClick={() => showPreviewImg(url)}
              alt=""
            />
          )
          break
        case 'm.file':
          msgContent = '[File]'
          break
        case 'nic.custom.confetti':
          msgContent = <span style={{ fontSize: '32px', lineHeight: '40px' }}>{body}</span>
          break
        default:
          break
      }
    }
    // console.log(msgContent)
    return msgContent
  }

  // dom
  const showPreviewImg = (url: string) => {
    setPreviewImgUrl(url)
    setIsShowPreviewImg(true)
  }

  const hidePreviewImg = () => {
    setPreviewImgUrl('')
    setIsShowPreviewImg(false)
    return false
  }

  const scrollToBottom = (oh = 0) => {
    const domWrapper = wrapperRef.current
    if (!domWrapper) return
    const h = domWrapper.scrollHeight - (oh || 0)
    // console.log('scrollToBottom', h, domWrapper.scrollHeight, oh);
    // const { scrollTop, clientHeight, scrollHeight } = wrapperRef.current;
    // console.log('scrollTop', scrollTop);
    // console.log('clientHeight', clientHeight);
    // console.log('scrollHeight', scrollHeight);
    domWrapper.scrollTo({
      left: 0,
      top: h
      // behavior: 'smooth'
    })
  }

  const keepDistance = (toBottom: number) => {
    const domWrapper = wrapperRef.current
    if (!domWrapper) return
    domWrapper.scrollTop = domWrapper.scrollHeight - toBottom
  }

  const jumpToLatest = useCallback(() => {
    setFocusEventId('')
    if (timelineWindow && timelineWindow.canPaginate('f' as any)) {
      loadTimeline(undefined).then()
      setTimeout(() => {
        scrollToBottom()
      }, 200)
    } else {
      scrollToBottom()
    }
  }, [loadTimeline, setFocusEventId, timelineWindow])

  const handleUserScroll = () => {
    setScrolled(true)
    if (loadingCount <= 0) {
      setFocusEventId('')
    }
  }

  const previewStart = useCallback(() => {
    // if (wrapperRef && wrapperRef.current) {
    //   const { clientHeight, scrollHeight, scrollTop } = wrapperRef.current;
    //   console.log('previewStart', [clientHeight, scrollHeight, scrollTop])
    //   if (clientHeight < scrollHeight) {
    //     const value = scrollHeight - scrollTop;
    //     setBottomDistance(value);
    //     return value
    //   }
    // }
    // return 0
    setLoadingCount(prev => prev + 1)
  }, [])

  const onPreviewLoaded = () => {
    // console.log('onPreviewLoaded', bottomDistance)
    // keepDistance(bottomDistance);
    setLoadingCount(prev => prev - 1)
    if (focusEventId) {
      keepFocus()
    } else if (lastDir === 'b') {
      keepDistance(bottomDistance)
    }
  }

  const renderSingle = useCallback(
    (room: Room, sdnEvent: SendingNetworkEvent) => {
      return renderMsgContent(room, sdnEvent, [], { value: [] })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const spawnMessageItems = (_messages: SendingNetworkEvent[]) => {
    if (!_messages || !_messages.length) {
      return null
    }
    let lastSdnEvent
    let sdnEvent

    let messages = clone(_messages)
    const len = messages.length
    // for (let i = 0; i < len; i++) {
    //   let msg = messages[i].event
    //   if (msg && msg.type === 'm.reaction') { // msg thumbuped
    //     const { sender, content } = msg; //
    //     // console.log('thumbup user：', msg)
    //     if (content['m.relates_to']) {
    //       const { event_id, key, rel_type } = content['m.relates_to'] // thumbuped msg
    //       let thumbupddMsg = messages.find(_msg => {
    //         return _msg && _msg.event.event_id === event_id
    //       });
    //       // console.log('---thumbupddMsg---', thumbupddMsg)
    //       if (thumbupddMsg) {
    //         thumbupddMsg.event.content.userThumbsUpEmojiList = []
    //       }
    //     }
    //   }
    // }
    for (let i = 0; i < len; i++) {
      const msg = messages[i].event
      if (msg && msg.content && msg.content['m.new_content']) {
        // edited msg
        const index = messages.findIndex((_msg: any) => {
          return _msg && _msg.event.event_id === msg.content['m.relates_to'].event_id
        })
        if (index > -1) {
          // messages[index] = messages[i]
          messages[index].event.content.body = msg.content['m.new_content'].body
          messages[index].event.isEdited = true
        }
        // do not show this event
        messages[i] = null
      }
      if (msg && msg.type === 'm.room.redaction') {
        // msg after deleting one msg
        const { redacts } = msg // deleted msg‘s evetn_id
        // console.error('deleted msg's evetn_id: ', msg, messages)
        const deletedMsg = messages.find((_msg: SendingNetworkEvent) => {
          return _msg && _msg.event.event_id === redacts
        })
        deletedMsg && (deletedMsg.event.isDeleted = true)
      }
      // if (msg && msg.type === 'm.reaction') { // msg after thumbuping
      //   const { sender, content } = msg; // user who has thumbuped
      //   // console.error('-----msg after thumbuping-----', msg)
      //   if (content['m.relates_to']) { // thumbup
      //     const { event_id, key, rel_type } = content['m.relates_to'] // thumbuped msg
      //     let thumbupddMsg = messages.find(_msg => { //thumbuped msg
      //       return _msg && _msg.event.event_id === event_id
      //     });
      //     // console.log('---thumbupddMsg---', thumbupddMsg)
      //     if (thumbupddMsg) {
      //       thumbupddMsg.event.content.userThumbsUpEmojiList = thumbupddMsg.event.content.userThumbsUpEmojiList || []
      //       userThumbsUpEmoji = thumbupddMsg.event.content.userThumbsUpEmojiList.find(item => (item.event_id === msg.event_id && item.key === key))
      //       if (!userThumbsUpEmoji) { // current msg has not yet thumbup current emoji
      //         thumbupddMsg.event.content.userThumbsUpEmojiList.push({
      //           event_id,
      //           key,
      //           rel_type,
      //           senderList: [sender]
      //         })
      //       } else { // current msg has thumbuped current emoji
      //         userThumbsUpEmoji.senderList.push(sender)
      //       }
      //     }
      //   } else { // cancle thumbuping
      //     if (userThumbsUpEmoji) {
      //       userThumbsUpEmoji.senderList = userThumbsUpEmoji.senderList.filter(item => item !== sender)
      //     }
      //   }
      // }
    }
    messages = messages.filter((msg: SendingNetworkEvent | null) => msg !== null)

    let currDelta = Number.MAX_SAFE_INTEGER
    const arr = []
    const todayTs = getEndOfDay(Date.now())
    const startOfDay = new Date(todayTs).setHours(0, 0, 0, 0)
    const startOfYesterday = startOfDay - 86400000
    const startOfWeek = startOfDay - 86400000 * 6
    const globalPinned = { value: [] }
    let str
    let viewIndex = 0
    for (let i = 0; i < messages.length; i++) {
      lastSdnEvent = i > 0 ? messages[i - 1] : null
      sdnEvent = messages[i]
      const msgContentView = renderMsgContent(room, sdnEvent, messages, globalPinned)
      if (!msgContentView) {
        continue
      }
      sdnEvent.viewIndex = viewIndex
      viewIndex++
      const delta = Math.ceil((todayTs - sdnEvent.getTs()) / 86400000)
      let group = 'day'
      if (sdnEvent.getTs() < startOfWeek) {
        group = 'default'
      } else if (sdnEvent.getTs() < startOfYesterday) {
        group = 'week'
      } else if (sdnEvent.getTs() < startOfDay) {
        group = 'yesterday'
      }
      if (currDelta - delta >= 1) {
        currDelta = delta
        str = 'Today'
        if (group === 'yesterday') {
          str = 'Yesterday'
        } else if (group === 'week') {
          str = getDayStr(new Date(sdnEvent.getTs()).getDay())
        } else if (group === 'default') {
          str = getGroupDateStr(sdnEvent.getTs())
        }
        arr.push(
          <DateSeparator className="date-separator" key={sdnEvent.getTs()}>
            <span>{str}</span>
          </DateSeparator>
        )
      }
      if (
        lastSdnEvent &&
        lastSdnEvent.getType() === 'm.room.message' &&
        sdnEvent.getType() === 'm.room.message' &&
        sdnEvent.getTs() - lastSdnEvent.getTs() < 120000 &&
        sdnEvent.getSender() === lastSdnEvent.getSender()
      ) {
        sdnEvent.combine = 3
        if (lastSdnEvent.combine == 3) {
          lastSdnEvent.combine = 2
        } else {
          lastSdnEvent.combine = 1
        }
      }
      let needShowCheckbox = showCheckbox
      if (sdnEvent.event?.isDeleted) {
        needShowCheckbox = false
      }
      if (sdnEvent.event?.type !== 'm.room.message') {
        needShowCheckbox = false
      }
      arr.push(
        <MessageItem
          roomId={roomId}
          key={sdnEvent.getId() || i}
          roomViewRef={wrapperRef}
          room={room}
          sdnEvent={sdnEvent}
          members={members}
          openUrlPreviewWidget={openUrlPreviewWidget}
          setShowMoreMenu={setShowMoreMenu}
          setMoreOperateMsg={setMoreOperateMsg}
          setCurReactions={setCurReactions}
          memberAvatarClick={memberAvatarClick}
          // group={group}
          // groupStr={str}
          msgContentView={msgContentView}
          showCheckbox={needShowCheckbox}
          onCheckChanged={onCheckChanged}
          handleUserScroll={handleUserScroll}
          onPreviewLoaded={onPreviewLoaded}
          handleJump={handleJump}
          previewStart={previewStart}
          renderSingle={renderSingle}
        />
      )
    }
    return arr
  }

  const closeMoreWrap = () => {
    // e.stopPropagation();
    // setShowMoreMenu(false);
    // setShowMoreThumbsUpEmojiPanel(false);
  }

  const handleEmotionClick = async (curEmoji: EmojiProps | EmojiBaseProps) => {
    console.log('handleEmotionClick')
    // click thumbup emoji -> ReactionPicker
    setShowMoreThumbsUpEmojiPanel(false)
    const myReactions = getReactions()
    console.log('handleEmotionClick myReactions', myReactions)
    if (myReactions.hasOwnProperty(curEmoji.unicode)) {
      await api._client.redactEvent(roomId, myReactions[curEmoji.unicode])
    } else {
      console.log('api._client.sendEvent')
      await api._client.sendEvent(roomId, 'm.reaction', {
        'm.relates_to': {
          rel_type: 'm.annotation',
          event_id: moreOperateMsg.event.event_id,
          key: curEmoji.unicode
        }
      })
      // dis.dispatch({ action: "message_sent", type: 'to thumbup' });
    }
  }
  const handleMoreThumbUpSwtich = (e: React.SyntheticEvent) => {
    // click more thumbup emojis dropdown button
    e.stopPropagation()
    if (!showMoreThumbsUpEmojiPanel && wrapperRef.current && moreMenuRef.current) {
      const { y } = moreMenuRef.current.getBoundingClientRect()
      const { y: _y } = wrapperRef.current.getBoundingClientRect()
      console.log('--------------', showMoreThumbsUpEmojiPanel, y, _y)
      setShowMoreThumbsUpEmojiPanelTop(y - _y + 38)
    }
    setShowMoreThumbsUpEmojiPanel(!showMoreThumbsUpEmojiPanel)
  }

  const handleReplyClick = async (e: any) => {
    e.stopPropagation()
    setShowMoreMenu(false)
    setShowReplyOrEditMsgDialog('reply')
    setInputFocus(!inputFocus)
  }
  // const handleForwardClick = async (e: any) => {
  //   // click selected msg for forward operation
  //   console.log('start forward message')
  //   e.stopPropagation()
  //   setShowMoreMenu(false)
  //   setShowForward()
  // }

  // const handlePinClick = async (e: any) => {
  //   e.stopPropagation()
  //   await api._client.setRoomAccountData(room.roomId, 'im.vector.room.read_pins', {
  //     event_ids: [
  //       ...(room.getAccountData('im.vector.room.read_pins')?.getContent()?.event_ids || []),
  //       moreOperateMsg?.event_id
  //     ]
  //   })
  //   // const ids = [...pinnedIds, moreOperateMsg.getId()];
  //   const ids = [moreOperateMsg.getId()]
  //   await api._client.sendStateEvent(room.roomId, 'm.room.pinned_events', { pinned: ids }, '')
  //   setPinnedIds(ids)
  //   setShowMoreMenu(false)
  // }

  // const handleUnPinClick = async (e: any) => {
  //   console.log('handleUnPinClick: ', moreOperateMsg)
  //   e.stopPropagation()
  //   // const targetId = moreOperateMsg.getId();
  //   // const ids = pinnedIds.filter(value => value !== targetId);
  //   const ids: string[] = []
  //   await api._client.sendStateEvent(room.roomId, 'm.room.pinned_events', { pinned: ids }, '')
  //   setPinnedIds(ids)
  //   setShowMoreMenu(false)
  // }

  const handleSelectClick = async (e: any) => {
    // click selected msg for forward operation
    console.log('start select message')
    e.stopPropagation()
    setShowMoreMenu(false)
    // setChecked(true);
    moreOperateMsg.checked = true
    onStartSelect(moreOperateMsg)
  }
  const handleEditClick = async (e: any) => {
    console.log('start edit message')
    e.stopPropagation()
    setShowMoreMenu(false)
    setShowReplyOrEditMsgDialog('edit')
    setInputFocus(!inputFocus)
  }
  const handleDeleteClick = async (e: any) => {
    console.log('start delete message')
    e.stopPropagation()
    setShowMsgDeleteDialog(true)
    setShowMoreMenu(false)
  }

  // const checkPinned = () => {
  //   if (pinnedIds && pinnedIds.length) {
  //     const targetId = moreOperateMsg.getId()
  //     if (pinnedIds.indexOf(targetId) > -1) {
  //       return true
  //     }
  //   }
  //   return false
  // }
  return (
    <RoomViewBox className="RoomViewBox">
      <Box
        className={['roomView'].join(' ')}
        sx={{
          width: '100%',
          height: '100%'
        }}
        style={{
          backgroundImage: `url(${roomViewBgUrl || ''})`,
          backgroundRepeat: roomViewBgUrl ? 'no-repeat' : '',
          backgroundSize: roomViewBgUrl ? 'auto 100%' : '100% auto'
        }}
      >
        <MsgMoreWrap className="msgBox_more_menu_wrap" onClick={closeMoreWrap}>
          <Box
            className="scroll-wrapper"
            sx={{
              height: '100%',
              overflowY: 'auto',
              scrollbarWidth: 'none'
            }}
            ref={wrapperRef}
            onScroll={handleScroll}
            onTouchMove={handleUserScroll}
            onWheel={handleUserScroll}
          >
            <Box
              sx={{
                minHeight: '100%'
              }}
              className="room-scroll"
              ref={scrollRef}
            >
              <div className="msg-first-page"></div>
              {hasMore ? (
                <div className="roomView_scroll_loader" key={'backward-loader'}>
                  Loading ...
                </div>
              ) : (
                <div className="roomView_scroll_noMore">-- This is the beginning of the conversation --</div>
              )}
              <div className="msg-top-station"></div>
              {spawnMessageItems(messages)}
              {fetchForwardLoading ? (
                <div className="roomView_scroll_loader" key={'forward-loader'}>
                  Loading ...
                </div>
              ) : null}
              <div className="msg-bottom-station"></div>
            </Box>
            {showBottomBtn ? (
              <Box
                sx={{
                  position: 'absolute',
                  width: 46,
                  borderRadius: '50%',
                  background: '#626262',
                  cursor: 'pointer',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                  height: 46,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  right: 20,
                  bottom: 60
                }}
                className="bottom-btn"
                onClick={() => {
                  jumpToLatest()
                }}
              >
                <ToBottomIcon />
              </Box>
            ) : null}

            {/* img preview */}
            {isShowPreviewImg && (
              <PreviewImg className="previewImg" onClick={hidePreviewImg}>
                <img src={previewImgUrl} onClick={e => e.stopPropagation()} alt="" />
              </PreviewImg>
            )}

            {showMoreMenu && (
              // <div className="msgBox_more_menu_wrap" onClick={closeMoreWrap}>
              <MsgMoreContainer
                onClick={() => {
                  alert('MsgMoreContainer click')
                }}
                ref={moreMenuRef}
                className="msgBox_more msgBox_more_right"
                style={{
                  left: `${
                    showMoreMenu.left + 240 < showMoreMenu.wWidth ? showMoreMenu.left : showMoreMenu.wWidth - 240
                  }px`,
                  top: `${
                    showMoreMenu.top + 210 < showMoreMenu.wHeight ? showMoreMenu.top : showMoreMenu.wHeight - 210
                  }px`
                }}
              >
                {/* <div className="msgBox_more msgBox_more_right"> */}
                <span
                  className="msgBox_more_frequent_thumbsUp_emojs_item"
                  onClickCapture={() => handleEmotionClick(frequentThumbUpEmojiList[0])}
                >
                  {frequentThumbUpEmojiList[0].unicode}
                </span>
                <span
                  className="msgBox_more_frequent_thumbsUp_emojs_item"
                  onClickCapture={() => handleEmotionClick(frequentThumbUpEmojiList[1])}
                >
                  {frequentThumbUpEmojiList[1].unicode}
                </span>
                <span
                  className="msgBox_more_frequent_thumbsUp_emojs_item"
                  onClickCapture={() => handleEmotionClick(frequentThumbUpEmojiList[2])}
                >
                  {frequentThumbUpEmojiList[2].unicode}
                </span>
                <span
                  className="msgBox_more_frequent_thumbsUp_emojs_item"
                  onClickCapture={() => handleEmotionClick(frequentThumbUpEmojiList[3])}
                >
                  {frequentThumbUpEmojiList[3].unicode}
                </span>
                <span
                  className="msgBox_more_frequent_thumbsUp_emojs_item"
                  onClickCapture={() => handleEmotionClick(frequentThumbUpEmojiList[4])}
                >
                  {frequentThumbUpEmojiList[4].unicode}
                </span>
                {/* <span className="msgBox_more_frequent_thumbsUp_emojs_item" onClick={() => handleEmotionClick(frequentThumbUpEmojiList[5])}>{frequentThumbUpEmojiList[5].unicode}</span> */}
                {/* <img className={['msgBox_more_img', 'thumb_up_switch', showMoreThumbsUpEmojiPanel && 'active'].join(' ')} src={showMoreThumbsUpEmojiPanel ? moreThumbUpSwitchIcons[1] : moreThumbUpSwitchIcons[0]} onClick={handleMoreThumbUpSwtich} /> */}
                <span
                  className={['msgBox_more_img', 'thumb_up_switch', showMoreThumbsUpEmojiPanel && 'active'].join(' ')}
                  ref={showMoreThumbsUpEmojiPanelRef}
                  onClick={(e: React.SyntheticEvent) => handleMoreThumbUpSwtich(e)}
                />
                {!showMoreThumbsUpEmojiPanel && (
                  <div className="msgBox_more_menu msgBox_more_menu_right">
                    <div className="msgBox_more_menu_item reply" onClickCapture={handleReplyClick}>
                      <img className="msgBox_more_opt_item_icon" src={msgMoreOptIcon[0]} alt="" />
                      <div className="msgBox_more_opt_item_text">Reply</div>
                    </div>
                    {/* <div className="msgBox_more_menu_item forward" onClickCapture={handleForwardClick}>
                      <img className="msgBox_more_opt_item_icon" src={msgMoreOptIcon[1]} alt="" />
                      <div className="msgBox_more_opt_item_text">Forward</div>
                    </div> */}
                    {/* <div
                      className="msgBox_more_menu_item pin"
                      onClickCapture={checkPinned() ? handleUnPinClick : handlePinClick}
                    >
                      <img className="msgBox_more_opt_item_icon" src={msgMoreOptIcon[2]} alt="" />
                      <div className="msgBox_more_opt_item_text">{checkPinned() ? 'UnPin' : 'Pin'}</div>
                    </div> */}
                    <div className="msgBox_more_menu_item select" onClickCapture={handleSelectClick}>
                      <img className="msgBox_more_opt_item_icon" src={msgMoreOptIcon[3]} alt="" />
                      <div className="msgBox_more_opt_item_text">Select</div>
                    </div>
                    {moreOperateMsg.event.sender === room.myUserId && (
                      <div className="msgBox_more_menu_item edit" onClickCapture={handleEditClick}>
                        <img className="msgBox_more_opt_item_icon" src={msgMoreOptIcon[4]} alt="" />
                        <div className="msgBox_more_opt_item_text">Edit</div>
                      </div>
                    )}
                    {moreOperateMsg.event.sender === room.myUserId && (
                      <div className="msgBox_more_menu_item delete" onClickCapture={handleDeleteClick}>
                        <img className="msgBox_more_opt_item_icon" src={msgMoreOptIcon[5]} alt="" />
                        <div className="msgBox_more_opt_item_text">Delete</div>
                      </div>
                    )}
                  </div>
                )}
              </MsgMoreContainer>
              // </div>
            )}

            {showMoreThumbsUpEmojiPanel && (
              <div className="msgBox_more_emojs_panel" style={{ top: showMoreThumbsUpEmojiPanelTop }}>
                {moreThumbsUpEmojiList.map((emoji, emojiIndex) => {
                  return (
                    <Box
                      className="msgBox_more_thumbsUp_emojs_item"
                      key={emojiIndex}
                      onClick={() => handleEmotionClick(emoji)}
                    >
                      <span>{emoji.unicode}</span>
                    </Box>
                  )
                })}
              </div>
            )}

            {/*{emotionSrc && (
              <div className="msgBox_emotion_wrap" onClick={closeMoreWrap}>
                <img className="msgBox_more_img_active" src={emotionSrc} />
              </div>
            )}*/}
          </Box>
        </MsgMoreWrap>
      </Box>
    </RoomViewBox>
  )
}
