import { Box, Grid, Stack, styled, Typography } from '@mui/material'
import Wallet from 'assets/svg/account/wallet.svg'
// import TipSvg from 'assets/svg/account/tip.svg'
import Table from 'components/Table'
import { useMemo, useState } from 'react'
// import Image from 'components/Image'
import useTotalAssets, { IAssetsItem } from 'hooks/useTotalAssets'
import BigNumber from 'bignumber.js'
import useBreakpoint from 'hooks/useBreakpoint'
import { useGetPairToken } from 'plugins/tokenToolBox/pages/components/SelectToken'
import { useToken } from 'hooks/useToken'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { formatStringLength } from 'utils'
import EmptyData from 'components/EmptyData'
// import { usePairContract } from 'components/Widget/hooks/useContract'

interface TabPanelProps {
  index: number
  value: number
  isNomal: boolean
}
const PinalContainer = styled(Box)`
  overflow-y: auto;
  height: 800px;
`
const IconBox = styled(Box)`
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: var(--ps-text-10);
`
const TopBox = styled(Box)`
  display: flex;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  margin-top: 40px;
`
// const CursorBox = styled(Box)`
//   cursor: pointer;
// `
const Cell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`

const StyleTable = styled(Box)(({ theme }) => ({
  marginTop: '24px',
  width: '100%',

  thead: {
    tr: {
      '.MuiTableCell-root': {
        color: 'var(--ps-text-40)',
        backgroundColor: 'transparent'
      },
      '.MuiTableCell-root:last-child': {
        textAlign: 'end'
      }
    }
  },
  tbody: {
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
      width: '25%',
      borderBottom: '1px solid var(--ps-text-10)'
    },
    '.MuiTableCell-root:first-of-type': {
      borderBottom: '1px solid var(--ps-text-10)'
    },
    '.MuiTableCell-root:last-of-type': {
      borderBottom: '1px solid var(--ps-text-10)'
    }
  },
  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: 16
  }
}))

const ShowToken = ({ item }: { item: IAssetsItem }) => {
  const { token0Address, token1Address } = useGetPairToken(item.token?.address || '')
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  if (token0Address) {
    return (
      <Stack flexDirection={'row'} gap={4} alignItems={'center'}>
        <DoubleCurrencyLogo size={32} currency0={token0Address || undefined} currency1={token1Address || undefined} />
        <Typography color="var(--ps-text-100)" fontSize={15} fontWeight={500} lineHeight={'100%'}>
          {formatStringLength(token0?.symbol)} / {formatStringLength(token1?.symbol)}
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack flexDirection={'row'} gap={12} alignItems={'center'}>
      <CurrencyLogo currencyOrAddress={item.token?.address} size="32px" />
      {/* <Image src={item.token?.logo || ''} alt="" width={32} height={32} style={{ borderRadius: '50%' }} /> */}
      <Typography color="var(--ps-text-100)" fontSize={15} fontWeight={500} lineHeight={'100%'}>
        {formatStringLength(item.token?.symbol)}
      </Typography>
    </Stack>
  )
}

const staticTitle = ['Name', 'Price', 'Balance', 'Value']
const staticMdTitle = ['Price', 'Balance', 'Value']
const TokenPairsList = ({ pairsList }: { pairsList: IAssetsItem[] }) => {
  const [headData] = useState(staticTitle)

  const List = useMemo(() => {
    return pairsList.map(v => {
      return [
        <Cell key={v.token?.address}>
          <ShowToken item={v} />
          {/* <Image src={v.token?.logo || ''} alt="" width={32} height={32} style={{ borderRadius: '50%' }} />
          <Typography color="var(--ps-text-100)" fontSize={15} fontWeight={500} lineHeight={'100%'}>
            {v.token?.symbol}
          </Typography> */}
        </Cell>,
        <Cell key={v.price}>
          <Typography color="var(--ps-text-100)" fontSize={15} fontWeight={500} lineHeight={'100%'}>
            $ {BigNumber(v.price).toString()}
          </Typography>
        </Cell>,
        <Cell key={v.balance.toString()}>
          <Typography color="var(--ps-text-100)" fontSize={15} fontWeight={500} lineHeight={'100%'}>
            {v.balance.toString()}
          </Typography>
        </Cell>,
        <Cell
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          key={v.value.toString()}
        >
          <Typography color="var(--ps-text-100)" fontSize={15} fontWeight={500} lineHeight={'100%'}>
            ${v.value.toFixed(2, BigNumber.ROUND_HALF_UP)}
          </Typography>
        </Cell>
      ]
    })
  }, [pairsList])

  return <StyleTable>{List && <Table variant="outlined" header={headData} rows={List} />}</StyleTable>
}

const MdTokenPairsList = ({ pairsList }: { pairsList: IAssetsItem[] }) => {
  const [headData] = useState(staticMdTitle)
  return (
    <Stack gap={20} mt={20}>
      {pairsList.map((v, index) => (
        <Stack key={index} gap={16}>
          <ShowToken item={v} />
          <Grid container>
            {headData.map((item, index) => (
              <Grid key={item} item xs={4}>
                <Typography
                  textAlign={index === 1 ? 'center' : index === 2 ? 'end' : 'start'}
                  color="var(--ps-text-40)"
                  fontSize={12}
                  fontWeight={500}
                  lineHeight={'140%'}
                >
                  {item}
                </Typography>
              </Grid>
            ))}
            {headData.map((item, index) => (
              <Grid key={item} item xs={4}>
                {index === 0 && (
                  <Typography color="var(--ps-text-100)" fontSize={12} fontWeight={400} lineHeight={'130%'}>
                    $ {BigNumber(v.price).toString()}
                  </Typography>
                )}
                {index === 1 && (
                  <Typography
                    textAlign="center"
                    color="var(--ps-text-100)"
                    fontSize={12}
                    fontWeight={400}
                    lineHeight={'130%'}
                  >
                    {v.balance.toString()}
                  </Typography>
                )}
                {index === 2 && (
                  <Typography
                    textAlign="end"
                    color="var(--ps-text-100)"
                    fontSize={12}
                    fontWeight={400}
                    lineHeight={'130%'}
                  >
                    {v.value.toString()}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  )
}

const TokenPinalAll = ({ value, index, ...other }: TabPanelProps) => {
  const { list, totalAssets } = useTotalAssets()
  const isMd = useBreakpoint('md')

  return (
    <PinalContainer
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <TopBox>
        <IconBox>
          <Wallet />
        </IconBox>
        <Typography fontSize={20} color="var(--ps-text-100)" lineHeight={'130%'}>
          Wallet
        </Typography>
        {/* <CursorBox>
          <TipSvg />
        </CursorBox> */}
        <Typography fontSize={15} color="var(--ps-text-100)" lineHeight={'130%'}>
          ${totalAssets?.toFixed(2, BigNumber.ROUND_HALF_UP) || 0}
        </Typography>
      </TopBox>
      {!list?.length ? (
        <EmptyData height={isMd ? 300 : 400} color={'var(--ps-text-40)'} />
      ) : isMd ? (
        <MdTokenPairsList pairsList={list}></MdTokenPairsList>
      ) : (
        <TokenPairsList pairsList={list}></TokenPairsList>
      )}
    </PinalContainer>
  )
}
export default TokenPinalAll
