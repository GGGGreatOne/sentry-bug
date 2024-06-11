import { useFactoryContract } from './useContract'
import { FACTORY_ADDRESS, WBB_ADDRESS } from '../constants'
import BigNumber from 'bignumber.js'
import { withDecimals } from '../utils'
import { useBoxExecute } from '../../../hooks/useBoxCallback'
import { control } from '../pages/components/dialog/modal'

export const useCreatPool = (tokenAddress: string, boxAddress: string, initAmount: BigNumber, decimals: number) => {
  const factoryContract = useFactoryContract(FACTORY_ADDRESS)
  const isWBB = tokenAddress.toLowerCase() === WBB_ADDRESS.toLowerCase()
  return useBoxExecute(
    boxAddress,
    isWBB
      ? {
          toContract: factoryContract,
          toData: [tokenAddress, withDecimals(initAmount.toString(), new BigNumber(decimals).toNumber()).toString()],
          toFunc: 'createQuanto',
          value: withDecimals(initAmount.toString(), new BigNumber(decimals).toNumber()).toString()
        }
      : {
          toContract: factoryContract,
          toData: [tokenAddress, withDecimals(initAmount.toString(), new BigNumber(decimals).toNumber()).toString()],
          toFunc: 'createQuanto'
        },
    {
      summary: 'Create Quanto',
      action: 'create quanto',
      successTipsText: 'Create Quanto successfully.',
      onSuccess: () => control.hide('CreateLiquidityDialog')
    }
  )
  // const { account } = useActiveWeb3React()
  // const bounceBox = useBoxContract(boxAddress)
  // const factoryContract = useFactoryContract(FACTORY_ADDRESS)
  // const tokenContract = useTokenContract(tokenAddress, true)

  // const creatPool = useCallback<any>(
  //   async (initAmount: BigNumber) => {
  //     try {
  //       if (!factoryContract || !bounceBox || !tokenContract || !account) return
  //       if (tokenAddress?.length !== VALIDITY_ADDRESS_LENGTH) throw new Error('invalidity address')
  //       let decimals = 18
  //       try {
  //         const allowance = await tokenContract.allowance(account, factoryContract.address)
  //         decimals = await tokenContract.decimals()
  //         if (new BigNumber(allowance._hex).isLessThan(withDecimals(initAmount, decimals))) {
  //           const approve = await tokenContract
  //             .approve(FACTORY_ADDRESS, withDecimals(initAmount, decimals).toString())
  //             .then()
  //           await approve.wait()
  //         }
  //       } catch (e) {
  //         return Promise.reject('invalid address')
  //       }
  //       const factoryInterface = new Interface(factory.abi)
  //       const creatParams = factoryInterface.encodeFunctionData('createQuanto', [
  //         tokenContract.address,
  //         withDecimals(initAmount.toString(), new BigNumber(decimals).toNumber()).toString()
  //       ])
  //       await bounceBox.execute(...[factoryContract.address, creatParams])
  //       await updateBoxPluginBitleverageDataCallback('add', { token0: tokenAddress })
  //     } catch (e) {
  //       return Promise.reject(e)
  //     }
  //   },
  //   [factoryContract, bounceBox, tokenContract, account, tokenAddress, updateBoxPluginBitleverageDataCallback]
  // )
  //
  // return { creatPool: creatPool }
}
