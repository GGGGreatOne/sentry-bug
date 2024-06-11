import { usePagination } from 'ahooks'
import { getBoxAuctionPoolList, getClubAuctionPoolList } from 'plugins/auction/api'
import { IClubAuctionPoolListPagination, IClubAuctionPoolParams } from 'plugins/auction/api/type'
import { useEffect, useRef } from 'react'
import { POLLING_INTERVAL } from 'utils'

export const useGetAuctionList = (params: IClubAuctionPoolParams, isOwner?: boolean) => {
  const isChange = useRef(false)
  useEffect(() => {
    isChange.current = true
  }, [params])

  const result = usePagination<IClubAuctionPoolListPagination, any>(
    async () => {
      if (!isOwner) {
        const res = await getClubAuctionPoolList({ ...params })
        return {
          total: res.data.total,
          list: res.data.date
        }
      }
      // if it is a club owner, request the draft list
      const _params = { ...params }
      delete _params.boxId
      const darft = await getBoxAuctionPoolList(params.boxId || '', { ..._params })
      return {
        total: darft.data.total,
        list: darft.data.data
      }
    },
    {
      defaultPageSize: params.pageSize || 10,
      manual: false,
      refreshDeps: [params],
      pollingInterval: POLLING_INTERVAL,
      onSuccess() {
        isChange.current = false
      }
    }
  )
  return { ...result, loading: isChange.current && result.loading }
}
