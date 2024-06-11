import ThumbupRowButtonTooltip from './thumbupRowButtonTooltip'
import { api } from '../api'
import { styled } from '@mui/material'

interface ThumbupRowButtonProps {
  content: any
  count: number
  mxEvent: any
  reactionEvents: any
  myReactionEvent: any
  room: any
  owner: boolean
}
const EachThumbUp = styled('div')`
  padding: 2px 10px;
  margin: 4px 0;
  background: #ffffffcc;
  margin-right: 10px;
  border-radius: 12px;
  color: black;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  .emoji_icon {
    margin-right: 4px;
  }
  &.each_thumb_up.owner {
    background: #945bf2;
    color: white;
  }
`

export default function Page({
  content,
  count,
  mxEvent,
  reactionEvents,
  myReactionEvent,
  room,
  owner
}: ThumbupRowButtonProps) {
  const clickEmojiItemHandle = () => {
    // ReactionsRowButton
    console.log('click thumbup emoji directly')
    if (myReactionEvent) {
      api._client.redactEvent(mxEvent.getRoomId(), myReactionEvent.getId())
    } else {
      api._client.sendEvent(mxEvent.getRoomId(), 'm.reaction', {
        'm.relates_to': {
          rel_type: 'm.annotation',
          event_id: mxEvent.getId(),
          key: content
        }
      })
      // dis.dispatch({ action: "message_sent" });
    }
  }
  // const classes = classNames({
  //   msgBox_info_thumb_up_item: true,
  //   msgBox_info_thumb_up_item_selected: !!myReactionEvent,
  // });
  return (
    <EachThumbUp className={`each_thumb_up ${owner ? 'owner' : ''}`} key={content} onClick={clickEmojiItemHandle}>
      <span className="emoji_icon">{content}</span>
      <span className="emoji_count">{count}</span>
      <ThumbupRowButtonTooltip
        content={content}
        reactionEvents={reactionEvents}
        mxEvent={mxEvent}
        visible={true}
        room={room}
        count={count}
      />
    </EachThumbUp>
  )
}
