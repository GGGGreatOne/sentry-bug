import { Box, Button, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Input from 'components/Input'
import { useMemo, useState } from 'react'
import { Tuple } from '../../../type'
import BigNumber from 'bignumber.js'
import { getLiqPrice, getTakeProfit } from '../../../utils'
import { useUpdateTradeMarket } from '../../../hook/useUpdateTradeMarket'
import { QuantosDetails } from '../../../hook/useFactory'
import { control } from './modal'

enum SlLimitState {
  'UPDATE',
  'SL_GT_OPEN_PRICE',
  'SL_LT_OPEN_PRICE',
  'MAX_SL_LIMIT',
  'INVALID'
}

enum TpLimitState {
  'UPDATE',
  'TP_GT_OPEN_PRICE',
  'TP_LT_OPEN_PRICE',
  'MAX_TP_LIMIT',
  'INVALID'
}

enum TpButtonText {
  'UPDATE' = 'update',
  'TP_GT_OPEN_PRICE' = 'Take Profit great then open price',
  'TP_LT_OPEN_PRICE' = 'Take Profit less then open price',
  'MAX_TP_LIMIT' = 'The maximum percentage cannot exceed 900%',
  'INVALID' = 'Invalid number'
}

enum SlButtonText {
  'UPDATE' = 'update',
  'SL_GT_OPEN_PRICE' = 'Stop loss great then open price',
  'SL_LT_OPEN_PRICE' = 'Stop loss less then open price',
  'MAX_SL_LIMIT' = 'The maximum percentage cannot exceed 75%',
  'INVALID' = 'Invalid number'
}

const UpdatePosition = ({
  openTrade,
  marketPrice,
  quantos,
  boxAddress
}: {
  openTrade: Tuple
  marketPrice: BigNumber
  quantos: QuantosDetails
  boxAddress: string
}) => {
  const [slPrice, setSlPrice] = useState('')
  const [tpPrice, setTpPrice] = useState('')
  // const [slPercentage, setSlPercentage] = useState('None')
  // const [tpPercentage, setTpPercentage] = useState('None')
  const { updateSl, updateTp } = useUpdateTradeMarket(quantos.tradingT, boxAddress, () =>
    control.hide('UpdatePosition')
  )
  const liqPrice = useMemo(() => {
    if (openTrade && marketPrice)
      return getLiqPrice(marketPrice, new BigNumber(openTrade.positionSizeDai), openTrade.buy, openTrade.leverage)
    else return new BigNumber(0)
  }, [marketPrice, openTrade])

  const slPercentage = useMemo(() => {
    if (!slPrice) return 'None'
    else
      return getTakeProfit(
        new BigNumber(openTrade.openPrice),
        new BigNumber(slPrice),
        openTrade.buy,
        openTrade.leverage,
        true
      )
  }, [openTrade.buy, openTrade.leverage, slPrice, openTrade.openPrice])

  const tpPercentage = useMemo(() => {
    if (!tpPrice) return 'None'
    else
      return getTakeProfit(
        new BigNumber(openTrade.openPrice),
        new BigNumber(tpPrice),
        openTrade.buy,
        openTrade.leverage,
        false
      )
  }, [openTrade.buy, openTrade.leverage, tpPrice, openTrade.openPrice])

  const slLimit = useMemo(() => {
    const percentage = getTakeProfit(
      new BigNumber(openTrade.openPrice),
      new BigNumber(slPrice),
      openTrade.buy,
      openTrade.leverage,
      true
    )
    if (
      new BigNumber(slPrice).isGreaterThanOrEqualTo(openTrade.openPrice) &&
      openTrade.buy &&
      !new BigNumber(slPrice).isEqualTo(0)
    )
      return SlLimitState.SL_GT_OPEN_PRICE
    if (
      new BigNumber(slPrice).isLessThanOrEqualTo(openTrade.openPrice) &&
      !openTrade.buy &&
      !new BigNumber(slPrice).isEqualTo(0)
    )
      return SlLimitState.SL_LT_OPEN_PRICE
    if (new BigNumber(slPrice).isNaN() || new BigNumber(slPrice).isLessThan(0)) return SlLimitState.INVALID
    if (percentage.isLessThan(-75) && !new BigNumber(slPrice).isEqualTo(0)) return SlLimitState.MAX_SL_LIMIT
    return SlLimitState.UPDATE
  }, [slPrice, openTrade.buy, openTrade.leverage, openTrade.openPrice])

  const tpLimit = useMemo(() => {
    const percentage = getTakeProfit(
      new BigNumber(openTrade.openPrice),
      new BigNumber(tpPrice),
      openTrade.buy,
      openTrade.leverage,
      false
    )
    if (new BigNumber(tpPrice).isNaN() || new BigNumber(tpPrice).isLessThan(0)) return TpLimitState.INVALID
    if (new BigNumber(tpPrice).isLessThanOrEqualTo(openTrade.openPrice) && openTrade.buy)
      return TpLimitState.TP_LT_OPEN_PRICE
    if (new BigNumber(tpPrice).isGreaterThanOrEqualTo(openTrade.openPrice) && !openTrade.buy)
      return TpLimitState.TP_GT_OPEN_PRICE
    if (percentage.isGreaterThan(900)) return TpLimitState.MAX_TP_LIMIT
    return TpLimitState.UPDATE
  }, [tpPrice, openTrade.buy, openTrade.leverage, openTrade.openPrice])

  const tpButtonText = useMemo(() => {
    if (tpLimit === TpLimitState.MAX_TP_LIMIT) return TpButtonText.MAX_TP_LIMIT
    if (tpLimit === TpLimitState.TP_LT_OPEN_PRICE) return TpButtonText.TP_LT_OPEN_PRICE
    if (tpLimit === TpLimitState.TP_GT_OPEN_PRICE) return TpButtonText.TP_GT_OPEN_PRICE
    if (tpLimit === TpLimitState.INVALID) return TpButtonText.INVALID
    return TpButtonText.UPDATE
  }, [tpLimit])

  const slButtonText = useMemo(() => {
    if (slLimit === SlLimitState.MAX_SL_LIMIT) return SlButtonText.MAX_SL_LIMIT
    if (slLimit === SlLimitState.SL_LT_OPEN_PRICE) return SlButtonText.SL_LT_OPEN_PRICE
    if (slLimit === SlLimitState.SL_GT_OPEN_PRICE) return SlButtonText.SL_GT_OPEN_PRICE
    if (slLimit === SlLimitState.INVALID) return SlButtonText.INVALID
    return SlButtonText.UPDATE
  }, [slLimit])

  return (
    <BaseDialog title="UPDATE SL/TP">
      <Box sx={{ padding: 16, borderRadius: 12, background: 'var(--ps-text-primary)', mb: '8px' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            textAlign: 'start',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          <span>Stop loss&nbsp;</span>
          <span style={{ color: 'var(--ps-red)' }}>
            ({new BigNumber(slPercentage).isNaN() ? 'None' : new BigNumber(slPercentage).toFixed(2) + '%'})
          </span>
        </Typography>
        <Stack flexDirection={'row'} alignItems={'center'}>
          <Input
            value={slPrice}
            type="number"
            onChange={e => setSlPrice(e.target.value)}
            placeholder="0.00"
            style={{ paddingLeft: 0 }}
          />
          <Button
            disabled={slLimit !== SlLimitState.UPDATE}
            onClick={async () => {
              await updateSl.runWithModal([
                0,
                openTrade.index,
                new BigNumber(slPrice).times(Number(1e10)).toFixed(0, 1)
              ])
            }}
            sx={{
              padding: '6px 16px',
              backgroundColor: 'var(--ps-text-100)',
              minWidth: 'unset',
              whiteSpace: 'nowrap',
              width: 'auto',
              height: 29,
              borderRadius: 4
            }}
          >
            {slButtonText}
          </Button>
        </Stack>
      </Box>
      <Box sx={{ padding: 16, borderRadius: 12, background: 'var(--ps-text-primary)' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            textAlign: 'start',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          <span>Take proft&nbsp;</span>
          <span style={{ color: 'var(--ps-green)' }}>
            ({new BigNumber(tpPercentage).isNaN() ? 'None' : new BigNumber(tpPercentage).toFixed(2) + '%'})
          </span>
        </Typography>
        <Stack flexDirection={'row'} alignItems={'center'}>
          <Input
            value={tpPrice}
            type="number"
            onChange={e => setTpPrice(e.target.value)}
            placeholder="0.00"
            style={{ paddingLeft: 0 }}
          />
          <Button
            disabled={tpLimit !== TpLimitState.UPDATE}
            onClick={async () => {
              await updateTp.runWithModal([
                0,
                openTrade.index,
                new BigNumber(tpPrice).times(Number(1e10)).toFixed(0, 1)
              ])
            }}
            sx={{
              padding: '6px 16px',
              backgroundColor: 'var(--ps-text-100)',
              minWidth: 'unset',
              whiteSpace: 'nowrap',
              width: 'auto',
              height: 29,
              borderRadius: 4
            }}
          >
            {tpButtonText}
          </Button>
        </Stack>
      </Box>
      <Box my={32} sx={{ width: '100%', height: '1px', backgroundColor: 'var(--ps-text-10)' }}></Box>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mb: '8px' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Current Price
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          ${marketPrice.toFormat(2)}
        </Typography>
      </Stack>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mb: '8px' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Liquidation price
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          ${liqPrice.toFormat(2)}
        </Typography>
      </Stack>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mb: '8px' }}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Current TP
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          ${new BigNumber(openTrade.tp).toFormat(2)}
        </Typography>
      </Stack>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography
          sx={{
            color: 'var(--ps-neutral5)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '100%'
          }}
        >
          Current SL
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: 'SF Pro Display',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '140%'
          }}
        >
          ${new BigNumber(openTrade.sl).toFormat(2)}
        </Typography>
      </Stack>
    </BaseDialog>
  )
}
export default UpdatePosition
