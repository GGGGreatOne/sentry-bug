import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { forMatterOpenTrades, isBeingMarketClosed } from './utils'
import { Contract } from 'ethers'
import trading_storage from '../abis/trading_storage_v5.json'
import { Tuple } from '../type'
import { useActiveWeb3React } from 'hooks'

export const useGetUserOpenTrade = (pairIndex: number, storageAddress: string, decimals: number) => {
  const { account, library: provider } = useActiveWeb3React()
  const [userOpenTrades, setUserOpenTrades] = useState([] as Tuple[])
  const getUserOpenTrade = useCallback(async () => {
    try {
      if (account && provider && storageAddress) {
        //TODO current pairIndex only one , change in next update
        const contract = new Contract(storageAddress, trading_storage.abi, provider)
        const userTotalTrade = await contract.openTradesCount(account, pairIndex)
        const trades = new BigNumber(userTotalTrade._hex).toNumber()
        const task = []
        if (trades > 0) {
          for (let i = 0; i < 3; i++) {
            task.push(contract.openTrades(account, pairIndex, i))
          }
        }
        const res = await Promise.all(task)
        const openTrades = forMatterOpenTrades(res, trades, account, false, decimals)
        const userPendingMarketOrder: Tuple[] = []
        const blockNumber = await provider.getBlockNumber()
        const userPendingOrder = await contract.getPendingOrderIds(account)
        const userPendingOrderTask: any[] = []
        userPendingOrder.forEach((orderId: BigNumber) => {
          userPendingOrderTask.push(contract.reqID_pendingMarketOrder(orderId.toString()))
        })
        const userPendingOrderDetails = await Promise.all(userPendingOrderTask)
        userPendingOrderDetails.forEach((details, index) => {
          const inPending = new BigNumber(blockNumber).isGreaterThan(new BigNumber(details.block._hex).plus(30))
          const res = forMatterOpenTrades(
            details,
            1,
            account,
            true,
            decimals,
            new BigNumber(userPendingOrder[index]._hex),
            !inPending
          )
          userPendingMarketOrder.push(res[0])
        })
        isBeingMarketClosed(openTrades, userPendingMarketOrder)
        setUserOpenTrades(openTrades.concat(userPendingMarketOrder.filter(item => item.leverage !== 0)))
      }
    } catch (e) {
      console.log('get user open trades failed!', e)
    }
  }, [account, provider, pairIndex, storageAddress, decimals])
  useEffect(() => {
    getUserOpenTrade().then()
    const interval = setInterval(async () => {
      await getUserOpenTrade()
    }, 15000)
    return () => clearInterval(interval)
  }, [getUserOpenTrade])

  return { userOpenTrades: userOpenTrades, getUserOpenTrade: getUserOpenTrade }
}
