import { Tuple } from '../../../type'
import { QuantosDetails } from '../../../hook/useFactory'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { Button, Stack, styled, Typography } from '@mui/material'
import * as React from 'react'
import { getLiqPrice, getTakeProfit } from '../../../utils'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useCloseTradeMarket } from '../../../hook/useCloseTradeMarket'
import { useClaimPendingOrder } from '../../../hook/useClaimPendingOrder'
import { LoadingButton } from '@mui/lab'
import { useLeverageStateData } from 'plugins/leverage/state/hooks'
import { control } from '../../components/dialog/modal'

type PositionsItemProps = {
  openTrade: Tuple
  index: number
  quantos: QuantosDetails
  tradePrice: BigNumber
  boxContractAdr: string
}

const BaseP = styled(Typography)`
  color: var(--ps-text-100);
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
  text-transform: capitalize;
  &.green {
    color: var(--ps-green);
  }
`

export const PositionItem = ({ openTrade, index, quantos, tradePrice, boxContractAdr }: PositionsItemProps) => {
  const { data: leverage } = useLeverageStateData()
  const tradePairIndex = leverage?.tradePairIndex || 0
  const closeMarket = useCloseTradeMarket(quantos.tradingT, boxContractAdr, tradePairIndex, openTrade.index)
  const claim = useClaimPendingOrder(quantos.tradingT, boxContractAdr, openTrade.orderId?.toNumber())

  const positionTp = useMemo(() => {
    if (new BigNumber(openTrade.openPrice).isEqualTo(0)) return new BigNumber(0)
    const tp = getTakeProfit(new BigNumber(openTrade.openPrice), tradePrice, openTrade.buy, openTrade.leverage, false)
    if (isNaN(tp.toNumber())) return new BigNumber(0)
    else return tp
  }, [tradePrice, openTrade])

  const liqPrice = useMemo(() => {
    return getLiqPrice(
      openTrade.openPrice as BigNumber,
      openTrade.initialPosToken as BigNumber,
      openTrade.buy,
      openTrade.leverage
    )
  }, [openTrade])

  return (
    <>
      {!openTrade.isPendingOrder && (
        <TableRow key={index}>
          <TableCell>
            <BaseP>BTC</BaseP>
            <Stack flexDirection={'row'} sx={{ gap: 8 }}>
              <BaseP>{openTrade.leverage} x</BaseP>
              <BaseP sx={{ color: openTrade.buy ? 'var(--ps-green)' : 'var(--ps-red)' }}>
                {' '}
                {openTrade.buy ? ' Long' : ' Short'}
              </BaseP>
            </Stack>
          </TableCell>
          <TableCell>
            <BaseP>
              {new BigNumber(openTrade.positionSizeDai).times(positionTp).div(100).toFixed(2)}{' '}
              {quantos ? quantos.tokenInfo?.symbol : ''}
            </BaseP>
            <BaseP sx={{ color: positionTp.isGreaterThan(0) ? 'var(--ps-green)' : 'var(--ps-red)' }}>
              ({positionTp.toFixed(2)} %)
            </BaseP>
          </TableCell>
          <TableCell>
            <BaseP>
              {new BigNumber(openTrade.positionSizeDai).times(openTrade.leverage).toFixed(2)}{' '}
              {quantos ? quantos.tokenInfo?.symbol : ''}
            </BaseP>
          </TableCell>
          <TableCell>
            <Stack flexDirection={'row'} sx={{ gap: 8 }} alignItems={'center'}>
              <BaseP>
                {new BigNumber(openTrade.positionSizeDai).toFixed(2)} {quantos ? quantos.tokenInfo?.symbol : ''}
              </BaseP>
            </Stack>
          </TableCell>
          <TableCell>
            <BaseP>${new BigNumber(openTrade.openPrice).toFixed(2)}</BaseP>
          </TableCell>
          <TableCell>
            <BaseP>${tradePrice.toFixed(2)}</BaseP>
          </TableCell>
          <TableCell
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() =>
              control.show('UpdatePosition', {
                boxAddress: boxContractAdr,
                quantos: quantos,
                openTrade: openTrade,
                marketPrice: tradePrice
              })
            }
          >
            <BaseP>${liqPrice.toFixed(2)}</BaseP>
          </TableCell>
          <TableCell>
            <Stack flexDirection={'row'} alignItems={'center'}>
              {!openTrade.beingMarketClosed && (
                <Button
                  variant="outlined"
                  onClick={() => closeMarket.runWithModal().then()}
                  sx={{
                    height: 29,
                    padding: '6px 16px',
                    border: '1px solid var(--ps-text-100)',
                    boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <BaseP sx={{ color: 'var(--ps-Dark-white)' }}>Close</BaseP>
                </Button>
              )}
              {openTrade.beingMarketClosed && (
                <LoadingButton
                  variant="outlined"
                  // onClick={() => closeMarket.runWithModal().then()}
                  loading={true}
                  sx={{
                    height: 29,
                    padding: '6px 16px',
                    '& .MuiLoadingButton-loadingIndicator': {
                      color: 'var(--ps-text-100)'
                    },
                    border: 'unset!important'
                    // boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {/*<BaseP sx={{ color: 'var(--ps-Dark-white)' }}>Close</BaseP>*/}
                </LoadingButton>
              )}
            </Stack>
          </TableCell>
        </TableRow>
      )}
      {openTrade.isPendingOrder && openTrade.leverage > 0 && (
        <TableRow key={index + '1'}>
          <TableCell>
            <BaseP>BTC</BaseP>
            <Stack flexDirection={'row'} sx={{ gap: 8 }}>
              <BaseP>{openTrade.leverage} x</BaseP>
              <BaseP className="green"> {openTrade.buy ? ' Long' : ' Short'}</BaseP>
            </Stack>
          </TableCell>
          <TableCell>
            <BaseP>
              {new BigNumber(openTrade.positionSizeDai).times(positionTp).div(100).toFixed(2)}{' '}
              {quantos ? quantos.tokenInfo?.symbol : ''}
            </BaseP>
            <BaseP className="green">({positionTp.toFixed(2)} %)</BaseP>
          </TableCell>
          <TableCell>
            <BaseP>
              {new BigNumber(openTrade.positionSizeDai).times(openTrade.leverage).toFixed(2)}{' '}
              {quantos ? quantos.tokenInfo?.symbol : ''}
            </BaseP>
          </TableCell>
          <TableCell>
            <Stack flexDirection={'row'} sx={{ gap: 8 }} alignItems={'center'}>
              <BaseP>
                {new BigNumber(openTrade.initialPosToken).toFixed(2)} {quantos ? quantos.tokenInfo?.symbol : ''}
              </BaseP>
            </Stack>
          </TableCell>
          <TableCell>
            <BaseP>${new BigNumber(openTrade.openPrice).toFixed(2)}</BaseP>
          </TableCell>
          <TableCell>
            <BaseP>${tradePrice.toFixed(2)}</BaseP>
          </TableCell>
          <TableCell>
            <BaseP>${liqPrice.toFixed(2)}</BaseP>
          </TableCell>
          <TableCell>
            <Stack flexDirection={'row'} alignItems={'center'}>
              {openTrade?.isInPending && (
                <Button
                  variant="outlined"
                  // onClick={() => closeTrade(openTrade.index, tradePairIndex)}
                  sx={{
                    height: 29,
                    padding: '6px 16px',
                    border: '1px solid var(--ps-text-100)',
                    boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <BaseP sx={{ color: 'var(--ps-Dark-white)' }}>Opening...</BaseP>
                </Button>
              )}
              {!openTrade?.isInPending && (
                <Button
                  variant="outlined"
                  onClick={() => claim.runWithModal().then()}
                  sx={{
                    height: 29,
                    padding: '6px 16px',
                    border: '1px solid var(--ps-text-100)',
                    boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <BaseP sx={{ color: 'var(--ps-Dark-white)' }}>Claim</BaseP>
                </Button>
              )}
            </Stack>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
