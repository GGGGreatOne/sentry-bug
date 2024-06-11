import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { LoadingOpacityContainer, loadingOpacityMixin } from '../Loader/styled'
import PrefetchBalancesWrapper from '../PrefetchBalancesWrapper/PrefetchBalancesWrapper'
import { isSupportedChain } from '../../constants/chains'
import { darken } from 'polished'
import { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'
import { BREAKPOINTS } from '../../theme'
import { ThemedText } from '../../theme/components'
import { flexColumnNoWrap, flexRowNoWrap } from '../../theme/styles'
import { NumberType, useFormatter } from '../../utils/formatNumbers'
import { CurrencySearchFilters } from '../SearchModal/CurrencySearch'
import { BaseButton } from '../Button'
import DoubleCurrencyLogo from '../DoubleLogo'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween, RowFixed } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { FiatValue } from './FiatValue'
import useCurrencyBalance from 'components/Widget2/lib/hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import { WhiteDropDown, DarkDropDown } from '../Icons/DropDown'
import { Stack, Typography } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'

const InputPanel = styled.div<{ $hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ $hideInput }) => ($hideInput ? '16px' : '20px')};
  background-color: ${({ theme, $hideInput }) => ($hideInput ? 'transparent' : theme.surface2)};

  z-index: 1;
  width: ${({ $hideInput }) => ($hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
`

const Container = styled.div<{ $hideInput: boolean; disabled: boolean }>`
  border-radius: ${({ $hideInput }) => ($hideInput ? '16px' : '20px')};
  border: 1px solid ${({ theme }) => theme.surface3};
  background-color: #fff;
  width: ${({ $hideInput }) => ($hideInput ? '100%' : 'initial')};
  ${({ theme, $hideInput, disabled }) =>
    !disabled &&
    `
    :focus,
    :hover {
      // border: 1px solid ${$hideInput ? ' transparent' : theme.surface2};
    }
  `}
`

const CurrencySelect = styled(BaseButton)<{
  visible: boolean
  selected: boolean
  $hideInput?: boolean
  disabled?: boolean
  pointerEvents?: string
  bgColor?: string
  fColor?: string
}>`
  align-items: center;
  background-color: ${({ selected, bgColor }) => (selected ? (bgColor ? bgColor : '#0D0D0D1A') : '#1b1b1b')};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  box-shadow: ${({ theme }) => theme.deprecated_shallowShadow};
  color: ${({ selected }) => (selected ? '#121212' : '#1b1b1b')};
  cursor: pointer;
  border-radius: 16px;
  outline: none;
  user-select: none;
  border: none;
  font-size: 24px;
  font-weight: 500;
  height: ${({ $hideInput }) => ($hideInput ? '2.8rem' : '2.4rem')};
  width: ${({ $hideInput }) => ($hideInput ? '100%' : 'initial')};
  padding: 0 8px;
  justify-content: space-between;
  margin-left: ${({ $hideInput }) => ($hideInput ? '0' : '12px')};
  :focus,
  :hover {
    background-color: transparent;
  }
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  ${({ pointerEvents }) => pointerEvents && `pointer-events: none`}
`

const InputRow = styled.div<{ selected: boolean }>`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
  padding: ${({ selected }) => (selected ? ' 1rem 1rem 0.75rem 1rem' : '1rem 1rem 1rem 1rem')};
`

const LabelRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  color: ${({ theme }) => theme.neutral1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0 1rem 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.neutral2)};
  }
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  padding: 0px 1rem 0.75rem;
  height: 32px;
`

// note the line height 0 ensures even if we change font/font-size it doesn't break centering

const StyledTokenName = styled.span<{ active?: boolean; fColor?: string }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: 20px;
  color: ${({ fColor }) => (fColor ? fColor : '#fff')};
  white-space: nowrap;

  @media screen and (max-width: ${BREAKPOINTS.sm}px) {
    font-size: 16px;
  }
`

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: #40444f;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-left: 0.25rem;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  padding: 8px;
  pointer-events: ${({ disabled }) => (!disabled ? 'initial' : 'none')};

  :hover {
    opacity: ${({ disabled }) => (!disabled ? 0.8 : 0.4)};
  }

  :focus {
    outline: none;
  }
`

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  color: #20201e;
  font-size: 28px;
  font-weight: 500;
  text-align: left;
`

const StyledPrefetchBalancesWrapper = styled(PrefetchBalancesWrapper)<{ $fullWidth: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`

interface CurrencyInputPanelProps {
  boxId: string
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: ReactNode
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: { data?: number; isLoading: boolean }
  id: string
  showCurrencyAmount?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  loading?: boolean
  currencySearchFilters?: CurrencySearchFilters
  bgColor?: string
  fColor?: string
}

export default function CurrencyInputPanel({
  boxId,
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  currencySearchFilters,
  showCurrencyAmount,
  renderBalance,
  fiatValue,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  loading = false,
  bgColor,
  fColor,
  ...rest
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const isSm = useBreakpoint('sm')
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { formatCurrencyAmount } = useFormatter()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const chainAllowed = isSupportedChain(chainId)

  return (
    <InputPanel id={id} $hideInput={hideInput} {...rest}>
      {!locked && (
        <>
          <Container $hideInput={hideInput} disabled={!chainAllowed}>
            <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={!onCurrencySelect}>
              {!hideInput && (
                <StyledNumericalInput
                  className="token-amount-input"
                  style={{ flex: 1, fontSize: 28, padding: '4px 6px', border: 'none', outline: 'none' }}
                  value={value}
                  onUserInput={onUserInput}
                  disabled={false}
                  $loading={loading}
                  maxDecimals={currency?.decimals}
                />
              )}

              <StyledPrefetchBalancesWrapper shouldFetchOnAccountUpdate={modalOpen} $fullWidth={hideInput}>
                <CurrencySelect
                  disabled={!chainAllowed}
                  visible={currency !== undefined}
                  selected={!!currency}
                  $hideInput={hideInput}
                  bgColor={bgColor}
                  fColor={fColor}
                  className="open-currency-select-button"
                  style={{ width: '100%!important', backgroundColor: !!currency ? '#1b1b1b' : 'unset' }}
                  onClick={() => {
                    if (onCurrencySelect) {
                      setModalOpen(true)
                    }
                  }}
                  pointerEvents={!onCurrencySelect ? 'none' : undefined}
                >
                  <Stack
                    direction={'row'}
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      lineHeight: '0px'
                    }}
                  >
                    <Stack style={{ flex: 1 }} direction={'row'} alignItems={'center'}>
                      {pair ? (
                        <span style={{ marginRight: '0.5rem' }}>
                          <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                        </span>
                      ) : (
                        currency && (
                          <Stack
                            sx={{
                              '& svg': {
                                fill: fColor ? fColor : '#fff'
                              }
                            }}
                          >
                            <CurrencyLogo
                              style={{
                                marginRight: '0.5rem'
                              }}
                              currency={currency}
                              size="24px"
                            />
                          </Stack>
                        )
                      )}
                      {pair ? (
                        <StyledTokenName
                          className="pair-name-container"
                          style={{ width: '100%', color: '#fff', fontSize: isSm ? '15px' : '20px' }}
                        >
                          {pair?.token0.symbol?.toLocaleUpperCase() === 'ETH'
                            ? 'BB'
                            : pair?.token0.symbol?.toLocaleUpperCase()}
                          :
                          {pair?.token1.symbol?.toLocaleUpperCase() === 'ETH'
                            ? 'BB'
                            : pair?.token1.symbol?.toLocaleUpperCase()}
                        </StyledTokenName>
                      ) : (
                        <StyledTokenName
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            color: '#fff'
                          }}
                          className="token-symbol-container"
                          active={Boolean(currency && currency.symbol)}
                          fColor={fColor}
                        >
                          {(currency && currency.symbol && currency.symbol.length > 20
                            ? currency.symbol.slice(0, 4) +
                              '...' +
                              currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                            : currency?.symbol?.toLocaleUpperCase() === 'ETH'
                              ? 'BB'
                              : currency?.symbol?.toLocaleUpperCase()) || (
                            <Typography style={{ color: '#121212', fontSize: isSm ? '15px' : '20px', width: '100%' }}>
                              Select a Token
                            </Typography>
                          )}
                        </StyledTokenName>
                      )}
                    </Stack>
                    {onCurrencySelect && <Stack>{!!currency ? <WhiteDropDown /> : <DarkDropDown />}</Stack>}
                  </Stack>
                </CurrencySelect>
              </StyledPrefetchBalancesWrapper>
            </InputRow>
            {Boolean(!hideInput && !hideBalance && currency) && (
              <FiatRow>
                <RowBetween>
                  <LoadingOpacityContainer $loading={loading}>
                    {fiatValue && <FiatValue fiatValue={fiatValue} />}
                  </LoadingOpacityContainer>
                  {account && (
                    <RowFixed style={{ height: '17px' }}>
                      <ThemedText.DeprecatedBody
                        onClick={onMax}
                        fontWeight={500}
                        fontSize={13}
                        style={{ display: 'inline', cursor: 'pointer' }}
                      >
                        {Boolean(!hideBalance && currency && selectedCurrencyBalance) &&
                          (renderBalance?.(selectedCurrencyBalance as CurrencyAmount<Currency>) || (
                            <Typography color={'#101720'}>
                              Balance:{' '}
                              {formatCurrencyAmount({
                                amount: selectedCurrencyBalance,
                                type: NumberType.TokenNonTx
                              })}
                            </Typography>
                          ))}
                      </ThemedText.DeprecatedBody>
                      {Boolean(showMaxButton && selectedCurrencyBalance) && (
                        <StyledBalanceMax onClick={onMax}>
                          <>MAX</>
                        </StyledBalanceMax>
                      )}
                    </RowFixed>
                  )}
                </RowBetween>
              </FiatRow>
            )}
          </Container>
        </>
      )}
      {onCurrencySelect && (
        <CurrencySearchModal
          boxId={boxId}
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCurrencyAmount={showCurrencyAmount}
          currencySearchFilters={currencySearchFilters}
        />
      )}
    </InputPanel>
  )
}
