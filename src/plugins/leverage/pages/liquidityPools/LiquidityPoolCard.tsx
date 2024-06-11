import { Box, Button, Stack, Typography } from '@mui/material'
import { useGetUserLiquidityInfo } from '../../hook/useGetUserLiquidityInfo'
import { QuantosDetails } from '../../hook/useFactory'
import { control } from '../components/dialog/modal'
import CurrencyLogo from '../../../../components/essential/CurrencyLogo'
import { WBB_ADDRESS } from '../../constants'
import { ZERO_ADDRESS } from '../../../../constants'
import { useCurrencyBalance } from '../../../../hooks/useToken'
import { Currency } from '../../../../constants/token'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from '../../../../hooks'

export type UserLiquidityInfo = {
  userWalletBalance: BigNumber
  daiDeposited: BigNumber
}

export const LiquidityPoolCard = ({ quanto, boxContactAddr }: { quanto: QuantosDetails; boxContactAddr: string }) => {
  const { account, chainId } = useActiveWeb3React()
  const userDeposited = useGetUserLiquidityInfo(quanto.bTokenT, quanto.tokenInfo?.decimals)
  const isWBB = useMemo(() => {
    return quanto?.tokenT.toLowerCase() === WBB_ADDRESS.toLowerCase()
  }, [quanto])
  const tokenInfo = useCurrencyBalance(
    account,
    new Currency(
      chainId ?? 6001,
      isWBB ? ZERO_ADDRESS : quanto?.tokenT ?? '',
      // quanto?.tokenT ?? '',
      quanto?.tokenInfo?.decimals ?? 18
    ),
    chainId
  )

  const userWalletBalance = useMemo(() => {
    return new BigNumber(tokenInfo?.toExact() ?? '0')
  }, [tokenInfo])

  const info = useMemo<UserLiquidityInfo>(() => {
    return {
      userWalletBalance: userWalletBalance,
      daiDeposited: userDeposited ?? new BigNumber(0)
    }
  }, [userWalletBalance, userDeposited])

  return (
    <Stack
      sx={{
        width: '100%',
        // maxWidth: 357,
        gap: 20,
        padding: '24px 16px',
        borderRadius: 12,
        background: 'var(--ps-neutral)'
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center' }}>
        <CurrencyLogo currencyOrAddress={quanto?.tokenInfo} size={'24px'} />
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.3,
            marginLeft: 8
          }}
        >
          {quanto.tokenInfo?.symbol}
        </Typography>
        <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 13, marginRight: 8 }}>Utilization</Typography>
        <Typography sx={{ color: 'var(--ps-neutral4)', fontSize: 15, fontWeight: 500 }}>
          {quanto?.utilization.isNaN() ? '0' : quanto?.utilization.toFixed(2)}%
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: '1px', backgroundColor: 'var(--ps-text-10)' }}></Box>
      <Box>
        <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 13 }}>Total Liquidity Provision</Typography>
        <Typography sx={{ color: 'var(--ps-text-100)', fontSize: 15, fontWeight: 500 }}>
          {quanto.totalSupply.toFixed(2)}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 13 }}>Your Liquidity Provision</Typography>
        <Typography sx={{ color: 'var(--ps-text-100)', fontSize: 15, fontWeight: 500 }}>
          {typeof userDeposited !== 'undefined' ? info?.daiDeposited?.toFixed(2) : '0'}
        </Typography>
      </Box>
      {/*<Stack*/}
      {/*  flexDirection={'row'}*/}
      {/*  justifyContent={'space-between'}*/}
      {/*  sx={{ padding: 16, borderRadius: 10, background: 'var(--ps-text-primary)' }}*/}
      {/*>*/}
      {/*  <Typography sx={{ color: 'var(--ps-neutral3)', fontSize: 13 }}>LP BONUS APR</Typography>*/}
      {/*  <Typography sx={{ color: 'var(--ps-text-100)', fontSize: 15, fontWeight: 500 }}>*/}
      {/*    {poolInfo.lpBonusApr}%*/}
      {/*  </Typography>*/}
      {/*</Stack>*/}
      {userWalletBalance?.isGreaterThan(0) && (
        <Button
          variant="contained"
          sx={{
            width: '100%',
            borderRadius: 100,
            background: 'var(--ps-text-100)',
            color: 'var(--ps-text-primary)',
            fontSize: 15,
            fontWeight: 500
          }}
          onClick={() =>
            control.show('AddLiquidity', {
              quanto: quanto,
              userLiquidityInfo: info,
              boxContactAdr: boxContactAddr,
              isWBB: isWBB
            })
          }
          // onClick={() => addLiquidity()}
        >
          Add Liquidity
        </Button>
      )}
      {userDeposited?.isGreaterThan(0) && (
        <Button
          sx={{
            width: '100%',
            borderRadius: 100,
            background: 'transparent',
            border: '1px solid var(--ps-text-100)',
            color: 'var(--ps-text-100)',
            fontSize: 15,
            fontWeight: 500
          }}
          // onClick={() => control.show('AddLiquidity', { quanto: quanto })}
          onClick={() =>
            control.show('RemoveLiquidity', {
              quanto: quanto,
              userLiquidityInfo: info,
              boxContactAdr: boxContactAddr
            })
          }
        >
          remove
        </Button>
      )}
    </Stack>
  )
}
