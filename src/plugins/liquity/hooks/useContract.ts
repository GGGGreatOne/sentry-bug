import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import ACTIVE_POOL_ABI from '../abis/ActivePool.json'
import BORROWER_ABI from '../abis/Borrow.json'
import COMMUNITY_ISSUANCE_ABI from '../abis/CommunityIssuance.json'
import DEFAULT_POOL_ABI from '../abis/DefaultPool.json'
import HINT_HELPER_ABI from '../abis/HintHelper.json'
import PRICE_FEED_ABI from '../abis/PriceFeed.json'
import SORTED_TROVES_ABI from '../abis/SortedTroves.json'
import STABILITY_POOL_ABI from '../abis/StabilityPool.json'
import STAKING_ABI from '../abis/Staking.json'
import TROVE_MANAGER_ABI from '../abis/TroveManager.json'
import TROVE_FACTORY_ABI from '../abis/TroveFactory.json'

export function useActivePoolContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, ACTIVE_POOL_ABI, true, _chainId)
}

export function useBorrowerContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, BORROWER_ABI, true, _chainId)
}

export function useCommunityIssuanceContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, COMMUNITY_ISSUANCE_ABI, true, _chainId)
}

export function useDefaultPoolContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, DEFAULT_POOL_ABI, true, _chainId)
}

export function useHintHelperContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, HINT_HELPER_ABI, true, _chainId)
}

export function usePriceFeedContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, PRICE_FEED_ABI, true, _chainId)
}

export function useSortedTrovesContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, SORTED_TROVES_ABI, true, _chainId)
}

export function useStabilityPoolContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, STABILITY_POOL_ABI, true, _chainId)
}

export function useStakingContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, STAKING_ABI, true, _chainId)
}

export function useTroveManagerContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, TROVE_MANAGER_ABI, true, _chainId)
}

export function useTroveFactoryContract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const _chainId = queryChainId || chainId
  return useContract(address, TROVE_FACTORY_ABI, true, _chainId)
}
