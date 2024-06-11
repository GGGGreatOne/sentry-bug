import { ApiInstance } from '../../utils/fetch'
import { BoxRewardList } from './index'

export const getBoxRewardId = async () => {
  return ApiInstance.get<string>(`reward/max/next`)
}

export const getBoxRewardList = async () => {
  return ApiInstance.get<BoxRewardList>(`reward/auction/list`, { orderByColumn: 'createTime', isAsc: 'desc' })
}
