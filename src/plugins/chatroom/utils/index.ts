import EMOJIBASE from 'emojibase-data/en/compact.json'
import FREQUENTEMOJIOBASE from './frequent-emojibase.json'
import { api } from '../api'
import { Room, RoomMember } from 'sendingnetwork-js-sdk'

export interface EmojiBaseProps {
  annotation: string
  hexcode: string
  unicode: string
}

export interface EmojiProps {
  group: number
  hexcode: string
  label: string
  order: number
  tags: string[]
  unicode: string
}

class FilterWordsLibrary {
  public filterWordsArray: string[]
  constructor() {
    this.filterWordsArray = []
  }

  init = (wordsStr: any) => {
    if (wordsStr && typeof wordsStr === 'string') {
      const wordsArr = wordsStr.split(',') || []
      if (wordsArr && Array.isArray(wordsArr)) {
        this.filterWordsArray = wordsArr
      }
    }
  }

  get = () => {
    return this.filterWordsArray
  }
}

export const filterLibrary = new FilterWordsLibrary()

export const dragging = (rootDom: any) => {
  let draggingObj: any = null
  let diffX = 0
  let diffY = 0

  const mouseDown = (e: { clientX: number; clientY: number }) => {
    draggingObj = rootDom
    diffX = e.clientX - draggingObj.offsetLeft
    diffY = e.clientY - draggingObj.offsetTop
  }
  const mouseHandler = (e: { type: any; clientX: number; clientY: number }) => {
    switch (e.type) {
      case 'mousemove':
        if (draggingObj) {
          draggingObj.style.left = e.clientX - diffX + 'px'
          draggingObj.style.top = e.clientY - diffY + 'px'
        }
        break
      case 'mouseup':
        draggingObj = null
        diffX = 0
        diffY = 0
        break
    }
  }
  return {
    enable: function () {
      rootDom.addEventListener('mousedown', mouseDown)
      document.addEventListener('mousemove', mouseHandler)
      document.addEventListener('mouseup', mouseHandler)
    },
    disable: function () {
      rootDom.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseHandler)
      document.removeEventListener('mouseup', mouseHandler)
    }
  }
}

export const parseUseWidgetBtn = (str: string, width: string, height: string) => {
  const styleObj: any = {}
  const posMap: any = {
    leftTop: { left: '70px', top: '70px' },
    rightTop: { left: `-${width}`, top: '70px' },
    leftBottom: { left: '70px', top: `-${height}` },
    rightBottom: { left: `-${width}`, top: `-${height}` }
  }
  const propertyArr = str.split(';')
  propertyArr.map(item => {
    const keyValArr = item.split(':')
    if (keyValArr.length === 2) {
      styleObj[keyValArr[0]] = keyValArr[1]
    }
  })
  styleObj.widgetPos = posMap[styleObj['pos']]
  styleObj.btnPos = {
    left: styleObj.left,
    top: styleObj.top
  }
  return styleObj
}

export const renderAnimation = (animateDom: any, animateName: string, animateStartCb?: any, animateEndCb?: any) => {
  animateDom.classList.add('animate__animated', animateName)
  animateDom.classList.remove('widget_animate_invisible')
  animateDom.addEventListener('animationstart', (evt: any) => {
    console.log('animationstart', evt)
    animateStartCb && animateStartCb()
  })
  animateDom.addEventListener('animationend', (evt: any) => {
    console.log('animationend', evt)
    animateDom.classList.remove('animate__animated', animateName)
    animateEndCb && animateEndCb()
  })
}

export const getDefaultAvatar = (userId: string) => {
  return `https://static.sending.me/beam/70/${userId}?colors=FC774B,FFB197,B27AFF,DAC2FB,F0E7FD&square=true`
}

export const getMemberName = (member: RoomMember | undefined) => {
  return member?.name || member?.user?.displayName || member?.userId
}

export const getAddressByUserId = (userId: any) => {
  if (!userId || typeof userId !== 'string') return ''
  const cont = userId.split(':')[1]
  return cont ? `0x${cont}` : userId
}

export const getEmojis = (): EmojiBaseProps[] => {
  return EMOJIBASE.filter(emoji => emoji.group === 0)
}

export const getFrequentThumbUpEmojiList = (): EmojiProps[] => {
  // const allEmojis = getEmojis()
  // return allEmojis.slice(0, 6)
  return FREQUENTEMOJIOBASE.filter(emoji => emoji.group === 0 || emoji.group === 1)
}

export const formatTextLength = (name: string, limit: number, len: number) => {
  if (name && name.length && name.length > limit) {
    return `${name.slice(0, len)}...${name.slice(name.length - len)}`
    // return `${name.slice(0, len)}...`;
  }
  return name
}

export const calculateRoomName = (room: Room, isShowCount: boolean) => {
  const handleNameUserId = (nameStr: string) => {
    if (!nameStr) return ''
    nameStr = nameStr.trim()
    const lowerCaseStr = nameStr.toLowerCase()
    if (/^@sdn_/.test(lowerCaseStr)) {
      return getAddressByUserId(lowerCaseStr) || ''
    } else {
      return nameStr
    }
  }
  const getInviteMembers = (allMembers: RoomMember[], joinedMembers: RoomMember[]) => {
    return allMembers.filter(m => !joinedMembers.find((v: RoomMember) => v?.userId === m?.userId))
  }
  const getInviteRoomName = (inviteList: any) => {
    let name = ''
    if (inviteList.length <= 1) {
      const addr = getAddressByUserId(inviteList[0]?.userId)
      const nameStr = handleNameUserId(inviteList[0]?.name)
      name = nameStr || addr
    } else {
      name = `You and ${inviteList.length} others`
    }
    return name
  }

  const { name } = room
  const allMembers = room.getMembers()
  const members = room.getJoinedMembers()
  const inviteMembers = getInviteMembers(allMembers, members)
  const membersLen = members.length
  let result = handleNameUserId(name)

  if (membersLen <= 1) {
    result = getInviteRoomName(inviteMembers) || handleNameUserId(name)
  } else if (membersLen === 2) {
    if (/^@sdn_/.test(name)) {
      const currentUserId = api.getUserId()
      const index = members.findIndex(v => v?.userId === currentUserId)
      members.splice(index, 1)
      const anotherUser = members[0]
      result = anotherUser?.name || getAddressByUserId(anotherUser?.userId)
    }
  }
  // show member count
  if (isShowCount) {
    if (membersLen > 2) {
      result = `${result} (${membersLen})`
    }
  }
  return result
}

export const formatTextLastElide = (name: string, limit: number) => {
  if (name && name.length && name.length > limit) {
    return `${name.slice(0, limit)}...`
  }
  return name
}

export const isMobile = () => {
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  return isIos || isAndroid
}

export const getEventById = async (roomId: string, eventId: string, isTouristMode: boolean, updateContent = false) => {
  const client = isTouristMode ? api.touristClient : api._client
  try {
    const { ...res } = await client.fetchRoomEvent(roomId, eventId)
    if (updateContent) {
      const replaceEvents = await client.fetchRelations(roomId, eventId, 'm.replace', 'm.room.message', {})
      if (replaceEvents['chunk']) {
        const repEvent = replaceEvents['chunk'][0]
        if (repEvent) {
          res['content'] = repEvent['content']['m.new_content']
        }
      }
    }
    return res
  } catch (err) {
    console.error('Error getEventById' + eventId + ' in room ' + roomId)
    console.error(err)
    // showToast({
    //   type: 'success',
    //   msg: 'Operation failed',
    // })
  }
  return {}
}

// export function jsxJoin(array, joiner) {
//   const newArray = []
//   array.forEach((element, index) => {
//     newArray.push(element, index === array.length - 1 ? null : joiner)
//   })
//   return (
//     // <span>{ newArray }</span>
//     { newArray }
//   )
// }

// export function formatCommaSeparatedList(items: string[], itemLimit: number | undefined) {
//   const remaining = itemLimit === undefined ? 0 : Math.max(items.length - itemLimit, 0)
//   if (items.length === 0) {
//     return ''
//   } else if (items.length === 1) {
//     return items[0]
//   } else {
//     let lastItem
//     if (remaining > 0) {
//       items = items.slice(0, itemLimit)
//     } else {
//       lastItem = items.pop()
//     }

//     // let joinedItems
//     // if (items.every(e => typeof e === 'string')) {
//     //   joinedItems = items.join(', ')
//     // } else {
//     //   joinedItems = jsxJoin(items, ', ')
//     // }

//     if (remaining > 0) {
//       // return _t("%(items)s and %(count)s others", { items: joinedItems, count: remaining } );
//       return items.join(', ') + ' and ' + remaining + ' others'
//     } else {
//       // return _t("%(items)s and %(lastItem)s", { items: joinedItems, lastItem });
//       return items.join(', ') + ' and ' + lastItem
//     }
//   }
// }

export const renderTs = (ts: any) => {
  const date = new Date(ts)
  const h = date.getHours()
  let m: number | string = date.getMinutes()
  if (m <= 9) {
    m = '0' + m
  }
  return `${h}:${m}`
}

export const getEndOfDay = (ts: number) => {
  return new Date(ts).setHours(23, 59, 59, 999)
}

export const getDayStr = (day: number) => {
  // return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  if (day >= 0 && day < 7) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'][day]
  }
  return day
}

export const getGroupDateStr = (ts: number) => {
  const d = new Date(ts)
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ][d.getMonth()]
  return `${month} ${d.getDate()} ${d.getFullYear()}`
}
