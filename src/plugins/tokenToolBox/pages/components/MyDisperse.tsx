import BaseDialog from 'components/Dialog/baseDialog'
import { Box, Button, Pagination, Stack, styled, Typography } from '@mui/material'
import { NETWORK_CHAIN_ID, SupportedChainList } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { DISPERSE_CONTRACT_ADDRESSES, SupportedChainId } from 'plugins/tokenToolBox/constants'
import { useDisperseList } from 'plugins/tokenToolBox/hook/useDisperseCallback'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Disperse } from 'api/toolbox/type'
import { Currency, CurrencyAmount } from 'constants/token'
import { ZERO_ADDRESS } from 'constants/index'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import { viewControl } from 'views/editBox/modal'
import Table from 'plugins/tokenToolBox/pages/components/Table'
// import Image from 'components/Image'
import Image from 'components/Image'
import { useETHBalance, useToken } from 'hooks/useToken'
import SelectToken, { useGetPairToken } from './SelectToken'
import { SectionItem } from './ComonComponents'
import useBreakpoint from 'hooks/useBreakpoint'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import useRafInterval from 'ahooks/lib/useRafInterval'
import EmptyData from 'components/EmptyData'
interface Props {
  boxAddress: string
  rKey: number
}

const TokenItem = ({
  label,
  value,
  startNode,
  endNode,
  justifyContent = 'start'
}: {
  label?: string
  value: string
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

const TokenRow = ({ item, myChainBalance }: { item: Disperse; myChainBalance: CurrencyAmount | undefined }) => {
  const ChainSelectOption = useMemo(
    () =>
      SupportedChainList.filter(item => {
        return DISPERSE_CONTRACT_ADDRESSES[item.id as SupportedChainId] !== ''
      }),
    []
  )
  const getChainName = useCallback(
    (chain_id: number) => {
      return ChainSelectOption?.find(chainInfo => chainInfo?.['id'] === chain_id)
    },
    [ChainSelectOption]
  )

  return (
    <Stack gap={16}>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <TokenItem
          label="Token"
          value={''}
          startNode={<ShowToken item={item} myChainBalance={myChainBalance} />}
          endNode={!item.logoUri && <Box mr={16}></Box>}
        />
      </Stack>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <TokenItem
          label="Disperse Amount"
          value={
            item.token === ZERO_ADDRESS
              ? CurrencyAmount.ether(item.amount).toSignificant()
              : CurrencyAmount.fromRawAmount(
                  new Currency(NETWORK_CHAIN_ID, item.contract, item.decimals),
                  item.amount
                )?.toSignificant()
          }
        />
        <TokenItem label="Total Address" value={item.totalCount} justifyContent="end" />
      </Stack>
      <Button
        sx={{
          height: 26
        }}
        variant={'contained'}
        onClick={() => {
          window.open(
            getEtherscanLink(getChainName(NETWORK_CHAIN_ID)?.id || NETWORK_CHAIN_ID, item.hash, 'transaction'),
            '_blank'
          )
        }}
      >
        Detail
      </Button>
    </Stack>
  )
}
const MdTokenList = ({ list, myChainBalance }: { list: Disperse[]; myChainBalance: CurrencyAmount | undefined }) => {
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
            <TokenRow myChainBalance={myChainBalance} key={v.id} item={v} />
            <Line />
          </Box>
        )
      })}
    </Stack>
  )
}

function ShowTokenSymbol({ item }: { item: Disperse }) {
  const token = useToken(item.token)
  return (
    <Typography fontSize={15} color={'var(--ps-text-100)'}>
      {token?.symbol}
    </Typography>
  )
}

const ShowToken = ({ item, myChainBalance }: { item: Disperse; myChainBalance: CurrencyAmount | undefined }) => {
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
  if (item.name) {
    return (
      <Stack flexDirection={'row'} gap={12} alignItems={'center'}>
        {item.logoUri && (
          <Image
            style={{ borderRadius: '50%', overflow: 'hidden' }}
            src={item.logoUri}
            alt=""
            width={40}
            height={40}
          ></Image>
        )}
        <ShowTokenSymbol item={item} />
      </Stack>
    )
  }
  return (
    <Stack flexDirection={'row'} gap={12} alignItems={'center'}>
      {myChainBalance?.currency && (
        <Image src={myChainBalance?.currency.logo || ''} alt="" width={40} height={40}></Image>
      )}
      <Typography color="var(--ps-text-100)" fontSize={15}>
        {myChainBalance?.currency.name || '--'}
      </Typography>
    </Stack>
  )
}

const PairsList = ({ data, pagination }: { data: Disperse[]; pagination: any }) => {
  const isMd = useBreakpoint('md')
  const staticTitle = ['Token', 'Disperse Amount', 'Total Address', '']
  const [headData] = useState(staticTitle)
  const { account, chainId } = useActiveWeb3React()
  const myChainBalance = useETHBalance(account || undefined, chainId)
  const ChainSelectOption = useMemo(
    () =>
      SupportedChainList.filter(item => {
        return DISPERSE_CONTRACT_ADDRESSES[item.id as SupportedChainId] !== ''
      }),
    []
  )

  const getChainName = useCallback(
    (chain_id: number) => {
      return ChainSelectOption?.find(chainInfo => chainInfo?.['id'] === chain_id)
    },
    [ChainSelectOption]
  )

  const List = useMemo(() => {
    return data.map(v => {
      return [
        <Cell key={v.token}>
          <ShowToken item={v} myChainBalance={myChainBalance} />
        </Cell>,
        <Cell key={v.id}>
          {v.token === ZERO_ADDRESS
            ? CurrencyAmount.ether(v.amount).toSignificant()
            : CurrencyAmount.fromRawAmount(
                new Currency(NETWORK_CHAIN_ID, v.contract, v.decimals),
                v.amount
              )?.toSignificant()}
        </Cell>,
        <Cell key={v.contract}>{v.totalCount}</Cell>,
        <Cell key={v.hash}>
          <Stack
            direction={'row'}
            width={'100%'}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Button
              sx={{
                height: 26
              }}
              variant={'contained'}
              onClick={() => {
                window.open(
                  getEtherscanLink(
                    getChainName(NETWORK_CHAIN_ID)?.id || SupportedChainId.SEPOLIA,
                    v.hash,
                    'transaction'
                  ),
                  '_blank'
                )
              }}
            >
              Detail
            </Button>
          </Stack>
        </Cell>
      ]
    })
  }, [data, getChainName, myChainBalance])

  return (
    <>
      {isMd &&
        (pagination.total > 0 ? (
          <MdTokenList list={data} myChainBalance={myChainBalance} />
        ) : (
          <EmptyData height={200} color={'var(--ps-text-60)'} />
        ))}
      {!isMd && (
        <StyleTable>{<Table noDataHeight={300} variant="outlined" header={headData} rows={List} />}</StyleTable>
      )}
    </>
  )
}

const MyDisperse = ({ boxAddress, rKey }: Props) => {
  const isMd = useBreakpoint('md')
  const [checkToken, setCheckToken] = useState<Currency | undefined>()
  const { data, pagination, run } = useDisperseList(checkToken?.address || '')

  const paginationHandle = useCallback(
    (e: any, _: number) => {
      pagination.changeCurrent(_)
    },
    [pagination]
  )

  const clearInterval = useRafInterval(
    () => {
      run({ current: pagination.current, pageSize: pagination.pageSize })
    },
    10000,
    { immediate: true }
  )

  const disperseHandle = useCallback(() => {
    viewControl.hide('MyDisperse')
    clearInterval()
    viewControl.show('Disperse', {
      boxAddress: boxAddress,
      disperseType: 'token',
      urlChainParam: NETWORK_CHAIN_ID.toString(),
      rKey: Math.random()
    })
  }, [boxAddress, clearInterval])

  return (
    <BaseDialog
      key={rKey}
      mt={12}
      minWidth={900}
      title="Your Disperse"
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
      <Container gap={isMd ? 32 : 40}>
        <Stack flexDirection={'column'} justifyContent={'space-between'}>
          <Button
            sx={{ width: isMd ? '100%' : 'max-content', alignSelf: isMd ? 'start' : 'end' }}
            variant="contained"
            onClick={disperseHandle}
          >
            + Disperse
          </Button>
        </Stack>
        <SectionItem label="Search Disperse History">
          <SelectToken clearable={true} checkToken={checkToken} setCheckToken={setCheckToken} />
        </SectionItem>
        <Box height={isMd ? '100%' : 480}>
          <SectionItem label="Disperse Records">
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
  align-items: center;
  gap: 12px;
`
const Container = styled(Stack)`
  padding: 0 24px;

  ${props => props.theme.breakpoints.down('md')} {
    padding: 0;
  }
`
const CusPagination = styled(Pagination)`
  .MuiPaginationItem-text {
    color: var(--ps-neutral3);
  }
  .Mui-selected {
    color: var(--ps-text-100);
    background-color: var(--ps-text-primary) !important;
  }
`

const Line = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: var(--ps-text-10);
  margin: 24px 0;
`
export default MyDisperse
