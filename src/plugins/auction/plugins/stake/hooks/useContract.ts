import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { STAKE_TOKEN_WITH_TIME_WEIGHT_CONTRACT_ADDRESSES } from '../constants/address'
import STAKE_TOKEN_WITH_TIME_ABI from '../abis/stake-token-with-time-weight.json'
export function useStakeTokenWithTimeWeightContract(queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = cur ? STAKE_TOKEN_WITH_TIME_WEIGHT_CONTRACT_ADDRESSES[cur] : undefined
  return useContract(curAddress, STAKE_TOKEN_WITH_TIME_ABI, true, queryChainId)
}
