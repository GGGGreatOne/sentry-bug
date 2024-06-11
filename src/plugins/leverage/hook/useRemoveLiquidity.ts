import { useBTokenContract } from './useContract'
import { QuantosDetails } from './useFactory'
import { useBoxExecute } from '../../../hooks/useBoxCallback'
import { withDecimals } from '../utils'

export const useRemoveLiquidity = (quantos: QuantosDetails, boxContactAddr: string, requestAmount: string) => {
  const bTokenContract = useBTokenContract(quantos.bTokenT)

  const withdrawRequest = useBoxExecute(
    boxContactAddr,
    {
      toContract: bTokenContract,
      toData: [withDecimals(requestAmount, quantos.tokenInfo?.decimals ?? 18).toString()],
      toFunc: 'makeWithdrawRequest'
    },
    {
      summary: 'Make withdraw request',
      action: 'withdraw request',
      successTipsText: 'Your withdraw request has been make successfully.'
    }
  )

  const withdraw = useBoxExecute(
    boxContactAddr,
    {
      toContract: bTokenContract,
      toData: [],
      toFunc: 'redeem'
    },
    {
      summary: 'Withdraw',
      action: 'withdraw',
      successTipsText: 'Withdraw successfully.'
    }
  )

  // const addLiquidity = useCallback(
  //   async (amount: string) => {
  //     if (!bTokenContract || !tokenContract || !account || !bounceBoxContract) return
  //
  //     const allowance = await tokenContract.allowance(account, bTokenContract.address)
  //     if (new BigNumber(allowance._hex).isLessThan(amount)) {
  //       await tokenContract.approve(bTokenContract.address, amount)
  //     }
  //     const addLiquidityParams = bTokenContract.interface.encodeFunctionData('deposit', [amount, account])
  //     const hx = await bounceBoxContract.execute(...[bTokenContract.address, addLiquidityParams])
  //     console.log('hex', hx)
  //   },
  //   [account, bounceBoxContract, bTokenContract, tokenContract]
  // )

  return {
    // addLiquidity: addLiquidity,
    withdraw: withdraw,
    withdrawRequest: withdrawRequest
  }
}
