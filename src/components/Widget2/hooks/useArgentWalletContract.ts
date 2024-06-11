import { ArgentWalletContract } from '../lib/uniswap/src/abis/types/ArgentWalletContract'
import { useContract } from './useContract'
import { useActiveWeb3React } from 'hooks'
import useIsArgentWallet from './useIsArgentWallet'
import ArgentWalletContractABI from '../lib/uniswap/src/abis/argent-wallet-contract.json'

export function useArgentWalletContract(): ArgentWalletContract | null {
  const { account } = useActiveWeb3React()
  const isArgentWallet = useIsArgentWallet()
  return useContract(
    isArgentWallet ? account ?? undefined : undefined,
    ArgentWalletContractABI,
    true
  ) as ArgentWalletContract
}
