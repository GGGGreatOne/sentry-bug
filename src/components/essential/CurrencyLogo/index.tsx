import React, { useEffect, useMemo } from 'react'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { useGetTokenImage } from 'hooks/boxes/useGetTokenImage'
import { NativeCurrency, Currency as SdkCurrency } from '@uniswap/sdk-core'
import styled from 'styled-components'
import BounceBitLogo from '../../Widget/assets/bouncebit-logo.png'

const StyledEthereumLogo = styled('img')<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export const getTokenLogoURL = (address: string | undefined) => {
  if (!address) return ''
  const defaultTokenList: { address: string; logo: string }[] = []
  return defaultTokenList.find(_ => _.address.toLowerCase() === address.toLowerCase())?.logo
}
const localTokenList: { list: { address: string; logo: string }[] } = {
  list: []
}

function QueryTokenLogo(address: string) {
  return localTokenList.list?.filter(v => v.address.toLowerCase() === address.toLowerCase())?.[0]?.logo
}
// function getLocalTokenList() {
//   return localTokenList.list
// }
function UnshiftTokenLogo(address: string, logo: string) {
  localTokenList.list?.unshift({ address, logo })
  return
}
export default function CurrencyLogo({
  currencyOrAddress,
  size = '24px',
  style
}: {
  currencyOrAddress?: Currency | string | NativeCurrency | SdkCurrency
  size?: string
  style?: React.CSSProperties
}) {
  const { pluginTokenList } = useGetPluginTokenListData()
  const _address = useMemo(
    () =>
      typeof currencyOrAddress === 'string'
        ? currencyOrAddress
        : currencyOrAddress?.isNative
          ? ''
          : currencyOrAddress?.address || '',
    [currencyOrAddress]
  )
  const logoSrc = useMemo(() => {
    return (
      pluginTokenList.find(i => i.contractAddress?.toLocaleLowerCase() === _address?.toLocaleLowerCase())?.smallImg ||
      ''
    )
  }, [_address, pluginTokenList])

  const srcs: string[] = useMemo(() => {
    if (typeof currencyOrAddress === 'string') {
      return [logoSrc, getTokenLogoURL(currencyOrAddress) || ''].filter(i => i)
    }
    if (currencyOrAddress?.isNative) {
      return []
    }
    if (currencyOrAddress && 'logo' in currencyOrAddress && currencyOrAddress?.logo) {
      return [currencyOrAddress.logo]
    } else if (!currencyOrAddress?.isNative) {
      return [logoSrc, getTokenLogoURL(currencyOrAddress?.address) || ''].filter(i => i)
    }
    return []
  }, [currencyOrAddress, logoSrc])

  const tokenAddr = useMemo(() => {
    return srcs.length === 0 && typeof currencyOrAddress === 'string'
      ? currencyOrAddress
      : currencyOrAddress instanceof Currency
        ? currencyOrAddress?.address
        : ''
  }, [currencyOrAddress, srcs.length])
  const localTokenLogo = QueryTokenLogo(tokenAddr)
  const { data } = useGetTokenImage(localTokenLogo ? '' : tokenAddr)

  const imgList: string[] = useMemo(() => {
    if (data) {
      srcs.push(data.smallImg)
    }
    if (localTokenLogo) {
      srcs.push(localTokenLogo)
    }
    return srcs
  }, [data, localTokenLogo, srcs])
  useEffect(() => {
    if (!localTokenLogo && data?.smallImg) {
      UnshiftTokenLogo(tokenAddr, data.smallImg)
    }
  }, [data?.smallImg, localTokenLogo, tokenAddr])

  if (
    (typeof currencyOrAddress === 'object' && currencyOrAddress?.symbol === 'WBB') ||
    (typeof currencyOrAddress === 'object' && currencyOrAddress?.symbol === 'BB') ||
    (typeof currencyOrAddress === 'object' && currencyOrAddress?.symbol === 'ETH')
  ) {
    return (
      <StyledEthereumLogo
        src={BounceBitLogo.src}
        size={size}
        style={{
          left: '-8px',
          ...style
        }}
      />
    )
  }

  return (
    <Logo
      style={{
        width: size,
        height: size,
        borderRadius: size,
        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
        left: '-8px',
        ...style
      }}
      srcs={imgList}
      alt={`token logo`}
    />
  )
}
