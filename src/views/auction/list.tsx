import { Box, Button, CircularProgress, MenuItem, Pagination, Select, Stack } from '@mui/material'
import { useGetAuctionList } from 'hooks/boxes/useGetAuctionList'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { IBoxValue } from 'state/boxes/type'

import LaunchpadItem from './components/list/launchpadItem'
import LaunchpadItemMobile from './components/list/launchpadItemMobile'
import { IBoxAuctionPoolListDataItem, IClubAuctionPoolParams } from 'plugins/auction/api/type'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { AuctionCategory } from 'plugins/auction/pages/erc20-create-pool/type'
import useBreakpoint from 'hooks/useBreakpoint'
import ArrowDownIcon from 'assets/svg/auction/arrow-down.svg'
import { toast } from 'react-toastify'
import EmptyData from 'components/EmptyData'
export default function Page({
  boxData,
  editing,
  listing
}: {
  boxData: IBoxValue
  editing: boolean
  listing: boolean
}) {
  const [type, setType] = useState('all')
  const [paginationParams, setPaginationParams] = useState<IClubAuctionPoolParams>({
    boxId: boxData.boxBasicInfo.boxId.toString(),
    pageNum: 1,
    pageSize: 3,
    isAsc: 'desc',
    orderByColumn: 'createTime'
  })
  const handleChange = useCallback(
    (e: { target: { value: SetStateAction<string> } }) => {
      setType(e.target.value)
      if (e.target.value === 'all') {
        const _paginationParams = { ...paginationParams }
        delete _paginationParams.category
        setPaginationParams(_paginationParams)
        return
      }
      if (Number(e.target.value) === AuctionCategory['Fixed Price Auction']) {
        setPaginationParams({ ...paginationParams, category: AuctionCategory['Fixed Price Auction'] })
        return
      }
      if (Number(e.target.value) === AuctionCategory['Staking Auction']) {
        setPaginationParams({ ...paginationParams, category: AuctionCategory['Staking Auction'] })
        return
      }
    },
    [paginationParams]
  )

  const { data, pagination, loading } = useGetAuctionList(paginationParams, editing)
  const paginationHandle = useCallback(
    (e: any, _: number) => {
      pagination.changeCurrent(_)
      setPaginationParams({ ...paginationParams, pageNum: _ })
    },
    [pagination, paginationParams]
  )
  const router = useRouter()
  const isSm = useBreakpoint('sm')

  const publishHandle = useCallback(() => {
    const isNeedPublish = data?.list?.some(item => !item.publishId)
    if (typeof isNeedPublish === 'boolean' && isNeedPublish && editing) {
      toast.warning('You need to submit your changes to update your club information!', {
        className: 'foo-bar'
      })
      return
    }
  }, [data?.list, editing])
  useEffect(() => {
    publishHandle()
  }, [publishHandle])
  return (
    <Stack
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Stack
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          width: '100%',
          borderRadius: '12px',
          padding: { xs: '20px 10px', md: '32px 40px' },
          position: 'relative'
        }}
      >
        <Stack
          sx={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 10, md: 0 }
          }}
        >
          <Select
            value={type}
            onChange={handleChange}
            IconComponent={ArrowDownIcon}
            sx={{
              '& .MuiSelect-select': {
                borderRadius: '6px !important',
                border: '1px solid #1C1C19 !important',
                background: ' #FFFFE5 !important',
                color: '#1C1C19',
                fontFamily: 'IBM Plex Sans',
                fontSize: 13,
                fontStyle: 'normal',
                fontWeight: 500,
                width: { xs: '100%', md: 192 },
                height: 46,
                padding: '0px 16px',
                lineHeight: '44px'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
            MenuProps={{
              sx: {
                top: 5,
                '& .MuiList-root': {
                  background: '#fff',
                  color: '#1B1B1B',
                  borderRadius: 10,
                  ' & .MuiMenuItem-root': {
                    color: '#1B1B1B',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: 13,
                    fontStyle: 'normal',
                    fontWeight: 400,
                    '&:hover,&.Mui-selected': {
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="all">All Auction Types</MenuItem>
            <MenuItem value={AuctionCategory['Fixed Price Auction']}>Fixed Auction</MenuItem>
            <MenuItem value={AuctionCategory['Staking Auction']}>Staking Auction</MenuItem>
          </Select>
          {editing && (
            <Button
              sx={{
                padding: '16px 8px',
                width: { xs: '100%', md: 178 },
                height: 46,
                fontFamily: 'IBM Plex Sans',
                backgroundColor: '#FFFFE5',
                borderRadius: 100,
                fontSize: { xs: 12, md: 15 },
                '&:hover': {
                  backgroundColor: '#FFFFE5'
                }
              }}
              variant="contained"
              onClick={() => router.push(ROUTES.auction.createPool)}
              disabled={listing}
            >
              + Create a launchpad
            </Button>
          )}
        </Stack>

        {!!data?.list?.length && (
          <Stack mt={24} spacing={20} sx={{ width: '100%' }}>
            {data?.list?.map(item => (
              <>
                {isSm ? (
                  <LaunchpadItemMobile
                    // listing={listing}
                    key={item.id}
                    itemData={item as IBoxAuctionPoolListDataItem}
                    editing={editing}
                  />
                ) : (
                  <LaunchpadItem
                    listing={listing}
                    key={item.id}
                    itemData={item as IBoxAuctionPoolListDataItem}
                    editing={editing}
                  />
                )}
              </>
            ))}
          </Stack>
        )}
        {!data?.list?.length && (
          <EmptyData
            color="var(--ps-text-60)"
            sx={{
              margin: '140px auto !important'
            }}
          />
        )}
        {data !== undefined && data.total > 0 && (
          <Pagination
            sx={{
              margin: '16px auto 0 !important',
              '& .MuiPaginationItem-page.Mui-selected': {
                borderRadius: 6,
                color: '#fff',
                background: 'transparent',
                textDecoration: 'underline'
              }
            }}
            count={pagination.totalPage}
            page={paginationParams.pageNum}
            onChange={paginationHandle}
            boundaryCount={1}
            defaultPage={1}
          />
        )}
        {loading && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,.5)',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <Stack justifyContent={'center'} alignItems={'center'} sx={{ width: '100%', height: '100%' }}>
              <CircularProgress sx={{ color: 'rgba(0,0,0,.5)' }} size={30} />
            </Stack>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}
