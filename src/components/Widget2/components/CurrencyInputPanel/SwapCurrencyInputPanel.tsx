import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { AutoColumn } from '../Column'
import { LoadingOpacityContainer } from '../Loader/styled'
import { StyledNumericalInput } from '../NumericalInput'
import PrefetchBalancesWrapper from '../PrefetchBalancesWrapper/PrefetchBalancesWrapper'
import Tooltip from '../Tooltip'
import { isSupportedChain } from '../../constants/chains'
import ms from 'ms'
import { darken } from 'polished'
import { ReactNode, forwardRef, useCallback, useEffect, useState } from 'react'
import { Lock } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { ThemedText } from '../../theme/components'
import { flexColumnNoWrap, flexRowNoWrap } from '../../theme/styles'
import { NumberType, useFormatter } from '../../utils/formatNumbers'
import { CurrencySearchFilters } from '../SearchModal/CurrencySearch'
import { ButtonGray } from '../Button'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { FiatValue } from './FiatValue'
import { formatCurrencySymbol } from './utils'
import { useActiveWeb3React } from 'hooks'
import useCurrencyBalance from 'components/Widget2/lib/hooks/useCurrencyBalance'
import { WhiteDropDown, DarkDropDown } from '../Icons/DropDown'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Typography } from '@mui/material'

export const InputPanel = styled.div<{ $hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ $hideInput }) => ($hideInput ? '16px' : '20px')};
  z-index: 1;
  width: ${({ $hideInput }) => ($hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
`

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const Container = styled.div<{ $hideInput: boolean }>`
  min-height: 44px;
  border-radius: ${({ $hideInput }) => ($hideInput ? '16px' : '20px')};
  width: ${({ $hideInput }) => ($hideInput ? '100%' : 'initial')};
`

export const CurrencySelect = styled(ButtonGray)<{
  visible: boolean
  selected: boolean
  $hideInput?: boolean
  disabled?: boolean
  $animateShake?: boolean
  $isWhiteBg?: boolean
}>`
  align-items: center;
  background-color: ${({ selected, $isWhiteBg }) =>
    selected ? ($isWhiteBg ? '#0D0D0D1A' : '#fff') : $isWhiteBg ? '#0D0D0D1A' : '#1b1b1b'};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  color: ${({ selected, theme, $isWhiteBg }) =>
    selected ? '#121212' : $isWhiteBg ? '#121212' : theme.neutralContrast};
  cursor: pointer;
  height: 36px;
  border-radius: 18px;
  outline: none;
  user-select: none;
  font-size: 16px;
  font-weight: 485;
  width: ${({ $hideInput }) => ($hideInput ? '100%' : 'initial')};
  padding: ${({ selected }) => (selected ? '4px 16px' : '6px 6px 6px 8px')};
  gap: 8px;
  justify-content: space-between;
  margin-left: ${({ $hideInput }) => ($hideInput ? '0' : '12px')};
  box-shadow: ${({ theme }) => theme.deprecated_shallowShadow};

  &:hover,
  &:active {
    background-color: ${({ selected, $isWhiteBg }) =>
      selected ? ($isWhiteBg ? '#12121240' : 'rgba(255, 255,255,0.8)') : $isWhiteBg ? '#12121240' : 'transparent'};
  }

  &:before {
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';
  }

  &:hover:before {
    background-color: ${({ theme }) => theme.deprecated_stateOverlayHover};
  }

  &:active:before {
    background-color: ${({ theme }) => theme.deprecated_stateOverlayPressed};
  }

  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};

  @keyframes horizontal-shaking {
    0% {
      transform: translateX(0);
      animation-timing-function: ease-in-out;
    }
    20% {
      transform: translateX(10px);
      animation-timing-function: ease-in-out;
    }
    40% {
      transform: translateX(-10px);
      animation-timing-function: ease-in-out;
    }
    60% {
      transform: translateX(10px);
      animation-timing-function: ease-in-out;
    }
    80% {
      transform: translateX(-10px);
      animation-timing-function: ease-in-out;
    }
    100% {
      transform: translateX(0);
      animation-timing-function: ease-in-out;
    }
  }
  animation: ${({ $animateShake }) => ($animateShake ? 'horizontal-shaking 300ms' : 'none')};
`

const InputRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
`

const LabelRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  color: ${({ theme }) => theme.neutral2};
  font-size: 0.75rem;
  line-height: 1rem;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.neutral2)};
  }
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  min-height: 24px;
  padding: 8px 0px 0px 0px;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: 16px;
  font-weight: 500;
`

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 535;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  padding: 4px 6px;
  pointer-events: ${({ disabled }) => (!disabled ? 'initial' : 'none')};

  :hover {
    opacity: ${({ disabled }) => (!disabled ? 0.8 : 0.4)};
  }

  :focus {
    outline: none;
  }
`

interface SwapCurrencyInputPanelProps {
  boxId: string
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label: ReactNode
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: { data?: number; isLoading: boolean }
  priceImpact?: Percent
  id: string
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  loading?: boolean
  disabled?: boolean
  currencySearchFilters?: CurrencySearchFilters
  numericalInputSettings?: {
    disabled?: boolean
    onDisabledClick?: () => void
    disabledTooltipBody?: ReactNode
  }
}

const SwapCurrencyInputPanel = forwardRef<HTMLInputElement, SwapCurrencyInputPanelProps>(
  (
    {
      boxId,
      value,
      onUserInput,
      onMax,
      showMaxButton,
      onCurrencySelect,
      currency,
      otherCurrency,
      id,
      renderBalance,
      fiatValue,
      priceImpact,
      hideBalance = false,
      pair = null, // used for double token logo
      hideInput = false,
      locked = false,
      loading = false,
      disabled = false,
      currencySearchFilters,
      numericalInputSettings,
      label,
      ...rest
    },
    ref
  ) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { account, chainId } = useActiveWeb3React()
    const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
    const theme = useTheme()
    const { formatCurrencyAmount } = useFormatter()

    const handleDismissSearch = useCallback(() => {
      setModalOpen(false)
    }, [setModalOpen])

    const [tooltipVisible, setTooltipVisible] = useState(false)
    const handleDisabledNumericalInputClick = useCallback(() => {
      if (numericalInputSettings?.disabled && !tooltipVisible) {
        setTooltipVisible(true)
        setTimeout(() => setTooltipVisible(false), ms('4s')) // reset shake animation state after 4s
        numericalInputSettings.onDisabledClick?.()
      }
    }, [tooltipVisible, numericalInputSettings])

    const chainAllowed = isSupportedChain(chainId)

    // reset tooltip state when currency changes
    useEffect(() => setTooltipVisible(false), [currency])

    const isWhiteBg = id === 'swap-currency-output'
    return (
      <InputPanel id={id} $hideInput={hideInput} {...rest}>
        {locked && (
          <FixedContainer>
            <AutoColumn gap="sm" justify="center">
              <Lock />
              <ThemedText.BodyPrimary variant="body2" textAlign="center" px="$spacing12">
                <>The market price is outside your specified price range. Single-asset deposit only.</>
              </ThemedText.BodyPrimary>
            </AutoColumn>
          </FixedContainer>
        )}

        <Container $hideInput={hideInput}>
          <Typography
            variant="h5"
            sx={{
              fontSize: 16,
              fontWeight: 500,
              mb: '10px'
            }}
          >
            {label}
          </Typography>
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}>
            {!hideInput && (
              <div style={{ display: 'flex', flexGrow: 1 }} onClick={handleDisabledNumericalInputClick}>
                <StyledNumericalInput
                  isWhiteBg={isWhiteBg}
                  className="token-amount-input"
                  value={value}
                  onUserInput={onUserInput}
                  disabled={!chainAllowed || disabled || numericalInputSettings?.disabled}
                  $loading={loading}
                  id={id}
                  ref={ref}
                  maxDecimals={currency?.decimals}
                />
              </div>
            )}
            <PrefetchBalancesWrapper shouldFetchOnAccountUpdate={modalOpen}>
              <Tooltip
                show={tooltipVisible && !modalOpen}
                placement="bottom"
                offsetY={14}
                text={numericalInputSettings?.disabledTooltipBody}
              >
                <CurrencySelect
                  $isWhiteBg={isWhiteBg}
                  disabled={!chainAllowed || disabled}
                  visible={currency !== undefined}
                  selected={!!currency}
                  $hideInput={hideInput}
                  className="open-currency-select-button"
                  onClick={() => {
                    if (onCurrencySelect) {
                      setModalOpen(true)
                    }
                  }}
                  $animateShake={tooltipVisible}
                >
                  <Aligner>
                    <RowFixed>
                      {pair ? (
                        <span style={{ marginRight: '0.5rem' }}>
                          <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                        </span>
                      ) : currency ? (
                        <CurrencyLogo
                          style={{ marginRight: '2px' }}
                          currencyOrAddress={currency.isNative ? currency : currency.address}
                          size="24px"
                        />
                      ) : null}
                      {pair ? (
                        <StyledTokenName className="pair-name-container">
                          {pair?.token0.symbol?.toLocaleUpperCase()}:{pair?.token1.symbol?.toLocaleUpperCase()}
                        </StyledTokenName>
                      ) : (
                        <StyledTokenName
                          className="token-symbol-container"
                          active={Boolean(currency && currency.symbol)}
                        >
                          {currency ? (
                            formatCurrencySymbol(currency) === 'ETH' ? (
                              'BB'
                            ) : (
                              formatCurrencySymbol(currency)
                            )
                          ) : (
                            <>Select token</>
                          )}
                        </StyledTokenName>
                      )}
                    </RowFixed>
                    {onCurrencySelect && (
                      <>{!!currency || id === 'swap-currency-output' ? <DarkDropDown /> : <WhiteDropDown />}</>
                    )}
                  </Aligner>
                </CurrencySelect>
              </Tooltip>
            </PrefetchBalancesWrapper>
          </InputRow>
          {Boolean(!hideInput && !hideBalance) && (
            <FiatRow>
              <RowBetween>
                <LoadingOpacityContainer $loading={loading}>
                  {fiatValue && (
                    <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} testId={`fiat-value-${id}`} />
                  )}
                </LoadingOpacityContainer>
                {account ? (
                  <RowFixed style={{ height: '16px' }}>
                    <ThemedText.DeprecatedBody
                      data-testid="balance-text"
                      color={theme.neutral2}
                      fontWeight={485}
                      fontSize={14}
                      style={{ display: 'inline' }}
                    >
                      {!hideBalance && currency && selectedCurrencyBalance ? (
                        renderBalance ? (
                          renderBalance(selectedCurrencyBalance)
                        ) : (
                          <>
                            Balance:{' '}
                            {formatCurrencyAmount({
                              amount: selectedCurrencyBalance,
                              type: NumberType.TokenNonTx
                            })}
                          </>
                        )
                      ) : null}
                    </ThemedText.DeprecatedBody>
                    {showMaxButton && selectedCurrencyBalance ? (
                      <StyledBalanceMax onClick={onMax}>
                        <>Max</>
                      </StyledBalanceMax>
                    ) : null}
                  </RowFixed>
                ) : (
                  <span />
                )}
              </RowBetween>
            </FiatRow>
          )}
        </Container>
        {onCurrencySelect && (
          <CurrencySearchModal
            boxId={boxId}
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            currencySearchFilters={currencySearchFilters}
          />
        )}
      </InputPanel>
    )
  }
)
SwapCurrencyInputPanel.displayName = 'SwapCurrencyInputPanel'

export default SwapCurrencyInputPanel
