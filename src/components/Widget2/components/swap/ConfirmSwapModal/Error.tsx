import { ColumnCenter } from '../../Column'
import { SwapResult } from '../../../hooks/useSwapCallback'
import { AlertTriangle } from 'react-feather'
import { InterfaceTrade, TradeFillType } from '../../../state/routing/types'
import { isLimitTrade } from '../../../state/routing/utils'
import styled, { useTheme } from 'styled-components'
import { ExternalLink, ThemedText } from '../../../theme/components'
import { TradeSummary } from './TradeSummary'
import { ExplorerDataType } from 'components/Widget2/utils/getExplorerLink'
import { Button } from '@mui/material'
import { SupportArticleURL } from 'components/Widget2/constants/supportArticles'
import { getEtherscanLink } from 'utils/getEtherscanLink'

export enum PendingModalError {
  TOKEN_APPROVAL_ERROR,
  PERMIT_ERROR,
  CONFIRMATION_ERROR,
  WRAP_ERROR,
  RPC_ERROR,
  TRANSACTION_ERROR,
  NETWORK_ERROR
}

interface ErrorModalContentProps {
  errorType: PendingModalError
  trade?: InterfaceTrade
  swapResult?: SwapResult
  onRetry: () => void
}

function getErrorContent({
  errorType,
  trade // swapResult
}: {
  errorType: PendingModalError
  swapResult?: SwapResult
  trade?: InterfaceTrade
}): {
  title: JSX.Element
  message?: JSX.Element
  supportArticleURL?: SupportArticleURL
} {
  switch (errorType) {
    case PendingModalError.TOKEN_APPROVAL_ERROR:
      return {
        title: <>Token approval failed</>,
        message: (
          <>
            This provides the Bitswap protocol access to your token for trading. For security, it expires after 30 days.
          </>
        ),
        supportArticleURL: SupportArticleURL.APPROVALS_EXPLAINER
      }
    case PendingModalError.PERMIT_ERROR:
      return {
        title: <>Permit approval failed</>,
        message: <>Permit2 allows token approvals to be shared and managed across different applications.</>,
        supportArticleURL: SupportArticleURL.APPROVALS_EXPLAINER
      }
    case PendingModalError.CONFIRMATION_ERROR:
      if (isLimitTrade(trade)) {
        return {
          title: <>Limit failed</>,
          supportArticleURL: SupportArticleURL.LIMIT_FAILURE
        }
      } else {
        return {
          title: <>Swap failed</>,
          message: <>Try using higher than normal slippage and gas to ensure your transaction is completed.</>,
          supportArticleURL: SupportArticleURL.TRANSACTION_FAILURE
        }
      }
    case PendingModalError.WRAP_ERROR:
      return {
        title: <>Wrap failed</>,
        message: (
          <>Swaps on the Bitswap Protocol can start and end with BB. However, during the swap BB is wrapped into WBB.</>
        ),
        supportArticleURL: SupportArticleURL.WETH_EXPLAINER
      }
    case PendingModalError.RPC_ERROR:
      return {
        title: <>RPC error</>,
        message: <>Your request is too frequent, Please try later.</>
      }
    case PendingModalError.TRANSACTION_ERROR:
    case PendingModalError.NETWORK_ERROR:
      return {
        title: <>Transaction Error</>,
        message: <>The network is unstable, please try later.</>
      }
    default:
      return {
        title: <>Unknown Error</>,
        message: <>Your swap could not be executed. Please check your network connection and your slippage settings.</>
      }
  }
}

const Container = styled(ColumnCenter)`
  margin: 8px 0px;
`
const Section = styled(ColumnCenter)`
  padding: 8px 16px;
`
export default function Error({ errorType, trade, swapResult, onRetry }: ErrorModalContentProps) {
  const theme = useTheme()
  const { title, message } = getErrorContent({ errorType, swapResult, trade })

  return (
    <Container gap="md">
      <Section gap="md">
        <AlertTriangle
          data-testid="pending-modal-failure-icon"
          strokeWidth={1}
          stroke={theme.surface1}
          fill={theme.critical}
          size="64px"
        />
        <ThemedText.SubHeader>{title}</ThemedText.SubHeader>
        {trade && <TradeSummary trade={trade} />}
        <ThemedText.BodyPrimary>{message}</ThemedText.BodyPrimary>
      </Section>
      <Section>
        <Button fullWidth variant="contained" onClick={onRetry}>
          Try again
        </Button>
        {swapResult && swapResult.type === TradeFillType.Classic && (
          <ExternalLink
            href={getEtherscanLink(swapResult.response.chainId, swapResult.response.hash, ExplorerDataType.TRANSACTION)}
            color="neutral2"
          >
            View on Explorer
          </ExternalLink>
        )}
      </Section>
    </Container>
  )
}
