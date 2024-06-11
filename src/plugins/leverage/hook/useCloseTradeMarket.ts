/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTradingV6Contract } from './useContract'
import { useBoxExecute } from '../../../hooks/useBoxCallback'

export const useCloseTradeMarket = (
  tradingAddress: string,
  boxContactAddr: string,
  pairIndex: number,
  orderIndex: number
) => {
  const contract = useTradingV6Contract(tradingAddress)
  return useBoxExecute(
    boxContactAddr,
    {
      toContract: contract,
      toData: [pairIndex, orderIndex],
      toFunc: 'closeTradeMarket'
    },
    {
      summary: 'Close position',
      action: 'close position',
      successTipsText: 'Your position has been closed successfully.'
    }
  )
}

// export const useUpdateTradeMarket = (tradingAddress: string, storageAddress: string) => {
//   const contract = useTradingV6Contract(tradingAddress)!
//   const sendTransaction = useSendTransaction()
//   return useCallback(
//     async (isSL: boolean, price: BigNumber, orderIndex: number, pairIndex: number) => {
//       try {
//         const minETHFees = await contract.minExecutionFee()
//         const func = isSL ? 'updateSl' : 'updateTp'
//         const params = [pairIndex, orderIndex, price.times(Number(1e10)).toFixed(0)] as any
//         await sendTransaction({
//           contract: contract,
//           methodName: func,
//           inputs: [...params],
//           value: BigInt(new BigNumber(minETHFees._hex).toString()),
//           title: 'Update position'
//         }).then((res: any) => {
//           console.log('=================================', res)
//           toast.success('Update position success!')
//         })
//       } catch (e) {
//         console.error(e)
//       }
//     },
//     [contract, sendTransaction]
//   )
// }
