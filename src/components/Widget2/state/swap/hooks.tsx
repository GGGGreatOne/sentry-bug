import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Field } from '../../components/swap/constants'
import useAutoSlippageTolerance from '../../hooks/useAutoSlippageTolerance'
import { useDebouncedTrade } from '../../hooks/useDebouncedTrade'
import { useSwapTaxes } from '../../hooks/useSwapTaxes'
import { useUSDPrice } from '../../hooks/useUSDPrice'
import tryParseCurrencyAmount from '../../lib/utils/tryParseCurrencyAmount'
import { ReactNode, useCallback, useMemo } from 'react'
import { InterfaceTrade, TradeState } from '../../state/routing/types'
import { isClassicTrade, isSubmittableTrade, isUniswapXTrade } from '../routing/utils'
import { useUserSlippageToleranceWithDefault } from '../user/hooks'
import { CurrencyState, SwapState, useSwapAndLimitContext, useSwapContext } from './SwapContext'
import { useActiveWeb3React } from 'hooks'
import { useConnectionReady } from 'components/Widget2/connection/eagerlyConnect'
import { useCurrencyBalances } from 'components/Widget2/lib/hooks/useCurrencyBalance'

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: (options: { newOutputHasTax: boolean; previouslyEstimatedOutput: string }) => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const { swapState, setSwapState } = useSwapContext()
  const { currencyState, setCurrencyState } = useSwapAndLimitContext()

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      const [currentCurrencyKey, otherCurrencyKey]: (keyof CurrencyState)[] =
        field === Field.INPUT ? ['inputCurrency', 'outputCurrency'] : ['outputCurrency', 'inputCurrency']
      // the case where we have to swap the order
      if (currency === currencyState[otherCurrencyKey]) {
        setCurrencyState({
          [currentCurrencyKey]: currency,
          [otherCurrencyKey]: currencyState[currentCurrencyKey]
        })
        setSwapState(swapState => ({
          ...swapState,
          independentField: swapState.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
        }))
      } else {
        setCurrencyState(state => ({
          ...state,
          [currentCurrencyKey]: currency
        }))
      }
    },
    [currencyState, setCurrencyState, setSwapState]
  )

  const onSwitchTokens = useCallback(
    ({
      newOutputHasTax,
      previouslyEstimatedOutput
    }: {
      newOutputHasTax: boolean
      previouslyEstimatedOutput: string
    }) => {
      // To prevent swaps with FOT tokens as exact-outputs, we leave it as an exact-in swap and use the previously estimated output amount as the new exact-in amount.
      if (newOutputHasTax && swapState.independentField === Field.INPUT) {
        setSwapState(swapState => ({
          ...swapState,
          typedValue: previouslyEstimatedOutput
        }))
      } else {
        setSwapState(prev => ({
          ...prev,
          independentField: prev.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
        }))
      }

      setCurrencyState(prev => ({
        inputCurrency: prev.outputCurrency,
        outputCurrency: prev.inputCurrency
      }))
    },
    [setCurrencyState, setSwapState, swapState.independentField]
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSwapState(state => {
        return {
          ...state,
          independentField: field,
          typedValue
        }
      })
    },
    [setSwapState]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput
  }
}

export type SwapInfo = {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  inputTax: Percent
  outputTax: Percent
  outputFeeFiatValue?: number
  parsedAmount?: CurrencyAmount<Currency>
  inputError?: ReactNode
  trade: {
    trade?: InterfaceTrade
    state: TradeState
    uniswapXGasUseEstimateUSD?: number
    error?: any
    swapQuoteLatency?: number
  }
  allowedSlippage: Percent
  autoSlippage: Percent
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(state: SwapState): SwapInfo {
  const { account } = useActiveWeb3React()

  const {
    currencyState: { inputCurrency, outputCurrency }
  } = useSwapAndLimitContext()
  const { independentField, typedValue } = state

  const { inputTax, outputTax } = useSwapTaxes(
    inputCurrency?.isToken ? inputCurrency.address : undefined,
    outputCurrency?.isToken ? outputCurrency.address : undefined
  )

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  )

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )

  const trade = useDebouncedTrade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmount,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    undefined,
    account
  )

  const { data: outputFeeFiatValue } = useUSDPrice(
    isSubmittableTrade(trade.trade) && trade.trade.swapFee
      ? CurrencyAmount.fromRawAmount(trade.trade.outputAmount.currency, trade.trade.swapFee.amount)
      : undefined,
    trade.trade?.outputAmount.currency
  )

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1]
    }),
    [relevantTokenBalances]
  )

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency
    }),
    [inputCurrency, outputCurrency]
  )

  // allowed slippage for classic trades is either auto slippage, or custom user defined slippage if auto slippage disabled
  const classicAutoSlippage = useAutoSlippageTolerance(isClassicTrade(trade.trade) ? trade.trade : undefined)

  // slippage for uniswapx trades is defined by the quote response
  const uniswapXAutoSlippage = isUniswapXTrade(trade.trade) ? trade.trade.slippageTolerance : undefined

  // Uniswap interface recommended slippage amount
  const autoSlippage = uniswapXAutoSlippage ?? classicAutoSlippage
  const classicAllowedSlippage = useUserSlippageToleranceWithDefault(autoSlippage)

  // slippage amount used to submit the trade
  const allowedSlippage = uniswapXAutoSlippage ?? classicAllowedSlippage

  const connectionReady = useConnectionReady()
  const inputError = useMemo(() => {
    let inputError: ReactNode | undefined

    if (!account) {
      inputError = connectionReady ? 'Connect wallet' : 'Connecting wallet...'
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? 'Select a token'
    }

    if (!parsedAmount) {
      inputError = inputError ?? 'Enter an amount'
    }

    // compare input balance to max input based on version
    const [balanceIn, maxAmountIn] = [currencyBalances[Field.INPUT], trade?.trade?.maximumAmountIn(allowedSlippage)]

    if (balanceIn && maxAmountIn && balanceIn.lessThan(maxAmountIn)) {
      inputError = `Insufficient ${
        balanceIn.currency.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : balanceIn.currency.symbol
      } balance`
    }

    return inputError
  }, [account, currencies, parsedAmount, currencyBalances, trade?.trade, allowedSlippage, connectionReady])

  return useMemo(
    () => ({
      currencies,
      currencyBalances,
      parsedAmount,
      inputError,
      trade,
      autoSlippage,
      allowedSlippage,
      outputFeeFiatValue,
      inputTax,
      outputTax
    }),
    [
      allowedSlippage,
      autoSlippage,
      currencies,
      currencyBalances,
      inputError,
      outputFeeFiatValue,
      parsedAmount,
      trade,
      inputTax,
      outputTax
    ]
  )
}
