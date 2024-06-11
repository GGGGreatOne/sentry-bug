// import { toast } from 'react-toastify'
import { toast } from 'react-toastify'
import { IResponse } from './type'
import store from 'state'
import { getLocalUserToken, removeLoginInfo, saveUserProfile } from 'state/user/reducer'

const request = (url: string, options?: any) => {
  // TODO: add request/response interceptors
  return fetch(url, options).then(async response => {
    if (response.status === 401) {
      const localUserToken = getLocalUserToken()
      if (localUserToken?.address) {
        toast.error('Login has expired, please login again.', {
          toastId: 'loginHasExpired'
        })
      }
      store.dispatch(removeLoginInfo())
      store.dispatch(saveUserProfile(null))
    }
    const json = await response?.json()
    if (json?.code === 401) {
      const localUserToken = getLocalUserToken()
      if (localUserToken?.token) {
        toast.error('Login has expired, please login again.', {
          toastId: 'loginHasExpired'
        })
      }

      store.dispatch(removeLoginInfo())
      store.dispatch(saveUserProfile(null))
    }
    if (response.status !== 200) {
      return Promise.reject(json)
    }
    return json
  })
}

const initSignature = (): { Authorization: string } => {
  const { token, address } = store.getState().user
  const { currentConnectedAccount } = store.getState().application
  return {
    Authorization: currentConnectedAccount === address ? (token ? `Bearer ${token}` : '') : ''
  }
}

const instance = (baseuri: string) => ({
  get<TData = any>(url: string, params?: any, headers?: any): Promise<IResponse<TData>> {
    return request(`${baseuri}${url}${params ? '?' : ''}${new URLSearchParams(params)}`, {
      headers: {
        ...headers,
        ...initSignature()
      }
    })
  },
  post<TData = any>(url: string, body: any, headers?: any): Promise<IResponse<TData>> {
    const _headers = headers || { 'Content-Type': 'application/json' }

    return request(`${baseuri}${url}`, {
      headers: {
        ..._headers,
        ...initSignature()
      },
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
  }
})

export const ApiInstance = instance(process.env.NEXT_PUBLIC_REQUEST_BASEURL || '')
