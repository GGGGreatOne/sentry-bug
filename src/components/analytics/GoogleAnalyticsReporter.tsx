import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import ReactGA from 'react-ga4'

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string' && GOOGLE_ANALYTICS_ID) {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
} else {
  ReactGA.initialize('test', { testMode: true })
}

// fires a GA pageview every time the route changes
export default function GoogleAnalyticsReporter(): null {
  const pathname = usePathname()

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `${pathname}` })
  }, [pathname])
  return null
}
