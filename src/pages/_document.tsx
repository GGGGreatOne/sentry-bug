import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* <title>BounceBit - BTC Restaking</title> */}
          <meta property="og:title" content="BounceBit - BTC Restaking" />
          <link rel="icon" href="/favicon.png" />
          <meta name="theme-color" content="#F1EDE8" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://bouncebit.io/cover.jpeg" />
          <meta property="og:url" content="https://bouncebit.io" />
          <meta property="og:site_name" content="BounceBit" />
          <meta property="og:locale" content="en" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="675" />
          <meta name="twitter:title" content="BounceBit - BTC Restaking Chain" />
          <meta name="twitter:site" content="@bounce_bit" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://bouncebit.io/cover.jpeg" />
          <meta
            name="twitter:description"
            content="BounceBit is a BTC restaking chain exclusively designed for Bitcoin, backed by Blockchain Capital and Breyer Capital. The primary objective of BounceBit is to create a designated smart contract execution environment for Bitcoin. BounceBit introduces the idea of the App Store and BounceBox, enabling users to swiftly deploy their own decentralized applications within the BTC ecosystem."
          />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="675" />
          <meta
            name="description"
            content="BounceBit is a BTC restaking chain exclusively designed for Bitcoin, backed by Blockchain Capital and Breyer Capital. The primary objective of BounceBit is to create a designated smart contract execution environment for Bitcoin. BounceBit introduces the idea of the App Store and BounceBox, enabling users to swiftly deploy their own decentralized applications within the BTC ecosystem."
          />
          <meta
            name="keywords"
            content="BTC Restaking, BounceBit BTC Restaking, Bitcoin Smart Contract Platform,BTC App Store BounceBit,Breyer Capital Bitcoin Investment,  Bitcoin DApp Deployment, Crypto Staking Solutions, Smart Contracts for Bitcoin,  BounceBit Bitcoin Technology,  BTC Restaking, BounceBit Crypto Investment,  Bitcoin Decentralized Platform,  Cryptocurrency Staking BounceBit,  Bitcoin Ecosystem Expansion, MUBI Staking, Auction Staking,  USDT Staking,  FDUSD Staking"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
