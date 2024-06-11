import { CURRENT_ENVIRONMENT, SupportedChainId } from './chains'
// import { constructSameAddressMap } from 'utils/constructSameAddressMap'

type AddressMap = { [chainId in SupportedChainId]: string }

export const MULTICALL_ADDRESS: AddressMap = {
  // ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984'),
  [SupportedChainId.SEPOLIA]: '0x763892796cbB8BF635BbB1143bdF9CF4A6DA6ce8',
  [SupportedChainId.BIT_DEVNET]: '0x4e63165BC93BA8D265de0fa27691C14b9433b5f3',
  [SupportedChainId.TESTNET]: '0x17F89F610400121c7dFD8e9C9D038923dCfAF060',
  [SupportedChainId.BB_MAINNET]: '0x51aF7e696F8b91dF9393295918662b6dbF494818'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.TESTNET]: '',
  [SupportedChainId.BB_MAINNET]: '',
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.SEPOLIA]: ''
}

export const BOX_FACTORY_ADDRESS: AddressMap = {
  [SupportedChainId.TESTNET]:
    CURRENT_ENVIRONMENT === 'dev'
      ? '0x88d11469B276F3ee864A08d0Ac9c973571ec2BB7'
      : '0xC90af1178Db9Eb4a584bC78975600dD6478d2897',
  [SupportedChainId.BB_MAINNET]: '0xD1B5be368257a278dF80d1f71deB3F528594c338',
  [SupportedChainId.BIT_DEVNET]: '0x701621f423C827dCAD9130f873b7566099149272',
  [SupportedChainId.SEPOLIA]: '0x9af90AF6e2934261A201548556A3DBf73ce995A9'
}

export const FEE_DISTRIBUTOR_ADDRESSES: AddressMap = {
  [SupportedChainId.TESTNET]: '0x4477624f8b80f0220E9C0464dEE334c86bbD3cD3',
  [SupportedChainId.BB_MAINNET]: '0x1Eb8D63834d3f36866faA39F94d7E4ec0ED71bf3',
  [SupportedChainId.BIT_DEVNET]: '0x4477624f8b80f0220E9C0464dEE334c86bbD3cD3',
  [SupportedChainId.SEPOLIA]: ''
}

export const ERC721_SWAP_ADDRESSES: AddressMap = {
  [SupportedChainId.TESTNET]: '0x93ddd1c35769595A4506Be9D78DeA6386E94B18A',
  [SupportedChainId.BB_MAINNET]: '0x042b34E52BB519010a318D8F3EA37fFAe7eD8C43',
  [SupportedChainId.BIT_DEVNET]: '0x93ddd1c35769595A4506Be9D78DeA6386E94B18A',
  [SupportedChainId.SEPOLIA]: ''
}

export const ERC721_NFT_ADDRESSES: AddressMap = {
  [SupportedChainId.TESTNET]: '0xa6E0495D4de6E6C4eE78Ac17a686AD1f4C820B70',
  [SupportedChainId.BB_MAINNET]: '0x668a119956D09f18889917BfeB01A20D839ba52c',
  [SupportedChainId.BIT_DEVNET]: '0xa6E0495D4de6E6C4eE78Ac17a686AD1f4C820B70',
  [SupportedChainId.SEPOLIA]: ''
}

export const BOX_LOTTERY_ADDRESS: AddressMap = {
  [SupportedChainId.TESTNET]: '0x002CB7194D7e76567F1a16237B84B825687826Ef',
  [SupportedChainId.BB_MAINNET]: '0x30F1c6653e83CB515367f09312268CBd4717bC31',
  [SupportedChainId.BIT_DEVNET]: '',
  [SupportedChainId.SEPOLIA]: ''
}
