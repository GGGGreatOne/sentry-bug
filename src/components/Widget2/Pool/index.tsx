import styled, { css } from 'styled-components'
import { AutoColumn } from '../components/Column'
import Row, { RowBetween } from '../components/Row'
import { ThemedText } from '../theme/components'
import { AlertTriangle } from 'react-feather'
import { ButtonText } from '../components/Button'
import { LoadingRows } from './styled'
import { useActiveWeb3React } from 'hooks'
import { PositionDetails } from '../types/position'
import { useMemo, useState } from 'react'
import { isSupportedChain } from '../constants/chains'
import { useUserHideClosedPositions } from '../state/user/hooks'
import PositionList from '../components/PositionList'
import { useWalletModalToggle } from 'state/application/hooks'
import { useFilterPossiblyMaliciousPositions } from 'components/Widget2/hooks/useFilterPossiblyMaliciousPositions'
import { useV3Positions } from '../hooks/useV3Positions'
import { Button, Fade, Menu, MenuItem, Stack, Typography } from '@mui/material'
import NoPositionIcon from '../assets/images/no_position_icon.png'
import LiquidityV2 from '../../../components/Widget/Liquidity'
import { DarkDropDown } from '../components/Icons/DropDown'
import { useRoutePushWithQueryParams } from 'hooks/useRoutePushWithQueryParams'

const PageWrapper = styled(AutoColumn)`
  padding: 40px 0px 0px;
  max-width: 870px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    max-width: 800px;
    padding-top: 48px;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    max-width: 500px;
    padding-top: 20px;
  }
`
const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.neutral2};
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  }
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const NetworkIcon = styled(AlertTriangle)`
  ${IconStyle}
`

const MainContentWrapper = styled.main`
  background-color: #1b1b1b;
  border: 1px solid ${({ theme }) => theme.surface3};
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding: 16px;
  }
`

function PositionsLoadingPlaceholder() {
  return (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  )
}

function WrongNetworkCard() {
  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0">
              <Typography>Positions</Typography>
            </TitleRow>

            <MainContentWrapper>
              <ErrorContainer>
                <ThemedText.BodyPrimary color={'#5E5E5E'} textAlign="center">
                  <NetworkIcon strokeWidth={1.2} />
                  <div data-testid="pools-unsupported-err">Your connected network is unsupported.</div>
                </ThemedText.BodyPrimary>
              </ErrorContainer>
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export enum PoolState {
  V2,
  V3
}

export default function Pool({ boxId }: { boxId: string | number }) {
  const { account, chainId } = useActiveWeb3React()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()
  const { positions, loading: positionsLoading } = useV3Positions(account)
  const [poolState, setPoolState] = useState(PoolState.V3)
  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const userSelectedPositionSet = useMemo(
    () => [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)],
    [closedPositions, openPositions, userHideClosedPositions]
  )

  const filteredPositions = useFilterPossiblyMaliciousPositions(userSelectedPositionSet)
  const { swapRoutePush } = useRoutePushWithQueryParams()

  const walletModalToggle = useWalletModalToggle()
  if (!isSupportedChain(chainId)) {
    return <WrongNetworkCard />
  }

  const showConnectAWallet = Boolean(!account)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <PageWrapper>
      <Stack width={'100%'} spacing={28}>
        <TitleRow padding="0">
          <Row gap="md" width="min-content">
            <Typography color={'#fff'} fontSize={20}>
              Positions
            </Typography>
            <div>
              <Button
                id="fade-button"
                variant="contained"
                sx={{ width: 'max-content', display: 'flex', justifyContent: 'space-between', gap: 6, padding: 12 }}
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {poolState === PoolState.V2 ? 'v2 pool' : 'v3 pool'}
                <DarkDropDown />
              </Button>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  'aria-labelledby': 'fade-button'
                }}
                sx={{
                  '& .MuiPaper-root': {
                    background: '#1b1b1b',
                    borderRadius: '6px',
                    padding: '0 6px'
                  }
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem
                  onClick={() => {
                    setPoolState(PoolState.V2)
                    handleClose()
                  }}
                >
                  v2 pool
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setPoolState(PoolState.V3)
                    handleClose()
                  }}
                >
                  v3 pool
                </MenuItem>
              </Menu>
            </div>
          </Row>
          {poolState === PoolState.V2 ? null : (
            <Button
              variant="contained"
              data-cy="join-pool-button"
              id="join-pool-button"
              onClick={() => {
                swapRoutePush({
                  type: 'add'
                })
              }}
            >
              + New position
            </Button>
          )}
        </TitleRow>
        <MainContentWrapper>
          {positionsLoading ? (
            <PositionsLoadingPlaceholder />
          ) : poolState === PoolState.V2 ? (
            <LiquidityV2 boxId={boxId} />
          ) : filteredPositions && closedPositions && filteredPositions.length > 0 ? (
            <PositionList
              positions={filteredPositions}
              setUserHideClosedPositions={setUserHideClosedPositions}
              userHideClosedPositions={userHideClosedPositions}
            />
          ) : (
            <ErrorContainer
              style={{
                backgroundImage: `url(${NoPositionIcon.src})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                width: '100%',
                height: '100%'
              }}
            >
              <ThemedText.BodyPrimary color={'#5E5E5E'} textAlign="center">
                <div>No position yet</div>
              </ThemedText.BodyPrimary>
              {!showConnectAWallet && closedPositions.length > 0 && (
                <ButtonText
                  style={{ marginTop: '.5rem' }}
                  onClick={() => setUserHideClosedPositions(!userHideClosedPositions)}
                >
                  Show closed positions
                </ButtonText>
              )}
              {showConnectAWallet && (
                <Button
                  variant="contained"
                  style={{ marginTop: '2em', marginBottom: '2em', padding: '8px 16px' }}
                  onClick={walletModalToggle}
                >
                  Connect a wallet
                </Button>
              )}
            </ErrorContainer>
          )}
        </MainContentWrapper>
      </Stack>
    </PageWrapper>
  )
}
