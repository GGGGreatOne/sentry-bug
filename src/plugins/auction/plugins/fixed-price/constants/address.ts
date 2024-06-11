import { SupportedChainId } from 'constants/chains'

export const FIXED_SWAP_ERC20_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.BB_MAINNET]: '0x0889f877BaDa284E4aE1ff7C8b4e5174CcF2908f',
  [SupportedChainId.BIT_DEVNET]: '0xd82d033b325334Ff9FE5714119f22ceE640588F6',
  [SupportedChainId.TESTNET]: '0xd82d033b325334Ff9FE5714119f22ceE640588F6'
}
