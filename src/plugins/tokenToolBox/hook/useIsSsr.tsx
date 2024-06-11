import { useEffect, useState } from 'react'

export const useIsSsr = () => {
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    setIsSSR(false)
  }, [])
  return isSSR
}
