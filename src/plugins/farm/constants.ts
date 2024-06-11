import { SupportedChainId } from 'constants/chains'

type AddressMap = { [chainId in SupportedChainId]: string }

export const STAKING_CONSTANTS: AddressMap = {
  [SupportedChainId.TESTNET]: '0xc51a637E9D982312AEDd16179B061A4f475dc90C',
  [SupportedChainId.BB_MAINNET]: '',
  [SupportedChainId.BIT_DEVNET]: '0xd2052708B44E5EcB3db75fc3198010Ef84241C75',
  [SupportedChainId.SEPOLIA]: '0x32EA00148313dba0758b5DDbbA60A24a12134245'
}
