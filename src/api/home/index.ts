import { ApiInstance } from 'utils/fetch'
import {
  RecommendedClubListResponse,
  PowerfulResponse,
  ClubPluginResponse,
  ClubListResponse,
  ClubListParams,
  ClubPluginParams,
  basicParams,
  HotClubPluginResponse
} from './type'
import { getImage } from 'api'

export const getClubRecommendList = async () => {
  const res = await ApiInstance.get<RecommendedClubListResponse[]>('club/recommendList', {})
  res.data = getImage(res.data)
  return res
}

export const getPowerful = async () => {
  return ApiInstance.get<PowerfulResponse>('index/powerful', {})
}

export const getClubPlugin = async (params?: ClubPluginParams) => {
  return ApiInstance.get<ClubPluginResponse>('index/clubplugin', { ...params })
}

export const getClubList = async (params?: ClubListParams) => {
  console.log('🚀 ~ getClubList ~ params:', params)
  const res = await ApiInstance.get<ClubListResponse>('club/clublist', { ...params })
  res.data.list = getImage(res.data.list)
  return res
}

export const getHotClubPlugin = async (params?: basicParams) => {
  const res = await ApiInstance.get<HotClubPluginResponse>('index/hotactivities', { ...params })
  res.data.list = getImage(res.data.list)
  return res
}
