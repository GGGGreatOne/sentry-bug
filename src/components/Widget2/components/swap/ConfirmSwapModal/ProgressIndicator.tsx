import Column from '../../../components/Column'
import { Sign } from '../../Icons/Sign'
import { Swap } from '../../Icons/Swap'
import CurrencyLogo from '../../Logo/CurrencyLogo'
// import { SupportArticleURL } from 'constants/supportArticles'
import { useBlockConfirmationTime } from '../../../hooks/useBlockConfirmationTime'
// import { useColor } from 'hooks/useColor'
import { SwapResult } from '../../../hooks/useSwapCallback'
import { UniswapXOrderStatus } from '../../../lib/hooks/orders/types'
import useNativeCurrency from '../../../lib/hooks/useNativeCurrency'
import { useEffect, useMemo, useState } from 'react'
import { InterfaceTrade, OffchainOrderType } from '../../../state/routing/types'
import { isLimitTrade, isUniswapXTrade } from '../../../state/routing/utils'
import { useOrder } from '../../../state/signatures/hooks'
import { useIsTransactionConfirmed, useSwapTransactionStatus } from '../../../state/transactions/hooks'
import styled from 'styled-components'
// import { colors } from 'theme/colors'
import { Divider } from '../../../theme/components'
import { TransactionStatus } from '../../../lib/uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { SignatureExpiredError } from '../../../utils/errors'
import { Step, StepDetails, StepStatus } from './Step'
import { useActiveWeb3React } from 'hooks'
import { ConfirmModalState } from '.'

const DividerContainer = styled(Column)`
  height: 28px;
  padding: 0px 16px;
  justify-content: center;
`
const Edge = styled.div`
  width: 2px;
  height: 10px;
  background-color: ${({ theme }) => theme.neutral3};
  margin: 0px 27px;
`
type ProgressIndicatorStep = Extract<
  ConfirmModalState,
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.PERMITTING
  | ConfirmModalState.PENDING_CONFIRMATION
  | ConfirmModalState.WRAPPING
  | ConfirmModalState.RESETTING_TOKEN_ALLOWANCE
>

const inputTokenColor = '#31B047'

export default function ProgressIndicator({
  steps,
  currentStep,
  trade,
  swapResult,
  wrapTxHash,
  tokenApprovalPending = false,
  revocationPending = false,
  swapError,
  onRetryUniswapXSignature
}: {
  steps: ProgressIndicatorStep[]
  currentStep: ProgressIndicatorStep
  trade?: InterfaceTrade
  swapResult?: SwapResult
  wrapTxHash?: string
  tokenApprovalPending?: boolean
  revocationPending?: boolean
  swapError?: Error | string
  onRetryUniswapXSignature?: () => void
}) {
  const { chainId } = useActiveWeb3React()
  const nativeCurrency = useNativeCurrency(chainId)
  // const inputTokenColor = useColor(trade?.inputAmount.currency.wrapped)

  // Dynamic estimation of transaction wait time based on confirmation of previous block
  const { blockConfirmationTime } = useBlockConfirmationTime()
  const [estimatedTransactionTime, setEstimatedTransactionTime] = useState<number>()
  useEffect(() => {
    // Value continuously updates as new blocks get confirmed
    // Only set step timers once to prevent resetting
    if (blockConfirmationTime && !estimatedTransactionTime) {
      // Add buffer to account for variable confirmation
      setEstimatedTransactionTime(Math.ceil(blockConfirmationTime * 1.2))
    }
  }, [blockConfirmationTime, estimatedTransactionTime])

  const swapStatus = useSwapTransactionStatus(swapResult)
  const uniswapXOrder = useOrder('')

  const swapConfirmed =
    swapStatus === TransactionStatus.Confirmed || uniswapXOrder?.status === UniswapXOrderStatus.FILLED
  const wrapConfirmed = useIsTransactionConfirmed(wrapTxHash)

  const swapPending = swapResult !== undefined && !swapConfirmed
  const wrapPending = wrapTxHash != undefined && !wrapConfirmed
  const transactionPending = revocationPending || tokenApprovalPending || wrapPending || swapPending

  // Retry logic for UniswapX orders when a signature expires
  const [signatureExpiredErrorId, setSignatureExpiredErrorId] = useState('')
  useEffect(() => {
    if (swapError instanceof SignatureExpiredError && swapError.id !== signatureExpiredErrorId) {
      setSignatureExpiredErrorId(swapError.id)
      onRetryUniswapXSignature?.()
    }
  }, [onRetryUniswapXSignature, signatureExpiredErrorId, swapError])

  function getStatus(targetStep: ProgressIndicatorStep) {
    const currentIndex = steps.indexOf(currentStep)
    const targetIndex = steps.indexOf(targetStep)
    if (currentIndex < targetIndex) {
      return StepStatus.PREVIEW
    } else if (currentIndex === targetIndex) {
      return transactionPending ? StepStatus.IN_PROGRESS : StepStatus.ACTIVE
    } else {
      return StepStatus.COMPLETE
    }
  }

  const stepDetails: Record<ProgressIndicatorStep, StepDetails> = useMemo(
    () => ({
      [ConfirmModalState.WRAPPING]: {
        icon: <CurrencyLogo currency={trade?.inputAmount.currency} />,
        rippleColor: inputTokenColor,
        previewTitle: `Wrap ${nativeCurrency.symbol}`,
        actionRequiredTitle: `Wrap  ${nativeCurrency.symbol} in walle`,
        inProgressTitle: `Wrapping  ${nativeCurrency.symbol}...`,
        learnMoreLinkText: `Why do I have to wrap my ${nativeCurrency.symbol}?`
        // learnMoreLinkHref: SupportArticleURL.WETH_EXPLAINER
      },
      [ConfirmModalState.RESETTING_TOKEN_ALLOWANCE]: {
        icon: <CurrencyLogo currency={trade?.inputAmount.currency} />,
        rippleColor: inputTokenColor,
        previewTitle: `Reset ${trade?.inputAmount.currency.symbol} limit`,
        actionRequiredTitle: `Reset ${trade?.inputAmount.currency.symbol} limit in wallet`,
        inProgressTitle: `Resetting ${trade?.inputAmount.currency.symbol} limit...`
      },
      [ConfirmModalState.APPROVING_TOKEN]: {
        icon: <CurrencyLogo currency={trade?.inputAmount.currency} />,
        rippleColor: inputTokenColor,
        previewTitle: `Approve ${trade?.inputAmount.currency.symbol} spending`,
        actionRequiredTitle: `Approve in wallet`,
        inProgressTitle: `Approval pending...`,
        learnMoreLinkText: `Why do I have to approve a token?`
        // learnMoreLinkHref: SupportArticleURL.APPROVALS_EXPLAINER
      },
      [ConfirmModalState.PERMITTING]: {
        icon: <Sign />,
        rippleColor: '#fff',
        previewTitle: `Sign message`,
        actionRequiredTitle: `Sign message in wallet`,
        learnMoreLinkText: `Why are signatures required?`
        // learnMoreLinkHref: SupportArticleURL.APPROVALS_EXPLAINER
      },
      [ConfirmModalState.PENDING_CONFIRMATION]: {
        icon: <Swap />,
        rippleColor: inputTokenColor,
        previewTitle: isLimitTrade(trade) ? `Confirm` : `Confirm swap`,
        actionRequiredTitle: isLimitTrade(trade) ? `Confirm in wallet` : `Confirm swap in wallet`,
        inProgressTitle: isLimitTrade(trade) ? `Pending...` : `Swap pending...`,
        ...(isUniswapXTrade(trade) && trade.offchainOrderType === OffchainOrderType.DUTCH_AUCTION
          ? {
              timeToStart: trade.asDutchOrderTrade().order.info.deadline - Math.floor(Date.now() / 1000),
              delayedStartTitle: `Confirmation timed out. Please retry.`
            }
          : {}),
        learnMoreLinkText: isLimitTrade(trade) ? `Learn more about limits` : `Learn more about swaps`
        // learnMoreLinkHref: isLimitTrade(trade)
        //   ? SupportArticleURL.LEARN_ABOUT_LIMITS
        //   : SupportArticleURL.HOW_TO_SWAP_TOKENS
      }
    }),
    [nativeCurrency.symbol, trade]
  )

  if (steps.length === 0) {
    return null
  }

  return (
    <Column>
      <DividerContainer>
        <Divider />
      </DividerContainer>
      {steps.map((step, i) => {
        return (
          <div key={`progress-indicator-step-${i}`}>
            <Step stepStatus={getStatus(step)} stepDetails={stepDetails[step]} />
            {i !== steps.length - 1 && <Edge />}
          </div>
        )
      })}
    </Column>
  )
}
