import { FeeAmount } from '@uniswap/v3-sdk'
import styled from 'styled-components'
import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'
import { ThemedText } from 'components/Widget2/theme/components'
import { PoolState } from 'components/Widget2/hooks/usePools'
import { useFormatter } from 'components/Widget2/utils/formatNumbers'
import { ButtonRadioChecked } from '../Button'
import { AutoColumn } from '../Column'
import { Typography } from '@mui/material'
import { useFeeTierDistribution } from 'components/Widget2/hooks/useFeeTierDistribution'

const ResponsiveText = styled(ThemedText.DeprecatedLabel)`
  line-height: 16px;
  font-size: 14px;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    font-size: 12px;
    line-height: 12px;
  `};
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
}

export function FeeOption({ feeAmount, active, poolState, distributions, onClick }: FeeOptionProps) {
  const { formatDelta } = useFormatter()

  return (
    <ButtonRadioChecked active={active} onClick={onClick}>
      <AutoColumn gap="sm" justify="flex-start">
        <AutoColumn justify="flex-start" gap="6px">
          <ResponsiveText>
            <Typography color={'#fff'} fontSize={14}>
              {formatDelta(parseFloat(FEE_AMOUNT_DETAIL[feeAmount].label))}
            </Typography>
          </ResponsiveText>
          <Typography color={'#9b9b9b'} textAlign={'left'}>
            {FEE_AMOUNT_DETAIL[feeAmount].description}
          </Typography>
        </AutoColumn>
        {distributions && (
          <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
        )}
      </AutoColumn>
    </ButtonRadioChecked>
  )
}
