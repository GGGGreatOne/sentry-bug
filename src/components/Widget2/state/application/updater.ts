import { asSupportedChain } from '../../constants/chains'
import useDebounce from 'hooks/useDebounce'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state/hooks'

import { updateChainId } from './reducer'
import { useActiveWeb3React } from 'hooks'

export default function Updater(): null {
  const { chainId, library: provider } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const windowVisible = useIsWindowVisible()

  const [activeChainId, setActiveChainId] = useState(chainId)

  useEffect(() => {
    if (provider && chainId && windowVisible) {
      setActiveChainId(chainId)
    }
  }, [dispatch, chainId, provider, windowVisible])

  const debouncedChainId = useDebounce(activeChainId, 100)

  useEffect(() => {
    const chainId = debouncedChainId ? asSupportedChain(debouncedChainId) : null
    dispatch(updateChainId({ chainId }))
  }, [dispatch, debouncedChainId])

  return null
}
