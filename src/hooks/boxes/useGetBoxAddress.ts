import { useBoxFactoryContract } from '../useContract'
import { useSingleCallResult } from '../multicall'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { ZERO_ADDRESS } from 'constants/index'
export default function useGetBoxAddress(boxId: string | number | undefined): {
  boxAddressRaw: string | undefined
  boxAddress: string | undefined
} {
  const { chainId } = useActiveWeb3React()
  const contract = useBoxFactoryContract(chainId)
  const res = useSingleCallResult(chainId, contract, 'boxById', [boxId || undefined])
  return useMemo(() => {
    if (!res.result) {
      return { boxAddressRaw: undefined, boxAddress: undefined }
    }
    const boxAddress = res.result[0]
    return {
      boxAddressRaw: boxAddress,
      boxAddress: boxAddress === ZERO_ADDRESS ? undefined : boxAddress
    }
  }, [res.result])
}
