import { Button, Stack, Typography, styled } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { viewControl } from 'views/editBox/modal'
import { useActiveWeb3React } from 'hooks'
import {
  TroveInfoProps,
  useClaimStabilityPoolReward,
  useClaimStabilityPoolRewardAndDeposit,
  useStabilityPoolInfo
} from 'plugins/liquity/hooks/useLiquityInfo'
import { LoadingButton } from '@mui/lab'
import { useSingleCallResult } from 'hooks/multicall'
import {
  useHintHelperContract,
  useSortedTrovesContract,
  useTroveManagerContract
} from 'plugins/liquity/hooks/useContract'
import BigNumber from 'bignumber.js'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import useBreakpoint from 'hooks/useBreakpoint'

const RowAlignStack = styled(Stack)({
  display: 'flex',
  gap: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
})

export interface Props {
  stabilityPoolContractAddr?: string
  boxContractAddr?: string
  troveInfo?: TroveInfoProps
}

export default function Page({ stabilityPoolContractAddr, boxContractAddr, troveInfo }: Props) {
  const { account, chainId } = useActiveWeb3React()
  const isMd = useBreakpoint('md')
  const stabilityPoolInfo = useStabilityPoolInfo(stabilityPoolContractAddr, troveInfo?.stableToken, troveInfo?.btcToken)
  const hintHelperContract = useHintHelperContract(troveInfo?.hintHelperContractAddr)
  const troveManagerContract = useTroveManagerContract(troveInfo?.troveManagerContractAddr)
  const sortedContract = useSortedTrovesContract(troveInfo?.sortedTrovesContractAddr)
  const expectedFeeRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'getBorrowingFeeWithDecay',
    [troveInfo?.userDebtAmount?.raw.toString()],
    undefined
  )
  const expectedFee = useMemo(() => {
    if (expectedFeeRes.result) {
      return new BigNumber(expectedFeeRes.result[0].toString())
    }
    return undefined
  }, [expectedFeeRes.result])
  const expectedDebt = useMemo(() => {
    return (
      troveInfo?.userDebtAmount &&
      expectedFee &&
      troveInfo?.liquidationReserve &&
      new BigNumber(troveInfo.userDebtAmount.toExact()).plus(expectedFee).plus(troveInfo.liquidationReserve)
    )
  }, [troveInfo?.userDebtAmount, troveInfo?.liquidationReserve, expectedFee])
  const NICR = useMemo(() => {
    if (expectedDebt && stabilityPoolInfo.userSupplyAmount) {
      const val = new BigNumber(stabilityPoolInfo.userSupplyAmount.toExact())
        .times(1e20)
        .div(expectedDebt)
        .times(1e18)
        .toFixed(0)
      return val
    }
    return undefined
  }, [expectedDebt, stabilityPoolInfo.userSupplyAmount])
  const numTrials = useMemo(() => troveInfo?.troveSize?.times(15), [troveInfo?.troveSize])

  const approxHint = useSingleCallResult(
    chainId,
    hintHelperContract,
    'getApproxHint',
    [NICR?.toString(), numTrials?.toString(), 42],
    undefined
  )
  const insetPosition = useSingleCallResult(
    chainId,
    sortedContract,
    'findInsertPosition',
    [
      NICR?.toString(),
      approxHint.result ? approxHint.result[0] : undefined,
      approxHint.result ? approxHint.result[0] : undefined
    ],
    undefined
  )

  const onSupply = useCallback(() => {
    if (troveInfo && stabilityPoolInfo) {
      viewControl.show('StakeModal', {
        troveInfo,
        stabilityPoolInfo,
        boxContractAddr
      })
    }
  }, [boxContractAddr, stabilityPoolInfo, troveInfo])

  const onWithdraw = useCallback(() => {
    if (troveInfo && stabilityPoolInfo) {
      viewControl.show('UnstakeModal', {
        troveInfo,
        stabilityPoolInfo,
        boxContractAddr
      })
    }
  }, [boxContractAddr, stabilityPoolInfo, troveInfo])
  const { runWithModal: claimReward, submitted: submitted0 } = useClaimStabilityPoolReward(
    boxContractAddr,
    stabilityPoolInfo
  )

  const { runWithModal: claimRewardAndDeposit, submitted: submitted1 } = useClaimStabilityPoolRewardAndDeposit(
    boxContractAddr,
    stabilityPoolInfo
  )
  const onClaimReward = useCallback(() => {
    claimReward(['0'])
  }, [claimReward])
  const onClaimRewardAndDeposit = useCallback(() => {
    if (insetPosition.result) {
      claimRewardAndDeposit([insetPosition.result?.[0].toString(), insetPosition.result?.[1].toString()])
    }
  }, [claimRewardAndDeposit, insetPosition.result])
  console.log('logo icon', troveInfo?.stableToken.address)

  return (
    <Stack
      spacing={10}
      sx={{
        width: isMd ? 'calc(100vw - 80px)' : '50%',
        height: 474,
        borderRadius: '16px',
        background: 'var(--ps-neutral)',
        padding: '24px 16px'
      }}
    >
      <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} spacing={16}>
        <CurrencyLogo currencyOrAddress={troveInfo?.stableToken.address || ''} />
        <Typography fontSize={20} fontWeight={500}>
          {troveInfo?.stableToken?.symbol?.toLocaleUpperCase()} Stability Pool
        </Typography>
      </Stack>
      <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A' }}></Stack>
      <RowAlignStack>
        <Typography fontSize={14} color={'#FFFFFF99'}>
          Your Supply
        </Typography>
        <Typography fontSize={14}>
          {stabilityPoolInfo.userSupplyAmount?.toSignificant()} {troveInfo?.stableToken?.symbol?.toLocaleUpperCase()}
        </Typography>
      </RowAlignStack>
      <RowAlignStack>
        <Typography fontSize={14} color={'#FFFFFF99'}>
          Withdrawable
        </Typography>
        <Typography fontSize={14}>
          {stabilityPoolInfo.userWithdrawableAmount?.toSignificant()}{' '}
          {troveInfo?.stableToken?.symbol?.toLocaleUpperCase()}
        </Typography>
      </RowAlignStack>
      <RowAlignStack>
        <Typography fontSize={14} color={'#FFFFFF99'}>
          Current Liquidation Gain
        </Typography>
        <Typography fontSize={14}>
          {stabilityPoolInfo.userLiquidationRewardAmount?.toSignificant() || '--'} BBTC
        </Typography>
      </RowAlignStack>
      <LoadingButton
        loading={submitted0.pending || submitted1.pending}
        variant="outlined"
        fullWidth
        sx={{ marginTop: 'auto !important' }}
        disabled={
          !account ||
          !stabilityPoolInfo ||
          (stabilityPoolInfo.userLiquidationRewardAmount?.equalTo('0') &&
            stabilityPoolInfo.userSupplyRewardAmount?.equalTo('0'))
        }
        onClick={() => {
          if (
            stabilityPoolInfo.userLiquidationRewardAmount?.greaterThan('0') &&
            troveInfo?.userCollateralAmount?.greaterThan('0')
          ) {
            // TODO bug occurred when using this function
            onClaimRewardAndDeposit()
          }
          if (stabilityPoolInfo.userSupplyRewardAmount?.greaterThan('0')) {
            onClaimReward()
          }
        }}
      >
        Claim BBTC
      </LoadingButton>
      <RowAlignStack>
        <Button
          variant="contained"
          disabled={!account || troveInfo?.userStableTokenBalance?.equalTo('0')}
          sx={{ width: '50%', padding: '12px' }}
          onClick={onSupply}
        >
          Supply
        </Button>
        <Button
          variant="contained"
          disabled={!account || stabilityPoolInfo.userWithdrawableAmount?.equalTo('0')}
          sx={{ width: '50%' }}
          onClick={onWithdraw}
        >
          Withdraw
        </Button>
      </RowAlignStack>
    </Stack>
  )
}
