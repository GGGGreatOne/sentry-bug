import { ChainId, Currency } from '@uniswap/sdk-core'
import { ReactNode, useCallback, useState } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import Circle from '../../assets/images/blue-loader.png'
import SuccessIcon from '../../assets/images/success_icon.svg'
import { ButtonLight, ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Modal from '../Modal'
import Row, { RowBetween, RowFixed } from '../Row'
import AnimatedConfirmation from './AnimatedConfirmation'
import { CustomLightSpinner, ExternalLink, ThemedText } from 'components/Widget2/theme/components'
import CloseSvg from 'assets/svg/close-light.svg'
import { Box, Button, Stack, Typography } from '@mui/material'
import { SupportedL2ChainId } from 'components/Widget2/constants/chains'
import { getChainInfo } from 'components/Widget2/constants/chainInfo'
import { ChainLogo } from '../Logo/ChainLogo'
import { useActiveWeb3React } from 'hooks'
import { isL2ChainId } from 'components/Widget2/utils/chains'
import { ExplorerDataType } from 'components/Widget2/utils/getExplorerLink'
import { TransactionSummary } from '../AccountDetails/TransactionSummary'
import { useIsTransactionConfirmed, useTransaction } from 'components/Widget2/state/transactions/hooks'
import Badge from '../Badge'
import { getEtherscanLink } from 'utils/getEtherscanLink'
// import useCurrencyLogoURIs from 'components/Widget2/lib/hooks/useCurrencyLogoURIs'

const BottomSection = styled(AutoColumn)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '32px 0;')};
`

const ConfirmationModalContentWrapper = styled(AutoColumn)`
  padding-bottom: 12px;
`

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  inline
}: {
  onDismiss: () => void
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  return (
    <Stack
      sx={{
        backgroundColor: '#1b1b1b',
        borderRadius: '20px',
        outline: '1px solid #FFFFFF1A',
        width: '100%',
        padding: 16
      }}
    >
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <Box
              sx={{
                cursor: 'pointer',
                'svg>rect': {
                  fill: '#717171'
                }
              }}
              onClick={onDismiss}
            >
              <CloseSvg />
            </Box>
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle.src} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center">
          <ThemedText.SubHeaderLarge color="neutral1" textAlign="center">
            <Typography>Waiting for confirmation</Typography>
          </ThemedText.SubHeaderLarge>
          <ThemedText.SubHeader color="neutral1" textAlign="center">
            {pendingText}
          </ThemedText.SubHeader>
          <ThemedText.SubHeaderSmall color="neutral2" textAlign="center" marginBottom="12px">
            <Typography>Confirm this transaction in your wallet</Typography>
          </ThemedText.SubHeaderSmall>
        </AutoColumn>
      </AutoColumn>
    </Stack>
  )
}
function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline
}: {
  onDismiss: () => void
  hash?: string
  chainId: number
  currencyToAdd?: Currency
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  // const { connector } = useWeb3React()

  const token = currencyToAdd?.wrapped
  // const logoURL = useCurrencyLogoURIs(token)[0]

  const [success] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (!token?.symbol) return
    // connector
    //   .watchAsset({
    //     address: token.address,
    //     symbol: token.symbol,
    //     decimals: token.decimals,
    //     image: logoURL
    //   })
    //   .then(() => setSuccess(true))
    //   .catch(() => setSuccess(false))
  }, [token])

  const explorerText = chainId === ChainId.MAINNET ? `View on  Etherscan` : `View on Block Explorer`

  return (
    <Stack
      sx={{
        backgroundColor: '#1b1b1b',
        borderRadius: '20px',
        outline: '1px solid #FFFFFF1A',
        width: '100%',
        padding: 16
      }}
    >
      <AutoColumn>
        {!inline && (
          <RowBetween>
            <div />
            <Box
              sx={{
                cursor: 'pointer',
                'svg>rect': {
                  fill: '#717171'
                }
              }}
              onClick={onDismiss}
            >
              <CloseSvg />
            </Box>
          </RowBetween>
        )}

        <ConfirmationModalContentWrapper gap="md" justify="center">
          <ThemedText.MediumHeader textAlign="center">
            <Typography fontWeight={500} fontSize={28}>
              Transaction submitted
            </Typography>
          </ThemedText.MediumHeader>
          {currencyToAdd && (
            <ButtonLight mt="12px" padding="6px 12px" width="fit-content" onClick={addToken}>
              {!success ? (
                <RowFixed>
                  <Typography>Add {currencyToAdd.symbol}</Typography>
                </RowFixed>
              ) : (
                <RowFixed>
                  <Typography>Added {currencyToAdd.symbol} </Typography>
                  <CheckCircle size="16px" stroke={theme.success} style={{ marginLeft: '6px' }} />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ConfirmedIcon inline={inline}>
            {/* <ArrowUpCircle strokeWidth={1} size={inline ? '40px' : '75px'} color={theme.white} /> */}
            <SuccessIcon />
          </ConfirmedIcon>
          <Button
            variant="contained"
            onClick={onDismiss}
            style={{ margin: '20px 0 0 0', width: '100%', height: 44 }}
            data-testid="dismiss-tx-confirmation"
          >
            <ThemedText.HeadlineSmall color={theme.deprecated_accentTextLightPrimary}>
              {inline ? <Typography>Return</Typography> : <Typography>Close</Typography>}
            </ThemedText.HeadlineSmall>
          </Button>
          {chainId && hash && (
            <ExternalLink href={getEtherscanLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <Typography color={'#5A7FFF'}>{explorerText}</Typography>
            </ExternalLink>
          )}
        </ConfirmationModalContentWrapper>
      </AutoColumn>
    </Stack>
  )
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
  headerContent
}: {
  title: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode
  headerContent?: () => ReactNode
}) {
  return (
    <Stack
      sx={{
        backgroundColor: '#1b1b1b',
        borderRadius: '20px',
        outline: '1px solid #FFFFFF1A',
        width: '100%',
        padding: 16
      }}
    >
      <AutoColumn gap="sm">
        <Row>
          {headerContent?.()}
          <Row justify="center" marginLeft="24px">
            <ThemedText.SubHeader>{title}</ThemedText.SubHeader>
          </Row>
          <Box
            sx={{
              cursor: 'pointer',
              'svg>rect': {
                fill: '#717171'
              }
            }}
            onClick={onDismiss}
          >
            <CloseSvg />
          </Box>
        </Row>
        {topContent()}
      </AutoColumn>
      {bottomContent && <BottomSection gap="16px">{bottomContent()}</BottomSection>}
    </Stack>
  )
}

const StyledL2Badge = styled(Badge)`
  padding: 6px 8px;
`

function L2Content({
  onDismiss,
  chainId,
  hash,
  pendingText,
  inline
}: {
  onDismiss: () => void
  hash?: string
  chainId: SupportedL2ChainId
  currencyToAdd?: Currency
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  const theme = useTheme()

  const transaction = useTransaction(hash)
  const confirmed = useIsTransactionConfirmed(hash)
  const transactionSuccess = transaction?.receipt?.status === 1

  // convert unix time difference to seconds
  const secondsToConfirm = transaction?.confirmedTime
    ? (transaction.confirmedTime - transaction.addedTime) / 1000
    : undefined

  const info = getChainInfo(chainId)

  return (
    <Stack
      sx={{
        backgroundColor: '#1b1b1b',
        borderRadius: '20px',
        // outline: '1px solid #fff',
        width: '100%',
        padding: 16
      }}
    >
      <AutoColumn>
        {!inline && (
          <RowBetween mb="16px">
            <StyledL2Badge>
              <RowFixed gap="sm">
                <ChainLogo chainId={chainId} />
                <ThemedText.SubHeaderSmall>{info.label}</ThemedText.SubHeaderSmall>
              </RowFixed>
            </StyledL2Badge>
            <Box
              sx={{
                cursor: 'pointer',
                'svg>rect': {
                  fill: '#717171'
                }
              }}
              onClick={onDismiss}
            >
              <CloseSvg />
            </Box>
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          {confirmed ? (
            transactionSuccess ? (
              // <CheckCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.success} />
              <AnimatedConfirmation />
            ) : (
              <AlertCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.critical} />
            )
          ) : // <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
          null}
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center">
          <ThemedText.SubHeaderLarge textAlign="center">
            {!hash ? (
              <Typography>Confirm transaction in wallet</Typography>
            ) : !confirmed ? (
              <Typography>Transaction submitted</Typography>
            ) : transactionSuccess ? (
              <Typography>Success</Typography>
            ) : (
              <Typography>Error</Typography>
            )}
          </ThemedText.SubHeaderLarge>
          <ThemedText.BodySecondary textAlign="center">
            {transaction ? <TransactionSummary info={transaction.info} /> : pendingText}
          </ThemedText.BodySecondary>
          {chainId && hash ? (
            <ExternalLink href={getEtherscanLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <ThemedText.SubHeaderSmall color={theme.accent1}>
                <Typography>View on Explorer</Typography>
              </ThemedText.SubHeaderSmall>
            </ExternalLink>
          ) : (
            <div style={{ height: '17px' }} />
          )}
          <ThemedText.SubHeaderSmall color={theme.neutral3} marginTop="20px">
            {!secondsToConfirm ? (
              <div style={{ height: '24px' }} />
            ) : (
              <div>
                <Typography>Transaction completed in </Typography>
                <span style={{ fontWeight: 535, marginLeft: '4px', color: theme.neutral1 }}>
                  {secondsToConfirm} seconds 🎉
                </span>
              </div>
            )}
          </ThemedText.SubHeaderSmall>
          <ButtonPrimary onClick={onDismiss} style={{ margin: '4px 0 0 0' }}>
            {inline ? <Typography>Return</Typography> : <Typography>Close</Typography>}
          </ButtonPrimary>
        </AutoColumn>
      </AutoColumn>
    </Stack>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash?: string
  reviewContent: () => ReactNode
  attemptingTxn: boolean
  pendingText: ReactNode
  currencyToAdd?: Currency
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  reviewContent,
  currencyToAdd
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90} maxWidth={640}>
      {isL2ChainId(chainId) && (hash || attemptingTxn) ? (
        <L2Content chainId={chainId} hash={hash} onDismiss={onDismiss} pendingText={pendingText} />
      ) : attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        reviewContent()
      )}
    </Modal>
  )
}
