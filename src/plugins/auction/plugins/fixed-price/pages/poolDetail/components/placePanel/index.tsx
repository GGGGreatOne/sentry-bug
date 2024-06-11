import { Box, Stack, styled, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { InformationDisplay } from 'plugins/auction/components/create-pool/modal/erc20CreatePoolConfirm'
import PoolStatusBox from 'plugins/auction/components/poolDetail/PoolStatus'
import BidPanel from '../BidPanel'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import CreatorPanel from '../creatorPanel'
import { IAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import WarningIcon from '../../../../../../assets/svg/warning-icon.svg'
import { useCountDown } from 'ahooks'
import { InfoPair } from 'views/auction/components/list/launchpadItem'
import useClaimAuctionFee from 'plugins/auction/hooks/useClaimAuctionFee'
import { IClubAuthContainer } from 'hooks/boxes/useClubAuthCallback'
interface IProps extends IAuctionPoolInfo, IClubAuthContainer {
  poolInfo: IFixedPricePoolInfo
  boxAddress: string | undefined
}
const StyledSpan = styled(Stack)({
  display: 'inline-block',
  padding: '4px 8px',
  background: '#000000',
  borderRadius: 20,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  height: 'fit-content'
})
export default function Page(props: IProps) {
  const { poolInfo, auction, hasClubOwnerPermissions, hasUserPermissions } = props
  const { account } = useActiveWeb3React()
  const isCreator = useMemo(
    () => poolInfo.creator?.toLocaleLowerCase() === account?.toLocaleLowerCase(),
    [account, poolInfo.creator]
  )
  const isClaimingDelayed = (poolInfo.claimAt || 0) > (poolInfo.closeAt || 0)
  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: isClaimingDelayed ? (poolInfo.claimAt || 0) * 1000 : (poolInfo.closeAt || 0) * 1000
  })
  const auctionFeeInfo = useClaimAuctionFee(poolInfo, auction?.boxId)
  return (
    <Stack height={'100%'}>
      <Box>
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography sx={{ color: '#FFFFE5', fontSize: { xs: 20, md: 28 }, fontWeight: 600 }}>
            {account?.toLocaleUpperCase() === poolInfo.creator?.toLocaleUpperCase()
              ? 'My Pool'
              : poolInfo.currencyAmountMySwap1?.greaterThan('0')
                ? 'You Joined'
                : 'Join The Pool'}
          </Typography>
          <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 10 }}>
            <PoolStatusBox
              style={{ height: 'fit-content' }}
              status={poolInfo.poolStatus}
              openTime={poolInfo.openAt || 0}
              closeTime={poolInfo.closeAt || 0}
              claimAt={poolInfo.claimAt || 0}
            />
            {poolInfo.isUserClaim && (
              <StyledSpan flexDirection={'row'} alignItems={'center'} sx={{ gap: 5 }}>
                <WarningIcon style={{ marginTop: -3, marginRight: '4px', verticalAlign: 'middle' }} />
                <Typography variant="body1" color="#fff" component="span">
                  Claimable
                </Typography>
              </StyledSpan>
            )}
          </Stack>
        </Stack>
        {!isCreator && (
          <Stack sx={{ gap: 10 }} mt={30}>
            <InfoPair
              sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 }, gap: { xs: 20, md: 0 } }}
              label="Bid swap ratio"
              text={
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  flexWrap={'wrap'}
                  sx={{
                    gap: 5,
                    color: '#FFFFE5',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '150%',
                    letterSpacing: '-0.32px'
                  }}
                >
                  1 <CurrencyLogo currencyOrAddress={poolInfo.currencyAmountTotal0?.currency} />{' '}
                  {poolInfo.currencyAmountTotal0?.currency.symbol?.toLocaleUpperCase() || '--'} ={' '}
                  {poolInfo.swapRatio?.toSignificant()}{' '}
                  <CurrencyLogo currencyOrAddress={poolInfo.currencyAmountTotal1?.currency} />{' '}
                  {poolInfo.currencyAmountTotal1?.currency.symbol?.toLocaleUpperCase()}
                </Stack>
              }
            />
            <InfoPair
              sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 }, gap: { xs: 10, md: 0 } }}
              label={'Successful bid amount'}
              text={
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  flexWrap={'wrap'}
                  sx={{
                    gap: 5,
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '150%',
                    letterSpacing: '-0.32px',
                    whiteSpace: 'pre'
                  }}
                >
                  {poolInfo.currencyAmountMySwap0?.toSignificant()}{' '}
                  <CurrencyLogo currencyOrAddress={poolInfo.currencyAmountTotal0?.currency} />{' '}
                  {poolInfo.currencyAmountTotal0?.currency.symbol?.toLocaleUpperCase()}
                </Stack>
              }
            />
            {auctionFeeInfo.isCanClaimTxFee && (
              <InfoPair
                sx={{ '&>div>p': { fontSize: 13, color: '#908E96', opacity: 1 } }}
                label={'Club Proxy sales Earned'}
                text={
                  <Stack flexDirection={'row'} sx={{ gap: 5 }} flexWrap={'wrap'} alignItems={'center'}>
                    <Typography>{poolInfo.txFee} % / </Typography>
                    <Typography>{auctionFeeInfo.currencyAmount?.toSignificant(4) || '--'}</Typography>
                    <CurrencyLogo size="20px" currencyOrAddress={poolInfo.currencyAmountSwap1?.currency} />
                    <Typography>
                      {poolInfo.currencyAmountSwap1?.currency.symbol?.toLocaleUpperCase() || '--'}
                    </Typography>
                  </Stack>
                }
              />
            )}
            {poolInfo.isJoined && countdown > 0 ? (
              <>
                <InformationDisplay
                  label={'Claim token'}
                  text={
                    <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 5 }}>
                      in {days}d : {hours}h : {minutes}m : {seconds}s
                    </Stack>
                  }
                />
              </>
            ) : null}
          </Stack>
        )}
        {isCreator && (
          <Stack mt={30}>
            <InformationDisplay
              sx={{ alignItems: 'center' }}
              label={'Successful Sold Amount'}
              text={
                <Stack flexDirection={'row'} sx={{ gap: 5 }}>
                  <Typography>{poolInfo.amountBid0?.toString() || '--'}</Typography>
                  <CurrencyLogo size="20px" currencyOrAddress={poolInfo.currencyAmountTotal0?.currency} />
                  <Typography>{poolInfo.currencyAmountTotal0?.currency.symbol?.toLocaleUpperCase() || '--'}</Typography>
                </Stack>
              }
            />
            <InformationDisplay
              label={'Total Fund Raised'}
              text={
                <Stack flexDirection={'row'} sx={{ gap: 5 }}>
                  <Typography>{poolInfo.currencyAmountSwap1?.toSignificant(4) || '--'}</Typography>
                  <CurrencyLogo size="20px" currencyOrAddress={poolInfo.currencyAmountSwap1?.currency} />
                  <Typography>{poolInfo.currencyAmountSwap1?.currency.symbol?.toLocaleUpperCase() || '--'}</Typography>
                </Stack>
              }
            />
            <InformationDisplay
              label={'Shares to Affiliated Clubs'}
              text={
                <Stack flexDirection={'row'} sx={{ gap: 5 }}>
                  <Typography>{poolInfo.txFee} % / </Typography>
                  <Typography>{auctionFeeInfo.currencyAmount?.toSignificant(4) || '--'}</Typography>
                  <CurrencyLogo size="20px" currencyOrAddress={poolInfo.currencyAmountSwap1?.currency} />
                  <Typography>{poolInfo.currencyAmountSwap1?.currency.symbol?.toLocaleUpperCase() || '--'}</Typography>
                </Stack>
              }
            />
          </Stack>
        )}
      </Box>
      <Box>
        {!isCreator && (
          <Box mt={50}>
            <BidPanel
              {...props}
              poolInfo={poolInfo}
              auctionFeeInfo={auctionFeeInfo}
              hasPermission={hasUserPermissions}
            />
          </Box>
        )}
        {isCreator && (
          <Box mt={50}>
            <CreatorPanel
              boxAddress={props.boxAddress}
              poolInfo={poolInfo}
              auctionFeeInfo={auctionFeeInfo}
              hasPermission={hasClubOwnerPermissions}
            />
          </Box>
        )}
      </Box>
    </Stack>
  )
}
