import { Button, Stack } from '@mui/material'
import SwapPage from './Swap'
import PoolV3 from './pool-v3'
import { ThemeProvider } from './theme'
import { useState } from 'react'
import { StyleSheetManager } from 'styled-components'
import useBreakpoint from 'hooks/useBreakpoint'
import SwapV2 from '../Widget/Swap'

enum Page {
  swap,
  liquidity
}

const shouldForwardProp = (prop: string) => {
  return !['active', 'padding', 'gap', 'visible', 'compact', 'isActive`', 'error'].includes(prop)
}

export default function Widget2({ boxId }: { boxId: string }) {
  const [state, setState] = useState<Page>(Page.swap)
  const isSm = useBreakpoint('sm')

  return (
    <>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <ThemeProvider>
          <Stack
            sx={{
              backgroundColor: '#282828',
              maxWidth: 1200,
              borderRadius: '12px',
              margin: '100px auto 0',
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
                {state === Page.swap && (
                  <>
                    <SwapPage boxId={boxId} />
                    <SwapV2 />
                  </>
                )}
                {state === Page.liquidity && <PoolV3 boxId={boxId} />}
              </Stack>
            </Stack>
          </Stack>
        </ThemeProvider>
      </StyleSheetManager>
    </>
  )
}
