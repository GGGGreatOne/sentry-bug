export enum SupportedChainId {
  TESTNET = 6000,
  BB_MAINNET = 6001,
  SEPOLIA = 11155111,
  BIT_DEVNET = 9000
}
//  Linear,line ToolboxERC20VestingFactory.deployERC20Vesting
export const TOOL_BOX_LINEAR_TOKEN_LOCKER_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.BB_MAINNET]: '0x6C7015586c9467654F93021D833308c0D3ec82EE',
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.TESTNET]: '0xF68Feb942462ad6a2B6717939354ae14b4AdAdca'
}

//  LP V2 ToolboxERC20TimelockFactory.deployUniswapV2Timelock
export const TOOL_BOX_TOKEN_LOCKER_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.BB_MAINNET]: '0x5a736E8916651dB52669b510306be28669A57206',
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.TESTNET]: '0x8f5e97810F7AA5cD8630bb1eB35597a1eA358bdA'
}

//  LP v3 normal: ToolboxERC721TimelockFactory.deployUniswapV3Timelock
export const TOOL_BOX_LINEAR_TOKEN_721_LOCKER_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.BB_MAINNET]: '',
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.TESTNET]: '0xd52eb3d7E23112e7D6AAB41b510fFb41751d9BD7'
}

// ToolboxERC20Factory
export const MINTER_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.BB_MAINNET]: '0x8f14d2c03b6803cF8EC923361512eEA1f7e5fe35',
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.TESTNET]: '0xb2e647FC5e4817a949c8Dd7950e4D36D95B978f2'
}

// Disperse
export const DISPERSE_CONTRACT_ADDRESSES: { [chainId in SupportedChainId]: string } = {
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.BB_MAINNET]: '0xc92937d331794901ed49F65A9c7F12Eca5537C8A',
  [SupportedChainId.SEPOLIA]: '',
  [SupportedChainId.TESTNET]: '0xC9a187E5Ec68EbE90cE486F73b0D194fF21495BC'
}
