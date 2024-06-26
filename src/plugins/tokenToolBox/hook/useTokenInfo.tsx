import { useRequest } from 'ahooks'
import { getTokenInfo } from 'api/toolbox'
import { TokenInfo, TokenInfoList } from 'api/toolbox/type'

export const useTokenInfo = (hash?: string) => {
  const { data, loading, run } = useRequest(
    async (): Promise<TokenInfo | undefined> => {
      return await getTokenInfo({
        hash: hash
      }).then(resp => {
        if (!resp.data.list.length) {
          throw new Error('fetch error')
        }
        return resp.data.list.find(i => i.hash == hash)
      })
    },
    {
      refreshDeps: [hash],
      retryInterval: 10000,
      retryCount: 30
    }
  )
  return { data, loading, run }
}
export const useTokenList = (page: number, pageSize: number, account?: string) => {
  const { data, loading } = useRequest(
    async (): Promise<TokenInfoList | undefined> => {
      if (!account) Promise.reject(undefined)
      return await getTokenInfo({
        address: account || '',
        offset: (page - 1) * pageSize,
        limit: pageSize
      }).then(resp => resp.data)
    },
    {
      refreshDeps: [account, page, pageSize],
      retryInterval: 10000,
      retryCount: 20
    }
  )
  return { data, loading }
}

export const useMyTokenList = (page: number, pageSize: number, account?: string) => {
  const { data, loading } = useRequest(
    async (): Promise<TokenInfoList | undefined> => {
      return account
        ? await getTokenInfo({
            address: account || '',
            offset: (page - 1) * pageSize,
            limit: pageSize
          }).then(resp => resp.data)
        : undefined
    },
    {
      refreshDeps: [account, page, pageSize],
      retryInterval: 10000,
      retryCount: 20
    }
  )
  return { data, loading }
}
