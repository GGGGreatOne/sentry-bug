import erc20TokenFactoryABI from '../abis/erc20TokenFactory.json'
import disperseABI from '../abis/disperse.json'
import erc20TimelockFactoryABI from '../abis/erc20TimelockFactory.json'
import erc20VestingFactoryABI from '../abis/ERC20VestingFactory.json'
import erc20Vesting from '../abis/erc20Vesting.json'
import erc20TimeLock from '../abis/erc20Timelock.json'
import { useActiveWeb3React } from 'hooks'
import { SupportedChainId } from 'constants/chains'
import {
  DISPERSE_CONTRACT_ADDRESSES,
  MINTER_CONTRACT_ADDRESSES,
  TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES,
  TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES,
  TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES
} from 'plugins/tokenToolBox/constants'
import { useContract } from 'hooks/useContract'

//  erc721 lp lock Withdraw contract
export function useErc721WithDrawContract(contractAddress: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  return useContract(contractAddress, erc20TimelockFactoryABI, true, cur)
}
// token lock, linear Withdraw contract vesting erc20
export function useWithDrawVestingContract(contractAddress: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  return useContract(contractAddress, erc20Vesting, true, cur)
}

// 【token locker】
//  Cliff,normal (ToolboxERC20TimelockFactory.deployERC20Timelock)
//  Fragment,stage (ToolboxERC20TimelockFactory.deployERC20MultiTimelock)
// LP v2 .deployUniswapV2Timelock
export function useToolboxERC20TimelockFactory(queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = cur ? TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES[cur] : undefined
  return useContract(curAddress, erc20TimelockFactoryABI, true, cur)
}

// 【token locker】
//  Linear,line ToolboxERC20VestingFactory.deployERC20Vesting
export function useToolboxERC20TimelockLineFactory(queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = cur ? TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES[cur] : undefined
  return useContract(curAddress, erc20VestingFactoryABI, true, cur)
}

//  LP v3 normal: ToolboxERC721TimelockFactory.deployUniswapV3Timelock
export function useToolboxERC721TimelockFactory(queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = cur ? TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES[cur] : undefined
  return useContract(curAddress, erc20TokenFactoryABI, true, cur)
}

export function useMinterContract(queryChainId: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = cur ? MINTER_CONTRACT_ADDRESSES[cur] : undefined

  return useContract(curAddress, erc20TokenFactoryABI, true, cur)
}

export function useDisperseContract(queryChainId: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  const curAddress = cur ? DISPERSE_CONTRACT_ADDRESSES[cur] : undefined
  return useContract(curAddress, disperseABI, true, cur)
}

// token lock Withdraw contract
export function useWithDrawContract(contractAddress: string, queryChainId?: SupportedChainId) {
  const { chainId } = useActiveWeb3React()
  const cur = queryChainId || chainId
  return useContract(contractAddress, erc20TimeLock, true, cur)
}
