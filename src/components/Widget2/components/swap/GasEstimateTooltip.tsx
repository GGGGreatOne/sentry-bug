import { Gas } from '../../components/Icons/Gas'
import { LoadingOpacityContainer } from '../../components/Loader/styled'
import { UniswapXGradient, UniswapXRouterIcon } from '../../components/RouterLabel/UniswapXRouterLabel'
import Row, { RowFixed } from '../../components/Row'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from '../../constants/chains'
import { SubmittableTrade } from '../../state/routing/types'
import { isUniswapXTrade } from '../../state/routing/utils'
import styled from 'styled-components'
import { ThemedText } from '../../theme/components'
import { NumberType, useFormatter } from '../../utils/formatNumbers'

import { GasBreakdownTooltip } from './GasBreakdownTooltip'
import { useActiveWeb3React } from 'hooks'
import { MouseoverTooltip } from '../Tooltip'

const StyledGasIcon = styled(Gas)`
  height: 16px;
  width: 16px;
  // We apply the following to all children of the SVG in order to override the default color
  & > * {
    fill: ${({ theme }) => theme.neutral3};
  }
`

export default function GasEstimateTooltip({ trade, loading }: { trade?: SubmittableTrade; loading: boolean }) {
  const { chainId } = useActiveWeb3React()
  const { formatNumber } = useFormatter()

  if (!trade || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId as any)) {
    return null
  }

  return (
    <MouseoverTooltip text={<GasBreakdownTooltip trade={trade} />} placement="right">
      <LoadingOpacityContainer $loading={loading}>
        <RowFixed gap="xs">
          {isUniswapXTrade(trade) ? <UniswapXRouterIcon testId="gas-estimate-uniswapx-icon" /> : <StyledGasIcon />}
          <ThemedText.BodySmall color="neutral2">
            <Row gap="sm">
              {isUniswapXTrade(trade) ? (
                <UniswapXGradient>
                  <div style={{ fontWeight: 535 }}>
                    {formatNumber({
                      input: trade.totalGasUseEstimateUSD,
                      type: NumberType.FiatGasPrice
                    })}
                  </div>
                </UniswapXGradient>
              ) : (
                <div>
                  {/* {formatNumber({
                    input: trade.totalGasUseEstimateUSD,
                    type: NumberType.FiatGasPrice
                  })} */}
                  {`<$0.1`}
                </div>
              )}

              {isUniswapXTrade(trade) && (trade.classicGasUseEstimateUSD ?? 0) > 0 && (
                <div>
                  <s>
                    {formatNumber({
                      input: trade.classicGasUseEstimateUSD,
                      type: NumberType.FiatGasPrice
                    })}
                  </s>
                </div>
              )}
            </Row>
          </ThemedText.BodySmall>
        </RowFixed>
      </LoadingOpacityContainer>
    </MouseoverTooltip>
  )
}
