import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { FIXED_SWAP_ERC20_ADDRESSES } from '../constants/address'
import { useContract } from 'hooks/useContract'
import FIXED_SWAP_ABI from '../abis/fixedSwap.json'

export function useFixedSwapERC20Contract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = address === '' ? undefined : address || (cur ? FIXED_SWAP_ERC20_ADDRESSES[cur] : undefined)
  return useContract(curAddress, FIXED_SWAP_ABI, true, queryChainId)
}
