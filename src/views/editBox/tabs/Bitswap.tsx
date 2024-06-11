import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import EditIcon from 'assets/svg/boxes/pen.svg'
import { useEditBoxPluginBitswapData } from 'state/boxes/hooks'
import { Currency } from 'constants/token'
import { IBoxPluginBasicItemData, IBoxValue, IBoxesJsonData } from 'state/boxes/type'
import DowArrowGreySvg from 'plugins/leverage/assets/dow-arrow-grey.svg'
import dynamic from 'next/dynamic'
import useBreakpoint from 'hooks/useBreakpoint'
import { globalDialogControl } from 'components/Dialog/modal'
import { shortenAddress } from 'utils'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import DefaultImage from 'assets/images/account/default_followings_item.png'
import { useActiveWeb3React } from 'hooks'
import { useToken, useTokens } from 'hooks/useToken'
import RankingSvg from 'assets/svg/boxes/share-top-right.svg'
import Table from 'components/Table'
import { SupportedChainId } from 'constants/chains'
import { ZERO_ADDRESS } from '../../../constants'
import { WrappedTokenInfo } from 'components/Widget/hooks/Tokens'
import { TokenInfo } from '@uniswap/token-lists'
import { useGetBoxTokenList } from 'hooks/boxes/useGetBoxTokenList'
import { TokenType } from 'api/boxes/type'
import { useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { publishBox } from 'api/boxes'
import CurrencyLogo from 'components/essential/CurrencyLogo'

const BitSwap = dynamic(() => import('../../../components/Widget2/SwapHome'), {
  loading: () => <p style={{ width: '100%', textAlign: 'center' }}>Loading...</p>,
  ssr: false
})
const StyleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '32px',
  borderRadius: '24px',
  gap: '64px',
  backgroundColor: '#0d0d0d',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    padding: '24px 16px',
    borderRadius: '16px'
  }
}))

const StyleTable = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '20px',
  borderRadius: '24px',
  backgroundColor: '#0d0d0d',
  '.MuiTableCell-root': {
    background: 'transparent !important',
    padding: '0',
    border: 'none !important'
  },
  thead: {
    tr: {
      '.MuiTableCell-root': {
        fontSize: 13,
        borderBottom: '1px solid #E6E6CE1A !important',
        paddingBottom: '20px',
        color: 'var(--ps-grey-03)'
      },
      '.MuiTableCell-root:nth-child(2)': {
        textAlign: 'center'
      },
      '.MuiTableCell-root:last-child': {
        textAlign: 'right'
      }
    }
  },
  tbody: {
    tr: {
      background: '#383833',
      fontSize: 14,
      height: 58
    },
    '.MuiTableCell-root': {
      color: '#fff',
      width: '50%'
    }
  },
  [theme.breakpoints.down('md')]: {
    display: 'grid',
    gap: 16,
    borderRadius: '16px',
    padding: '20px 8px',
    '& ._header': {
      color: 'var(--ps-neutral) !important'
    }
  }
}))

// const StyleCurrentLPCard = styled(Box)(() => ({
//   maxWidth: 360,
//   width: '100%',
//   height: 120,
//   backgroundColor: 'var(--ps-neutral5)',
//   borderRadius: '12px',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   gap: 16
// }))
const Image = styled('img')(() => ({}))

const StyleButton = styled(Button)(({ theme }) => ({
  height: 44,
  width: 'auto',
  [theme.breakpoints.down('md')]: {
    height: 36,
    padding: '4px 16px'
  }
}))

enum Tab {
  NullData,
  CreatePairs,
  Swap,
  PairsList
}

const Page = ({
  draftInfo,
  boxData,
  editing,
  supportedTokenData
}: {
  draftInfo: IBoxesJsonData | null | undefined
  boxData: IBoxValue
  editing: boolean
  supportedTokenData: IBoxPluginBasicItemData[]
}) => {
  const isMd = useBreakpoint('md')
  const [token0, setToken0] = useState<Currency | undefined>()
  const { swapDataList, updateBoxPluginSwapDataCallback: SubmitCreatePairs } = useEditBoxPluginBitswapData()
  const [tab, setTab] = useState<number>(Tab.Swap)
  const [first, setFirst] = useState<boolean>(true)
  const { run: runPublish } = useRequest(
    async () => {
      const { code, msg } = await publishBox(boxData?.boxBasicInfo.boxId)
      if (code === 200) {
        toast('Submit success')
      } else {
        toast.error(msg)
        throw msg
      }
    },
    { manual: true }
  )
  useEffect(() => {
    if (first) {
      if (swapDataList.length) {
        setTab(Tab.Swap)
      }
      setFirst(false)
    }
  }, [first, swapDataList.length])

  const changeTab = useCallback((tab: number) => {
    setToken0(undefined)
    setTab(tab)
  }, [])

  const bt = useMemo(() => {
    if (!editing) return null
    if (tab === Tab.PairsList) {
      return (
        <>
          <StyleButton
            variant="outlined"
            onClick={() => {
              if (swapDataList.length) {
                changeTab(Tab.Swap)
                return
              }
              changeTab(Tab.Swap)
            }}
          >
            Cancel
          </StyleButton>
          <StyleButton
            variant="outlined"
            onClick={() => {
              changeTab(Tab.CreatePairs)
            }}
          >
            Add A Token
          </StyleButton>
        </>
      )
    }
    if (tab === Tab.CreatePairs) {
      return (
        <>
          <StyleButton
            variant="outlined"
            onClick={() => {
              if (swapDataList.length) {
                changeTab(Tab.PairsList)
                return
              }
              changeTab(Tab.Swap)
            }}
          >
            Cancel
          </StyleButton>
          <StyleButton
            variant="contained"
            disabled={!token0 || draftInfo?.listingStatus}
            onClick={async () => {
              SubmitCreatePairs('add', {
                token0: token0?.address,
                token0Name: token0?.name
              }).finally(() => {
                runPublish()
              })
              setTab(Tab.PairsList)
            }}
          >
            Submit
          </StyleButton>
        </>
      )
    }
    if ((tab === Tab.Swap && editing) || (tab === Tab.NullData && editing)) {
      return (
        <>
          <EditIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setTab(Tab.PairsList)
            }}
          />
        </>
      )
    }
    return null
  }, [SubmitCreatePairs, changeTab, draftInfo?.listingStatus, editing, runPublish, swapDataList.length, tab, token0])

  const supportedTokenAddresses: string[] = useMemo(() => {
    const _list = new Map()
    for (const item of supportedTokenData) {
      _list.set(item.token0Contract, item.token0Contract)
      _list.set(item.token1Contract, item.token1Contract)
    }
    return [..._list.keys()].filter(_ => _)
  }, [supportedTokenData])

  const _supportedTokens = useTokens(supportedTokenAddresses)
  const supportedTokens = useMemo(
    () =>
      _supportedTokens?.filter(i => {
        if (!i?.chainId || !i?.address || !i.decimals || i?.address === ZERO_ADDRESS) {
          return false
        }
        return new WrappedTokenInfo({
          chainId: i?.chainId,
          address: i?.address,
          name: i?.name ?? 'Token',
          decimals: i?.decimals,
          symbol: i?.symbol ?? 'TOKEN'
        })
      }) as unknown as TokenInfo[],
    [_supportedTokens]
  )
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <Box
        sx={{
          width: '100%',
          borderRadius: 12,
          background: 'var(--ps-neutral2)',
          padding: { xs: '24px 16px', md: '32px 40px' },
          minHeight: '568px'
        }}
      >
        <Stack spacing={{ xs: 16, md: tab === Tab.NullData ? 24 : 40 }} height={'100%'}>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant={isMd ? 'h5' : 'h3'}>BITSWAP</Typography>
            <Box display={'flex'} gap={{ xs: 8, md: 16 }}>
              {bt}
            </Box>
          </Stack>
          {tab === Tab.NullData && (
            <Stack
              justifyContent={'center'}
              spacing={20}
              sx={{
                width: '100%',
                height: 550
              }}
            >
              <Button
                variant="contained"
                sx={{ width: '142px', margin: '0 auto !important' }}
                onClick={() => setTab(Tab.PairsList)}
              >
                Add A Token
              </Button>
              <Typography textAlign={'center'}>You should add a token first.</Typography>
            </Stack>
          )}
          {tab === Tab.CreatePairs && boxData.boxBasicInfo.boxId && (
            <CreateTokenPairs boxId={boxData.boxBasicInfo.boxId} token0={token0} setToken0={setToken0} />
          )}
          {tab === Tab.PairsList && <TokenPairsList pairsList={swapDataList} />}
          {tab === Tab.PairsList && swapDataList.length === 0 && (
            <Stack
              sx={{
                width: '100%',
                background: 'var(--ps-text-primary)',
                borderRadius: '24px',
                minHeight: 300,
                padding: 20
              }}
            >
              <Typography textAlign={'center'} width={'100%'} margin={'auto'}>
                No content
              </Typography>
            </Stack>
          )}
          {tab === Tab.Swap && boxData.boxBasicInfo.boxId && (
            <BitSwap boxId={boxData.boxBasicInfo.boxId.toString()} tokenList={{ tokens: supportedTokens }} />
          )}
        </Stack>
      </Box>
    </Box>
  )
}

const SelectToken = ({
  boxId,
  value,
  setValue,
  CurrencyToken0,
  handle
}: {
  boxId: string | number
  value: Currency | undefined
  setValue: Dispatch<SetStateAction<Currency | undefined>>
  CurrencyToken0?: Currency
  handle?: () => void
}) => {
  boxId
  const { chainId } = useActiveWeb3React()
  const { data: list } = useGetBoxTokenList({})
  const _tokenList = list?.data
    .filter(v => v.tokenType === TokenType.TOKEN)
    .map(v => ({
      ...v,
      symbol: v.tokenSymbol,
      name: v.tokenName,
      logo: v.smallImg,
      address: v.contractAddress
    }))
  const TokenList = _tokenList?.map(v => {
    return new Currency(
      chainId || SupportedChainId.BB_MAINNET,
      v.contractAddress || '',
      v.decimals || 18,
      v.tokenSymbol || '',
      v.tokenName,
      v.smallImg || ''
    )
  })

  const handleTokenSelection = useCallback(
    (e: Currency) => {
      if (CurrencyToken0?.address === e.address) {
        handle?.()
      } else {
        setValue(e)
      }
      globalDialogControl.hide('SelectTokenDialog')
    },
    [CurrencyToken0?.address, handle, setValue]
  )

  const openModal = useCallback(() => {
    globalDialogControl.show('SelectTokenDialog', {
      tokens: TokenList,
      CurrencyToken0,
      curSelectToken: value,
      handleTokenSelection,
      showCreate: false
    })
  }, [CurrencyToken0, TokenList, handleTokenSelection, value])

  return (
    <Box>
      <Box
        onClick={openModal}
        tabIndex={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: '8px 16px', md: '15px 24px' },
          border: '1px solid var(--ps-grey-04)',
          borderRadius: '12px',
          cursor: 'pointer',
          userSelect: 'none',
          background: '#383833',
          ':hover': {
            border: '1px solid var(--ps-neutral3)'
          },
          ':active': {
            opacity: 0.7,
            border: '1px solid var(--ps-neutral3)'
          },
          svg: {
            path: {
              stroke: 'var(--ps-neutral3)'
            }
          }
        }}
      >
        {!value ? (
          <Typography color={'var(--ps-grey-03)'} fontSize={{ xs: 15, md: 18 }} lineHeight={'37px'}>
            Select A Token*
          </Typography>
        ) : (
          <Box display={'flex'} gap={16} alignItems={'center'}>
            <Image
              src={value?.logo || DefaultImage.src}
              alt="tokenLogo"
              width={36}
              height={36}
              style={{ borderRadius: '50%' }}
            />
            <Stack spacing={8}>
              <Typography color={'var(--ps-grey-03)'} fontSize={13} lineHeight={'18px'}>
                Select Currency*
              </Typography>
              <Typography color={'#fff'} lineHeight={'11px'}>
                {value?.symbol || 'token'}
              </Typography>
            </Stack>
          </Box>
        )}
        <DowArrowGreySvg />
      </Box>
    </Box>
  )
}

const CreateTokenPairs = ({
  boxId,
  token0,
  setToken0
}: {
  boxId: string | number
  token0: Currency | undefined

  setToken0: Dispatch<SetStateAction<Currency | undefined>>
}) => {
  const isMd = useBreakpoint('md')
  const onSwap = useCallback(() => {
    setToken0(token0)
  }, [setToken0, token0])

  return (
    <StyleBox>
      <Stack spacing={24}>
        <Typography
          variant={isMd ? 'h5' : 'h3'}
          color={'#fff'}
          borderBottom={'1px solid var(--ps-grey-05)'}
          paddingBottom={'24px'}
        >
          Add A Token
        </Typography>
        <Stack spacing={24}>
          <Typography variant={isMd ? 'body1' : 'h5'} color={'#fff'}>
            Select Currency*
          </Typography>
          <SelectToken boxId={boxId} CurrencyToken0={token0} value={token0} setValue={setToken0} handle={onSwap} />
          {token0 && (
            <Stack spacing={16}>
              <Typography variant={isMd ? 'body1' : 'h4'} color={'#fff'}>
                Contract Address
              </Typography>
              <Typography
                sx={{
                  border: '1px solid var(--ps-neutral3)',
                  borderRadius: '4px',
                  height: 44,
                  color: '#fff',
                  paddingLeft: 16,
                  lineHeight: '44px'
                }}
              >
                {isMd ? (token0.address ? shortenAddress(token0.address) : '--') : token0.address || '--'}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </StyleBox>
  )
}
const TokenPairsLogo = ({ token0Address }: { token0Address: string | undefined }) => {
  const token0 = useToken(token0Address || '')

  return (
    <Box display={'flex'} alignItems={'center'} width={'100'}>
      <CurrencyLogo size={'26px'} currencyOrAddress={token0 || undefined} />
      <Typography color={'#fff'} fontSize={14} marginLeft={8}>
        {token0?.symbol?.toLocaleUpperCase() || 'TOKEN'}
      </Typography>
    </Box>
  )
}
const TokenPairsList = ({ pairsList }: { pairsList: IBoxPluginBasicItemData[] }) => {
  const { chainId } = useActiveWeb3React()

  const List = useMemo(() => {
    return pairsList.map(v => {
      return [
        <TokenPairsLogo token0Address={v.token0Contract} key={v.token0Name + '1'} />,
        <Typography
          key={v.token0Name + '4'}
          display={'flex'}
          alignItems={'center'}
          color="var(--ps-white)"
          gap={10}
          fontSize={14}
          sx={{
            cursor: 'pointer',
            justifyContent: 'end',
            paddingRight: 10
          }}
          onClick={() => {
            if (!chainId || !v.token0Contract) return
            window.open(getEtherscanLink(chainId, v.token0Contract, 'address'), '_blank')
          }}
        >
          {v.token0Contract ? (
            <>
              {shortenAddress(v.token0Contract)}
              {}
              <RankingSvg />
            </>
          ) : (
            '-'
          )}
        </Typography>
      ]
    })
  }, [chainId, pairsList])

  return (
    <>
      {pairsList.length === 0 ? null : (
        <StyleTable>
          <Table variant="outlined" header={['Token Name', 'Token Contract']} rows={List} />
        </StyleTable>
      )}
    </>
  )
}

export default Page
