import { Stack, styled } from '@mui/material'
import { api } from '../api'
import React, { useRef, useEffect, useState, useCallback } from 'react'
// import RoomTitle from "./roomTitle/roomTitle";
import RoomView from './roomView'
import RoomInput from './roomInput'
// import RoomProfile from "./roomProfile/roomProfile";
// import PinnedMsgCard from "./pinnedMsgCard/pinnedMsgCard";
// import InvitePage from "../invitePage/invitePage";
// import MemberProfile from "./memberProfile/memberProfile";
// import WebviewComp from "../webViewComp/webViewComp";
// import RoomInput from "./roomView/roomInput/roomInput";
import MultiselectArea, { SelectSendingNetworkEvent } from './multiselectArea'
// import MsgForward from "./msgForward/msgForward";
import { renderAnimation } from '../utils'
import { Room, SendingNetworkEvent, TimelineWindow } from 'sendingnetwork-js-sdk'
import ChatIcon from '../assets/svg/chat.svg'

interface RoomPageProps {
  roomViewBgUrl: string
  useRoomFuncs: string
  roomId: string
  clubRoom: Room | undefined
  // callback: () => void
  uploadFile?: () => void
  widgetWidth?: number | string
  widgetHeight?: number | string
}

const HeaderBox = styled('div')`
  z-index: 1;
  height: 68px;
  width: 100%;
  background: #0d0d0d;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 16px 20px 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: inline-flex;
    height: 100%;
    align-items: center;
    .icon {
      margin-right: 18px;
    }
  }
  .right {
    background: #20e165;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
`

const RoomPageStyled = styled(Stack)`
  /* delet msg dialog */
  .chat_widget_room_page {
    position: relative;
  }
  .msg_delete_dialog {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }
  .msg_delete_dialog_content {
    width: calc(100% - 56px);
    height: 160px;
    background: #fff;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
  }
  .msg_delete_dialog_content .info {
    width: 100%;
    height: calc(100% - 56px);
    margin-top: 28px;
    color: #1b1b1b;
    text-align: center;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .msg_delete_dialog_content .btns {
    width: 100%;
    height: 56px;
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    display: flex;
    cursor: pointer;
  }
  .msg_delete_dialog_content .btns-item {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .msg_delete_dialog_content .btns-cancel {
    border-right: 1px solid rgba(0, 0, 0, 0.07);
    color: #1b1b1b;
  }
  .msg_delete_dialog_content .btns-confirm {
    color: #f03738;
  }
`
export default function Page({
  widgetWidth,
  widgetHeight,
  roomViewBgUrl,
  useRoomFuncs,
  roomId,
  clubRoom,
  // callback,
  uploadFile
}: RoomPageProps) {
  const roomPageRef = useRef(null)
  const showMoreThumbsUpEmojiPanelRef = useRef(null)
  const [curRoomId] = useState(roomId)
  const [curRoom, setCurRoom] = useState<null | Room>(null)
  const [, setShowWebview] = useState(false)
  const [, setWebviewUrl] = useState<string>('')
  const [showType, setShowType] = useState<string>('room')
  const [pinnedIds, setPinnedIds] = useState<string[] | []>([]) // pinned msg collecions：display in roomPage Com，open in roomView Com，close in roomPage Com
  const [moreOperateMsg, setMoreOperateMsg] = useState<null | SendingNetworkEvent>(null) // msg which is operating ：display in roominput Com(reply/edit)/display in roomPage Com(delete)，seting in messageItem Com
  const [showReplyOrEditMsgDialog, setShowReplyOrEditMsgDialog] = useState('') // whether display replied/edited msg dialog：diaplay in roominput Com，open in messageItem Com，close in roomInput Com
  const [inputFocus, setInputFocus] = useState(false) // focus roomInput Com
  const [showMsgDeleteDialog, setShowMsgDeleteDialog] = useState(false) // whether display deleteing msg submit dialog，display in roomPage Com，open in messageItem Com，close in roomPage Com
  const [closeEmoji] = useState('')
  const [, setMemberProfileId] = useState<string>('')
  // const [, setIsDMRoom] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState<
    { left: number; top: number; wWidth: number; wHeight: number } | false
  >(false) // whether display context menu when ringht click one msg
  const [showMoreThumbsUpEmojiPanel, setShowMoreThumbsUpEmojiPanel] = useState(false) // whether display more thumbup emojis panel dialog
  const [showCheckbox, setShowCheckbox] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<[] | SendingNetworkEvent[]>([])
  const [, setDelStamp] = useState('') // fix roomView com doesn't update instance afete delete msg operatiob
  const [timelineWindow, setTimelineWindow] = useState<TimelineWindow | null>(null)
  const [focusEventId, setFocusEventId] = useState<string>('')

  const initRoomData = useCallback((clubRoom: Room | undefined) => {
    if (clubRoom) {
      initPinnedEvent(clubRoom)
      setCurRoom(clubRoom)
      const set = clubRoom.getUnfilteredTimelineSet()
      const win = new TimelineWindow(api._client, set)
      const events = clubRoom.getLiveTimeline().getEvents()
      if (events.length) {
        const lastEvent = events[events.length - 1]
        api._client.sendReadReceipt(lastEvent)
      }
      win.load('', 20).then()
      setTimelineWindow(win as any)
    }
  }, [])

  useEffect(() => {
    initRoomData(clubRoom)
  }, [clubRoom, initRoomData])

  useEffect(() => {
    setTimeout(() => {
      roomPageRef.current && renderAnimation(roomPageRef.current, 'animate__slideInRight')
    }, 20)
  }, [])

  const initPinnedEvent = (room: Room) => {
    const pinnedList = room?.currentState?.getStateEvents('m.room.pinned_events', '')?.getContent().pinned || []
    setPinnedIds(pinnedList)
  }

  const handleJump = async (eventId: string) => {
    const sdnEvent = timelineWindow?.getEvents().find((event: SendingNetworkEvent) => {
      return event.getId() === eventId
    })
    setFocusEventId(eventId)
    if (sdnEvent) {
      jumpLinkMsg(eventId)
    } else {
      await loadTimeline(eventId)
      setTimeout(() => {
        jumpLinkMsg(eventId)
      }, 300)
    }
  }

  const loadTimeline = async (eventId: string | undefined) => {
    const set = curRoom?.getUnfilteredTimelineSet()
    if (set) {
      const win = new TimelineWindow(api._client, set)
      setTimelineWindow(null)
      const res = await win.load(eventId ?? '', 20)
      setTimelineWindow(win as any)
      return res
    } else return undefined
  }

  const keepFocus = () => {
    if (focusEventId) {
      jumpLinkMsg(focusEventId)
    }
  }

  const jumpLinkMsg = (id: string) => {
    api.eventEmitter && api.eventEmitter.emit && api.eventEmitter.emit('highlightRelateReply', 'message_item_' + id)
  }

  const openUrlPreviewWidget = (url: string) => {
    setShowWebview(true)
    setWebviewUrl(url)
  }

  // const onBack = () => {
  //   const room = api._client.getRoom(curRoomId)
  //   if (room) {
  //     const events = room.getLiveTimeline().getEvents()
  //     if (events.length) {
  //       api._client.sendReadReceipt(events[events.length - 1])
  //     }
  //   }
  //   setCurRoomId('')
  //   setCurRoom(null)
  //   callback()
  // }

  const pinEventSync = (eventData: any) => {
    const {
      content: { pinned }
    } = eventData
    setPinnedIds(pinned)
  }

  const handleSureDeleteMsg = async () => {
    // handle delete msg submit
    const reason = 'bad message must delete'
    setShowMsgDeleteDialog(false)
    try {
      await api._client.redactEvent(curRoomId, moreOperateMsg?.getId() ?? '', undefined, reason ? { reason } : {})
      setDelStamp(Math.random().toString())
    } catch (e: any) {
      console.error('error: ', e)
      const code = e.errcode || e.statusCode
      if (typeof code !== 'undefined') {
        alert('You cannot delete this message.')
      }
    }
  }

  const memberAvatarClick = (id: string) => {
    // click to show member profile view
    setMemberProfileId(id)
    // setShowType('memberProfile');
  }

  const startSelect = (sdnEvent: SendingNetworkEvent) => {
    if (sdnEvent && sdnEvent.event) {
      onCheckChanged(sdnEvent, true)
    }
    setShowCheckbox(true)
  }

  const stopSelect = () => {
    for (let i = 0; i < selectedMessages.length; i++) {
      // @ts-expect-error: sdk missing type
      selectedMessages[i].checked = false
    }
    setSelectedMessages([])
    setShowCheckbox(false)
  }

  const onCheckChanged = (sdnEvent: SendingNetworkEvent, checked: boolean) => {
    if (checked) {
      setSelectedMessages(arr => [sdnEvent, ...arr])
    } else {
      setSelectedMessages((arr: SendingNetworkEvent[]) =>
        arr.filter(value => {
          return value.getId() !== sdnEvent.getId()
        })
      )
    }
  }

  // show forward view from blow two situations:
  // 1.selected msg more forward opetation
  // 2.mutiple selected msg more select operation then click forward btn
  const setShowForward = () => {
    setShowType('forward')
  }

  const closeMoreWrap = (evt: MouseEvent) => {
    if (evt.target === showMoreThumbsUpEmojiPanelRef?.current) return
    // e.stopPropagation();
    setShowMoreMenu(false)
    setShowMoreThumbsUpEmojiPanel(false)
  }

  if (!curRoom) {
    return null
  }

  return (
    <RoomPageStyled className="RoomPageStyled" spacing={16}>
      {showType === 'room' && (
        <div className="chat_widget_room_page" onClickCapture={(e: any) => closeMoreWrap(e)}>
          {/*<RoomTitle room={curRoom} onBack={onBack} setClick={() => setShowType('profile')} />*/}
          {/*{pinnedIds.length > 0 && (*/}
          {/*  <PinnedMsgCard*/}
          {/*    roomId={curRoomId}*/}
          {/*    pinnedIds={pinnedIds}*/}
          {/*    pinnedCloseClick={pinnedCloseClick}*/}
          {/*    memberAvatarClick={memberAvatarClick}*/}
          {/*    onPinnedClick={onPinnedClick}*/}
          {/*  />*/}
          {/*)}*/}
          <HeaderBox className="header_box">
            <span className="left">
              <ChatIcon className="icon" /> <span>Global Chat</span>
            </span>
            <span className="right"></span>
          </HeaderBox>
          <RoomView
            widgetWidth={widgetWidth}
            widgetHeight={widgetHeight}
            roomViewBgUrl={roomViewBgUrl}
            // useRoomFuncs={useRoomFuncs}
            roomId={curRoomId}
            room={curRoom}
            timelineWindow={timelineWindow}
            loadTimeline={loadTimeline}
            openUrlPreviewWidget={openUrlPreviewWidget}
            pinnedIds={pinnedIds}
            // setPinnedIds={setPinnedIds}
            pinEventSync={pinEventSync}
            moreOperateMsg={moreOperateMsg}
            setMoreOperateMsg={setMoreOperateMsg}
            setShowReplyOrEditMsgDialog={setShowReplyOrEditMsgDialog}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
            showMoreThumbsUpEmojiPanelRef={showMoreThumbsUpEmojiPanelRef}
            showMoreMenu={showMoreMenu}
            setShowMoreMenu={setShowMoreMenu}
            showMoreThumbsUpEmojiPanel={showMoreThumbsUpEmojiPanel}
            setShowMoreThumbsUpEmojiPanel={setShowMoreThumbsUpEmojiPanel}
            setShowMsgDeleteDialog={setShowMsgDeleteDialog}
            memberAvatarClick={memberAvatarClick}
            showCheckbox={showCheckbox}
            onStartSelect={startSelect}
            onCheckChanged={onCheckChanged}
            setShowForward={setShowForward}
            handleJump={handleJump}
            keepFocus={keepFocus}
            focusEventId={focusEventId}
            setFocusEventId={setFocusEventId}
          />
          {curRoom ? (
            <RoomInput
              room={curRoom}
              useRoomFuncs={useRoomFuncs}
              moreOperateMsg={moreOperateMsg}
              showReplyOrEditMsgDialog={showReplyOrEditMsgDialog}
              inputFocus={inputFocus}
              setShowReplyOrEditMsgDialog={setShowReplyOrEditMsgDialog}
              openUrlPreviewWidget={openUrlPreviewWidget}
              closeEmoji={closeEmoji}
              showCheckbox={showCheckbox}
              uploadFile={uploadFile}
            />
          ) : null}
          {showCheckbox ? (
            <MultiselectArea
              // room={curRoom}
              selectedMessages={selectedMessages as SelectSendingNetworkEvent[]}
              onStopSelect={stopSelect}
              // setShowForward={setShowForward}
            />
          ) : null}

          {/* delete msg dialog */}
          {showMsgDeleteDialog && (
            <div className="msg_delete_dialog">
              <div className="msg_delete_dialog_content">
                <div className="info">
                  Are you sure you want to delete
                  <br /> this message ?
                </div>
                <div className="btns">
                  <div className="btns-item btns-cancel" onClick={() => setShowMsgDeleteDialog(false)}>
                    Cancel
                  </div>
                  <div className="btns-item btns-confirm" onClick={handleSureDeleteMsg}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </RoomPageStyled>
  )
}
