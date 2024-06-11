import { useRequest } from 'ahooks'
import { publishBox } from 'api/boxes'
import { toast } from 'react-toastify'
import { addOtherAuction } from '.'
import { useCallback } from 'react'

export const useAddAuctionToClub = (boxId: string | null | undefined, poolId: string) => {
  const runTo = useCallback(async () => {
    let publicResult: any = null
    let res: any = null
    publicResult = await publishBox(boxId || '')
    if (publicResult.code !== 200) {
      return Promise.reject(publicResult.msg)
    }
    res = await addOtherAuction(boxId as string, poolId)
    if (res.code === 200) {
      toast.success('Added to your club')
    } else {
      return Promise.reject(res.msg)
    }
  }, [boxId, poolId])
  return useRequest(
    async () => {
      try {
        // handle error messages
        await runTo()
      } catch (error: any) {
        toast.error(error)
      }
      return
    },
    { ready: !!boxId && !!poolId, manual: true, refreshDeps: [boxId, poolId] }
  )
}
