import { isSupportedChain } from '../constants/chains'
import { useActiveWeb3React } from 'hooks'

export default function useAutoRouterSupported(): boolean {
  const { chainId } = useActiveWeb3React()
  return isSupportedChain(chainId)
}
