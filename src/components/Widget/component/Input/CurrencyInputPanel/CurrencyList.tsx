import React, { MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled, ButtonBase } from '@mui/material'
import useModal from 'hooks/useModal'
import { Currency } from '@uniswap/sdk'
import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
import { CurrencyListComponent } from './ListComponent'
import _CurrencyLogo from '../../CurrencyLogo'
import { getName, getSymbol } from 'components/Widget/utils/getSymbol'
import { useActiveWeb3React } from 'hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'

interface Props {
  selectedCurrency?: Currency | null
  onSelectCurrency?: (currency: Currency) => void
  currencyOptions: Currency[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH?: boolean
  searchToken?: Currency | null | undefined
  searchTokenIsAdded?: boolean
  commonCurlist?: Currency[]
  children?: React.ReactNode
}

const ListItem = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  padding: '0 16px',
  height: '48px',
  justifyContent: 'space-between'
})

const listHeight = '360px'
export default function CurrencyList({
  searchToken,
  searchTokenIsAdded,
  commonCurlist,
  onSelectCurrency,
  children,
  currencyOptions,
  fixedListRef,
  showETH
}: Props) {
  const { hideModal } = useModal()

  const { chainId } = useActiveWeb3React()

  const onClick = useCallback(() => {
    onSelectCurrency && searchToken && onSelectCurrency(searchToken)
    hideModal()
  }, [hideModal, onSelectCurrency, searchToken])

  function filterByProperty<T extends Currency>(arr: T[]): T[] {
    const uniqueArr: T[] = []

    for (const item of arr) {
      if (!uniqueArr.includes(item)) {
        uniqueArr.push(item)
      }
    }

    return uniqueArr
  }
  const filteredOptions = filterByProperty(currencyOptions)

  return (
    <>
      <Divider sx={{ mb: 20 }} />
      {children}
      <Box display="flex" gap={20} margin="20px 0" flexWrap={'wrap'}>
        {commonCurlist?.map((currency: Currency) => (
          <ButtonBase
            onClick={() => {
              onSelectCurrency && onSelectCurrency(currency)
              hideModal()
            }}
            key={currency.symbol}
            sx={{
              borderRadius: '40px',
              background: theme => theme.palette.background.default,
              padding: '11px 16px',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <LogoText logo={<_CurrencyLogo currency={currency} />} text={getSymbol(currency, chainId)} />
          </ButtonBase>
        ))}
      </Box>
      <Divider />
      <Box height={listHeight} overflow="auto" paddingTop={'24px'} position="relative">
        {searchToken && !searchTokenIsAdded ? (
          <ListItem onClick={onClick} style={{ alignItems: 'center' }}>
            <Box width={'100%'} display="flex" justifyContent={'space-between'} alignItems={'center'}>
              <CurrencyLogo currencyOrAddress={searchToken as any} style={{ width: '30px', height: '30px' }} />
              <Box display="flex" flexDirection="column" marginLeft="16px" alignItems={'center'}>
                <Typography variant="inherit">{getSymbol(searchToken, chainId)}</Typography>
                <Typography variant="caption">{getName(searchToken, chainId)}</Typography>
              </Box>
            </Box>
          </ListItem>
        ) : filteredOptions?.length > 0 || filteredOptions?.length > 0 ? (
          <CurrencyListComponent
            onSelect={onSelectCurrency}
            options={filteredOptions}
            fixedListRef={fixedListRef}
            showETH={showETH}
          />
        ) : (
          <Box width={'100%'} display="flex" alignItems="center" justifyContent="center" height="60%">
            <Typography textAlign="center" mb="20px" fontSize={16} fontWeight={500}>
              No results found
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}
