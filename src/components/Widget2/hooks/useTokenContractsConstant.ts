import { Interface } from '@ethersproject/abi'
import { Erc20Interface } from '../lib/uniswap/src/abis/types/Erc20'
import { NEVER_RELOAD, useMultipleContractSingleData } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'
import ERC20ABI from '../lib/uniswap/src/abis/erc20.json'

const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface

export function useTokenContractsConstant(tokens: string[], field: 'name' | 'symbol' | 'decimals' | 'totalSupply') {
  const { chainId } = useActiveWeb3React()
  return useMultipleContractSingleData(chainId, tokens, ERC20Interface, field, undefined, NEVER_RELOAD)
}
