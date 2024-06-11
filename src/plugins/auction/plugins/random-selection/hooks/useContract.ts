import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { RANDOM_SELECTION_CONTRACT_ADDRESSES } from '../constants/address'
import RANDOM_SELECTION_ABI from '../abis/randomSelection.json'
export function useRandomSelectionERC20Contract(address?: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress =
    address === '' ? undefined : address || (cur ? RANDOM_SELECTION_CONTRACT_ADDRESSES[cur] : undefined)
  return useContract(curAddress, RANDOM_SELECTION_ABI, true, queryChainId)
}
