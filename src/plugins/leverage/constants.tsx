import { CURRENT_ENVIRONMENT, NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'

// todo

export const LEVERAGE_API_DEV = {
  price: 'api/asset/token/price',
  tradeHistoryApi: ''
}

export const LEVERAGE_API_TESTNET = {
  price: 'api/asset/token/price',
  tradeHistoryApi: ''
}

export const LEVERAGE_API_PRODUCTION = {
  price: 'api/asset/token/price',
  tradeHistoryApi: ''
}

const _FACTORY_ADDRESS: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.TESTNET]: '0x1E58ECF65FE6b295C7ceC0CEa15179274824d233',
  [SupportedChainId.BB_MAINNET]: '0xd9Fd951618a0a7f20E8594D227E3b89956480835',
  [SupportedChainId.BIT_DEVNET]: '0x45EFcB27Bb6b9C03C5E8D48d57281CAbc46691E2',
  [SupportedChainId.SEPOLIA]: '0x7DdA26b8189411d6505D62Bc4D85747b0Df1a9F3'
}
export const FACTORY_ADDRESS = _FACTORY_ADDRESS[NETWORK_CHAIN_ID as SupportedChainId]

const _WBB_ADDRESS: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.TESTNET]: '0xDcbFaC1f672abEdCE992F011b51f183459EDe1F3',
  [SupportedChainId.BB_MAINNET]: '0xF4c20e5004C6FDCDdA920bDD491ba8C98a9c5863',
  [SupportedChainId.BIT_DEVNET]: '0xDcbFaC1f672abEdCE992F011b51f183459EDe1F3',
  [SupportedChainId.SEPOLIA]: ''
}
export const WBB_ADDRESS = _WBB_ADDRESS[NETWORK_CHAIN_ID as SupportedChainId]

export const LEVERAGE_API =
  CURRENT_ENVIRONMENT === 'dev'
    ? LEVERAGE_API_DEV
    : CURRENT_ENVIRONMENT === 'testnet'
      ? LEVERAGE_API_TESTNET
      : LEVERAGE_API_PRODUCTION

export const ONE_DAY_TIMESTAMP = 3600000 * 24
export const ONE_YEAR_TIMESTAMP = ONE_DAY_TIMESTAMP * 365
export const TOW_YEAR_TIMESTAMP = ONE_YEAR_TIMESTAMP * 2
export const FOUR_YEAR_TIMESTAMP = ONE_YEAR_TIMESTAMP * 4
export const HALF_YEAR_TIMESTAMP = ONE_DAY_TIMESTAMP * 180
export const ONE_WEEK_TIMESTAMP = ONE_DAY_TIMESTAMP * 7
export const LIQ_THRESHOLD_P = 90
export const OPEN_FEES = 0.0015
export const MAX_GAIN_P = 900
export const VALIDITY_ADDRESS_LENGTH = 42
export const ETH_ONE_HOUR_BLOCK = 5 * 60
