import { useRequest } from 'ahooks'
import { getOnChainAssetsList } from 'api/common'
import { useUserInfo } from 'state/user/hooks'

export const useGetTokenAssetsList = () => {
  const { token } = useUserInfo()
  return useRequest(
    async () => {
      try {
        const res = await getOnChainAssetsList()
        return res.data
      } catch (err) {
        return Promise.reject(err)
      }
    },
    {
      manual: false,
      refreshDeps: [token]
    }
  )
}
