import { useBTokenContract } from './useContract'
import { useBoxExecute } from '../../../hooks/useBoxCallback'
import { QuantosDetails } from './useFactory'
import { withDecimals } from '../utils'
import { useActiveWeb3React } from '../../../hooks'

export const useAddLiquidity = (quantos: QuantosDetails, boxContactAddr: string, amount: string, isWBB: boolean) => {
  const bTokenContract = useBTokenContract(quantos.bTokenT)
  const { account } = useActiveWeb3React()

  return useBoxExecute(
    boxContactAddr,
    {
      toContract: bTokenContract,
      toData: [withDecimals(amount, quantos.tokenInfo?.decimals ?? 18).toString(), account],
      toFunc: 'deposit2',
      value: isWBB ? withDecimals(amount, quantos.tokenInfo?.decimals ?? 18).toString() : undefined
    },
    {
      summary: 'Add liquidity',
      action: 'add liquidity',
      successTipsText: 'Your liquidity has been added successfully.'
    }
  )
}
