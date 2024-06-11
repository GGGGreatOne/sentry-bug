import { Masonry } from '@mui/lab'
import { Box, styled, Tabs, Tab } from '@mui/material'
import { useInfiniteScroll } from 'ahooks'
import { GetFollowerlist, GetFriendslist } from 'api/user'
import { useCallback, useRef, useState } from 'react'
import FollowerCarItem from './FollowerCarItem'
import useBreakpoint from 'hooks/useBreakpoint'
import { FollowersTabStatus } from '../type'
import FriendsCarItem from './FriendsCarItem'
import EmptyData from 'components/EmptyData'
interface TabPanelProps {
  index: number
  value: number
}
export const FollowersTabStatusValue = {
  [FollowersTabStatus.AllFollowers]: 'All Followers',
  //   [FollowersTabStatus.TopTradingClubes]: 'Top Trading Clubs',
  //   [FollowersTabStatus.HotFarm]: 'Hot Farm',
  //   [FollowersTabStatus.Users]: 'Users',
  [FollowersTabStatus.Friends]: 'Friends'
}
const CustomTabs = styled(Tabs)`
  min-height: 34px;
  & .MuiTabs-indicator {
    background-color: var(--ps-text-100);
  }
`
const CustomTab = styled(Tab)`
  color: var(--ps-text-40);
  font-family: 'SF Pro Display';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  text-transform: none;
  padding: 0;
  margin: 0 16px;
  min-height: min-content;

  &.Mui-selected {
    color: var(--ps-text-100);
  }
`
export const ListContainer = styled(Box)`
  height: 600px;
  margin-top: 40px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0px;
  }

  ${props => props.theme.breakpoints.down('lg')} {
    padding-left: 10px;
  }

  ${props => props.theme.breakpoints.down('md')} {
    height: calc(100vh - 202px);
  }
`

function FollowersPinal({ value, index, ...other }: TabPanelProps) {
  const isMd = useBreakpoint('md')
  const isLg = useBreakpoint('lg')
  const [tabValue, setTabValue] = useState(FollowersTabStatus.AllFollowers)

  const a11yProps = useCallback((index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }, [])
  const tabList = useRef([
    FollowersTabStatus.AllFollowers,
    //   FollowersTabStatus.TopTradingClubes,
    //   FollowersTabStatus.HotFarm,
    //   FollowersTabStatus.Users,
    FollowersTabStatus.Friends
  ])
  const friendsListRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const { data: friendsData, mutate: friendsMutate } = useInfiniteScroll(
    async () => {
      const params = {
        pageNum: page,
        pageSize: pageSize
      }
      const res = await GetFriendslist(params)
      setPage(page + 1)
      return res.data
    },
    {
      reloadDeps: [tabValue],
      target: friendsListRef.current,
      isNoMore: data => {
        if (!data) return true
        if (data && (page - 1) * pageSize >= data?.total) return true
        return false
      }
    }
  )

  const { data, mutate } = useInfiniteScroll(
    async () => {
      const params = {
        pageNum: page,
        pageSize: pageSize
      }
      const res = await GetFollowerlist(params)
      setPage(page + 1)
      return res.data
    },
    {
      reloadDeps: [tabValue],
      target: listRef.current,
      isNoMore: data => {
        if (!data) return true
        if (data && (page - 1) * pageSize >= data?.total) return true
        return false
      }
    }
  )
  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setPage(1)
    setTabValue(newValue)
  }, [])
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <CustomTabs value={tabValue} onChange={handleChange}>
        {tabList.current.map(_ => (
          <CustomTab key={_} label={FollowersTabStatusValue[_]} value={_} {...a11yProps(_)} />
        ))}
      </CustomTabs>
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {!data?.list || data?.list.length === 0 ? (
          <EmptyData height={isMd ? 300 : 400} color={'var(--ps-text-40)'} />
        ) : (
          <ListContainer ref={listRef}>
            <Masonry columns={isLg ? 1 : 2} spacing={16}>
              <>
                {data?.list.map((_, index) => (
                  <FollowerCarItem key={_.id + index} item={_} index={index} mutate={mutate} />
                ))}
              </>
            </Masonry>
          </ListContainer>
        )}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {!friendsData?.list || friendsData?.list.length === 0 ? (
          <EmptyData height={isMd ? 300 : 400} color={'var(--ps-text-40)'} />
        ) : (
          <ListContainer ref={friendsListRef}>
            <Masonry columns={isLg ? 1 : 2} spacing={16}>
              <>
                {friendsData?.list.map((_, index) => (
                  <FriendsCarItem key={index} item={_} index={index} friendsMutate={friendsMutate} />
                ))}
              </>
            </Masonry>
          </ListContainer>
        )}
      </Box>
    </Box>
  )
}

export default FollowersPinal
