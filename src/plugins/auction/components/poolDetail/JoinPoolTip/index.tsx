import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { ROUTES } from 'constants/routes'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { AuctionCategory, IAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import auctionDialogControl from '../../create-pool/modal'
import { NextBtnStyle } from '../../create-pool/components/createSubmitBtn'
import { PoolStatus } from 'api/type'
import { useActiveWeb3React } from 'hooks'
import QuestionIcon from 'plugins/auction/assets/svg/round-question.svg'
import { Currency, CurrencyAmount } from 'constants/token'
import { useUserInfo } from 'state/user/hooks'
import { IClubPluginId } from 'state/boxes/type'
interface IProps extends IAuctionPoolInfo {
  poolInfo: any
  refreshAuctionInfo: () => void
}

export default function JoinPoolTip(props: IProps) {
  const { auction, enableRef, refreshAuctionInfo, poolInfo } = props
  const router = useRouter()
  const isLoading = useMemo(() => {
    // make sure multicall query  out
    if (poolInfo?.currencyAmountSwap1 || poolInfo?.token0) {
      return false
    }
    return true
  }, [poolInfo?.currencyAmountSwap1, poolInfo?.token0])
  const addToClub = useCallback(() => {
    if (
      auction?.category === AuctionCategory['Fixed Price Auction'] &&
      props.auction &&
      props.whitelist &&
      props.poolInfo.currencyAmountSwap1 // make sure multicall query  out
    ) {
      auctionDialogControl.show('AddFixedSwapToClub', {
        auctions: {
          enableRef: !!props.enableRef,
          auction: props.auction,
          whitelist: props.whitelist
        },
        poolInfo: props.poolInfo,
        refreshAuctionInfo
      })
    } else if (
      auction?.category === AuctionCategory['Staking Auction'] &&
      props.auction &&
      props.whitelist &&
      poolInfo?.token0
    ) {
      auctionDialogControl.show('AddStakingToClub', {
        auctions: {
          enableRef: !!props.enableRef,
          auction: props.auction,
          whitelist: props.whitelist
        },
        poolInfo: props.poolInfo,
        refreshAuctionInfo
      })
    }
  }, [
    auction?.category,
    poolInfo?.token0,
    props.auction,
    props.enableRef,
    props.poolInfo,
    props.whitelist,
    refreshAuctionInfo
  ])
  const { account, chainId } = useActiveWeb3React()
  const isCreator = useMemo(
    () => account?.toLocaleLowerCase() === poolInfo?.creator?.toLocaleLowerCase(),
    [account, poolInfo?.creator]
  )
  const userInfo = useUserInfo()
  return (
    <Stack
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{ width: '100%', maxWidth: 1296, margin: '0 auto', px: 20 }}
    >
      <Typography
        sx={{
          color: '#FFF',
          fontSize: { xs: 20, md: 36 },
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '130%',
          letterSpacing: '-0.72px'
        }}
      >
        {isCreator ? 'My Pool' : 'Join The Auction'}
      </Typography>
      <Stack flexDirection={'row'} sx={{ gap: 10 }}>
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          onClick={() => {
            if (isCreator) {
              router.push(`${ROUTES.club.editClub}?appId=${IClubPluginId.Auction}`)
              return
            }
            auction?.boxId && router.push(`${ROUTES.club.cusBox(auction.boxId)}?appId=${IClubPluginId.Auction}`)
          }}
          sx={{
            width: 212,
            height: 44,
            borderRadius: 100,
            border: '1px solid #E6E6CE',
            padding: { xs: 8, md: '12px 24px' },
            cursor: 'pointer',
            color: '#fff',
            fontFamily: 'Inter',
            fontSize: { xs: 12, md: 14 },
            fontStyle: 'normal',
            fontWeight: 400,
            whiteSpace: 'nowrap'
          }}
        >
          All Auctions History
        </Stack>
        {enableRef && poolInfo.poolStatus && !(poolInfo.poolStatus >= PoolStatus.Closed) && (
          <NextBtnStyle
            loadingPosition="start"
            sx={{
              width: 'fit-content',
              height: 47,
              padding: { xs: 8, md: '12px 24px' },
              borderRadius: 100,
              '& ,&:hover': {
                background: '#E6E6CE'
              }
            }}
            loading={isLoading}
            disabled={isLoading}
            onClick={() => {
              addToClub()
            }}
          >
            <Typography
              sx={{
                color: '#0C0C0C',
                fontFamily: 'Inter',
                fontSize: { xs: '12px', md: '14px' },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '150%'
              }}
            >
              Add to your club
            </Typography>
          </NextBtnStyle>
        )}
        {/* When the user's box ID is equal to the auction's box ID and there is an inheritance relationship */}
        {/* we can show the income */}
        {!!userInfo.box?.boxId &&
          !!auction?.boxId &&
          userInfo.box?.boxId === auction?.boxId &&
          auction.sourceBoxId &&
          auction.sourcePoolId && (
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              sx={{
                height: '34px',
                padding: '12px 24px',
                borderRadius: '100px',
                background: 'var(--white-100, #FFF)',
                gap: 40
              }}
            >
              <Stack flexDirection={'row'} alignItems={'center'}>
                <Typography
                  sx={{
                    color: 'var(--black-100, #121212)',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '140%', // 16.8px
                    textTransform: 'capitalize'
                  }}
                >
                  Proxy sales share earned
                </Typography>
                <Tooltip
                  title="Any Club can add another's Auction to promote and sell within its own Club. Upon auction conclusion, sales revenue generated via the private Club will be automatically distributed to the corresponding Club address, based on the sharing ratio set by the Creator."
                  placement="top"
                >
                  <IconButton>
                    <QuestionIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography
                sx={{
                  fontFamily: '"Sharp Grotesk DB Cyr Book 20"',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                <span style={{ color: '#F53030' }}>
                  {CurrencyAmount.fromRawAmount(
                    Currency.getNativeCurrency(chainId),
                    poolInfo.txFeeRatio?.toString() || '0'
                  )
                    ?.mul(100)
                    ?.toSignificant() || '0'}
                </span>
                <span style={{ color: ' #171717' }}> / </span>
                <span style={{ color: 'var(--Desgin-Grey-01, #908E96)' }}>
                  {poolInfo?.token1?.currency?.symbol || '--'}
                </span>
              </Typography>
            </Stack>
          )}
      </Stack>
    </Stack>
  )
}
