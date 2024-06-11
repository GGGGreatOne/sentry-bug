import Title from 'views/account/components/Title'
import AccountLayout from 'views/account/components/AccountLayout'
import { Box, styled, Tabs, Tab } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MainTabStatus } from 'views/account/profile/type'
import ActivityHistoryPinal from 'views/account/profile/components/ActivityHistoryPinal'
// import FollowingsPinal from 'views/account/profile/components/FollowingsPinal'
import FollowersPinal from 'views/account/profile/components/FollowersPinal'
import { useUserInfo } from 'state/user/hooks'
import { IBoxUserStatus } from 'api/user/type'
import { useRouter } from 'next/router'
import { useActiveWeb3React } from 'hooks'
import Head from 'next/head'

export const MainTabStatusValue = {
  [MainTabStatus.Followers]: 'Followers',
  // [MainTabStatus.Followings]: 'Followings',
  [MainTabStatus.ActivityHistory]: 'Activity History'
}

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

  ${props => props.theme.breakpoints.down('md')} {
    font-size: 16px;
    margin: 0 4px;
  }
`

const CustomTabs = styled(Tabs)`
  min-height: 34px;
  transform: translateX(-14px);
  & .MuiTabs-indicator {
    background-color: var(--ps-text-100);
  }
`
const PinalContainer = styled(Box)`
  margin-top: 60px;
`

const TabNomalData = [MainTabStatus.ActivityHistory]
const TabClubUserData = [MainTabStatus.Followers, MainTabStatus.ActivityHistory]
const Page = () => {
  const userInfo = useUserInfo()

  const isNomal = useMemo(() => {
    const boxStatus = userInfo.user?.boxStatus
    if (Number(boxStatus) == IBoxUserStatus.CREATED) {
      return false
    }
    return true
  }, [userInfo])

  const [tabValue, setTabValue] = useState(() => MainTabStatus.Followers)

  useEffect(() => {
    if (isNomal) {
      setTabValue(MainTabStatus.ActivityHistory)
    } else {
      setTabValue(MainTabStatus.Followers)
    }
  }, [isNomal])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  const a11yProps = useCallback((index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }, [])

  const { account } = useActiveWeb3React()
  const router = useRouter()
  const redirectHome = useCallback(() => {
    const goHome = () => {
      router.push('/')
    }
    if (!account || !userInfo.token) {
      goHome()
      return
    }
  }, [account, router, userInfo.token])

  useEffect(() => {
    redirectHome()
  }, [redirectHome])
  return (
    <AccountLayout>
      <Head>
        <title>BounceClub - Account</title>
      </Head>
      <Box>
        <Title value="Dashboard">
          <CustomTabs value={tabValue} onChange={handleChange}>
            {(isNomal ? TabNomalData : TabClubUserData).map((_, index) => (
              <CustomTab key={_ + index} label={MainTabStatusValue[_]} value={_} {...a11yProps(_)} />
            ))}
          </CustomTabs>
        </Title>
        <PinalContainer>
          {!isNomal && <FollowersPinal value={tabValue} index={MainTabStatus.Followers} />}
          {/* <FollowingsPinal isNomal={isNomal} value={tabValue} index={MainTabStatus.Followings} /> */}
          <ActivityHistoryPinal isNomal={isNomal} value={tabValue} index={MainTabStatus.ActivityHistory} />
        </PinalContainer>
      </Box>
    </AccountLayout>
  )
}
export default Page
