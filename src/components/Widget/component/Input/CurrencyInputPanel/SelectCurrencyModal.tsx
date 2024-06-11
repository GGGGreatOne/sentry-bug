import React, { useState, useCallback, useMemo, KeyboardEvent, useRef, ChangeEvent } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { FixedSizeList } from 'react-window'
import Modal from 'components/Modal'
import CurrencyList from './CurrencyList'
import Input from 'components/Input'
// import QuestionHelper from 'components/essential/QuestionHelper'

import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils'
import { ChainId, Currency, ETHER, Token } from '@uniswap/sdk'

// import { HelperText } from 'constants/helperText'
import useBreakpoint from 'hooks/useBreakpoint'

import { useToken } from 'hooks/useToken'
import { useTokenComparator } from 'components/Widget/utils/sorting'
import { COMMON_CURRENCIES } from 'components/Widget/constant'
import { filterTokens, useSortedTokensByQuery } from 'components/Widget/utils/filtering'

export default function SelectCurrencyModal({
  onSelectCurrency,
  allTokens
}: {
  allTokens: { [address: string]: Token }
  onSelectCurrency?: (currency: Currency) => void
}) {
  const isDownMd = useBreakpoint('md')
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder] = useState<boolean>(false)

  const fixedList = useRef<FixedSizeList>()

  const debouncedQuery = useDebounce(searchQuery, 200)

  // if they input an address, use it
  const _searchToken = useToken(debouncedQuery)
  const searchToken = useMemo(
    () =>
      _searchToken &&
      new Token(
        _searchToken?.chainId as unknown as ChainId,
        _searchToken?.address,
        _searchToken?.decimals,
        _searchToken.symbol
      ),
    [_searchToken]
  )

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)
  //const filteredSortedTokensNFT = useSortedTokensByQuery(sortedTokens, debouncedQueryNFT)

  const commonCur = useMemo(() => {
    const curList: Currency[] = [ETHER]
    Object.keys(allTokens)
      .map(key => {
        const token = allTokens[key as keyof typeof allTokens]
        if (token?.symbol && COMMON_CURRENCIES.includes(token.symbol)) {
          curList.push(token)
        }
      })
      .slice(0, 4)
    return curList
  }, [allTokens])

  // manage focus on modal show
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          onSelectCurrency && onSelectCurrency(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            onSelectCurrency && onSelectCurrency(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, onSelectCurrency, debouncedQuery]
  )

  return (
    <>
      <Modal width="100%" maxWidth="488px" closeIcon padding={isDownMd ? '28px 16px' : '32px 32px'} hasBorder={false}>
        <Box width="100%" display="flex" gap={14} alignItems="center">
          <Typography
            variant="h5"
            sx={{
              fontSize: 18
            }}
          >
            Select a Token
          </Typography>
          {/* <QuestionHelper
            text={mode === Mode.ERC20 ? HelperText.selectToken : HelperText.selectNft}
            size={isDownMd ? 18.33 : 22}
            style={{ color: theme.palette.text.secondary }}
          /> */}
        </Box>

        <Box paddingTop={'24px'} position="relative">
          <CurrencyList
            currencyOptions={filteredSortedTokens}
            onSelectCurrency={onSelectCurrency}
            fixedListRef={fixedList}
            showETH={showETH}
            searchToken={searchToken}
            commonCurlist={commonCur}
          >
            <Input
              value={searchQuery}
              onChange={handleInput}
              placeholder="Search name or paste address"
              onKeyDown={handleEnter}
              height={48}
              borderRadius="60px"
            />
          </CurrencyList>
          <Box
            sx={{
              pointerEvents: 'none',
              position: 'absolute',
              bottom: 0,
              height: 50,
              width: '100%',
              background: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.palette.background.paper} 100%);`
            }}
          />
        </Box>
      </Modal>
    </>
  )
}
