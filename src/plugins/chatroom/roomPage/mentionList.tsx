import { ReactNode } from 'react'
import UserAvatar from '../components/userAvatar'
import { getAddressByUserId, getMemberName } from '../utils'

interface MentionListProps {
  memberList: any
  memberListFocus: number
  handleAtMemberClick: any
}

export default function Page({ memberList, memberListFocus, handleAtMemberClick }: MentionListProps) {
  // const listRef = useRef<HTMLDivElement | null>(null)

  // useEffect(() => {
  //   if (memberList && memberList[memberListFocus] && listRef.current) {
  //     const m = memberList[memberListFocus]
  //     const k: string = m.isRoom ? 'room' : m.userId
  //     const ref = listRef.current?.[k]
  //     ref && ref.scrollIntoView({ block: 'nearest' })
  //   }
  // }, [memberListFocus, listRef])

  const spawnMentionItems = (data: any) => {
    const arr: ReactNode[] = []
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        const m = data[i]
        const k = m.isRoom ? 'room' : m.userId
        arr.push(
          <div
            key={k}
            className={['room-input_at_item', i === memberListFocus && 'room-input_at_item_bgFocus'].join(' ')}
            onMouseDown={e => handleAtMemberClick(m, e)}
            onTouchStart={e => handleAtMemberClick(m, e)}
            // ref={ref => {
            //   listRef.current[k] = ref
            // }}
          >
            <div className="room-input_at_item_avatar">
              {m.isRoom ? 'RoomAvatar' : <UserAvatar member={m} user={undefined} />}
            </div>
            {m.isRoom ? (
              <div className="room-input_at_item_name">Room</div>
            ) : (
              <div className="room-input_at_item_name">
                <div>{getMemberName(m)}</div>
                <span>{getAddressByUserId(m.userId)}</span>
              </div>
            )}
          </div>
        )
        // if (m.isRoom && data.length > 1) {
        //   arr.push(<div className="divide" key={'divide'}></div>);
        // }
      }
    }
    return arr
  }
  return <div className="room-input_at">{spawnMentionItems(memberList)}</div>
}
