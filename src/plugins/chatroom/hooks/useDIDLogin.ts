import { useActiveWeb3React } from 'hooks'
import { useCallback, useRef, useState } from 'react'
import { api } from '../api'
import { dragging, filterLibrary, parseUseWidgetBtn } from '../utils'
import useBreakpoint from 'hooks/useBreakpoint'
import sdk from 'sendingnetwork-js-sdk'
import { getBackedSignature } from 'api/chat'
import { useSignMessage } from 'wagmi'

export function useDIDLogin() {
  const { account } = useActiveWeb3React()
  const { signMessageAsync } = useSignMessage()
  const baseUrl = process.env.NEXT_PUBLIC_CHATROOM_BASEURL || ''
  const isMd = useBreakpoint('md')
  const useWidgetBtn = ''
  const widgetRootRef = useRef(null)
  const [btnUnReadCount, setBtnUnReadCount] = useState(0)

  const onRoom = useCallback(() => {
    // const rooms = api._client.getRooms()
    // setRooms(() => [...rooms])
    api.eventEmitter && api.eventEmitter.emit && api.eventEmitter.emit('unReadCount')
  }, [])

  const start = useCallback(async () => {
    await api._client.startClient()
    const user = api._client.getUser(localStorage.getItem('sdn_user_id'))
    user.setWalletAddress(localStorage.getItem('sdn_user_address') ?? account ?? '')
    api._client.on('Room', onRoom)
    api._client.on('Room.myMembership', onRoom)
    api._client.on('RoomState.events', onRoom)
    api._client.on('Room.timeline', onRoom)
    // api._client.on('Session.logged_out', onSessionLogout)
  }, [onRoom, account])

  const initDragging = useCallback(() => {
    if (!useWidgetBtn || isMd) return
    const rootDom = widgetRootRef.current
    rootDom && dragging(rootDom).enable()
    const widgetBtnStyle = parseUseWidgetBtn(useWidgetBtn, '', '')
    // setBtnStyle(widgetBtnStyle)
    widgetBtnStyle
    api.on('unReadCount', num => {
      if (!num) {
        setBtnUnReadCount(0)
      } else if (num !== btnUnReadCount) {
        setBtnUnReadCount(num)
      }
    })
  }, [btnUnReadCount, isMd])

  return useCallback(
    async (address: string) => {
      const prefix = 'did:pkh:eip155:1:'
      const _client = sdk.createClient({
        baseUrl,
        timelineSupport: true,
        unstableClientRelationAggregation: true
      })
      const {
        data: [did]
      } = await _client.getDIDList(address)
      const client_key = await api.getWeb3PublicKey()
      const preloginParams = did ? { did, client_key } : { address: `${prefix}${address}`, client_key }
      const { message: lMessage, updated, random_server } = await _client.preDiDLogin1(preloginParams)
      // developer key signature
      const { data } = await getBackedSignature({ message: lMessage })
      const signRes = await signMessageAsync({ message: lMessage })

      const identifier = {
        did,
        address: did || `${prefix}${address}`,
        token: signRes,
        app_token: data ? `0x${data.signature}` : undefined,
        message: lMessage
      }
      const deviceId = localStorage.getItem('mx_device_id') || null
      const loginParams = {
        type: 'm.login.did.identity',
        updated,
        identifier,
        random_server,
        device_id: deviceId,
        initial_device_display_name: '',
        // initial_device_display_name: this.defaultDeviceDisplayName,
        client_key
      }

      const { access_token, user_id } = await _client.DIDLogin(loginParams)
      localStorage.setItem('sdn_access_token', access_token)
      localStorage.setItem('sdn_user_id', user_id)
      localStorage.setItem('sdn_user_address', address)
      await api.init(baseUrl)
      filterLibrary.init(undefined)
      initDragging()
      await api.getUserData()
      await start()
      return {
        sign: signRes,
        msg: lMessage
      }
    },
    [baseUrl, initDragging, signMessageAsync, start]
  )
}
