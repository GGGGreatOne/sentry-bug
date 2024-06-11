// import { SupportedLocalCurrency } from '../../constants/localCurrencies'
// import ms from 'ms'
// import { useConvertWebQuery } from '../../lib/uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
// import { getFetchPolicyForKey } from '../../utils/getFetchPolicyForKey'

const temp = {
  data: undefined,
  isLoading: false
}

export function useLocalCurrencyConversionRate(/*localCurrency: SupportedLocalCurrency, skip?: boolean*/) {
  // const { data, loading } = useConvertWebQuery({
  //   variables: { toCurrency: localCurrency },
  //   fetchPolicy: getFetchPolicyForKey(`convert-${localCurrency}`, ms('5m')),
  //   skip
  // })

  // return {
  //   data: data?.convert?.value,
  //   isLoading: loading
  // }
  return temp
}
