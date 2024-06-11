import { Button, Stack } from '@mui/material'
import SwapPage from './Swap'
import PoolV3 from './pool-v3'
import { ThemeProvider } from './theme'
import { Provider as ApolloProvider } from './graphql/apollo/Provider'
import { useEffect, useState } from 'react'
import { StyleSheetManager } from 'styled-components'
import useBreakpoint from 'hooks/useBreakpoint'
import { TokenInfo } from '@uniswap/token-lists'
import { WidgetProvider, useWidgetData } from 'components/Widget/hooks/Box'
import { useRoutePushWithQueryParams } from 'hooks/useRoutePushWithQueryParams'

enum Page {
  swap,
  liquidity
}

const shouldForwardProp = (prop: string) => {
  return !['active', 'padding', 'gap', 'visible', 'compact', 'isActive`', 'error'].includes(prop)
}

function Inner({ boxId, tokenList }: { boxId: string; tokenList?: { tokens: Array<TokenInfo> } }) {
  const [state, setState] = useState<Page>(Page.swap)
  const isSm = useBreakpoint('sm')
  const { setBoxTokenList } = useWidgetData()

  useEffect(() => {
    if (tokenList) {
      setBoxTokenList(tokenList)
    }
  }, [setBoxTokenList, tokenList])
  const { swapRoutePush } = useRoutePushWithQueryParams()
  return (
    <>
      <ApolloProvider>
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
          <ThemeProvider>
            <Stack
              sx={{
                backgroundColor: '#282828',
                maxWidth: 1200,
                borderRadius: '12px',
                margin: '0 auto',
                padding: isSm ? '0' : '32px 40px'
              }}
            >
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
                    swapRoutePush()
                    setState(Page.liquidity)
                  }}
                >
                  Liquidity
                </Button>
              </Stack>
              <Stack
                sx={{
                  width: '100%',
                  margin: '0 auto'
                }}
              >
                <Stack
                  sx={{
                    width: '100%',
                    margin: '0 auto',
                    borderRadius: 12,
                    padding: { xs: '16px 0', md: '0' }
                  }}
                >
                  {state === Page.swap && <SwapPage boxId={boxId} />}
                  {state === Page.liquidity && <PoolV3 boxId={boxId} />}
                </Stack>
              </Stack>
            </Stack>
          </ThemeProvider>
        </StyleSheetManager>
      </ApolloProvider>
    </>
  )
}

export default function SwapHome(props: { boxId: string; tokenList?: { tokens: Array<TokenInfo> } }) {
  return (
    <WidgetProvider>
      <Inner {...props} />
    </WidgetProvider>
  )
}
