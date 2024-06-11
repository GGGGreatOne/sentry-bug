import { SupportedChainId } from 'constants/chains'

export const STAKE_TOKEN_WITH_TIME_WEIGHT_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.BB_MAINNET]: '0x4Fcb611Aa2D20B16a27575bE99cf63E8E4B4653B',
  [SupportedChainId.TESTNET]: '0xa6509c3A4a309c2711D0E98652F9b301Db0B549c'
}
