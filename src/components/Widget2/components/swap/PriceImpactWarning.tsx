import { Percent } from '@uniswap/sdk-core'
import { ThemedText } from '../../theme/components'
import { useFormatter } from '../../utils/formatNumbers'
import { AlertCicle } from 'components/Widget/assets/svg'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { MouseoverTooltip } from '../Tooltip'
import { Typography } from '@mui/material'

interface PriceImpactWarningProps {
  priceImpact: Percent
}

export default function PriceImpactWarning({ priceImpact }: PriceImpactWarningProps) {
  const { formatPercent } = useFormatter()

  return (
    <AutoColumn gap="sm">
      <Typography
        color={'#121212'}
        display={'flex'}
        alignItems={'center'}
        gap={10}
        mt={12}
        fontSize={12}
        width="100%"
        px={15}
      >
        <AlertCicle style={{ stroke: '#121212' }} />
        <MouseoverTooltip
          style={{
            width: '100%'
          }}
          text={
            <>
              A swap of this size may have a high price impact, given the current liquidity in the pool. There may be a
              large difference between the amount of your input token and what you will receive in the output token
            </>
          }
        >
          <RowBetween>
            <RowFixed>
              <>Price impact warning</>
            </RowFixed>
            <ThemedText.DeprecatedLabel textAlign="right" fontSize={14} color="critical">
              ~{formatPercent(priceImpact)}
            </ThemedText.DeprecatedLabel>
          </RowBetween>
        </MouseoverTooltip>
      </Typography>
    </AutoColumn>
  )
}
