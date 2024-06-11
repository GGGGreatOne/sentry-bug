import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { withDecimals } from '../utils'
import { useActiveWeb3React } from 'hooks'
import { usePairStorageContract } from './useContract'

export const useGetOrderLimit = (storageAddress: string | undefined, poolCurrentBalance: BigNumber | undefined) => {
  const { library: provider } = useActiveWeb3React()
  const pairStorageContract = usePairStorageContract(storageAddress ?? '')

  return useCallback(async () => {
    try {
      if (pairStorageContract && provider && poolCurrentBalance) {
        const pairsInfo = await Promise.all([
          pairStorageContract.pairsBackend(0),
          pairStorageContract.groupCollateral(0, true)
        ])
        const pairsBackend = pairsInfo[0]
        const groupCollateral = pairsInfo[1]
        const maxCollateralP = new BigNumber(pairsBackend[1].maxCollateralP._hex)
        const MaxPos = poolCurrentBalance.times(maxCollateralP).div(100)
        const curPos = withDecimals(new BigNumber(groupCollateral._hex), 18, false)
        return MaxPos?.minus(curPos)
      } else return new BigNumber(0)
    } catch (e) {
      return undefined
    }
  }, [provider, pairStorageContract, poolCurrentBalance])
}
