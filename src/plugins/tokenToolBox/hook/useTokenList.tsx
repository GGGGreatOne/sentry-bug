import { useInterval } from 'ahooks'
import { getTokenList } from 'api/common'
import { IGetTokenListParams } from 'api/common/type'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'

export const useTokenList = (boxId?: number | undefined) => {
  const tokenListState = useGetTokenListState()
  if (boxId) {
    return {
      ...tokenListState,
      pluginTokenList: tokenListState.pluginTokenList.filter(v => v.boxId === boxId.toString())
    }
  }
  return tokenListState
}

export const useGetTokenListState = () => {
  const state = useSelector<AppState, AppState['pluginTokenListConfig']>(state => {
    return state.pluginTokenListConfig
  })
  return state
}

export const useTokenListGetToken = (params: IGetTokenListParams, tokenAddr: string) => {
  const [hasToken, setHasToken] = useState(false)
  useInterval(
    async () => {
      const rep = await getTokenList(params)
      setHasToken(rep.data.data.some(item => item.contractAddress === tokenAddr))
    },
    30000,
    {
      immediate: true
    }
  )
  return [hasToken, setHasToken]
}
