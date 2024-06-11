import { Box, styled } from '@mui/material'
import UserAvatar from '../components/userAvatar'
import { getEventById, getMemberName, isMobile, renderTs } from '../utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api'
import { Room, RoomMember, SendingNetworkEvent } from 'sendingnetwork-js-sdk'
import ThumbupRow from './thumbupRow'
import { EventType, RelationType } from 'sendingnetwork-js-sdk/lib/@types/event'
import { Relations } from 'sendingnetwork-js-sdk/lib/models/relations'
import Checkicon from '../assets/svg/check.svg'
import Circleicon from '../assets/svg/circle.svg'

interface MessageItemProps {
  roomId: string
  roomViewRef: any
  room: Room
  sdnEvent: any
  members: RoomMember[] | []
  setShowMoreMenu: any
  setMoreOperateMsg: any
  setCurReactions: any
  memberAvatarClick: any
  // group: any
  // groupStr: any
  msgContentView: any
  showCheckbox: any
  onCheckChanged: any
  openUrlPreviewWidget: any
  handleUserScroll: any
  onPreviewLoaded: any
  handleJump: any
  previewStart: any
  renderSingle: (room: Room, sdnEvent: SendingNetworkEvent) => any
}

const ContentViewBox = styled(Box)`
  .member_event_item {
    // border: 1px solid pink;
    display: flex;
    justify-content: center;
    align-items: center;
    // text-align: center;
    margin-top: 5px;
    p {
      background-color: #454545;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      color: white;
      font-weight: bold;
    }
  }
  .pin_event_item,
  .red_envelope_event_item {
    text-align: center;
    margin-top: 5px;
  }
  .msgItem.checked {
    background: #3c3d3e;
  }
  // .right-showing-checkbox {
  // }
  .message_item {
    padding: 0 24px;
    position: relative;
    .msg_checkbox {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      position: absolute;
      top: 16px;
    }
  }
`
const DialogBoxShared = styled(Box)`
  font-size: 15px;
  // border: 1px solid pink;

  color: white;
  // padding: 8px;
  margin-top: 5px;
  .msg_info_shared {
    // width: calc(50% - 40px);
    // min-width: calc(50% - 40px);
    max-width: calc(70%);
    //min-width: calc(50%);
    background-color: #1f1f1f;
    padding: 16px;
    border-radius: 12px;
    // color: black;
    position: relative;
    .msgBox_left_info_msg {
      span {
        line-break: anywhere;
      }
    }
  }
  .alias_msg {
    .alias_target_msg {
      cursor: pointer;
      border-left: 3px solid #1a76ff;
      padding: 0 6px 0 8px;
      margin: 4px 0 6px 0;
      .alias_target_msg_user {
        color: white;
      }
      .alias_target_msg_value {
        color: white;
        // font-size: 100px;
        font-size: 0.8em;
      }
    }
  }
`
const RightDialogBox = styled(DialogBoxShared)`
  .msgBox_right_info {
    background-color: white;
    color: black;
    border-top-right-radius: 0;
  }
  .alias_msg {
    .alias_target_msg {
      border-left: 3px solid #1a76ff;
      .alias_target_msg_user {
        color: black;
      }
      .alias_target_msg_value {
        color: black;
      }
    }
  }
`
const LeftDialogBox = styled(DialogBoxShared)`
  // display: flex;
  display: flex;
  .avatar_container {
    float: left;
    min-width: 32px;
  }
  .msgBox_left_info {
    margin-left: 20px;
    background: linear-gradient(83.81deg, #7462f8 -5.97%, #b750ea 101.61%);
    border-top-left-radius: 0;
  }
  .msgBox_left_info_user {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
`
const TimeDiv = styled('div')`
  text-align: right;
  // float: right;
  font-size: 10px;
`

export default function Page({
  roomId,
  roomViewRef,
  room,
  sdnEvent,
  members,
  setShowMoreMenu,
  setMoreOperateMsg,
  setCurReactions,
  memberAvatarClick,
  // group,
  // groupStr,
  msgContentView,
  showCheckbox,
  onCheckChanged,
  openUrlPreviewWidget,
  handleUserScroll,
  onPreviewLoaded,
  handleJump,
  previewStart,
  renderSingle
}: MessageItemProps) {
  roomViewRef
  const messageItemRef = useRef<HTMLDivElement | null>(null)
  const message = sdnEvent.event // raw event
  const { combine } = sdnEvent // RoomMember
  let sender = sdnEvent
  if (!sender || !sender.user) {
    sender = room.getMember(message.sender)
  }
  const { event_id, type, content, origin_server_ts } = message
  const msgtype = content?.msgtype || ''
  const isImage = type === 'm.room.message' && (msgtype === 'm.image' || msgtype === 'm.gif') && !message.isDeleted
  const userId = room.myUserId
  // console.log('Mart userId---------', userId)
  const senderId = sender ? sender.userId : '' // user who has sent current msg
  const [checked, setChecked] = useState(false)
  const [replyEvent, setReplyEvent] = useState(null)
  const [contentView, setContentView] = useState(msgContentView)
  const showReactions = true // RoomView
  const timelineSet = room.getUnfilteredTimelineSet() // RoomView

  const getRelationsForEvent = useCallback(
    (
      // TimelinePanel
      eventId: string,
      relationType: RelationType,
      eventType: EventType | string
    ) => timelineSet.getRelationsForEvent(eventId, relationType, eventType),
    [timelineSet]
  )
  const getReactions = useCallback(() => {
    // EventTile
    if (!showReactions || !getRelationsForEvent) {
      return null
    }
    return getRelationsForEvent(event_id, 'm.annotation' as RelationType, 'm.reaction')
  }, [showReactions, event_id, getRelationsForEvent])
  const [reactions, setReactions] = useState<null | Relations | undefined>(null) // EventTile

  const onReactionsCreated = useCallback(
    (relationType: RelationType, eventType: string) => {
      // EventTile
      console.log('---Event.relationsCreated---', onReactionsCreated)
      if (relationType !== 'm.annotation' || eventType !== 'm.reaction') {
        return
      }
      sdnEvent.removeListener('Event.relationsCreated', onReactionsCreated)
      setReactions(getReactions())
    },
    [getReactions, sdnEvent]
  )
  // const targetEvent = new SendingNetworkEvent({
  //   sender: message.sender,
  //   type: type,
  //   event_id: event_id,
  //   room_id: roomId,
  //   content: content
  // })
  useEffect(() => {
    let isMounted = true
    // room.on("Room.receipt", onRead);
    if (content['m.relates_to'] && content['m.relates_to']['m.in_reply_to']) {
      // reply msg
      const replied_event_Id = content['m.relates_to']['m.in_reply_to'].event_id // replied msg‘s id
      if (!replied_event_Id) {
        return
      }
      const replied_event = room.findEventById(replied_event_Id)
      if (!replied_event) {
        previewStart()
        getEventById(roomId, replied_event_Id, false, true)
          .then(res => {
            if (!isMounted) return
            setReplyEvent(res as any)
          })
          .catch()
      }
    }
    // console.log('???????????1')
    api.on('highlightRelateReply', id => {
      // console.log('???????????2')
      if (id === 'message_item_' + event_id) {
        const clickTarget = messageItemRef.current as HTMLDivElement
        if (!clickTarget) {
          return
        }
        handleUserScroll()
        clickTarget.scrollIntoView({
          block: 'center',
          behavior: 'auto'
        })
        clickTarget.style.backgroundColor = '#D2D5D9'
        setTimeout(() => {
          clickTarget.style.backgroundColor = 'unset'
        }, 2000)
      }
    })

    if (showReactions) {
      // EventTile
      sdnEvent.on('Event.relationsCreated', onReactionsCreated)
      setReactions(getReactions())
    }
    return () => {
      isMounted = false
      // room.off("Room.receipt", onRead);
      if (showReactions) {
        // EventTile
        sdnEvent.removeListener('Event.relationsCreated', onReactionsCreated)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderTime = useCallback(() => {
    return renderTs(origin_server_ts)
  }, [origin_server_ts])
  const getAliasMsg = useCallback(
    (event: any, user: string, value: string, msg: string, ts: number, isEdited: boolean) => {
      return (
        <div className="alias_msg">
          {event ? (
            <div className="alias_target_msg" onClick={() => handleJump(event.event_id)}>
              <div className="alias_target_msg_user">{user}</div>
              <div className="alias_target_msg_value">{value}</div>
            </div>
          ) : null}
          <span className="alias_treply_msg">{msg}</span>
          <p className="msg_time">{`${isEdited ? '(edited) ' : ''}${renderTime()}`}</p>
        </div>
      )
    },
    [handleJump, renderTime]
  )

  const coverAliasMsg = useCallback(
    (event: any) => {
      const replied_event_sender = event.sender // replied msg’s sender
      const replied_event_content = event.content // replied msg's userid and content
      const replied_event_user = room.getMembers().find(m => m.userId === replied_event_sender) // replied msg's user
      const user = getMemberName(replied_event_user)
      let value = ''
      let msg = ''
      if (content.body.match(/<@sdn_.+>/)) {
        // msg replied by sdm
        const index = content.body.lastIndexOf(' ')
        const [, y] = content.body.slice(index + 1).split('\n\n')
        if (replied_event_content && replied_event_content?.body && replied_event_content?.body.match(/<@sdn_.+>/)) {
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
      const msgContent = getAliasMsg(event, user ?? '', value, msg, origin_server_ts, message.isEdited)
      setContentView(msgContent)
    },
    [content.body, getAliasMsg, message.isEdited, origin_server_ts, room]
  )

  useEffect(() => {
    if (sdnEvent) {
      setChecked(sdnEvent.checked)
    }
  }, [sdnEvent?.checked, sdnEvent])

  useEffect(() => {
    if (replyEvent) {
      coverAliasMsg(replyEvent)
      onPreviewLoaded()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyEvent])

  const httpString = (s: any) => {
    if (!s) return null
    const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
    s = s.match(reg)
    return s
  }

  const onTouchMsgItem = (e: any) => {
    if (isMobile()) {
      clickMsgItem(e)
    }
  }

  const onContext = (e: any) => {
    if (!isMobile()) {
      clickMsgItem(e)
    }
  }

  // const clickMsgItem = (e: any) => {
  //   // open msg more operations dialog when clicked one msg
  //   if (showCheckbox) return
  //   if (sdnEvent.event.isDeleted) return // forbid more operations for deleted msg
  //   e.stopPropagation()
  //   e.preventDefault() // prevent right mouse default operations

  //   const { x, y } = roomViewRef?.current.getBoundingClientRect()
  //   console.log('position information：', [e, e.target, e.clientX, x, e.clientY, y, e.pageX, e.pageY])
  //   // setShowMoreMenu(true);
  //   // setShowMoreMenu({ left: e.clientX - x, top: e.clientY - y });
  //   const [left, top] = [e.clientX - x, e.clientY - y]
  //   console.log({ left, top })

  //   setShowMoreMenu({ left, top })
  //   setMoreOperateMsg(sdnEvent)
  //   setCurReactions(reactions)
  // }
  const clickMsgItem = (e: MouseEvent) => {
    // open msg more operations dialog when clicked one msg
    if (showCheckbox) return
    if (sdnEvent.event.isDeleted) return // forbid more operations for deleted msg
    e.stopPropagation()
    e.preventDefault() // prevent right mouse default operations

    const { clientX, clientY } = e

    const position = {
      left: clientX,
      top: clientY,
      wWidth: window.innerWidth,
      wHeight: window.innerHeight
    }

    console.log(position)
    // console.log('position information:', position)

    setShowMoreMenu(position)
    setMoreOperateMsg(sdnEvent)
    setCurReactions(reactions)
  }

  const isPreviewCard = () => {
    const { body } = content
    const urls = httpString(body)
    if (type === 'm.room.message' && msgtype === 'm.text' && urls) {
      return true
    }

    return false
  }

  const showTime = () => {
    if (message.isDeleted) {
      return false
    }
    if (isPreviewCard()) {
      return false
    }
    if (content['m.relates_to']) {
      return false
    }
    return true
  }

  const shouldShowUserName = () => {
    if (room?.getJoinedMemberCount() <= 2 || room?.isDmRoom()) {
      return false
    } else if (combine == 2 || combine == 3) {
      return false
    } else {
      return true
    }
  }

  const handleClick = (e: any) => {
    // click to select one msg
    if (showCheckbox) {
      // const next = !checked;
      // setChecked(next);
      const next = !sdnEvent.checked
      sdnEvent.checked = next
      onCheckChanged(sdnEvent, next)
    }
    // console.log('target', e?.target);
    if (e?.target?.href) {
      const innerHtml = e.target.innerHTML
      if (innerHtml.startsWith('@')) {
        const userName = innerHtml.slice(1, innerHtml.length)
        const member = members.find(m => getMemberName(m) === userName)
        if (member) {
          memberAvatarClick(member.userId)
        }
      } else {
        openUrlPreviewWidget(e.target.href)
      }
      // e.stopPropagation()
      // e.preventDefault()
    }
  }

  useEffect(() => {
    const value = !!sdnEvent._replacingEvent
    if (sdnEvent?.event) {
      sdnEvent.event.isEdited = value
    }
    setContentView(renderSingle(room, sdnEvent))
    onPreviewLoaded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdnEvent?._replacingEvent])

  return contentView ? (
    <ContentViewBox>
      <div className={`msgItem ${checked ? 'checked' : ''}`} ref={messageItemRef} onClick={handleClick}>
        {type === 'm.room.message' && (
          <div className={`message_item${combine ? ' combine' + combine : ''}`}>
            {showCheckbox ? <div className="msg_checkbox">{checked ? <Checkicon /> : <Circleicon />}</div> : null}
            {senderId === userId ? (
              <RightDialogBox
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
                key={event_id}
                // className={`${showCheckbox ? 'right-showing-checkbox' : ''}`}
              >
                <div className={`msg_info_shared msgBox_right_info${combine ? ' combine' + combine : ''}`}>
                  <Box
                    sx={{
                      '&.msgBox_right_info_msg': {
                        wordBreak: 'break-word'
                      }
                    }}
                    className={[
                      'msgBox_right_info_msg',
                      message.isDeleted && 'wrapper_deleted_msg',
                      isImage && 'image'
                    ].join(' ')}
                    onClick={onTouchMsgItem}
                    onContextMenu={onContext}
                  >
                    {message.isDeleted ? <p>Message deleted</p> : contentView}
                    {showTime() && (
                      <TimeDiv className="msg_time">{`${message.isEdited ? '(edited) ' : ''}${renderTime()}`}</TimeDiv>
                    )}
                  </Box>
                  {!message.isDeleted && (
                    <ThumbupRow mxEvent={sdnEvent} reactions={reactions} isOwn={true} room={room} />
                  )}
                </div>
              </RightDialogBox>
            ) : (
              <LeftDialogBox
                style={{ marginLeft: showCheckbox ? '48px' : '' }}
                className={`msgBox_left${showCheckbox ? ' show-checkbox' : ''}`}
                key={message.event_id}
              >
                <div className="avatar_container">
                  {combine == 2 || combine == 3 ? (
                    <Box className="combined_box" />
                  ) : (
                    <Box className="avatar_box" onClick={() => memberAvatarClick(sender.userId)}>
                      <UserAvatar member={sender} user={undefined} />
                    </Box>
                  )}
                </div>

                <div className={`msg_info_shared msgBox_left_info${combine ? ' combine' + combine : ''}`}>
                  {shouldShowUserName() && <p className="msgBox_left_info_user">{getMemberName(sender)}</p>}
                  <Box
                    sx={{
                      '&.msgBox_left_info_msg': {
                        wordBreak: 'break-word'
                      }
                    }}
                    className={[
                      'msgBox_left_info_msg',
                      isPreviewCard() && 'msgBox_show_card',
                      message.isDeleted && 'wrapper_deleted_msg',
                      isImage && 'image'
                    ].join(' ')}
                    onClick={onTouchMsgItem}
                    onContextMenu={onContext}
                  >
                    {contentView}
                    {showTime() && (
                      <TimeDiv className="msg_time">{`${message.isEdited ? '(edited) ' : ''}${renderTime()}`}</TimeDiv>
                    )}
                  </Box>
                  {!message.isDeleted && (
                    <ThumbupRow mxEvent={sdnEvent} reactions={reactions} isOwn={false} room={room} />
                  )}
                </div>
              </LeftDialogBox>
            )}
          </div>
        )}

        {/* m.room.pinned_events */}
        {type === 'm.room.pinned_events' && <div className="pin_event_item">{contentView}</div>}

        {/* m.room.customized_events */}
        {type === 'm.room.customized_events' && <div className="red_envelope_event_item">{contentView}</div>}

        {/* m.room.member event */}
        {type === 'm.room.member' && <div className="member_event_item">{contentView}</div>}

        {/* m.room.create event */}
        {type === 'm.room.create' && <div className="member_event_item">{contentView}</div>}
      </div>
    </ContentViewBox>
  ) : null
}
