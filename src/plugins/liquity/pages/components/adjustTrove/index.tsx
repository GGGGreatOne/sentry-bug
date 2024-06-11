import { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
  useHintHelperContract,
  useSortedTrovesContract,
  useTroveManagerContract
} from 'plugins/liquity/hooks/useContract'
import {
  TroveInfoProps,
  TroveStep,
  useAdjustTrove,
  useAdjustTroveByAddColl,
  useAdjustTroveByRepayStable,
  useAdjustTroveByWithdrawColl,
  useAdjustTroveByWithdrawStable
} from 'plugins/liquity/hooks/useLiquityInfo'
import { CurrencyAmount } from 'constants/token'
import { useSingleCallResult } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'
import { Button, Stack, Typography } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import { useCurrencyBalance } from 'hooks/useToken'
import { LoadingButton } from '@mui/lab'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { ErrorTips, WarningTips } from '../openTrove'
import BTCIcon from 'assets/images/boxes/bbtc.png'
import Image from 'components/Image'
import { formatBigNumber } from 'utils'
import ItemWithTooltip from 'views/clubs/components/ItemWithTooltip'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import useBreakpoint from 'hooks/useBreakpoint'

export interface Props {
  boxContractAddr?: string
  troveInfo: TroveInfoProps
  setTroveStep: React.Dispatch<React.SetStateAction<TroveStep>>
}

export default function Page({ boxContractAddr, troveInfo, setTroveStep }: Props) {
  const { account, chainId } = useActiveWeb3React()
  const isMd = useBreakpoint('md')
  const sortedContract = useSortedTrovesContract(troveInfo.sortedTrovesContractAddr, chainId)
  const troveContract = useTroveManagerContract(troveInfo.troveManagerContractAddr)
  const hintHelperContract = useHintHelperContract(troveInfo.hintHelperContractAddr)
  const userBtcBalance = useCurrencyBalance(account, troveInfo.btcToken, chainId)
  const userStableBalance = useCurrencyBalance(account, troveInfo.stableToken, chainId)
  const HUNDRED_PERCENT = useMemo(() => new BigNumber('1'), [])
  const OPEN_TROVE_FEE = CurrencyAmount.fromAmount(troveInfo.stableToken, '200')
  const [amount, setAmount] = useState(troveInfo.userCollateralAmount?.toExact() || '')
  const [amount1, setAmount1] = useState(troveInfo.userDebtAmount?.toExact() || '')

  const userDepositCollAmount = CurrencyAmount.fromAmount(troveInfo.btcToken, amount)
  const userBorrowDebtAmount = CurrencyAmount.fromAmount(troveInfo.stableToken, amount1)

  const expectedFeeRes = useSingleCallResult(
    chainId,
    troveContract,
    'getBorrowingFeeWithDecay',
    [userBorrowDebtAmount?.raw.toString()],
    undefined
  )

  const expectedFee = useMemo(() => {
    if (expectedFeeRes.result) {
      return CurrencyAmount.ether(expectedFeeRes.result[0].toString())
    }
    return undefined
  }, [expectedFeeRes])

  const expectedDebt = useMemo(() => {
    if (userBorrowDebtAmount && expectedFee && troveInfo.liquidationReserve) {
      const val = new BigNumber(userBorrowDebtAmount.toExact())
        .plus(expectedFee.toExact())
        .plus(troveInfo.liquidationReserve.toString())
      return val
    }
    return undefined
  }, [userBorrowDebtAmount, expectedFee, troveInfo.liquidationReserve])

  const NICR = useMemo(() => {
    if (userDepositCollAmount && expectedDebt) {
      const val = new BigNumber(userDepositCollAmount.toExact()).times(1e20).div(expectedDebt).times(1e18).toFixed(0)
      return val
    }
    return undefined
  }, [expectedDebt, userDepositCollAmount])

  const numTrials = useMemo(() => troveInfo.troveSize?.times(15), [troveInfo.troveSize])
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
    [NICR?.toString(), approxHint.result?.[0].toString(), approxHint.result?.[0].toString()],
    undefined
  )

  const collateralRatio = useMemo(() => {
    if (userDepositCollAmount && userBorrowDebtAmount && troveInfo.btcPrice && troveInfo.btcToken) {
      const val = new BigNumber(userDepositCollAmount.toExact())
        .times(troveInfo.btcPrice.toExact())
        .div(userBorrowDebtAmount.toExact())
      return val
    }
    return undefined
  }, [userDepositCollAmount, userBorrowDebtAmount, troveInfo.btcPrice, troveInfo.btcToken])

  const newTCR = useMemo(() => {
    if (
      userDepositCollAmount &&
      troveInfo.btcPrice &&
      troveInfo.stableAmount &&
      troveInfo.btcAmount &&
      troveInfo.btcToken &&
      troveInfo.userCollateralAmount &&
      troveInfo.userDebtAmount &&
      userBorrowDebtAmount
    ) {
      const val = new BigNumber(troveInfo.btcAmount.toExact())
        .plus(userDepositCollAmount.toExact())
        .minus(troveInfo.userCollateralAmount.toExact())
        .times(troveInfo.btcPrice.toExact())
        .div(
          new BigNumber(troveInfo.stableAmount.toExact())
            .plus(userBorrowDebtAmount.toExact())
            .minus(troveInfo.userDebtAmount.toExact())
        )
      return val
    }
    return undefined
  }, [
    userDepositCollAmount,
    troveInfo.btcPrice,
    troveInfo.stableAmount,
    troveInfo.btcAmount,
    troveInfo.btcToken,
    troveInfo.userCollateralAmount,
    troveInfo.userDebtAmount,
    userBorrowDebtAmount
  ])

  const normalModePrice = useMemo(() => {
    if (userDepositCollAmount && userBorrowDebtAmount) {
      const val = new BigNumber(userBorrowDebtAmount.toExact()).times(1.1).div(userDepositCollAmount.toExact())
      return val
    }
    return undefined
  }, [userBorrowDebtAmount, userDepositCollAmount])

  const recoveryModePrice = useMemo(() => {
    if (userDepositCollAmount && userBorrowDebtAmount) {
      const val = new BigNumber(userBorrowDebtAmount.toExact()).times(1.5).div(userDepositCollAmount.toExact())
      return val
    }
    return undefined
  }, [userBorrowDebtAmount, userDepositCollAmount])

  const [approveState, approve] = useApproveCallback(userDepositCollAmount, troveInfo.borrowContractAddr)

  const userMaxTCRBorrowStableAmount = useMemo(() => {
    if (userDepositCollAmount && troveInfo.btcPrice) {
      const val = new BigNumber(userDepositCollAmount.toExact()).times(troveInfo.btcPrice.toExact()).div(1.1)
      return val
    }
    return undefined
  }, [userDepositCollAmount, troveInfo.btcPrice])

  const userMaxICRBorrowStableAmount = useMemo(() => {
    if (
      troveInfo.btcAmount &&
      userDepositCollAmount &&
      troveInfo.btcPrice &&
      troveInfo.stableAmount &&
      troveInfo.borrowRate &&
      troveInfo.userCollateralAmount &&
      troveInfo.userDebtAmount &&
      troveInfo.stableToken &&
      OPEN_TROVE_FEE
    ) {
      const val = new BigNumber(troveInfo.btcAmount.toExact())
        .plus(new BigNumber(userDepositCollAmount.toExact()))
        .minus(troveInfo.userCollateralAmount.toExact())
        .times(troveInfo.btcPrice.toExact())
        .div(1.5)
        .minus(troveInfo.stableAmount.toExact())
        .plus(troveInfo.userDebtAmount.toExact())
        .minus(OPEN_TROVE_FEE.toExact())
        .div(new BigNumber(troveInfo.borrowRate.toExact()).plus(HUNDRED_PERCENT))
      return val
    }
    return undefined
  }, [
    troveInfo.btcAmount,
    troveInfo.btcPrice,
    troveInfo.stableAmount,
    troveInfo.borrowRate,
    troveInfo.userCollateralAmount,
    troveInfo.userDebtAmount,
    troveInfo.stableToken,
    userDepositCollAmount,
    OPEN_TROVE_FEE,
    HUNDRED_PERCENT
  ])

  const isBtnDisable = useMemo(() => {
    if (!account) return true
    if (!amount || !amount1) return true
    if (amount && amount1 && approveState !== ApprovalState.APPROVED) return true
    if (troveInfo.userCollateralAmount && troveInfo.userCollateralAmount.equalTo('0')) return true
    if (
      userDepositCollAmount &&
      troveInfo.userCollateralAmount &&
      userBtcBalance &&
      new BigNumber(userDepositCollAmount.toExact())
        .minus(troveInfo.userCollateralAmount.toExact())
        .gt(userBtcBalance.toExact())
    )
      return true
    if (
      userDepositCollAmount &&
      troveInfo.userCollateralAmount?.equalTo(userDepositCollAmount) &&
      userBorrowDebtAmount &&
      troveInfo.userDebtAmount?.equalTo(userBorrowDebtAmount)
    )
      return true
    if (
      userStableBalance &&
      userBorrowDebtAmount &&
      troveInfo.userDebtAmount?.greaterThan(userBorrowDebtAmount) &&
      new BigNumber(troveInfo.userDebtAmount.toExact())
        ?.minus(userBorrowDebtAmount.toExact())
        .gt(userStableBalance.toExact())
    )
      return true
    if (
      newTCR &&
      collateralRatio &&
      troveInfo.minCollRatio &&
      troveInfo.maxCollRatio &&
      (collateralRatio.lt(troveInfo.minCollRatio.toExact()) || newTCR.lt(troveInfo.maxCollRatio.toExact()))
    )
      return true
    if (
      userBorrowDebtAmount &&
      userMaxICRBorrowStableAmount &&
      userMaxTCRBorrowStableAmount &&
      (userMaxICRBorrowStableAmount.gt(userMaxTCRBorrowStableAmount)
        ? userMaxTCRBorrowStableAmount.times(0.995)
        : userMaxICRBorrowStableAmount && userMaxICRBorrowStableAmount.times(0.995)
      ).lt(userBorrowDebtAmount.toExact())
    )
      return true
    return false
  }, [
    account,
    amount,
    amount1,
    approveState,
    troveInfo.userCollateralAmount,
    troveInfo.userDebtAmount,
    troveInfo.minCollRatio,
    troveInfo.maxCollRatio,
    userDepositCollAmount,
    userBtcBalance,
    userBorrowDebtAmount,
    userStableBalance,
    newTCR,
    collateralRatio,
    userMaxICRBorrowStableAmount,
    userMaxTCRBorrowStableAmount
  ])

  const isDebtIncrease = useMemo(() => {
    if (troveInfo.userDebtAmount && userBorrowDebtAmount) {
      return userBorrowDebtAmount?.greaterThan(troveInfo.userDebtAmount)
    }
    return undefined
  }, [troveInfo.userDebtAmount, userBorrowDebtAmount])

  const diffCollAmount = useMemo(() => {
    if (troveInfo.userCollateralAmount && userDepositCollAmount) {
      return userDepositCollAmount.greaterThan(troveInfo.userCollateralAmount)
        ? new BigNumber(userDepositCollAmount.toExact())
            .minus(troveInfo.userCollateralAmount.toExact())
            .times(`1e${troveInfo.btcToken.decimals}`)
        : new BigNumber(troveInfo.userCollateralAmount.toExact())
            .minus(userDepositCollAmount.toExact())
            .times(`1e${troveInfo.btcToken.decimals}`)
    }
    return undefined
  }, [troveInfo, userDepositCollAmount])

  const diffDebtAmount = useMemo(() => {
    if (troveInfo.userDebtAmount && userBorrowDebtAmount) {
      return userBorrowDebtAmount.greaterThan(troveInfo.userDebtAmount)
        ? new BigNumber(userBorrowDebtAmount.toExact())
            .minus(troveInfo.userDebtAmount.toExact())
            .times(`1e${troveInfo.stableToken.decimals}`)
        : new BigNumber(troveInfo.userDebtAmount.toExact())
            .minus(userBorrowDebtAmount.toExact())
            .times(`1e${troveInfo.stableToken.decimals}`)
    }
    return undefined
  }, [troveInfo.stableToken.decimals, troveInfo.userDebtAmount, userBorrowDebtAmount])

  const { runWithModal: adjustTrove, submitted: submitted0 } = useAdjustTrove(boxContractAddr, troveInfo)
  const { runWithModal: repaySTABLE, submitted: submitted1 } = useAdjustTroveByRepayStable(boxContractAddr, troveInfo)
  const { runWithModal: withdrawStable, submitted: submitted2 } = useAdjustTroveByWithdrawStable(
    boxContractAddr,
    troveInfo
  )
  const { runWithModal: withdrawColl, submitted: submitted3 } = useAdjustTroveByWithdrawColl(boxContractAddr, troveInfo)
  const { runWithModal: addColl, submitted: submitted4 } = useAdjustTroveByAddColl(boxContractAddr, troveInfo)

  const onAdjust = useCallback(async () => {
    if (approveState !== ApprovalState.APPROVED) {
      approve()
      return
    }
    if (
      !isBtnDisable &&
      insetPosition.result &&
      insetPosition.result[0] &&
      insetPosition.result[1] &&
      troveInfo.userDebtAmount &&
      troveInfo.userCollateralAmount &&
      userDepositCollAmount &&
      userBorrowDebtAmount &&
      diffCollAmount &&
      diffDebtAmount &&
      isDebtIncrease !== undefined
    ) {
      let args: any[] = []
      if (
        troveInfo.userDebtAmount &&
        userBorrowDebtAmount &&
        userDepositCollAmount &&
        troveInfo.userCollateralAmount &&
        !troveInfo.userCollateralAmount.equalTo(userDepositCollAmount) &&
        !troveInfo.userDebtAmount.equalTo(userBorrowDebtAmount)
      ) {
        args = [
          new BigNumber(5e16).toString(),
          userDepositCollAmount.lessThan(troveInfo.userCollateralAmount) ? diffCollAmount?.toString() : '0',
          diffDebtAmount?.toString(),
          isDebtIncrease,
          insetPosition.result[0].toString(),
          insetPosition.result[1].toString(),
          userDepositCollAmount.greaterThan(troveInfo.userCollateralAmount) ? diffCollAmount?.toString() : '0'
        ]
        adjustTrove(args)
        return
      }
      if (diffDebtAmount && troveInfo.userDebtAmount && userBorrowDebtAmount.lessThan(troveInfo.userDebtAmount)) {
        args = [diffDebtAmount?.toString(), insetPosition.result[0].toString(), insetPosition.result[1].toString()]
        repaySTABLE(args)
        return
      }
      if (
        userBorrowDebtAmount &&
        troveInfo.userDebtAmount &&
        userBorrowDebtAmount.greaterThan(troveInfo.userDebtAmount)
      ) {
        args = [
          new BigNumber(5e16).toString(),
          diffDebtAmount?.toString(),
          insetPosition.result[0].toString(),
          insetPosition.result[1].toString()
        ]
        withdrawStable(args)
        return
      }
      if (
        userDepositCollAmount &&
        troveInfo.userCollateralAmount &&
        userDepositCollAmount.lessThan(troveInfo.userCollateralAmount)
      ) {
        args = [diffCollAmount?.toString(), insetPosition.result[0].toString(), insetPosition.result[1].toString()]
        withdrawColl(args)
        return
      }
      if (
        userDepositCollAmount &&
        troveInfo.userCollateralAmount &&
        userDepositCollAmount.greaterThan(troveInfo.userCollateralAmount)
      ) {
        args = [insetPosition.result[0].toString(), insetPosition.result[1].toString(), diffCollAmount?.toString()]
        addColl(args)
        return
      }
    }
  }, [
    addColl,
    adjustTrove,
    approve,
    approveState,
    diffCollAmount,
    diffDebtAmount,
    insetPosition.result,
    isBtnDisable,
    isDebtIncrease,
    repaySTABLE,
    troveInfo.userCollateralAmount,
    troveInfo.userDebtAmount,
    userBorrowDebtAmount,
    userDepositCollAmount,
    withdrawColl,
    withdrawStable
  ])

  const overviewList = [
    {
      label: 'Borrowing Fee',
      value: `${
        (troveInfo.borrowRate &&
          userBorrowDebtAmount &&
          troveInfo.userDebtAmount &&
          (new BigNumber(userBorrowDebtAmount.toExact()).minus(troveInfo.userDebtAmount.toExact()).gt('0')
            ? new BigNumber(userBorrowDebtAmount.toExact()).minus(troveInfo.userDebtAmount.toExact())
            : new BigNumber(0)
          )
            .times(troveInfo.borrowRate.toExact())
            .toString()) ||
        '--'
      } ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} (${troveInfo.borrowRate?.mul(100)?.toFixed(2)}%)`,
      tips: 'This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
    },
    {
      label: 'Total Debt',
      value: `${
        (userBorrowDebtAmount && userBorrowDebtAmount?.toSignificant(2)) || '--'
      } ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}`,
      tips: `The total amount of ${troveInfo.stableToken.symbol?.toLocaleLowerCase()} your Trove will hold.`
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
          {collateralRatio && collateralRatio?.times(100)?.gt('150') && (
            <Typography color="#1FC64E" fontSize={20}>
              {collateralRatio.times(100).toFixed(2)}%
            </Typography>
          )}
          {collateralRatio && collateralRatio?.times(100)?.lt('110') && (
            <Typography color="#D12A1F" fontSize={20}>
              {collateralRatio.times(100).toFixed(2)}%
            </Typography>
          )}
          {collateralRatio && collateralRatio?.times(100)?.gt('110') && collateralRatio?.times(100)?.lt('150') && (
            <Typography color="#F7931B" fontSize={20}>
              {collateralRatio.times(100).toFixed(2)}%
            </Typography>
          )}
        </>
      ),
      tips: `The ratio between the dollar value of the collateral and the debt (in ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.`
    }
  ]
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
        sx={{
          background: 'var(--ps-neutral)',
          borderRadius: '12px',
          padding: isMd ? '10px' : '32px 40px'
        }}
      >
        <Stack spacing={16}>
          <div onClick={() => setTroveStep(TroveStep.RICKY_TROVE_LIST)}>
            <Typography fontSize={24} fontWeight={600} sx={{ cursor: 'pointer' }}>
              &lt;&nbsp;Adjust Your Trove
            </Typography>
          </div>
          <Stack spacing={16}>
            <InputNumerical
              value={amount ?? troveInfo.userCollateralAmount?.toString()}
              onChange={e => setAmount(e.target.value)}
              title={troveInfo.btcToken.symbol?.toLocaleUpperCase()}
              label="Collateral"
              hasBorder
              outlined
              backgroundColor="transparent"
              min={0}
              unit="BBTC"
              balance={userBtcBalance?.toSignificant()}
              onMax={() => {
                if (userBtcBalance && troveInfo.userCollateralAmount) {
                  setAmount(userBtcBalance.add(troveInfo.userCollateralAmount).toExact())
                }
              }}
              endAdornment={
                <>
                  <Image src={BTCIcon.src} width={24} style={{ borderRadius: '50%' }} alt="bbtc" />
                  <Typography>BBTC</Typography>
                </>
              }
            />
            <InputNumerical
              value={amount1 ?? troveInfo.userDebtAmount?.toString()}
              onChange={e => setAmount1(e.target.value)}
              min={2000}
              hasBorder
              outlined
              backgroundColor="transparent"
              label="Borrow"
              title={troveInfo.stableToken.symbol?.toLocaleUpperCase()}
              endAdornment={
                <>
                  <CurrencyLogo currencyOrAddress={troveInfo.stableToken.address} />
                  <Typography>{troveInfo.stableToken.symbol?.toLocaleUpperCase()}</Typography>
                </>
              }
            />
            <Stack spacing={16}>
              {overviewList.map(item => (
                <Stack
                  key={item.label}
                  sx={{
                    padding: '12px 16px',
                    borderRadius: '4px',
                    background: '#FFFFFF1A'
                  }}
                >
                  <ItemWithTooltip text={item.label} title={item.tips} />
                  <Typography fontSize={20}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
            <WarningTips text={`Adjust your Trove by modifying its collateral, debt, or both.`} />
            {amount !== '0' &&
              amount1 !== '0' &&
              collateralRatio &&
              troveInfo.isRecoveryMode &&
              troveInfo.maxCollRatio &&
              collateralRatio.lt(troveInfo.maxCollRatio.toExact()) && (
                <WarningTips
                  text={`Keeping your Collateral Ratio above 150% can help avoid liquidation under Recovery Mode.`}
                />
              )}
            {amount !== '0' &&
              amount1 !== '0' &&
              collateralRatio &&
              troveInfo.isRecoveryMode &&
              troveInfo.maxCollRatio &&
              collateralRatio.lt(troveInfo.maxCollRatio.toExact()) && (
                <ErrorTips text={`Collateral Ratio must be at least 150%.`} />
              )}
            {amount !== '0' &&
              amount1 !== '0' &&
              collateralRatio &&
              !troveInfo.isRecoveryMode &&
              troveInfo.minCollRatio &&
              collateralRatio.lt(troveInfo.minCollRatio.toExact()) && (
                <WarningTips
                  text={`Keeping your Collateral Ratio above 110% can help avoid liquidation under Recovery Mode.`}
                />
              )}
            {amount !== '0' &&
              amount1 !== '0' &&
              userDepositCollAmount &&
              troveInfo.userCollateralAmount &&
              userDepositCollAmount.greaterThan(troveInfo.userCollateralAmount) && (
                <WarningTips
                  text={`You will deposit ${userDepositCollAmount
                    .subtract(troveInfo.userCollateralAmount)
                    ?.toSignificant()} ${troveInfo.btcToken.symbol?.toLocaleUpperCase()}.`}
                />
              )}
            {amount !== '0' &&
              amount1 !== '0' &&
              collateralRatio &&
              !troveInfo.isRecoveryMode &&
              troveInfo.minCollRatio &&
              collateralRatio.lt(troveInfo.minCollRatio.toExact()) && (
                <ErrorTips text={`Collateral Ratio must be at least 110%.`} />
              )}
            {userStableBalance &&
              userBorrowDebtAmount &&
              troveInfo.userDebtAmount?.greaterThan(userBorrowDebtAmount) &&
              troveInfo.userDebtAmount?.subtract(userBorrowDebtAmount).greaterThan(userStableBalance) && (
                <ErrorTips text={`The amount you're trying to return exceeds your balance.`} />
              )}
            {((collateralRatio &&
              newTCR &&
              troveInfo.minCollRatio &&
              troveInfo.maxCollRatio &&
              (collateralRatio?.lt(troveInfo.minCollRatio.toExact()) ||
                newTCR?.lt(troveInfo.maxCollRatio.toExact()))) ||
              (userBorrowDebtAmount &&
                userMaxICRBorrowStableAmount &&
                userMaxTCRBorrowStableAmount &&
                (userMaxICRBorrowStableAmount.gt(userMaxTCRBorrowStableAmount)
                  ? userMaxTCRBorrowStableAmount.times(0.995)
                  : userMaxICRBorrowStableAmount && userMaxICRBorrowStableAmount.times(0.995)
                ).lt(userBorrowDebtAmount.toExact()))) &&
              userDepositCollAmount && (
                <ErrorTips
                  text={`The most ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} you can borrow is ${
                    userMaxICRBorrowStableAmount &&
                    userMaxTCRBorrowStableAmount &&
                    userMaxICRBorrowStableAmount.gt(userMaxTCRBorrowStableAmount)
                      ? userMaxTCRBorrowStableAmount.times(0.995).toFixed(0, BigNumber.ROUND_DOWN)
                      : userMaxICRBorrowStableAmount &&
                        userMaxICRBorrowStableAmount.times(0.995).toFixed(0, BigNumber.ROUND_DOWN)
                  }`}
                />
              )}
            {collateralRatio &&
              newTCR &&
              troveInfo.minCollRatio &&
              troveInfo.maxCollRatio &&
              (collateralRatio?.lt(troveInfo.minCollRatio.toExact()) ||
                newTCR?.lt(troveInfo.maxCollRatio.toExact())) && (
                <ErrorTips text={`You can not open trove right now, because the recovery mode will be triggered.`} />
              )}
            <Stack direction={'row'} spacing={16} justifyContent={'space-between'} alignItems={'center'}>
              <Button variant="outlined" sx={{ width: '50%' }} onClick={() => setTroveStep(TroveStep.RICKY_TROVE_LIST)}>
                Cancel
              </Button>
              <LoadingButton
                sx={{ width: '50%' }}
                variant="contained"
                loading={
                  submitted0.pending ||
                  submitted1.pending ||
                  submitted2.pending ||
                  submitted3.pending ||
                  submitted4.pending
                }
                onClick={onAdjust}
                disabled={isBtnDisable}
              >
                {approveState !== ApprovalState.APPROVED ? `Approve BBTC` : 'Confirm'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
