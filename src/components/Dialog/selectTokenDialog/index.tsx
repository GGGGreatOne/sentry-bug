import { useMemo, useState } from 'react'
import BaseDialog from '../baseDialog'
import Input from 'components/Input'
import { Box, Chip, CircularProgress, Stack, Typography, styled } from '@mui/material'
import SearchSvg from 'assets/svg/search.svg'
import { Currency } from 'constants/token'
import useDebounce from 'hooks/useDebounce'
import YellowWarnLargeSvg from 'assets/svg/yellow-warn-large.svg'
import { useCurrencyBalances, useToken } from 'hooks/useToken'
import { useActiveWeb3React } from 'hooks'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { isAddress } from 'utils'
import { globalDialogControl } from '..'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { viewControl } from 'views/editBox/modal'
import { useUserInfo } from 'state/user/hooks'
import { useGetBoxDraftInfo } from 'state/boxes/hooks'

interface Props {
  CurrencyToken0?: Currency
  CurrencyToken1?: Currency
  curSelectToken?: Currency
  tokens?: Currency[]
  handleTokenSelection?: (c: Currency) => void
  showCreate?: boolean
  handleSearch?: (v: string) => void
  shieldTokens?: Array<Currency | undefined | string> // Ignore, blocked token
  hotTokenList?: Currency[]
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
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
  }
  & .MuiChip-avatar {
    margin: 0px;
  }
`
const _hotTokens: Currency[] = [
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
  width: '100%',
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
export const TokenList = ({
  tokens,
  handleTokenSelection,
  curSelectToken,
  CurrencyToken0,
  CurrencyToken1,
  shieldTokens,
  onClose
}: {
  tokens: Currency[]
  handleTokenSelection: (c: Currency) => void
  curSelectToken?: Currency
  CurrencyToken0?: Currency
  CurrencyToken1?: Currency
  shieldTokens?: Array<Currency | undefined | string>
  onClose?: () => void
}) => {
  const { account } = useActiveWeb3React()
  const balances = useCurrencyBalances(account, tokens || [])
  const isCheck = (e: string, c: Currency) => {
    if (CurrencyToken0?.address.toLocaleLowerCase() === e.toLocaleLowerCase()) {
      return true
    }
    if (CurrencyToken1?.address.toLocaleLowerCase() === e.toLocaleLowerCase()) {
      return true
    }
    if (curSelectToken?.address.toLocaleLowerCase() === e.toLocaleLowerCase()) {
      return true
    }
    if (shieldTokens) {
      return shieldTokens.some(v => {
        if (typeof v === 'string') {
          // is address
          if (isAddress(v)) {
            return v.toLowerCase() === e.toLowerCase()
          }
          // is symbol
          return v.toLowerCase() === c.symbol?.toLowerCase()
        }
        // is Currency
        return v?.address.toLowerCase() === e.toLowerCase()
      })
    }
    return false
  }
  const renderTokenLogo = (token: Currency) => {
    if (token.logo) {
      return <Image src={token.logo} width={24} height={24} alt={`${token.symbol} logo`} />
    }
    return <CurrencyLogo currencyOrAddress={token.address} size="24px" />
  }

  const Row = ({ index, style }: { index: any; style: any }) => (
    <div style={style}>
      <TokenItem
        onClick={() => {
          if (!isCheck(tokens[index].address, tokens[index])) {
            handleTokenSelection(tokens[index])
            onClose?.()
          }
        }}
        className={isCheck(tokens[index].address, tokens[index]) ? 'active' : ''}
      >
        <>{renderTokenLogo(tokens[index])}</>
        <Box mx={8} sx={{ textAlign: 'left' }}>
          <Typography
            sx={{
              color: 'var(--ps-text-100)',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '16px'
            }}
            noWrap
            maxWidth={'220px'}
          >
            {tokens[index].symbol}
          </Typography>
          <Typography
            sx={{
              color: 'var(--ps-grey-03)',
              fontFamily: 'Inter',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '16px',
              marginTop: 2
            }}
            noWrap
            maxWidth={'220px'}
          >
            {tokens[index].name}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '24px'
          }}
        >
          {balances?.[index]?.toSignificant()}
        </Typography>
      </TokenItem>
    </div>
  )

  return (
    <AutoSizer>
      {({ width }) => (
        <List className="List" height={320} itemCount={tokens.length} itemSize={55} width={width}>
          {Row}
        </List>
      )}
    </AutoSizer>
  )
}
const SelectTokenDialog = ({
  tokens,
  curSelectToken,
  showCreate,
  handleTokenSelection,
  CurrencyToken0,
  CurrencyToken1,
  shieldTokens,
  hotTokenList
}: Props) => {
  const [searchVal, setSearchVal] = useState(curSelectToken?.symbol || '')
  const debounceVal = useDebounce(searchVal, 300)
  const isSearching = useMemo(() => {
    const isTyping = searchVal !== debounceVal
    // TODO: add query status
    return isTyping
  }, [debounceVal, searchVal])
  const searchToken = useToken(isAddress(debounceVal) ? debounceVal : '')

  const tokenListBase = useMemo(() => {
    return !!hotTokenList?.length ? hotTokenList : _hotTokens
  }, [hotTokenList])
  const { currencyTokens } = useGetPluginTokenListData()
  tokens = useMemo(() => tokens ?? currencyTokens, [tokens, currencyTokens])
  const filterTokens = useMemo(() => {
    if (!searchVal) return tokens
    const ret = tokens?.filter(
      v =>
        v.address.toLowerCase() === debounceVal.toLowerCase() ||
        v.name?.toLowerCase().includes(debounceVal.toLowerCase()) ||
        v.symbol?.toLowerCase().includes(debounceVal.toLowerCase())
    )
    if (ret?.length === 0) {
      if (isAddress(debounceVal) && searchToken) return [searchToken]
      return []
    }
    return ret
  }, [debounceVal, searchToken, searchVal, tokens])

  const userInfo = useUserInfo()
  const { data: draftInfo } = useGetBoxDraftInfo(userInfo.box?.boxId || undefined)
  const onClose = () => {
    setSearchVal('')
    globalDialogControl.hide('SelectTokenDialog')
  }

  return (
    <BaseDialog title="Select a Token" onClose={onClose}>
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
      <Stack mt={24} sx={{ flexDirection: 'row', gap: 12, overflow: 'hidden', flexWrap: 'wrap' }}>
        {tokenListBase.map(t => (
          <ChipStyle
            onClick={() => {
              handleTokenSelection?.(t)
              onClose?.()
            }}
            key={t.address}
            label={t.symbol}
            avatar={<CurrencyLogo currencyOrAddress={t} />}
            variant="outlined"
          />
        ))}
      </Stack>
      <Box my={24} sx={{ height: '1px', background: 'var(--ps-text-10)' }}></Box>
      <Box sx={{ width: '100%', height: 324, overflowY: 'auto' }}>
        {!isSearching && filterTokens && (
          <TokenList
            tokens={filterTokens}
            curSelectToken={curSelectToken}
            handleTokenSelection={v => handleTokenSelection?.(v)}
            CurrencyToken0={CurrencyToken0}
            CurrencyToken1={CurrencyToken1}
            shieldTokens={shieldTokens}
            onClose={onClose}
          />
        )}
        {isSearching && (
          <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: 'var(--ps-neutral3)' }} />
          </Stack>
        )}
        {!filterTokens?.length && (
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
      {showCreate !== false && (
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
            href="javascript:void(0)"
            onClick={() => {
              userInfo.box?.boxAddress &&
                viewControl.show('TokenMinter', {
                  draftInfo: draftInfo,
                  boxAddress: userInfo.box?.boxAddress
                })
            }}
          >
            create
          </a>{' '}
          one!
        </Typography>
      )}
    </BaseDialog>
  )
}
const CusSearchSvg = styled(SearchSvg)`
  g {
    stroke: #bcbcbc;
  }
`

export default SelectTokenDialog
