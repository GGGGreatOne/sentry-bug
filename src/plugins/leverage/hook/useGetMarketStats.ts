import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from 'hooks'
import { useSingleCallResult } from '../../../hooks/multicall'
import { usePairInfoContract, useStorageContract } from './useContract'

export const useGetMarketStats = (pairIndex: number, storageAddress: string, pairInfoAddress: string) => {
  const { chainId } = useActiveWeb3React()
  const pairInfoContract = usePairInfoContract(pairInfoAddress)
  const storageContract = useStorageContract(storageAddress)

  const longRes = useSingleCallResult(chainId, storageContract, 'openInterestDai', [pairIndex, 0])
  const shortRes = useSingleCallResult(chainId, storageContract, 'openInterestDai', [pairIndex, 1])
  const infoRes = useSingleCallResult(chainId, pairInfoContract, 'getFundingFeePerBlockP', [pairIndex])

  const marketStats = useMemo(() => {
    if (longRes.result?.[0] && shortRes.result?.[0] && infoRes.result?.[0] && pairInfoContract && storageContract) {
      const long = new BigNumber(longRes.result?.[0]._hex).div(Number(`1e${18}`))
      const short = new BigNumber(shortRes.result?.[0]._hex).div(Number(`1e${18}`))
      const feePer = new BigNumber(infoRes.result?.[0]._hex)
      const longVal =
        long.toString() !== '0' ? long.minus(short).times(feePer).times(1800).div(Number(1e10)).div(long) : BigNumber(0)
      const shortVal =
        short.toString() !== '0'
          ? long.minus(short).times(feePer).times(1800).div(Number(1e10)).div(short)
          : new BigNumber(0)
      return {
        openDaiLong: long,
        openDaiShort: short,
        borrowLongVal: longVal,
        borrowShortVal: shortVal
      }
    } else
      return {
        openDaiLong: new BigNumber(0),
        openDaiShort: new BigNumber(0),
        borrowLongVal: new BigNumber(0),
        borrowShortVal: new BigNumber(0)
      }
  }, [longRes, shortRes, infoRes, storageContract, pairInfoContract])

  return {
    openDaiLong: marketStats.openDaiLong,
    openDaiShort: marketStats.openDaiShort,
    borrowLongVal: marketStats.borrowLongVal,
    borrowShortVal: marketStats.borrowShortVal
  }
}
