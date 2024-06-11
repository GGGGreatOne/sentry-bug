import { useRequest } from 'ahooks'
import { GetBoxTokenList } from 'api/boxes/index'
import { ITokenListParams } from 'api/boxes/type'

export const useGetBoxTokenList = (params: ITokenListParams) => {
  return useRequest(
    async () => {
      const res = await GetBoxTokenList(params)
      return res.data
    },
    {
      manual: false,
      refreshDeps: [params.pageNum, params.pageSize, params.boxId, params.contractAddress, params.tokenName]
    }
  )
}
