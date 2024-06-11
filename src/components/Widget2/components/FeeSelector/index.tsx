import { ChainId, Currency } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
// import usePrevious from 'hooks/usePrevious'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box } from 'rebass'
import { FeeOption } from './FeeOption'
import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'
import { Stack, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { PoolState, usePools } from 'components/Widget2/hooks/usePools'
import { useFormatter } from 'components/Widget2/utils/formatNumbers'
import { AutoColumn } from '../Column'
import { DynamicSection } from 'components/Widget2/Liquidity/AddLiquidity/styled'
import { RowBetween } from '../Row'
import { useFeeTierDistribution } from 'components/Widget2/hooks/useFeeTierDistribution'
import { ThemedText } from 'components/Widget2/theme/components'

export default function FeeSelector({
  disabled = false,
  feeAmount,
  handleFeePoolSelect,
  currencyA,
  currencyB
}: {
  disabled?: boolean
  feeAmount?: FeeAmount
  handleFeePoolSelect: (feeAmount: FeeAmount) => void
  currencyA?: Currency
  currencyB?: Currency
}) {
  const { chainId } = useActiveWeb3React()
  const { formatDelta } = useFormatter()

  const { isLoading, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(currencyA, currencyB)

  // get pool data on-chain for latest states
  const pools = usePools([
    [currencyA, currencyB, FeeAmount.LOWEST],
    [currencyA, currencyB, FeeAmount.LOW],
    [currencyA, currencyB, FeeAmount.MEDIUM],
    [currencyA, currencyB, FeeAmount.HIGH]
  ])

  const poolsByFeeTier: Record<FeeAmount, PoolState> = useMemo(
    () =>
      pools.reduce(
        (acc, [curPoolState, curPool]) => {
          acc = {
            ...acc,
            ...{ [curPool?.fee as FeeAmount]: curPoolState }
          }
          return acc
        },
        {
          // default all states to NOT_EXISTS
          [FeeAmount.LOWEST]: PoolState.NOT_EXISTS,
          [FeeAmount.LOW]: PoolState.NOT_EXISTS,
          [FeeAmount.MEDIUM]: PoolState.NOT_EXISTS,
          [FeeAmount.HIGH]: PoolState.NOT_EXISTS
        }
      ),
    [pools]
  )

  const [showOptions, setShowOptions] = useState(false)

  // const previousFeeAmount = usePrevious(feeAmount)
  const recommended = useRef(false)

  const handleFeePoolSelectWithEvent = useCallback(
    (fee: FeeAmount) => {
      handleFeePoolSelect(fee)
    },
    [handleFeePoolSelect]
  )

  useEffect(() => {
    if (feeAmount || isLoading || isError) {
      return
    }

    if (!largestUsageFeeTier) {
      // cannot recommend, open options
      setShowOptions(true)
    } else {
      setShowOptions(false)

      recommended.current = true

      handleFeePoolSelect(largestUsageFeeTier)
    }
  }, [feeAmount, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect])

  useEffect(() => {
    setShowOptions(isError)
  }, [isError])

  return (
    <AutoColumn gap="16px">
      <DynamicSection gap="md" disabled={disabled}>
        <Stack
          sx={{
            border: '1px solid #FFFFFF33',
            borderRadius: '16px',
            padding: '16px'
          }}
        >
          <RowBetween>
            <AutoColumn id="add-liquidity-selected-fee">
              {!feeAmount ? (
                <>
                  <ThemedText.DeprecatedLabel>
                    <Typography color={'#fff'}>Fee tier</Typography>
                  </ThemedText.DeprecatedLabel>
                  <ThemedText.DeprecatedMain fontWeight={485} fontSize="12px" textAlign="left">
                    <Typography color={'#fff'}>The % you will earn in fees.</Typography>
                  </ThemedText.DeprecatedMain>
                </>
              ) : (
                <>
                  <ThemedText.DeprecatedLabel className="selected-fee-label">
                    <Typography color={'#fff'} fontSize={16}>
                      {formatDelta(parseFloat(FEE_AMOUNT_DETAIL[feeAmount].label))} fee tier
                    </Typography>
                  </ThemedText.DeprecatedLabel>
                  {distributions && (
                    <Box style={{ width: 'fit-content', marginTop: '8px' }} className="selected-fee-percentage">
                      <FeeTierPercentageBadge
                        distributions={distributions}
                        feeAmount={feeAmount}
                        poolState={poolsByFeeTier[feeAmount]}
                      />
                    </Box>
                  )}
                </>
              )}
            </AutoColumn>
            <Stack onClick={() => setShowOptions(!showOptions)} sx={{ width: 'fit-content', cursor: 'pointer' }}>
              {showOptions ? (
                <Typography color={'#5A7FFF'}>Hide</Typography>
              ) : (
                <Typography color={'#5A7FFF'}>Edit</Typography>
              )}
            </Stack>
          </RowBetween>
        </Stack>

        {chainId && showOptions && (
          <Stack direction={'row'} spacing={8} alignItems={'center'}>
            {[FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((_feeAmount, i) => {
              const { supportedChains } = FEE_AMOUNT_DETAIL[_feeAmount]
              if (supportedChains.includes(chainId as unknown as ChainId)) {
                return (
                  <FeeOption
                    feeAmount={_feeAmount}
                    active={feeAmount === _feeAmount}
                    onClick={() => {
                      handleFeePoolSelectWithEvent(_feeAmount)
                    }}
                    distributions={distributions}
                    poolState={poolsByFeeTier[_feeAmount]}
                    key={i}
                  />
                )
              }
              return null
            })}
          </Stack>
        )}
      </DynamicSection>
    </AutoColumn>
  )
}
