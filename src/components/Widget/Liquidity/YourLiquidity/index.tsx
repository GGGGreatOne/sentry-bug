import { Dispatch, useMemo } from 'react'
import { Box, Typography, Button, Grid, Accordion, AccordionSummary } from '@mui/material'
import { Percent, Token, TokenAmount, Currency, ETHER } from '@uniswap/sdk'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { usePairs } from 'components/Widget/data/Reserves'
import AppBody from 'components/Widget/component/AppBody'
import { useTokenBalancesWithLoadingIndicator, useTokenTotalSupplies } from 'components/Widget/hooks/wallet'
import { useTrackedTokenPairs } from 'components/Widget/hooks/Tokens'
import { Dots } from 'components/Widget/component/Dots'
import { toV2LiquidityToken } from 'state/widget/swapUser/hooks'
import { LiquidityPage } from '..'
import { useMintActionHandlers } from 'state/widget/mint/hooks'
import { Field as MintField } from 'state/widget/mint/actions'
import { Field as BurnField } from 'state/widget/mint/actions'
import { useBurnActionHandlers } from 'state/widget/burn/hooks'
import { WBB } from 'components/Widget/constant'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function YourLiquidity({ setPage }: { setPage: Dispatch<LiquidityPage> }) {
  const { account, chainId } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()

  const trackedTokenPairs = useTrackedTokenPairs()

  const { onCurrencySelection } = useMintActionHandlers(undefined)
  const { onCurrencySelection: onBurnCurrencySelection } = useBurnActionHandlers()

  const [tokenPairsWithLiquidityTokens, trackedTokenPairMap] = useMemo(() => {
    const tokensMap: { [key: string]: Token[] } = {}
    const lpTokens = trackedTokenPairs.map(tokens => {
      const lpToken = toV2LiquidityToken(tokens)
      tokensMap[lpToken.address] = tokens
      return { liquidityToken: lpToken, tokens }
    })

    return [lpTokens, tokensMap]
  }, [trackedTokenPairs])

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const totalSupplies = useTokenTotalSupplies(liquidityTokens)
  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.reduce(
        (acc, { liquidityToken }, idx) => {
          if (v2PairsBalances[liquidityToken.address]?.greaterThan('0')) {
            acc.push({ liquidityToken: liquidityToken, tokens: trackedTokenPairs[idx] })
          }
          return acc
        },
        [] as { liquidityToken: Token; tokens: [Token, Token] }[]
      ),
    [tokenPairsWithLiquidityTokens, trackedTokenPairs, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  return (
    <Box>
      <AppBody
        sx={{
          marginTop: '40px',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px'
        }}
      >
        <Box sx={{ padding: 24 }}>
          <Typography sx={{ fontSize: 14 }}>Your Liquidity</Typography>
          <Box>
            {v2IsLoading ? (
              <Box minHeight={168} display="flex" justifyContent="center" alignItems="center">
                <Dots />
              </Box>
            ) : account ? (
              <Grid
                container
                pt={20}
                spacing={10}
                alignItems="stretch"
                minHeight={168}
                justifyItems={'center'}
                justifyContent={'center'}
              >
                {v2Pairs.length === 0 && (
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems={'center'}
                    sx={{ background: 'rgba(255, 255, 255, 0.10)', borderRadius: 16, display: 'flex' }}
                    mt={20}
                  >
                    <Typography textAlign={'center'} fontSize={16}>
                      Add liquidity to receive tokens
                    </Typography>
                  </Grid>
                )}
                {v2Pairs.map(([, pair], idx) => {
                  if (!pair) return null

                  const tokens = trackedTokenPairMap[liquidityTokensWithBalances[idx].liquidityToken.address]

                  const getBB = (token: any) => {
                    return token.address === WBB.address ? ETHER : token
                  }

                  const [token0, token1] =
                    pair?.token0.address === (tokens[0]?.address ?? '')
                      ? [getBB(tokens[0]), getBB(tokens[1])]
                      : [getBB(tokens[1]), getBB(tokens[0])]

                  const balance = v2PairsBalances?.[liquidityTokensWithBalances[idx].liquidityToken.address]
                  const totalSupply = totalSupplies?.[liquidityTokensWithBalances[idx].liquidityToken.address]
                  pair.reserveOf
                  const poolTokenPercentage =
                    totalSupply && balance
                      ? new Percent(balance.raw, totalSupply.raw).toFixed(2, undefined, 2) + '%'
                      : '-'

                  const [reserveA, reserveB] = [
                    new TokenAmount(token0, pair.reserve0.raw),
                    new TokenAmount(token1, pair.reserve1.raw)
                  ]

                  const [amountA, amountB] =
                    token0.symbol === 'WETH' || token0.symbol === 'ETH' ? [reserveB, reserveA] : [reserveA, reserveB]

                  return (
                    <Grid item xs={12} key={pair.liquidityToken.address}>
                      <PoolCard
                        currency0={amountA.token}
                        currency1={amountB.token}
                        title={`${getSymbol(amountA.token, chainId)} / ${getSymbol(amountB.token, chainId)}
                      `}
                        reserve0={amountA.toExact()}
                        reserve1={amountB.toExact()}
                        shareAmount={poolTokenPercentage}
                        tokenAmount={balance ? balance?.toExact() : '-'}
                        onAdd={() => {
                          onCurrencySelection(MintField.CURRENCY_A, amountA.token)
                          onCurrencySelection(MintField.CURRENCY_B, amountB.token)
                          setPage(LiquidityPage.Mint)
                        }}
                        onRemove={() => {
                          onBurnCurrencySelection(BurnField.CURRENCY_A, amountA.token)
                          onBurnCurrencySelection(BurnField.CURRENCY_B, amountB.token)
                          setPage(LiquidityPage.Burn)
                        }}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            ) : (
              <Box minHeight={332} display="flex" alignItems="center" justifyContent="center">
                <Button
                  size="large"
                  onClick={() => toggleWallet()}
                  style={{
                    maxWidth: '400px'
                  }}
                >
                  Connect Wallet
                </Button>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: {
                xs: 'column',
                md: 'row'
              },
              gap: 24,
              mt: 28
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setPage(LiquidityPage.Mint)
              }}
              size="large"
              sx={{ fontSize: 16, whiteSpace: 'nowrap', minWidth: 'auto' }}
            >
              Add Liquidity
            </Button>
          </Box>
        </Box>
      </AppBody>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mt: 50,
          pb: 80
        }}
      ></Box>
    </Box>
  )
}

function PoolCard({
  currency0,
  currency1,
  title,
  reserve0,
  reserve1,
  shareAmount,
  tokenAmount,
  onAdd,
  onRemove
}: {
  currency0: Currency
  currency1: Currency
  title: string
  reserve0: string
  reserve1: string
  shareAmount: string
  tokenAmount: string
  onAdd: () => void
  onRemove: () => void
}) {
  return (
    <Accordion
      sx={{
        background: 'transparent',
        '&.Mui-expanded': {
          borderRadius: '16px!important',
          background: 'rgba(255, 255, 255, 0.10)'
        }
      }}
    >
      <AccordionSummary
        sx={{
          padding: 20,
          background: '#ffffff',
          borderRadius: '16px!important',
          color: '#101720',
          '&.Mui-expanded': {
            background: 'transparent'
          },
          '&.Mui-expanded p': {
            color: '#ffffff'
          },
          '& .MuiAccordionSummary-content': {
            margin: 0
          }
        }}
        expandIcon={
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="38" rx="12" fill="white" fillOpacity="0.8" />
            <path
              d="M14 16.5L19 21.5L24 16.5"
              stroke="#20201E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        <Box display="flex" justifyContent="flex-start" gap={12}>
          <DoubleCurrencyLogo currency0={currency0 as any} currency1={currency1 as any} size={28} />
          <Typography fontSize={18} fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <Box
        padding="0 24px 24px"
        sx={{
          borderRadius: '20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '& p': {
            fontSize: 13
          }
        }}
      >
        <Box display="flex" flexDirection="column" gap={8} mt={0} mb={20}>
          <PoolAssetCard currency={currency0} value={reserve0} />
          <PoolAssetCard currency={currency1} value={reserve1} />
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 16, mr: 5 }} whiteSpace="nowrap">
              Your LP
            </Typography>
            <Typography
              fontSize={16}
              style={{
                textAlign: 'right',
                whiteSpace: 'normal',
                wordBreak: 'break-all',
                opacity: 0.8
              }}
            >
              {Math.round(Number(tokenAmount) * 1000) / 1000}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 16 }}>Your share</Typography>
            <Typography
              fontSize={16}
              sx={{
                opacity: 0.8
              }}
            >
              {shareAmount}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={8} mt={'auto'} width={'100%'}>
          <Button
            variant="outlined"
            sx={{
              height: 44,
              width: '100%'
            }}
            onClick={onRemove}
          >
            Remove
          </Button>
          <Button variant="contained" sx={{ height: 44, width: '100%' }} onClick={onAdd}>
            Add
          </Button>
        </Box>
      </Box>
    </Accordion>
  )
}

function PoolAssetCard({ currency, value }: { currency: Currency; value: string }) {
  const { chainId } = useActiveWeb3React()

  return (
    <Box display="flex" justifyContent="space-between" alignItems={'center'} width="100%">
      <Typography fontSize={12} fontWeight={400}>
        Pooled {getSymbol(currency, chainId)}
      </Typography>
      <Box display="flex" gap={8}>
        <Typography fontSize={16} fontWeight={500} sx={{ opacity: 0.8 }}>
          {Math.round(Number(value) * 1000) / 1000}
        </Typography>
        <CurrencyLogo currencyOrAddress={currency as any} size={'16px'} style={{ flexShrink: 0 }} />
      </Box>
    </Box>
  )
}
