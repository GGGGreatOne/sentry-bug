import { ChainId } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import { useSwapAndLimitContext, useSwapContext } from '../../state/swap/SwapContext'
import styled from 'styled-components'
import { FeatureFlags } from '../../lib/uniswap/src/features/experiments/flags'
import { useFeatureFlag } from '../../lib/uniswap/src/features/experiments/hooks'
import { isIFramed } from '../../utils/isIFramed'
import { RowBetween, RowFixed } from '../Row'
import SettingsTab from '../Settings'
import { SwapTab } from './constants'
import { SwapHeaderTabButton } from './styled'

const StyledSwapHeader = styled(RowBetween)`
  margin-bottom: 12px;
  padding-right: 4px;
  color: ${({ theme }) => theme.neutral2};
`

const HeaderButtonContainer = styled(RowFixed)<{ compact: boolean }>`
  gap: ${({ compact }) => (compact ? 0 : 16)}px;

  ${SwapHeaderTabButton} {
    ${({ compact }) => compact && 'padding: 8px 12px;'}
  }
`

export default function SwapHeader({ compact }: { compact: boolean; syncTabToUrl: boolean }) {
  const limitsEnabled = useFeatureFlag(FeatureFlags.LimitsEnabled)
  const sendEnabled = useFeatureFlag(FeatureFlags.SendEnabled) && !isIFramed()
  const { chainId, currentTab, setCurrentTab } = useSwapAndLimitContext()
  const {
    derivedSwapInfo: { trade, autoSlippage }
  } = useSwapContext()

  // Limits is only available on mainnet for now
  if (chainId !== ChainId.MAINNET && currentTab === SwapTab.Limit) {
    setCurrentTab(SwapTab.Swap)
  }

  const onTab = useCallback(
    (tab: SwapTab) => {
      setCurrentTab(tab)
    },
    [setCurrentTab]
  )

  return (
    <StyledSwapHeader>
      <HeaderButtonContainer compact={compact}>
        {/* <SwapHeaderTabButton
          as={currentTab === SwapTab.Swap ? 'h1' : 'button'}
          role="button"
          tabIndex={0}
          $isActive={currentTab === SwapTab.Swap}
          onClick={() => {
            onTab(SwapTab.Swap)
          }}
        >
          Swap
        </SwapHeaderTabButton> */}
        {limitsEnabled && chainId === ChainId.MAINNET && (
          <SwapHeaderTabButton
            $isActive={currentTab === SwapTab.Limit}
            onClick={() => {
              onTab(SwapTab.Limit)
            }}
          >
            Limit
          </SwapHeaderTabButton>
        )}
        {sendEnabled && (
          <SwapHeaderTabButton
            $isActive={currentTab === SwapTab.Send}
            onClick={() => {
              onTab(SwapTab.Send)
            }}
          >
            Send
          </SwapHeaderTabButton>
        )}
        {/* <SwapBuyFiatButton /> */}
      </HeaderButtonContainer>
      {currentTab === SwapTab.Swap && (
        <RowFixed>
          <SettingsTab autoSlippage={autoSlippage} chainId={chainId} compact={compact} trade={trade.trade} />
        </RowFixed>
      )}
    </StyledSwapHeader>
  )
}
