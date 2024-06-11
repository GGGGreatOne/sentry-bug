import { ChainId, Currency } from '@uniswap/sdk-core'
import { CurrencyListRow, CurrencyListSectionTitle } from '../SearchModal/CurrencyList'
import { CurrencySearchFilters } from './CurrencySearch'
import { useSearchTokens } from '../../graphql/data/SearchTokens'
import { gqlTokenToCurrencyInfo } from '../../graphql/data/types'
import { chainIdToBackendName } from '../../graphql/data/util'
import { useDefaultActiveTokens, useTokenListToken } from '../../hooks/Tokens'
import { useTokenBalances } from '../../hooks/useTokenBalances'
import { getTokenFilter } from '../../lib/hooks/useTokenList/filtering'
import { getSortedPortfolioTokens, tokenQuerySortComparator } from '../../lib/hooks/useTokenList/sorting'
import { useMemo } from 'react'
import {
  Token as GqlToken,
  TokenSortableField,
  useSearchPopularTokensWebQuery
} from '../../lib/uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { FeatureFlags } from '../../lib/uniswap/src/features/experiments/flags'
import { useFeatureFlag } from '../../lib/uniswap/src/features/experiments/hooks'
import { useActiveWeb3React } from 'hooks'

interface CurrencySearchParams {
  searchQuery?: string
  filters?: CurrencySearchFilters
  selectedCurrency?: Currency | null
  otherSelectedCurrency?: Currency | null
}

interface CurrencySearchResults {
  searchCurrency?: Currency | null
  allCurrencyRows: CurrencyListRow[]
  loading: boolean
}

const currencyListRowMapper = (currency: Currency) => new CurrencyListRow(currency, false)
const gqlCurrencyMapper = (gqlToken: any) => {
  const currencyInfo = gqlTokenToCurrencyInfo(gqlToken as GqlToken)
  return currencyInfo ? currencyInfo.currency : undefined
}

function isEmpty(query: string | undefined): query is undefined {
  return !query || query.length === 0
}

export function useCurrencySearchResults({
  searchQuery,
  filters // selectedCurrency, otherSelectedCurrency
}: CurrencySearchParams): CurrencySearchResults {
  const { chainId } = useActiveWeb3React()

  const gqlTokenListsEnabled = useFeatureFlag(FeatureFlags.GqlTokenLists)

  /**
   * GraphQL queries for tokens and search results
   */
  const { data: searchResults, loading: searchResultsLoading } = useSearchTokens(
    gqlTokenListsEnabled ? searchQuery : undefined, // skip if gql token lists are disabled
    chainId ?? ChainId.MAINNET
  )
  const { data: popularTokens, loading: popularTokensLoading } = useSearchPopularTokensWebQuery({
    variables: {
      chain: chainIdToBackendName(chainId),
      orderBy: TokenSortableField.Popularity
    },
    skip: !gqlTokenListsEnabled
  })
  const { balanceMap, balanceList, loading: balancesLoading } = useTokenBalances()

  /**
   * Token-list based results.
   */

  // Queries for a single token directly by address, if the query is an address.
  const searchToken = useTokenListToken(searchQuery)
  const defaultAndUserAddedTokens = useDefaultActiveTokens(chainId)

  /**
   * Results processing: sorting, filtering, and merging data sources into the final list.
   */
  const { sortedCombinedTokens, portfolioTokens, sortedTokensWithoutPortfolio } = useMemo(() => {
    const fullBaseList = (() => {
      if (!gqlTokenListsEnabled) {
        return Object.values(defaultAndUserAddedTokens)
      } else if (!isEmpty(searchQuery)) {
        return (searchResults?.map(gqlCurrencyMapper).filter(Boolean) as Currency[]) ?? []
      } else {
        return (popularTokens?.topTokens?.map(gqlCurrencyMapper).filter(Boolean) as Currency[]) ?? []
      }
    })()

    // If we're using gql token lists and there's a search query, we don't need to
    // filter because the backend already does it for us.
    if (gqlTokenListsEnabled && !isEmpty(searchQuery)) {
      return {
        sortedCombinedTokens: fullBaseList,
        portfolioTokens: [],
        sortedTokensWithoutPortfolio: fullBaseList
      }
    }

    // Filter out tokens with balances so they aren't duplicated when we merge below.
    const filteredListTokens = fullBaseList.filter(token => {
      if (token.isNative) {
        return !((token.symbol ?? 'ETH') in balanceMap)
      } else {
        return !(token.address?.toLowerCase() in balanceMap)
      }
    })

    if (balancesLoading) {
      const sortedCombinedTokens =
        !isEmpty(searchQuery) && !gqlTokenListsEnabled
          ? filteredListTokens.filter(getTokenFilter(searchQuery)).sort(tokenQuerySortComparator(searchQuery))
          : filteredListTokens
      return {
        sortedCombinedTokens,
        portfolioTokens: [],
        sortedTokensWithoutPortfolio: sortedCombinedTokens
      }
    }

    const portfolioTokens = getSortedPortfolioTokens(balanceList, balanceMap, chainId, {
      hideSmallBalances: false,
      hideSpam: true
    })
    const mergedTokens = [...(portfolioTokens ?? []), ...filteredListTokens]

    // This is where we apply extra filtering based on the callsite's
    // customization, on top of the basic searchQuery filtering.
    const currencyFilter = (currency: Currency) => {
      if (filters?.onlyShowCurrenciesWithBalance) {
        if (currency.isNative) {
          return balanceMap[currency.symbol ?? 'ETH']?.usdValue > 0
        }

        return balanceMap[currency.address?.toLowerCase()]?.usdValue > 0
      }

      if (currency.isNative && filters?.disableNonToken) {
        return false
      }

      // If there is no query, filter out unselected user-added tokens with no balance.
      // if (isEmpty(searchQuery) && currency instanceof UserAddedToken) {
      //   if (selectedCurrency?.equals(currency) || otherSelectedCurrency?.equals(currency)) return true
      //   return balanceMap[currency.address.toLowerCase()]?.usdValue > 0
      // }

      return true
    }

    const sortedCombinedTokens =
      !isEmpty(searchQuery) && !gqlTokenListsEnabled
        ? mergedTokens.filter(getTokenFilter(searchQuery)).sort(tokenQuerySortComparator(searchQuery))
        : mergedTokens

    return {
      sortedCombinedTokens: sortedCombinedTokens.filter(currencyFilter),
      sortedTokensWithoutPortfolio: filteredListTokens.filter(currencyFilter),
      portfolioTokens: portfolioTokens.filter(currencyFilter)
    }
  }, [
    balancesLoading,
    balanceList,
    balanceMap,
    chainId,
    searchQuery,
    gqlTokenListsEnabled,
    defaultAndUserAddedTokens,
    searchResults,
    popularTokens?.topTokens,
    filters?.onlyShowCurrenciesWithBalance,
    filters?.disableNonToken
  ])

  // if no results on main list, expand into inactive
  // const filteredInactiveTokens = useSearchInactiveTokenLists(
  //   !filters?.onlyShowCurrenciesWithBalance && sortedCombinedTokens.length === 0 ? searchQuery : undefined
  // )

  const finalCurrencyList: CurrencyListRow[] = useMemo(() => {
    // If we're using gql token lists, we don't want to show tokens from token lists.
    const inactiveTokens = gqlTokenListsEnabled ? [] : [] /*filteredInactiveTokens*/
    if (!isEmpty(searchQuery) || portfolioTokens.length === 0) {
      return [
        new CurrencyListSectionTitle(searchQuery ? `Search results` : `Popular tokens`),
        ...sortedCombinedTokens.map(currencyListRowMapper),
        ...inactiveTokens.map(currencyListRowMapper)
      ]
    } else if (sortedTokensWithoutPortfolio.length === 0 && inactiveTokens.length === 0) {
      return [new CurrencyListSectionTitle(`Your tokens`), ...portfolioTokens.map(currencyListRowMapper)]
    } else {
      return [
        new CurrencyListSectionTitle(`Your tokens`),
        ...portfolioTokens.map(currencyListRowMapper),
        new CurrencyListSectionTitle(`Popular tokens`),
        ...sortedTokensWithoutPortfolio.map(currencyListRowMapper),
        ...inactiveTokens.map(currencyListRowMapper)
      ]
    }
  }, [gqlTokenListsEnabled, searchQuery, portfolioTokens, sortedTokensWithoutPortfolio, sortedCombinedTokens])

  return {
    loading: searchResultsLoading || popularTokensLoading || balancesLoading,
    searchCurrency: searchToken,
    allCurrencyRows: finalCurrencyList
  }
}
