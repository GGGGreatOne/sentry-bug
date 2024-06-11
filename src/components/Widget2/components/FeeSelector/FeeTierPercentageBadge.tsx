import { Typography } from '@mui/material'
import { FeeAmount } from '@uniswap/v3-sdk'
import { useFeeTierDistribution } from 'components/Widget2/hooks/useFeeTierDistribution'
import { PoolState } from 'components/Widget2/hooks/usePools'
import { ThemedText } from 'components/Widget2/theme/components'
import Badge from '../Badge'

export function FeeTierPercentageBadge({
  feeAmount,
  distributions,
  poolState
}: {
  feeAmount: FeeAmount
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
}) {
  return (
    <Badge>
      <ThemedText.DeprecatedLabel fontSize={10}>
        {!distributions || poolState === PoolState.NOT_EXISTS || poolState === PoolState.INVALID ? (
          <Typography color={'#fff'}>Not created</Typography>
        ) : distributions[feeAmount] !== undefined ? (
          <Typography color={'#fff'}>{distributions[feeAmount]?.toFixed(0)}% select</Typography>
        ) : (
          <Typography color={'#fff'}>No data</Typography>
        )}
      </ThemedText.DeprecatedLabel>
    </Badge>
  )
}
