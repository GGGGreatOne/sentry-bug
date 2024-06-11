import { Box, FormControl, MenuItem, Select, Typography, styled } from '@mui/material'
// import { ActivityHistoryItemProps, ActivityHistoryTabStatus } from 'views/account/profile/type'
// import { useState, useCallback, useRef } from 'react'
// import DefaultIcon from 'assets/images/account/default_followings_item.png'
// import { IPluginNameType } from 'state/boxes/type'
import TransactionsCarItem from './TransactionsCarItem'
import { Masonry } from '@mui/lab'
import { useRef, useState } from 'react'
import { useInfiniteScroll } from 'ahooks'
import { GetActivitiesList } from 'api/user'
import { ActivitiesListFilter } from 'api/user/type'
// import InputLose from 'assets/svg/boxes/input_lose.svg'
// import ArrowBottom from 'assets/svg/boxes/arrow_bottom.svg'
import FilterIcon from 'assets/svg/boxes/filter_icon.svg'
import _ from 'lodash'
import EmptyData from 'components/EmptyData'

interface TabPanelProps {
  index: number
  value: number
  isNomal: boolean
}

enum CusActivitiesListFilter {
  NO_FILTER = '0'
}
// export const ActivityHistoryTabStatusValue = {
//   [ActivityHistoryTabStatus.AllActivities]: 'All Activities',
//   [ActivityHistoryTabStatus.HotFarm]: 'Hot Farm',
//   [ActivityHistoryTabStatus.HotAirdrops]: 'Hot Airdrops',
//   [ActivityHistoryTabStatus.Games]: 'Games'
// }
// const CustomTabs = styled(Tabs)`
//   min-height: 34px;
//   & .MuiTabs-indicator {
//     background-color: var(--ps-text-100);
//   }
// `
// const CustomTab = styled(Tab)`
//   color: var(--ps-text-40);
//   font-family: 'SF Pro Display';
//   font-size: 20px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: 130%;
//   text-transform: none;
//   padding: 0;
//   margin: 0 16px;
//   min-height: min-content;

//   &.Mui-selected {
//     color: var(--ps-text-100);
//   }
// `
const ListContainer = styled(Box)`
  height: 800px;
  margin-top: 40px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
`

const CusMenuItem = styled(MenuItem)`
  border-radius: 6px;
  height: 57px;
`

function TransactionsPinal({ value, index, isNomal, ...other }: TabPanelProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const page = useRef(1)
  const [pageSize] = useState(10)
  const filterValue = useRef<null | ActivitiesListFilter | CusActivitiesListFilter>(CusActivitiesListFilter.NO_FILTER)

  const { data, mutate, reload } = useInfiniteScroll(
    async () => {
      const params = {
        pageNum: page.current,
        pageSize: pageSize,
        filterValue: filterValue.current === CusActivitiesListFilter.NO_FILTER ? null : filterValue.current
      }
      const res = await GetActivitiesList(_.omitBy(params, _.isNull))
      page.current = page.current + 1
      return res.data
    },
    {
      target: listRef.current,
      isNoMore: data => {
        if (!data) return true
        if (data && (page.current - 1) * pageSize >= data?.total) return true
        return false
      }
    }
  )
  console.log('TransactionsPinal->>data', data)
  // const [tabValue, setTabValue] = useState(ActivityHistoryTabStatus.AllActivities)
  // const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue)
  // }, [])
  // const a11yProps = useCallback((index: number) => {
  //   return {
  //     id: `simple-tab-${index}`,
  //     'aria-controls': `simple-tabpanel-${index}`
  //   }
  // }, [])
  // const tabList = useRef([
  //   ActivityHistoryTabStatus.AllActivities,
  //   ActivityHistoryTabStatus.HotFarm,
  //   ActivityHistoryTabStatus.HotAirdrops,
  //   ActivityHistoryTabStatus.Games
  // ])
  console.log('data?.list.length', data?.list.length)

  const selectOptions = useRef([
    {
      value: CusActivitiesListFilter.NO_FILTER,
      label: 'Not Filter'
    },
    {
      value: ActivitiesListFilter.FAVORITE,
      label: 'Favorite'
    },
    {
      value: ActivitiesListFilter.PARTICIPATED,
      label: 'Participated'
    }
  ])

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <Select
          defaultValue={CusActivitiesListFilter.NO_FILTER}
          renderValue={value => {
            if (value === CusActivitiesListFilter.NO_FILTER) return 'Not Filter'
            if (value === ActivitiesListFilter.FAVORITE) return 'Favorite'
            if (value === ActivitiesListFilter.PARTICIPATED) return 'Participated'
            return ''
          }}
          value={filterValue.current}
          autoWidth
          label="Filter"
          onChange={(e: any) => {
            filterValue.current = e.target.value
            page.current = 1
            reload()
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '6px',
                backgroundColor: 'var(--ps-neutral)',
                backgroundImage: 'none',
                '& .MuiMenuItem-root': {
                  width: 204,
                  color: 'var(--ps-neutral3)'
                }
              }
            }
          }}
          startAdornment={
            <Box sx={{ width: '20px' }}>
              <FilterIcon></FilterIcon>
            </Box>
          }
          sx={{
            border: '1px solid var(--ps-neutral) !important',
            borderRadius: '16px',
            background: 'var(--ps-neutral)',

            '&:hover': {
              border: '1px solid var(--ps-text-100) !important'
            },

            '.MuiSelect-select': {
              color: 'var(--ps-neutral3)',
              fontSize: '13px',
              border: 'none',
              padding: '16px 105px 16px 16px !important',
              gap: 6
            },
            '.MuiSelect-icon': {
              width: '20px',
              right: '4px !important'
            },

            fieldset: {
              border: 'none'
            }
          }}
        >
          {selectOptions.current.map(item => {
            return (
              <CusMenuItem key={item.value} value={item.value}>
                <Typography fontSize={13}>{item.label}</Typography>
              </CusMenuItem>
            )
          })}
        </Select>
      </FormControl>

      {/* <CustomTabs value={tabValue} onChange={handleChange}>
        {tabList.current.map((_, index) => (
          <CustomTab key={_ + index} label={ActivityHistoryTabStatusValue[_]} value={_} {...a11yProps(_)} />
        ))}
      </CustomTabs> */}
      {!data?.list || data?.list.length === 0 ? (
        <EmptyData height={500} />
      ) : (
        <ListContainer ref={listRef}>
          <Masonry columns={3} spacing={16}>
            <>
              {data?.list.map((_, index) => (
                <TransactionsCarItem isNomal={isNomal} key={_.boxId + index} item={_} index={index} mutate={mutate} />
              ))}
            </>
          </Masonry>
        </ListContainer>
      )}
    </Box>
  )
}

export default TransactionsPinal
