import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import ms from 'ms'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { acceptListUpdate } from './actions'
import { useActiveWeb3React } from 'hooks'
import { useAllLists } from './hooks'
import { DEFAULT_LIST_OF_LISTS, UNSUPPORTED_LIST_URLS } from 'components/Widget2/constants/lists'
import useInterval from 'components/Widget2/lib/hooks/useInterval'
import { useStateRehydrated } from 'components/Widget2/hooks/useStateRehydrated'
import TokenSafetyLookupTable from '../../constants/tokenSafetyLookup'
import { useFetchListCallback } from 'components/Widget2/hooks/useFetchListCallback'

export default function Updater(): null {
  const { library: provider } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const isWindowVisible = useIsWindowVisible()

  // get all loaded lists, and the active urls
  const lists = useAllLists()
  const listsState = useAppSelector(state => state.lists)
  const rehydrated = useStateRehydrated()

  useEffect(() => {
    if (rehydrated) TokenSafetyLookupTable.update(listsState)
  }, [listsState, rehydrated])

  const fetchList = useFetchListCallback()
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return
    DEFAULT_LIST_OF_LISTS.forEach(url => {
      // Skip validation on unsupported lists
      const isUnsupportedList = UNSUPPORTED_LIST_URLS.includes(url)
      fetchList(url, isUnsupportedList).catch((error: any) => console.debug('interval list fetching error', error))
    })
  }, [fetchList, isWindowVisible])

  // fetch all lists every 10 minutes, but only after we initialize provider
  useInterval(fetchAllListsCallback, provider ? ms(`10m`) : null)

  useEffect(() => {
    if (!rehydrated) return // loaded lists will not be available until state is rehydrated

    // whenever a list is not loaded and not loading, try again to load it
    Object.keys(lists).forEach(listUrl => {
      const list = lists[listUrl]
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error: any) => console.debug('list added fetching error', error))
      }
    })
    UNSUPPORTED_LIST_URLS.forEach(listUrl => {
      const list = lists[listUrl]
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl, /* isUnsupportedList= */ true).catch((error: any) =>
          console.debug('list added fetching error', error)
        )
      }
    })
  }, [dispatch, fetchList, lists, rehydrated])

  // automatically update lists for every version update
  useEffect(() => {
    Object.keys(lists).forEach(listUrl => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl))
        }
      }
    })
  }, [dispatch, lists])

  return null
}
