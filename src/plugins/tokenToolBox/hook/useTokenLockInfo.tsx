import { useActiveWeb3React } from 'hooks'
import { useRequest, usePagination } from 'ahooks'
import { getTokenLockerList } from 'api/toolbox'
import { LockInfo } from 'api/toolbox/type'
import { IListOrder, OrderType } from 'api/boxes/type'

export const useTokenLockInfo = (chain: number | undefined, hash?: string) => {
  const { account } = useActiveWeb3React()
  const { data, loading, run } = useRequest(
    async (): Promise<LockInfo | undefined> => {
      if ((chain === 0 && !chain) || !hash) {
        return Promise.reject(undefined)
      }
      return await getTokenLockerList({
        tokenContract: ''
      }).then(resp => resp.data.list.find(i => i.hash == hash))
    },
    {
      refreshDeps: [account, hash, chain],
      retryInterval: 10000,
      retryCount: 20
    }
  )
  return { data, loading, run }
}

export const useMyLocks = (tokenContract?: string) => {
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await getTokenLockerList({
        tokenContract: tokenContract ? tokenContract : '',
        pageNum: current,
        pageSize: pageSize,
        orderByColumn: OrderType.TXTS,
        isAsc: IListOrder.DESC
      })
      return res.data
    },
    {
      defaultPageSize: 6,
      refreshDeps: [tokenContract],
      retryInterval: 10000,
      retryCount: 20
    }
  )
}
