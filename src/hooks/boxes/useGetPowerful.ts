import { useRequest } from 'ahooks'
import { getPowerful } from 'api/home'

export const useGetPowerful = () => {
  return useRequest(
    async () => {
      const res = await getPowerful()
      return res.data
    },
    {
      manual: false,
      pollingInterval: 60000
    }
  )
}
