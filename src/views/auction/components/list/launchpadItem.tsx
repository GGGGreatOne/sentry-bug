import { Box, Button, IconButton, Stack, styled, SxProps, Tooltip, Typography } from '@mui/material'
import { IBoxAuctionPoolListDataItem } from 'plugins/auction/api/type'
import CategoryBox from './categoryBox'
import { useMemo } from 'react'
import { parseBanner } from 'plugins/auction/utils'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useActiveWeb3React } from 'hooks'
import Image from 'components/Image'
import TeslaIcon from 'assets/svg/boxes/tesla.svg'
import PoolStatusBox from 'plugins/auction/components/poolDetail/PoolStatus'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { PoolStatus } from 'api/type'
import { LoadingButton } from '@mui/lab'
import { useFixedSwapCreatorClaim } from 'plugins/auction/plugins/fixed-price/hooks/useFixedSwapHooks'
import { useUserInfo } from 'state/user/hooks'
import { useAuctionHistory } from 'plugins/auction/pages/erc20-create-pool/hooks'
import { useAllAuctionPoolInfo } from 'plugins/auction/hooks/useAuctionPoolInfo'
import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import { useStakingCreatorClaim } from 'plugins/auction/plugins/stake/hooks/useStakeHooks'
import { CoinResultType } from 'plugins/auction/plugins/stake/constants/type'
import { AuctionCategory } from 'plugins/auction/pages/erc20-create-pool/type'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import MarkSvg from 'assets/svg/auction/mark.svg'
import ReactMarkdown from 'react-markdown'
import useClaimAuctionFee from 'plugins/auction/hooks/useClaimAuctionFee'
interface IProps {
  itemData: IBoxAuctionPoolListDataItem
  editing: boolean
  listing: boolean
}
export const InfoPair = ({
  label,
  labelTip,
  text,
  startIcon,
  sx
}: {
  label: string
  labelTip?: string
  text: React.ReactNode
  startIcon?: JSX.Element | string
  sx?: SxProps
}) => {
  return (
    <Stack key={label} flexDirection={'row'} justifyContent={'space-between'} sx={{ ...sx }}>
      <Stack flexDirection={'row'} alignItems={'center'}>
        <Typography
          sx={{
            color: ' #FFFFE5',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '150%',
            opacity: 0.5,
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </Typography>
        {labelTip && (
          <Tooltip title={labelTip} placement="top">
            <IconButton>
              <MarkSvg />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack flexDirection={'row'} sx={{ gap: 4 }}>
        {typeof startIcon === 'string' && <CurrencyLogo currencyOrAddress={startIcon} size={'20px'} />}
        {typeof startIcon !== 'string' && startIcon}
        <Box color={'#FFFFE5'} sx={{ fontSize: 12 }}>
          {text}
        </Box>
      </Stack>
    </Stack>
  )
}
const StyledTeslaIcon = styled(TeslaIcon)`
  cursor: pointer;
  & g {
    stroke: ${({ theme }) => theme.palette.text.primary};
  }
`
const Title = styled(Typography)`
  color: #ffffe5;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  letter-spacing: -0.48px;
  text-transform: capitalize;
`
const PairColumn = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack sx={{ gap: 4 }}>
      <Title sx={{ opacity: 0.4, fontWeight: 400, fontSize: 12 }}>{label}</Title>
      <Title sx={{ fontWeight: 500, fontSize: 12 }}>{value}</Title>
    </Stack>
  )
}
const nowTime = () => new Date().getTime()
export default function Page({ itemData, editing, listing }: IProps) {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const bannerSrc = useMemo(() => {
    const { PCbannerUrl } = parseBanner(itemData.banner)
    return PCbannerUrl
  }, [itemData.banner])
  const poolInfo = useAllAuctionPoolInfo(itemData.factoryPoolId, itemData.category, { creator: itemData.creator })

  // TODO: No calculation of available quantity
  const [isCanClaim, claimStatus] = useMemo((): [boolean, 'Cancel' | 'Claim Tokens' | 'No'] => {
    // can cancel
    if (
      poolInfo?.creator?.toLocaleLowerCase() === account?.toLocaleLowerCase() &&
      poolInfo?.poolStatus === PoolStatus.Upcoming
    ) {
      return [true, 'Cancel']
    }

    if (
      itemData.category === AuctionCategory['Staking Auction'] &&
      poolInfo?.claimAt &&
      (poolInfo as CoinResultType)?.releaseDuration &&
      nowTime() > Number(poolInfo?.claimAt) * 1000 + Number((poolInfo as CoinResultType)?.releaseDuration) * 1000
    ) {
      return [false, 'No']
    }
    // can claim
    if (
      poolInfo?.creator?.toLocaleLowerCase() === account?.toLocaleLowerCase() &&
      poolInfo?.poolStatus === PoolStatus.Closed &&
      !poolInfo?.creatorClaimed
    ) {
      return [true, 'Claim Tokens']
    }
    return [false, 'No']
  }, [account, itemData.category, poolInfo])
  const userInfo = useUserInfo()
  const fixedSwapCreatorClaim = useFixedSwapCreatorClaim(
    userInfo.box?.boxAddress,
    itemData.factoryPoolId,
    poolInfo as any as IFixedPricePoolInfo | undefined
  )
  const stakingCreatorClaim = useStakingCreatorClaim(
    poolInfo as any as CoinResultType | undefined,
    itemData.factoryPoolId,
    userInfo.box?.boxAddress
  )
  const { claimFee, claimFeeSubmitted, currencyAmount, isCanClaimTxFee, amount } = useClaimAuctionFee(
    poolInfo || undefined,
    itemData.boxId
  )
  const { runWithModal: toClaim, submitted } = useMemo(() => {
    if (itemData.category === AuctionCategory['Fixed Price Auction']) {
      return { ...fixedSwapCreatorClaim }
    }

    return { ...stakingCreatorClaim }
  }, [fixedSwapCreatorClaim, itemData.category, stakingCreatorClaim])
  const { data } = useAuctionHistory(itemData.id)
  const isShowIncome = useMemo(() => {
    // in self edit club
    if (editing) {
      return true
    }
    // the auction extend self
    if (poolInfo?.creator?.toLocaleLowerCase() === account?.toLocaleLowerCase()) {
      return true
    }
    if (`${itemData.boxId}` === userInfo.box?.boxId) {
      return true
    }
    return false
  }, [account, editing, itemData.boxId, poolInfo?.creator, userInfo.box?.boxId])
  const isProxyAuction = useMemo(() => {
    if (itemData.creator?.toUpperCase() === account?.toUpperCase()) {
      return false
    }
    return !!(itemData.sourcePoolId && itemData.sourceBoxId)
  }, [account, itemData.creator, itemData.sourceBoxId, itemData.sourcePoolId])

  return (
    <Box
      onClick={() => {
        router.push(ROUTES.auction.poolDetail(`${itemData.boxId}`, itemData.id))
      }}
      sx={{
        width: '100%',
        height: { xs: '100%', md: 292 },
        borderRadius: 16,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(200px,375px) 1fr' },
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 229, 0.10)',
        cursor: 'pointer'
      }}
    >
      <Box sx={{ width: '100%', height: { xs: 250, md: '100%' }, position: 'relative' }}>
        <Box
          sx={{ width: 'fit-content', height: 'fit-content', position: 'absolute', left: 15.3, top: 15.12, zIndex: 1 }}
        >
          <CategoryBox category={itemData.category} />
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: `url(${bannerSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </Box>
      <Stack justifyContent={'space-between'} sx={{ padding: '19px 24px 24px 24px', position: 'relative' }}>
        <Title fontSize={24}>{itemData.name}</Title>
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 10 }}>
            <CurrencyLogo size="37px" currencyOrAddress={poolInfo?.token0} />
            <Title fontSize={17} sx={{ fontWeight: 700 }}>
              {poolInfo?.token0?.symbol?.toLocaleUpperCase() || '--'}
            </Title>
          </Stack>
          {isProxyAuction && (
            <Stack
              onClick={e => {
                e.stopPropagation()
                itemData.sourceBoxId && router.push(ROUTES.club.cusBox(itemData.sourceBoxId))
              }}
              flexDirection={'row'}
              alignItems={'center'}
              sx={{ gap: 8 }}
            >
              <Title sx={{ fontSize: 12, fontWeight: 500 }}> form</Title>
              {itemData.sourceClubAvatar ? (
                <Image
                  src={itemData.sourceClubAvatar || DefaultAvatar.src || ''}
                  style={{ borderRadius: 28.544 }}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
              ) : (
                <StyledTeslaIcon />
              )}
              <Title sx={{ fontSize: 12, fontWeight: 500 }}>{itemData.sourceClubName || '--'}</Title>
            </Stack>
          )}
          <PoolStatusBox
            style={{ height: '29px' }}
            status={poolInfo?.poolStatus}
            claimAt={poolInfo?.claimAt || 0}
            openTime={poolInfo?.openAt || 0}
            closeTime={poolInfo?.closeAt || 0}
          />
        </Stack>
        <Typography
          sx={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: 40,
            '& *': {
              fontSize: 14
            }
          }}
          color={'#FFFFE5'}
          component={Box}
        >
          {/* eslint-disable-next-line react/no-children-prop */}
          <ReactMarkdown children={itemData?.description || ''} />
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, gap: 20 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(80px,130px) minmax(80px,130px)', gap: 10 }}>
            <PairColumn label="Token Name" value={poolInfo?.token0?.symbol?.toLocaleUpperCase() || '--'} />
            <PairColumn
              label="Token Price"
              value={`${poolInfo?.swapRatio?.toSignificant() || '--'} ${
                poolInfo?.token1?.symbol?.toLocaleUpperCase() || '--'
              }`}
            />
            <PairColumn label="Token Amount" value={poolInfo?.currencyAmountTotal0?.toSignificant() || '--'} />
            <PairColumn label="Participants" value={`${data?.count || '0'}`} />
          </Box>
          {isShowIncome && (
            <Box sx={{ '&>div': { width: '100%' } }}>
              {!isCanClaim && !isCanClaimTxFee && (
                <InfoPair
                  label={'Successful Sold Amount'}
                  text={
                    <Typography
                      sx={{
                        color: '#ffffe5',
                        textAlign: 'right',
                        fontFamily: 'Sharp Grotesk DB Cyr Book 20',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '140%'
                      }}
                    >
                      {poolInfo?.currencyAmountSwap0?.toSignificant(4) || 0}
                    </Typography>
                  }
                />
              )}

              <InfoPair
                sx={{ '&>p': { fontSize: '12px ' } }}
                label={'Total Fund Raised'}
                text={
                  <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    sx={{
                      width: '100%',
                      gap: 5,
                      color: '#ffffe5',
                      fontFamily: 'Public Sans',
                      '&>p': {
                        fontSize: '12px'
                      },
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '150%',
                      letterSpacing: '-0.24px'
                    }}
                  >
                    <Typography>{poolInfo?.currencyAmountSwap1?.toSignificant(4) || '--'}</Typography>
                    <CurrencyLogo currencyOrAddress={poolInfo?.currencyAmountSwap1?.currency} />
                    <Typography>
                      {poolInfo?.currencyAmountSwap1?.currency.symbol?.toLocaleUpperCase() || '--'}
                    </Typography>
                  </Stack>
                }
              />

              <InfoPair
                // label={`Club Proxy Sales ${isProxyAuction ? 'Earned' : 'Charged'}`}
                label="Shares to Affiliated Clubs"
                text={
                  <Stack
                    flexDirection={'row'}
                    sx={{
                      width: '100%',
                      gap: 5,
                      textAlign: 'right',
                      fontFamily: 'Sharp Grotesk DB Cyr Book 20',
                      '&>p': { fontSize: '12px' },
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '140%'
                    }}
                  >
                    <Typography sx={{ color: 'var(--red, #F53030)' }}>
                      {poolInfo?.txFeeRatio
                        ? new BigNumber(poolInfo?.txFeeRatio?.toString() || 0)
                            .div(new BigNumber(10).pow(18))
                            .times(100)
                            .toFixed(2)
                        : '--'}{' '}
                      %
                    </Typography>
                    <Typography sx={{ color: '#FFFFE5' }}> / </Typography>
                    <Typography sx={{ color: '#908E96' }}>
                      {currencyAmount?.toSignificant() || '--'} {` `}
                      {currencyAmount?.currency.symbol?.toLocaleUpperCase() || '--'}
                    </Typography>
                  </Stack>
                }
              />
              <Stack sx={{ gap: 10 }} mt={5} flexDirection={'row'}>
                {isCanClaim && (
                  <LoadingButton
                    sx={[
                      {
                        width: '100%',
                        borderRadius: 36,
                        border: '1px solid rgba(255, 255, 229, 0.60)',
                        backgroundColor: 'transparent',
                        color: '#FFFFE5',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '150%',
                        letterSpacing: '-0.28px'
                      },
                      listing && {
                        opacity: 0.5,
                        cursor: 'default',
                        '&:hover': {
                          opacity: 0.5,
                          backgroundColor: 'transparent'
                        }
                      }
                    ]}
                    onClick={e => {
                      e.stopPropagation()
                      if (listing) {
                        return
                      }
                      toClaim()
                    }}
                    loading={submitted.pending}
                  >
                    {claimStatus}
                  </LoadingButton>
                )}
                {isCanClaimTxFee && amount.gt(0) && (
                  <LoadingButton
                    sx={{
                      width: '100%',
                      borderRadius: 36,
                      // border: '1px solid #171717',
                      backgroundColor: '#FFFFE5',
                      color: '#1C1C19',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: '150%',
                      letterSpacing: '-0.28px',
                      '&:hover': {
                        backgroundColor: '#FFFFE5'
                      },
                      ...(listing && {
                        opacity: 0.5,
                        cursor: 'default',
                        '&:hover': {
                          opacity: 0.5,
                          backgroundColor: '#FFFFE5'
                        }
                      })
                    }}
                    onClick={e => {
                      e.stopPropagation()
                      if (listing) {
                        return
                      }
                      claimFee()
                    }}
                    loading={claimFeeSubmitted.pending}
                  >
                    Claim fund raised
                  </LoadingButton>
                )}
              </Stack>
            </Box>
          )}
        </Box>
        {itemData && !itemData.factoryPoolId && (
          <Stack
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              background: 'rgba(0, 0, 0, 0.20)',
              backdropFilter: ' blur(5px)',
              zIndex: 2
            }}
          >
            <Button
              sx={{
                width: 133,
                height: 44,
                backgroundColor: '#E6E6CE',
                '&.disable': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  cursor: 'default'
                }
              }}
              className={listing ? 'disable' : ''}
              onClick={e => {
                e.stopPropagation()
                if (listing) {
                  return
                }
                router.push(ROUTES.auction.createPoolById(itemData.id))
              }}
            >
              Edit
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
