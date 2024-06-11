import { Box } from '@mui/material'
import Masonry from '@mui/lab/Masonry'
// import { useState, useCallback, useRef, useMemo } from 'react'
// import { FollowingsTabStatusNomal, FollowingsTabStatusClubUser } from 'views/account/profile/type'
import FollowingsCarItem from './FollowingsCarItem'
// import Checkbox from 'components/Checkbox'
// import DefaultIcon from 'assets/images/account/default_followings_item.png'
import { useInfiniteScroll } from 'ahooks'
import { GetFollowingList } from 'api/user'
import { useRef, useState } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import { ListContainer } from 'views/account/profile/components/FollowersPinal'
import LoadingAnimation from 'components/Loading'
import EmptyData from 'components/EmptyData'
interface TabPanelProps {
  index: number
  value: number
  isNomal: boolean
}

// const TabBox = styled(Box)`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   flex-direction: row;
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

// const CustomTabs = styled(Tabs)`
//   min-height: 34px;
//   & .MuiTabs-indicator {
//     background-color: var(--ps-text-100);
//   }
// `

// const TabNomalData = [FollowingsTabStatusNomal.TopTradingClubes, FollowingsTabStatusNomal.HotFarm]
// const TabClubUserData = [
//   FollowingsTabStatusClubUser.AllFollowers,
//   FollowingsTabStatusClubUser.Friends,
//   FollowingsTabStatusClubUser.HotFarm,
//   FollowingsTabStatusClubUser.TopTradingClubes,
//   FollowingsTabStatusClubUser.Users
// ]

const FollowingsPinal = ({ value, index, isNomal, ...other }: TabPanelProps) => {
  const isLg = useBreakpoint('lg')
  const isMd = useBreakpoint('md')
  const listRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const { data, mutate, loading } = useInfiniteScroll(
    async () => {
      const params = {
        pageNum: page,
        pageSize: pageSize
      }
      const res = await GetFollowingList(params)
      setPage(page + 1)
      return res.data
    },
    {
      target: listRef.current,
      isNoMore: data => {
        if (!data) return true
        if (data && (page - 1) * pageSize >= data?.total) return true
        return false
      }
    }
  )

  // const FollowingsTabStatusClubUserValue = useMemo(() => {
  //   return {
  //     [FollowingsTabStatusClubUser.AllFollowers]: `All Followers `,
  //     [FollowingsTabStatusClubUser.TopTradingClubes]: `Top Trading Clubs`,
  //     [FollowingsTabStatusClubUser.HotFarm]: `Hot Farm`,
  //     [FollowingsTabStatusClubUser.Users]: `Users`,
  //     [FollowingsTabStatusClubUser.Friends]: `Friends`
  //   }
  // }, [])

  // const FollowingsTabStatusNomalValue = useMemo(() => {
  //   return {
  //     [FollowingsTabStatusNomal.TopTradingClubes]: `Top Trading Clubs`,
  //     [FollowingsTabStatusNomal.HotFarm]: `Hot Farm`
  //   }
  // }, [])

  // const [tabValue, setTabValue] = useState(
  //   isNomal ? FollowingsTabStatusNomal.TopTradingClubes : FollowingsTabStatusClubUser.AllFollowers
  // )
  // const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue)
  // }, [])
  // const a11yProps = useCallback((index: number) => {
  //   return {
  //     id: `simple-tab-${index}`,
  //     'aria-controls': `simple-tabpanel-${index}`
  //   }
  // }, [])

  // const tabList = useRef<FollowingsTabStatusNomal[] | FollowingsTabStatusClubUser[]>(
  //   isNomal ? TabNomalData : TabClubUserData
  // )
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {/* <TabBox>
        <CustomTabs value={tabValue} onChange={handleChange}>
          {tabList.current.map((_: FollowingsTabStatusNomal | FollowingsTabStatusClubUser, index) => (
            <CustomTab
              key={_ + index}
              label={
                isNomal
                  ? FollowingsTabStatusNomalValue[_ as FollowingsTabStatusNomal]
                  : FollowingsTabStatusClubUserValue[_ as FollowingsTabStatusClubUser]
              }
              value={_}
              {...a11yProps(_)}
            />
          ))}
        </CustomTabs>
        <FormGroup>
          <Checkbox checked={isVerified} label={'Verified Only'} onChange={checkBoxChange} />
        </FormGroup>
      </TabBox> */}
      {loading ? (
        <Box
          sx={{
            display: 'grid',
            placeContent: 'center',
            width: 220,
            height: 220,
            margin: '0 auto'
          }}
        >
          <LoadingAnimation />
        </Box>
      ) : (
        <>
          {!data?.list || data?.list.length === 0 ? (
            <EmptyData height={isMd ? 300 : 400} color={'var(--ps-text-40)'} />
          ) : (
            <ListContainer ref={listRef}>
              <Masonry columns={isLg ? 1 : 2} spacing={16}>
                <>
                  {data?.list.map((_, index) => (
                    <FollowingsCarItem isNomal={isNomal} key={_.id + index} item={_} index={index} mutate={mutate} />
                  ))}
                </>
              </Masonry>
            </ListContainer>
          )}
        </>
      )}
    </Box>
  )
}

export default FollowingsPinal
