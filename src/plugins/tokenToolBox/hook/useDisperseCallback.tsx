import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { usePagination } from 'ahooks'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { useTokenAllowance } from 'hooks/useAllowances'
import { DISPERSE_CONTRACT_ADDRESSES, SupportedChainId } from '../constants'
import { getDisperselist } from 'api/toolbox'
import { IListOrder, OrderType } from 'api/boxes/type'

export const useErc20TokenDetail = (tokenAddress: string, queryChainId: SupportedChainId): any => {
  const { account } = useActiveWeb3React()
  const res = useToken(tokenAddress, queryChainId)
  const balance = useCurrencyBalance(account, res ?? undefined, queryChainId)
  const currentAllowance = useTokenAllowance(
    res ?? undefined,
    account ?? undefined,
    DISPERSE_CONTRACT_ADDRESSES[queryChainId as SupportedChainId]
  )
  const max = useMemo(() => {
    return balance && currentAllowance
      ? balance?.greaterThan(currentAllowance)
        ? currentAllowance.toExact()
        : balance?.toExact()
      : '0'
  }, [balance, currentAllowance])
  return useMemo(() => {
    return { tokenCurrency: res, balance: balance, allowance: currentAllowance, max }
  }, [balance, currentAllowance, max, res])
}

export const useDisperseList = (tokenContract: string) => {
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await getDisperselist({
        tokenContract,
        pageNum: current,
        pageSize: pageSize,
        orderByColumn: OrderType.TXTS,
        isAsc: IListOrder.DESC
      })

      return {
        ...res.data,
        list: res.data.list.map(v => {
          return { ...v, name: v.name.replace(/Uniswap/g, 'Bitswap') }
        })
      }
    },
    {
      defaultPageSize: 5,
      retryInterval: 10000,
      retryCount: 20,
      refreshDeps: [tokenContract]
    }
  )
}
