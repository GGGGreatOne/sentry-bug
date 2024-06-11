import { usePagination } from 'ahooks'
import { GetStablecoinTroves } from 'api/boxes'
import { IStablecoinTroveParams } from 'api/boxes/type'

export const useGetBitstableTroveList = (params: IStablecoinTroveParams) => {
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await GetStablecoinTroves({ pageNum: current, pageSize, ...params })
      return res.data
    },
    {
      defaultPageSize: params.pageSize || 10,
      manual: false,
      refreshDeps: [params.boxId, params.pageNum, params.pageSize]
    }
  )
}
