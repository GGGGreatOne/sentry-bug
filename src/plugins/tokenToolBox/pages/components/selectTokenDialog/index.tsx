import { useMemo, useState } from 'react'
import Input from 'components/Input'
import { Box, Chip, CircularProgress, Stack, Typography, styled } from '@mui/material'
import SearchSvg from 'assets/svg/search.svg'
import { Currency } from 'constants/token'
import useDebounce from 'hooks/useDebounce'
import YellowWarnLargeSvg from 'assets/svg/yellow-warn-large.svg'
import { useCurrencyBalances, useToken } from 'hooks/useToken'
import { useActiveWeb3React } from 'hooks'
// import { isAddress } from 'utils'
import BaseDialog from 'components/Dialog/baseDialog'
// import { useUserInfo } from 'state/user/hooks'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import { ITokenListItem, TokenType } from 'api/common/type'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { useGetTokenImage } from 'hooks/boxes/useGetTokenImage'
import { isAddress } from 'utils'
import { usePairContract } from 'components/Widget/hooks/useContract'
import { useSingleCallResult } from 'hooks/multicall'
import { ZERO_ADDRESS } from 'constants/index'
import { useGetTokenListState } from 'plugins/tokenToolBox/hook/useTokenList'
import CurrencyLogo from 'components/essential/CurrencyLogo'
// import { viewControl } from 'views/editBox/modal'

interface Props {
  CurrencyToken0?: Currency
  CurrencyToken1?: Currency
  curSelectToken?: Currency
  tokens?: Currency[]
  handleTokenSelection?: (c: { tokenItem: ITokenListItem; tokenCurrency: Currency }) => void
  showCreate?: boolean
}
export const InputStyle = styled(Input)`
  &.MuiInputBase-root {
    height: 44px;
    border-radius: 6px;
    background: var(--ps-text-10);
    padding-left: 44px;
    padding-right: 24px;
  }

  & .MuiInputBase-input::placeholder {
    color: var(--ps-neutral3, red);
    /* D/body3 */
    font-family: 'SF Pro Display';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 18.2px */
  }
`
const ChipStyle = styled(Chip)`
  width: fit-content;
  height: 32px;
  padding: 4px 12px 4px 4px;
  border-radius: 16px;
  border: 1px solid var(--ps-text-10);
  background: var(--ps-neutral2);
  cursor: pointer;
  & .MuiChip-label {
    padding: 0px 0px 0px 8px;
    color: var(--ps-text-100);
    font-family: 'IBM Plex Sans';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
  }
  & .MuiChip-avatar {
    margin: 0px;
  }
`
const hotTokens: { tokenItem: ITokenListItem; tokenCurrency: Currency }[] = [
  // new Currency(SupportedChainId.SEPOLIA, '0x5c58eC0b4A18aFB85f9D6B02FE3e6454f988436E', 6, 'USDT', 'USDT', BTCBImg.src),
  // new Currency(SupportedChainId.SEPOLIA, '0x5C9acf1bc9965ECD20DEa1e377BA093c56aEFdfA', 18, 'DOGE', 'DOGE', BTCBImg.src)
]

const TokenItem = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  borderRadius: 6,
  cursor: 'pointer',
  padding: '10px 24px 10px 12px',
  '&:hover': {
    background: 'var(--ps-text-10)'
  },
  '&.active': {
    opacity: 0.4
  }
})

const Image = styled('img')(() => ({
  borderRadius: '50%'
}))

const useSearchToken = (tokenCurrency: Currency | null | undefined) => {
  const { data } = useGetTokenImage(tokenCurrency?.address || '')
  const pairContract = usePairContract(tokenCurrency?.address)
  const token0Address = useSingleCallResult(NETWORK_CHAIN_ID, pairContract, 'token0')?.result?.[0]
  if (!tokenCurrency) return undefined

  return {
    tokenItem: {
      id: '',
      boxId: '',
      creator: '',
      tokenName: '',
      tokenSymbol: tokenCurrency?.symbol || '',
      contractAddress: tokenCurrency?.address || '',
      decimals: tokenCurrency?.decimals,
      smallImg: tokenCurrency.logo as string | null,
      supply: '',
      hash: '',
      txTs: '',
      blockHeight: '',
      verified: '' as any,
      tokenType: token0Address ? TokenType.V2LP : TokenType.TOKEN,
      token0Contract: '',
      token1Contract: '',
      coinId: '',
      bigImg: '' as string | null,
      pluginId: 0,
      delFlag: 0
    },
    tokenCurrency: new Currency(
      NETWORK_CHAIN_ID,
      tokenCurrency?.address || '',
      tokenCurrency?.decimals || 18,
      tokenCurrency?.symbol,
      tokenCurrency?.name,
      data?.smallImg || tokenCurrency?.logo
    )
  }
}

const TokenList = ({
  tokens,
  handleTokenSelection,
  curSelectToken,
  CurrencyToken0,
  CurrencyToken1
}: {
  tokens:
    | {
        tokenItem: ITokenListItem
        tokenCurrency: Currency
      }[]
    | undefined
  handleTokenSelection: (c: { tokenItem: ITokenListItem; tokenCurrency: Currency }) => void
  curSelectToken?: Currency
  CurrencyToken0?: Currency
  CurrencyToken1?: Currency
}) => {
  const tokenCurrencys = tokens?.map(v => v.tokenCurrency)
  const { account } = useActiveWeb3React()
  const balances = useCurrencyBalances(account, tokenCurrencys || [])
  const isCheck = (e: string) => {
    if (CurrencyToken0?.address.toLocaleLowerCase() === e.toLocaleLowerCase()) {
      return true
    }
    if (CurrencyToken1?.address.toLocaleLowerCase() === e.toLocaleLowerCase()) {
      return true
    }
    if (curSelectToken?.address.toLocaleLowerCase() === e.toLocaleLowerCase()) {
      return true
    }
    return false
  }

  return (
    <>
      {tokens?.map((i, idx) => {
        return (
          <TokenItem
            onClick={() => {
              !isCheck(i.tokenCurrency.address) && handleTokenSelection(i)
            }}
            key={i.tokenCurrency.address}
            className={isCheck(i.tokenCurrency.address) ? 'active' : ''}
          >
            <Box>
              {i.tokenItem?.tokenType === TokenType.TOKEN ? (
                <CurrencyLogo size="26px" currencyOrAddress={i.tokenCurrency} />
              ) : (
                <DoubleCurrencyLogo
                  size={26}
                  currency0={i.tokenItem?.token0Contract}
                  currency1={i.tokenItem?.token1Contract}
                />
              )}
            </Box>

            <Box mx={8} sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  color: 'var(--ps-text-100)',
                  fontFamily: 'IBM Plex Sans',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '16px'
                }}
              >
                {i.tokenCurrency.symbol?.replace(/UNI/g, '--')}
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-grey-03)',
                  fontFamily: 'IBM Plex Sans',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '16px',
                  marginTop: 2
                }}
              >
                {i.tokenCurrency.name?.replace(/Uniswap/g, '--')}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: 'var(--ps-text-100)',
                fontFamily: 'IBM Plex Sans',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '24px'
              }}
            >
              {balances?.[idx]?.toSignificant()}
            </Typography>
          </TokenItem>
        )
      })}
    </>
  )
}
const SelectTokenDialog = ({
  curSelectToken,
  // showCreate,
  handleTokenSelection,
  CurrencyToken0,
  CurrencyToken1
}: Props) => {
  const [searchVal, setSearchVal] = useState(curSelectToken?.symbol || '')
  const debounceVal = useDebounce(searchVal, 300)
  const isSearching = useMemo(() => {
    const isTyping = searchVal !== debounceVal
    // TODO: add query status
    return isTyping
  }, [debounceVal, searchVal])
  const searchToken = useToken(isAddress(debounceVal) ? debounceVal : '')
  // const userInfo = useUserInfo()
  const { chainId } = useActiveWeb3React()
  const searchTokenFormate = useSearchToken(searchToken)

  const { pluginTokenList } = useGetTokenListState()

  const tokenFilters = useMemo(() => {
    const ret = pluginTokenList
      .filter(v => v.tokenType !== TokenType.V3LP)
      .filter(v => v.contractAddress !== ZERO_ADDRESS)
      .map(v => {
        return {
          tokenItem: v || undefined,
          tokenCurrency: new Currency(
            chainId || SupportedChainId.BIT_DEVNET,
            v.contractAddress || '',
            v.decimals || 18,
            v.tokenSymbol || '',
            v.tokenName,
            v.smallImg || ''
          )
        }
      })
    return ret
  }, [pluginTokenList, chainId])

  const searchFilter = useMemo(() => {
    if (!searchVal) return tokenFilters
    const ret = tokenFilters?.filter(v => {
      return (
        v.tokenCurrency.address.toLowerCase() === debounceVal.toLowerCase() ||
        v.tokenCurrency.name?.toLowerCase().includes(debounceVal.toLowerCase()) ||
        v.tokenCurrency.symbol?.toLowerCase().includes(debounceVal.toLowerCase())
      )
    })
    if (ret?.length === 0) {
      if (isAddress(debounceVal) && searchToken && searchTokenFormate) return [searchTokenFormate]
    }
    return ret
  }, [debounceVal, searchToken, searchTokenFormate, searchVal, tokenFilters])

  return (
    <BaseDialog
      title="Select a Token"
      onClose={() => {
        setSearchVal('')
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20 }}>
          <CusSearchSvg />
        </Box>
        <InputStyle
          placeholder="Search by name or token address"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
      </Box>
      <Stack mt={24} sx={{ flexDirection: 'row', gap: 12, overflow: 'hidden', flexWrap: 'wrap', width: '600px' }}>
        {hotTokens.map(t => (
          <ChipStyle
            onClick={() => {
              handleTokenSelection?.(t)
            }}
            key={t.tokenCurrency.address}
            label={t.tokenCurrency.name}
            avatar={
              <Image
                src={t.tokenCurrency.logo || ''}
                width={24}
                height={24}
                alt={`${t.tokenCurrency.name || 'token'} logo`}
              />
            }
            variant="outlined"
          />
        ))}
      </Stack>
      <Box my={24} sx={{ height: '1px', background: 'var(--ps-text-10)' }}></Box>
      <Box sx={{ width: '100%', height: 324, overflowY: 'auto' }}>
        {!isSearching && (
          <TokenList
            tokens={searchFilter}
            curSelectToken={curSelectToken}
            handleTokenSelection={v => handleTokenSelection?.(v)}
            CurrencyToken0={CurrencyToken0}
            CurrencyToken1={CurrencyToken1}
          />
        )}
        {isSearching && (
          <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: 'var(--ps-neutral3)' }} />
          </Stack>
        )}
        {!searchTokenFormate && !tokenFilters?.length && (
          <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: '312px', height: 'fit-content', display: 'grid', justifyItems: 'center' }}>
              <YellowWarnLargeSvg />
              <Typography
                sx={{
                  color: 'var(--ps-Dark-white)',
                  fontFamily: '"SF Pro Display"',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%',
                  marginTop: 24
                }}
              >
                Sorry we couldn’t find any related result. Please search again.
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>
      <Box my={32} sx={{ height: '1px', background: 'var(--ps-text-10)' }}></Box>
      {/* {showCreate !== false && (
        <Typography
          sx={{
            '&,&>a': {
              color: 'var(--ps-neutral3)',
              textAlign: 'center',
              fontFamily: '"SF Pro Display"',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%'
            },
            '&>a': {
              color: 'var(--ps-text-100)',
              textDecorationLine: 'underline'
            }
          }}
        >
          {` Can't`} find the target asset you want to trade? <br /> Come{' '}
          <a
            href="javascript:;"
            onClick={() => {
              viewControl.show('TokenMinter')
              setTimeout(() => {
                viewControl.hide('SelectTokenDialog')
              }, 300)
              return
            }}
          >
            create
          </a>{' '}
          one!
        </Typography>
      )} */}
    </BaseDialog>
  )
}
const CusSearchSvg = styled(SearchSvg)`
  g {
    stroke: #bcbcbc;
  }
`
export default SelectTokenDialog
