import { Box, Stack, Typography, Button, styled } from '@mui/material'
// import UpdateSvg from '../../assets/update.svg'
import Table from 'components/Table'
import { Dispatch, SetStateAction, useMemo } from 'react'
import Image from 'components/Image'
import { useActiveWeb3React } from 'hooks'
import { ITokenListItem } from 'api/common/type'
import { useCurrencyBalance, useCurrencyBalances, useToken, useTokens } from 'hooks/useToken'
import { useViewStakedAmount } from 'plugins/farm/hook/useStakeCallback'
import { useGetTokenPrice } from 'hooks/boxes/useGetTokenPrice'
import BigNumber from 'bignumber.js'
import { formatBigNumber } from 'utils'
import { STAKING_CONSTANTS } from 'plugins/farm/constants'
import { SupportedChainId } from 'constants/chains'
import { useSingleContractMultipleData } from 'hooks/multicall'
import { useStakeContract } from 'plugins/farm/hook/useContract'
import { CurrencyAmount } from 'constants/token'

const StyleTable = styled(Box)(({ theme }) => ({
  '.MuiTableCell-root': {
    background: 'transparent !important',
    padding: '0 !important'
  },
  thead: {
    tr: {
      '.MuiTableCell-root': {
        color: 'var(--ps-text-60)'
      }
    }
  },
  tbody: {
    tr: {
      height: 86,
      ':hover': {
        background: 'transparent'
      },
      '.MuiTableCell-root': {
        width: '155px',
        border: 'none !important',
        borderTop: '1px solid var(--ps-text-10) !important',
        borderRadius: '0 !important'
      },
      '.MuiTableCell-root:last-child': {
        width: '115px'
      }
    },
    'tr:first-of-type td': {
      border: 'none !important'
    }
  },
  [theme.breakpoints.down('md')]: {
    maxHeight: 700,
    overflowY: 'auto',
    display: 'grid',
    gap: 16,
    '::-webkit-scrollbar ': {
      display: 'none'
    }
  }
}))

function TotalStaked({ item, chainId }: { item: ITokenListItem; chainId: SupportedChainId | undefined }) {
  const _currency = useToken(item.contractAddress || '')
  const address = STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET]
  const priceList = useGetTokenPrice([item.contractAddress || ''])
  const _balance = useCurrencyBalance(address, _currency || undefined)
  const balanceUsd = useMemo(() => {
    if (_balance && priceList[0]) {
      return new BigNumber(priceList[0]).times(_balance.toExact())
    }
    return undefined
  }, [_balance, priceList])

  return (
    <Box textAlign={{ xs: 'right', md: 'unset' }}>
      <Typography fontSize={'15px !important'} lineHeight={1.4} color={{ xs: 'var(--ps-text-100)' }}>
        {_balance?.toSignificant() || '--'}
      </Typography>
      <Typography
        fontSize={'12px !important'}
        lineHeight={1.4}
        color={{ xs: 'var(--ps-text-100)', md: 'var(--ps-neutral3)' }}
      >
        ${balanceUsd ? formatBigNumber(balanceUsd, 2) : '--'}
      </Typography>
    </Box>
  )
}

function UserStaked({ item }: { item: ITokenListItem }) {
  const _currency = useToken(item.contractAddress || '')
  const price = useGetTokenPrice([item.contractAddress || ''])
  const _balance = useViewStakedAmount(_currency || undefined)
  const balanceUsd = useMemo(() => {
    if (_balance && price[0]) {
      return new BigNumber(price[0]).times(_balance)
    }
    return undefined
  }, [_balance, price])
  return (
    <Box textAlign={{ xs: 'right', md: 'unset' }}>
      <Typography fontSize={'15px !important'} lineHeight={1.4} color={{ xs: 'var(--ps-text-100)' }}>
        {_balance ? formatBigNumber(new BigNumber(_balance)) : '--'}
      </Typography>
      <Typography
        fontSize={'12px !important'}
        lineHeight={1.4}
        color={{ xs: 'var(--ps-text-100)', md: 'var(--ps-neutral3)' }}
      >
        ${balanceUsd ? formatBigNumber(balanceUsd, 2) : '--'}
      </Typography>
    </Box>
  )
}

const StakeList = ({
  data,
  setTokenAddress,
  setLogo,
  handleStakeCallback
}: {
  data: ITokenListItem[] | undefined
  setTokenAddress: Dispatch<SetStateAction<string | undefined>>
  setLogo: Dispatch<SetStateAction<string | undefined>>
  handleStakeCallback?: () => void
}) => {
  const { chainId, account } = useActiveWeb3React()
  const addr = STAKING_CONSTANTS[chainId || SupportedChainId.TESTNET]
  const contract = useStakeContract(addr)
  const addressList = data?.map(i => i.contractAddress) as any
  const tokens = useTokens(addressList || [])
  const totalStakedAmount = useCurrencyBalances(addr, tokens)
  const priceList = useGetTokenPrice(addressList)
  const totalTVL = useMemo(() => {
    if (totalStakedAmount && priceList) {
      const ret = totalStakedAmount.map(
        (i: CurrencyAmount | undefined, index: number) =>
          i && new BigNumber(i.toExact()).times(new BigNumber(priceList[index] || 0))
      )
      const tvl = ret?.reduce((acc, cur: any) => cur && cur.plus(acc), 0)
      return tvl ? new BigNumber(tvl) : 0
    }
    return undefined
  }, [priceList, totalStakedAmount])
  const paramsList = useMemo(() => {
    if (tokens && addressList && account) {
      return addressList.map((_: any, index: number) => [account, tokens[index]?.address])
    }
    return []
  }, [account, addressList, tokens])
  const TVLRes = useSingleContractMultipleData(chainId, contract, 'stakedOf', [...paramsList], undefined)
  const userTVL = useMemo(() => {
    if (TVLRes && tokens && priceList) {
      const ret = TVLRes.map((i, index: number) =>
        new BigNumber(i?.result?.[0].toString()).div(`1e${tokens[index]?.decimals}`)
      )
      const res = ret?.map((i, index: number) => i.times(new BigNumber(priceList[index] || 0)))
      const tvl = res.reduce((acc: BigNumber, cur: BigNumber) => cur && cur.plus(acc), new BigNumber(0))
      return !new BigNumber(tvl).isNaN() ? new BigNumber(tvl) : 0
    }
    return undefined
  }, [TVLRes, priceList, tokens])

  const TableList = useMemo(() => {
    return data?.map((v, index) => [
      <Box
        key={index + v.tokenName}
        sx={{ display: 'flex', gap: 8, alignItems: 'center' }}
        textAlign={{ xs: 'right', md: 'unset' }}
      >
        <Image src={v.smallImg || ''} alt="tokenLogo" width={24} height={24} style={{ borderRadius: '50%' }} />
        <Typography fontSize={'20px'} lineHeight={1.3} fontWeight={500} color={{ xs: 'var(--ps-text-100)' }}>
          {v.tokenSymbol?.toLocaleUpperCase()}
        </Typography>
      </Box>,
      <TotalStaked key={v.tokenName + index} item={v} chainId={chainId} />,
      <UserStaked key={v.tokenName + index} item={v} />,
      <Button
        key={index + v.tokenName}
        variant="outlined"
        onClick={() => {
          if (handleStakeCallback) {
            handleStakeCallback()
          }
          setTokenAddress(v.contractAddress || '')
          setLogo(v.smallImg || '')
        }}
        sx={{
          maxWidth: 115,
          width: '100%',
          color: 'var(--ps-text-100)'
        }}
      >
        Stake
      </Button>
    ])
  }, [chainId, data, handleStakeCallback, setLogo, setTokenAddress])

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 12,
        backgroundColor: 'var(--ps-neutral)',
        padding: { xs: '24px 16px', md: '40px 40px 24px' },
        maxWidth: 720,
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}
    >
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.3
          }}
        >
          Total TVL {totalTVL ? formatBigNumber(totalTVL, 2) : '--'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'center'
          }}
        >
          <Typography fontSize={15} fontWeight={500} color={'var(--ps-light-green)'}>
            Your TVL
          </Typography>
          <Typography fontSize={15} fontWeight={500} color={'var(--ps-text-100)'}>
            {userTVL ? formatBigNumber(userTVL, 2) : '--'}
          </Typography>
        </Box>
      </Stack>
      <StyleTable>
        <Table variant="outlined" header={['Token', 'Total Staked', 'Your Staked', '']} rows={TableList || []} />
      </StyleTable>
    </Box>
  )
}
export default StakeList
