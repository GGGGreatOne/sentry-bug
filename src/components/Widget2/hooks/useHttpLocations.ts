import { useMemo } from 'react'
import parseENSAddress from '../lib/utils/parseENSAddress'
import useENSContentHash from './useENSContentHash'
import uriToHttp from '../lib/utils/uriToHttp'
import contenthashToUri from '../lib/utils/contenthashToUri'

export default function useHttpLocations(uri: string | undefined | null): string[] {
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
