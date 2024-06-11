import Title from 'views/account/components/Title'
import AccountLayout from 'views/account/components/AccountLayout'
import { Box, styled, Tabs, Tab } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MainTabStatus } from 'views/account/myAssets/type'
import TokenPinal from 'views/account/myAssets/components/TokenPinal'
// import TransactionsPinal from 'views/account/myAssets/components/TransactionsPinal'
import { useUserInfo } from 'state/user/hooks'
import { IBoxUserStatus } from 'api/user/type'
import { useRouter } from 'next/router'
import { useActiveWeb3React } from 'hooks'
import Head from 'next/head'

export const MainTabStatusValue = {
  [MainTabStatus.Tokens]: 'Tokens',
  [MainTabStatus.Transactions]: 'Transactions'
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
`

const CustomTabs = styled(Tabs)`
  min-height: 34px;
  transform: translateX(-14px);
  & .MuiTabs-indicator {
    background-color: var(--ps-text-100);
  }
  ${props => props.theme.breakpoints.down('md')} {
    font-size: 16px;
    margin: 0 4px;
  }
`
const PinalContainer = styled(Box)`
  margin-top: 60px;
`

const TabData = [MainTabStatus.Tokens]
const Page = () => {
  const userInfo = useUserInfo()

  const isNomal = useMemo(() => {
    const boxStatus = userInfo.user?.boxStatus
    if (Number(boxStatus) == IBoxUserStatus.CREATED) {
      return false
    }
    return true
  }, [userInfo])
  console.log('isNomal', isNomal)

  const [tabValue, setTabValue] = useState(() => MainTabStatus.Tokens)
  console.log('tabValue', tabValue)

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
        <title>BounceClub - Assets</title>
      </Head>
      <Box>
        <Title value="My Assets">
          <CustomTabs value={tabValue} onChange={handleChange}>
            {TabData.map((_, index) => (
              <CustomTab key={_ + index} label={MainTabStatusValue[_]} value={_} {...a11yProps(_)} />
            ))}
          </CustomTabs>
        </Title>
        <PinalContainer>
          <TokenPinal isNomal={isNomal} value={tabValue} index={MainTabStatus.Tokens} />
          {/* <TransactionsPinal isNomal={isNomal} value={tabValue} index={MainTabStatus.Transactions} /> */}
        </PinalContainer>
      </Box>
    </AccountLayout>
  )
}
export default Page
