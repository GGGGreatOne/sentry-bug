import BigNumber from 'bignumber.js'
import LoginModal from 'components/Header/LoginModal'
import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter'
import Popups from 'components/essential/Popups'
import type { AppProps } from 'next/app'
import ConnectProvider, { wagmiConfig, projectId, ErrorNetworkUpdater } from 'provider/ConnectProvider'
import AppTransitionProvider, { PageTransition } from 'provider/PageTransitionProvider'
// import { Countdown } from 'provider/CountdownProvider'
import { ModalProvider } from 'provider/ModalProvider'
import MuiThemeProvider from 'provider/MuiThemeProvider'
import StateProvider from 'provider/StateProvider'
import ApplicationUpdater from 'state/application/updater'
import { MulticallUpdater } from 'state/multicall'
import TransactionsUpdater from 'state/transactions/updater'
import '../styles/globals.css'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { CURRENT_ENVIRONMENT, SupportedChainList } from 'constants/chains'
import HomeTour from 'components/QuickTour/HomeTour'
import { useEffect, useState } from 'react'
BigNumber.config({ EXPONENTIAL_AT: [-20, 40], ROUNDING_MODE: BigNumber.ROUND_DOWN })

createWeb3Modal({
  themeVariables: {
    '--w3m-z-index': 10000
  },
  defaultChain: SupportedChainList[0],
  chainImages: {
    9000: 'https://club.bouncebit.io/favicon.ico',
    6001: 'https://club.bouncebit.io/favicon.ico',
    6000: 'https://club.bouncebit.io/favicon.ico'
  },
  wagmiConfig,
  projectId,
  chains: SupportedChainList,
  featuredWalletIds: ['8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4']
})

function Updater() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
      <TransactionsUpdater />
      <ErrorNetworkUpdater />
    </>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  if (CURRENT_ENVIRONMENT === 'prod' && process.env.NODE_ENV === 'production' && typeof window === 'object') {
    window.console.log = function () {}
  }
  const [open, setOpen] = useState(false)
  const [isCountdown, setIsCountdown] = useState(false)
  const endTime = 1715594400000
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      if (typeof window !== 'object') return
      if (now < endTime && window.location.hostname.includes('app.bouncebit.io')) {
        setIsCountdown(false)
        return
      }
      setIsCountdown(true)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <ConnectProvider>
      <StateProvider>
        <MuiThemeProvider>
          <NiceModalProvider>
            <Updater />
            <Popups />
            <GoogleAnalyticsReporter />
            <ToastContainer />
            <ModalProvider>
              <AppTransitionProvider>
                <HomeTour setOpen={setOpen} open={open} isCountdown={isCountdown}>
                  <Header open={open} setOpen={setOpen} isCountdown={isCountdown} />
                  <LoginModal />
                  <Component {...pageProps} />
                  <Footer />
                  <PageTransition />
                </HomeTour>
              </AppTransitionProvider>
              {/* <Countdown /> */}
            </ModalProvider>
          </NiceModalProvider>
        </MuiThemeProvider>
      </StateProvider>
    </ConnectProvider>
  )
}
