import { Box, LinearProgress, Stack, styled, Typography } from '@mui/material'
import { useMemo } from 'react'
import { shortenAddress } from 'utils'
import PlacePanel from './components/placePanel'
import PoolHistoryAndDec from 'plugins/auction/components/poolDetail/PoolHistoryAndDec'
import PoolHeader from '../../../../components/poolDetail/Header'
import { PoolStatus } from 'api/type'
import { CloseAlert, DefaultAlert, WhitelistAlert } from 'plugins/auction/components/poolDetail/Alert'
import JoinPoolTip from 'plugins/auction/components/poolDetail/JoinPoolTip'
import { CurrencyAmount } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { IAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import useFixedPricePoolInfo from '../../hooks/useFixedPricePoolInfo'
import AddressCopy from 'plugins/auction/components/poolDetail/Copy'
import { InfoPair } from 'views/auction/components/list/launchpadItem'
import { IClubAuthContainer } from 'hooks/boxes/useClubAuthCallback'

const Title = styled(Typography)`
  color: #ffffe5;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  letter-spacing: -0.28px;
`
interface IProps extends IAuctionPoolInfo, IClubAuthContainer {
  refreshAuctionInfo: () => void
  boxAddress: string | undefined
}
const TextTitle = styled(Typography)({
  color: '#FFFFE5',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '150%'
})
export default function Page({ refreshAuctionInfo, ...props }: IProps) {
  const { account } = useActiveWeb3React()
  const { isEnWhiteList, auction, isWhiteListPool } = props
  const _poolInfo = useFixedPricePoolInfo(auction?.factoryPoolId)
  const poolInfo = useMemo(() => {
    if (_poolInfo.isPlayableAuction && isEnWhiteList && props.whitelist) {
      _poolInfo.maxAmount1PerWallet = _poolInfo.maxAmount1PerWallet?.currency
        ? CurrencyAmount.fromAmount(_poolInfo.maxAmount1PerWallet?.currency, props.whitelist.amount)
        : _poolInfo.maxAmount1PerWallet
    }
    return _poolInfo
  }, [_poolInfo, isEnWhiteList, props.whitelist])
  const isPoolOwner = useMemo(
    () => poolInfo.creator?.toLocaleLowerCase() === account?.toLocaleLowerCase(),
    [account, poolInfo.creator]
  )
  const showAlert = useMemo(() => {
    if (!isEnWhiteList && !isPoolOwner) {
      return <WhitelistAlert />
    }
    if (poolInfo.poolStatus && poolInfo.poolStatus >= PoolStatus.Closed) {
      return <CloseAlert />
    }
    if (poolInfo.poolStatus && poolInfo.poolStatus < PoolStatus.Closed) {
      return <DefaultAlert />
    }
    return <DefaultAlert />
  }, [isEnWhiteList, isPoolOwner, poolInfo.poolStatus])

  return (
    <Box mt={70} sx={{ backgroundColor: '#1d1d1d' }}>
      <PoolHeader
        auction={auction}
        claimAt={poolInfo.claimAt}
        closeAt={poolInfo.closeAt}
        openAt={poolInfo.openAt}
        poolStatus={poolInfo.poolStatus}
        tokenCurrency={poolInfo.token0 || poolInfo.currencyAmountTotal0?.currency}
        swapRatio={poolInfo.swapRatio}
        token0Amount={poolInfo.currencyAmountTotal0}
        token1Currency={poolInfo.token1 || poolInfo.currencyAmountTotal1?.currency}
      />
      {auction && auction.factoryPoolId && (
        <>
          <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', marginTop: 73 }}>
            <JoinPoolTip {...props} poolInfo={poolInfo} refreshAuctionInfo={refreshAuctionInfo} />
          </Box>

          <Box sx={{ width: '100%', maxWidth: 1440, margin: '0 auto', padding: { xs: 20, md: '40px 0' } }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 1200,
                margin: '0 auto',
                padding: { xs: 20, md: '48px 56px' },
                borderRadius: 24,
                background: '#0C0C0C'
              }}
            >
              <Box sx={{ height: { xs: '100%', md: 63 }, mb: 24 }}>{showAlert}</Box>
              <Box
                sx={{
                  height: { xs: '100%', md: 450 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(0,454px) minmax(0,650px)', gap: { xs: 20, md: 0 } },
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ padding: { xs: 15, md: '24px 30px 40px 30px' }, borderRadius: 20, background: '#1C1C19' }}>
                  <Stack justifyContent={'space-between'} sx={{ height: '100%' }}>
                    <Box>
                      <Stack sx={{ gap: 10 }}>
                        <Title>Token Information</Title>
                        <InfoPair
                          sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                          label="Contract address"
                          startIcon={poolInfo.token0?.address || ''}
                          text={
                            <Box
                              sx={{
                                '&  p': {
                                  color: '#FFFFE5'
                                },
                                '& svg rect ,& svg path': {
                                  stroke: '#FFFFE5'
                                }
                              }}
                            >
                              {poolInfo.token0?.address ? (
                                <AddressCopy toCopy={poolInfo.token0?.address}>
                                  <TextTitle>{shortenAddress(poolInfo.token0?.address || '')}</TextTitle>
                                </AddressCopy>
                              ) : (
                                <></>
                              )}
                            </Box>
                          }
                        />
                        <InfoPair
                          sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                          label="Token symbol"
                          startIcon={poolInfo.token0?.address || ''}
                          text={<TextTitle>{poolInfo.token0?.symbol?.toLocaleUpperCase()}</TextTitle>}
                        />
                      </Stack>
                      <Stack mt={30} sx={{ gap: 10 }}>
                        <Title>Auction Information</Title>
                        <InfoPair
                          sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                          label="Auction type"
                          text={<TextTitle>{poolInfo.auctionType} Auction</TextTitle>}
                        />
                        {/* TODO: add whitelist */}
                        <InfoPair
                          label="Participant"
                          sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                          text={
                            <TextTitle>
                              {(poolInfo.isPlayableAuction
                                ? 'Whitelist With Amount'
                                : isWhiteListPool
                                  ? 'Whitelist'
                                  : `Public`
                              ).toLocaleUpperCase()}
                            </TextTitle>
                          }
                        />
                        <InfoPair
                          sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                          label="Allocation per wallet"
                          text={
                            <TextTitle>
                              {poolInfo.maxAmount1PerWallet?.greaterThan('0')
                                ? `${poolInfo.maxAmount1PerWallet.toSignificant()} ${poolInfo.maxAmount1PerWallet.currency.symbol?.toLocaleUpperCase()}`
                                : `No`}
                            </TextTitle>
                          }
                        />
                        <InfoPair
                          sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                          label="Total available amount"
                          text={<TextTitle>{poolInfo.currencyAmountTotal0?.toSignificant()}</TextTitle>}
                        />
                        {/* <InfoPair
                      sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1  } }}
                      label="Price Per Unit, $"
                      text={<TextTitle>{'33,215'}</TextTitle>}
                    /> */}
                      </Stack>
                    </Box>
                    <Box>
                      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'start'}>
                        <Typography
                          sx={{
                            color: '#908E96',
                            fontFamily: 'Inter',
                            fontSize: '13px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '140%',
                            textTransform: 'capitalize'
                          }}
                        >
                          Progress
                        </Typography>
                        <Typography
                          sx={{
                            color: '#FFFFE5',
                            textAlign: 'right',
                            fontSize: { xs: 14, md: 16 },
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '150%',
                            letterSpacing: '-0.32px',
                            'span.yellow': {
                              color: 'var(--black-yellow-d, #CFB023)'
                            }
                            // whiteSpace: 'nowrap'
                          }}
                        >
                          <span className="yellow">{poolInfo.currencyAmountSwap0?.toSignificant() || '0'}</span>
                          <span className="yellow">
                            {poolInfo.currencyAmountTotal0?.currency.symbol?.toLocaleUpperCase()}
                          </span>
                          /{' '}
                          {poolInfo.currencyAmountTotal0?.currency
                            ? CurrencyAmount.fromRawAmount(
                                poolInfo.currencyAmountTotal0?.currency,
                                poolInfo.amountTotal0?.toString() || '0'
                              ).toSignificant() || 0
                            : 0}{' '}
                          {poolInfo.currencyAmountTotal0?.currency.symbol?.toLocaleUpperCase()}
                        </Typography>
                      </Stack>
                      <Box mt={10}>
                        <LinearProgress
                          sx={{
                            '&.MuiLinearProgress-root': {
                              height: 6,
                              borderRadius: 4,
                              background: 'rgba(255, 255, 229, 0.10)'
                            },
                            '& .MuiLinearProgress-bar': {
                              background: '#CFB023'
                            }
                          }}
                          variant="determinate"
                          value={
                            poolInfo.currencyAmountTotal0 && poolInfo.amountBid0
                              ? Number(
                                  poolInfo.amountBid0
                                    .div(poolInfo.currencyAmountTotal0?.toExact())
                                    .times(100)
                                    .toString()
                                )
                              : 0
                          }
                        />
                      </Box>
                    </Box>
                  </Stack>
                </Box>
                <Box
                  sx={{ width: '100%', maxWidth: 524, mt: { xs: 20, md: 0 }, pl: { xs: 0, md: 30, lg: 50, xl: 80 } }}
                >
                  <PlacePanel {...props} poolInfo={poolInfo} />
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      <PoolHistoryAndDec
        swapRatio={poolInfo.swapRatio?.toExact()}
        auction={auction}
        hideHistory={!!(auction && !auction.factoryPoolId)}
      />
    </Box>
  )
}
