import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'
import trading_storage from '../abis/trading_storage_v5.json'
import { useActiveWeb3React } from '../../../hooks'
import { withDecimals } from '../utils'
import { TupleLimitOrder } from '../type'

export const useGetUserOpenLimitOrders = (storageAddress: string, tradePairIndex = 0, decimals: number) => {
  const { account, library: provider } = useActiveWeb3React()
  const [userLimitOrders, setUserLimitOrders] = useState([] as TupleLimitOrder[])

  const getUserOpenLimitOrders = useCallback(async () => {
    try {
      if (provider && account && storageAddress) {
        //TODO current pairIndex only one , change in next update
        const contract = new Contract(storageAddress, trading_storage.abi, provider)
        const userTotalTrade = await contract.openLimitOrdersCount(account, tradePairIndex)
        const trades = new BigNumber(userTotalTrade._hex).toNumber()
        const task = []
        const hasOpenLimitOrderArray = []
        if (trades > 0) {
          for (let i = 0; i < 3; i++) {
            const has = await contract.hasOpenLimitOrder(account, tradePairIndex, i)
            if (has) {
              hasOpenLimitOrderArray.push(i)
            }
          }
        }

        for (let i = 0; i < hasOpenLimitOrderArray.length; i++) {
          task.push(contract.getOpenLimitOrder(account, tradePairIndex, hasOpenLimitOrderArray[i]))
        }
        const res = await Promise.all(task)
        const userOpenLimit: TupleLimitOrder[] = []
        for (let i = 0; i < trades; i++) {
          userOpenLimit.push({
            block: new BigNumber(res[i].block._hex).toNumber(),
            buy: res[i].buy,
            index: new BigNumber(res[i].index._hex).toNumber(),
            leverage: new BigNumber(res[i].leverage._hex).toNumber(),
            maxPrice: withDecimals(res[i].maxPrice._hex, 10, false),
            minPrice: withDecimals(res[i].minPrice._hex, 10, false),
            pairIndex: new BigNumber(res[i].pairIndex._hex).toNumber(),
            positionSize: withDecimals(res[i].positionSize._hex, decimals, false),
            sl: withDecimals(res[i].sl._hex, decimals, false),
            spreadReductionP: withDecimals(res[i].spreadReductionP._hex, 10, false),
            tokenId: new BigNumber(res[i].tokenId._hex).toNumber(),
            trader: account,
            tp: withDecimals(res[i].tp._hex, decimals, false)
          })
        }
        console.log('userOpenLimit', userOpenLimit)
        setUserLimitOrders(userOpenLimit)
      }
    } catch (e) {
      console.log('get user open Limit orders failed! failed!', e)
    }
  }, [provider, account, storageAddress, tradePairIndex, decimals])

  useEffect(() => {
    getUserOpenLimitOrders().then()
    const interval = setInterval(async () => {
      await getUserOpenLimitOrders()
    }, 15000)
    return () => clearInterval(interval)
  }, [getUserOpenLimitOrders])

  return { getUserOpenLimitOrders: getUserOpenLimitOrders, userLimitOrders: userLimitOrders }
}
