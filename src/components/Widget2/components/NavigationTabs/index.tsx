import { Percent } from '@uniswap/sdk-core'
import { ReactNode } from 'react'
import { ArrowLeft } from 'react-feather'
import { Box } from 'rebass'
import { useAppDispatch } from 'state/hooks'
import styled, { useTheme } from 'styled-components'
import { RowBetween } from '../Row'
import { useActiveWeb3React } from 'hooks'
import { Typography } from '@mui/material'
import { flexRowNoWrap } from 'components/Widget2/theme/styles'
import { resetMintState } from 'components/Widget2/state/mint/v3/actions'
import { ThemedText } from 'components/Widget2/theme/components'
import SettingsTab from '../Settings'
import { useRouter } from 'next/router'
import { useRoutePushWithQueryParams } from 'hooks/useRoutePushWithQueryParams'

const Tabs = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const FindPoolTabsText = styled(ThemedText.H1Small)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.neutral1};
`

export function FindPoolTabs({ origin }: { origin: string }) {
  const router = useRouter()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem', position: 'relative' }}>
        <Box onClick={() => router.push(origin)}>
          <StyledArrowLeft />
        </Box>
        <FindPoolTabsText>
          <Typography>Import V2 pool</Typography>
        </FindPoolTabsText>
      </RowBetween>
    </Tabs>
  )
}

const AddRemoveTitleText = styled(ThemedText.H1Small)<{ $center: boolean }>`
  flex: 1;
  margin: auto;
  text-align: ${({ $center }) => ($center ? 'center' : 'start')};
`

export function AddRemoveTabs({
  adding,
  creating,
  autoSlippage,
  children
}: {
  adding: boolean
  creating: boolean
  autoSlippage: Percent
  showBackLink?: boolean
  children?: ReactNode
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  // reset states on back
  const dispatch = useAppDispatch()
  const { swapRoutePush } = useRoutePushWithQueryParams()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem' }} align="center">
        <Box
          sx={{ cursor: 'pointer', height: 24 }}
          onClick={e => {
            e.preventDefault()
            swapRoutePush()
            if (adding) {
              // not 100% sure both of these are needed
              dispatch(resetMintState())
              // dispatch(resetMintV3State())
            }
          }}
        >
          <StyledArrowLeft stroke={theme.neutral2} />
        </Box>
        <AddRemoveTitleText $center={!children} style={{ flex: 1, marginLeft: 10 }}>
          {creating ? (
            <Typography color={'#fff'} sx={{ margin: '0 auto' }} textAlign={'left'} fontSize={16}>
              Create a pair
            </Typography>
          ) : adding ? (
            <Typography color={'#fff'} sx={{ margin: '0 auto' }} textAlign={'left'} fontSize={16}>
              Add liquidity
            </Typography>
          ) : (
            <Typography color={'#fff'} sx={{ margin: '0 auto' }} textAlign={'left'} fontSize={16}>
              Remove liquidity
            </Typography>
          )}
        </AddRemoveTitleText>
        {children && <Box style={{ marginRight: '.5rem' }}>{children}</Box>}
        <SettingsTab autoSlippage={autoSlippage} chainId={chainId} hideRoutingSettings />
      </RowBetween>
    </Tabs>
  )
}
