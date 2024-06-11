import { useCallback, useEffect, useState } from 'react'
// import { formatCommaSeparatedList } from '../utils'
import { Room, SendingNetworkEvent } from 'sendingnetwork-js-sdk'

interface ThumbupRowButtonTooltipProps {
  reactionEvents: Set<SendingNetworkEvent>
  room: Room
  count: number
  mxEvent?: any
  content?: any
  visible?: boolean
}

export default function Page({ reactionEvents, room, count }: ThumbupRowButtonTooltipProps) {
  const genTooltip = useCallback(() => {
    let tooltipLabel
    if (room) {
      const senders: string[] = []
      for (const reactionEvent of reactionEvents) {
        const member = room.getMember(reactionEvent.getSender())
        const name = member ? member.name : reactionEvent.getSender()
        senders.push(name)
      }

      // tooltipLabel = visible ? (
      //   <div style={{ wordBreak: 'break-all' }} className="mx_Tooltip_wrapper">
      //     Reacted by {formatCommaSeparatedList(senders, 6)}
      //     {/* {senders.length > 4 && 'and ' + senders.length - 4 + ' others'} */}
      //   </div>
      // ) : null
    }

    let tooltip
    if (tooltipLabel) {
      tooltip = tooltipLabel
    }
    return tooltip
  }, [reactionEvents, room])
  const [tooltip, setTooltip] = useState(genTooltip())
  useEffect(() => {
    setTooltip(genTooltip())
  }, [count, genTooltip])
  return tooltip
}
