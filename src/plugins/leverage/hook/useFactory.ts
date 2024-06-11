import { useFactoryContract } from './useContract'
import { FACTORY_ADDRESS, WBB_ADDRESS } from '../constants'
import { useActiveWeb3React } from '../../../hooks'
import { SupportedChainId } from '../../../constants/chains'
import {
  useMultipleContractSingleData,
  useSingleCallResult,
  useSingleContractMultipleData
} from '../../../hooks/multicall'
import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { useTokens } from '../../../hooks/useToken'
import pair_info from '../abis/pair_info_v6_1.json'
import pair_storage from '../abis/pair_storage_v6.json'
import bToken from '../abis/BToken.json'
import BigNumber from 'bignumber.js'
import { Currency } from '../../../constants/token'
import { useGetPluginTokenListData } from '../../../state/pluginTokenListConfig/hooks'
import { ZERO_ADDRESS } from '../../../constants'

export interface QuantosDetails extends Quantos {
  tokenInfo: Currency | undefined
  totalSupply: BigNumber
  poolCurrentBalance: BigNumber
  fundingFeePerBlockP: BigNumber
  minPositionLev: BigNumber
  utilization: BigNumber
  updateEpoch: BigNumber
  lastEpoch: BigNumber
  currentEpoch: BigNumber
}

export interface Quantos {
  callbackT: string
  pairInfoT: string
  pairStorageT: string
  priceAggregatorT: string
  rewardT: string
  storageT: string
  tokenT: string
  tradingT: string
  bTokenT: string
}

export const useFactory = (chainId?: SupportedChainId) => {
  const { chainId: linkChainId } = useActiveWeb3React()
  const curChainId = chainId || linkChainId
  const factoryContract = useFactoryContract(FACTORY_ADDRESS)
  const totalPools = useSingleCallResult(curChainId, factoryContract, 'quantosCount', undefined)
  const { pluginTokenList } = useGetPluginTokenListData()
  const quantosParams = useMemo(() => {
    if (totalPools.loading) return
    if (totalPools.error) return
    if (totalPools.result) {
      const res = []
      for (let i = 0; i < totalPools.result[0].toNumber(); i++) {
        res.push(i.toString())
      }
      return res
    } else return []
  }, [totalPools.result, totalPools.loading, totalPools.error])
  //
  const results = useSingleContractMultipleData(
    chainId,
    factoryContract,
    'quantos',
    quantosParams ? quantosParams.map(address => [address]) : []
  )
  //
  const allQuantos = useMemo(() => {
    if (results.length > 0) {
      const res = results.map(item => {
        return item.result
      })
      return res
    } else return []
  }, [results])

  const pairInfoInterface = new Interface(pair_info.abi)
  const pairStorageInterface = new Interface(pair_storage.abi)
  const bTokenInterface = new Interface(bToken.abi)
  const tokenInfo = useTokens(
    allQuantos.map(quantos => {
      if (quantos?.tokenT === WBB_ADDRESS) {
        return ZERO_ADDRESS
      } else return quantos?.tokenT
    })
  )

  const fundingFeePerBlockP = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.pairInfoT),
    pairInfoInterface,
    'pairParams',
    [0]
  )

  const minPositionLev = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.pairStorageT),
    pairStorageInterface,
    'pairMinLevPosDai',
    [0]
  )

  const groupCollateralLong = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.pairStorageT),
    pairStorageInterface,
    'groupCollateral',
    [0, 1]
  )

  const groupCollateralShort = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.pairStorageT),
    pairStorageInterface,
    'groupCollateral',
    [0, 0]
  )

  const pairsBackend = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.pairStorageT),
    pairStorageInterface,
    'pairsBackend',
    [0]
  )

  const bTokenMarketCap = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.bTokenT),
    bTokenInterface,
    'marketCap',
    []
  )

  const bTokenCurrentBalance = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.bTokenT),
    bTokenInterface,
    'currentBalanceDai',
    []
  )

  const bTokenUpdateEpoch = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.bTokenT),
    bTokenInterface,
    'updateEpoch',
    []
  )

  const currentEpoch = useMultipleContractSingleData(
    curChainId,
    allQuantos.map(quantos => quantos?.bTokenT),
    bTokenInterface,
    'epochCurrent',
    []
  )

  const quantosInfo = useMemo(() => {
    if (!allQuantos || !curChainId) return undefined
    if (totalPools.result?.[0].toNumber() === 0) {
      return [] as QuantosDetails[]
    }
    if (
      !tokenInfo ||
      !bTokenMarketCap.length ||
      !fundingFeePerBlockP.length ||
      !minPositionLev.length ||
      !groupCollateralLong.length ||
      !groupCollateralShort.length ||
      !pairsBackend.length ||
      !bTokenUpdateEpoch.length ||
      !currentEpoch.length
    )
      return undefined

    if (
      bTokenMarketCap[0].loading ||
      fundingFeePerBlockP[0].loading ||
      minPositionLev[0].loading ||
      groupCollateralLong[0].loading ||
      groupCollateralShort[0].loading ||
      pairsBackend[0].loading ||
      bTokenUpdateEpoch[0].loading ||
      currentEpoch[0].loading
    )
      return undefined

    if (
      pluginTokenList &&
      (bTokenMarketCap[0].result ||
        fundingFeePerBlockP[0].result ||
        minPositionLev[0].result ||
        groupCollateralLong[0].result ||
        groupCollateralShort[0].result ||
        pairsBackend[0].result ||
        bTokenUpdateEpoch[0].result ||
        currentEpoch[0].result)
    ) {
      const infos = allQuantos.map((quantos, index) => {
        const quantosTotalSupply = new BigNumber(bTokenMarketCap[index].result?.[0]._hex)
        const longValue = groupCollateralLong[index].result?.[0]._hex
        const shortValue = groupCollateralShort[index].result?.[0]._hex
        const totalSupply = quantosTotalSupply.div(new BigNumber(10).pow(tokenInfo[index]?.decimals ?? 1))
        const poolCurrentBalance = new BigNumber(bTokenCurrentBalance[index]?.result?.[0]._hex).div(
          new BigNumber(10).pow(tokenInfo[index]?.decimals ?? 1)
        )
        const utilization = new BigNumber(longValue)
          .minus(shortValue)
          .absoluteValue()
          .div(quantosTotalSupply)
          .times(100)
        return {
          tokenInfo: tokenInfo[index],
          totalSupply: totalSupply,
          poolCurrentBalance: poolCurrentBalance,
          fundingFeePerBlockP: new BigNumber(fundingFeePerBlockP[index].result?.fundingFeePerBlockP._hex),
          minPositionLev: new BigNumber(minPositionLev[index].result?.[0]._hex).div(
            new BigNumber(10).pow(tokenInfo[index]?.decimals ?? 1)
          ),
          utilization: utilization,
          updateEpoch: new BigNumber(bTokenUpdateEpoch[index]?.result?.[0]._hex),
          lastEpoch: new BigNumber(bTokenUpdateEpoch[index]?.result?.[1]._hex),
          currentEpoch: new BigNumber(currentEpoch?.[index]?.result?.[0]._hex),
          ...quantos
        } as QuantosDetails
      })
      const pluginTokenAddressList = pluginTokenList
        .filter(t => t.contractAddress !== ZERO_ADDRESS)
        .map(i => i.contractAddress) as string[]
      // TODO check
      return infos.filter(info =>
        pluginTokenAddressList.map(i => i.toLowerCase()).includes(info?.tokenT?.toLowerCase() ?? '')
      )
    } else return undefined
  }, [
    allQuantos,
    tokenInfo,
    bTokenMarketCap,
    fundingFeePerBlockP,
    minPositionLev,
    groupCollateralLong,
    groupCollateralShort,
    pairsBackend,
    curChainId,
    bTokenCurrentBalance,
    currentEpoch,
    bTokenUpdateEpoch,
    totalPools,
    pluginTokenList
  ])

  return { allQuantos: quantosInfo }
}
