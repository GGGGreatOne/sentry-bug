import { createMulticall } from '@uniswap/redux-multicall'
import { useInterfaceMulticall } from 'hooks/useContract'
import { useBlockNumber } from './application/hooks'
import { SupportedChainId, SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'

const multicall = createMulticall()

export default multicall

export function MulticallUpdaterSingle({ chainId }: { chainId: SupportedChainId }) {
  const latestBlockNumber = useBlockNumber(chainId)
  const contract = useInterfaceMulticall(chainId)
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}

export function MulticallUpdater() {
  return (
    <>
      {SUPPORT_NETWORK_CHAIN_IDS.map(chainId => (
        <MulticallUpdaterSingle key={chainId} chainId={chainId}></MulticallUpdaterSingle>
      ))}
    </>
  )
}
