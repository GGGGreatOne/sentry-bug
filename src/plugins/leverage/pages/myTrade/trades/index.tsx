import { Box, styled, TableRow } from '@mui/material'
import { useRequest } from 'ahooks'
import { useActiveWeb3React } from '../../../../../hooks'
import { GetLeverageTradeHistory } from '../../../../../api/boxes'
import { useLeverageStateData } from '../../../state/hooks'
import { TradeItem } from './TradeItem'
import { QuantosDetails } from '../../../hook/useFactory'
import { LeverageHistory } from '../../../../../api/boxes/type'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import * as React from 'react'
import Table from '@mui/material/Table'
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

const Page = ({ boxId, tradeQuantos }: { boxId: string | number; tradeQuantos: QuantosDetails | undefined }) => {
  const isLg = useBreakpoint('lg')
  const { account } = useActiveWeb3React()
  const { data: bitleverageData } = useLeverageStateData()

  const { data: historyList } = useRequest(
    async () => {
      if (!boxId) return undefined
      const res = await GetLeverageTradeHistory({
        tradeIndex: bitleverageData.tradePairIndex,
        boxId: Number(boxId),
        tradeTrader: account
      })
      if (res.code === 200) {
        const targetHistory = res.data.list.filter(d => tradeQuantos?.tokenT.includes(d.token))
        console.log('targetHistory', targetHistory)
        return targetHistory
      } else return undefined
    },
    { refreshDeps: [account, boxId, tradeQuantos] }
  )
  return (
    <TableStyle sx={{ minWidth: isLg ? 1000 : '' }} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Leverage</TableCell>
          <TableCell>Coll</TableCell>
          <TableCell>PnL</TableCell>
        </TableRow>
      </TableHead>
      {!historyList ||
        (historyList?.length === 0 && (
          <Box sx={{ position: 'absolute', top: '50%', left: '40%' }}>No History yet.</Box>
        ))}
      {historyList &&
        historyList.length > 0 &&
        historyList.map((item: LeverageHistory, index: number) => {
          return <TradeItem key={index} history={item} tradeQuantos={tradeQuantos} />
        })}
    </TableStyle>
    // <Stack sx={{ agp: 8 }}>
    //   <DelPanel>
    //     {!historyList || historyList?.length === 0 }
    //     {historyList && historyList.length > 0 && historyList.map((item: LeverageHistory) => {
    //       return <TradeItem history={item} />
    //     })}
    //
    //   </DelPanel>
    // </Stack>
  )
}

export default Page
