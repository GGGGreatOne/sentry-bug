import { GetFollowingList } from 'api/user'
import { GetFollowingListParams } from 'api/user/type'
import { usePagination } from 'ahooks'
export const useGetFollowerlist = (params: GetFollowingListParams) => {
  return usePagination(
    async () => {
      const res = await GetFollowingList(params)
      return res.data
    },
    {
      defaultPageSize: params.pageSize,
      manual: false,
      refreshDeps: [params.boxType, params.pageNum, params.pageSize]
    }
  )
}
