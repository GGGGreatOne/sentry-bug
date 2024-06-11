import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { buildQueryRoute } from 'utils/buildQueryRoute'

export function useRoutePushWithQueryParams() {
  const router = useRouter()

  return {
    swapRoutePush: useCallback(
      (queryParams?: Record<string, string | number>) => {
        const url = buildQueryRoute(router.asPath, queryParams, ['appId'])
        router.push(url, undefined, { shallow: true })
      },
      [router]
    )
  }
}
