import { useTroveFactoryContract } from 'plugins/liquity/hooks/useContract'
import { useBoxExecute } from './useBoxCallback'

export function useCreateStablecoin(troveFactoryAddr: string, cb: () => void, boxAddress?: string) {
  const contract = useTroveFactoryContract(troveFactoryAddr)

  return useBoxExecute(
    boxAddress,
    {
      toContract: contract,
      toFunc: 'createStableCoin',
      toData: undefined
    },
    {
      summary: `You created a stablecoin`,
      action: 'createStableCoin_create_stablecoin',
      successTipsText: 'Your stablecoin is now available for trading.',
      onSuccess: cb
    }
  )
}
