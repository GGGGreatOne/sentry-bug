import { useRequest } from 'ahooks'
import { GetClubRanks } from 'api/boxes/index'
import { ClubRanksListParams } from 'api/boxes/type'

export const useGetClubRanks = (params: ClubRanksListParams) => {
  return useRequest(
    async () => {
      if (!params.clubId) return
      const res = await GetClubRanks(params)
      return res.data
    },
    {
      manual: false
    }
  )
}
