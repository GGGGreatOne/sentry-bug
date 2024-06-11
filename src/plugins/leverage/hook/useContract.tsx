import { useContract } from 'hooks/useContract'
import trading_v6 from '../abis/trading_v6_1.json'
import factory from '../abis/factory.json'
import vault from '../abis/trading_vault_v5.json'
import pairStorage from '../abis/pair_storage_v6.json'
import bToken from '../abis/BToken.json'
import { SupportedChainId } from '../../../constants/chains'
import pair_info from '../abis/pair_info_v6_1.json'
import storage from '../abis/trading_storage_v5.json'
export const useTradingV6Contract = (tradingAddress: string) => {
  return useContract(tradingAddress, trading_v6.abi, true)
}

export const useFactoryContract = (factoryAddress: string) => {
  return useContract(factoryAddress, factory.abi, false)
}

export const useVaultContract = (vaultAddress: string) => {
  return useContract(vaultAddress, vault.abi, false)
}

export const usePairStorageContract = (pairStorageAddress: string) => {
  return useContract(pairStorageAddress, pairStorage.abi, false)
}

export const useBTokenContract = (bTokenAddress: string) => {
  return useContract(bTokenAddress, bToken.abi, true)
}

export const usePairInfoContract = (pairInfoAddress: string, chainId?: SupportedChainId) => {
  return useContract(pairInfoAddress, pair_info.abi, false, chainId)
}

export const useStorageContract = (storageAddress: string, chainId?: SupportedChainId) => {
  return useContract(storageAddress, storage.abi, false, chainId)
}
