import { Contract } from '@ethersproject/contracts'
import { ARGENT_WALLET_DETECTOR_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '@uniswap/sdk-core'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { getContract } from 'utils/contract'
import NonfungiblePositionManagerJson from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { NonfungiblePositionManager } from '../lib/uniswap/src/abis/types/v3/NonfungiblePositionManager'
import { ArgentWalletDetector } from '../lib/uniswap/src/abis/types/ArgentWalletDetector'
import ARGENT_WALLET_DETECTOR_ABI from '../lib/uniswap/src/abis/argent-wallet-detector.json'
import { Weth } from '../lib/uniswap/src/abis/types/Weth'
import { WRAPPED_NATIVE_CURRENCY } from '../constants/tokens'
import WETH_ABI from '../lib/uniswap/src/abis/weth.json'

const { abi: NFTPositionManagerABI } = NonfungiblePositionManagerJson

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library: provider, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
}

export function useV3NFTPositionManagerContract(withSignerIfPossible?: boolean): NonfungiblePositionManager | null {
  const contract = useContract<NonfungiblePositionManager>(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
    NFTPositionManagerABI,
    withSignerIfPossible
  )
  return contract
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const { chainId } = useActiveWeb3React()
  return useContract<Weth>(
    chainId ? WRAPPED_NATIVE_CURRENCY[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}
