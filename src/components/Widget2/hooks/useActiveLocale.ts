import { DEFAULT_LOCALE, SupportedLocale } from '../constants/locales'
import { useMemo } from 'react'

export const initialLocale = DEFAULT_LOCALE

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useActiveLocale(): SupportedLocale {
  return useMemo(() => DEFAULT_LOCALE, [])
}
