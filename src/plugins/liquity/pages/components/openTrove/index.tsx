import { useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Stack, Typography, styled } from '@mui/material'
import { CurrencyAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { TroveInfoProps, TroveStep, useOpenTrove } from 'plugins/liquity/hooks/useLiquityInfo'
import { useCurrencyBalance } from 'hooks/useToken'
import { useSingleCallResult } from 'hooks/multicall'
import {
  useHintHelperContract,
  useSortedTrovesContract,
  useTroveManagerContract
} from 'plugins/liquity/hooks/useContract'
import { LoadingButton } from '@mui/lab'
import InputNumerical from 'components/Input/InputNumerical'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import WarningIcon from '../../../assets/svg/warning.svg'
import ErrorIcon from '../../../assets/svg/error.svg'
import ItemWithTooltip from 'views/clubs/components/ItemWithTooltip'
import BTCIcon from 'assets/images/boxes/bbtc.png'
import Image from 'components/Image'
import { formatBigNumber } from 'utils'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import useBreakpoint from 'hooks/useBreakpoint'

export const StepCom = ({ index, active }: { index: number; active: boolean }) => {
  return (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        width: 22,
        height: 22,
        fontSize: 12,
        fontWeight: 550,
        borderRadius: '50%',
        color: active ? 'var(--ps-text-primary)' : 'var(--ps-text-100)',
        background: active ? '#fff' : '#FFFFFF33'
      }}
    >
      {index + 1}
    </Stack>
  )
}

export const WarningTips = ({ text }: { text: string }) => {
  return (
    <Stack
      justifyContent={'flex-start'}
      alignItems={'center'}
      direction={'row'}
      spacing={8}
      sx={{
        background: '#FFFFFF33',
        borderRadius: '4px',
        border: '1px solid #FFFFFF33',
        padding: '12px 16px'
      }}
    >
      <WarningIcon />
      <Typography width={'calc(100% - 20px)'}>{text}</Typography>
    </Stack>
  )
}

export const ErrorTips = ({ text }: { text: string }) => {
  return (
    <Stack
      direction={'row'}
      justifyContent={'flex-start'}
      alignItems={'center'}
      spacing={8}
      sx={{
        background: 'rgba(229,52,52,0.10)',
        border: '1px solid #FFFFFF33',
        borderRadius: '4px',
        padding: '12px 16px'
      }}
    >
      <ErrorIcon />
      <Typography color={'#E53434'}>{text}</Typography>
    </Stack>
  )
}

export const SliderCom = styled('div')({
  paddingBottom: '24px',
  paddingTop: '10px',
  '& .ant-slider:hover .ant-slider-rail': {
    background: '#20E520'
  },
  '& .ant-slider:hover .ant-slider-dot': {
    borderColor: '#20E520'
  },
  '& .ant-slider-rail': {
    background: '#20E520'
  },
  '& .ant-slider-horizontal .ant-slider-handle': {
    'inset-block-start': '0!important'
  },
  '& .ant-slider .ant-slider-dot': {
    height: '0!important',
    border: 'unset!important'
  },
  '& .ant-slider-mark-text': {
    top: '8px'
  }
})

export enum StepType {
  STEP_ONE,
  STEP_TWO
}
export interface Props {
  boxContractAddr?: string
  troveInfo: TroveInfoProps
  setTroveStep: React.Dispatch<React.SetStateAction<TroveStep>>
}
export default function Page({ boxContractAddr, troveInfo, setTroveStep }: Props) {
  const isMd = useBreakpoint('md')
  const { account, chainId } = useActiveWeb3React()
  const [activeStep, setActiveStep] = useState(StepType.STEP_ONE)
  const [amount, setAmount] = useState('')
  const [amount1, setAmount1] = useState('')
  const OPEN_TROVE_FEE = CurrencyAmount.fromAmount(troveInfo.stableToken, '200')
  const MIN_BORROW_AMOUNT = CurrencyAmount.fromAmount(troveInfo.stableToken, '1800')
  const HUNDRED_PERCENT = useMemo(() => new BigNumber('1'), [])
  const sortedContract = useSortedTrovesContract(troveInfo.sortedTrovesContractAddr)
  const hintHelperContract = useHintHelperContract(troveInfo.hintHelperContractAddr)
  const troveContract = useTroveManagerContract(troveInfo.troveManagerContractAddr)
  const userDepositAmount = CurrencyAmount.fromAmount(troveInfo.btcToken, amount)
  const userBorrowAmount = CurrencyAmount.fromAmount(troveInfo.stableToken, amount1)
  const userBtcBalance = useCurrencyBalance(account, troveInfo.btcToken || undefined, chainId)

  const [approveState, approve] = useApproveCallback(userDepositAmount, troveInfo.borrowContractAddr)

  const onApprove = async () => {
    if (approveState !== ApprovalState.APPROVED) {
      await approve()
      return
    }
  }

  useEffect(() => {
    if (troveInfo.userCollateralAmount?.greaterThan('0')) {
      setTroveStep(TroveStep.RICKY_TROVE_LIST)
    }
  }, [setTroveStep, troveInfo.userCollateralAmount])

  useEffect(() => {
    if (approveState === ApprovalState.APPROVED) {
      setActiveStep(StepType.STEP_TWO)
    }
  }, [approveState])

  useEffect(() => {
    if (approveState !== ApprovalState.APPROVED) {
      setActiveStep(StepType.STEP_ONE)
    }
  }, [approveState])

  const totalDebt = useMemo(() => {
    if (troveInfo.borrowRate && userBorrowAmount && OPEN_TROVE_FEE) {
      const val = new BigNumber(userBorrowAmount.toExact())
        .times(troveInfo.borrowRate.toExact())
        .plus(userBorrowAmount.toExact())
        .plus(OPEN_TROVE_FEE.toExact())
      return val
    }
    return undefined
  }, [troveInfo.borrowRate, userBorrowAmount, OPEN_TROVE_FEE])

  const collateralRatio = useMemo(() => {
    if (totalDebt && troveInfo.btcPrice && userDepositAmount) {
      const val = new BigNumber(userDepositAmount.toExact()).times(troveInfo.btcPrice.toExact()).div(totalDebt)
      return val
    }
    return undefined
  }, [totalDebt, troveInfo.btcPrice, userDepositAmount])

  const newTCR = useMemo(() => {
    if (userDepositAmount && troveInfo.btcPrice && troveInfo.stableAmount && troveInfo.btcAmount && userBorrowAmount) {
      const val = new BigNumber(troveInfo.btcAmount.toExact())
        .plus(userDepositAmount.toExact())
        .times(troveInfo.btcPrice.toExact())
        .div(new BigNumber(troveInfo.stableAmount.toExact()).plus(userBorrowAmount.toExact()))
      return val
    }
    return undefined
  }, [userDepositAmount, troveInfo.btcPrice, troveInfo.stableAmount, troveInfo.btcAmount, userBorrowAmount])

  const userMaxTCRBorrowStableAmount = useMemo(() => {
    if (userDepositAmount && troveInfo.btcPrice) {
      const val = new BigNumber(userDepositAmount.toExact()).times(troveInfo.btcPrice.toExact()).div(1.1)
      return val
    }
    return undefined
  }, [troveInfo.btcPrice, userDepositAmount])

  const userMaxICRBorrowStableAmount = useMemo(() => {
    if (
      userDepositAmount &&
      troveInfo.btcPrice &&
      troveInfo.stableAmount &&
      troveInfo.borrowRate &&
      OPEN_TROVE_FEE &&
      troveInfo.btcAmount
    ) {
      const res = new BigNumber(troveInfo.btcAmount.toExact())
        .plus(userDepositAmount.toExact())
        .times(troveInfo.btcPrice.toExact())
        .div(1.5)
        .minus(troveInfo.stableAmount.toExact())
        .minus(OPEN_TROVE_FEE.toExact())
        .div(new BigNumber(troveInfo.borrowRate.toExact()).plus(HUNDRED_PERCENT))
      return res
    }
    return undefined
  }, [
    userDepositAmount,
    troveInfo.btcPrice,
    troveInfo.stableAmount,
    troveInfo.borrowRate,
    troveInfo.btcAmount,
    OPEN_TROVE_FEE,
    HUNDRED_PERCENT
  ])

  const isBtnDisable = useMemo(() => {
    if (troveInfo.userDebtAmount && troveInfo.userDebtAmount.greaterThan('0')) return true
    if (!account) return true
    if (approveState !== ApprovalState.APPROVED) return true
    if (activeStep === StepType.STEP_ONE) return true
    if (!amount || !amount1) return true
    if (userDepositAmount && userBtcBalance && userDepositAmount.greaterThan(userBtcBalance)) return true
    if (
      troveInfo.troveSize &&
      troveInfo.maxCollRatio &&
      troveInfo.troveSize.eq('0') &&
      collateralRatio &&
      collateralRatio.lt(troveInfo.maxCollRatio.toExact())
    )
      return true
    if (
      collateralRatio &&
      newTCR &&
      troveInfo.minCollRatio &&
      troveInfo.maxCollRatio &&
      (collateralRatio.lt(troveInfo.minCollRatio.toExact()) || newTCR.lt(troveInfo.maxCollRatio.toExact()))
    )
      return true
    if (
      userBorrowAmount &&
      userMaxTCRBorrowStableAmount &&
      userMaxICRBorrowStableAmount &&
      (userMaxTCRBorrowStableAmount.gt(userMaxICRBorrowStableAmount)
        ? userMaxICRBorrowStableAmount
        : userMaxTCRBorrowStableAmount
      ).lt(userBorrowAmount.toExact())
    )
      return true
    return false
  }, [
    troveInfo.userDebtAmount,
    troveInfo.troveSize,
    troveInfo.maxCollRatio,
    troveInfo.minCollRatio,
    account,
    approveState,
    activeStep,
    amount,
    amount1,
    userDepositAmount,
    userBtcBalance,
    collateralRatio,
    newTCR,
    userBorrowAmount,
    userMaxTCRBorrowStableAmount,
    userMaxICRBorrowStableAmount
  ])

  const expectedFeeRes = useSingleCallResult(
    chainId,
    troveContract,
    'getBorrowingFeeWithDecay',
    [userBorrowAmount?.raw.toString()],
    undefined
  )

  const expectedFee = useMemo(() => {
    if (expectedFeeRes.result) {
      return new BigNumber(expectedFeeRes.result[0].toString())
    }
    return undefined
  }, [expectedFeeRes.result])

  const expectedDebt = useMemo(() => {
    if (expectedFee && troveInfo.liquidationReserve && userBorrowAmount) {
      const val = new BigNumber(userBorrowAmount.toExact()).plus(expectedFee).plus(troveInfo.liquidationReserve)
      return val
    }
    return undefined
  }, [expectedFee, troveInfo.liquidationReserve, userBorrowAmount])

  const NICR = useMemo(() => {
    if (expectedDebt && userDepositAmount) {
      const val = new BigNumber(userDepositAmount.toExact()).times(1e20).div(expectedDebt).times(1e18).toFixed(0)
      return val
    }
    return undefined
  }, [expectedDebt, userDepositAmount])
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
    [
      NICR?.toString(),
      approxHint.result ? approxHint.result[0] : undefined,
      approxHint.result ? approxHint.result[0] : undefined
    ],
    undefined
  )
  const cb = useCallback(() => {
    setTroveStep(TroveStep.RICKY_TROVE_LIST)
  }, [setTroveStep])
  const { runWithModal: openTrove, submitted } = useOpenTrove(boxContractAddr, troveInfo, cb)

  const onConfirm = useCallback(async () => {
    if (
      account &&
      troveInfo.maxCollRatio &&
      troveInfo.minCollRatio &&
      userDepositAmount &&
      collateralRatio &&
      userBorrowAmount &&
      MIN_BORROW_AMOUNT &&
      !userBorrowAmount.lessThan(MIN_BORROW_AMOUNT) &&
      collateralRatio?.gt('0') &&
      insetPosition.result?.[0] &&
      insetPosition.result?.[1] &&
      (troveInfo.isRecoveryMode
        ? collateralRatio.gt(troveInfo.maxCollRatio.toExact())
        : collateralRatio && collateralRatio.gt(troveInfo.minCollRatio.toExact()))
    ) {
      openTrove([
        new BigNumber(5e16).toString(),
        userBorrowAmount.raw.toString(),
        insetPosition.result?.[0].toString(),
        insetPosition.result?.[1].toString(),
        userDepositAmount.raw.toString()
      ])
    }
  }, [
    MIN_BORROW_AMOUNT,
    account,
    collateralRatio,
    insetPosition,
    openTrove,
    troveInfo.isRecoveryMode,
    troveInfo.maxCollRatio,
    troveInfo.minCollRatio,
    userBorrowAmount,
    userDepositAmount
  ])

  const normalModePrice = useMemo(() => {
    return userDepositAmount && totalDebt?.times(1.1).div(userDepositAmount.toExact())
  }, [totalDebt, userDepositAmount])

  const recoveryModePrice = useMemo(() => {
    return amount && userDepositAmount && totalDebt?.times(1.5).div(userDepositAmount.toExact())
  }, [amount, totalDebt, userDepositAmount])

  const overviewList = [
    {
      label: 'Liquidation Reserve',
      value: `200 ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}`,
      tips: "An amount set aside to cover the liquidator's gas costs if your Trove needs to be liquidated. The amount increases your debt and is refunded if you close your Trove by fully paying off its net debt."
    },
    {
      label: 'Borrowing Fee',
      value: `${
        (troveInfo.borrowRate &&
          userBorrowAmount &&
          new BigNumber(userBorrowAmount.toExact()).times(troveInfo.borrowRate.toExact())) ||
        '--'
      } ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} (${troveInfo.borrowRate?.mul(100)?.toFixed(2)}%)`,
      tips: 'This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
    },
    {
      label: 'Total Debt',
      value: `${totalDebt ? formatBigNumber(totalDebt) : '--'} ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}`,
      tips: `The total amount of ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} your Trove will hold.`
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
          {!collateralRatio && <Typography fontSize={20}>--%</Typography>}
          {collateralRatio && troveInfo.maxCollRatio && collateralRatio?.gt(troveInfo.maxCollRatio.toExact()) && (
            <Typography color="#1FC64E" fontSize={20}>
              {collateralRatio.times(100).toFixed(2)}%
            </Typography>
          )}
          {collateralRatio && troveInfo.minCollRatio && collateralRatio.lt(troveInfo.minCollRatio.toExact()) && (
            <Typography color="#D12A1F" fontSize={20}>
              {collateralRatio.times(100).toFixed(2)}%
            </Typography>
          )}
          {collateralRatio &&
            troveInfo.maxCollRatio &&
            troveInfo.minCollRatio &&
            collateralRatio.gt(troveInfo.minCollRatio.toExact()) &&
            collateralRatio.lt(troveInfo.maxCollRatio.toExact()) && (
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
      sx={{
        background: 'var(--ps-neutral2)',
        borderRadius: '12px',
        padding: isMd ? '6px' : '32px 40px'
      }}
    >
      <Stack
        spacing={16}
        sx={{
          background: 'var(--ps-neutral)',
          borderRadius: '12px',
          padding: isMd ? '10px' : '32px 40px'
        }}
      >
        <Stack onClick={() => setTroveStep(TroveStep.RICKY_TROVE_LIST)}>
          <Typography fontSize={24} fontWeight={600}>
            &lt;&nbsp;Open A Trove
          </Typography>
        </Stack>
        <Stack spacing={16}>
          <InputNumerical
            value={amount}
            onChange={e => setAmount(e.target.value)}
            label="Collateral"
            hasBorder
            backgroundColor="transparent"
            outlined
            unit="BBTC"
            balance={userBtcBalance?.toSignificant()}
            onMax={() => {
              if (userBtcBalance) {
                setAmount(userBtcBalance.toExact())
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
            value={amount1}
            label="Borrow"
            hasBorder
            backgroundColor="transparent"
            outlined
            unit={troveInfo.stableToken.symbol?.toLocaleUpperCase()}
            onChange={e => setAmount1(e.target.value)}
            title={troveInfo.stableToken.symbol?.toLocaleUpperCase()}
            endAdornment={
              <>
                <CurrencyLogo currencyOrAddress={troveInfo.stableToken.address} />
                <Typography>{troveInfo.stableToken.symbol?.toLocaleUpperCase()}</Typography>
              </>
            }
          />
          <Stack spacing={16} width={'100%'}>
            <Typography fontSize={20}>Transaction Overview</Typography>
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
                  key={index}
                  direction={'column'}
                  justifyContent={'flex-start'}
                  p={12}
                  sx={{
                    background: '#FFFFFF1A',
                    borderRadius: '4px'
                  }}
                >
                  <ItemWithTooltip text={item.label} title={item.tips} />
                  <Typography fontSize={20}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          {troveInfo.userDebtAmount && troveInfo.userDebtAmount.greaterThan('0') && (
            <WarningTips text={`You have already opened a trove.`} />
          )}
          {(!amount || amount === '0') && (
            <WarningTips text={`Start by entering the amount of BBTC you'd like to deposit as collateral.`} />
          )}
          {amount !== '0' && userBorrowAmount && MIN_BORROW_AMOUNT && userBorrowAmount.lessThan(MIN_BORROW_AMOUNT) && (
            <ErrorTips text={`You must borrow at least 1800 ${troveInfo.stableToken.symbol?.toLocaleUpperCase()}.`} />
          )}
          {userDepositAmount && userBtcBalance && userDepositAmount.greaterThan(userBtcBalance) && (
            <ErrorTips text={`The amount you're trying to deposit exceeds your balance.`} />
          )}
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
            troveInfo.maxCollRatio &&
            troveInfo.isRecoveryMode &&
            collateralRatio.lt(troveInfo.maxCollRatio.toExact()) && (
              <ErrorTips text={`Collateral Ratio must be at least 150%.`} />
            )}
          {amount !== '0' &&
            amount1 !== '0' &&
            collateralRatio &&
            troveInfo.minCollRatio &&
            !troveInfo.isRecoveryMode &&
            collateralRatio.lt(troveInfo.minCollRatio.toExact()) && (
              <WarningTips
                text={`Keeping your Collateral Ratio above 110% can help avoid liquidation under Recovery Mode.`}
              />
            )}
          {amount !== '0' &&
            amount1 !== '0' &&
            collateralRatio &&
            troveInfo.minCollRatio &&
            !troveInfo.isRecoveryMode &&
            collateralRatio.lt(troveInfo.minCollRatio.toExact()) && (
              <ErrorTips text={`Collateral Ratio must be at least 110%.`} />
            )}
          {troveInfo.troveSize &&
            troveInfo.troveSize?.eq('0') &&
            collateralRatio &&
            troveInfo.maxCollRatio &&
            collateralRatio.lt(troveInfo.maxCollRatio.toExact()) && (
              <ErrorTips text={`Collateral Ratio must be at least 150%.`} />
            )}
          {((collateralRatio &&
            newTCR &&
            troveInfo.minCollRatio &&
            troveInfo.maxCollRatio &&
            (collateralRatio?.lt(troveInfo.minCollRatio.toExact()) || newTCR?.lt(troveInfo.maxCollRatio.toExact()))) ||
            (userBorrowAmount &&
              userMaxTCRBorrowStableAmount &&
              userMaxTCRBorrowStableAmount &&
              (userMaxTCRBorrowStableAmount.gt(userMaxTCRBorrowStableAmount)
                ? userMaxTCRBorrowStableAmount
                : userMaxTCRBorrowStableAmount && userMaxTCRBorrowStableAmount
              ).lt(userBorrowAmount.toExact()))) &&
            userDepositAmount &&
            userDepositAmount.equalTo('0') && (
              <ErrorTips
                text={`You can not open trove right now, the maximum of ${troveInfo.stableToken.symbol?.toLocaleUpperCase()} you can borrow is ${
                  userMaxTCRBorrowStableAmount &&
                  userMaxTCRBorrowStableAmount &&
                  userMaxTCRBorrowStableAmount.gt(userMaxTCRBorrowStableAmount)
                    ? userMaxTCRBorrowStableAmount.toFixed(0, BigNumber.ROUND_DOWN)
                    : userMaxTCRBorrowStableAmount && userMaxTCRBorrowStableAmount.toFixed(0, BigNumber.ROUND_DOWN)
                }.`}
              />
            )}
          <Stack direction={'row'} spacing={16}>
            <Button
              sx={{ width: '50%' }}
              variant="contained"
              disabled={approveState === ApprovalState.APPROVED || !amount || !amount1}
              onClick={onApprove}
            >
              Approve BBTC
            </Button>
            <LoadingButton
              sx={{ width: '50%' }}
              variant="contained"
              loading={submitted.pending}
              disabled={isBtnDisable}
              onClick={onConfirm}
            >
              Confirm
            </LoadingButton>
          </Stack>
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={6}>
            <StepCom index={0} active={!!(amount && amount1)}></StepCom>
            <Stack sx={{ width: '240px', border: '0.5px solid #fff' }}></Stack>
            <StepCom index={1} active={activeStep === StepType.STEP_TWO}></StepCom>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
