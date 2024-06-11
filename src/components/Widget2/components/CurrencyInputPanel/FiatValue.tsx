import { Percent } from '@uniswap/sdk-core'
import Row from '../Row'
import { LoadingBubble } from '../Tokens/loading'
import { useMemo } from 'react'
import styled from 'styled-components'
import { ThemedText } from '../../theme/components'
import { warningSeverity } from '../../utils/prices'
import { NumberType, useFormatter } from 'components/Widget2/utils/formatNumbers'
import Tooltip from 'components/Tooltip'
import { Typography } from '@mui/material'

const FiatLoadingBubble = styled(LoadingBubble)`
  border-radius: 4px;
  width: 4rem;
  height: 1rem;
`

export function FiatValue({
  fiatValue,
  priceImpact,
  testId
}: {
  fiatValue: { data?: number; isLoading: boolean }
  priceImpact?: Percent
  testId?: string
}) {
  const { formatNumber, formatPercent } = useFormatter()

  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'success'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'neutral3'
    if (severity < 3) return 'deprecated_yellow1'
    return 'critical'
  }, [priceImpact])

  if (fiatValue.isLoading) {
    return <FiatLoadingBubble />
  }

  return (
    <Row gap="sm">
      <ThemedText.BodySmall color="neutral2" data-testid={testId}>
        {fiatValue.data ? (
          formatNumber({
            input: fiatValue.data,
            type: NumberType.FiatTokenPrice
          })
        ) : (
          <Tooltip title={<span>Not enough liquidity to show accurate USD value.</span>}>
            {/* <>-</> remove usd price*/}
            <></>
          </Tooltip>
        )}
      </ThemedText.BodySmall>
      {priceImpact && (
        <ThemedText.BodySmall color={priceImpactColor}>
          <Tooltip title={<>The estimated difference between the USD values of input and output amounts.</>}>
            <Typography>{formatPercent(priceImpact.multiply(-1))}</Typography>
          </Tooltip>
        </ThemedText.BodySmall>
      )}
    </Row>
  )
}
