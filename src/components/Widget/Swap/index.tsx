import { useCallback, useState, ChangeEvent, useMemo, useEffect } from 'react'
import { Typography, Box, Button, Divider } from '@mui/material'
import { CurrencyAmount, JSBI, Currency, Trade } from '@uniswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/widget/swap/hooks'
import { Field } from 'state/widget/swap/actions'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from 'state/widget/swapUser/hooks'
import Settings from '../component/Settings'
import { maxAmountSpend } from '../utils/maxAmountSpend'
import { ApprovalState, useApproveCallbackFromTrade } from '../hooks/useApproveCallback'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../hooks/prices'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactionConfirmedModal'
import ActionButton from '../component/Button/ActionButton'
import confirmPriceImpactWithoutFee from '../utils/confirmPriceImpactWithoutFee'
import { useSwapCallback } from '../hooks/useSwapCallback'
import CurrencyInputPanel from '../component/Input/CurrencyInputPanel'
import { SwitchCircle } from '../assets/svg'
import { SwapSummary } from '../component/swap/SwapSummary'
import ConfirmSwapModal from '../component/Modal/ConfirmSwapModal'
import AppBody from '../component/AppBody'
import { globalDialogControl } from 'components/Dialog'

export default function Swap() {
  // const theme = useTheme()

  const { account } = useActiveWeb3React()

  const [summaryExpanded, setSummaryExpanded] = useState(false)

  // modal and loading
  const [{ showConfirm, tradeToConfirm, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    txHash: undefined
  })

  const { showModal, hideModal } = useModal()
  const toggleWallet = useWalletModalToggle()
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const [isExpertMode] = useExpertModeManager()
  const { independentField, typedValue, recipient } = useSwapState()

  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
  const { [Field.INPUT]: fromAsset, [Field.OUTPUT]: toAsset } = currencies

  const trade = v2Trade

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
  }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onResetSwapState } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]:
      // showWrap
      // ? parsedAmounts[independentField]?.toExact() ?? ''
      //   :
      parsedAmounts[dependentField]?.toSignificant(6, undefined, 0) ?? ''
  }

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  )

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const handleApprove = useCallback(() => {
    approveCallback()
  }, [approveCallback])

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    } else {
      setApprovalSubmitted(false)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const [singleHopOnly] = useUserSingleHopOnly()
  const handleErrorMsg = (error: string) => {
    if (error.indexOf('user rejected transaction')) {
      return true
    }
    return false
  }
  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    showModal(<TransacitonPendingModal />)
    // setSwapState(prev => ({ ...prev, attemptingTxn: true, showConfirm: false, txHash: undefined }))
    swapCallback()
      .then((hash: string | undefined) => {
        onResetSwapState()
        hideModal()
        showModal(<TransactionSubmittedModal />)
        setSwapState(prev => ({ ...prev, attemptingTxn: false, txHash: hash }))
      })
      .catch(error => {
        hideModal()
        if (error?.code === 4001) {
          showModal(<MessageBox type="error">{'Transaction rejected.'}</MessageBox>)
        } else {
          let errMsg = `${error.message?.slice(0, 200)}${error.message?.length > 200 ? '...' : ''}`
          if (
            typeof errMsg === 'string' &&
            (errMsg.includes(`Non-200 status code: '403'`) || errMsg.includes(`JSON-RPC error`))
          ) {
            errMsg = `Rate limit,please try again later.`
          }
          handleErrorMsg(error.message)
            ? globalDialogControl.show('ResultTipDialog', {
                iconType: 'error',
                title: 'Oops..',
                againBtn: 'Try Again',
                cancelBtn: 'Cancel',
                onAgain: () => handleSwap(),
                subTitle: `${error.message?.slice(0, 200)}
                  ${error.message?.length > 200 ? '...' : ''}`
              })
            : showModal(<MessageBox type="error">{errMsg}</MessageBox>)
        }

        setSwapState(prev => ({
          ...prev,
          attemptingTxn: false,
          txHash: undefined
        }))
      })
  }, [hideModal, onResetSwapState, priceImpactWithoutFee, showModal, swapCallback])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState(prev => ({ ...prev, showConfirm: false, tradeToConfirm, attemptingTxn, txHash }))
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState(prev => ({ ...prev, tradeToConfirm: trade }))
  }, [trade])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))
  // &&
  // !(priceImpactSeverity > 3 && !isExpertMode)

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleFromVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUserInput(Field.INPUT, e.target.value)
    },
    [onUserInput]
  )

  const handleToVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUserInput(Field.OUTPUT, e.target.value)
    },
    [onUserInput]
  )

  const handleFromAsset = useCallback(
    (currency: Currency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currency)
    },
    [onCurrencySelection]
  )

  const handleToAsset = useCallback(
    (currency: Currency) => {
      onCurrencySelection(Field.OUTPUT, currency)
    },
    [onCurrencySelection]
  )

  const error = useMemo(() => {
    if (!fromAsset || !toAsset) {
      return 'Select a Token'
    }

    return undefined
  }, [fromAsset, toAsset])

  const onSwitch = useCallback(() => {
    if (!account) {
      return
    }
    onSwitchTokens()
  }, [account, onSwitchTokens])

  return (
    <>
      <ConfirmSwapModal
        onConfirm={handleSwap}
        from={fromAsset ?? undefined}
        to={toAsset ?? undefined}
        isOpen={showConfirm}
        onDismiss={handleConfirmDismiss}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        allowedSlippage={allowedSlippage}
        priceImpact={priceImpactWithoutFee?.toFixed()}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
      />
      <AppBody>
        <Box
          sx={{
            position: 'relative'
          }}
        >
          <Box
            display="flex"
            width="100%"
            justifyContent={'space-between'}
            alignItems={'center'}
            padding={'12px 12px 0'}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: 16
              }}
            >
              SWAP
            </Typography>
            <Settings />
          </Box>

          <Box mb={fromAsset ? 16 : 0} padding={12}>
            <CurrencyInputPanel
              value={formattedAmounts[Field.INPUT]}
              onChange={handleFromVal}
              onSelectCurrency={handleFromAsset}
              currency={fromAsset}
              onMax={handleMaxInput}
              disabled={!account}
              isBlackBg
            />
          </Box>
          <Box
            sx={{
              margin: '16px auto -20px',
              width: 'max-content',
              '&:hover': {
                '& rect': {
                  fill: '#eeeeee'
                }
              },
              display: 'flex',
              justifyContent: {
                xs: 'center',
                md: 'flex-start'
              }
            }}
          >
            <SwitchCircle onClick={onSwitch} style={{ cursor: account ? 'pointer' : 'auto' }} />
          </Box>
          <Box bgcolor={'#ffffff'} borderRadius={'12px'}>
            <Box
              display="flex"
              width="100%"
              justifyContent={'space-between'}
              alignItems={'center'}
              padding={'12px 12px 0'}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: 16,
                  color: '#888D9B'
                }}
              >
                For
              </Typography>
            </Box>
            <Box padding={12}>
              <>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onChange={handleToVal}
                  onSelectCurrency={handleToAsset}
                  currency={toAsset}
                  disabled={!account}
                  isSecond
                  hideBalance
                />
              </>

              {/* {toAsset && <AssetAccordion token={toAsset} />} */}
              {isValid && !swapCallbackError && (
                <>
                  <Divider />
                  <SwapSummary
                    trade={trade}
                    toVal={formattedAmounts[Field.OUTPUT]}
                    price={v2Trade?.executionPrice?.toFixed(6) ?? '-'}
                    expanded={summaryExpanded}
                    onChange={() => setSummaryExpanded(!summaryExpanded)}
                    gasFee="8.23"
                    slippage={+(priceImpactWithoutFee?.toFixed(2) ?? 0)}
                    minReceiveQty={slippageAdjustedAmounts.OUTPUT?.toFixed(6) ?? '-'}
                    routerTokens={trade?.route.path.slice(1, -1)}
                  />
                </>
              )}
              <Box mt={20} px={12}>
                {!account ? (
                  <Button onClick={toggleWallet} variant="black" fullWidth>
                    Connect Wallet
                  </Button>
                ) : // : showWrap ? (
                // <Button disabled={Boolean(wrapInputError)} onClick={onWrap}>
                //   {wrapInputError ??
                //     (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                // </Button>
                // )
                noRoute && userHasSpecifiedInputOutput ? (
                  <Button disabled style={{ textAlign: 'center' }}>
                    <Typography mb="4px">
                      Insufficient liquidity for this trade. {singleHopOnly && 'Try enabling multi-hop trades.'}
                    </Typography>
                  </Button>
                ) : (
                  <Box display="grid" gap="16px">
                    {showApproveFlow ? (
                      <ActionButton
                        onAction={handleApprove}
                        actionText={
                          approvalSubmitted && approval === ApprovalState.APPROVED
                            ? 'Approved'
                            : `Approve ${currencies[Field.INPUT]?.symbol}`
                        }
                        error={error}
                        disableAction={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                        pending={approval === ApprovalState.PENDING}
                        pendingText="Approving"
                      />
                    ) : (
                      <ActionButton
                        actionText={`Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                        onAction={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              showConfirm: true,
                              txHash: undefined
                            })
                          }
                        }}
                        disableAction={
                          !isValid ||
                          // (priceImpactSeverity > 3 && !isExpertMode) ||
                          !!swapCallbackError ||
                          (showApproveFlow && approval !== ApprovalState.APPROVED)
                        }
                        error={
                          swapInputError
                            ? swapInputError
                            : // : priceImpactSeverity > 3 && !isExpertMode
                              // ? `Price Impact Too High`
                              undefined
                        }
                      />
                    )}
                    {/*
                    <Typography
                      textAlign={'right'}
                      fontSize={12}
                      sx={{
                        mt: -10,
                        color: theme => theme.palette.text.secondary
                      }}
                    >
                      Click the button on the right top to modify transaction settings.
                    </Typography> */}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </AppBody>
    </>
  )
}
