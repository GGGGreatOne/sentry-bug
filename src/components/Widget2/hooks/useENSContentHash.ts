import { useENSRegistrarContract, useENSResolverContract } from 'hooks/useContract'
import { useMemo } from 'react'
import isZero from 'utils'
import { safeNamehash } from '../utils/safeNamehash'
import { NEVER_RELOAD, useMainnetSingleCallResult } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'

/**
 * Does a lookup for an ENS name to find its contenthash.
 */
export default function useENSContentHash(ensName?: string | null): { loading: boolean; contenthash: string | null } {
  const { chainId } = useActiveWeb3React()
  const ensNodeArgument = useMemo(() => [ensName ? safeNamehash(ensName) : undefined], [ensName])
  const registrarContract = useENSRegistrarContract()
  const resolverAddressResult = useMainnetSingleCallResult(
    chainId,
    registrarContract,
    'resolver',
    ensNodeArgument,
    NEVER_RELOAD
  )
  const resolverAddress = resolverAddressResult.result?.[0]
  const resolverContract = useENSResolverContract(
    resolverAddress && isZero(resolverAddress) ? undefined : resolverAddress
  )
  const contenthash = useMainnetSingleCallResult(
    chainId,
    resolverContract,
    'contenthash',
    ensNodeArgument,
    NEVER_RELOAD
  )

  return useMemo(
    () => ({
      contenthash: contenthash.result?.[0] ?? null,
      loading: resolverAddressResult.loading || contenthash.loading
    }),
    [contenthash.loading, contenthash.result, resolverAddressResult.loading]
  )
}
