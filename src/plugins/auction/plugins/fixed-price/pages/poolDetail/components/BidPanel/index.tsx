import { Box, Stack, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import BidInput from 'plugins/auction/components/create-pool/components/BidInput'
import { useEffect, useMemo, useState } from 'react'
import BidButton from '../BidButton'
import CheckBox, { CheckStatus } from 'plugins/auction/components/create-pool/components/Check'
import { PoolStatus } from 'api/type'
import { CurrencyAmount } from 'constants/token'
import { IAuctionPoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import { IFixedPricePoolInfo } from 'plugins/auction/plugins/fixed-price/type'
import { InfoPair } from 'views/auction/components/list/launchpadItem'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'hooks/useToken'
import { IClaimAuctionFeeResult } from 'plugins/auction/hooks/useClaimAuctionFee'
interface IProps extends IAuctionPoolInfo {
  poolInfo: IFixedPricePoolInfo
  boxAddress: string | undefined
  auctionFeeInfo: IClaimAuctionFeeResult
  hasPermission: boolean
}

export default function Page(props: IProps) {
  const { poolInfo, isEnWhiteList, whitelist, boxAddress, auctionFeeInfo, hasPermission } = props
  const [amount, setAmount] = useState('0')
  const [checkStatus, setCheckStatus] = useState<CheckStatus>(CheckStatus.NoCheck)
  const { account, chainId } = useActiveWeb3React()
  const token1Balance = useCurrencyBalance(account, poolInfo.currencyAmountTotal1?.currency, chainId)
  const maxAmount = useMemo(() => {
    if (!poolInfo.token1) {
      return undefined
    }
    // total remain token
    const remainToken1Amount = CurrencyAmount.fromAmount(
      poolInfo.token1,
      new BigNumber(poolInfo.currencyAmountTotal1?.toExact() || '0')
        ?.minus(poolInfo.currencyAmountSwap1?.toExact() || '0')
        .toString()
    )
    // current can bid total amount
    let canBidAmount: CurrencyAmount | undefined

    if (poolInfo.maxAmount1PerWallet?.greaterThan('0')) {
      if (poolInfo.currencyAmountMySwap1?.equalTo(poolInfo.maxAmount1PerWallet)) {
        canBidAmount = CurrencyAmount.fromAmount(poolInfo.token1, '0')
      }
      // my remain token
      const remainMyToken1Amount = CurrencyAmount.fromAmount(
        poolInfo.token1,
        new BigNumber(poolInfo.maxAmount1PerWallet.toExact() || '0')
          .minus(poolInfo.currencyAmountMySwap1?.toExact() || '0')
          .toString()
      )
      if (remainMyToken1Amount && remainToken1Amount?.greaterThan(remainMyToken1Amount)) {
        canBidAmount = remainMyToken1Amount
      }

      if (remainToken1Amount && remainMyToken1Amount?.greaterThan(remainToken1Amount)) {
        canBidAmount = remainToken1Amount
      }
    } else {
      canBidAmount = remainToken1Amount
    }
    // current can bid total amount and balance comparison
    if (token1Balance) {
      if (token1Balance.greaterThan(canBidAmount || '0')) {
        return new BigNumber(canBidAmount?.toExact() || 0)
      } else {
        return new BigNumber(token1Balance.toExact())
      }
    }
    return undefined
  }, [
    poolInfo.token1,
    poolInfo.currencyAmountTotal1,
    poolInfo.currencyAmountSwap1,
    poolInfo.maxAmount1PerWallet,
    poolInfo.currencyAmountMySwap1,
    token1Balance
  ])
  const resetState = () => {
    setAmount('0')
    setCheckStatus(CheckStatus.NoCheck)
  }
  useEffect(() => {
    resetState()
  }, [account, chainId])
  return (
    <Box>
      {checkStatus !== CheckStatus.Checking && (
        <>
          {Number(poolInfo.poolStatus) <= PoolStatus.Live && (
            <Stack sx={{ gap: 10 }} mb={30}>
              <BidInput
                max={maxAmount}
                value={amount}
                onChange={v => {
                  setAmount(v)
                }}
                inputToken={poolInfo.currencyAmountTotal1?.currency}
              />
              <InfoPair
                sx={{ '&>div>p': { fontSize: 13, color: '#959595', opacity: 1 } }}
                label="Token you will recieve"
                text={
                  <Typography
                    sx={{
                      color: '#7190FF',
                      textAlign: 'center',
                      fontFamily: 'Public Sans',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '150%',
                      letterSpacing: '-0.32px'
                    }}
                  >
                    {poolInfo.swapRatio
                      ? new BigNumber(amount || 0).div(poolInfo.swapRatio?.toExact() || 0).toString()
                      : '--'}{' '}
                    {poolInfo.currencyAmountTotal0?.currency.symbol || '--'}
                  </Typography>
                }
              />
            </Stack>
          )}

          <BidButton
            poolInfo={poolInfo}
            checkStatus={checkStatus}
            isEnWhiteList={!!isEnWhiteList}
            whitelist={whitelist}
            amount={amount}
            boxAddress={boxAddress}
            toCheck={() => {
              setCheckStatus(CheckStatus.Checking)
            }}
            resetState={resetState}
            auctionFeeInfo={auctionFeeInfo}
            hasPermission={hasPermission}
          />
        </>
      )}
      {checkStatus === CheckStatus.Checking && (
        <CheckBox
          onToBid={() => {
            setCheckStatus(CheckStatus.Checked)
          }}
        />
      )}
    </Box>
  )
}
