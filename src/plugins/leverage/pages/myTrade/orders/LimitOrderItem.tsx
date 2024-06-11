import TableBody from '@mui/material/TableBody'
import { DelPanel } from '../index'
import { Button, Stack, styled, TableRow, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import { useCancelOpenLimitOrder } from '../../../hook/useCancelOpenLimitOrder'
import { QuantosDetails } from '../../../hook/useFactory'
import { TupleLimitOrder } from '../../../type'

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

export const LimitOrderItem = ({
  tradeQuantos,
  limit,
  boxContractAdr,
  tradePrice
}: {
  tradeQuantos: QuantosDetails
  limit: TupleLimitOrder
  boxContractAdr: string
  tradePrice: BigNumber
}) => {
  const getOrderContent = (isBuy: boolean, limitPrice: BigNumber, positionSize: BigNumber, leverage: number) => {
    return positionSize.times(leverage).toFixed(2) + tradeQuantos?.tokenInfo?.symbol
  }
  const { runWithModal } = useCancelOpenLimitOrder(
    tradeQuantos?.tradingT ?? '',
    boxContractAdr,
    limit.index,
    limit.pairIndex
  )
  return (
    <TableBody>
      <DelPanel>
        <TableRow>
          <TableCell>
            <BaseP className="green">Limit</BaseP>
          </TableCell>
          <TableCell>
            <BaseP>
              {getOrderContent(limit.buy, limit.minPrice, new BigNumber(limit.positionSize), limit.leverage)}
            </BaseP>
          </TableCell>
          <TableCell>
            <BaseP>${limit.minPrice.toFormat(2)}</BaseP>
          </TableCell>

          <TableCell>
            <BaseP>${tradePrice.toFormat(2)}</BaseP>
          </TableCell>

          <TableCell>
            <Stack flexDirection={'row'} alignItems={'center'}>
              <Button
                onClick={async () => {
                  await runWithModal()
                }}
                variant="outlined"
                sx={{
                  height: 29,
                  padding: '6px 16px',
                  border: '1px solid var(--ps-text-100)',
                  boxShadow: '2px 4px 8px 0px rgba(0, 0, 0, 0.08)',
                  marginLeft: 8
                }}
              >
                <BaseP sx={{ color: 'var(--ps-Dark-white)' }}>Cancel</BaseP>
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      </DelPanel>
    </TableBody>
  )
}
