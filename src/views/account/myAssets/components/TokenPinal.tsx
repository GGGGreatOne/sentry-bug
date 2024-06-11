import { Box, Tab, Tabs, styled } from '@mui/material'
import { TokensTabStatus } from 'views/account/myAssets/type'

import { useCallback, useRef, useState } from 'react'
import TokenPinalAll from './TokenPinalAll'

interface TabPanelProps {
  index: number
  value: number
  isNomal: boolean
}

export const ActivityHistoryTabStatusValue = {
  [TokensTabStatus.AllToken]: 'All Token'
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

function TokenPinal({ value, index, isNomal, ...other }: TabPanelProps) {
  const [tabValue, setTabValue] = useState(TokensTabStatus.AllToken)
  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }, [])
  const a11yProps = useCallback((index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }, [])
  const tabList = useRef([TokensTabStatus.AllToken])

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <CustomTabs value={tabValue} onChange={handleChange}>
        {tabList.current.map((_, index) => (
          <CustomTab key={_ + index} label={ActivityHistoryTabStatusValue[_]} value={_} {...a11yProps(_)} />
        ))}
      </CustomTabs>
      <TokenPinalAll isNomal={isNomal} value={tabValue} index={TokensTabStatus.AllToken} />
    </Box>
  )
}

export default TokenPinal
