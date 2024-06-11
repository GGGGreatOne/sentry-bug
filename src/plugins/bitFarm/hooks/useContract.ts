import { useContract } from 'hooks/useContract'
import { STAKING_FACTORY_CONTRACT_ADDRESS } from '../addresses'

import stake_abi from '../abis/Staking.json'
import stake_factory from '../abis/StakingFactory.json'

export const useStakingContract = (contractAddress: string | undefined) => {
  return useContract(contractAddress, stake_abi, true)
}

export const useStakingFactoryContract = () => {
  return useContract(STAKING_FACTORY_CONTRACT_ADDRESS, stake_factory, true)
}
