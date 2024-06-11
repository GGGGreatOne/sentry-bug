import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { AutoColumn } from '../components/Column'
import { ConfirmSwapModal } from '../components/swap/ConfirmSwapModal'
import WrapSubmitModal from '../components/swap/ConfirmSwapModal/WrapSubmitModal'
import SwapCurrencyInputPanel from '../components/CurrencyInputPanel/SwapCurrencyInputPanel'
import confirmPriceImpactWithoutFee from '../components/swap/confirmPriceImpactWithoutFee'
import { Field } from '../components/swap/constants'
import PriceImpactModal from '../components/swap/PriceImpactModal'
import PriceImpactWarning from '../components/swap/PriceImpactWarning'
import { ArrowWrapper, OutputSwapSection, SwapSection } from '../components/swap/styled'
import SwapDetailsDropdown from '../components/swap/SwapDetailsDropdown'
// import TokenSafetyModal from '../components/TokenSafety/TokenSafetyModal'
import { isSupportedChain } from '../constants/chains'
import { useIsSwapUnsupported } from '../hooks/useIsSwapUnsupported'
import { useMaxAmountIn } from '../hooks/useMaxAmountIn'
import usePermit2Allowance, { AllowanceState } from '../hooks/usePermit2Allowance'
import usePrevious from 'hooks/usePrevious'
import { SwapResult, useSwapCallback } from '../hooks/useSwapCallback'
import { useUSDPrice } from '../hooks/useUSDPrice'
import useWrapCallback, { WrapErrorText, WrapType } from '../hooks/useWrapCallback'
import JSBI from 'jsbi'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { InterfaceTrade, TradeState } from '../state/routing/types'
import { isClassicTrade } from '../state/routing/utils'
import { useSwapActionHandlers } from '../state/swap/hooks'
import { CurrencyState, useSwapAndLimitContext, useSwapContext } from '../state/swap/SwapContext'
import { ThemedText } from '../theme/components'
import { computeFiatValuePriceImpact } from '../utils/computeFiatValuePriceImpact'
import { NumberType, useFormatter } from '../utils/formatNumbers'
import { maxAmountSpend } from '../utils/maxAmountSpend'
import { largerPercentValue } from '../utils/percent'
import { computeRealizedPriceImpact, warningSeverity } from '../utils/prices'
import { didUserReject } from '../utils/swapErrorToUserReadableMessage'
import { useConnectionReady } from '../connection/eagerlyConnect'
import { getIsReviewableQuote } from '.'
import { OutputTaxTooltipBody } from './TaxTooltipBody'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import { Box, Button } from '@mui/material'
import { SwitchCircle } from '../components/swap/SwitchCircle'
import AppBody from '../AppBody'
import ActionButton from 'components/Widget/component/Button/ActionButton'
import { SwapMapping } from 'api/swap'

const SWAP_FORM_CURRENCY_SEARCH_FILTERS = {
  showCommonBases: true
}

interface SwapFormProps {
  boxId: string
  disableTokenInputs?: boolean
  onCurrencyChange?: (selected: CurrencyState) => void
}

export function SwapForm({ boxId, disableTokenInputs = false, onCurrencyChange }: SwapFormProps) {
  const connectionReady = useConnectionReady()
  const { account, chainId: connectedChainId } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  const { chainId, prefilledState, currencyState } = useSwapAndLimitContext()
  const { swapState, setSwapState, derivedSwapInfo } = useSwapContext()
  const { typedValue, independentField } = swapState

  // const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const [showPriceImpactModal, setShowPriceImpactModal] = useState<boolean>(false)

  // const handleConfirmTokenWarning = useCallback(() => {
  //   setDismissTokenWarning(true)
  // }, [])

  const {
    trade: { state: tradeState, trade },
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    outputFeeFiatValue,
    inputTax,
    outputTax
  } = derivedSwapInfo

  const [inputTokenHasTax, outputTokenHasTax] = useMemo(
    () => [!inputTax.equalTo(0), !outputTax.equalTo(0)],
    [inputTax, outputTax]
  )

  useEffect(() => {
    // Force exact input if the user switches to an output token with tax
    if (outputTokenHasTax && independentField === Field.OUTPUT) {
      setSwapState(state => ({
        ...state,
        independentField: Field.INPUT,
        typedValue: ''
      }))
    }
  }, [independentField, outputTokenHasTax, setSwapState, trade?.outputAmount])

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const showFiatValueInput = Boolean(parsedAmounts[Field.INPUT])
  const showFiatValueOutput = Boolean(parsedAmounts[Field.OUTPUT])
  const getSingleUnitAmount = (currency?: Currency) => {
    if (!currency) return
    return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(10 ** currency.decimals))
  }

  const fiatValueInput = useUSDPrice(
    parsedAmounts[Field.INPUT] ?? getSingleUnitAmount(currencies[Field.INPUT]),
    currencies[Field.INPUT]
  )
  const fiatValueOutput = useUSDPrice(
    parsedAmounts[Field.OUTPUT] ?? getSingleUnitAmount(currencies[Field.OUTPUT]),
    currencies[Field.OUTPUT]
  )

  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [
      tradeState === TradeState.NO_ROUTE_FOUND,
      tradeState === TradeState.LOADING,
      tradeState === TradeState.LOADING && Boolean(trade)
    ],
    [trade, tradeState]
  )

  const fiatValueTradeInput = useUSDPrice(trade?.inputAmount)
  const fiatValueTradeOutput = useUSDPrice(trade?.outputAmount)
  const preTaxFiatValueTradeOutput = useUSDPrice(trade?.outputAmount)
  const [stablecoinPriceImpact, preTaxStablecoinPriceImpact] = useMemo(
    () =>
      routeIsSyncing || !isClassicTrade(trade) || showWrap
        ? [undefined, undefined]
        : [
            computeFiatValuePriceImpact(fiatValueTradeInput.data, fiatValueTradeOutput.data),
            computeFiatValuePriceImpact(fiatValueTradeInput.data, preTaxFiatValueTradeOutput.data)
          ],
    [fiatValueTradeInput, fiatValueTradeOutput, preTaxFiatValueTradeOutput, routeIsSyncing, trade, showWrap]
  )

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapError, swapResult }, setSwapFormState] = useState<{
    showConfirm: boolean
    tradeToConfirm?: InterfaceTrade
    swapError?: Error
    swapResult?: SwapResult
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    swapError: undefined,
    swapResult: undefined
  })

  const [{ showWrapConfirm, wrapToConfirm, wrapError, wrapResult, txHash }, setWrapFormState] = useState<{
    showWrapConfirm: boolean
    wrapToConfirm?: InterfaceTrade
    wrapError?: Error
    wrapResult?: SwapResult
    txHash?: string
  }>({
    showWrapConfirm: false,
    wrapToConfirm: undefined,
    wrapError: undefined,
    wrapResult: undefined,
    txHash: undefined
  })

  const previousConnectedChainId = usePrevious(connectedChainId)
  const previousPrefilledState = usePrevious(prefilledState)
  useEffect(() => {
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    const prefilledInputChanged =
      previousPrefilledState?.inputCurrency &&
      !prefilledState.inputCurrency?.equals(previousPrefilledState.inputCurrency)
    const prefilledOutputChanged =
      previousPrefilledState?.outputCurrency &&
      !prefilledState?.outputCurrency?.equals(previousPrefilledState.outputCurrency)

    if (chainChanged || prefilledInputChanged || prefilledOutputChanged) {
      // reset local state
      setSwapFormState({
        tradeToConfirm: undefined,
        swapError: undefined,
        showConfirm: false,
        swapResult: undefined
      })
      setWrapFormState({
        showWrapConfirm: false,
        wrapToConfirm: undefined,
        wrapError: undefined,
        wrapResult: undefined
      })
    }
  }, [
    connectedChainId,
    prefilledState.inputCurrency,
    prefilledState?.outputCurrency,
    previousConnectedChainId,
    previousPrefilledState
  ])

  const { formatCurrencyAmount } = useFormatter()
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : formatCurrencyAmount({
            amount: parsedAmounts[dependentField],
            type: NumberType.SwapTradeAmount,
            placeholder: ''
          })
    }),
    [dependentField, formatCurrencyAmount, independentField, parsedAmounts, showWrap, typedValue]
  )

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const maximumAmountIn = useMaxAmountIn(trade, allowedSlippage)
  const allowance = usePermit2Allowance(
    maximumAmountIn ??
      (parsedAmounts[Field.INPUT]?.currency.isToken
        ? (parsedAmounts[Field.INPUT] as CurrencyAmount<Token>)
        : undefined),
    isSupportedChain(chainId) ? UNIVERSAL_ROUTER_ADDRESS(chainId) : undefined,
    trade?.fillType,
    trade
  )

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances]
  )
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))
  const swapFiatValues = useMemo(() => {
    return { amountIn: fiatValueTradeInput.data, amountOut: fiatValueTradeOutput.data, feeUsd: outputFeeFiatValue }
  }, [fiatValueTradeInput.data, fiatValueTradeOutput.data, outputFeeFiatValue])

  // the callback to execute the swap
  const swapCallback = useSwapCallback(
    trade,
    swapFiatValues,
    allowedSlippage,
    allowance.state === AllowanceState.ALLOWED ? allowance.permitSignature : undefined
  )

  const handleContinueToReview = useCallback(() => {
    setSwapFormState({
      tradeToConfirm: trade,
      swapError: undefined,
      showConfirm: true,
      swapResult: undefined
    })
  }, [trade])

  const clearSwapState = useCallback(() => {
    setSwapFormState(currentState => ({
      ...currentState,
      swapError: undefined,
      swapResult: undefined
    }))
    setWrapFormState(currentState => ({
      ...currentState,
      wrapError: undefined,
      wrapResult: undefined
    }))
  }, [])

  const handleSwap = useCallback(() => {
    if (!swapCallback || !boxId) {
      return
    }
    if (preTaxStablecoinPriceImpact && !confirmPriceImpactWithoutFee(preTaxStablecoinPriceImpact)) {
      return
    }
    swapCallback()
      .then(async result => {
        await SwapMapping(boxId, result.response.hash)
        setSwapFormState(currentState => ({
          ...currentState,
          swapError: undefined,
          swapResult: result
        }))
      })
      .catch(error => {
        console.error(999, error)
        setSwapFormState(currentState => ({
          ...currentState,
          swapError: error,
          swapResult: undefined
        }))
      })
  }, [swapCallback, boxId, preTaxStablecoinPriceImpact])

  const handleOnWrap = useCallback(async () => {
    if (!onWrap) return
    try {
      const txHash = await onWrap()
      setWrapFormState(currentState => ({
        ...currentState,
        showWrapConfirm: true,
        wrapError: undefined,
        txHash
      }))
    } catch (error: any) {
      if (!didUserReject(error)) {
      }
      console.error('Could not wrap/unwrap', error)
      setWrapFormState(currentState => ({
        ...currentState,
        showWrapConfirm: true,
        wrapError: error,
        txHash: undefined
      }))
    }
  }, [onWrap])

  // warnings on the greater of fiat value price impact and execution price impact
  const { priceImpactSeverity, largerPriceImpact } = useMemo(() => {
    if (!isClassicTrade(trade)) {
      return { priceImpactSeverity: 0, largerPriceImpact: undefined }
    }

    const marketPriceImpact = trade?.priceImpact ? computeRealizedPriceImpact(trade) : undefined
    const largerPriceImpact = largerPercentValue(marketPriceImpact, preTaxStablecoinPriceImpact)
    return { priceImpactSeverity: warningSeverity(largerPriceImpact), largerPriceImpact }
  }, [preTaxStablecoinPriceImpact, trade])

  const handleConfirmDismiss = useCallback(() => {
    setSwapFormState(currentState => ({ ...currentState, showConfirm: false }))
    // If there was a swap, we want to clear the input
    if (swapResult) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, swapResult])

  const handleWrapConfirmDismiss = useCallback(() => {
    setWrapFormState(currentState => ({ ...currentState, showWrapConfirm: false }))
    // If there was a swap, we want to clear the input
    onUserInput(Field.INPUT, '')
  }, [onUserInput])

  const handleAcceptChanges = useCallback(() => {
    setSwapFormState(currentState => ({ ...currentState, tradeToConfirm: trade }))
  }, [trade])
  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      onCurrencyChange?.({
        inputCurrency,
        outputCurrency: currencyState.outputCurrency
      })
    },
    [onCurrencySelection, onCurrencyChange, currencyState.outputCurrency]
  )
  const inputCurrencyNumericalInputRef = useRef<HTMLInputElement>(null)

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      onCurrencyChange?.({
        inputCurrency: currencyState.inputCurrency,
        outputCurrency
      })
    },
    [onCurrencySelection, onCurrencyChange, currencyState.inputCurrency]
  )

  const showPriceImpactWarning = isClassicTrade(trade) && largerPriceImpact && priceImpactSeverity > 3

  const showDetailsDropdown = Boolean(
    !showWrap && userHasSpecifiedInputOutput && (trade || routeIsLoading || routeIsSyncing)
  )

  const inputCurrency = currencies[Field.INPUT] ?? undefined
  const outputCurrency = currencies[Field.OUTPUT] ?? undefined

  return (
    <>
      {/* <TokenSafetyModal
        isOpen={urlTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokenAddress={urlTokensNotInDefault[0]?.address}
        secondTokenAddress={urlTokensNotInDefault[1]?.address}
        onContinue={handleConfirmTokenWarning}
        onCancel={handleDismissTokenWarning}
        showCancel={true}
      /> */}
      {showWrapConfirm && (
        <WrapSubmitModal
          trade={trade}
          wrapAmount={parsedAmount}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          originalTrade={wrapToConfirm}
          onAcceptChanges={handleAcceptChanges}
          onCurrencySelection={onCurrencySelection}
          swapResult={wrapResult}
          allowedSlippage={allowedSlippage}
          clearSwapState={clearSwapState}
          onConfirm={handleOnWrap}
          allowance={allowance}
          swapError={wrapError}
          wrapTxHash={txHash}
          onDismiss={handleWrapConfirmDismiss}
          fiatValueInput={fiatValueTradeInput}
          fiatValueOutput={fiatValueTradeOutput}
        />
      )}
      {trade && showConfirm && (
        <ConfirmSwapModal
          trade={trade}
          inputCurrency={inputCurrency}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          onCurrencySelection={onCurrencySelection}
          swapResult={swapResult}
          allowedSlippage={allowedSlippage}
          clearSwapState={clearSwapState}
          onConfirm={handleSwap}
          allowance={allowance}
          swapError={swapError}
          onDismiss={handleConfirmDismiss}
          fiatValueInput={fiatValueTradeInput}
          fiatValueOutput={fiatValueTradeOutput}
        />
      )}
      {showPriceImpactModal && showPriceImpactWarning && (
        <PriceImpactModal
          priceImpact={largerPriceImpact}
          onDismiss={() => setShowPriceImpactModal(false)}
          onContinue={() => {
            setShowPriceImpactModal(false)
            handleContinueToReview()
          }}
        />
      )}
      <AppBody>
        <Box
          sx={{
            position: 'relative'
          }}
        >
          <div style={{ display: 'relative' }}>
            <SwapSection>
              <SwapCurrencyInputPanel
                boxId={boxId}
                label={'Swap'}
                disabled={disableTokenInputs}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={showMaxButton}
                currency={currencies[Field.INPUT] ?? null}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                fiatValue={showFiatValueInput ? fiatValueInput : undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                currencySearchFilters={SWAP_FORM_CURRENCY_SEARCH_FILTERS}
                id={'swap-currency-input'}
                loading={independentField === Field.OUTPUT && routeIsSyncing}
                ref={inputCurrencyNumericalInputRef}
              />
            </SwapSection>
            <ArrowWrapper $clickable={isSupportedChain(chainId)}>
              <SwitchCircle
                onClick={() => {
                  if (disableTokenInputs) return
                  onSwitchTokens({
                    newOutputHasTax: inputTokenHasTax,
                    previouslyEstimatedOutput: formattedAmounts[dependentField]
                  })
                }}
                style={{}}
              />
            </ArrowWrapper>
          </div>
          <Box bgcolor={'#ffffff'} borderRadius={'12px'} pb={'12px'}>
            <AutoColumn gap="10px">
              <div>
                <OutputSwapSection>
                  <SwapCurrencyInputPanel
                    boxId={boxId}
                    value={formattedAmounts[Field.OUTPUT]}
                    disabled={disableTokenInputs}
                    onUserInput={handleTypeOutput}
                    label={'For'}
                    showMaxButton={false}
                    hideBalance={false}
                    fiatValue={showFiatValueOutput ? fiatValueOutput : undefined}
                    priceImpact={stablecoinPriceImpact}
                    currency={currencies[Field.OUTPUT] ?? null}
                    onCurrencySelect={handleOutputSelect}
                    otherCurrency={currencies[Field.INPUT]}
                    currencySearchFilters={SWAP_FORM_CURRENCY_SEARCH_FILTERS}
                    id={'swap-currency-output'}
                    loading={independentField === Field.INPUT && routeIsSyncing}
                    numericalInputSettings={{
                      // We disable numerical input here if the selected token has tax, since we cannot guarantee exact_outputs for FOT tokens
                      disabled: inputTokenHasTax || outputTokenHasTax,
                      // Focus the input currency panel if the user tries to type into the disabled output currency panel
                      onDisabledClick: () => inputCurrencyNumericalInputRef.current?.focus(),
                      disabledTooltipBody: (
                        <OutputTaxTooltipBody
                          currencySymbol={currencies[inputTokenHasTax ? Field.INPUT : Field.OUTPUT]?.symbol}
                        />
                      )
                    }}
                  />
                </OutputSwapSection>
              </div>

              <Box px={12}>
                {swapIsUnsupported ? (
                  <Button
                    fullWidth
                    sx={{
                      height: 44
                    }}
                    variant="contained"
                    disabled={true}
                  >
                    <ThemedText.DeprecatedMain mb="4px">Unsupported asset</ThemedText.DeprecatedMain>
                  </Button>
                ) : connectionReady && !account ? (
                  <Button onClick={toggleWallet} variant="black" fullWidth>
                    Connect wallets
                  </Button>
                ) : showWrap ? (
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      height: 44,
                      border: '1px solid #121212',
                      color: 'var(--ps-text-primary)',
                      '&:hover': {
                        borderColor: 'rgba(18,18,18,0.6)',
                        color: 'rgba(13,13,13,0.6)'
                      }
                    }}
                    disabled={Boolean(wrapInputError)}
                    onClick={handleOnWrap}
                    data-testid="wrap-button"
                  >
                    {wrapInputError ? (
                      <WrapErrorText wrapInputError={wrapInputError} />
                    ) : wrapType === WrapType.WRAP ? (
                      <>Wrap</>
                    ) : wrapType === WrapType.UNWRAP ? (
                      <>Unwrap</>
                    ) : null}
                  </Button>
                ) : routeNotFound && userHasSpecifiedInputOutput && !routeIsLoading && !routeIsSyncing ? (
                  <ActionButton error="Insufficient liquidity for this trade" onAction={undefined} actionText="" />
                ) : (
                  // <Button
                  //   variant="contained"
                  //   sx={{
                  //     width: '100%',
                  //     borderRadius: '8px',
                  //     height: 44
                  //   }}
                  //   onClick={() => {
                  //     showPriceImpactWarning ? setShowPriceImpactModal(true) : handleContinueToReview()
                  //   }}
                  //   id="swap-button"
                  //   data-testid="swap-button"
                  //   disabled={!getIsReviewableQuote(trade, tradeState, swapInputError)}
                  //   // error={!swapInputError && priceImpactSeverity > 2 && allowance.state === AllowanceState.ALLOWED}
                  // >
                  //   <ThemedText.BodyPrimary fontSize={20}>
                  //     <Typography color={'#0d0d0d'}>
                  //       {swapInputError
                  //         ? swapInputError
                  //         : routeIsSyncing || routeIsLoading
                  //           ? 'Swap'
                  //           : priceImpactSeverity > 2
                  //             ? 'Swap anyway'
                  //             : 'Swap'}
                  //     </Typography>
                  //   </ThemedText.BodyPrimary>
                  // </Button>
                  <ActionButton
                    width="100%"
                    actionText={`Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                    onAction={() => {
                      showPriceImpactWarning ? setShowPriceImpactModal(true) : handleContinueToReview()
                    }}
                    disableAction={!getIsReviewableQuote(trade, tradeState, swapInputError)}
                    error={
                      swapInputError
                        ? swapInputError + ''
                        : // : priceImpactSeverity > 3 && !isExpertMode
                          // ? `Price Impact Too High`
                          undefined
                    }
                  />
                )}
                {showPriceImpactWarning && !showWrap && <PriceImpactWarning priceImpact={largerPriceImpact} />}
                {(routeIsSyncing || routeIsLoading) && (
                  <ThemedText.DeprecatedMain fontSize={14} style={{ padding: '12px 16px 0' }}>
                    <>Fetching best price...</>
                  </ThemedText.DeprecatedMain>
                )}
                {showDetailsDropdown && (
                  <SwapDetailsDropdown
                    trade={trade}
                    syncing={routeIsSyncing}
                    loading={routeIsLoading}
                    allowedSlippage={allowedSlippage}
                  />
                )}
              </Box>
            </AutoColumn>
          </Box>
        </Box>
      </AppBody>
    </>
  )
}
