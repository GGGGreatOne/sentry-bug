import ThumbupRowButton from './thumbupRowButton'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { styled } from '@mui/material'

interface ThumbupRowProps {
  mxEvent: any
  reactions: any
  isOwn: boolean
  room: any
}

const ThumbUpEle = styled('div')`
  //display: flex;
`

export default function Page({ mxEvent, reactions, isOwn, room }: ThumbupRowProps) {
  const [, setUpdateFlag] = useState<number>(0)
  const onReactionsChange = useCallback(() => {
    setUpdateFlag(Date.now() as number)
  }, [setUpdateFlag])

  useEffect(() => {
    if (reactions) {
      // ReactionsRow
      reactions.on('Relations.add', onReactionsChange)
      reactions.on('Relations.remove', onReactionsChange)
      reactions.on('Relations.redaction', onReactionsChange)
      console.log('reactions: event added')
    }
    return () => {
      if (reactions) {
        // ReactionsRow
        reactions.off('Relations.add', onReactionsChange)
        reactions.off('Relations.remove', onReactionsChange)
        reactions.off('Relations.redaction', onReactionsChange)
      }
    }
  }, [reactions, onReactionsChange])

  // const isContentActionable = (mxEvent: MatrixEvent): boolean {
  const isContentActionable = (mxEvent: any) => {
    const { status: eventStatus } = mxEvent

    // status is SENT before remote-echo, null after
    // const isSent = !eventStatus || eventStatus === EventStatus.SENT;
    const isSent = !eventStatus || eventStatus === 'sent'

    if (isSent && !mxEvent.isRedacted()) {
      if (mxEvent.getType() === 'm.room.message') {
        const content = mxEvent.getContent()
        if (content.msgtype && content.msgtype !== 'm.bad.encrypted' && content.hasOwnProperty('body')) {
          return true
        }
      } else if (
        // mxEvent.getType() === "m.sticker" ||
        // mxEvent.getType() === EventType.PollStart ||
        // mxEvent.getType() === EventType.PollEnd
        mxEvent.getType() === 'm.sticker' ||
        mxEvent.getType() === 'm.poll.start' ||
        mxEvent.getType() === 'm.poll.end'
      ) {
        return true
      }
    }

    return false
  }

  const genReactionsRowButton = () => {
    // ReactionsRow
    // console.error('-----genReactionsRowButton-----', mxEvent.event.content)
    // console.error(mxEvent.event.content, reactions)
    if (!reactions || !isContentActionable(mxEvent)) {
      return null
    }
    const items = reactions
      .getSortedAnnotationsByKey()
      .map(([content, events]: any[]) => {
        const count = events.size
        if (!count) {
          return null
        }
        if (content === 'published') {
          return null
        }
        const userId = api.getUserId()
        const set = reactions.getAnnotationsBySender()[userId]
        const myReactions = set ? [...set.values()] : null
        const myReactionEvent =
          myReactions &&
          myReactions.find(mxEvent => {
            if (mxEvent.isRedacted()) {
              return false
            }
            return mxEvent.getRelation().key === content
          })
        return (
          <ThumbupRowButton
            key={content}
            content={content}
            count={count}
            mxEvent={mxEvent}
            reactionEvents={events}
            myReactionEvent={myReactionEvent}
            room={room}
            owner={isOwn}
          />
        )
      })
      .filter((item: null | Element) => !!item)
    if (!items.length) return null
    return items
  }
  const reactionsRowButtonContent = genReactionsRowButton()
  return reactionsRowButtonContent ? (
    <ThumbUpEle
      className={['msgBox_info_thumb_up', isOwn ? 'msgBox_right_info_thumb_up' : 'msgBox_left_info_thumb_up'].join(' ')}
    >
      {reactionsRowButtonContent}
    </ThumbUpEle>
  ) : null
}
