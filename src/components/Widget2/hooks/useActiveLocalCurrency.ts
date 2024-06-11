import { DEFAULT_LOCAL_CURRENCY, SupportedLocalCurrency } from '../constants/localCurrencies'
import { atomWithStorage, useAtomValue } from 'jotai/utils'
import { useMemo } from 'react'
import { getFiatCurrencyComponents } from '../utils/formatNumbers'

export const activeLocalCurrencyAtom = atomWithStorage<SupportedLocalCurrency>(
  'activeLocalCurrency',
  DEFAULT_LOCAL_CURRENCY
)

export function useActiveLocalCurrency(): SupportedLocalCurrency {
  const activeLocalCurrency = useAtomValue(activeLocalCurrencyAtom)

  return useMemo(() => activeLocalCurrency, [activeLocalCurrency])
}

export function useActiveLocalCurrencyComponents() {
  const activeLocale = 'en-US'
  const activeLocalCurrency = useActiveLocalCurrency()

  return useMemo(
    () => getFiatCurrencyComponents(activeLocale, activeLocalCurrency),
    [activeLocalCurrency, activeLocale]
  )
}
