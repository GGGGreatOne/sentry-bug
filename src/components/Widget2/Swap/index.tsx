import { ChainId, Currency } from '@uniswap/sdk-core'
import { SwapTab } from '../components/swap/constants'
import { PageWrapper, SwapWrapper } from '../components/swap/styled'
import SwapHeader from '../components/swap/SwapHeader'
import { asSupportedChain } from '../constants/chains'
import { ReactNode } from 'react'
import { InterfaceTrade, TradeState } from '../state/routing/types'
import { isPreviewTrade } from '../state/routing/utils'
import {
  CurrencyState,
  SwapAndLimitContext,
  SwapAndLimitContextProvider,
  SwapContextProvider
} from '../state/swap/SwapContext'
import { SwapForm } from './SwapForm'
import { useActiveWeb3React } from 'hooks'
import { useUpdateThemeMode } from 'state/application/hooks'

export function getIsReviewableQuote(
  trade: InterfaceTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode
): boolean {
  if (swapInputError) return false
  // if the current quote is a preview quote, allow the user to progress to the Swap review screen
  if (isPreviewTrade(trade)) return true

  return Boolean(trade && tradeState === TradeState.VALID)
}

export default function SwapPage({ className, boxId }: { className?: string; boxId: string }) {
  const { chainId: connectedChainId } = useActiveWeb3React()
  const supportedChainId = asSupportedChain(connectedChainId)
  const chainId = supportedChainId || ChainId.BIT_MAINNET

  return (
    <PageWrapper style={{ flexDirection: 'row', margin: '0 auto' }}>
      <Swap
        className={className}
        boxId={boxId}
        chainId={chainId}
        disableTokenInputs={supportedChainId === undefined}
        syncTabToUrl={true}
      />
    </PageWrapper>
  )
}

/**
 * The swap component displays the swap interface, manages state for the swap, and triggers onchain swaps.
 *
 * In most cases, chainId should refer to the connected chain, i.e. `useWeb3React().chainId`.
 * However if this component is being used in a context that displays information from a different, unconnected
 * chain (e.g. the TDP), then chainId should refer to the unconnected chain.
 */
export function Swap({
  boxId,
  className,
  initialInputCurrency,
  initialOutputCurrency,
  chainId,
  onCurrencyChange,
  disableTokenInputs = false,
  compact = false,
  syncTabToUrl
}: {
  boxId: string
  className?: string
  chainId?: ChainId
  onCurrencyChange?: (selected: CurrencyState) => void
  disableTokenInputs?: boolean
  initialInputCurrency?: Currency
  initialOutputCurrency?: Currency
  compact?: boolean
  syncTabToUrl: boolean
}) {
  const { mode } = useUpdateThemeMode()
  return (
    <SwapAndLimitContextProvider
      chainId={chainId as ChainId}
      initialInputCurrency={initialInputCurrency}
      initialOutputCurrency={initialOutputCurrency}
    >
      {/* TODO: Move SwapContextProvider inside Swap tab ONLY after SwapHeader removes references to trade / autoSlippage */}
      <SwapAndLimitContext.Consumer>
        {({ currentTab }) => (
          <SwapContextProvider>
            <SwapWrapper $isDark={mode === 'dark'} className={className} id="swap-page">
              <SwapHeader compact={compact} syncTabToUrl={syncTabToUrl} />
              {currentTab === SwapTab.Swap && (
                <SwapForm boxId={boxId} onCurrencyChange={onCurrencyChange} disableTokenInputs={disableTokenInputs} />
              )}
              {/*{currentTab === SwapTab.Limit && <LimitFormWrapper onCurrencyChange={onCurrencyChange} />}
              {currentTab === SwapTab.Send && (
                <SendForm disableTokenInputs={disableTokenInputs} onCurrencyChange={onCurrencyChange} />
              )} */}
            </SwapWrapper>
          </SwapContextProvider>
        )}
      </SwapAndLimitContext.Consumer>
    </SwapAndLimitContextProvider>
  )
}
