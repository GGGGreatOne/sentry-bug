import { useRequest } from 'ahooks'
import { GetStablecoinList } from 'api/boxes/index'
import { IStablecoinListParams } from 'api/boxes/type'

export const useGetStableList = (params?: IStablecoinListParams) => {
  return useRequest(
    async () => {
      const res = await GetStablecoinList(params)
      return res.data
    },
    {
      manual: false,
      refreshDeps: []
    }
  )
}
