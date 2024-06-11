import { MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Box, Typography, styled } from '@mui/material'
import useModal from 'hooks/useModal'
import { Currency } from '@uniswap/sdk'
import { useActiveWeb3React } from 'hooks'
import Spinner from 'components/Spinner'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useCurrencyBalance } from 'components/Widget/hooks/wallet'
import { getName, getSymbol } from 'components/Widget/utils/getSymbol'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export function CurrencyListComponent({
  onSelect,
  options,
  fixedListRef,
  showETH
}: {
  onSelect?: (currency: Currency) => void
  options: Currency[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH?: boolean
}) {
  const { hideModal } = useModal()

  const key = useCallback((currency: Currency): string => {
    return currency ? currency.symbol || '' : ''
  }, [])

  const itemKey = useCallback((index: number, data: any) => key(data[index]), [key])

  const Rows = useCallback(
    ({ data, index, style }: any) => {
      const currency: Currency = data[index]
      const onClickCurrency = () => {
        onSelect && onSelect(currency)
        hideModal()
      }

      return <CurrencyRow currency={currency} onClick={onClickCurrency} style={style} />
    },
    [hideModal, onSelect]
  )

  const _itemData: (Currency | undefined)[] = useMemo(() => {
    const formatted: (Currency | undefined)[] = showETH ? options : options

    return formatted
  }, [options, showETH])

  const itemData = _itemData.filter(v => v?.symbol?.toUpperCase() !== 'BB' && v?.symbol?.toUpperCase() !== 'WBB')

  return (
    <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ height, width }) => (
        <FixedSizeList
          height={Number(height) || 100}
          width={width || '100%'}
          itemCount={itemData.length}
          itemSize={56}
          itemData={itemData}
          itemKey={itemKey}
          ref={fixedListRef as any}
        >
          {Rows}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}

const StyledBalanceText = styled(Typography)(`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`)

const ListItem = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  padding: '0 16px',
  height: '48px',
  justifyContent: 'space-between'
})

function CurrencyRow({ currency, onClick, style }: { currency: Currency; onClick: () => void; style?: any }) {
  const { account, chainId } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency)

  return (
    <ListItem onClick={onClick} style={style}>
      <Box display="flex">
        <CurrencyLogo currencyOrAddress={currency as any} size="30px" />
        <Box display="flex" flexDirection="column" marginLeft="16px">
          <Typography variant="inherit" display="flex" alignItems="center" component="div">
            {getSymbol(currency, chainId)}
          </Typography>
          <Typography variant="caption">{getName(currency, chainId)}</Typography>
        </Box>
      </Box>
      <span style={{ fontWeight: 500 }}>
        {balance ? (
          <StyledBalanceText title={balance.toExact()} sx={{}}>
            {balance.toSignificant(6)}
          </StyledBalanceText>
        ) : account ? (
          <Spinner />
        ) : null}
      </span>
    </ListItem>
  )
}
