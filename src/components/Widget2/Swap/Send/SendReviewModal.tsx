import { ChainId } from '@uniswap/sdk-core'
import { ButtonPrimary } from '../../components/Button'
import GetHelp from '../../components/Button/GetHelp'
import Column, { ColumnCenter } from '../../components/Column'
import { ChainLogo } from '../../components/Logo/ChainLogo'
import Modal from '../../components/Modal'
import Row from '../../components/Row'
import { useStablecoinValue } from '../../hooks/useStablecoinPrice'
import { ReactNode } from 'react'
import { useSendContext } from '../../state/send/SendContext'
import styled from 'styled-components'
import { Separator, ThemedText } from '../../theme/components'
import CloseSvg from 'assets/svg/close-light.svg'
// import { FeatureFlags } from '../../lib/uniswap/src/features/experiments/flags'
// import { useFeatureFlag } from '../../lib/uniswap/src/features/experiments/hooks'
// import { useUnitagByNameWithoutFlag } from '../../lib/uniswap/src/features/unitags/hooksWithoutFlags'
import { NumberType, useFormatter } from '../../utils/formatNumbers'
import { shortenAddress } from 'utils'
import { useActiveWeb3React } from 'hooks'
import CurrencyLogo from 'components/Widget2/components/Logo/CurrencyLogo'
import { Box } from '@mui/material'

const ModalWrapper = styled(ColumnCenter)`
  background-color: ${({ theme }) => theme.surface1};
  border-radius: 20px;
  outline: 1px solid ${({ theme }) => theme.surface3};
  width: 100%;
  padding: 8px;
`

// const StyledReviewCloseIcon = styled(CloseIcon)`
//   ${ClickableStyle}
// `

const ReviewContentContainer = styled(Column)`
  width: 100%;
  padding: 12px 16px;
  gap: 16px;
`

const SendModalHeader = ({
  label,
  header,
  subheader,
  image
}: {
  label: ReactNode
  header: ReactNode
  subheader: ReactNode
  image: ReactNode
}) => {
  return (
    <Row justify="space-between" align="center">
      <Column gap="xs">
        <ThemedText.BodySmall color="neutral2" lineHeight="20px">
          {label}
        </ThemedText.BodySmall>
        <ThemedText.HeadlineLarge lineHeight="44px">{header}</ThemedText.HeadlineLarge>
        <ThemedText.BodySmall lineHeight="20px" color="neutral2">
          {subheader}
        </ThemedText.BodySmall>
      </Column>
      <div style={{ height: '36px' }}>{image}</div>
    </Row>
  )
}

export function SendReviewModal({ onConfirm, onDismiss }: { onConfirm: () => void; onDismiss: () => void }) {
  const { chainId } = useActiveWeb3React()
  const {
    sendState: { inputCurrency, inputInFiat, exactAmountFiat },
    derivedSendInfo: { parsedTokenAmount, exactAmountOut, gasFeeCurrencyAmount, recipientData }
  } = useSendContext()
  // const { unitag: recipientUnitag } = useUnitagByNameWithoutFlag(recipientData?.unitag, Boolean(recipientData?.unitag))

  const { formatConvertedFiatNumberOrString, formatCurrencyAmount } = useFormatter()
  const formattedInputAmount = formatCurrencyAmount({
    amount: parsedTokenAmount,
    type: NumberType.TokenNonTx
  })
  const formattedFiatInputAmount = formatConvertedFiatNumberOrString({
    input: (inputInFiat ? exactAmountFiat : exactAmountOut) || '0',
    type: NumberType.PortfolioBalance
  })

  const gasFeeUSD = useStablecoinValue(gasFeeCurrencyAmount)
  const gasFeeFormatted = formatCurrencyAmount({
    amount: gasFeeUSD,
    type: NumberType.PortfolioBalance
  })

  const currencySymbolAmount = `${formattedInputAmount} ${inputCurrency?.symbol ?? inputCurrency?.name}`

  const [primaryInputView, secondaryInputView] = inputInFiat
    ? [formattedFiatInputAmount, currencySymbolAmount]
    : [currencySymbolAmount, formattedFiatInputAmount]

  // const uniconsV2Enabled = useFeatureFlag(FeatureFlags.UniconsV2)

  return (
    <Modal $scrollOverlay isOpen onDismiss={onDismiss} maxHeight={90}>
      <ModalWrapper data-testid="send-review-modal" gap="md">
        <Row width="100%" padding="8px 12px 4px" align="center">
          <Row justify="left">
            <ThemedText.SubHeader>
              <>Review send</>
            </ThemedText.SubHeader>
          </Row>
          <Row justify="right" gap="10px">
            <GetHelp />
            {/* <StyledReviewCloseIcon onClick={onDismiss} /> */}
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
        </Row>
        <ReviewContentContainer>
          <Column gap="lg">
            <SendModalHeader
              label={<>You&apos;re sending</>}
              header={primaryInputView}
              subheader={secondaryInputView}
              image={<CurrencyLogo currency={inputCurrency} size="36px" /*chainId={chainId ?? ChainId.MAINNET}*/ />}
            />
            <SendModalHeader
              label={<>To</>}
              header={
                recipientData?.unitag || recipientData?.ensName ? (
                  <Row gap="xs">
                    <ThemedText.HeadlineLarge>{recipientData.unitag ?? recipientData.ensName}</ThemedText.HeadlineLarge>
                    {/* {recipientData?.unitag && <Icons.Unitag size={18} />} */}
                  </Row>
                ) : recipientData?.address ? (
                  shortenAddress(recipientData?.address)
                ) : (
                  ''
                )
              }
              subheader={(recipientData?.unitag || recipientData?.ensName) && shortenAddress(recipientData.address)}
              image={
                <></>
                // recipientUnitag?.metadata?.avatar ? (
                //   <UniTagProfilePicture account={recipientData?.address ?? ''} size={36} />
                // ) : recipientData?.ensName ? (
                //   <Identicon account={recipientData.address} size={36} />
                // ) : uniconsV2Enabled ? (
                //   <UniconV2 address={recipientData?.address ?? ''} size={36} />
                // ) : (
                //   <Unicon address={recipientData?.address ?? ''} size={36} />
                // )
              }
            />
          </Column>
          <Separator />
          <Row width="100%" justify="space-between">
            <ThemedText.BodySmall color="neutral2" lineHeight="20px">
              <>Network cost</>
            </ThemedText.BodySmall>
            <Row width="min-content" gap="xs">
              <ChainLogo chainId={(chainId as any) ?? ChainId.MAINNET} size={16} />
              <ThemedText.BodySmall>{gasFeeFormatted}</ThemedText.BodySmall>
            </Row>
          </Row>
        </ReviewContentContainer>
        <ButtonPrimary onClick={onConfirm}>
          <>Confirm send</>
        </ButtonPrimary>
      </ModalWrapper>
    </Modal>
  )
}
