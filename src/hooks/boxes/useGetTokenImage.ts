import { useRequest } from 'ahooks'
import { getTokenImg } from 'api/common'

export const useGetTokenImage = (tokenContract?: string) => {
  return useRequest(
    async () => {
      try {
        if (!tokenContract) return undefined
        const res = await getTokenImg({ tokenContract })
        return res?.data
      } catch (err) {
        return Promise.reject(err)
      }
    },
    {
      manual: false,
      refreshDeps: [tokenContract]
    }
  )
}
