import { Button, Stack } from '@mui/material'
import Swap from './Swap'
import Liquidity from './Liquidity'
import { useEffect, useState } from 'react'
import MuiThemeProvider from './provider/MuiThemeProvider'
import { WidgetProvider, useWidgetData } from './hooks/Box'
import { TokenInfo } from '@uniswap/token-lists'

enum Page {
  swap,
  liquidity
}

function WidgetInner({
  boxContractAddr,
  tokenList
}: {
  boxContractAddr: string
  tokenList?: { tokens: Array<TokenInfo> }
}) {
  const [state, setState] = useState<Page>(Page.liquidity)
  const { setBoxAddress, setBoxTokenList } = useWidgetData()

  useEffect(() => {
    if (boxContractAddr) {
      setBoxAddress(boxContractAddr)
    }

    if (tokenList) {
      setBoxTokenList(tokenList)
    }
  }, [boxContractAddr, setBoxAddress, setBoxTokenList, tokenList])

  return (
    <MuiThemeProvider>
      <Stack justifyContent={'center'}>
        <Stack direction="row" spacing={16} justifyContent={'center'}>
          <Button
            variant={state === Page.swap ? 'contained' : 'outlined'}
            sx={{ width: 166 }}
            onClick={() => {
              setState(Page.swap)
            }}
          >
            Swap
          </Button>
          <Button
            variant={state === Page.liquidity ? 'contained' : 'outlined'}
            sx={{ width: 166 }}
            onClick={() => {
              setState(Page.liquidity)
            }}
          >
            Liquidity
          </Button>
        </Stack>
        <Stack justifyContent={'center'}>
          {state === Page.swap && <Swap />}
          {state === Page.liquidity && <Liquidity boxId={20} />}
        </Stack>
      </Stack>
    </MuiThemeProvider>
  )
}

export default function Widget(props: { boxContractAddr: string; tokenList?: { tokens: Array<TokenInfo> } }) {
  return (
    <WidgetProvider>
      <WidgetInner {...props} />
    </WidgetProvider>
  )
}
