import { useRequest } from 'ahooks'
import { getClubList } from 'api/home'
import { ClubListParams } from 'api/home/type'

export const useGetClubList = (params?: ClubListParams) => {
  return useRequest(
    async () => {
      const res = await getClubList(params)
      return res?.data?.list || []
    },
    {
      manual: false,
      pollingInterval: 60000
    }
  )
}
