import Column, { AutoColumn } from '../../components/Column'
import Row from '../../components/Row'
import { useActiveWeb3React } from 'hooks'
import useENSName from 'hooks/useENSName'
import { useGroupedRecentTransfers } from '../../hooks/useGroupedRecentTransfers'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useUnmountingAnimation } from '../../hooks/useUnmountingAnimation'
import { ChangeEvent, ForwardedRef, forwardRef, KeyboardEvent, useCallback, useRef, useState } from 'react'
import { RecipientData } from '../../state/send/hooks'
import { useSendContext } from '../../state/send/SendContext'
import styled, { css, keyframes } from 'styled-components'
import { ClickableStyle, ThemedText } from '../../theme/components'
import { AnimationType } from '../../theme/components/FadePresence'
import { X } from 'react-feather'
// import { FeatureFlags } from '../../lib/uniswap/src/features/experiments/flags'
// import { useFeatureFlag } from '../../lib/uniswap/src/features/experiments/hooks'
import { shortenAddress } from 'utils'

const StyledConfirmedRecipientRow = styled(Row)`
  padding: 6px 0px;
  justify-content: space-between;
`

const StyledConfirmedRecipientDisplayRow = styled(Row)`
  ${ClickableStyle}
`

const StyledCloseIcon = styled(X)`
  color: ${({ theme }) => theme.neutral3};
  ${ClickableStyle}
`

const RecipientWrapper = styled(Column)<{ $disabled?: boolean }>`
  position: relative;
  background-color: ${({ theme }) => theme.surface2};
  border-radius: 16px;
  padding: 12px 16px;
  gap: 4px;
  opacity: ${({ $disabled }) => (!$disabled ? 1 : 0.4)};
  pointer-events: ${({ $disabled }) => (!$disabled ? 'initial' : 'none')};
`

const StyledRecipientInputRow = styled(Row)`
  color: ${({ theme }) => theme.neutral2};
`

const StyledRecipientInput = styled.input`
  background: none;
  width: 100%;
  color: ${({ theme }) => theme.neutral1};
  outline: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  ::placeholder {
    color: ${({ theme }) => theme.neutral3};
  }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-40px) }
  to { opacity: 1; transform: translateY(0px) }
`
const slideInAnimation = css`
  animation: ${slideIn} ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.inOut}`};
`

const slideOut = keyframes`
  from { opacity: 1; transform: translateY(0px) }
  to { opacity: 0; transform: translateY(-40px) }
`
const slideOutAnimation = css`
  animation: ${slideOut} ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.inOut}`};
`

const MenuFlyout = styled(AutoColumn)`
  width: calc(100% - 8px);
  background-color: ${({ theme }) => theme.surface2};
  border: 1px solid ${({ theme }) => theme.surface3};
  box-shadow:
    0px 0px 1px rgba(0, 0, 0, 0.01),
    0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  position: absolute;
  top: 76px;
  left: 4px;
  z-index: 100;
  padding: 16px;
  transition: display ${({ theme }) => `${theme.transition.duration.fast} ${theme.transition.timing.inOut}`};
  ${slideInAnimation}
  &.${AnimationType.EXITING} {
    ${slideOutAnimation}
  }
`

const StyledTransferText = styled(ThemedText.BodySecondary)`
  flex-shrink: 0;
`

const StyledAutocompleteRow = styled(Row)`
  ${ClickableStyle}
`

const AutocompleteRow = ({
  address,
  validatedEnsName,
  numberOfTransfers,
  selectRecipient
}: {
  address: string
  validatedEnsName?: string
  numberOfTransfers: number
  selectRecipient: (recipient: RecipientData) => void
}) => {
  const { account } = useActiveWeb3React()
  const { ENSName } = useENSName(address)
  const cachedEnsName = ENSName || validatedEnsName
  const formattedAddress = shortenAddress(address)

  // const { unitag } = useUnitagByAddressWithoutFlag(address, Boolean(address))

  const boundSelectRecipient = useCallback(
    () =>
      selectRecipient({
        address,
        ensName: cachedEnsName
        // unitag: unitag?.username
      }),
    [address, cachedEnsName, selectRecipient]
  )

  return (
    <StyledAutocompleteRow justify="space-between" padding="8px 0px" onClick={boundSelectRecipient}>
      <Row gap="sm">
        {formattedAddress}
        {/* {unitag?.metadata?.avatar ? address : cachedEnsName ? <Identicon account={address} size={36} /> : address}
        <Column>
          <Row gap="xs">
            <ThemedText.BodyPrimary lineHeight="24px">
              {unitag?.username ?? cachedEnsName ?? formattedAddress}
            </ThemedText.BodyPrimary>
            {unitag?.username && <Icons.Unitag size={18} />}
          </Row>
          {(unitag || cachedEnsName) && (
            <ThemedText.LabelSmall lineHeight="20px">{formattedAddress}</ThemedText.LabelSmall>
          )} 
        </Column>*/}
      </Row>
      {account && <StyledTransferText>{numberOfTransfers}</StyledTransferText>}
    </StyledAutocompleteRow>
  )
}

interface AutocompleteFlyoutProps {
  transfers?: { [address: string]: number }
  validatedRecipientData?: RecipientData
  selectRecipient: (recipient: RecipientData) => void
}

const AutocompleteFlyout = forwardRef((props: AutocompleteFlyoutProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { transfers, validatedRecipientData, selectRecipient } = props

  if (validatedRecipientData) {
    return (
      <MenuFlyout ref={ref}>
        <AutocompleteRow
          address={validatedRecipientData.address}
          validatedEnsName={validatedRecipientData.ensName}
          numberOfTransfers={transfers?.[validatedRecipientData.address] ?? 0}
          selectRecipient={selectRecipient}
        />
      </MenuFlyout>
    )
  }

  if (!transfers) {
    return null
  }

  return (
    <MenuFlyout ref={ref}>
      <ThemedText.SubHeaderSmall>Recents</ThemedText.SubHeaderSmall>
      {Object.keys(transfers)
        .slice(0, 3)
        .map(address => (
          <AutocompleteRow
            key={address}
            address={address}
            numberOfTransfers={transfers[address]}
            selectRecipient={selectRecipient}
          />
        ))}
    </MenuFlyout>
  )
})

AutocompleteFlyout.displayName = 'AutocompleteFlyout'

export function SendRecipientForm({ disabled }: { disabled?: boolean }) {
  const { account } = useActiveWeb3React()
  const { sendState, setSendState, derivedSendInfo } = useSendContext()
  const { recipient } = sendState
  const { recipientData } = derivedSendInfo
  // const unicodeV2Enabled = useFeatureFlag(FeatureFlags.UniconsV2)

  const { transfers: recentTransfers } = useGroupedRecentTransfers(account)

  const [[isFocusing, isForcingFocus], setFocus] = useState([false, false])
  const handleFocus = useCallback((focus: boolean) => setFocus([focus, false]), [])
  const handleForceFocus = useCallback((focus: boolean) => setFocus([focus, true]), [])

  const inputNode = useRef<HTMLInputElement | null>(null)
  const inputWrapperNode = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(inputWrapperNode, isFocusing ? () => handleFocus(false) : undefined)

  const showFlyout = isFocusing && (!!recipientData || !recipient)
  const flyoutRef = useRef<HTMLDivElement>(null)
  useUnmountingAnimation(flyoutRef, () => AnimationType.EXITING)

  const handleInputValidatedRecipient = useCallback(
    (value?: RecipientData) => {
      setSendState(prev => ({
        ...prev,
        recipient: value?.address ?? '',
        validatedRecipient: value
      }))
    },
    [setSendState]
  )

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value
      const inputWithoutSpaces = input.replace(/\s+/g, '')
      setSendState(prev => ({
        ...prev,
        recipient: inputWithoutSpaces,
        validatedRecipient: undefined
      }))
    },
    [setSendState]
  )

  const selectValidatedRecipient = useCallback(
    (value: RecipientData) => {
      if (!recipientData) {
        handleInputValidatedRecipient(value)
      }

      handleFocus(false)
      inputNode.current?.blur()
    },
    [handleFocus, handleInputValidatedRecipient, recipientData]
  )

  const clearValidatedRecipient = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      e.preventDefault()
      e.stopPropagation()
      handleForceFocus(true)
      handleInputValidatedRecipient(undefined)
    },
    [handleForceFocus, handleInputValidatedRecipient]
  )

  const editValidatedRecipient = useCallback(() => {
    handleForceFocus(true)
  }, [handleForceFocus])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (recipientData) {
          inputNode.current?.blur()
          handleFocus(false)
        }
      }
    },
    [handleFocus, recipientData]
  )

  const showInputField = !recipientData || isFocusing || isForcingFocus
  return (
    <RecipientWrapper $disabled={disabled}>
      {showInputField ? (
        <>
          <ThemedText.SubHeaderSmall lineHeight="24px">To</ThemedText.SubHeaderSmall>
          <StyledRecipientInputRow justify="space-between">
            <Row ref={inputWrapperNode}>
              <StyledRecipientInput
                ref={inputNode}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder={recipientData ? '' : `Wallet address or ENS name`}
                pattern="^(0x[a-fA-F0-9]{40})$"
                onChange={handleInput}
                onFocus={() => handleFocus(true)}
                value={recipient}
                onKeyDown={handleEnter}
                autoFocus={isForcingFocus}
              />
              {showFlyout && (
                <AutocompleteFlyout
                  ref={flyoutRef}
                  transfers={recentTransfers}
                  validatedRecipientData={recipientData}
                  selectRecipient={selectValidatedRecipient}
                />
              )}
            </Row>
          </StyledRecipientInputRow>
        </>
      ) : (
        <StyledConfirmedRecipientRow>
          <StyledConfirmedRecipientDisplayRow gap="md" onClick={editValidatedRecipient}>
            {/* {unitagMetadata?.avatar ? (
              <UniTagProfilePicture account={recipientData.address} size={36} />
            ) : recipientData.ensName ? (
              <Identicon account={recipientData.address} size={36} />
            ) : unicodeV2Enabled ? (
              <UniconV2 address={recipientData.address} size={36} />
            ) : (
              <Unicon address={recipientData.address} size={36} />
            )} */}
            <Column>
              <Row gap="xs">
                <ThemedText.BodyPrimary lineHeight="24px">
                  {recipientData.unitag ?? recipientData.ensName ?? shortenAddress(recipientData.address)}
                </ThemedText.BodyPrimary>
                {/* {recipientData.unitag && <Icons.Unitag size={18} />} */}
              </Row>
              {Boolean(recipientData.ensName) && (
                <ThemedText.LabelMicro lineHeight="16px">{shortenAddress(recipientData.address)}</ThemedText.LabelMicro>
              )}
            </Column>
          </StyledConfirmedRecipientDisplayRow>
          <StyledCloseIcon size={20} onClick={clearValidatedRecipient} />
        </StyledConfirmedRecipientRow>
      )}
    </RecipientWrapper>
  )
}
