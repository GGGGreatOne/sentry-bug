import { useRequest } from 'ahooks'
import { GetClubNetWorthList } from 'api/boxes'
interface ClubNetWorthListParams {
  boxId: string | undefined | null
}
export const useGetClubNetWorthList = (params: ClubNetWorthListParams) => {
  return useRequest(
    async () => {
      if (!params.boxId) return
      const res = await GetClubNetWorthList(params.boxId)
      return res.data
    },
    {
      ready: !!params.boxId,
      manual: false
    }
  )
}
