import sdk, { RemarkStore } from 'sendingnetwork-js-sdk'
import randomBytes from 'randombytes'
import EventEmitter from 'event-emitter'
import Web3 from 'web3'
import * as util from 'ethereumjs-util'
import { Web3Provider } from '@ethersproject/providers'

class Api {
  public _client: any
  public widgetDisplay = false
  public userData: any
  public touristClient: any
  public eventEmitter: any
  public thirdRegisterPromise: any
  constructor() {
    this._client = null
    this.widgetDisplay = false
    this.userData = null
    this.touristClient = null
    this.eventEmitter = null
    this.thirdRegisterPromise = null
    this.showWidget = this.showWidget
    this.joinRoom = this.joinRoom
    this.createDMRoom = this.createDMRoom
    this.createPublicRoom = this.createPublicRoom
    this.DIDLogin = this.DIDLogin
    this.thirdDIDLogin = this.thirdDIDLogin
    this.getUrlPreview = this.getUrlPreview
    this.backUp = this.backUp
    this.restore = this.restore
    this.setUserNickname = this.setUserNickname
    this.getUidByAddress = this.getUidByAddress
    this.chatToAddress = this.chatToAddress
    this.init = this.init
  }

  // state
  showWidget = (show: boolean) => {
    if (window && window.setShowWidget) {
      this.widgetDisplay = show
      window.setShowWidget(show)
    }
  }

  turnServers = () => {
    return this._client && this._client.turnServers
  }

  clearClient = () => {
    this._client = null
  }

  // func
  init = (baseUrl: string) => {
    const user_id = localStorage.getItem('sdn_user_id')
    const access_token = localStorage.getItem('sdn_access_token')
    if (user_id && access_token) {
      this._client = sdk.createClient({
        baseUrl,
        userId: user_id,
        accessToken: access_token,
        timelineSupport: true,
        unstableClientRelationAggregation: true
      })
    } else {
      this._client = sdk.createClient({
        baseUrl,
        timelineSupport: true,
        unstableClientRelationAggregation: true
      })
    }
    RemarkStore.get(this._client)
    this.eventEmitter = EventEmitter()
  }

  DIDLogin = async (provider?: Web3Provider, account?: string, callBack?: (arg0: boolean) => void) => {
    if (provider && account) {
      try {
        const prefix = 'did:pkh:eip155:1:'
        const [address] = [account]
        const {
          data: [did]
        } = await this._client.getDIDList(address)
        const client_key = await this.getWeb3PublicKey()
        const preloginParams = did ? { did, client_key } : { address: `${prefix}${address}`, client_key }
        const { message: lMessage, updated, random_server } = await this._client.preDiDLogin1(preloginParams)
        const sign = await provider.getSigner().signMessage(lMessage)
        // developer key signature
        let devSign = null
        if (window.signWithDevKey) {
          devSign = await window.signWithDevKey({ message: lMessage })
        }
        const identifier = {
          did,
          address: did || `${prefix}${address}`,
          token: sign,
          app_token: devSign ? devSign : undefined,
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
        const { access_token, user_id } = await this._client.DIDLogin(loginParams)
        localStorage.setItem('sdn_access_token', access_token)
        localStorage.setItem('sdn_user_id', user_id)
        localStorage.setItem('sdn_user_address', address)
        if (callBack && typeof callBack == 'function') {
          this.eventEmitter && this.eventEmitter.emit && this.eventEmitter.emit('login')
          callBack(true)
        }
      } catch (error) {
        if (callBack && typeof callBack == 'function') {
          callBack(false)
        }
      }
    }
  }

  thirdDIDLogin = async (
    address: string,
    thirdSignFunc: (arg0: { message: any }) => any,
    callBack: (arg0: boolean) => void
  ) => {
    const user_id = localStorage.getItem('sdn_user_id')
    const access_token = localStorage.getItem('sdn_access_token')
    if (user_id && access_token) {
      window && window['thirdLoginWatch'] && window.thirdLoginWatch()
      callBack(true)
      return
    }
    try {
      const prefix = 'did:pkh:eip155:1:'
      const {
        data: [did]
      } = await this._client.getDIDList(address)
      const client_key = await this.getWeb3PublicKey()
      const preloginParams = did ? { did, client_key } : { address: `${prefix}${address}`, client_key }
      const { message: lMessage, updated, random_server } = await this._client.preDiDLogin1(preloginParams)
      const sign = await thirdSignFunc({ message: lMessage })
      // developer key signature
      let devSign = null
      if (window.signWithDevKey) {
        devSign = await window.signWithDevKey({ message: lMessage })
      }
      const identifier = {
        did,
        address: did || `${prefix}${address}`,
        token: sign,
        app_token: devSign ? devSign : undefined,
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
        client_key
      }
      const { access_token, user_id } = await this._client.DIDLogin(loginParams)
      localStorage.setItem('sdn_access_token', access_token)
      localStorage.setItem('sdn_user_id', user_id)
      localStorage.setItem('sdn_user_address', address)
      if (callBack && typeof callBack == 'function') {
        this.eventEmitter && this.eventEmitter.emit && this.eventEmitter.emit('login')
        window && window['thirdLoginWatch'] && window.thirdLoginWatch()
        callBack(true)
      }
    } catch (error) {
      if (callBack && typeof callBack == 'function') {
        callBack(false)
      }
    }
  }

  // logout = async (callback: () => any) => {
  //   if (window && window.toLogout) {
  //     window.toLogout(() => {
  //       callback && callback()
  //     })
  //   }
  // }

  joinRoom = async (roomId: any, callBack: any) => {
    return this._client.joinRoom(roomId, {}, callBack)
  }

  createRoom = async (options: {
    name?: any
    preset?: any
    visibility?: string
    invite?: any
    is_direct?: boolean
    initial_state?: { type: string; state_key: string; content: { guest_access: string } }[]
  }) => {
    const { preset } = options
    if (preset === 'trusted_private_chat') {
      const [userId] = options.invite
      const { dm_rooms } = await this._client.findDMRoomByUserId(userId)
      if (!dm_rooms || !dm_rooms.length) {
        const { room_id } = await this._client.createRoom(options)
        return room_id
      } else {
        return dm_rooms[0]
      }
    } else {
      const { room_id } = await this._client.createRoom(options)
      return room_id
    }
  }

  createPublicRoom = async (name: any) => {
    const roomid = await this.createRoom({
      name,
      preset: 'public_chat',
      visibility: 'private'
    })
    return roomid
  }

  createPrivateRoom = async (name: any) => {
    const roomid = await this.createRoom({
      name,
      preset: 'private_chat',
      visibility: 'private'
    })
    return roomid
  }

  createDMRoom = async (userId: any) => {
    const roomid = await this.createRoom({
      preset: 'trusted_private_chat',
      visibility: 'private',
      invite: [userId],
      is_direct: true,
      initial_state: [
        {
          type: 'm.room.guest_access',
          state_key: '',
          content: {
            guest_access: 'can_join'
          }
        }
      ]
    })
    return roomid
  }

  getUrlPreview = async (link: any, ts: any) => {
    return await this._client.getUrlPreview(link, ts)
  }

  queryMessageType = async () => {
    return await this._client.queryMessageType()
  }

  backUp = async () => {
    if (window.ethereum?.request) {
      const accounts = await window?.ethereum?.request({
        method: 'eth_requestAccounts'
      })
      const [publicKey] = accounts
      try {
        const nonce = randomBytes(32).toString('hex')
        const timestamp = new Date().getTime()
        const salt = 'hiseas_account'
        const message = [salt, publicKey, nonce, timestamp].join('#')
        const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`
        const signature = await window?.ethereum?.request({
          method: 'personal_sign',
          params: [msg, publicKey, '']
        })
        try {
          const { transactions } = await this._client.backupSocialGraph({
            msg,
            signature
          })
          transactions
          // const [transaction] = transactions
          // const { chainId } = transaction
          // payGasFee(chainId, transactions, () => {})
          return true
        } catch (error) {
          return false
        }
      } catch (error) {
        return false
      }
    }
    return false
  }

  restore = async () => {
    const { exist, message } = await this._client.querySocialGraph()
    if (exist === 1) {
      if (window.ethereum?.request) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          const [publicKey] = accounts
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, publicKey, '']
          })
          await this._client.restoreSocialGraph({ signature })
        } catch (error) {}
      }
    }
  }

  setUserNickname = async (name: any, callback: any) => {
    await api._client.setDisplayName(name, callback)
  }

  getUidByAddress = async (addr: string) => {
    if (!addr) return null
    const contAddr = addr.replace(/^0[x|X]/, '')
    const {
      data: [did]
    } = await this._client.getDIDList(addr)
    const uid = did ? `@sdn_${contAddr}:${contAddr}` : null
    return uid ? uid.toLowerCase() : null
  }

  chatToAddress = (addr: string, callback?: (arg0: boolean) => any) => {
    if (window.chatToAddressWatch) {
      window.chatToAddressWatch(addr, callback)
    } else {
      callback && callback(false)
    }
  }

  joinPublicRoom = (roomId: any, callback: (arg0: boolean) => any) => {
    if (window.joinToPublicRoomWatch) {
      window.joinToPublicRoomWatch(roomId, callback)
    } else {
      callback && callback(false)
    }
  }

  on = (type: string, callback: (arg0: any) => void) => {
    const typeList = ['login', 'logout', 'unReadCount', 'highlightRelateReply']
    if (!this.eventEmitter) return
    if (typeof type !== 'string' || !typeList.includes(type)) {
      console.error(`chatWidgetApi.on received unsupport type: ${type}`)
      return
    }
    if (!callback || typeof callback !== 'function') {
      console.error(`chatWidgetApi.on callback not a function: ${callback}`)
      return
    }
    if (type === 'unReadCount') {
      this.eventEmitter.on(type, () => {
        this.getUnreadCounts((num: any) => {
          callback(num)
        })
      })
    } else {
      this.eventEmitter.on(type, callback)
    }
  }

  // getUnreadCounts
  getUnreadCounts = (callBack: { (num: any): void; (arg0: number): void }) => {
    if (!this._client) {
      callBack && callBack(0)
      return
    }
    const rooms = this._client.getRooms()
    const counts = rooms.map((room: { getMyMembership: () => string; notificationCounts: { total: any } }) => {
      if (room.getMyMembership() === 'invite') {
        return 1
      } else if (room.getMyMembership() === 'join') {
        return room.notificationCounts.total || 0
      }
      return 0
    })
    const num = counts.reduce((old: number, now: number) => {
      return old + now
    }, 0)
    if (callBack && typeof callBack == 'function') {
      callBack(num)
    }
  }

  invite = (roomId: any, userId: any) => {
    this._client.invite(roomId, userId)
  }

  leave = (roomId: any, callback: any) => {
    this._client.leave(roomId, callback)
  }

  getUserId = () => {
    return this._client?.getUserId()
  }

  getUserData = async () => {
    if (this.userData) {
      return this.userData
    } else {
      const user_id = this._client.getUserId()
      const res = await api._client.getProfileInfo(user_id)
      this.userData = res
      return res
    }
  }

  setUserData = (data: null) => {
    this.userData = data
  }

  smartTradingTextParse = async (text: any, address: any) => {
    const transaction = await this._client.smartTradingTextParse(text, address)
    return transaction
  }

  getWeb3PublicKey = async () => {
    const web3 = new Web3()
    let tmpPrivateKey = localStorage.getItem('sdn_web3_key')
    if (!tmpPrivateKey) {
      const { privateKey } = web3.eth.accounts.create()
      tmpPrivateKey = privateKey
      localStorage.setItem('sdn_web3_key', privateKey)
    }
    const msg = tmpPrivateKey.replace('0x', '')
    const publicKeyBuffer = util.privateToPublic(Buffer.from(msg, 'hex'))
    const publicKey = `${publicKeyBuffer.toString('hex')}`
    return {
      public_key: publicKey,
      key_type: 'EcdsaSecp256k1RecoveryMethod2020'
    }
  }

  // tourist
  getTouristClient = () => {
    return this.touristClient
  }

  setTouristClient = (cli: any) => {
    this.touristClient = cli
  }

  // events
  openDappUrl = (url: any) => {
    this.eventEmitter.emit('openDappUrl', url)
  }

  closeDappUrl = () => {
    this.eventEmitter.emit('closeDappUrl')
  }

  resetEventEmitter = () => {
    this.eventEmitter = null
  }

  bindThirdRegister = (promise: any) => {
    this.thirdRegisterPromise = promise
  }

  thirdRegister = (data: any, onSuccess: (arg0: any) => any, onError: (arg0: any) => any) => {
    if (this.thirdRegisterPromise) {
      this.thirdRegisterPromise(data)
        .then((res: any) => {
          onSuccess && onSuccess(res)
        })
        .catch((e: any) => {
          onError && onError(e)
        })
    }
  }
}
export const api = new Api()
