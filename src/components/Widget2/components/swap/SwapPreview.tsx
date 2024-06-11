import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { AutoColumn } from '../../components/Column'
import { useUSDPrice } from '../../hooks/useUSDPrice'
import { InterfaceTrade } from '../../state/routing/types'
import { isPreviewTrade } from '../../state/routing/utils'
import styled from 'styled-components'
import { ThemedText } from '../../theme/components'

import { Field } from './constants'
import { SwapModalHeaderAmount } from './SwapModalHeaderAmount'
import Row from '../Row'

const HeaderContainer = styled(AutoColumn)`
  margin-top: 0px;
`

export function SwapPreview({
  trade,
  inputCurrency,
  allowedSlippage
}: {
  trade: InterfaceTrade
  inputCurrency?: Currency
  allowedSlippage: Percent
}) {
  const fiatValueInput = useUSDPrice(trade.inputAmount)
  const fiatValueOutput = useUSDPrice(trade.outputAmount)

  return (
    <HeaderContainer gap="sm">
      <Row gap="lg" justify="center" padding="40px 20px">
        <SwapModalHeaderAmount
          field={Field.INPUT}
          label={<>You pay</>}
          amount={trade.inputAmount}
          currency={inputCurrency ?? trade.inputAmount.currency}
          usdAmount={fiatValueInput.data}
          isLoading={isPreviewTrade(trade) && trade.tradeType === TradeType.EXACT_OUTPUT}
        />
        →
        <SwapModalHeaderAmount
          field={Field.OUTPUT}
          label={<>You receive</>}
          amount={trade.outputAmount}
          currency={trade.outputAmount.currency}
          usdAmount={fiatValueOutput.data}
          isLoading={isPreviewTrade(trade) && trade.tradeType === TradeType.EXACT_INPUT}
          tooltipText={
            trade.tradeType === TradeType.EXACT_INPUT ? (
              <ThemedText.Caption>
                <>
                  Output is estimated. You will receive at least{' '}
                  <b>
                    {trade.minimumAmountOut(allowedSlippage).toSignificant(6)}{' '}
                    {trade.outputAmount.currency.symbol?.toLocaleUpperCase() === 'ETH'
                      ? 'BB'
                      : trade.outputAmount.currency.symbol}
                  </b>{' '}
                  or the transaction will revert.
                </>
              </ThemedText.Caption>
            ) : (
              <ThemedText.Caption>
                <>
                  Input is estimated. You will sell at most{' '}
                  <b>
                    {trade.maximumAmountIn(allowedSlippage).toSignificant(6)}{' '}
                    {trade.inputAmount.currency.symbol?.toLocaleUpperCase() === 'ETH'
                      ? 'BB'
                      : trade.inputAmount.currency.symbol?.toLocaleUpperCase()}
                  </b>{' '}
                  or the transaction will revert.
                </>
              </ThemedText.Caption>
            )
          }
        />
      </Row>
    </HeaderContainer>
  )
}
