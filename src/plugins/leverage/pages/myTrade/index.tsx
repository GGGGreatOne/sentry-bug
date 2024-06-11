import { TabContext } from '@mui/lab'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Tab, styled } from '@mui/material'
import TabList from '@mui/lab/TabList'
import { useEffect, useMemo, useState } from 'react'
import Positions from './positions'
import Order from './orders'
import Trades from './trades'
import { useActiveWeb3React } from 'hooks'
import { QuantosDetails } from '../../hook/useFactory'
import BigNumber from 'bignumber.js'
import { useLeverageStateData } from '../../state/hooks'
import { useGetUserOpenLimitOrders } from '../../hook/useGetUserOpenLimitOrders'
import { useGetUserOpenTrade } from '../../hook/useGetUserOpenTrade'
const TabsList = ['Positions', 'Orders', 'Trades']
const TabStyle = styled(TabList)`
  padding: 12px 16px 0px 16px;
  & .MuiTabs-fixed {
    border-bottom: 1px solid var(--ps-text-10);
  }
  & .MuiTabs-flexContainer {
    gap: 40px;
  }
  & .MuiTab-root {
    width: fit-content !important;
    height: fit-content !important;
    min-width: fit-content;
    min-height: fit-content;
    text-transform: none;
    padding: 8px 0;

    color: var(--ps-text-40);

    /* D/H5 */
    font-family: 'SF Pro Display';
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 15px */
  }
  & .MuiTab-root.Mui-selected {
    color: var(--ps-text-100);
  }
  & .MuiTabs-indicator {
    height: 1px;
    position: absolute;
    bottom: 0;
    background-color: var(--ps-text-100);
  }
`
export const DelPanel = ({ children }: { children: React.ReactNode }) => {
  const { account } = useActiveWeb3React()
  const result = useMemo(() => {
    if (!account) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)'
          }}
        >
          <Button
            variant="contained"
            sx={{ height: 44, padding: '12px 24px', borderRadius: 100, background: 'var(--ps-text-100)' }}
          >
            Sign in
          </Button>
        </Box>
      )
    }
    return children
  }, [account, children])
  return result
}
const Page = ({
  tradeQuantos,
  tradePrice,
  boxContractAdr,
  boxId,
  setPositionCount
}: {
  tradeQuantos: undefined | QuantosDetails
  tradePrice: BigNumber
  boxContractAdr: string
  boxId: string | number
  setPositionCount: (v: number) => void
}) => {
  const [tab, setTab] = useState(TabsList[0])
  const [marketOrderCount, setMarketOrderCount] = useState(0)
  const [limitOrderCount, setLimitOrderCount] = useState(0)
  const { data: leverage } = useLeverageStateData()
  const tradePairIndex = leverage?.tradePairIndex || 0
  const { userLimitOrders } = useGetUserOpenLimitOrders(
    tradeQuantos?.storageT ?? '',
    tradePairIndex,
    tradeQuantos?.tokenInfo?.decimals ?? 18
  )
  const { userOpenTrades } = useGetUserOpenTrade(
    tradePairIndex,
    tradeQuantos?.storageT ?? '',
    tradeQuantos?.tokenInfo?.decimals ?? 18
  )
  useEffect(() => {
    if (userLimitOrders) setLimitOrderCount(userLimitOrders.length)
  }, [userLimitOrders, setLimitOrderCount])
  useEffect(() => {
    if (userOpenTrades) setMarketOrderCount(userOpenTrades.length)
  }, [userOpenTrades, setMarketOrderCount])

  useEffect(() => {
    if (userOpenTrades && userLimitOrders) setPositionCount(userOpenTrades.length + userLimitOrders.length)
  }, [userOpenTrades, userLimitOrders, setPositionCount])

  return (
    <Box sx={{ background: 'var(--ps-neutral2)' }}>
      <TabContext value={tab}>
        <Box>
          <TabStyle
            aria-label="secondary tabs example"
            onChange={(e, value) => {
              console.log('value', value)
              setTab(value)
            }}
          >
            <Tab
              label={marketOrderCount > 0 ? TabsList[0] + `(${marketOrderCount})` : TabsList[0]}
              value={TabsList[0]}
            />
            <Tab label={limitOrderCount > 0 ? TabsList[1] + `(${limitOrderCount})` : TabsList[1]} value={TabsList[1]} />
            <Tab label={TabsList[2]} value={TabsList[2]} />
          </TabStyle>
        </Box>
        <Box sx={{ height: 318, overflow: 'scroll', position: 'relative' }} px={16}>
          <TabPanel value={TabsList[0]}>
            <Box mt={24}>
              <Positions
                tradeQuantos={tradeQuantos}
                tradePrice={tradePrice}
                boxContractAdr={boxContractAdr}
                userOpenTrades={userOpenTrades}
              />
            </Box>
          </TabPanel>
          <TabPanel value={TabsList[1]}>
            <Box mt={24}>
              <Order
                tradeQuantos={tradeQuantos}
                tradePrice={tradePrice}
                boxContractAdr={boxContractAdr}
                userLimitOrders={userLimitOrders}
              />
            </Box>
          </TabPanel>
          <TabPanel value={TabsList[2]}>
            <Box mt={16}>
              <Trades boxId={boxId} tradeQuantos={tradeQuantos} />
            </Box>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  )
}

export default Page
