import { useMemo } from 'react'

import useENSContentHash from './useENSContentHash'
import uriToHttp from '../utils/uriToHttp'
import { parseENSAddress } from '../utils/parseENSAddress'
import contenthashToUri from '../utils/contenthashToUri'

export default function useHttpLocations(uri: string | undefined): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
  const resolvedContentHash = useENSContentHash(ens?.ensName)
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : []
    } else {
      return uri ? uriToHttp(uri) : []
    }
  }, [ens, resolvedContentHash.contenthash, uri])
}
