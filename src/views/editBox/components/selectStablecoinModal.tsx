import { CircularProgress, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { Dispatch, Key, SetStateAction, useMemo, useState } from 'react'
import SearchSvg from 'assets/svg/search.svg'
// import { StableListResult } from 'api/boxes/type'
import USDTIcon from 'assets/svg/boxes/usdt.svg'
import { InputStyle } from 'components/Dialog/selectTokenDialog'
import { useToken } from 'hooks/useToken'
import { viewControl } from '../modal'
import Image from 'components/Image'
import useDebounce from 'hooks/useDebounce'
import { useGetStableList } from 'hooks/boxes/useGetStableList'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'

interface Props {
  setSelectedStablecoin: Dispatch<SetStateAction<any>>
  boxId: string | number
}
const SelectTokenModal = ({ setSelectedStablecoin }: Props) => {
  const [searchVal, setSearchVal] = useState('')
  const debounceVal = useDebounce(searchVal, 500)
  const { data, loading } = useGetStableList()

  const stableList = useMemo(() => {
    if (debounceVal.trim()) {
      return data?.list.filter(v => v.token0Name?.toLowerCase().includes(debounceVal.trim().toLowerCase()))
    }
    return data?.list
  }, [data?.list, debounceVal])

  return (
    <BaseDialog title="Select a Stablecoin">
      <Stack sx={{ position: 'relative' }}>
        <Stack
          sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20 }}
        >
          <SearchSvg />
        </Stack>
        <InputStyle placeholder="Search by token name" value={searchVal} onChange={e => setSearchVal(e.target.value)} />
      </Stack>
      <Stack
        my={20}
        sx={{
          width: '100%',
          border: '0.5px solid #FFFFFF33'
        }}
      />
      <Stack spacing={16}>
        {stableList?.length === 0 && (
          <Stack
            sx={{
              width: '100%',
              textAlign: 'center',
              minHeight: 140
            }}
          >
            <Typography fontSize={16} sx={{ margin: 'auto !important' }}>
              No Content
            </Typography>
          </Stack>
        )}
        {loading && (
          <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: 'var(--ps-neutral3)' }} />
          </Stack>
        )}
        <Stack sx={{ width: '100%', height: 224, overflowY: 'auto' }}>
          {stableList &&
            stableList?.map((item, index: Key | null | undefined) => (
              <TokenItem
                list={stableList}
                item={item}
                key={index}
                address={item.token0Contract}
                setSelectedStablecoin={setSelectedStablecoin}
              />
            ))}
        </Stack>
      </Stack>
    </BaseDialog>
  )
}

function TokenItem({
  list,
  item,
  address,
  setSelectedStablecoin
}: {
  list: any[]
  item: any
  address: string
  setSelectedStablecoin: SetStateAction<any>
}) {
  const stablecoin = useToken(address)

  const newItem = useMemo(() => {
    return { ...item, token0Name: stablecoin?.name, token0Symbol: stablecoin?.symbol, logo: USDTIcon }
  }, [item, stablecoin?.name, stablecoin?.symbol])

  const Row = ({ style }: { style: any }) => (
    <div style={style}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        onClick={() => {
          setSelectedStablecoin(newItem)
          viewControl.hide('SelectTokenModal')
        }}
        sx={{
          padding: '12px 6px',
          cursor: 'pointer',
          borderRadius: '4px',
          ':hover': {
            background: 'var(--ps-neutral3)'
          }
        }}
      >
        <Stack direction={'row'} alignItems={'center'} spacing={6}>
          <Image
            src={item.smallImg || item.bigImg}
            alt="token logo"
            width={24}
            height={24}
            style={{ borderRadius: '50%' }}
          />
          <Typography></Typography>
        </Stack>
        <Typography>{stablecoin?.symbol?.toLocaleUpperCase()}</Typography>
      </Stack>
    </div>
  )

  return (
    <AutoSizer>
      {({ width }) => (
        <List className="List" height={220} itemCount={list.length} itemSize={55} width={width}>
          {Row}
        </List>
      )}
    </AutoSizer>
  )
}

export default SelectTokenModal
