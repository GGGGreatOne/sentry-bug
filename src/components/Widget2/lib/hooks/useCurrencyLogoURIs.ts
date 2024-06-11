import { ChainId } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import { NATIVE_CHAIN_ID } from '../../constants/tokens'
import { isAddress } from 'utils'
import useHttpLocations from 'components/Widget2/hooks/useHttpLocations'

type Network = 'ethereum' | 'bounce-bit'

export function chainIdToNetworkName(networkId: ChainId): Network {
  switch (networkId) {
    case ChainId.MAINNET:
      return 'ethereum'
    default:
      return 'bounce-bit'
  }
}

export function getNativeLogoURI(chainId: ChainId = ChainId.MAINNET): string {
  switch (chainId) {
    // case ChainId.POLYGON:
    // case ChainId.POLYGON_MUMBAI:
    //   return MaticLogo
    // case ChainId.BNB:
    //   return BnbLogo
    // case ChainId.CELO:
    // case ChainId.CELO_ALFAJORES:
    //   return CeloLogo.
    // case ChainId.AVALANCHE:
    //   return AvaxLogo
    default:
      return EthereumLogo.src
  }
}

function getTokenLogoURI(address: string, chainId: ChainId = ChainId.MAINNET): string | void {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [ChainId.MAINNET]
  // if (isCelo(chainId) && address === nativeOnChain(chainId).wrapped.address) {
  //   return CeloLogo
  // }

  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }
}

export default function useCurrencyLogoURIs(
  currency:
    | {
        isNative?: boolean
        isToken?: boolean
        address?: string
        chainId: number
        logoURI?: string | null
      }
    | null
    | undefined
): string[] {
  const locations = useHttpLocations(currency?.logoURI)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative || currency.address === NATIVE_CHAIN_ID) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken || currency.address) {
        const checksummedAddress = isAddress(currency.address)
        const logoURI = checksummedAddress && getTokenLogoURI(checksummedAddress, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}
