import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Box, styled } from '@mui/material'
import { DelPanel } from '..'
import { QuantosDetails } from '../../../hook/useFactory'
import { PositionItem } from './PositionItem'
import BigNumber from 'bignumber.js'
import { Tuple } from '../../../type'
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
  userOpenTrades
}: {
  tradeQuantos: undefined | QuantosDetails
  tradePrice: BigNumber
  boxContractAdr: string
  userOpenTrades: Tuple[]
}) {
  const isLg = useBreakpoint('lg')
  return (
    <TableStyle sx={{ minWidth: isLg ? 1000 : '' }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Position</TableCell>
          <TableCell>Net value</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Collateral</TableCell>
          <TableCell>Entry price</TableCell>
          <TableCell>Mark price</TableCell>
          <TableCell>Liq.price</TableCell>
          <TableCell width={125}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <DelPanel>
          {userOpenTrades.length === 0 && (
            <Box sx={{ position: 'absolute', top: '50%', left: '40%' }}>No Position yet.</Box>
          )}
          {userOpenTrades.length > 0 &&
            tradeQuantos &&
            userOpenTrades.map((openTrade, index) => {
              return (
                <PositionItem
                  key={index}
                  openTrade={openTrade}
                  index={index}
                  quantos={tradeQuantos}
                  tradePrice={tradePrice}
                  boxContractAdr={boxContractAdr}
                />
              )
            })}
        </DelPanel>
      </TableBody>
    </TableStyle>
  )
}
