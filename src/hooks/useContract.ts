import { Contract } from '@ethersproject/contracts'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ENS_ABI from 'abis/ens-registrar.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC721_ABI from 'abis/erc721.json'
import ERC1155_ABI from 'abis/erc1155.json'
import MulticallABI from 'abis/multicall.json'
import boxFactoryABI from 'abis/boxFactory.json'
import boxABI from 'abis/box.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import {
  EnsPublicResolver,
  EnsRegistrar,
  Erc20,
  Erc721,
  Erc1155,
  Erc20_bytes32,
  Multicall,
  BoxFactory,
  Box,
  BounceBoxLottery
} from 'abis/types'
import {
  BOX_FACTORY_ADDRESS,
  BOX_LOTTERY_ADDRESS,
  ENS_REGISTRAR_ADDRESSES,
  ERC721_SWAP_ADDRESSES,
  FEE_DISTRIBUTOR_ADDRESSES,
  MULTICALL_ADDRESS
} from 'constants/addresses'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { getContract } from 'utils/contract'
import { RPC_PROVIDERS } from 'constants/rpc/providers'
import { SupportedChainId } from 'constants/chains'
import { FeeDistributor } from 'abis/types/FeeDistributor'
import { Erc721_swap } from 'abis/types/Erc721_swap'
import feeDistributorABI from 'abis/feeDistributor.json'
import erc721SwapABI from 'abis/erc721_swap.json'
import boxLotteryABI from 'abis/BounceBoxLottery.json'
// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
  chainId?: SupportedChainId
): T | null {
  const { library, account, chainId: curChainId } = useActiveWeb3React()
  const queryChainId = useMemo(() => chainId || curChainId, [chainId, curChainId])

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !queryChainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[queryChainId]
    if (!address) return null
    try {
      if (curChainId !== queryChainId || !library) {
        return getContract(address, ABI, RPC_PROVIDERS[queryChainId])
      }
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, queryChainId, curChainId, library, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useERC721Contract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc721>(tokenAddress, ERC721_ABI, withSignerIfPossible)
}

export function useERC1155Contract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc1155>(tokenAddress, ERC1155_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
  return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract<Erc20_bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useInterfaceMulticall(chainId?: SupportedChainId) {
  return useContract<Multicall>(MULTICALL_ADDRESS, MulticallABI, false, chainId)
}

export function useBoxFactoryContract(chainId?: SupportedChainId) {
  return useContract<BoxFactory>(BOX_FACTORY_ADDRESS, boxFactoryABI, true, chainId)
}

export function useBoxContract(boxAddress?: string, chainId?: SupportedChainId) {
  return useContract<Box>(boxAddress, boxABI, true, chainId)
}

export function useFeeDistributor(chainId?: SupportedChainId) {
  return useContract<FeeDistributor>(FEE_DISTRIBUTOR_ADDRESSES, feeDistributorABI, true, chainId)
}

export function useErc721SwapContract() {
  return useContract<Erc721_swap>(ERC721_SWAP_ADDRESSES, erc721SwapABI, true)
}

export function useBoxLotteryContract(chainId?: SupportedChainId) {
  return useContract<BounceBoxLottery>(BOX_LOTTERY_ADDRESS, boxLotteryABI, true, chainId)
}
