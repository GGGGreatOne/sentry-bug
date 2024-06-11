import { SupportedChainId } from 'constants/chains'

export const BTC_TOKEN_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.TESTNET]: '',
  [SupportedChainId.BB_MAINNET]: '',
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.SEPOLIA]: '0xc87bF85d79aADf72DdEEB8fA83FC0b363fB95469'
}

export const TROVE_FACTORY_ADDRESS: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.TESTNET]: '0x7f0409Cf03cDced2Ea11F26a3EcD36f59cFd0Cd9',
  [SupportedChainId.BB_MAINNET]: '0xA2083642FbAA1AC5d8B18FcE9493FC80cC1A4D5A',
  [SupportedChainId.BIT_DEVNET]: '0x76A32245BaCC6c97925f0eDAd886B295229D65BC',
  [SupportedChainId.SEPOLIA]: '0x5bDB8AeCc690130F9B51b57Db7081B5c7443DAf5'
}
