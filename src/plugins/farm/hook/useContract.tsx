import { useContract } from 'hooks/useContract'
import stake_abi from '../abis/staking.json'
export const useStakeContract = (contractAddress: string) => {
  return useContract(contractAddress, stake_abi, true)
}
