/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import EthereumLogo from '../../assets/ethereum-logo.png'
import BounceBitLogo from '../../assets/bouncebit-logo.png'
import { styled } from '@mui/material'
import { WrappedTokenInfo } from 'components/Widget/hooks/Tokens'
import useHttpLocations from 'components/Widget/hooks/useHttpLocations'
import Logo from './logo'
import { useActiveWeb3React } from 'hooks'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { useGetTokenImage } from 'hooks/boxes/useGetTokenImage'

export const fetchTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const StyledEthereumLogo = styled('img')<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: #ffffff;
`

export default function _CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency | Token
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const { chainId } = useActiveWeb3React()
  const { pluginTokenList } = useGetPluginTokenListData()

  const logoSrc = useMemo(() => {
    if (currency instanceof Token) {
      return (
        pluginTokenList.find(i => i.contractAddress?.toLocaleLowerCase() === currency?.address?.toLocaleLowerCase())
          ?.smallImg || ''
      )
    } else {
      return ''
    }
  }, [currency, pluginTokenList])

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [logoSrc, ...uriLocations, fetchTokenLogoURL(currency.address)]
      }
      return [logoSrc, fetchTokenLogoURL(currency.address)]
    }
    return [] as string[]
  }, [currency, logoSrc, uriLocations])

  const { data } = useGetTokenImage(
    srcs.length === 0 && typeof currency === 'string'
      ? currency
      : typeof currency === 'object'
        ? // @ts-expect-error
          currency?.address
        : ''
  )
  const imgList: string[] = useMemo(() => {
    if (data) {
      srcs.push(data.smallImg)
    }
    return srcs
  }, [data, srcs])

  if (currency?.symbol === 'WBB' || currency?.symbol === 'BB') {
    return <StyledEthereumLogo src={BounceBitLogo.src} size={size} style={style} />
  }

  if (currency === ETHER) {
    if (chainId !== 11155111) {
      return <StyledEthereumLogo src={BounceBitLogo.src} size={size} style={style} />
    }
    return <StyledEthereumLogo src={EthereumLogo.src} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={imgList} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
