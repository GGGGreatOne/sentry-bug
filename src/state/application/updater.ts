import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/rpc/providers'
import { useSetCurrentConnectedAddress } from './hooks'
import { useUpdateUserInfoInterval, useUpdateUserLoginInfoWithWindowVisible } from 'state/user/hooks'
import { useGetPluginListData } from 'state/pluginListConfig/hooks'
import { useGetPluginTokenList } from 'state/pluginTokenListConfig/hooks'
import { useGetPluginTokenPriceList } from 'state/pluginTokenPriceConfig/hooks'
import { useGasPriceUpdater } from 'hooks/useGasPrice'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  useSetCurrentConnectedAddress()
  useUpdateUserLoginInfoWithWindowVisible()
  useUpdateUserInfoInterval()
  useGetPluginListData()
  useGetPluginTokenList()
  useGetPluginTokenPriceList()
  useGasPriceUpdater()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState(state => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  const providers = useMemo(() => SUPPORT_NETWORK_CHAIN_IDS.map(v => RPC_PROVIDERS[v]), [])
  const [timeInt, setTimeInt] = useState(0)
  useEffect(() => {
    setTimeout(() => setTimeInt(timeInt + 1), 60000)
    providers.map((provider, index) =>
      provider
        ?.getBlockNumber()
        .then(bn => dispatch(updateBlockNumber({ chainId: SUPPORT_NETWORK_CHAIN_IDS[index], blockNumber: bn })))
    )
  }, [providers, timeInt, dispatch])

  return null
}
