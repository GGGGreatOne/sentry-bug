import { Currency } from '@uniswap/sdk-core'
import { AutoColumn } from '../../components/Column'
import UniswapXRouterLabel, { UniswapXGradient } from '../../components/RouterLabel/UniswapXRouterLabel'
import Row from '../../components/Row'
import { nativeOnChain } from '../../constants/tokens'
import { chainIdToBackendName } from '../../graphql/data/util'
import { ReactNode } from 'react'
import { InterfaceTrade } from '../../state/routing/types'
import { isPreviewTrade, isUniswapXTrade } from '../../state/routing/utils'
import styled from 'styled-components'
import { Divider, ThemedText } from '../../theme/components'
import { NumberType, useFormatter } from '../../utils/formatNumbers'

const Container = styled(AutoColumn)`
  padding: 4px;
`

type GasCostItemProps = { title: ReactNode; itemValue?: React.ReactNode; amount?: number }

const GasCostItem = ({ title, amount, itemValue }: GasCostItemProps) => {
  const { formatNumber } = useFormatter()

  if (!amount && !itemValue) return null

  const value = itemValue ?? formatNumber({ input: amount, type: NumberType.FiatGasPrice })
  return (
    <Row justify="space-between">
      <ThemedText.SubHeaderSmall>{title}</ThemedText.SubHeaderSmall>
      <ThemedText.SubHeaderSmall color="neutral1">{value}</ThemedText.SubHeaderSmall>
    </Row>
  )
}

const GaslessSwapLabel = () => {
  const { formatNumber } = useFormatter()
  return <UniswapXRouterLabel>{formatNumber({ input: 0, type: NumberType.FiatGasPrice })}</UniswapXRouterLabel>
}

type GasBreakdownTooltipProps = { trade: InterfaceTrade }

export function GasBreakdownTooltip({ trade }: GasBreakdownTooltipProps) {
  const isUniswapX = isUniswapXTrade(trade)
  const inputCurrency = trade.inputAmount.currency
  const native = nativeOnChain(inputCurrency.chainId)

  if (isPreviewTrade(trade)) return <NetworkCostDescription native={native} />

  const swapEstimate = !isUniswapX ? trade.gasUseEstimateUSD : undefined
  const approvalEstimate = trade?.approveInfo?.needsApprove ? trade.approveInfo.approveGasEstimateUSD : undefined
  const wrapEstimate = isUniswapX && trade.wrapInfo.needsWrap ? trade.wrapInfo.wrapGasEstimateUSD : undefined
  const showEstimateDetails = Boolean(wrapEstimate || approvalEstimate)

  const description = isUniswapX ? <UniswapXDescription /> : <NetworkCostDescription native={native} />

  if (!showEstimateDetails) return description

  return (
    <Container gap="md">
      <AutoColumn gap="sm">
        <GasCostItem
          title={<>Wrap {native.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : native.symbol?.toLocaleUpperCase()}</>}
          amount={wrapEstimate}
        />
        <GasCostItem
          title={
            <>
              Allow{' '}
              {inputCurrency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : inputCurrency.symbol?.toLocaleUpperCase()}{' '}
              (one time)
            </>
          }
          amount={approvalEstimate}
        />
        <GasCostItem title={<>Swap</>} amount={swapEstimate} />
        {isUniswapX && <GasCostItem title={<>Swap</>} itemValue={<GaslessSwapLabel />} />}
      </AutoColumn>
      <Divider />
      {description}
    </Container>
  )
}

function NetworkCostDescription({ native }: { native: Currency }) {
  const chainName = chainIdToBackendName(native.chainId)

  return (
    <ThemedText.LabelMicro>
      <>
        Network cost is paid in{' '}
        {native.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : native.symbol?.toLocaleUpperCase()} on the{' '}
        {chainName === 'ETHEREUM' ? 'BOUNCEBIT' : chainName} network in order to transact.
      </>{' '}
    </ThemedText.LabelMicro>
  )
}

const InlineUniswapXGradient = styled(UniswapXGradient)`
  display: inline;
`
export function UniswapXDescription() {
  return (
    <ThemedText.Caption color="neutral2">
      <>
        <InlineUniswapXGradient>UniswapX</InlineUniswapXGradient> aggregates liquidity sources for better prices and gas
        free swaps.
      </>{' '}
    </ThemedText.Caption>
  )
}
