import { SupportedChainId } from 'constants/chains'

export const RANDOM_SELECTION_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.SEPOLIA]: '0xb18A4F0E9f994215001F81DeB545DF783E14700A',
  [SupportedChainId.TESTNET]: '',
  [SupportedChainId.BB_MAINNET]: '',
  [SupportedChainId.BIT_DEVNET]: ''
}
