import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { ChainId, Currency, CurrencyAmount, Fraction, Percent, Price, Token } from '@uniswap/sdk-core'
import { NonfungiblePositionManager, Pool, Position } from '@uniswap/v3-sdk'
import { LoadingFullscreen } from 'components/Loader/styled'
import { PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Dots, LoadingRows } from './styled'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import { ExternalLink, HideExtraSmall, HideSmall, StyledRouterLink, ThemedText } from '../theme/components'
import { NumberType, useFormatter } from '../utils/formatNumbers'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from '../constants/chains'
import { ExplorerDataType, getExplorerLink } from '../utils/getExplorerLink'
import { useV3PositionFromTokenId } from '../hooks/useV3Positions'
import { useToken } from '../hooks/Tokens'
import { unwrappedToken } from '../utils/unwrappedToken'
import useNativeCurrency from '../lib/hooks/useNativeCurrency'
import { PoolState, usePool } from '../hooks/usePools'
import useStablecoinPrice from '../hooks/useStablecoinPrice'
import { useV3NFTPositionManagerContract } from '../hooks/useContract'
import { WrongChainError } from '../utils/errors'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { useSingleCallResult } from 'hooks/multicall'
import RangeBadge from '../components/Badge/RangeBadge'
import { ButtonConfirmed } from '../components/Button'
import RateToggle from '../components/RateToggle'
import { Bound } from '../state/mint/v3/actions'
import { currencyId } from '../utils/currencyId'
import { AutoColumn } from '../components/Column'
import { chainIdToBackendName, getPoolDetailsURL, getTokenDetailsURL, isGqlSupportedChain } from '../graphql/data/util'
import CurrencyLogo from '../components/Logo/CurrencyLogo'
import { RowBetween, RowFixed } from '../components/Row'
import { usePositionTokenURI } from '../hooks/usePositionTokenURI'
import useIsTickAtLimit from '../hooks/useIsTickAtLimit'
import { getPriceOrderingFromPositionForUI } from '../components/PositionListItem'
import { useV3PositionFees } from '../hooks/useV3PositionFees'
import DoubleCurrencyLogo from '../components/DoubleLogo'
import Badge from '../components/Badge'
import Toggle from '../components/Toggle'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../components/TransactionConfirmationModal'
import { useRouter } from 'next/router'
import { useIsTransactionPending } from '../state/transactions/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import DoubleArrowIcon from '../assets/images/doubleArrow.svg'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useRoutePushWithQueryParams } from 'hooks/useRoutePushWithQueryParams'

const PositionPageButtonPrimary = styled(Button)`
  width: 228px;
  height: 40px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 12px;
`

const PageWrapper = styled.div`
  padding: 68px 16px 16px 16px;
  margin: 0 auto;
  min-width: 800px;
  max-width: 960px;

  @media only screen and (max-width: 768px) {
    min-width: 100%;
    padding: 16px 0;
  }
`

const BadgeText = styled.div`
  font-weight: 535;
  font-size: 14px;
  color: ${({ theme }) => theme.neutral2};
`

// responsive text
// disable the warning because we don't use the end prop, we just want to filter it out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Label = styled(({ ...props }) => <ThemedText.DeprecatedLabel {...props} />)<{ end?: boolean }>`
  display: flex;
  font-size: 16px;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.neutral2};
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 535;
`

const HoverText = styled(ThemedText.DeprecatedMain)`
  text-decoration: none;
  color: ${({ theme }) => theme.neutral2};
  :hover {
    color: ${({ theme }) => theme.neutral1};
    text-decoration: none;
  }
`

const DoubleArrow = styled.span`
  color: #fff;
  margin: 0 1rem;
`
const ResponsiveRow = styled(RowBetween)`
  background-color: #1b1b1b;
  padding: 24px 40px;
  border-radius: 16px;
  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 16px;
    width: 100%;
    padding: 16px;
  }
`

const ActionButtonResponsiveRow = styled(Stack)`
  width: 50%;
  flex-direction: row;
  justify-content: flex-end;
  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: 100%;
  }
`

const ResponsiveButtonConfirmed = styled(ButtonConfirmed)`
  border-radius: 100px !important;
  padding: 6px 8px;
  width: fit-content;
  font-size: 16px;
  color: #0d0d0d;
  background-color: #fff;
  &:hover,
  &:disabled {
    background-color: rgba(255, 255, 255, 0.8) !important;
  }
  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: fit-content;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: fit-content;
  }
`

const NFTGrid = styled.div`
  display: grid;
  grid-template: 'overlap';
  min-height: 400px;
`

const NFTCanvas = styled.canvas`
  grid-area: overlap;
`

const NFTImage = styled.img`
  grid-area: overlap;
  height: 400px;
  /* Ensures SVG appears on top of canvas. */
  z-index: 1;
`

const PairHeader = styled(ThemedText.H1Medium)`
  margin-right: 10px;
`

function CurrentPriceCard({
  inverted,
  pool,
  currencyQuote,
  currencyBase
}: {
  inverted?: boolean
  pool?: Pool | null
  currencyQuote?: Currency
  currencyBase?: Currency
}) {
  const { formatPrice } = useFormatter()

  if (!pool || !currencyQuote || !currencyBase) {
    return null
  }

  return (
    <Stack
      padding="12px"
      sx={{
        borderRadius: '16px',
        backgroundColor: '#FFFFFF0D'
      }}
    >
      <AutoColumn gap="sm" justify="center">
        <ExtentsText>
          <Typography>Current price</Typography>
        </ExtentsText>
        <ThemedText.DeprecatedMediumHeader textAlign="center">
          {formatPrice({ price: inverted ? pool.token1Price : pool.token0Price, type: NumberType.TokenTx })}
        </ThemedText.DeprecatedMediumHeader>
        <ExtentsText>
          <Typography>
            {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyQuote?.symbol?.toLocaleUpperCase()}{' '}
            per {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currencyBase?.symbol?.toLocaleUpperCase()}
          </Typography>
        </ExtentsText>
      </AutoColumn>
    </Stack>
  )
}

const TokenLink = ({
  children,
  chainId,
  address
}: PropsWithChildren<{ chainId: keyof typeof CHAIN_IDS_TO_NAMES; address: string }>) => {
  const tokenLink = getTokenDetailsURL({ address, chain: chainIdToBackendName(chainId) })
  return <StyledRouterLink href={tokenLink}>{children}</StyledRouterLink>
}

const ExternalTokenLink = ({ children, chainId, address }: PropsWithChildren<{ chainId: number; address: string }>) => {
  return <ExternalLink href={getEtherscanLink(chainId, address, ExplorerDataType.TOKEN)}>{children}</ExternalLink>
}

function LinkedCurrency({ chainId, currency }: { chainId: number; currency?: Currency }) {
  const address = (currency as Token)?.address

  const Link = isGqlSupportedChain(chainId) ? TokenLink : ExternalTokenLink
  return (
    <Link chainId={chainId} address={address}>
      <RowFixed>
        <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '0.5rem' }} />
        <ThemedText.DeprecatedMain>
          {currency?.symbol?.toLocaleUpperCase() === 'ETH' ? 'BB' : currency?.symbol?.toLocaleUpperCase()} ↗
        </ThemedText.DeprecatedMain>
      </RowFixed>
    </Link>
  )
}

function getRatio(
  lower: Price<Currency, Currency>,
  current: Price<Currency, Currency>,
  upper: Price<Currency, Currency>
) {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    } else if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(15))
    const b = Number.parseFloat(upper.toSignificant(15))
    const c = Number.parseFloat(current.toSignificant(15))

    const ratio = Math.floor((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100)

    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}

// snapshots a src img into a canvas
function getSnapshot(src: HTMLImageElement, canvas: HTMLCanvasElement, targetHeight: number) {
  const context = canvas.getContext('2d')

  if (context) {
    let { width, height } = src

    // src may be hidden and not have the target dimensions
    const ratio = width / height
    height = targetHeight
    width = Math.round(ratio * targetHeight)

    // Ensure crispness at high DPIs
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.scale(devicePixelRatio, devicePixelRatio)

    context.clearRect(0, 0, width, height)
    context.drawImage(src, 0, 0, width, height)
  }
}

function NFT({ image, height: targetHeight }: { image: string; height: number }) {
  const [animate, setAnimate] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <NFTGrid
      onMouseEnter={() => {
        setAnimate(true)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, targetHeight)
        }
        setAnimate(false)
      }}
    >
      <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, targetHeight)
          }
        }}
      />
    </NFTGrid>
  )
}

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base
  }
}

export function PositionPageUnsupportedContent() {
  const { swapRoutePush } = useRoutePushWithQueryParams()
  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <ThemedText.HeadlineLarge style={{ marginBottom: '8px' }}>
          <Typography>Position unavailable</Typography>
        </ThemedText.HeadlineLarge>
        <ThemedText.BodyPrimary style={{ marginBottom: '32px' }}>
          <Typography textAlign={'center'}>
            To view a position, you must be connected to the network it belongs to.
          </Typography>
        </ThemedText.BodyPrimary>
        <PositionPageButtonPrimary
          variant="contained"
          onClick={() => swapRoutePush()}
          style={{ cursor: 'pointer', width: 'fit-content' }}
        >
          <Typography>Back to Pool</Typography>
        </PositionPageButtonPrimary>
      </div>
    </PageWrapper>
  )
}

export default function PositionPage({ tokenId }: { tokenId: string }) {
  const { chainId } = useActiveWeb3React()
  if (isSupportedChain(chainId)) {
    return <PositionPageContent _tokenId={tokenId} />
  } else {
    return <PositionPageUnsupportedContent />
  }
}

const PositionLabelRow = styled(RowFixed)({
  flexWrap: 'wrap',
  gap: 8
})

function parseTokenId(tokenId: string | undefined): BigNumber | undefined {
  if (!tokenId) return
  try {
    return BigNumber.from(tokenId)
  } catch (error) {
    return
  }
}

function PositionPageContent({ _tokenId }: { _tokenId: string }) {
  const router = useRouter()
  const { swapRoutePush: routePush } = useRoutePushWithQueryParams()
  const { chainId, account, library: provider } = useActiveWeb3React()
  const theme = useTheme()
  const isSm = useBreakpoint('sm')
  const { formatCurrencyAmount, formatDelta, formatTickPrice } = useFormatter()

  const parsedTokenId = parseTokenId(_tokenId)
  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId
  } = positionDetails || {}

  const removed = liquidity?.eq(0)

  const metadata = usePositionTokenURI(parsedTokenId)

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol?.toLocaleUpperCase()

  // get pool address from details returned
  const poolAddress = token0 && token1 && feeAmount ? Pool.getAddress(token0, token1, feeAmount) : undefined

  // construct Position from details returned
  const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)
  const [manuallyInverted, setManuallyInverted] = useState(false)

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted
  })

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  const ratio = useMemo(() => {
    return priceLower && pool && priceUpper
      ? getRatio(
          inverted ? priceUpper.invert() : priceLower,
          pool.token0Price,
          inverted ? priceLower.invert() : priceUpper
        )
      : undefined
  }, [inverted, pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWETH)

  // these currencies will match the feeValue{0,1} currencies for the purposes of fee collection
  const currency0ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token0 : unwrappedToken(pool.token0)) : undefined

  const currency1ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token1 : unwrappedToken(pool.token1)) : undefined

  const [collecting, setCollecting] = useState<boolean>(false)
  const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
  const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)
  const [showConfirm, setShowConfirm] = useState(false)
  // usdc prices always in terms of tokens
  const price0 = useStablecoinPrice(token0 ?? undefined)
  const price1 = useStablecoinPrice(token1 ?? undefined)

  const fiatValueOfFees: CurrencyAmount<Currency> | null = useMemo(() => {
    if (!price0 || !price1 || !feeValue0 || !feeValue1) return null

    // we wrap because it doesn't matter, the quote returns a USDC amount
    const feeValue0Wrapped = feeValue0?.wrapped
    const feeValue1Wrapped = feeValue1?.wrapped

    if (!feeValue0Wrapped || !feeValue1Wrapped) return null

    const amount0 = price0.quote(feeValue0Wrapped)
    const amount1 = price1.quote(feeValue1Wrapped)
    return amount0.add(amount1)
  }, [price0, price1, feeValue0, feeValue1])

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()
  const collect = useCallback(async () => {
    if (
      !currency0ForFeeCollectionPurposes ||
      !currency1ForFeeCollectionPurposes ||
      !chainId ||
      !positionManager ||
      !account ||
      !tokenId ||
      !provider
    )
      return

    setCollecting(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
      tokenId: tokenId.toString(),
      expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0),
      expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0),
      recipient: account
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value
    }

    const connectedChainId = await provider.getSigner().getChainId()
    if (chainId !== connectedChainId) throw new WrongChainError()

    provider
      .getSigner()
      .estimateGas(txn)
      .then((estimate: any) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate)
        }

        return provider
          .getSigner()
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            setCollectMigrationHash(response.hash)
            setCollecting(false)

            addTransaction(response, {
              summary: `Collected ${
                feeValue0?.toExact() ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0).toExact()
              } ${
                currency0ForFeeCollectionPurposes.symbol?.toLocaleUpperCase() === 'ETH'
                  ? 'BB'
                  : currency0ForFeeCollectionPurposes.symbol?.toLocaleUpperCase()
              } and ${
                feeValue1?.toExact() ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0).toExact()
              } ${
                currency1ForFeeCollectionPurposes.symbol?.toLocaleUpperCase() === 'ETH'
                  ? 'BB'
                  : currency1ForFeeCollectionPurposes.symbol?.toLocaleUpperCase()
              } fees`
              //   type: TransactionType.COLLECT_FEES,
              //   currencyId0: currencyId(currency0ForFeeCollectionPurposes),
              //   currencyId1: currencyId(currency1ForFeeCollectionPurposes),
              //   expectedCurrencyOwed0:
              //     feeValue0?.quotient.toString() ??
              //     CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0).toExact(),
              //   expectedCurrencyOwed1:
              //     feeValue1?.quotient.toString() ??
              //     CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0).toExact()
            })
          })
      })
      .catch((error: any) => {
        setCollecting(false)
        console.error(error)
      })
  }, [
    chainId,
    feeValue0,
    feeValue1,
    currency0ForFeeCollectionPurposes,
    currency1ForFeeCollectionPurposes,
    positionManager,
    account,
    tokenId,
    addTransaction,
    provider
  ])

  const owner = useSingleCallResult(chainId, tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

  // check if price is within range
  const below = pool && typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = pool && typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  function modalHeader() {
    return (
      <AutoColumn gap="md" style={{ marginTop: '20px' }}>
        <Stack
          padding="12px 16px"
          sx={{
            borderRadius: '16px',
            backgroundColor: '#FFFFFF0D'
          }}
        >
          <AutoColumn gap="md">
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueUpper?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <ThemedText.DeprecatedMain>
                  {feeValueUpper ? formatCurrencyAmount({ amount: feeValueUpper }) : '-'}
                </ThemedText.DeprecatedMain>
              </RowFixed>
              <ThemedText.DeprecatedMain>
                {feeValueUpper?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                  ? 'BB'
                  : feeValueUpper?.currency?.symbol?.toLocaleUpperCase()}
              </ThemedText.DeprecatedMain>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueLower?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <ThemedText.DeprecatedMain>
                  {feeValueLower ? formatCurrencyAmount({ amount: feeValueLower }) : '-'}
                </ThemedText.DeprecatedMain>
              </RowFixed>
              <ThemedText.DeprecatedMain>
                {feeValueLower?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                  ? 'BB'
                  : feeValueLower?.currency?.symbol?.toLocaleUpperCase()}
              </ThemedText.DeprecatedMain>
            </RowBetween>
          </AutoColumn>
        </Stack>
        <ThemedText.DeprecatedItalic>
          <Typography>Collecting fees will withdraw currently available fees for you.</Typography>
        </ThemedText.DeprecatedItalic>
        <Button variant="contained" data-testid="modal-collect-fees-button" onClick={collect}>
          <Typography>Collect</Typography>
        </Button>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    ownsNFT &&
      (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
      currency0 &&
      currency1 &&
      (currency0.isNative || currency1.isNative) &&
      !collectMigrationHash
  )

  if (!positionDetails && !loading) {
    return <PositionPageUnsupportedContent />
  }

  return loading || poolState === PoolState.LOADING || !feeAmount ? (
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
  ) : (
    <>
      <PageWrapper>
        <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={() => setShowConfirm(false)}
          attemptingTxn={collecting}
          hash={collectMigrationHash ?? ''}
          reviewContent={() => (
            <ConfirmationModalContent
              title={<Typography>Claim fees</Typography>}
              onDismiss={() => setShowConfirm(false)}
              topContent={modalHeader}
            />
          )}
          pendingText={<Typography>Collecting fees</Typography>}
        />
        <AutoColumn gap="md">
          <AutoColumn gap="sm">
            <Box onClick={() => router.back()} sx={{ cursor: 'pointer' }}>
              <HoverText>
                <Typography color={'#fff'}>← Back to Pool</Typography>
              </HoverText>
            </Box>
            <ResponsiveRow>
              <PositionLabelRow>
                <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={24} margin={true} />
                <Box
                  onClick={() =>
                    router.push(poolAddress ? getPoolDetailsURL(poolAddress, chainIdToBackendName(chainId)) : '')
                  }
                >
                  <PairHeader>
                    &nbsp;
                    {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH'
                      ? 'BB'
                      : currencyQuote?.symbol?.toLocaleUpperCase()}
                    &nbsp;/&nbsp;
                    {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH'
                      ? 'BB'
                      : currencyBase?.symbol?.toLocaleUpperCase()}
                  </PairHeader>
                </Box>
                <Badge style={{ marginRight: '8px' }}>
                  <BadgeText>
                    <Typography>
                      {formatDelta(parseFloat(new Percent(feeAmount, 1_000_000).toSignificant()))}
                    </Typography>
                  </BadgeText>
                </Badge>
                <RangeBadge removed={removed} inRange={inRange} />
              </PositionLabelRow>
              {ownsNFT && (
                <ActionButtonResponsiveRow>
                  {currency0 && currency1 && feeAmount && tokenId ? (
                    <Button
                      variant="outlined"
                      onClick={() =>
                        // router.push(`/add/${currencyId(currency0)}/${currencyId(currency1)}/${feeAmount}/${tokenId}`)
                        routePush({
                          tokenId: tokenId.toString(),
                          type: 'add',
                          feeAmount: feeAmount,
                          currency0: currencyId(currency0),
                          currency1: currencyId(currency1)
                        })
                      }
                      sx={{
                        marginRight: 8,
                        width: isSm ? '50%' : 'fit-content'
                      }}
                    >
                      <Typography>{isSm ? 'Increase' : 'Increase liquidity'}</Typography>
                    </Button>
                  ) : null}
                  {tokenId && !removed ? (
                    <Button
                      variant="contained"
                      onClick={() => routePush({ tokenId: tokenId.toString(), type: 'remove' })}
                      sx={{
                        width: isSm ? '50%' : 'fit-content'
                      }}
                    >
                      <Typography>{isSm ? 'Remove' : 'Remove liquidity'}</Typography>
                    </Button>
                  ) : null}
                </ActionButtonResponsiveRow>
              )}
            </ResponsiveRow>
          </AutoColumn>
          <ResponsiveRow align="flex-start">
            <HideSmall
              style={{
                height: '100%',
                marginRight: 12
              }}
            >
              {'result' in metadata ? (
                <Stack
                  width="100%"
                  height="100%"
                  style={{
                    padding: 40,
                    backgroundColor: '#FFFFFF0D',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '16px',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    minWidth: '340px'
                  }}
                >
                  <NFT image={metadata.result.image} height={400} />
                  {typeof chainId === 'number' && owner && !ownsNFT ? (
                    <ExternalLink href={getExplorerLink(chainId, owner, ExplorerDataType.ADDRESS)}>
                      <Typography>Owner</Typography>
                    </ExternalLink>
                  ) : null}
                </Stack>
              ) : (
                <Stack
                  width="100%"
                  height="100%"
                  style={{
                    minWidth: '340px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <LoadingFullscreen />
                </Stack>
              )}
            </HideSmall>
            <AutoColumn gap="sm" style={{ width: '100%', height: '100%' }}>
              <Stack
                sx={{
                  padding: 20,
                  borderRadius: '16px',
                  border: '1px solid #FFFFFF33'
                }}
              >
                <AutoColumn gap="md" style={{ width: '100%' }}>
                  <AutoColumn gap="md">
                    <Label>
                      <Typography>Liquidity</Typography>
                    </Label>
                    {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100)) ? (
                      <ThemedText.DeprecatedLargeHeader fontSize="28px" fontWeight={535}>
                        <Typography>
                          {formatCurrencyAmount({
                            amount: fiatValueOfLiquidity,
                            type: NumberType.FiatTokenPrice
                          })}
                        </Typography>
                      </ThemedText.DeprecatedLargeHeader>
                    ) : (
                      // <ThemedText.DeprecatedLargeHeader color={theme.neutral1} fontSize="28px" fontWeight={535}>
                      //   -
                      // </ThemedText.DeprecatedLargeHeader>
                      <ThemedText.DeprecatedLargeHeader
                        color={theme.neutral1}
                        fontSize="28px"
                        fontWeight={535}
                      ></ThemedText.DeprecatedLargeHeader>
                    )}
                  </AutoColumn>
                  <Stack
                    padding="12px 16px"
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF0D'
                    }}
                  >
                    <AutoColumn gap="md">
                      <RowBetween>
                        <LinkedCurrency chainId={chainId ?? ChainId.MAINNET} currency={currencyQuote} />
                        <RowFixed>
                          <ThemedText.DeprecatedMain>
                            <Typography color={'#fff'}>
                              {formatCurrencyAmount({ amount: inverted ? position?.amount0 : position?.amount1 })}
                            </Typography>
                          </ThemedText.DeprecatedMain>
                          {typeof ratio === 'number' && !removed ? (
                            <Badge style={{ marginLeft: '10px', backgroundColor: 'transparent' }}>
                              <BadgeText>
                                <Typography color={'#fff'}>{inverted ? ratio : 100 - ratio}%</Typography>
                              </BadgeText>
                            </Badge>
                          ) : null}
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <LinkedCurrency chainId={chainId ?? ChainId.MAINNET} currency={currencyBase} />
                        <RowFixed>
                          <ThemedText.DeprecatedMain>
                            <Typography color={'#fff'}>
                              {formatCurrencyAmount({ amount: inverted ? position?.amount1 : position?.amount0 })}
                            </Typography>
                          </ThemedText.DeprecatedMain>
                          {typeof ratio === 'number' && !removed ? (
                            <Badge style={{ marginLeft: '10px', backgroundColor: 'transparent' }}>
                              <BadgeText>
                                <Typography color={'#fff'}>{inverted ? 100 - ratio : ratio}%</Typography>
                              </BadgeText>
                            </Badge>
                          ) : null}
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </Stack>
                </AutoColumn>
              </Stack>
              <Stack
                sx={{
                  padding: 20,
                  borderRadius: '16px',
                  border: '1px solid #FFFFFF33'
                }}
              >
                <AutoColumn gap="md" style={{ width: '100%' }}>
                  <AutoColumn gap="md">
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <AutoColumn gap="md">
                        <Label>
                          <Typography>Unclaimed fees</Typography>
                        </Label>
                        {fiatValueOfFees?.greaterThan(new Fraction(1, 100)) ? (
                          <ThemedText.DeprecatedLargeHeader color={theme.success} fontSize="28px" fontWeight={535}>
                            {formatCurrencyAmount({ amount: fiatValueOfFees, type: NumberType.FiatTokenPrice })}
                          </ThemedText.DeprecatedLargeHeader>
                        ) : (
                          // <ThemedText.DeprecatedLargeHeader color={theme.neutral1} fontSize="28px" fontWeight={535}>
                          //   -
                          // </ThemedText.DeprecatedLargeHeader>
                          <ThemedText.DeprecatedLargeHeader
                            color={theme.neutral1}
                            fontSize="28px"
                            fontWeight={535}
                          ></ThemedText.DeprecatedLargeHeader>
                        )}
                      </AutoColumn>
                      {ownsNFT && (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash) ? (
                        <ResponsiveButtonConfirmed
                          data-testid="collect-fees-button"
                          disabled={collecting || !!collectMigrationHash}
                          confirmed={!!collectMigrationHash && !isCollectPending}
                          width="fit-content"
                          padding="4px 8px"
                          onClick={() => setShowConfirm(true)}
                        >
                          {!!collectMigrationHash && !isCollectPending ? (
                            <ThemedText.DeprecatedMain color={theme.neutral1}>
                              <Typography> Collected</Typography>
                            </ThemedText.DeprecatedMain>
                          ) : isCollectPending || collecting ? (
                            <ThemedText.DeprecatedMain color={theme.neutral1}>
                              <Typography>
                                Collecting
                                <Dots />
                              </Typography>
                            </ThemedText.DeprecatedMain>
                          ) : (
                            <>
                              <ThemedText.DeprecatedMain color={theme.white}>
                                <Typography>Collect fees</Typography>
                              </ThemedText.DeprecatedMain>
                            </>
                          )}
                        </ResponsiveButtonConfirmed>
                      ) : null}
                    </RowBetween>
                  </AutoColumn>
                  <Stack
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF0D'
                    }}
                    padding="12px 16px"
                  >
                    <AutoColumn gap="md">
                      <RowBetween>
                        <RowFixed>
                          <CurrencyLogo
                            currency={feeValueUpper?.currency}
                            size="20px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <ThemedText.DeprecatedMain>
                            {feeValueUpper?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                              ? 'BB'
                              : feeValueUpper?.currency?.symbol?.toLocaleUpperCase()}
                          </ThemedText.DeprecatedMain>
                        </RowFixed>
                        <RowFixed>
                          <ThemedText.DeprecatedMain>
                            <Typography color={'#fff'}>
                              {feeValueUpper ? formatCurrencyAmount({ amount: feeValueUpper }) : '-'}
                            </Typography>
                          </ThemedText.DeprecatedMain>
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <RowFixed>
                          <CurrencyLogo
                            currency={feeValueLower?.currency}
                            size="20px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <ThemedText.DeprecatedMain>
                            {feeValueLower?.currency?.symbol?.toLocaleUpperCase() === 'ETH'
                              ? 'BB'
                              : feeValueLower?.currency?.symbol?.toLocaleUpperCase()}
                          </ThemedText.DeprecatedMain>
                        </RowFixed>
                        <RowFixed>
                          <ThemedText.DeprecatedMain>
                            <Typography color={'#fff'}>
                              {feeValueLower ? formatCurrencyAmount({ amount: feeValueLower }) : '-'}
                            </Typography>
                          </ThemedText.DeprecatedMain>
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </Stack>
                  {showCollectAsWeth && (
                    <AutoColumn gap="md">
                      <RowBetween>
                        <ThemedText.DeprecatedMain>
                          <Typography>Collect as {nativeWrappedSymbol}</Typography>
                        </ThemedText.DeprecatedMain>
                        <Toggle
                          id="receive-as-weth"
                          isActive={receiveWETH}
                          toggle={() => setReceiveWETH(receiveWETH => !receiveWETH)}
                        />
                      </RowBetween>
                    </AutoColumn>
                  )}
                </AutoColumn>
              </Stack>
            </AutoColumn>
          </ResponsiveRow>
          <Stack
            sx={{
              padding: isSm ? '16px' : '24px 40px',
              borderRadius: '16px',
              backgroundColor: '#1B1B1B'
            }}
          >
            <AutoColumn gap="md">
              <RowBetween>
                <RowFixed>
                  <Label display="flex" style={{ marginRight: '12px' }}>
                    <Typography>Price range</Typography>
                  </Label>
                  <HideExtraSmall>
                    <>
                      <RangeBadge removed={removed} inRange={inRange} />
                      <span style={{ width: '8px' }} />
                    </>
                  </HideExtraSmall>
                </RowFixed>
                <RowFixed>
                  {currencyBase && currencyQuote && (
                    <RateToggle
                      currencyA={currencyBase}
                      currencyB={currencyQuote}
                      handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                    />
                  )}
                </RowFixed>
              </RowBetween>

              <Stack direction={isSm ? 'column' : 'row'} alignItems={'center'}>
                <Stack
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF0D'
                  }}
                  padding="12px"
                  width="100%"
                >
                  <AutoColumn gap="sm" justify="center">
                    <ExtentsText>
                      <Typography>Min price</Typography>
                    </ExtentsText>
                    <ThemedText.DeprecatedMediumHeader textAlign="center">
                      {formatTickPrice({
                        price: priceLower,
                        atLimit: tickAtLimit,
                        direction: Bound.LOWER,
                        numberType: NumberType.TokenTx
                      })}
                    </ThemedText.DeprecatedMediumHeader>
                    <ExtentsText>
                      <Typography>
                        {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH'
                          ? 'BB'
                          : currencyQuote?.symbol?.toLocaleUpperCase()}{' '}
                        per{' '}
                        {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH'
                          ? 'BB'
                          : currencyBase?.symbol?.toLocaleUpperCase()}
                      </Typography>
                    </ExtentsText>

                    {inRange && (
                      <ThemedText.DeprecatedSmall color={theme.neutral3}>
                        <Typography textAlign={'center'}>
                          Your position will be 100%{' '}
                          {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH'
                            ? 'BB'
                            : currencyBase?.symbol?.toLocaleUpperCase()}{' '}
                          at this price.
                        </Typography>
                      </ThemedText.DeprecatedSmall>
                    )}
                  </AutoColumn>
                </Stack>
                {isSm ? <DoubleArrowIcon style={{ margin: '10px auto' }} /> : <DoubleArrow>⟷</DoubleArrow>}
                <Stack
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF0D'
                  }}
                  padding="12px"
                  width="100%"
                >
                  <AutoColumn gap="sm" justify="center">
                    <ExtentsText>
                      <Typography>Max price</Typography>
                    </ExtentsText>
                    <ThemedText.DeprecatedMediumHeader textAlign="center">
                      {formatTickPrice({
                        price: priceUpper,
                        atLimit: tickAtLimit,
                        direction: Bound.UPPER,
                        numberType: NumberType.TokenTx
                      })}
                    </ThemedText.DeprecatedMediumHeader>
                    <ExtentsText>
                      {' '}
                      <Typography>
                        {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH'
                          ? 'BB'
                          : currencyQuote?.symbol?.toLocaleUpperCase()}{' '}
                        per{' '}
                        {currencyBase?.symbol?.toLocaleUpperCase() === 'ETH'
                          ? 'BB'
                          : currencyBase?.symbol?.toLocaleUpperCase()}
                      </Typography>
                    </ExtentsText>

                    {inRange && (
                      <ThemedText.DeprecatedSmall color={theme.neutral3}>
                        <Typography textAlign={'center'}>
                          Your position will be 100%{' '}
                          {currencyQuote?.symbol?.toLocaleUpperCase() === 'ETH'
                            ? 'BB'
                            : currencyQuote?.symbol?.toLocaleUpperCase()}{' '}
                          at this price.
                        </Typography>
                      </ThemedText.DeprecatedSmall>
                    )}
                  </AutoColumn>
                </Stack>
              </Stack>
              <CurrentPriceCard
                inverted={inverted}
                pool={pool}
                currencyQuote={currencyQuote}
                currencyBase={currencyBase}
              />
            </AutoColumn>
          </Stack>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
