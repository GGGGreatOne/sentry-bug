import BaseDialog from 'components/Dialog/baseDialog'

import { Box, Button, Stack, Typography } from '@mui/material'
import { InfoPair, TradeTuple } from '../../tradePanel/conductTrade'
import { QuantosDetails } from '../../../hook/useFactory'
import BigNumber from 'bignumber.js'
import { useOpenTrade } from '../../../hook/useOpenTrade'
import { useMemo } from 'react'
import { getOpenFees, withDecimals } from '../../../utils'
import { ApprovalState, useApproveCallback } from '../../../../../hooks/useApproveCallback'
import { CurrencyAmount } from '../../../../../constants/token'
import { control } from './modal'
import useBreakpoint from '../../../../../hooks/useBreakpoint'
import { WBB_ADDRESS } from '../../../constants'

export interface ConfirmLongProps {
  tradeTuple: TradeTuple
  quantos: QuantosDetails
  liqPrice: string
  tradeType: number
  boxContactAddr: string
}
const ConfirmLong = (confirmLongProps: ConfirmLongProps) => {
  const isSm = useBreakpoint('sm')
  const { tradeTuple, liqPrice, quantos, tradeType, boxContactAddr } = confirmLongProps
  const tuple = useMemo<TradeTuple>(() => {
    return {
      trader: tradeTuple.trader!,
      sl: tradeTuple.sl,
      tp: tradeTuple.tp,
      pairIndex: tradeTuple.pairIndex,
      openPrice: withDecimals(tradeTuple.openPrice, 10).toFixed(0, 1),
      leverage: tradeTuple.leverage,
      initialPosToken: tradeTuple.initialPosToken,
      index: tradeTuple.index,
      buy: tradeTuple.buy,
      positionSizeDai: withDecimals(tradeTuple.positionSizeDai, quantos.tokenInfo?.decimals ?? 18).toString()
    }
  }, [tradeTuple, quantos.tokenInfo?.decimals])
  const { runWithModal } = useOpenTrade({
    tuple: tuple,
    tradingAddress: quantos.tradingT,
    tradeType: tradeType,
    spreadReductionId: 0,
    slippageP: '3399999999',
    referral: '0x0000000000000000000000000000000000000000',
    boxContactAddr: boxContactAddr,
    isWBB: quantos.tokenT.toLowerCase() === WBB_ADDRESS.toLowerCase(),
    onSuccess: () => control.hide('ConfirmLong')
  })

  const [approveState, approve] = useApproveCallback(
    quantos.tokenInfo ? CurrencyAmount.fromAmount(quantos.tokenInfo, tuple.positionSizeDai) : undefined,
    quantos.storageT,
    false,
    true
  )

  return (
    <BaseDialog
      title={`Confirm ${tradeTuple.buy ? 'Long' : 'Short'}`}
      sx={{ '& .MuiDialog-paper': { minWidth: isSm ? 330 : 450 } }}
    >
      <Box
        sx={{
          padding: '32px 0px',
          borderRadius: 12,
          background: 'var(--ps-neutral2)',
          '& span,& p': {
            color: 'var(--ps-Dark-white)',
            fontFamily: '"SF Pro Display"',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '140%',
            '& .value': {
              color: 'var(--ps-neutral3)'
            }
          }
        }}
      >
        <Typography sx={{ textAlign: 'center' }}>
          <span>Pay</span>
          <span style={{ margin: '0 4px' }}>
            {tradeTuple.positionSizeDai.replace(/^0+(?=\d)/, '')} {quantos?.tokenInfo?.symbol}
          </span>
        </Typography>
      </Box>
      <Box mt={32}>
        <Stack sx={{ gap: 8 }}>
          <InfoPair fontSize="medium" label="Leverage" value={tradeTuple.leverage + ' x'} />
          <InfoPair fontSize="medium" label="Allowed Slippage" value={'0.03%'} />
        </Stack>
        <Box my={32} sx={{ width: '100%', height: '1px', background: 'var(--ps-text-10)' }}></Box>
        <Stack mt={16} sx={{ gap: 8 }}>
          <InfoPair fontSize="medium" label="Collateral Spread" value={'0.00%'} />
          <InfoPair fontSize="medium" label="Mark Price" value={tradeTuple.openPrice} />
          <InfoPair fontSize="medium" label="Liq. Price" value={liqPrice} />
        </Stack>
        <Box my={32} sx={{ width: '100%', height: '1px', background: 'var(--ps-text-10)' }}></Box>
        <Stack mt={16} sx={{ gap: 8 }}>
          <InfoPair
            fontSize="medium"
            link="http://localhost:3000/club/editBox"
            label="Size"
            value={
              new BigNumber(tradeTuple.positionSizeDai)
                .times(tradeTuple.leverage)
                .minus(getOpenFees(new BigNumber(tradeTuple.positionSizeDai), tradeTuple.leverage))
                .toString() +
              ' ' +
              quantos?.tokenInfo?.symbol
            }
          />
          <InfoPair
            fontSize="medium"
            link="http://localhost:3000/club/editBox"
            label="Collateral"
            value={
              new BigNumber(tradeTuple.positionSizeDai).minus(
                getOpenFees(new BigNumber(tradeTuple.positionSizeDai), 1)
              ) +
              ' ' +
              quantos?.tokenInfo?.symbol
            }
          />
        </Stack>
      </Box>

      <Button
        variant="contained"
        sx={{
          width: '100%',
          height: 44,
          padding: '12px 24px',
          marginTop: 32,
          background: 'var(--ps-red)',
          color: 'var(--ps-text-100)',
          fontFamily: '"SF Pro Display"',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '100%'
        }}
        onClick={async () => {
          if (approveState !== ApprovalState.APPROVED && quantos.tokenT.toLowerCase() !== WBB_ADDRESS.toLowerCase())
            await approve()
          await runWithModal()
        }}
      >
        {tradeTuple.buy ? 'Long' : 'Short'}
      </Button>
    </BaseDialog>
  )
}
export default ConfirmLong
