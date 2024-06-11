import { ApiInstance } from 'utils/fetch'
import { BuyerSignResult, GetListClubsParams, ListClubsResult } from './type'
import { getImage } from 'api'

export const GetListClubs = async (params: GetListClubsParams) => {
  const res = await ApiInstance.get<ListClubsResult>('market/clublist', params)
  res.data.list = getImage(res.data.list)
  return res
}

export const queryLoadListClubs = async (params: GetListClubsParams) => {
  const { pageNum, pageSize } = params
  const { data } = await GetListClubs(params)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        list: pageNum >= data.total ? [] : data.list,
        total: data.total || 0,
        pageNum,
        pageSize
      })
    }, 100)
  })
}

export const GetBuyerSign = async () => {
  return await ApiInstance.get<BuyerSignResult>('market/buyersign')
}
