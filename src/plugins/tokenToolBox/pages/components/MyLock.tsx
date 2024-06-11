import BaseDialog from 'components/Dialog/baseDialog'
import { NETWORK_CHAIN_ID } from 'constants/chains'
import { useMyLocks } from 'plugins/tokenToolBox/hook/useTokenLockInfo'
import { ILockType } from 'plugins/tokenToolBox/type'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { LockInfo } from 'api/toolbox/type'

import {
  Box,
  Button,
  Pagination,
  // Pagination,
  Stack,
  styled,
  Typography
} from '@mui/material'
import Table from 'plugins/tokenToolBox/pages/components/Table'
import { useToken } from 'hooks/useToken'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'hooks/multicall'
import { Currency, CurrencyAmount } from 'constants/token'
// import { ROUTES } from 'constants/routes'
import { viewControl } from 'views/editBox/modal'
import { useReleasaData, useReleasaNoLiearData } from 'plugins/tokenToolBox/hook/useTokenTimelock'
import dayjs from 'dayjs'
import { SectionItem } from './ComonComponents'
import SelectToken, { useGetPairToken } from './SelectToken'
import Image from 'components/Image'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import { TokenType } from 'api/common/type'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import useRafInterval from 'ahooks/lib/useRafInterval'
import EmptyData from 'components/EmptyData'

interface Props {
  boxAddress: string
  rKey: number
}

const mapType = (type: string) => {
  switch (type) {
    case ILockType.Normal:
      return 'Normal'
    case ILockType.Linear:
      return 'Linear'
    case ILockType.Stage:
      return 'Stage'
    // case ILockType.V2:
    //   return 'V2 LP Token'
    // case ILockType.V3:
    //   return 'V3 LP Token'
    default:
      return ''
  }
}

const TokenItem = ({
  label,
  value,
  startNode,
  endNode,
  justifyContent = 'start'
}: {
  label?: string
  value: ReactNode
  startNode?: ReactNode
  endNode?: ReactNode
  justifyContent?: 'end' | 'center' | 'start'
}) => {
  return (
    <Stack gap={4}>
      <Typography color="var(--ps-neutral3)" fontSize={12} lineHeight={1.4} fontFamily={'IBM Plex Sans'}>
        {label}
      </Typography>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={justifyContent} gap={12}>
        {startNode}
        <Typography color="var(--ps-text-100)" fontSize={15} lineHeight={1.4} fontFamily={'IBM Plex Sans'}>
          {value}
        </Typography>
        {endNode}
      </Stack>
    </Stack>
  )
}

const TokenRow = ({ item }: { item: LockInfo }) => {
  const router = useRouter()
  return (
    <Stack gap={16}>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <TokenItem
          label="Token"
          value={''}
          startNode={<ShowToken item={item} />}
          endNode={!item.logoUri && <Box mr={16}></Box>}
        />
      </Stack>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <TokenItem label="Amount" value={<ShowTokenAmount item={item} />} />
        <TokenItem label="Lock Model" value={mapType(item.lockType)} />
      </Stack>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <TokenItem label="Unlock Time" value={<ShowUnLockTime item={item}></ShowUnLockTime>} />
      </Stack>
      <Button
        sx={{
          height: '26px',
          padding: '8px 16px'
        }}
        variant={'contained'}
        onClick={() => {
          // viewControl.hide('MyLock')
          switch (item.lockType) {
            case ILockType.Normal:
            case ILockType.Linear:
            case ILockType.Stage:
              viewControl.show('TokenLockerInfo', {
                chainId: NETWORK_CHAIN_ID.toString(),
                hash: item.hash
              })
              break
            default:
              router.push(ROUTES.tokenToolBox.tokenLPLockerInfo(NETWORK_CHAIN_ID.toString(), item.hash))
              break
          }
        }}
      >
        Detail
      </Button>
    </Stack>
  )
}
const MdTokenList = ({ list }: { list: LockInfo[] }) => {
  return (
    <Stack
      gap={0}
      mt={8}
      // sx={{
      //   height: 'calc(100vh - 490px)',
      //   overflowY: 'scroll',
      //   '::-webkit-scrollbar': {
      //     width: 0
      //   }
      // }}
    >
      {list.map(v => {
        return (
          <Box key={v.id}>
            <TokenRow key={v.id} item={v} />
            <Line />
          </Box>
        )
      })}
    </Stack>
  )
}

const ShowToken = ({ item }: { item: LockInfo }) => {
  const { token0Address, token1Address } = useGetPairToken(item.token)
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)
  if (token0Address) {
    return (
      <Stack flexDirection={'row'} gap={12} alignItems={'center'}>
        <DoubleCurrencyLogo size={24} currency0={token0Address || undefined} currency1={token1Address || undefined} />
        <Typography fontSize={15} color={'var(--ps-text-100)'}>
          {token0?.symbol} / {token1?.symbol}
        </Typography>
      </Stack>
    )
  }
  return (
    <Stack flexDirection={'row'} gap={12} alignItems={'center'}>
      {item.logoUri && <Image src={item.logoUri} alt="" width={40} height={40} style={{ borderRadius: '50%' }}></Image>}
      <ShowTokenName item={item} />
    </Stack>
  )
}

const PairsList = ({ data, pagination }: { data: LockInfo[]; pagination: any }) => {
  const router = useRouter()
  const isMd = useBreakpoint('md')

  const staticTitle = ['Token', 'Amount', 'Lock Model', 'Unlock Time', '']
  const [headData] = useState(staticTitle)

  const List = useMemo(() => {
    return data.map(v => {
      return [
        <Cell key={v.token}>
          <ShowToken item={v} />
        </Cell>,
        <Cell key={v.id}>
          <ShowTokenAmount item={v} />
        </Cell>,
        <Cell key={v.contract}>
          <Typography fontSize={15} color={'var(--ps-text-100)'}>
            {mapType(v.lockType)}
          </Typography>
        </Cell>,
        <Cell key={v.txTs}>
          <ShowUnLockTime item={v}></ShowUnLockTime>
        </Cell>,
        <Cell key={v.hash}>
          <Stack minWidth={120} width={'100%'} alignItems={'end'}>
            <Button
              sx={{
                height: '26px',
                padding: '8px 16px'
              }}
              variant={'contained'}
              onClick={() => {
                // viewControl.hide('MyLock')
                switch (v.lockType) {
                  case ILockType.Normal:
                  case ILockType.Linear:
                  case ILockType.Stage:
                    viewControl.show('TokenLockerInfo', {
                      chainId: NETWORK_CHAIN_ID.toString(),
                      hash: v.hash
                    })
                    break
                  default:
                    router.push(ROUTES.tokenToolBox.tokenLPLockerInfo(NETWORK_CHAIN_ID.toString(), v.hash))
                    break
                }
              }}
            >
              Detail
            </Button>
          </Stack>
        </Cell>
      ]
    })
  }, [data, router])
  return (
    <>
      {isMd &&
        (pagination.total > 0 ? <MdTokenList list={data} /> : <EmptyData height={200} color="var(--ps-text-60)" />)}
      {!isMd && (
        <StyleTable>{<Table noDataHeight={440} variant="outlined" header={headData} rows={List} />}</StyleTable>
      )}
    </>
  )
}

const MyLock = ({ boxAddress, rKey }: Props) => {
  const isMd = useBreakpoint('md')
  const [checkToken, setCheckToken] = useState<Currency | undefined>()
  const { data, pagination, run } = useMyLocks(checkToken?.address)
  const [timerInterval] = useState<number>(10000)
  const paginationHandle = useCallback(
    (e: any, _: number) => {
      pagination.changeCurrent(_)
    },
    [pagination]
  )

  const clearInterval = useRafInterval(() => {
    run({ current: pagination.current, pageSize: pagination.pageSize })
  }, timerInterval)

  return (
    <BaseDialog
      key={rKey}
      title="Your Locker"
      mt={12}
      minWidth={850}
      onClose={() => {
        pagination.changeCurrent(1)
        clearInterval()
      }}
      bottomChild={
        pagination.totalPage > 0 && (
          <CusPagination
            sx={{
              margin: '16px auto 0 !important'
            }}
            siblingCount={isMd ? 0 : undefined}
            boundaryCount={isMd ? 0 : undefined}
            count={pagination.totalPage}
            page={pagination.current}
            className="text-center"
            onChange={paginationHandle}
          />
        )
      }
    >
      <Container gap={40}>
        <Stack flexDirection={'column'} justifyContent={'space-between'}>
          <Button
            sx={{ width: isMd ? '100%' : 'max-content', alignSelf: isMd ? 'start' : 'end' }}
            variant="contained"
            onClick={() => {
              viewControl.hide('MyLock')
              clearInterval()
              viewControl.show('TokenLock', {
                tokenType: TokenType.TOKEN,
                LockInfo: {},
                boxAddress: boxAddress,
                rKey: Math.random()
              })
            }}
          >
            + Lock
          </Button>
        </Stack>
        <SectionItem label="Select token">
          <SelectToken clearable={true} checkToken={checkToken} setCheckToken={setCheckToken} />
        </SectionItem>
        <Box>
          <SectionItem label="Lock records">
            {data?.list && <PairsList pagination={pagination} data={data.list} />}
          </SectionItem>
        </Box>
      </Container>
    </BaseDialog>
  )
}

const StyleTable = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: 17,

  thead: {
    tr: {
      th: { padding: '0 0px !important' },

      '.MuiTableCell-root': {
        color: 'var(--ps-neutral3)',
        backgroundColor: 'var(--ps-neutral)'
      },

      '.MuiTableCell-root:last-child': {
        textAlign: 'end'
      }
    }
  },
  tbody: {
    tr: {
      height: '72px',
      td: {
        padding: '6px 0px !important'
      },
      '.MuiTableCell-root': {
        borderBottom: '1px solid var(--ps-text-10)'
      }
    },

    'tr:hover': {
      background: 'none'
    },

    'tr:last-of-type': {
      '.MuiTableCell-root': {
        width: '25%',
        borderBottom: '1px solid transparent'
      },
      '.MuiTableCell-root:first-of-type': {
        borderBottom: '1px solid transparent'
      },
      '.MuiTableCell-root:last-of-type': {
        borderBottom: '1px solid transparent'
      }
    },

    '.MuiTableCell-root': {
      width: '25%'
    }
  },

  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: 16
  }
}))
const Cell = styled(Box)`
  display: flex;
  width: max-content;
  align-items: center;
  gap: 12px;
`

function ShowTokenName({ item }: { item: LockInfo }) {
  const isNft = useMemo(() => !!item.tokenId, [item.tokenId])
  const token = useToken(isNft ? item.token : item.token, NETWORK_CHAIN_ID)
  const ta = useTokenContract(isNft ? item.token : undefined)
  const nameRes = useSingleCallResult(NETWORK_CHAIN_ID, ta, 'symbol').result
  return (
    <Typography fontSize={15} color={'var(--ps-text-100)'}>
      {token?.symbol || nameRes?.[0] || '--'}
    </Typography>
  )
}

function ShowTokenAmount({ item }: { item: LockInfo }) {
  const isNft = useMemo(() => !!item.tokenId, [item.tokenId])
  const token = useToken(isNft ? '' : item.token || item.token, NETWORK_CHAIN_ID)
  const taAmount = useMemo(() => (token ? new CurrencyAmount(token, item.amount) : undefined), [item.amount, token])
  return (
    <Typography fontSize={15} color={'var(--ps-text-100)'}>
      {isNft ? '1' : taAmount?.toSignificant() || '--'}
    </Typography>
  )
}

function ShowUnLockTime({ item }: { item: LockInfo }) {
  const useHook = item.lockType === ILockType.Linear ? useReleasaData : useReleasaNoLiearData
  const { noLiearData, linearData } = useHook(item?.deployContract || '', NETWORK_CHAIN_ID)

  switch (item.lockType) {
    case ILockType.Linear:
      if (!linearData?.startAt) return <Typography>--</Typography>
      return (
        <Typography fontSize={15} color={'var(--ps-text-100)'}>
          {dayjs.unix(linearData.startAt).utc().format('YYYY-MM-DD HH:mm:ss')}
        </Typography>
      )

    case ILockType.Normal:
      if (Array.isArray(noLiearData) && noLiearData.length > 0) {
        return (
          <Typography fontSize={15} color={'var(--ps-text-100)'}>
            {noLiearData[0].releaseTime
              ? dayjs.unix(noLiearData[0].releaseTime).utc().format('YYYY-MM-DD HH:mm:ss')
              : '--'}
          </Typography>
        )
      }
      return (
        <Typography fontSize={15} color={'var(--ps-text-100)'}>
          --
        </Typography>
      )

    case ILockType.Stage:
      if (Array.isArray(noLiearData) && noLiearData.length > 0) {
        return (
          <Typography fontSize={15} color={'var(--ps-text-100)'}>
            {noLiearData[0].releaseTime
              ? dayjs.unix(noLiearData[0].releaseTime).utc().format('YYYY-MM-DD HH:mm:ss')
              : '--'}
          </Typography>
        )
      }
      return (
        <Typography fontSize={15} color={'var(--ps-text-100)'}>
          --
        </Typography>
      )

    default:
      return (
        <Typography fontSize={15} color={'var(--ps-text-100)'}>
          --
        </Typography>
      )
  }
}
const Container = styled(Stack)`
  padding: 0 24px;
  ${props => props.theme.breakpoints.down('md')} {
    padding: 0;
  }
`
const CusPagination = styled(Pagination)`
  .Mui-selected {
    background-color: var(--ps-text-primary) !important;
  }
`
const Line = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: var(--ps-text-10);
  margin: 24px 0;
`
export default MyLock
