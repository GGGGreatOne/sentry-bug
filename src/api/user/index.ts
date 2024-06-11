import { getImage } from 'api'
import {
  IAddressRegisterLoginParams,
  IAddressRegisterLoginResponse,
  ILoginUserInfo,
  FollowBoxParams,
  IAuthorizeAddress,
  GetFollowingListParams,
  Followinglist,
  GetActivitiesListParams,
  ActivitiesList,
  ActivitiesCount,
  CollectPluginParams,
  FollowingCount,
  GetFollowerlistParams,
  Followerlist,
  Friendlist,
  FollowerCount,
  UserAvatarParams,
  UserNameParams
} from './type'

import { ApiInstance } from 'utils/fetch'
import { BoxListSimpleResult } from 'api/boxes/type'

export const addressRegisterOrLogin = async (params: IAddressRegisterLoginParams) => {
  return ApiInstance.post<IAddressRegisterLoginResponse>('wallet/login', params)
}

export const getUserProfile = async () => {
  return ApiInstance.get<ILoginUserInfo>('user/profile')
}

export const followBox = async (params: FollowBoxParams) => {
  return ApiInstance.post('follow/following', params)
}

export const AuthorizeTwitter = async () => {
  return ApiInstance.get<IAuthorizeAddress>('user/render/twitter2')
}

export const GetFollowingList = async (params: GetFollowingListParams) => {
  const res = await ApiInstance.get<Followinglist>('user/follow/followinglist', params)
  res.data.list = getImage(res.data.list)
  return res
}

export const GetSimpleFollowingList = async (params: GetFollowingListParams) => {
  const res = await ApiInstance.get<BoxListSimpleResult>('user/follow/followinglist', params)
  return res
}

export const GetFollowingCount = async () => {
  return ApiInstance.get<FollowingCount>('user/follow/followingCount')
}

export const GetActivitiesList = async (params: GetActivitiesListParams) => {
  const res = await ApiInstance.get<ActivitiesList>('activities/list', params)
  res.data.list = getImage(res.data.list)
  return res
}

export const GetActivitiesCount = async () => {
  return ApiInstance.get<ActivitiesCount>('activities/count')
}

export const CollectPlugin = async (params: CollectPluginParams) => {
  return ApiInstance.post('collect/collecting', params)
}

export const GetFollowerCount = async () => {
  return ApiInstance.get<FollowerCount>('user/follow/followerCount')
}

export const GetFollowerlist = async (params: GetFollowerlistParams) => {
  return ApiInstance.get<Followerlist>('user/follow/followerlist', params)
}

export const GetFriendslist = async (params: GetFollowerlistParams) => {
  return ApiInstance.get<Friendlist>('user/follow/friendlist', params)
}

export const UserAvatar = async (params: UserAvatarParams) => {
  return ApiInstance.post('user/avatar', params)
}

export const SetUserName = async (params: UserNameParams) => {
  return ApiInstance.post('user/username', params)
}
