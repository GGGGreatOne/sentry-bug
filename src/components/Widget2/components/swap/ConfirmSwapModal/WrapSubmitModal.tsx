import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Field } from '../constants'
import { Allowance } from '../../../hooks/usePermit2Allowance'
import { SwapResult } from '../../../hooks/useSwapCallback'
import { useCallback, useMemo } from 'react'
import { useSuppressPopups } from '../../../state/application/hooks'
import { PopupType } from '../../../state/application/reducer'
import { InterfaceTrade } from '../../../state/routing/types'
import { isLimitTrade } from '../../../state/routing/utils'
import { useSwapTransactionStatus } from '../../../state/transactions/hooks'
import styled from 'styled-components'
import { ThemeProvider } from '../../../theme'
import { SignatureExpiredError } from '../../../utils/errors'
import { didUserReject } from '../../../utils/swapErrorToUserReadableMessage'
// import { SwapPreview } from '../SwapPreview'import {
import { AnimatedEntranceConfirmationIcon, LogoContainer } from '../../Icons/ActivityLogos'
import SwapError, { PendingModalError } from './Error'
import { SwapHead } from './Head'
import { SwapModal } from './Modal'
import { Button, Stack, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'

const Container = styled.div<{ $height?: string; $padding?: string }>`
  height: ${({ $height }) => $height ?? ''};
  padding: ${({ $padding }) => $padding ?? ''};
`

export enum ConfirmModalState {
  REVIEWING,
  WRAPPING,
  RESETTING_TOKEN_ALLOWANCE,
  APPROVING_TOKEN,
  PERMITTING,
  PENDING_CONFIRMATION
}

export default function WrapSubmitModal({
  wrapAmount,
  trade,
  wrapTxHash,
  inputCurrency,
  outputCurrency,
  swapResult,
  swapError,
  onConfirm,
  onDismiss
}: {
  wrapAmount: CurrencyAmount<Currency> | undefined
  wrapTxHash?: string
  trade?: InterfaceTrade
  originalTrade?: InterfaceTrade
  inputCurrency?: Currency
  outputCurrency?: Currency
  allowance: Allowance
  allowedSlippage: Percent
  fiatValueInput: { data?: number; isLoading: boolean }
  fiatValueOutput: { data?: number; isLoading: boolean }
  swapResult?: SwapResult
  swapError?: Error
  clearSwapState: () => void
  onAcceptChanges?: () => void
  onConfirm: () => void
  onCurrencySelection: (field: Field, currency: Currency) => void
  onDismiss: () => void
}) {
  const approvalError = undefined
  // Get status depending on swap type
  const swapStatus = useSwapTransactionStatus(swapResult)
  console.log('🚀 ~ originalTrade:', swapStatus, swapResult)

  const errorType = useMemo(() => {
    if (approvalError) return approvalError
    if (swapError instanceof SignatureExpiredError) return
    if (swapError && !didUserReject(swapError) && swapError?.message.indexOf('Transaction failed') > -1)
      return PendingModalError.TRANSACTION_ERROR
    if (swapError && !didUserReject(swapError) && swapError?.message.indexOf('status code') > -1)
      return PendingModalError.RPC_ERROR
    if (swapError && !didUserReject(swapError) && swapError?.message.indexOf('Your swap is expected to fail') > -1)
      return PendingModalError.CONFIRMATION_ERROR
    if (swapError && !didUserReject(swapError)) return PendingModalError.CONFIRMATION_ERROR
    return
  }, [approvalError, swapError])

  const { unsuppressPopups } = useSuppressPopups([PopupType.Transaction, PopupType.Order])

  const onModalDismiss = useCallback(() => {
    onDismiss()
    // Popups are suppressed when modal is open; re-enable them on dismissal
    unsuppressPopups()
  }, [onDismiss, unsuppressPopups])

  return (
    // Wrapping in a new theme provider resets any color extraction overriding on the current page. Swap modal should use default/non-overridden theme.
    <ThemeProvider>
      <SwapModal confirmModalState={undefined} onDismiss={onModalDismiss}>
        {/* Head section displays title, help button, close icon */}
        <Container $height="24px" $padding="6px 12px 4px 12px">
          <SwapHead onDismiss={onModalDismiss} isLimitTrade={isLimitTrade(trade)} />
        </Container>

        {/* Preview section displays input / output currency amounts */}

        <Stack
          justifyContent={'center'}
          padding="40px 12px 10px 12px"
          direction={'row'}
          alignItems={'center'}
          spacing={10}
          sx={{ fontSize: 14 }}
        >
          <Stack direction={'row'} alignItems={'center'} spacing={10}>
            <CurrencyLogo currencyOrAddress={inputCurrency} size="16px" />
            <Typography>
              {wrapAmount?.toSignificant()}{' '}
              {inputCurrency?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : inputCurrency?.symbol?.toLocaleUpperCase()}
            </Typography>
          </Stack>
          <Stack>→</Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={10}>
            <CurrencyLogo currencyOrAddress={outputCurrency} size="16px" />
            <Typography>
              {wrapAmount?.toSignificant()}{' '}
              {outputCurrency?.symbol?.toLocaleUpperCase() === 'ETH'
                ? 'BB'
                : outputCurrency?.symbol?.toLocaleUpperCase()}
            </Typography>
          </Stack>
        </Stack>
        {wrapTxHash && (
          <Typography textAlign={'center'} width={'100%'}>
            {inputCurrency?.isNative ? 'Wrap Submitted' : 'UnWrap Submitted'}
          </Typography>
        )}
        {/* Pending screen displays spinner for single-step confirmations, as well as success screen for all flows */}
        {wrapTxHash && (
          <Stack
            sx={{
              width: '100%',
              '& svg': {
                margin: '0 auto !important'
              }
            }}
          >
            <LogoContainer style={{ width: '100%' }}>
              <AnimatedEntranceConfirmationIcon />
            </LogoContainer>
          </Stack>
        )}
        {/* Error screen handles all error types with custom messaging and retry logic */}
        {errorType && swapError && (
          <SwapError trade={trade} swapResult={swapResult} errorType={errorType} onRetry={onConfirm} />
        )}
        {!swapError && (
          <Button
            fullWidth
            sx={{
              height: 44,
              margin: '20px 0'
            }}
            variant="contained"
            onClick={onModalDismiss}
          >
            Close
          </Button>
        )}
      </SwapModal>
    </ThemeProvider>
  )
}
