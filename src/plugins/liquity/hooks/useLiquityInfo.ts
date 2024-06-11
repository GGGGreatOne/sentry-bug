import { useActiveWeb3React } from 'hooks'
import { SupportedChainId } from 'constants/chains'
import { useSingleCallResult } from 'hooks/multicall'
import { useMemo } from 'react'
import { Currency, CurrencyAmount } from 'constants/token'
import {
  useActivePoolContract,
  useBorrowerContract,
  useDefaultPoolContract,
  usePriceFeedContract,
  useSortedTrovesContract,
  useStabilityPoolContract,
  useTroveFactoryContract,
  useTroveManagerContract
} from './useContract'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import BigNumber from 'bignumber.js'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { useTokenContract } from 'hooks/useContract'

export enum TroveStep {
  RICKY_TROVE_LIST,
  OPEN_TROVE,
  ADJUST_TROVE,
  CLOSE_TROVE
}

export interface StabilityPoolInfoProps {
  stabilityPoolContractAddr: string | undefined
  userSupplyAmount: CurrencyAmount | undefined
  userWithdrawableAmount: CurrencyAmount | undefined
  userSupplyRewardAmount: CurrencyAmount | undefined
  userLiquidationRewardAmount: CurrencyAmount | undefined
  stableCoinAmountInStabilityPool: CurrencyAmount | undefined
}
export interface TroveInfoProps {
  borrowContractAddr?: string
  activePoolContractAddr?: string
  defaultPoolContractAddr?: string
  hintHelperContractAddr?: string
  sortedTrovesContractAddr?: string
  priceFeedContractAddr?: string
  troveManagerContractAddr?: string
  btcToken: Currency
  stableToken: Currency
  sysTotalDebt?: CurrencyAmount
  sysTotalColl?: CurrencyAmount
  minCollRatio?: CurrencyAmount
  maxCollRatio?: CurrencyAmount
  userBtcBalance?: CurrencyAmount
  userStableTokenBalance?: CurrencyAmount
  btcAmount?: CurrencyAmount
  stableAmount?: CurrencyAmount
  userDebtAmount?: CurrencyAmount
  userCollateralAmount?: CurrencyAmount
  btcPrice?: CurrencyAmount
  userCollateralRatio?: CurrencyAmount
  isRecoveryMode?: boolean
  troveSize?: BigNumber
  borrowRate?: CurrencyAmount
  TCR?: BigNumber
  liquidationReserve?: BigNumber
}
export function useLiquityInfo(
  btcTokenAddr?: string,
  _stableTokenAddress?: string,
  borrowContractAddr?: string,
  activePoolContractAddr?: string,
  defaultPoolContractAddr?: string,
  hintHelperContractAddr?: string,
  sortedTrovesContractAddr?: string,
  priceFeedContractAddr?: string,
  troveManagerContractAddr?: string
) {
  const { chainId, account } = useActiveWeb3React()
  const borrowContract = useBorrowerContract(borrowContractAddr)
  const activePoolContract = useActivePoolContract(activePoolContractAddr)
  const defaultPoolContract = useDefaultPoolContract(defaultPoolContractAddr)
  const sortedTrovesContract = useSortedTrovesContract(sortedTrovesContractAddr)
  const priceFeedContract = usePriceFeedContract(priceFeedContractAddr)
  const troveManagerContract = useTroveManagerContract(troveManagerContractAddr)
  const _btcToken = useToken(btcTokenAddr || '', chainId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const btcToken = new Currency(
    chainId ? chainId : SupportedChainId.BB_MAINNET,
    btcTokenAddr || '',
    _btcToken?.decimals || 18,
    _btcToken?.symbol,
    _btcToken?.name
  )
  const minCollRatio = CurrencyAmount.fromAmount(btcToken, '1.1')
  const maxCollRatio = CurrencyAmount.fromAmount(btcToken, '1.5')
  const _stableToken = useToken(_stableTokenAddress || '', chainId)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableToken = new Currency(
    chainId ? chainId : SupportedChainId.BB_MAINNET,
    _stableTokenAddress || '',
    _stableToken?.decimals || 18,
    _stableToken?.symbol,
    _stableToken?.name
  )
  const userBtcBalance = useCurrencyBalance(account, btcToken)
  const userStableTokenBalance = useCurrencyBalance(account, stableToken)
  const activePoolDebtRes = useSingleCallResult(chainId, activePoolContract, 'getSTABLEDebt', undefined, undefined)
  const activePoolCollRes = useSingleCallResult(chainId, activePoolContract, 'getETH', undefined, undefined)
  const defaultPoolDebtRes = useSingleCallResult(chainId, defaultPoolContract, 'getSTABLEDebt', undefined, undefined)
  const defaultPoolCollRes = useSingleCallResult(chainId, defaultPoolContract, 'getETH', undefined, undefined)
  const oraclePriceRes = useSingleCallResult(chainId, priceFeedContract, 'lastGoodPrice', undefined, undefined)
  console.log('🚀 ~ priceFeedContract:', priceFeedContract?.address)

  const TCRRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'getTCR',
    [oraclePriceRes?.result?.[0].toString()],
    undefined
  )
  const userCollateralRatioRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'getCurrentICR',
    [account, oraclePriceRes?.result?.[0].toString()],
    undefined
  )
  // const closeTroveAmountRes = useSingleCallResult(chainId, troveManagerContract, 'getTroveDebt', [account], undefined)
  const btcAmountRes = useSingleCallResult(chainId, borrowContract, 'getEntireSystemColl', undefined, undefined)
  const stableAmountRes = useSingleCallResult(chainId, borrowContract, 'getEntireSystemDebt', undefined, undefined)
  const borrowRateRes = useSingleCallResult(chainId, troveManagerContract, 'getBorrowingRate', undefined, undefined)
  const troveSizeRes = useSingleCallResult(chainId, sortedTrovesContract, 'getSize', undefined, undefined)
  const checkRecoveryModeRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'checkRecoveryMode',
    [oraclePriceRes.result ? oraclePriceRes?.result[0].toString() : undefined],
    undefined
  )
  const liquidationReserveRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'STABLE_GAS_COMPENSATION',
    undefined,
    undefined
  )
  const userDebtAmountRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'getEntireDebtAndColl',
    [account],
    undefined
  )
  const userCollAmountRes = useSingleCallResult(chainId, troveManagerContract, 'getTroveColl', [account], undefined)
  const userPendingCollAmountRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'getPendingETHReward',
    [account],
    undefined
  )
  const sysTotalDebt = useMemo(() => {
    if (activePoolDebtRes.result && defaultPoolDebtRes.result && stableToken) {
      const ca0 = CurrencyAmount.fromRawAmount(stableToken, activePoolDebtRes.result[0].toString())
      const ca1 = CurrencyAmount.fromRawAmount(stableToken, defaultPoolDebtRes.result[0].toString())
      return ca0.add(ca1)
    }
    return undefined
  }, [activePoolDebtRes.result, defaultPoolDebtRes.result, stableToken])
  const sysTotalColl = useMemo(() => {
    if (activePoolCollRes.result && defaultPoolCollRes.result && btcToken) {
      const ca0 = CurrencyAmount.fromRawAmount(stableToken, activePoolCollRes.result[0].toString())
      const ca1 = CurrencyAmount.fromRawAmount(stableToken, defaultPoolCollRes.result[0].toString())
      return ca0.add(ca1)
    }
    return undefined
  }, [activePoolCollRes.result, btcToken, defaultPoolCollRes.result, stableToken])
  const userCollateralAmount = useMemo(() => {
    if (userCollAmountRes.result && userPendingCollAmountRes.result) {
      return CurrencyAmount.fromRawAmount(
        btcToken,
        new BigNumber(userCollAmountRes.result[0].toString())
          .plus(userPendingCollAmountRes.result[0].toString())
          .toString()
      )
    }
    return undefined
  }, [btcToken, userCollAmountRes.result, userPendingCollAmountRes.result])
  const troveInfo: TroveInfoProps = useMemo(() => {
    return {
      borrowContractAddr,
      activePoolContractAddr,
      defaultPoolContractAddr,
      hintHelperContractAddr,
      sortedTrovesContractAddr,
      priceFeedContractAddr,
      troveManagerContractAddr,
      btcToken,
      stableToken,
      sysTotalDebt,
      sysTotalColl,
      minCollRatio,
      maxCollRatio,
      userBtcBalance,
      userStableTokenBalance,
      btcAmount: btcAmountRes.result
        ? CurrencyAmount.fromRawAmount(btcToken, btcAmountRes.result[0].toString())
        : undefined,
      stableAmount: stableAmountRes.result
        ? CurrencyAmount.fromRawAmount(stableToken, stableAmountRes.result[0].toString())
        : undefined,
      userDebtAmount: userDebtAmountRes.result
        ? CurrencyAmount.fromRawAmount(stableToken, userDebtAmountRes.result[0].toString())
        : undefined,
      userCollateralAmount,
      btcPrice: oraclePriceRes.result
        ? CurrencyAmount.fromRawAmount(btcToken, oraclePriceRes.result[0].toString())
        : undefined,
      userCollateralRatio: userCollateralRatioRes.result
        ? CurrencyAmount.fromRawAmount(btcToken, userCollateralRatioRes.result[0].toString())
        : undefined,
      isRecoveryMode: checkRecoveryModeRes.result ? checkRecoveryModeRes.result[0] : undefined,
      troveSize: troveSizeRes.result ? new BigNumber(troveSizeRes.result[0].toString()) : undefined,
      borrowRate: borrowRateRes.result ? CurrencyAmount.ether(borrowRateRes.result[0].toString()) : undefined,
      TCR: TCRRes.result ? new BigNumber(TCRRes.result[0].toString()) : undefined,
      liquidationReserve: liquidationReserveRes.result
        ? new BigNumber(liquidationReserveRes.result[0].toString())
        : undefined
    }
  }, [
    TCRRes.result,
    activePoolContractAddr,
    borrowContractAddr,
    borrowRateRes.result,
    btcAmountRes.result,
    btcToken,
    checkRecoveryModeRes.result,
    defaultPoolContractAddr,
    hintHelperContractAddr,
    liquidationReserveRes.result,
    maxCollRatio,
    minCollRatio,
    oraclePriceRes.result,
    priceFeedContractAddr,
    sortedTrovesContractAddr,
    stableAmountRes.result,
    stableToken,
    sysTotalColl,
    sysTotalDebt,
    troveManagerContractAddr,
    troveSizeRes.result,
    userBtcBalance,
    userCollateralAmount,
    userCollateralRatioRes.result,
    userDebtAmountRes.result,
    userStableTokenBalance
  ])
  return troveInfo
}

export function useStabilityPoolInfo(
  stabilityPoolContractAddr?: string,
  stableToken?: Currency | null,
  btcToken?: Currency
) {
  const { chainId, account } = useActiveWeb3React()
  const stabilityPoolContract = useStabilityPoolContract(stabilityPoolContractAddr)
  const stableTokenContract = useTokenContract(stableToken?.address)
  const userSupplyAmountRes = useSingleCallResult(chainId, stabilityPoolContract, 'deposits', [account], undefined)
  const userWithdrawableAmountRes = useSingleCallResult(
    chainId,
    stabilityPoolContract,
    'getCompoundedSTABLEDeposit',
    [account],
    undefined
  )
  const userSupplyRewardAmountRes = useSingleCallResult(
    chainId,
    stabilityPoolContract,
    'getDepositorSYSGain',
    [account],
    undefined
  )
  const userLiquidationRewardAmountRes = useSingleCallResult(
    chainId,
    stabilityPoolContract,
    'getDepositorETHGain',
    [account],
    undefined
  )
  const stableCoinAmountInStabilityPoolRes = useSingleCallResult(
    chainId,
    stableTokenContract,
    'balanceOf',
    [stabilityPoolContract?.address],
    undefined
  )
  const stabilityPoolInfo: StabilityPoolInfoProps = useMemo(() => {
    return {
      stabilityPoolContractAddr,
      userSupplyAmount:
        userSupplyAmountRes.result && stableToken
          ? CurrencyAmount.fromRawAmount(stableToken, userSupplyAmountRes.result[0].toString())
          : undefined,
      userWithdrawableAmount:
        userWithdrawableAmountRes.result && stableToken
          ? CurrencyAmount.fromRawAmount(stableToken, userWithdrawableAmountRes.result[0].toString())
          : undefined,
      userSupplyRewardAmount:
        userSupplyRewardAmountRes.result && btcToken
          ? CurrencyAmount.fromRawAmount(btcToken, userSupplyRewardAmountRes.result[0].toString())
          : undefined,
      userLiquidationRewardAmount:
        userLiquidationRewardAmountRes.result && btcToken
          ? CurrencyAmount.fromRawAmount(btcToken, userLiquidationRewardAmountRes.result[0].toString())
          : undefined,
      stableCoinAmountInStabilityPool:
        stableCoinAmountInStabilityPoolRes.result && stableToken
          ? CurrencyAmount.fromRawAmount(stableToken, stableCoinAmountInStabilityPoolRes.result[0].toString())
          : undefined
    }
  }, [
    btcToken,
    stabilityPoolContractAddr,
    stableCoinAmountInStabilityPoolRes.result,
    stableToken,
    userLiquidationRewardAmountRes.result,
    userSupplyAmountRes.result,
    userSupplyRewardAmountRes.result,
    userWithdrawableAmountRes.result
  ])
  return stabilityPoolInfo
}

export function useOpenTrove(contractAddr?: string, troveInfo?: TroveInfoProps, cb?: () => void) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)
  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'openTrove',
      toData: undefined
    },
    {
      summary: 'You opened a trove',
      action: 'openTrove_open_a_trove',
      successTipsText: 'You have successfully opened a trove',
      onSuccess: cb
    }
  )
}

export function useAdjustTrove(contractAddr?: string, troveInfo?: TroveInfoProps) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)

  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'adjustTrove',
      toData: []
    },
    {
      summary: 'You adjusted your trove',
      action: 'adjustTrove_adjust_your_trove',
      successTipsText: 'Your trove has been adjusted successfully'
    }
  )
}

export function useAdjustTroveByRepayStable(contractAddr?: string, troveInfo?: TroveInfoProps) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)

  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'repaySTABLE',
      toData: []
    },
    {
      summary: 'You adjusted your trove',
      action: 'adjustTrove_adjust_your_trove',
      successTipsText: 'Your trove has been adjusted successfully'
    }
  )
}

export function useAdjustTroveByWithdrawStable(contractAddr?: string, troveInfo?: TroveInfoProps) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)

  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'withdrawSTABLE',
      toData: []
    },
    {
      summary: 'You adjusted your trove',
      action: 'adjustTrove_adjust_your_trove',
      successTipsText: 'Your trove has been adjusted successfully'
    }
  )
}

export function useAdjustTroveByWithdrawColl(contractAddr?: string, troveInfo?: TroveInfoProps) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)

  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'withdrawColl',
      toData: []
    },
    {
      summary: 'You adjusted your trove',
      action: 'adjustTrove_adjust_your_trove',
      successTipsText: 'Your trove has been adjusted successfully'
    }
  )
}

export function useAdjustTroveByAddColl(contractAddr?: string, troveInfo?: TroveInfoProps) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)

  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'addColl',
      toData: []
    },
    {
      summary: 'You adjusted your trove',
      action: 'adjustTrove_adjust_your_trove',
      successTipsText: 'Your trove has been adjusted successfully'
    }
  )
}

export function useCloseTrove(cb: () => void, contractAddr?: string, troveInfo?: TroveInfoProps) {
  const borrowContract = useBorrowerContract(troveInfo?.borrowContractAddr)
  return useBoxExecute(
    contractAddr,
    {
      toContract: borrowContract,
      toFunc: 'closeTrove',
      toData: undefined
    },
    {
      summary: 'You closed your trove',
      action: 'closeTrove_close_your_trove',
      successTipsText: 'Your trove has been closed',
      onSuccess: cb
    }
  )
}

export function useClaimStabilityPoolReward(contractAddr?: string, stabilityPoolInfo?: StabilityPoolInfoProps) {
  const contract = useStabilityPoolContract(stabilityPoolInfo?.stabilityPoolContractAddr)
  return useBoxExecute(
    contractAddr,
    {
      toContract: contract,
      toFunc: 'withdrawFromSP',
      toData: []
    },
    {
      summary: `You claimed liquidation reward`,
      action: 'withdrawFromSP_claim_reward',
      successTipsText: 'You have claimed your reward'
    }
  )
}

export function useClaimStabilityPoolRewardAndDeposit(
  contractAddr?: string,
  stabilityPoolInfo?: StabilityPoolInfoProps
) {
  const contract = useStabilityPoolContract(stabilityPoolInfo?.stabilityPoolContractAddr)
  return useBoxExecute(
    contractAddr,
    {
      toContract: contract,
      toFunc: 'withdrawETHGainToTrove',
      toData: []
    },
    {
      summary: `You claimed liquidation reward and move into your trove`,
      action: 'withdrawETHGainToTrove_claim_reward',
      successTipsText: 'You have claimed your reward and move into your trove'
    }
  )
}

export function useUserStakeStablecoin(
  contractAddr?: string,
  stabilityPoolInfo?: StabilityPoolInfoProps,
  cb?: () => void
) {
  const contract = useStabilityPoolContract(stabilityPoolInfo?.stabilityPoolContractAddr)
  return useBoxExecute(
    contractAddr,
    {
      toContract: contract,
      toFunc: 'provideToSP',
      toData: []
    },
    {
      summary: `You staked stablecoin`,
      action: 'provideToSP_stake_stablecoin',
      successTipsText: 'You have successfully staked your stablecoin',
      onSuccess: cb
    }
  )
}

export function useUserWithdrawStablecoin(
  contractAddr?: string,
  stabilityPoolInfo?: StabilityPoolInfoProps,
  cb?: () => void
) {
  const contract = useStabilityPoolContract(stabilityPoolInfo?.stabilityPoolContractAddr)
  return useBoxExecute(
    contractAddr,
    {
      toContract: contract,
      toFunc: 'withdrawFromSP',
      toData: []
    },
    {
      summary: `You withdrew stablecoin`,
      action: 'withdrawFromSP_withdraw_stablecoin',
      successTipsText: 'You have successfully withdrawn your stablecoin',
      onSuccess: cb
    }
  )
}

export interface TroveContractInfoProps {
  btcTokenAddr?: string
  activePoolContractAddr?: string
  stabilityPoolContractAddr?: string
  borrowContractAddr?: string
  troveManagerContractAddr?: string
  priceFeedContractAddr?: string
  defaultPoolContractAddr?: string
  stableTokenAddr?: string
  sortedTrovesContractAddr?: string
  hintHelperContractAddr?: string
}

export function useQueryStablecoinContractAddr(troveFactoryAddr: string, boxContractAddr?: string) {
  const { chainId } = useActiveWeb3React()
  const contract = useTroveFactoryContract(troveFactoryAddr)
  const res = useSingleCallResult(chainId, contract, 'stablecoins', [boxContractAddr], undefined)
  const troveContractInfo: TroveContractInfoProps = useMemo(() => {
    return {
      btcTokenAddr: res.result ? res.result.backedToken : undefined,
      activePoolContractAddr: res.result ? res.result.activePool : undefined,
      stabilityPoolContractAddr: res.result ? res.result.stabilityPool : undefined,
      borrowContractAddr: res.result ? res.result.borrowerOperations : undefined,
      troveManagerContractAddr: res.result ? res.result.troveManager : undefined,
      priceFeedContractAddr: res.result ? res.result.priceFeed : undefined,
      defaultPoolContractAddr: res.result ? res.result.defaultPool : undefined,
      stableTokenAddr: res.result ? res.result.stableToken : undefined,
      sortedTrovesContractAddr: res.result ? res.result.sortedTroves : undefined,
      hintHelperContractAddr: res.result ? res.result.hintHelpers : undefined
    }
  }, [res.result])
  return troveContractInfo
}
