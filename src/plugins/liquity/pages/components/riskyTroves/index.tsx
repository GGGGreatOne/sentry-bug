import {
  Box,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses
} from '@mui/material'
import BigNumber from 'bignumber.js'
import EmptyData from 'components/EmptyData'
import LoadingAnimation from 'components/Loading'
import Copy from 'components/essential/Copy'
import { useActiveWeb3React } from 'hooks'
import { useGetBitstableTroveList } from 'hooks/boxes/useGetBitstableTroveList'
import { useSingleCallResult } from 'hooks/multicall'
import useBreakpoint from 'hooks/useBreakpoint'
import { useTroveManagerContract } from 'plugins/liquity/hooks/useContract'
import { TroveInfoProps } from 'plugins/liquity/hooks/useLiquityInfo'
import { useCallback, useMemo } from 'react'
import { formatBigNumber, shortenAddress } from 'utils'

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 16,
    borderBottom: '0 !important',
    backgroundColor: 'transparent'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    borderBottom: 0
  }
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    background: '#FFFFFF0D',
    borderRadius: '8px !important'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    // border: 0
  }
}))

function UserDebt({ address, troveInfo }: { address: string; troveInfo: TroveInfoProps }) {
  const { chainId } = useActiveWeb3React()
  const troveContract = useTroveManagerContract(troveInfo.troveManagerContractAddr)
  const userDebtAmountRes = useSingleCallResult(chainId, troveContract, 'getEntireDebtAndColl', [address], undefined)
  const userDebtAmount = useMemo(() => {
    if (userDebtAmountRes.result) {
      return new BigNumber(userDebtAmountRes.result[0].toString()).div(`1e${troveInfo.stableToken.decimals}`)
    }
    return undefined
  }, [troveInfo.stableToken.decimals, userDebtAmountRes.result])
  return (
    <Typography width={'100%'} textAlign={'center'}>
      {userDebtAmount && formatBigNumber(userDebtAmount, 2)}
    </Typography>
  )
}

function UserColl({ address, troveInfo }: { address: string; troveInfo: TroveInfoProps }) {
  const { chainId } = useActiveWeb3React()
  const troveContract = useTroveManagerContract(troveInfo.troveManagerContractAddr)
  const userPendingCollAmountRes = useSingleCallResult(
    chainId,
    troveContract,
    'getPendingETHReward',
    [address],
    undefined
  )
  const userTroveCollAmountRes = useSingleCallResult(chainId, troveContract, 'getTroveColl', [address], undefined)

  const userCollateralAmount = useMemo(() => {
    if (userTroveCollAmountRes.result && userPendingCollAmountRes.result) {
      return new BigNumber(userTroveCollAmountRes.result[0].toString())
        .plus(new BigNumber(userPendingCollAmountRes.result[0].toString()))
        .div(`1e${troveInfo.btcToken.decimals}`)
    }
    return undefined
  }, [troveInfo.btcToken.decimals, userPendingCollAmountRes.result, userTroveCollAmountRes.result])
  return (
    <Typography width={'100%'} textAlign={'center'}>
      {userCollateralAmount && formatBigNumber(userCollateralAmount, 6)}
    </Typography>
  )
}

function UserCollRatio({ address, troveInfo }: { address: string; troveInfo: TroveInfoProps }) {
  const { chainId } = useActiveWeb3React()
  const troveManagerContract = useTroveManagerContract(troveInfo.troveManagerContractAddr)
  const userCollateralRatioRes = useSingleCallResult(
    chainId,
    troveManagerContract,
    'getCurrentICR',
    [address, troveInfo.btcPrice?.raw.toString()],
    undefined
  )
  const ratio = useMemo(() => {
    if (userCollateralRatioRes.result) {
      return new BigNumber(userCollateralRatioRes.result?.[0].toString()).div(`1e${troveInfo.btcToken.decimals}`)
    }
    return undefined
  }, [troveInfo.btcToken.decimals, userCollateralRatioRes.result])
  return (
    <>
      {new BigNumber(ratio || 0).times(100).gt(150) && (
        <Typography color={'#1FC64E'}>{new BigNumber(ratio || 0).times(100).toFixed(2)}%</Typography>
      )}
      {new BigNumber(ratio || 0).times(100).lt(110) && (
        <Typography color={'#D12A1F'}>{new BigNumber(ratio || 0).times(100).toFixed(2)}%</Typography>
      )}
      {new BigNumber(ratio || 0).times(100).gt(110) && new BigNumber(ratio || 0).times(100).lt(150) && (
        <Typography color={'#F7931B'}>{new BigNumber(ratio || 0).times(100).toFixed(2)}%</Typography>
      )}
    </>
  )
}

export interface Props {
  boxId: string | number
  troveInfo: TroveInfoProps
  setTroveStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Page({ boxId, troveInfo, setTroveStep }: Props) {
  const isMd = useBreakpoint('md')
  const { data, loading, pagination } = useGetBitstableTroveList({
    boxId: boxId.toString(),
    pageNum: 0,
    pageSize: 10
  })
  setTroveStep
  const paginationHandle = useCallback(
    (e: any, _: number) => {
      pagination.changeCurrent(_)
    },
    [pagination]
  )

  return (
    <Stack
      spacing={16}
      sx={{
        width: isMd ? 'calc(100vw - 40px)' : 'auto',
        padding: isMd ? '12px 16px' : '32px 40px',
        background: 'var(--ps-neutral2)',
        borderRadius: '12px'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} spacing={8}>
          <Typography fontSize={20}>Risky Troves</Typography>
        </Stack>
        <Stack direction={'row'} spacing={8} alignItems={'center'}>
          <Typography>Total Troves</Typography>
          <Typography>{data?.total?.toString() || 0}</Typography>
        </Stack>
      </Stack>
      <Stack sx={{ width: '100%', border: '0.5px solid #FFFFFF1A', margin: '16px 0 0 !important' }} />
      {loading && (
        <Box
          sx={{
            display: 'grid',
            placeContent: 'center',
            width: 220,
            height: 220,
            margin: '0 auto !important'
          }}
        >
          <LoadingAnimation />
        </Box>
      )}
      {data?.list && data?.list?.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: isMd ? '100%' : 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Owner</StyledTableCell>
                <StyledTableCell>
                  <Stack justifyContent={'center'}>
                    <Typography width={'100%'} textAlign={'center'}>
                      Collateral
                    </Typography>
                    <Typography
                      width={'100%'}
                      textAlign={'center'}
                      fontSize={14}
                      sx={{
                        opacity: 0.5
                      }}
                    >
                      {troveInfo.btcToken.symbol?.toLocaleUpperCase()}
                    </Typography>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell>
                  <Stack justifyContent={'center'}>
                    <Typography width={'100%'} textAlign={'center'}>
                      Debt
                    </Typography>
                    <Typography
                      width={'100%'}
                      textAlign={'center'}
                      fontSize={14}
                      sx={{
                        opacity: 0.5
                      }}
                    >
                      {troveInfo.stableToken.symbol?.toLocaleUpperCase()}
                    </Typography>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell align="right">Coll.Ratio</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.list.map(row => (
                <StyledTableRow key={row.borrower}>
                  <StyledTableCell component="th" scope="row">
                    <Stack direction={'row'} spacing={10} alignItems={'center'}>
                      <Typography>{shortenAddress(row.borrower || '')}</Typography>
                      <Copy toCopy={row.borrower || ''}></Copy>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Stack spacing={10} justifyContent={'center'}>
                      <UserColl address={row.borrower || ''} troveInfo={troveInfo} />
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Stack spacing={10} justifyContent={'center'}>
                      <UserDebt address={row.borrower || ''} troveInfo={troveInfo} />
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <UserCollRatio address={row.borrower || ''} troveInfo={troveInfo} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!data?.list.length && !loading && (
        <EmptyData
          size={14}
          color="var(--ps-text-60)"
          sx={{
            margin: '140px auto !important'
          }}
        />
      )}
      {data !== undefined && data.total > 0 && (
        <Pagination
          sx={{
            margin: '16px auto 0 !important'
          }}
          count={pagination.totalPage}
          page={pagination.current}
          className="text-center"
          onChange={paginationHandle}
        />
      )}
    </Stack>
  )
}
