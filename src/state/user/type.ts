import { ILoginUserInfo } from 'api/user/type'

export interface ICacheLoginInfo {
  token: string
  userId: number
  address: string
  loading?: boolean
}

export type IUserState = ICacheLoginInfo & ILoginUserInfo
