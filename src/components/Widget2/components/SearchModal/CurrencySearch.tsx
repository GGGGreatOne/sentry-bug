import { Currency as Token } from '@uniswap/sdk-core'
// import { ChainSelector } from 'components/NavBar/ChainSelector'
import { useCurrencySearchResults } from '../SearchModal/useCurrencySearchResults'
import useDebounce from 'hooks/useDebounce'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
//  import useSelectChain from 'hooks/useSelectChain'
import SearchSvg from 'assets/svg/search.svg'
import useToggle from '../../hooks/useToggle'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import Input from 'components/Input'
import { Text } from 'rebass'
import styled from 'styled-components'
import CloseSvg from 'assets/svg/close-light.svg'
import { FeatureFlags } from '../../lib/uniswap/src/features/experiments/flags'
import { useFeatureFlag } from '../../lib/uniswap/src/features/experiments/hooks'
import Column from '../Column'
import Row, { RowBetween } from '../Row'
import CommonBases from './CommonBases'
import { PaddedColumn, Separator } from './styled'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'
import { Box, Stack, Typography } from '@mui/material'
// import { TokenType } from 'api/boxes/type'
import { useToken } from 'components/Widget2/hooks/Tokens'
import CurrencyLogo from 'components/essential/CurrencyLogo'
// import { useGetBoxTokenList } from 'hooks/boxes/useGetBoxTokenList'
import { useCurrencyBalance } from 'hooks/useToken'
import { Dots } from 'components/Widget2/Pool/styled'
import { useWidgetData } from 'components/Widget/hooks/Box'
import { TokenInfo } from '@uniswap/token-lists'

const ContentWrapper = styled(Column)`
  background-color: ${({ theme }) => theme.surface1};
  width: 100%;
  overflow: hidden;
  flex: 1 1;
  position: relative;
  border-radius: 20px;
`
export const InputStyle = styled(Input)`
  &.MuiInputBase-root {
    width: 100%;
    height: 44px;
    border-radius: 6px;
    background: var(--ps-text-10);
    padding-left: 44px;
    padding-right: 24px;
  }

  & .MuiInputBase-input::placeholder {
    color: var(--ps-neutral3, red);
    /* D/body3 */
    font-family: 'SF Pro Display';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 18.2px */
  }
`

export interface CurrencySearchFilters {
  showCommonBases?: boolean
  disableNonToken?: boolean
  onlyShowCurrenciesWithBalance?: boolean
}

const DEFAULT_CURRENCY_SEARCH_FILTERS: CurrencySearchFilters = {
  showCommonBases: true,
  disableNonToken: false,
  onlyShowCurrenciesWithBalance: false
}

interface CurrencySearchProps {
  boxId: string
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Token | null
  onCurrencySelect: (currency: Token, hasWarning?: boolean) => void
  otherSelectedCurrency?: Token | null
  showCurrencyAmount?: boolean
  filters?: CurrencySearchFilters
}

export function CurrencySearch({
  boxId,
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  // showCurrencyAmount,
  onDismiss,
  // isOpen,
  filters
}: CurrencySearchProps) {
  const { showCommonBases } = {
    ...DEFAULT_CURRENCY_SEARCH_FILTERS,
    ...filters
  }
  boxId
  const { chainId } = useActiveWeb3React()
  // const { data: _tokenList, loading } = useGetBoxTokenList({
  //   boxId: Number(boxId),
  //   pageNum: 1,
  //   pageSize: 100
  // })
  const [isLoading, setIsLoading] = useState(true)
  // make loading last 1000ms
  useEffect(() => {
    const tm = setTimeout(() => {
      setIsLoading(false)
      return () => clearTimeout(tm)
    }, 1000)
  }, [isLoading])
  // const tokenList = _tokenList?.data.filter(v => v.boxId === boxId).filter(v => v.tokenType === TokenType.TOKEN)
  // const _liquidityTokenList = useMemo(() => {
  //   const ret = tokenList?.map(t => (t.contractAddress ? [t.contractAddress] : [t.token0Contract, t.token1Contract]))
  //   if (ret) {
  //     const flatList = ret.flat()
  //     if (flatList.length) {
  //       return Array.from(new Set(flatList)).filter(v => v.toUpperCase())
  //     }
  //   }
  //   return []
  // }, [tokenList])
  const { boxTokenList } = useWidgetData()

  // const liquidityTokenList = useTokens(_liquidityTokenList, chainId)
  const _filteredLiquidityTokenList = boxTokenList.tokens?.filter(
    v => v?.symbol?.toUpperCase() !== 'WBB' && v?.symbol?.toUpperCase() !== 'BB' && v.chainId === chainId
  )
  const CusSearchSvg = styled(SearchSvg)`
    g {
      stroke: #bcbcbc;
    }
  `

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()
  const [searchVal, setSearchVal] = useState('')
  const debounceVal = useDebounce(searchVal, 300)
  const filteredLiquidityTokenList = useMemo(() => {
    if (debounceVal.trim()) {
      if (isAddress(debounceVal.trim())) {
        return _filteredLiquidityTokenList?.filter(v => v?.address?.toLowerCase() === debounceVal.trim().toLowerCase())
      }
      return _filteredLiquidityTokenList?.filter(v => v?.symbol?.toUpperCase().includes(debounceVal.toUpperCase()))
    } else {
      return _filteredLiquidityTokenList
    }
  }, [_filteredLiquidityTokenList, debounceVal])
  const [searchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const isAddressSearch = isAddress(debouncedQuery)

  const { allCurrencyRows, loading: currencySearchResultsLoading } = useCurrencySearchResults({
    searchQuery: debouncedQuery,
    filters,
    selectedCurrency,
    otherSelectedCurrency
  })

  const gqlTokenListsEnabled = useFeatureFlag(FeatureFlags.GqlTokenLists)
  fixedList
  currencySearchResultsLoading
  gqlTokenListsEnabled
  allCurrencyRows
  // const native = useNativeCurrency(chainId)

  //  const selectChain = useSelectChain()
  const handleCurrencySelect = useCallback(
    async (currency: Token, hasWarning?: boolean) => {
      if (currency.chainId !== chainId) {
        return
        // const result = await selectChain(currency.chainId)
        // if (!result) {
        //   // failed to switch chains, don't select the currency
        //   return
        // }
      }
      onCurrencySelect(currency, hasWarning)
      if (!hasWarning) onDismiss()
    },
    [chainId, onCurrencySelect, onDismiss]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            <>Select a Token</>
          </Text>
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
        <Row gap="4px">
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Box
              sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20 }}
            >
              <CusSearchSvg />
            </Box>
            <InputStyle
              placeholder="Search by token name"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </Box>
        </Row>
        {showCommonBases && (
          <CommonBases
            chainId={chainId}
            onSelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            searchQuery={searchQuery}
            isAddressSearch={isAddressSearch}
          />
        )}
      </PaddedColumn>
      <Separator />
      {isLoading ? (
        <Typography width={'100%'} textAlign={'center'} margin={'auto'}>
          loading
          <Dots />
        </Typography>
      ) : filteredLiquidityTokenList && filteredLiquidityTokenList?.length > 0 ? (
        <div style={{ flex: '1', padding: 16, overflowY: 'auto' }}>
          {filteredLiquidityTokenList?.map((t, index) => (
            <TokenItem key={index} item={t} selectedCurrency={selectedCurrency} onCurrencySelect={onCurrencySelect} />
          ))}
        </div>
      ) : (
        <Typography style={{ padding: '20px', textAlign: 'center', margin: 'auto' }}>No content</Typography>
      )}
    </ContentWrapper>
  )
}

function TokenItem({
  item,
  selectedCurrency,
  onCurrencySelect
}: {
  item: TokenInfo | undefined
  selectedCurrency: Token | null | undefined
  onCurrencySelect: (currency: Token, hasWarning?: boolean | undefined) => void
}) {
  const { chainId, account } = useActiveWeb3React()
  const token = useToken(item?.address, chainId as any)
  const bal = useCurrencyBalance(account, token as any)

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      onClick={() => {
        if (token) {
          if (selectedCurrency && token.equals(selectedCurrency)) return
          onCurrencySelect(token)
        }
      }}
      sx={{
        padding: '12px 6px',
        cursor: 'pointer',
        borderRadius: '4px',
        background: token && selectedCurrency?.equals(token) ? 'var(--ps-neutral3)' : 'unset',
        ':hover': {
          background: 'var(--ps-neutral3)'
        }
      }}
    >
      <Stack direction={'row'} alignItems={'center'} spacing={6}>
        <CurrencyLogo currencyOrAddress={token?.address} />
        <Stack>
          <Typography fontSize={14}>{token?.symbol?.toLocaleUpperCase()}</Typography>
          <Typography fontSize={14} color={'#959595'}>
            {token?.name}
          </Typography>
        </Stack>
      </Stack>
      <Typography>{bal?.toSignificant()}</Typography>
    </Stack>
  )
}
