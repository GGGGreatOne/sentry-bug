import { useBoxContract } from 'hooks/useContract'
import { DEFAULT_TOKEN_LIST, WBB } from '../constant'
import { useCallback, useContext, useMemo, useState } from 'react'
import { TokenInfo } from '@uniswap/token-lists'
import React from 'react'
import { Box } from 'abis/types'

const initBoxAddress = '0x42f2a4272750b8766797e243F2dEf54028A04343'

const initBoxTokenList = DEFAULT_TOKEN_LIST

export function useWidgetData() {
  const context = useContext(WidgetDataContext)
  if (context === undefined) {
    throw new Error('useWidgetData must be used within a provider')
  }
  return context
}

interface WidgetContextType {
  boxTokenList: { tokens: Array<TokenInfo> }
  boxAddress: string
  setBoxAddress: (addr: string) => void
  setBoxTokenList: (list: { tokens: Array<TokenInfo> }) => void
  boxContract: Box | null
}

const initWidgetContext = {
  boxTokenList: initBoxTokenList,
  boxAddress: initBoxAddress,
  setBoxAddress: () => {},
  setBoxTokenList: () => {},
  boxContract: null
}

export const WidgetDataContext = React.createContext<WidgetContextType>(initWidgetContext)

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const [boxAddress, _setBoxAddress] = useState(initBoxAddress)
  const [boxTokenList, _setBoxTokenList] = useState<{ tokens: Array<TokenInfo> }>(initBoxTokenList)
  const boxContract = useBoxContract(boxAddress)
  const setBoxAddress = useCallback((addr: string) => {
    _setBoxAddress(addr)
  }, [])

  const setBoxTokenList = useCallback((list: { tokens: Array<TokenInfo> }) => {
    if (!list?.tokens?.find(i => i.address === WBB.address)) {
      list?.tokens?.push(WBB)
    }
    if (list && list.tokens) {
      _setBoxTokenList(list)
    }
  }, [])

  const val = useMemo(
    () => ({
      setBoxAddress,
      setBoxTokenList,
      boxAddress,
      boxTokenList,
      boxContract
    }),
    [boxAddress, boxContract, boxTokenList, setBoxAddress, setBoxTokenList]
  )
  return <WidgetDataContext.Provider value={val}>{children}</WidgetDataContext.Provider>
}
