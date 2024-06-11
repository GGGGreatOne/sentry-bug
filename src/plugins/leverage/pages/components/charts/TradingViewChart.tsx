/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, useTheme } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { TRADE_MODE } from '../../tradePanel'

export const TradingViewChart = ({ tradeMode }: { tradeMode: TRADE_MODE }) => {
  const theme = useTheme()
  const createWidget = useCallback(() => {
    if (document.getElementById('tradingview_2daf6') && 'TradingView' in window) {
      // @ts-expect-error: trading view inject object
      new window.TradingView.widget({
        autosize: true,
        symbol: 'BINANCE:BTCUSD',
        interval: tradeMode === TRADE_MODE.DEGEN ? '1' : 'D',
        timezone: 'Etc/UTC',
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        style: tradeMode === TRADE_MODE.DEGEN ? '3' : '1',
        locale: 'en',
        enable_publishing: false,
        hide_top_toolbar: tradeMode === TRADE_MODE.DEGEN,
        hide_legend: tradeMode === TRADE_MODE.DEGEN,
        save_image: false,
        hide_volume: true,
        container_id: 'tradingview_2daf6'
      })
    }
  }, [theme, tradeMode])
  useEffect(() => {
    new Promise(resolve => {
      const script = document.createElement('script')
      script.id = 'tradingview-widget-loading-script'
      script.src = 'https://s3.tradingview.com/tv.js'
      script.type = 'text/javascript'
      script.onload = resolve
      document.head.appendChild(script)
    }).then(() => createWidget())
  }, [createWidget])
  return (
    <Box>
      <Box className="tradingview-widget-container">
        <Box sx={{ height: '502px' }} id="tradingview_2daf6" />
      </Box>
    </Box>
  )
}
