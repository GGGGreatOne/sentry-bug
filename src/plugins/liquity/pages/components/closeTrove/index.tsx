import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { TroveInfoProps, TroveStep, useCloseTrove } from 'plugins/liquity/hooks/useLiquityInfo'
import { useCallback, useMemo } from 'react'
import { ErrorTips } from '../openTrove'
import { CurrencyAmount } from 'constants/token'
import { useCurrencyBalance } from 'hooks/useToken'
import { useTroveManagerContract } from 'plugins/liquity/hooks/useContract'
import { useSingleCallResult } from 'hooks/multicall'
import BigNumber from 'bignumber.js'
import { formatBigNumber } from 'utils'
import ItemWithTooltip from 'views/clubs/components/ItemWithTooltip'
import useBreakpoint from 'hooks/useBreakpoint'

export interface Props {
  boxContractAddr?: string
  troveInfo: TroveInfoProps
  setTroveStep: React.Dispatch<React.SetStateAction<TroveStep>>
}
export default function Page({ boxContractAddr, troveInfo, setTroveStep }: Props) {
  const { account, chainId } = useActiveWeb3React()
  const userStableBalance = useCurrencyBalance(account, troveInfo.stableToken, chainId)
  const OPEN_TROVE_FEE = CurrencyAmount.fromAmount(troveInfo.stableToken, '200')
  const HUNDRED_PERCENT = useMemo(() => new BigNumber('1'), [])
  const troveMangerContract = useTroveManagerContract(troveInfo.troveManagerContractAddr)
  const cb = useCallback(() => {
    setTroveStep(TroveStep.RICKY_TROVE_LIST)
  }, [setTroveStep])
  const { runWithModal: closeTrove, submitted } = useCloseTrove(cb, boxContractAddr, troveInfo)

  const userTotalDebtAmount = useSingleCallResult(chainId, troveMangerContract, 'Troves', [account], undefined)
  const userOpenTroveFeeAmount = useSingleCallResult(
    chainId,
    troveMangerContract,
    'STABLE_GAS_COMPENSATION',
    undefined,
    undefined
  )

  const userNeedPayStableAmount = useMemo(() => {
    if (userTotalDebtAmount.result && userOpenTroveFeeAmount.result && troveInfo.borrowRate && troveInfo.stableToken) {
      const diff = new BigNumber(userTotalDebtAmount.result[0].toString()).minus(
        new BigNumber(userOpenTroveFeeAmount.result[0].toString())
      )
      const ret = diff.div(new BigNumber(troveInfo.borrowRate.toExact()).plus(HUNDRED_PERCENT))
      return CurrencyAmount.fromAmount(troveInfo.stableToken, ret.toString())
    }
    return undefined
  }, [
    HUNDRED_PERCENT,
    troveInfo.borrowRate,
    troveInfo.stableToken,
    userOpenTroveFeeAmount.result,
    userTotalDebtAmount.result
  ])

  const newTCR = useMemo(() => {
    if (
      troveInfo.userCollateralAmount &&
      troveInfo.btcPrice &&
      troveInfo.stableAmount &&
      troveInfo.btcAmount &&
      troveInfo.userDebtAmount
    ) {
      const val = new BigNumber(troveInfo.btcAmount.toExact())
        .minus(troveInfo.userCollateralAmount.toExact())
        .times(troveInfo.btcPrice.toExact())
        .div(new BigNumber(troveInfo.stableAmount.toExact()).minus(troveInfo.userDebtAmount.toExact()))
      return val
    }
    return undefined
  }, [
    troveInfo.userCollateralAmount,
    troveInfo.btcPrice,
    troveInfo.stableAmount,
    troveInfo.btcAmount,
    troveInfo.userDebtAmount
  ])

  const isBtnDisable = useMemo(() => {
    if (!account) return true
    if (troveInfo.userCollateralAmount && troveInfo.userCollateralAmount.equalTo('0')) return true
    if (
      troveInfo.userCollateralRatio &&
      newTCR &&
      troveInfo.minCollRatio &&
      troveInfo.maxCollRatio &&
      (new BigNumber(troveInfo.userCollateralRatio.toExact())?.lt(troveInfo.minCollRatio.toExact()) ||
        newTCR?.lt(troveInfo.maxCollRatio.toExact()))
    )
      return true
    if (
      userStableBalance &&
      OPEN_TROVE_FEE &&
      troveInfo.userDebtAmount?.subtract(OPEN_TROVE_FEE)?.greaterThan(userStableBalance)
    )
      return true
    return false
  }, [
    account,
    troveInfo.userCollateralAmount,
    troveInfo.userCollateralRatio,
    troveInfo.minCollRatio,
    troveInfo.maxCollRatio,
    troveInfo.userDebtAmount,
    newTCR,
    userStableBalance,
    OPEN_TROVE_FEE
  ])

  const needCollateralAmount = useMemo(() => {
    const colAmount =
      troveInfo.btcPrice &&
      troveInfo.userDebtAmount &&
      new BigNumber(troveInfo.userDebtAmount?.toExact())
        ?.div(troveInfo.isRecoveryMode ? '1.5' : '1.1')
        .div(troveInfo.btcPrice.toExact())
    return troveInfo.userCollateralAmount && colAmount && colAmount.minus(troveInfo.userCollateralAmount.toExact())
  }, [troveInfo.btcPrice, troveInfo.userDebtAmount, troveInfo.isRecoveryMode, troveInfo.userCollateralAmount])

  const onCloseTrove = useCallback(() => closeTrove(), [closeTrove])

  const normalModePrice = useMemo(() => {
    if (troveInfo.userCollateralAmount && troveInfo.userDebtAmount && troveInfo.btcToken) {
      const val = new BigNumber(troveInfo.userDebtAmount.toExact())
        .times(1.1)
        .div(troveInfo.userCollateralAmount.toExact())
      return val
    }
    return undefined
  }, [troveInfo.btcToken, troveInfo.userCollateralAmount, troveInfo.userDebtAmount])

  const recoveryModePrice = useMemo(() => {
    if (troveInfo.userCollateralAmount && troveInfo.userDebtAmount && troveInfo.btcToken) {
      const val = new BigNumber(troveInfo.userDebtAmount?.toExact())
        .times(1.5)
        .div(troveInfo.userCollateralAmount.toExact())
      return val
    }
    return undefined
  }, [troveInfo.btcToken, troveInfo.userCollateralAmount, troveInfo.userDebtAmount])

  const userBorrowFee = useMemo(() => {
    if (userNeedPayStableAmount && troveInfo.borrowRate) {
      const val = new BigNumber(userNeedPayStableAmount.toExact()).times(troveInfo.borrowRate.toExact()).div(1e18)
      return val
    }
    return undefined
  }, [troveInfo.borrowRate, userNeedPayStableAmount])

  const overviewList = [
    {
      label: 'Borrowing Fee',
      value: `${
        userBorrowFee ? formatBigNumber(userBorrowFee, 2) : '--'
      } ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} (${troveInfo.borrowRate?.mul(100)?.toFixed(2)}%)`,
      tips: 'This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
    },
    {
      label: 'Liquidation Price (Normal Mode)',
      value: `$${(normalModePrice && formatBigNumber(normalModePrice, 2)) || '--'}`,
      tips: 'The dollar value per unit of collateral at which your Trove will drop below a 110% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level..'
    },
    {
      label: 'Liquidation Price (Recovery Mode)',
      value: `$${(recoveryModePrice && formatBigNumber(recoveryModePrice, 2)) || '--'}`,
      tips: 'The dollar value per unit of collateral at which your Trove will drop below a 150% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level..'
    },
    {
      label: 'Collateral Ratio',
      value: (
        <>
          {troveInfo.maxCollRatio && troveInfo.userCollateralRatio?.greaterThan(troveInfo.maxCollRatio) && (
            <Typography color="#1FC64E" fontSize={20}>
              {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
            </Typography>
          )}
          {troveInfo.minCollRatio && troveInfo.userCollateralRatio?.lessThan(troveInfo.minCollRatio) && (
            <Typography color="#D12A1F" fontSize={20}>
              {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
            </Typography>
          )}
          {troveInfo.minCollRatio &&
            troveInfo.userCollateralRatio?.mul(100)?.greaterThan(troveInfo.minCollRatio) &&
            troveInfo.maxCollRatio &&
            troveInfo.userCollateralRatio?.mul(100)?.lessThan(troveInfo.maxCollRatio) && (
              <Typography color="#F7931B" fontSize={20}>
                {troveInfo.userCollateralRatio.mul(100).toFixed(2)}%
              </Typography>
            )}
        </>
      ),
      tips: `The ratio between the dollar value of the collateral and the debt (in ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.`
    }
  ]
  const isMd = useBreakpoint('md')

  return (
    <Stack
      spacing={16}
      sx={{
        padding: isMd ? '6px' : '32px 40px',
        background: 'var(--ps-neutral2)',
        borderRadius: '12px'
      }}
    >
      <Stack
        spacing={16}
        sx={{
          padding: isMd ? '10px' : '32px 40px',
          background: 'var(--ps-neutral)',
          borderRadius: '12px'
        }}
      >
        <div onClick={() => setTroveStep(TroveStep.RICKY_TROVE_LIST)}>
          <Typography fontSize={24} fontWeight={600} sx={{ cursor: 'pointer' }}>
            &lt;&nbsp;Close Your Trove
          </Typography>
        </div>
        <Stack spacing={16}>
          <Stack spacing={16}>
            <Stack
              sx={{
                padding: '12px 16px',
                borderRadius: '4px',
                background: '#FFFFFF1A'
              }}
            >
              <Typography fontSize={16}>Collateral</Typography>
              <Stack>
                <Typography fontSize={20}>
                  {(troveInfo.userCollateralAmount && troveInfo.userCollateralAmount.toSignificant(2)) || '--'}{' '}
                  {troveInfo.btcToken.symbol?.toLocaleUpperCase()}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              sx={{
                padding: '12px 16px',
                borderRadius: '4px',
                background: '#FFFFFF1A'
              }}
            >
              <Typography fontSize={16}>Borrow</Typography>
              <Stack>
                <Typography fontSize={20}>
                  {(troveInfo.userDebtAmount && troveInfo.userDebtAmount.toSignificant(2)) || '--'}{' '}
                  {troveInfo.stableToken.symbol?.toLocaleUpperCase()}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing={16} width={'100%'}>
            <Stack
              display={'grid'}
              direction={'row'}
              gridTemplateColumns={isMd ? '1fr' : '1fr 1fr'}
              gap={16}
              alignItems={'center'}
              sx={{
                background: 'var(--ps-neutral2)',
                borderRadius: '12px'
              }}
            >
              {overviewList.map((item, index) => (
                <Stack
                  sx={{
                    background: '#FFFFFF1A',
                    borderRadius: '4px'
                  }}
                  key={index}
                  direction={'column'}
                  justifyContent={'flex-start'}
                  spacing={16}
                  p={12}
                >
                  <ItemWithTooltip text={item.label} title={item.tips} />
                  <Typography fontSize={20}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          {needCollateralAmount && needCollateralAmount.gt('0') && (
            <ErrorTips
              text={`You need ${formatBigNumber(
                needCollateralAmount,
                2
              )} ${troveInfo.btcToken.symbol?.toLocaleUpperCase()} more to close your Trove.`}
            />
          )}
          {userStableBalance &&
            OPEN_TROVE_FEE &&
            troveInfo.userDebtAmount &&
            new BigNumber(troveInfo.userDebtAmount.toExact())
              .minus(OPEN_TROVE_FEE.toExact())
              .gt(userStableBalance.toExact()) && (
              <ErrorTips
                text={`You need at least ${troveInfo.userDebtAmount
                  .subtract(OPEN_TROVE_FEE)
                  .toSignificant()} ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} in your wallet.`}
              />
            )}
          {troveInfo.isRecoveryMode &&
            troveInfo.userCollateralRatio &&
            troveInfo.minCollRatio &&
            troveInfo.userCollateralRatio?.mul(100)?.lessThan(troveInfo.minCollRatio) && (
              <ErrorTips text={`Collateral Ratio must be at least 150%.`} />
            )}
          {!troveInfo.isRecoveryMode &&
            troveInfo.userCollateralRatio &&
            troveInfo.minCollRatio &&
            troveInfo.userCollateralRatio?.mul(100)?.lessThan(troveInfo.minCollRatio) && (
              <ErrorTips text={`Collateral Ratio must be at least 110%.`} />
            )}
          {troveInfo.userCollateralRatio &&
            newTCR &&
            troveInfo.minCollRatio &&
            troveInfo.maxCollRatio &&
            (troveInfo.userCollateralRatio?.lessThan(troveInfo.minCollRatio) ||
              newTCR?.lt(troveInfo.maxCollRatio.toExact())) && (
              <ErrorTips
                text={`You can not close this trove right now, otherwise the recovery mode will be triggered.`}
              />
            )}
          <Stack direction={'row'} spacing={16} alignItems={'center'}>
            <Button variant="outlined" sx={{ width: '50%' }} onClick={() => setTroveStep(TroveStep.RICKY_TROVE_LIST)}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              sx={{ width: '50%' }}
              loading={submitted.pending}
              onClick={onCloseTrove}
              disabled={isBtnDisable}
            >
              Confirm
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
