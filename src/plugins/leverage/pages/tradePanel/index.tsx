import { Box, Stack, Typography } from '@mui/material'
import ChartTab from './chartTab'
import ConductTrade, { InfoPair } from './conductTrade'
import { useMemo, useState } from 'react'
// import ShareArrow from '../../assets/share-arrow.svg'
import MyTrade from '../myTrade'
import { QuantosDetails } from '../../hook/useFactory'
import BigNumber from 'bignumber.js'
import { TradingViewChart } from '../components/charts/TradingViewChart'
import { getBorrowFees } from '../../utils'
import { useRequest } from 'ahooks'
import { GetTokenPrice } from '../../../../api/boxes'
import useBreakpoint from '../../../../hooks/useBreakpoint'
const chartTabs = ['Basic', 'Pro', 'Degen']

export enum TRADE_MODE {
  DEGEN,
  PRO,
  BASIC
}

export interface CoingeckoApi {
  bitcoin: {
    usd: number
  }
}

const Page = ({
  tradeQuantos,
  boxContractAdr,
  boxQuantos,
  boxId
}: {
  tradeQuantos: undefined | QuantosDetails
  boxContractAdr: string
  boxQuantos: undefined | QuantosDetails[]
  boxId: string | number
}) => {
  const isLg = useBreakpoint('lg')
  const [chartTab, setChartTab] = useState(chartTabs[1])
  const [isRise, setIsRise] = useState(true)
  const [tradePrice, setTradePrice] = useState(0)
  const [isLong, setIsLong] = useState(true)
  const [totalPosition, setTotalPosition] = useState(0)

  useRequest(
    async () => {
      try {
        const req = await GetTokenPrice()
        if (req.code === 200) {
          const btcPrice = req.data.find(d => d.coinId === 'bitcoin')?.price ?? 0
          new BigNumber(btcPrice).isGreaterThanOrEqualTo(tradePrice) ? setIsRise(true) : setIsRise(false)
          setTradePrice(new BigNumber(btcPrice).toNumber())
        }
      } catch (e) {
        console.error('get token price failed!', e)
      }
    },
    {
      pollingInterval: 8000
    }
  )

  const tradeMode = useMemo<TRADE_MODE>(() => {
    switch (chartTab) {
      case 'Basic':
        return TRADE_MODE.BASIC
      case 'Pro':
        return TRADE_MODE.PRO
      default:
        return TRADE_MODE.DEGEN
    }
  }, [chartTab])

  return (
    <Box
      mt={24}
      sx={{
        display: isLg ? 'block' : 'grid',
        gridTemplateColumns: '1fr 280px',
        background: 'var(--ps-neutral2)',
        borderRadius: 12
      }}
    >
      <Box sx={{ borderRight: '1px solid var(--ps-text-10)' }}>
        <ChartTab
          chartTabs={chartTabs}
          curTab={chartTab}
          changeTab={v => setChartTab(v)}
          quantos={tradeQuantos}
          boxQuantos={boxQuantos}
          boxContractAdr={boxContractAdr}
          tradePrice={new BigNumber(tradePrice as number)}
          isRise={isRise}
        />
        <Box sx={{ height: 542, pt: isLg ? '20px' : '40px' }}>
          <TradingViewChart tradeMode={tradeMode} />
        </Box>
        <MyTrade
          tradeQuantos={tradeQuantos}
          tradePrice={new BigNumber(tradePrice as number)}
          boxContractAdr={boxContractAdr}
          boxId={boxId}
          setPositionCount={v => setTotalPosition(v)}
        />
      </Box>
      <Box>
        <ConductTrade
          quantos={tradeQuantos}
          tradePrice={new BigNumber(tradePrice as number)}
          tradeMode={tradeMode}
          boxContractAdr={boxContractAdr}
          boxQuantos={boxQuantos}
          setIsLong={c => setIsLong(c)}
          totalPosition={totalPosition}
        />
        <Box
          mt={12}
          sx={{
            padding: '12px 12px 16px 12px',

            background: 'var(--ps-neutral2)',
            borderTop: '1px solid var(--ps-text-10)',
            borderBottom: '1px solid var(--ps-text-10)'
          }}
        >
          <Typography
            pb={12}
            sx={{
              color: 'var(--ps-Light-grey-01, #F7F7F7)',
              fontFamily: 'SF Pro Display',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: '100%'
            }}
          >
            {isLong ? 'Long' : 'Short'} BTC
          </Typography>
          <Stack pt={12} sx={{ gap: 4 }}>
            <InfoPair
              label="Borrow Fee"
              value={`${getBorrowFees(tradeQuantos?.fundingFeePerBlockP).toFormat(6)} %/1h`}
            />
            <InfoPair
              label="Available Liquidity"
              value={`${
                tradeQuantos?.poolCurrentBalance ? tradeQuantos.poolCurrentBalance.toFormat(2) : '0'
              } ${tradeQuantos?.tokenInfo?.symbol}`}
            />
          </Stack>
        </Box>

        {/*<Box*/}
        {/*  mt={12}*/}
        {/*  sx={{*/}
        {/*    padding: '12px 12px 16px 12px',*/}
        {/*    borderTop: '1px solid var(--ps-text-10)',*/}
        {/*    background: 'var(--ps-neutral2)'*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Typography*/}
        {/*    pb={12}*/}
        {/*    sx={{*/}
        {/*      color: 'var(--ps-Light-grey-01, #F7F7F7)',*/}
        {/*      fontFamily: 'SF Pro Display',*/}
        {/*      fontSize: '15px',*/}
        {/*      fontWeight: 500,*/}
        {/*      lineHeight: '100%'*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Useful Links*/}
        {/*  </Typography>*/}
        {/*  <Stack pt={12}>*/}
        {/*    <InfoPair*/}
        {/*      label="Trading guide"*/}
        {/*      value={<ShareArrow />}*/}
        {/*      link="http://localhost:3000/club/editBox"*/}
        {/*      sx={{ padding: '8px 0', borderBottom: '1px solid var(--ps-text-10)' }}*/}
        {/*    />*/}
        {/*    <InfoPair*/}
        {/*      label="Leaderboard"*/}
        {/*      value={<ShareArrow />}*/}
        {/*      link="http://localhost:3000/club/editBox"*/}
        {/*      sx={{ padding: '8px 0', borderBottom: '1px solid var(--ps-text-10)' }}*/}
        {/*    />*/}
        {/*    <InfoPair*/}
        {/*      label="Speed up page loading"*/}
        {/*      value={<ShareArrow />}*/}
        {/*      link="http://localhost:3000/club/editBox"*/}
        {/*      sx={{ padding: '8px 0' }}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</Box>*/}
      </Box>
    </Box>
  )
}
export default Page
