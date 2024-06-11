import {
  Box,
  Pagination,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'hooks/useToken'
import { IPaginationParams, PoolEvent } from 'plugins/auction/api/type'
import { useAuctionHistory } from 'plugins/auction/pages/erc20-create-pool/hooks'

import { shortenAddress } from 'utils'
import NoDataPng from 'plugins/auction/assets/imgs/no-data.png'
import { useCallback, useState } from 'react'
import AddressCopy from '../Copy'
export const StyledHistoryTableCell = styled(TableCell)(() => ({
  borderBottom: '1px solid rgba(230, 230, 206, 0.10)',
  [`&.${tableCellClasses.head}`]: {
    color: '#908E96',
    backgroundColor: 'transparent',
    paddingTop: '4px',
    paddingBottom: '4px'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#E6E6CE'
  },
  '&.MuiTableCell-root': {
    BorderBottom: '1px solid #F5F5F5'
  }
}))

export const StyledHistoryTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(230, 230, 206, 0.10)',

    'td:first-of-type': {
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20
    },
    'td:last-child': {
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20
    }
  },
  td: {
    border: 0
  }
}))

const SaleTypography = (
  <Typography
    sx={{
      width: 'max-content',
      color: '#20994B',
      // background: '#CFF8D1',
      padding: '4px 8px',
      borderRadius: 100,
      textAlign: 'center'
    }}
  >
    Sale
  </Typography>
)
const CreatorClaimedTypography = (
  <Typography
    sx={{
      width: 'max-content',
      color: '#20994B',
      // background: '#CFF8D1',
      padding: '4px 8px',
      borderRadius: 100,
      textAlign: 'center'
    }}
  >
    CreatorClaimed
  </Typography>
)
const BidTypography = (
  <Typography
    sx={{
      width: 'max-content',
      color: '#2B51DA',
      // background: '#D6DFF6',
      padding: '4px 8px',
      borderRadius: 100,
      textAlign: 'center'
    }}
  >
    Bid
  </Typography>
)
const BetTypography = (
  <Typography
    sx={{
      width: 'max-content',
      color: '#20994B',
      // background: '#CFF8D1',
      padding: '4px 8px',
      borderRadius: 100,
      textAlign: 'center'
    }}
  >
    Bet
  </Typography>
)
const RegretTypography = (
  <Typography
    sx={{
      width: 'max-content',
      color: '#A45E3F',
      // background: '#F9E3DA',
      padding: '4px 8px',
      borderRadius: 100,
      textAlign: 'center'
    }}
  >
    Regret
  </Typography>
)

export const PoolEventTypography: Record<PoolEvent, JSX.Element> = {
  AuctionFixedSwapSwap: SaleTypography,
  Reversed: RegretTypography,
  CreatorClaimed: CreatorClaimedTypography,
  Bid: BidTypography,
  Bet: BetTypography,
  AuctionStakingCommitted: SaleTypography
}
const NoData = () => (
  <Stack>
    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
    <img src={NoDataPng.src} style={{ width: '100%', height: '100%' }} />
  </Stack>
)

const TokenCell = ({ tokenAddress, amount }: { tokenAddress: string; amount: string }) => {
  const { chainId } = useActiveWeb3React()
  const token0 = useToken(tokenAddress, chainId)
  return (
    <StyledHistoryTableCell>
      {!!Number(amount) ? Number(amount).toFixed(4) : amount}
      &nbsp;
      {token0?.symbol?.toUpperCase() || '--'}
    </StyledHistoryTableCell>
  )
}
const ActionHistory = ({
  noTitle = false,
  children,
  poolId,
  swapRatio
}: {
  noTitle?: boolean
  children?: React.ReactNode
  poolId: string | undefined
  swapRatio: string | undefined
}) => {
  const [paginationParams, setPaginationParams] = useState<IPaginationParams>({
    pageNum: 1,
    pageSize: 10,
    isAsc: 'desc',
    orderByColumn: 'createTime'
  })
  const { data, pagination, loading } = useAuctionHistory(poolId, paginationParams)
  const paginationHandle = useCallback(
    (e: any, _: number) => {
      pagination.changeCurrent(_)
      setPaginationParams({ ...paginationParams, pageNum: _ })
    },
    [pagination, paginationParams]
  )
  return (
    <Box sx={{ height: '100%', overflowY: 'hidden' }}>
      {!noTitle && (
        <Typography
          variant="h2"
          sx={{
            ml: 12,
            color: ' #E6E6CE',
            fontSize: { xs: 24, md: 36 },
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '130%',
            letterSpacing: '-0.72px'
          }}
        >
          Auction History
        </Typography>
      )}
      {!poolId && (
        <Box py={10}>
          <NoData />
        </Box>
      )}
      {poolId && (
        <Stack justifyContent={'space-between'} sx={{ height: '100%', pt: { xs: 20, md: 0 } }} pb={20}>
          {data && data?.list.length > 0 ? (
            <TableContainer sx={{ mt: 20 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <StyledHistoryTableRow>
                    <StyledHistoryTableCell>Event</StyledHistoryTableCell>
                    <StyledHistoryTableCell>Amount</StyledHistoryTableCell>
                    <StyledHistoryTableCell>Address</StyledHistoryTableCell>
                    <StyledHistoryTableCell>Date</StyledHistoryTableCell>
                  </StyledHistoryTableRow>
                </TableHead>
                <TableBody>
                  {data.list.map(record => (
                    <StyledHistoryTableRow key={record.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <StyledHistoryTableCell>{PoolEventTypography[record.eventType]}</StyledHistoryTableCell>
                      <TokenCell
                        tokenAddress={record.token0Address || ''}
                        amount={`${
                          swapRatio ? new BigNumber(record.token1Amount || '0').div(swapRatio || '0').toString() : '--'
                        }`}
                      />
                      <StyledHistoryTableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '& svg rect, & svg path': {
                              stroke: '#E6E6CE'
                            }
                          }}
                        >
                          <AddressCopy toCopy={record.sender}>
                            <Typography>{shortenAddress(record.sender)}</Typography>
                          </AddressCopy>
                        </Box>
                      </StyledHistoryTableCell>
                      <StyledHistoryTableCell>
                        {record.ts ? dayjs(record.ts * 1000).format('YYYY/MM/DD hh:mm ') : '--'}
                      </StyledHistoryTableCell>
                    </StyledHistoryTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : !loading ? (
            <Box sx={{ width: '100%' }}>{children ? children : <NoData />}</Box>
          ) : (
            <NoData />
          )}
          {data !== undefined && data.total > 0 && pagination.totalPage > 1 && (
            <Pagination
              color="primary"
              sx={{
                margin: '16px auto 0 !important',
                '& .MuiButtonBase-root': {
                  color: '#E6E6CE !important',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  color: '#E6E6CE',
                  textDecoration: 'underline'
                }
              }}
              count={pagination.totalPage}
              page={paginationParams.pageNum}
              onChange={paginationHandle}
              boundaryCount={1}
              defaultPage={1}
            />
          )}
        </Stack>
      )}
    </Box>
  )
}

export default ActionHistory
