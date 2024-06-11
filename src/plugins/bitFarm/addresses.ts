import { SupportedChainId } from 'constants/chains'

type AddressMap = { [chainId in SupportedChainId]: string }

// todo address
export const STAKING_FACTORY_CONTRACT_ADDRESS: AddressMap = {
  [SupportedChainId.TESTNET]: '0xb97eF0b9df849ccD6251F9EAFa7e79Ae1f271Dcd',
  [SupportedChainId.BB_MAINNET]: '0xb48BBEB929C2a277c454a48D4B8B917bC90818DC',
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.SEPOLIA]: ''
}
