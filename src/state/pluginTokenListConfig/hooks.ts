import { useRequest } from 'ahooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import { fetchPluginTokenListConfig } from './reducer'
import { Currency } from 'constants/token'
import { SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { POOL_TYPE } from 'plugins/bitFarm/hooks/useStakingPool'

export enum FilterTokenType {
  Token,
  LPToken,
  AllToken
}

export const useGetPluginTokenListData = (tokenType?: FilterTokenType) => {
  const { pluginTokenList: _pluginTokenList, total } = useSelector<AppState, AppState['pluginTokenListConfig']>(
    state => state.pluginTokenListConfig
  )
  const { chainId } = useActiveWeb3React()
  const currencyTokens = _pluginTokenList.map(v => {
    return new Currency(
      chainId || SupportedChainId.BB_MAINNET,
      v.contractAddress || '',
      v.decimals || 18,
      v.tokenSymbol || '',
      v.tokenName,
      v.smallImg || ''
    )
  })

  const pluginTokenList = useMemo(() => {
    if (tokenType === FilterTokenType.LPToken) {
      return _pluginTokenList.filter(
        v => Number(v.tokenType) === POOL_TYPE.LP_TOKEN_V2 || Number(v.tokenType) === POOL_TYPE.LP_TOKEN_V3
      )
    }

    if (tokenType === FilterTokenType.Token) {
      return _pluginTokenList.filter(v => Number(v.tokenType) === POOL_TYPE.TOKEN)
    }
    return _pluginTokenList
  }, [_pluginTokenList, tokenType])

  return { pluginTokenList, total, currencyTokens }
}

export const useGetPluginTokenList = () => {
  const dispatch = useDispatch()
  return useRequest(async () => dispatch(fetchPluginTokenListConfig()), {})
}
