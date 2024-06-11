import { useState, useCallback, useEffect } from 'react'

export const useLazyImage = (defUrl?: string) => {
  const [src, setSrc] = useState('')
  const [isError, setIsError] = useState(false)

  const loader = useCallback((urlSet: string, width?: number, height?: number) => {
    setIsError(false)
    return new Promise((resolve, reject) => {
      if (!urlSet) return reject('error url.')
      const image = new Image(width, height)
      image.srcset = urlSet
      image.src = urlSet
      image.onload = () => {
        // Visual Effects
        setTimeout(() => {
          setSrc(urlSet)
          resolve(urlSet)
        }, 200)
      }
      image.onerror = () => {
        setIsError(true)
        setSrc(urlSet)
        reject(`loader image error: ${urlSet}`)
      }
    })
  }, [])

  useEffect(() => {
    if (defUrl) {
      loader(defUrl)
    }
  }, [defUrl, loader])

  return {
    src,
    isError,
    loader
  }
}
