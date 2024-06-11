import { styled, TableRow, Typography } from '@mui/material'
import { LeverageHistory } from '../../../../../api/boxes/type'
import { useMemo } from 'react'
import TableBody from '@mui/material/TableBody'
import { DelPanel } from '../index'
import TableCell from '@mui/material/TableCell'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import { withDecimals } from '../../../utils'
import { QuantosDetails } from '../../../hook/useFactory'

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

export const TradeItem = ({
  history,
  tradeQuantos
}: {
  history: LeverageHistory
  tradeQuantos: undefined | QuantosDetails
}) => {
  const pnlValue = useMemo(() => {
    if (history) {
      return new BigNumber(history.percentProfit).isEqualTo(0)
        ? new BigNumber(0)
        : withDecimals(
            new BigNumber(history.daiSentToTrader).minus(history.tradeInitialPosToken),
            tradeQuantos?.tokenInfo?.decimals ?? 18,
            false
          )
    } else return new BigNumber(0)
  }, [history, tradeQuantos?.tokenInfo?.decimals])
  return (
    <TableBody>
      <DelPanel>
        <TableRow>
          <TableCell>
            <BaseP>{history.createTime.split(' ')[0]}</BaseP>
          </TableCell>
          <TableCell>
            <BaseP sx={{ color: history.tradeBuy ? 'var(--ps-green)' : 'var(--ps-red)' }}>
              {history.marketType.toUpperCase()}
            </BaseP>
          </TableCell>
          <TableCell>
            <BaseP>${withDecimals(new BigNumber(history.price), 10, false).toFixed(2)}</BaseP>
          </TableCell>

          <TableCell>
            <BaseP>{history.tradeLeverage}</BaseP>
          </TableCell>

          <TableCell>
            <BaseP>
              {withDecimals(
                new BigNumber(history.positionSizeDai),
                tradeQuantos?.tokenInfo?.decimals ?? 18,
                false
              ).toFixed(2)}
              {tradeQuantos?.tokenInfo?.symbol}
            </BaseP>
          </TableCell>
          <TableCell>
            <BaseP
              sx={{
                color: pnlValue.isGreaterThan(0) ? 'var(--ps-green)' : pnlValue.isEqualTo(0) ? '' : 'var(--ps-red)'
              }}
            >
              {pnlValue.isEqualTo(0) ? '-' : pnlValue.toFixed(2)}{' '}
              {pnlValue.isEqualTo(0) ? '' : tradeQuantos?.tokenInfo?.symbol}
            </BaseP>
          </TableCell>
        </TableRow>
      </DelPanel>
    </TableBody>
    // <Box sx={{ padding: 16, borderRadius: 10, background: 'var(--ps-neutral)' }}>
    //   <Typography
    //     sx={{
    //       color: 'var(--ps-neutral3)',
    //       fontFamily: 'SF Pro Display',
    //       fontSize: '12px',
    //       fontStyle: 'normal',
    //       fontWeight: '400',
    //       lineHeight: '140%', // 16.8px
    //       textTransform: 'capitalize'
    //     }}
    //   >
    //     09 Jul 2023,2:35 PM
    //   </Typography>
    //   <Typography
    //     sx={{
    //       color: 'var(--ps-text-100)',
    //       fontFamily: 'SF Pro Display',
    //       fontSize: '15px',
    //       fontStyle: 'normal',
    //       fontWeight: '400',
    //       lineHeight: '140%', // 21px,
    //       marginTop: 4
    //     }}
    //   >
    //     Increase BTC Long,+16.36 USD,BTC Price:30,250.41 USD
    //   </Typography>
    // </Box>
  )
}
