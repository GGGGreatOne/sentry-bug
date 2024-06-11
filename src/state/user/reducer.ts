import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ICacheLoginInfo, IUserState } from './type'
import { getUserProfile } from 'api/user'
import { ILoginUserInfo } from 'api/user/type'
import { boxCheckStatus } from 'api/boxes'

export const fetchUserProfile: any = createAsyncThunk('user/profile', async () => {
  const res = await getUserProfile()
  return res.data
})
export const fetchUserBoxCheckStatus: any = createAsyncThunk('user/boxCheckStatus', async () => {
  const res = await boxCheckStatus()
  return res.data
})

const LOCAL_USER_TOKEN_KEY = 'LOCAL_USER_TOKEN_KEY'
export const getLocalUserToken = (): ICacheLoginInfo => {
  let _local: any = ''
  try {
    _local = JSON.parse(localStorage.getItem(LOCAL_USER_TOKEN_KEY) || '')
  } catch (error) {}
  return {
    token: _local?.token || '',
    userId: _local?.userId || 0,
    address: _local?.address || ''
  }
}
const saveLocalUserToken = (data: ICacheLoginInfo | null) => {
  localStorage.setItem('LOCAL_USER_TOKEN_KEY', data ? JSON.stringify(data) : '')
}

const localUserToken = getLocalUserToken()

const initialState: IUserState = {
  token: localUserToken.token,
  userId: localUserToken.userId,
  address: localUserToken.address,
  user: null,
  follow: null,
  didLogin: false
}

export const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initLoginInfo: (state, { payload }: { payload: ICacheLoginInfo }) => {
      state.token = payload.token
      state.userId = payload.userId
      state.address = payload.address
    },
    saveLoginInfo: (state, { payload }: { payload: ICacheLoginInfo }) => {
      state.token = payload.token
      state.userId = payload.userId
      state.address = payload.address

      saveLocalUserToken({
        token: payload.token,
        userId: payload.userId,
        address: payload.address
      })
    },
    removeLoginInfo: state => {
      state.token = ''
      state.userId = 0
      state.address = ''
      saveLocalUserToken(null)
    },
    saveUserProfile: (state, { payload }: { payload: ILoginUserInfo | null }) => {
      state.box = payload?.box || null
      state.follow = payload?.follow || null
      state.user = payload?.user || null
    },
    setDidLogin: (state, { payload }: { payload: { didLogin: boolean } }) => {
      console.log('set DiD login payload', payload)
      state.didLogin = payload.didLogin
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.box = payload?.box ? { ...state.box, ...payload.box } : state.box
        state.follow = payload?.follow || null
        state.user = payload?.user || null
      })
      .addCase(fetchUserBoxCheckStatus.fulfilled, (state, { payload }) => {
        const _payload = { ...payload }
        delete _payload.boxStatus
        delete _payload.tvl
        state.box = { ...state.box, ..._payload }
        if (state.user && payload?.boxStatus !== undefined) {
          state.user.boxStatus = payload.boxStatus
        }
      })
  }
})

export const { saveLoginInfo, removeLoginInfo, saveUserProfile, initLoginInfo, setDidLogin } = userInfoSlice.actions
export default userInfoSlice.reducer
