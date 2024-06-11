import { Contract } from '@ethersproject/contracts'
import { WETH } from '@uniswap/sdk'
import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import WETH_ABI from 'abis/weth.json'
import { getContract } from '../utils'
import { useActiveWeb3React } from 'hooks'
import { checkChainId } from '../utils/utils'
import { MULTICALL_ADDRESS } from 'constants/addresses'
import MULTICALL_ABI from 'abis/multicall.json'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  const checkedChainId = checkChainId(chainId)
  return useContract(checkedChainId ? WETH[checkedChainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI.abi, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_ADDRESS[chainId], MULTICALL_ABI, false)
}
