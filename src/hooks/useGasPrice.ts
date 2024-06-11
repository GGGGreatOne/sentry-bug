import { useRequest } from 'ahooks'
import { useActiveWeb3React } from 'hooks'
import { useDispatch } from 'react-redux'
import { setChainGasPrice } from 'state/application/actions'
import { useBlockNumber } from 'state/application/hooks'

export function useGasPriceUpdater() {
  const { library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const dispatch = useDispatch()

  useRequest(
    async () => {
      if (!library) return
      const price = await library.getGasPrice()
      dispatch(setChainGasPrice(price.toString()))
    },
    {
      refreshDeps: [blockNumber]
    }
  )
}
