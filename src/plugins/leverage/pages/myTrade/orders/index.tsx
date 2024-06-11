import * as React from 'react'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import { TableRow, styled, Box } from '@mui/material'
import { QuantosDetails } from '../../../hook/useFactory'
import BigNumber from 'bignumber.js'
import { LimitOrderItem } from './LimitOrderItem'
import { TupleLimitOrder } from '../../../type'
import useBreakpoint from '../../../../../hooks/useBreakpoint'

const TableStyle = styled(Table)`
  & .MuiTableCell-root {
    padding: 0;
    background: transparent;
    border-bottom: none;
    min-width: 70px;
  }
  & .MuiTableHead-root .MuiTableCell-root {
    color: var(--ps-neutral3);

    /* D/small */
    font-family: 'SF Pro Display';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 16.8px */
    text-transform: capitalize;
  }
  & .MuiTableBody-root > .MuiTableRow-root .MuiTableCell-root {
    padding: 16px 0;
  }
`

export default function Page({
  tradeQuantos,
  tradePrice,
  boxContractAdr,
  userLimitOrders
}: {
  tradeQuantos: undefined | QuantosDetails
  tradePrice: BigNumber
  boxContractAdr: string
  userLimitOrders: TupleLimitOrder[]
}) {
  const isLg = useBreakpoint('lg')
  return (
    <TableStyle sx={{ minWidth: isLg ? 1000 : '' }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Order</TableCell>
          <TableCell>Ask Price</TableCell>
          <TableCell>Mark price</TableCell>
          <TableCell width={125}></TableCell>
        </TableRow>
      </TableHead>
      {userLimitOrders.length === 0 && <Box sx={{ position: 'absolute', top: '50%', left: '40%' }}>No Order yet.</Box>}
      {userLimitOrders.length > 0 &&
        tradeQuantos &&
        userLimitOrders.map((limit, index) => {
          return (
            <LimitOrderItem
              key={index}
              tradeQuantos={tradeQuantos}
              limit={limit}
              boxContractAdr={boxContractAdr}
              tradePrice={tradePrice}
            />
          )
        })}
    </TableStyle>
  )
}
