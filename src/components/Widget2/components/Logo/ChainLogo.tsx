import { ChainId } from '@uniswap/sdk-core'
import { getChainInfo } from '../../constants/chainInfo'
import { isSupportedChain, SupportedInterfaceChain } from '../../constants/chains'
import { CSSProperties, FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import { Ethereum } from './chainSymbols/Ethereum'
import { useUpdateThemeMode } from 'state/application/hooks'

type SVG = FunctionComponent<React.SVGProps<SVGSVGElement>>
type ChainUI = { Symbol: SVG; bgColor: string; textColor: string }

export function getChainUI(chainId: SupportedInterfaceChain, darkMode: boolean): ChainUI
export function getChainUI(chainId: ChainId): ChainUI | undefined {
  switch (chainId) {
    case ChainId.MAINNET:
    case ChainId.GOERLI:
    case ChainId.SEPOLIA:
      return {
        Symbol: Ethereum,
        bgColor: '#6B8AFF33',
        textColor: '#6B8AFF'
      }

    default:
      return undefined
  }
}

export const getDefaultBorderRadius = (size: number) => size / 2 - 4

type ChainLogoProps = {
  chainId: ChainId
  className?: string
  size?: number
  borderRadius?: number
  style?: CSSProperties
  testId?: string
  fillContainer?: boolean
}
export function ChainLogo({
  chainId,
  className,
  style,
  size = 12,
  borderRadius = getDefaultBorderRadius(size),
  testId,
  fillContainer = false
}: ChainLogoProps) {
  const { mode } = useUpdateThemeMode()
  const { surface2 } = useTheme()

  if (!isSupportedChain(chainId)) return null
  const { label } = getChainInfo(chainId)

  const { Symbol, bgColor } = getChainUI(chainId, mode === 'dark')
  const iconSize = fillContainer ? '100%' : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      className={className}
      style={{ ...style, width: iconSize, height: iconSize }}
      aria-labelledby="titleID"
      data-testid={testId}
    >
      <title id="titleID">{`${label} logo`}</title>
      <rect rx={borderRadius} fill={surface2} width={iconSize} height={iconSize} />
      <rect rx={borderRadius} fill={bgColor} width={iconSize} height={iconSize} />
      <Symbol width={iconSize} height={iconSize} />
    </svg>
  )
}
