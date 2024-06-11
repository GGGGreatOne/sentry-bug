import { Box, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { Currency, CurrencyAmount } from 'constants/token'
import { IReleaseType } from 'plugins/auction/plugins/fixed-price/constants/type'
import React from 'react'
import { shortenAddress } from 'utils'
import DefaultAlertSvg from '../../../../assets/svg/detault-alert.svg'
import { Tip, WeightP } from '../../../poolDetail/Alert'
import { NextBtnStyle } from '../../components/createSubmitBtn'
import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import { IAuctionPoolResult } from 'plugins/auction/api/type'
import { useActiveWeb3React } from 'hooks'
import dayjs from 'dayjs'
import { useUserInfo } from 'state/user/hooks'
import { useAddAuctionToClub } from 'plugins/auction/api/hooks'
import auctionDialogControl from '..'
import { NULL_BYTES } from 'plugins/auction/plugins/fixed-price/constants'
import { toast } from 'react-toastify'
import { InformationDisplay } from '../erc20CreatePoolConfirm'
interface IProps {
  poolInfo: IFixedPricePoolInfo
  auctions: IAuctionPoolResult
  refreshAuctionInfo: () => void
}

export default function Page({ poolInfo, auctions, refreshAuctionInfo }: IProps) {
  const { chainId } = useActiveWeb3React()
  const userInfo = useUserInfo()
  const { runAsync: addAuctionToClub, loading } = useAddAuctionToClub(
    userInfo.box?.boxId as string,
    auctions.auction.id
  )

  return (
    <BaseDialog
      title="Add this auction to your Club for sale"
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
          {auctions.auction.name} {poolInfo.auctionType} Auction Pool
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '20px' }}>
          <Box p="24px" sx={{ borderRadius: 16, background: 'var(--grey-06, #F6F6F3)' }}>
            <Typography color={'#20201E'}>Token Information</Typography>
            <Stack sx={{ gap: 10 }}>
              <InformationDisplay label="Token Name" text={poolInfo.token0?.name?.toLocaleUpperCase() || '--'} />
              <InformationDisplay label="Token symbol" text={poolInfo.token0?.symbol?.toLocaleUpperCase() || '--'} />
              <InformationDisplay
                label="Contract address"
                text={shortenAddress(poolInfo.token0?.address || '') || '--'}
              />
              <InformationDisplay label="Token decimals" text={poolInfo.token0?.decimals || '--'} />
            </Stack>
          </Box>

          <Box p="24px" sx={{ borderRadius: 16, background: 'var(--grey-06, #F6F6F3)' }}>
            <Typography color={'#20201E'}>Participant Settings</Typography>
            <Stack sx={{ gap: 10 }}>
              <InformationDisplay
                label="Participation Limitation"
                text={auctions.auction.merkleRoot !== NULL_BYTES ? 'Whitelist' : 'Public'}
              />
              <InformationDisplay
                sx={{ color: '#FF3030' }}
                label="Raised Fund Sharing"
                text={`${
                  CurrencyAmount.fromRawAmount(
                    Currency.getNativeCurrency(chainId),
                    poolInfo.txFeeRatio?.toString() || '0'
                  )
                    ?.mul(100)
                    ?.toSignificant() || '--'
                } %`}
              />
            </Stack>
          </Box>

          <Box
            p="24px"
            sx={{ borderRadius: 16, background: 'var(--grey-06, #F6F6F3)', gridColumn: { xs: 1, md: 'span 2' } }}
          >
            <Typography color={'#20201E'}>Auction Information</Typography>
            <Stack sx={{ gap: 10 }}>
              <InformationDisplay label="Auction type" text={`${poolInfo.auctionType} Auction`} />
              <InformationDisplay
                label="Funding Currency"
                text={poolInfo.token1?.symbol?.toLocaleUpperCase() || '--'}
                startIcon={poolInfo.token1?.address || ''}
              />
              <InformationDisplay
                label="Swap Ratio"
                text={`1 ${
                  poolInfo.token0?.symbol?.toLocaleUpperCase() || '--'
                } = ${poolInfo.swapRatio?.toSignificant()} ${poolInfo.token1?.symbol?.toLocaleUpperCase()}`}
              />
              <InformationDisplay
                label="Total Supply"
                text={
                  poolInfo.currencyAmountTotal0?.toSignificant() + '  ' + poolInfo.token0?.symbol?.toLocaleUpperCase()
                }
              />
              <InformationDisplay
                label="Auction Time (UTC Time)"
                text={`Form ${dayjs((poolInfo.openAt || 0) * 1000)
                  .utc()
                  .format('YYYY-MM-DD HH:mm:ss')} to ${dayjs((poolInfo.closeAt || 0) * 1000)
                  .utc()
                  .format('YYYY-MM-DD HH:mm:ss')}`}
                hideText={false}
              />
              <InformationDisplay
                label="Allocation Per Wallet"
                text={`${
                  poolInfo.maxAmount1PerWallet?.greaterThan('0')
                    ? `Limit ${poolInfo.maxAmount1PerWallet.toSignificant()} ${poolInfo.maxAmount1PerWallet.currency.symbol
                        ?.toLocaleUpperCase()
                        ?.toLocaleUpperCase()}`
                    : 'No Limits'
                }`}
              />
              <InformationDisplay
                label="Token Unlock"
                text={`${
                  poolInfo.releaseType === IReleaseType.Instant
                    ? 'No'
                    : poolInfo.releaseType === IReleaseType.Cliff
                      ? dayjs((poolInfo.claimAt || 0) * 1000).format('YYYY-MM-DD HH:mm:ss')
                      : ''
                }`}
                hideText={false}
              />
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
            auctionDialogControl.hide('AddFixedSwapToClub')
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
