import { Box, Stack, styled, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { AuctionType } from 'plugins/auction/plugins/fixed-price/constants/type'
import React from 'react'
import { useUserInfo } from 'state/user/hooks'
import { shortenAddress } from 'utils'
import { IAuctionPoolResult } from 'plugins/auction/api/type'
import { CoinResultType } from 'plugins/auction/plugins/stake/constants/type'
import Dayjs from 'dayjs'
import { useAddAuctionToClub } from 'plugins/auction/api/hooks'
import DefaultAlertSvg from '../../../../assets/svg/detault-alert.svg'
import { NextBtnStyle } from '../../components/createSubmitBtn'
import auctionDialogControl from '..'
import { toast } from 'react-toastify'
import { InformationDisplay } from '../erc20CreatePoolConfirm'
interface IProps {
  poolInfo: CoinResultType
  auctions: IAuctionPoolResult
  refreshAuctionInfo: () => void
}

export const Tip = styled(Typography)`
  color: #908e96;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

export const WeightP = styled('span')`
  color: #171717;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

export default function AddStakingToClub({ poolInfo, auctions, refreshAuctionInfo }: IProps) {
  const userInfo = useUserInfo()
  const { runAsync: addAuctionToClub, loading } = useAddAuctionToClub(
    userInfo.box?.boxId as string,
    auctions.auction.id
  )

  return (
    <BaseDialog
      title="Creation confirmation"
      sx={{
        '& .MuiDialog-paper': { backgroundColor: '#fff', minWidth: { md: 1000, xs: 300 }, margin: { xs: 16, md: 32 } },
        '& .MuiDialogTitle-root h3': {
          width: '80%',
          color: 'var(--black-100, #121212)',
          fontWeight: 600
        }
      }}
    >
      <Box sx={{ borderRadius: 20, border: '1px solid var(--grey-05, #E8E9E4)', padding: { xs: 10, md: 30 } }}>
        <Typography sx={{ color: 'var(--grey-01, #20201E)', fontWeight: 600, pb: 20 }}>
          {auctions.auction.name} {AuctionType.STAKING_AUCTION} Auction Pool
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '20px' }}>
          <Box p="24px" sx={{ borderRadius: 16, background: 'var(--grey-06, #F6F6F3)' }}>
            <Typography color={'#20201E'}>Token Information</Typography>
            <Stack sx={{ gap: 10 }}>
              <InformationDisplay label="Token Name" text={poolInfo?.token0?.name?.toLocaleUpperCase() || '--'} />
              <InformationDisplay label="Token symbol" text={poolInfo?.token0?.symbol?.toLocaleUpperCase() || '--'} />
              <InformationDisplay
                label="Contract address"
                text={shortenAddress(poolInfo?.token0?.address || '') || '--'}
              />
              <InformationDisplay label="Token decimals" text={poolInfo?.token0?.decimals || '--'} />
            </Stack>
          </Box>

          <Box p="24px" sx={{ borderRadius: 16, background: 'var(--grey-06, #F6F6F3)' }}>
            <Typography color={'#20201E'}>Participant Settings</Typography>
            <Stack sx={{ gap: 10 }}>
              <InformationDisplay sx={{ color: '#FF3030' }} label="Raised Fund Sharing" text={`${poolInfo.txFee} %`} />
            </Stack>
          </Box>

          <Box
            p="24px"
            sx={{ borderRadius: 16, background: 'var(--grey-06, #F6F6F3)', gridColumn: { xs: 1, md: 'span 2' } }}
          >
            <Typography color={'#20201E'}>Auction Information</Typography>
            <Stack sx={{ gap: 10 }}>
              <InformationDisplay label="Auction Type" text={`${AuctionType.STAKING_AUCTION} Auction`} />
              <InformationDisplay
                label="Funding Currency"
                text={poolInfo?.token1?.symbol?.toLocaleUpperCase() || '--'}
                startIcon={poolInfo?.token1?.address || ''}
              />
              <InformationDisplay
                label="Funding Total Supply"
                text={`${poolInfo?.currencyAmountTotal1?.toSignificant()}  ${poolInfo?.token1?.symbol?.toLocaleUpperCase()}`}
              />
              <InformationDisplay
                label="Selling Total Supply"
                text={`${poolInfo?.currencyAmountTotal0?.toSignificant()}  ${poolInfo?.token0?.symbol?.toLocaleUpperCase()}`}
              />

              <InformationDisplay
                label="Auction Time (UTC Time)"
                text={`Form ${Dayjs((poolInfo.openAt || 0) * 1000)
                  .utc()
                  .format('YYYY-MM-DD HH:mm:ss')} to ${Dayjs((poolInfo.closeAt || 0) * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}`}
                hideText={false}
              />
              {/* TODO: release */}
              {poolInfo.claimAt && (
                <InformationDisplay
                  label="Token Unlock (UTC Time)"
                  text={`${Dayjs((poolInfo.claimAt || 0) * 1000)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')}`}
                  hideText={false}
                />
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
      <Stack
        mt={30}
        flexDirection={'row'}
        alignItems={'center'}
        sx={{ width: '100%', padding: '16px', gap: 16, borderRadius: 8, background: 'var(--yellow-light, #F9FCDE)' }}
      >
        <DefaultAlertSvg />
        <Tip sx={{ width: 'calc(100% - 50px)' }}>
          <WeightP>Clubs Proxy Sales Rule.</WeightP>{' '}
          {`Any Club can add another's Auction to promote and sell within its own Club. Upon auction conclusion, sales revenue generated via the private Club will be automatically distributed to the corresponding Club address, based on the sharing ratio set by the Creator.`}
        </Tip>
      </Stack>
      <NextBtnStyle
        sx={{ width: '100%', mt: 16 }}
        type="submit"
        variant="contained"
        onClick={() => {
          addAuctionToClub().then(() => {
            refreshAuctionInfo()
            auctionDialogControl.hide('AddStakingToClub')
            toast.warning('You need to submit your changes to update your club information!', {
              className: 'foo-bar'
            })
          })
        }}
        loading={loading}
      >
        Confirm
      </NextBtnStyle>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          mt: 16,
          color: 'var(--Desgin-Grey-01, #908E96)',
          textAlign: 'center',
          leadingTrim: 'both',
          textEdge: 'cap',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '150%',
          gap: 8
        }}
      >
        Once added, Auction Club Proxy sales cannot be removed.
      </Stack>
    </BaseDialog>
  )
}
