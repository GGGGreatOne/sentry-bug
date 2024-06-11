import { ChangeEvent, useCallback } from 'react'
import { Box, useTheme, Typography, Button } from '@mui/material'
import useModal from 'hooks/useModal'
import LogoText from 'components/LogoText'
import SelectCurrencyModal from './SelectCurrencyModal'
import { useActiveWeb3React } from 'hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { Currency, Pair } from '@uniswap/sdk'
import { useCurrencyBalance } from 'components/Widget/hooks/wallet'
import SelectButton from '../../Button/SelectButton'
import InputNumerical from '../InputNumerical'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import { useAllTokens } from 'components/Widget/hooks/Tokens'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'

interface Props {
  currency?: Currency | null
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  placeholder?: string
  selectActive?: boolean
  inputFocused?: boolean
  disableCurrencySelect?: boolean
  onSelectCurrency?: (cur: Currency) => void
  onMax?: () => void
  disableInput?: boolean
  hideBalance?: boolean
  isBlackBg?: boolean
  isSecond?: boolean
  pair?: Pair
}

const trimBalance = (balance: string) => {
  if (balance.length > 11) {
    const str = balance.slice(0, 10)
    return str + '...'
  }
  return balance
}

export default function CurrencyInputPanel({
  value,
  disabled,
  placeholder,
  inputFocused,
  disableCurrencySelect,
  currency,
  onSelectCurrency,
  onChange,
  onMax,
  disableInput,
  hideBalance,
  isBlackBg,
  isSecond,
  pair
}: Props) {
  const { account, chainId } = useActiveWeb3React()

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const { showModal } = useModal()
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const allTokens = useAllTokens()

  const showCurrencySearch = useCallback(() => {
    if (!disableCurrencySelect) {
      showModal(<SelectCurrencyModal allTokens={allTokens} onSelectCurrency={onSelectCurrency} />)
    }
  }, [disableCurrencySelect, showModal, allTokens, onSelectCurrency])

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'flex',
          gap: {
            xs: 12,
            md: 16
          }
        }}
      >
        {/* <InputLabel>Token</InputLabel> */}

        <Box flexGrow={1}>
          <InputNumerical
            isBlackBg={isBlackBg}
            placeholder={placeholder ?? '0.0'}
            value={value.toString()}
            onChange={onChange}
            type={'number'}
            disabled={disabled || disableInput}
            focused={inputFocused}
            height={isDownMd ? 48 : 52}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={8}>
          {currency && onMax && (
            <Button
              variant="text"
              sx={{
                fontSize: 12,
                minWidth: 'unset',
                width: 'max-content',
                height: '32px',
                borderRadius: '8px',
                padding: '8px',
                color: '#ffffff',
                background: '#40444F',
                '&:hover': {
                  background: '#40444F'
                }
              }}
              onClick={onMax}
            >
              MAX
            </Button>
          )}{' '}
          {pair ? (
            <Box
              sx={{
                background: '#0D0D0D10',
                color: '#20201E',
                fontSize: 16,
                fontWeight: 400,
                transition: '.3s',
                padding: '4px 10px 4px 5px',
                position: 'relative',
                width: 'max-content',
                borderRadius: '60px',
                height: 36,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogoText
                logo={<DoubleCurrencyLogo currency0={pair.token0 as any} currency1={pair.token1 as any} />}
                text={'BS-LP'}
                size="24"
              />
            </Box>
          ) : (
            <SelectButton
              width={isDownMd ? '100%' : '286px'}
              onClick={showCurrencySearch}
              disabled={disableCurrencySelect || disabled}
              height={isDownMd ? '48px' : '52px'}
              selected={!!currency}
              style={
                isSecond
                  ? {
                      '&:before': {
                        background: '#0D0D0D10',
                        position: 'absolute',
                        borderRadius: '60px',
                        top: 1,
                        right: 1,
                        bottom: 1,
                        left: 1,
                        content: '""',
                        pointerEvents: 'none !important'
                      },
                      '&:hover, :active': {
                        borderRadius: '60px',

                        backgroundClip: 'padding-box',
                        zIndex: 1,
                        '&:before': { background: '#0D0D0D20' }
                      }
                    }
                  : {}
              }
            >
              {currency ? (
                <LogoText
                  logo={<CurrencyLogo currencyOrAddress={currency as any} />}
                  text={getSymbol(currency, chainId)}
                />
              ) : (
                <>Select Token</>
              )}
            </SelectButton>
          )}
        </Box>
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={9}>
          <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}></Typography>
          <Box display="flex" alignItems={'center'}>
            {!hideBalance && currency && (
              <Typography fontSize={12} sx={{ color: isBlackBg ? '#FFFFFF80' : '#101720' }}>
                Balance:{' '}
                {!!currency && selectedCurrencyBalance ? trimBalance(selectedCurrencyBalance?.toSignificant(6)) : ''}
                {!selectedCurrencyBalance && '-'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
