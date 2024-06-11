import { Box } from '@mui/material'
import LoadingAnimation from 'components/Loading'
import { useCallback, useState } from 'react'

const IframeWithLoading = ({
  src,
  width,
  minHeight,
  margin
}: {
  src: string
  width: number | string
  minHeight: number | string
  margin?: string
}) => {
  const [loading, setLoading] = useState(true)

  const handleLoad = () => {
    setLoading(false)
  }

  const getHeight = useCallback(() => {
    const iframeW = document.querySelector('#iframe')?.clientWidth

    const aspectRatio = 9 / 16
    if (typeof width === 'string' && width.includes('%')) {
      return `calc(${iframeW}px * ${aspectRatio})`
    }

    return typeof width === 'number' ? width * aspectRatio : `calc(${iframeW} * ${aspectRatio})`
  }, [width])

  return (
    <Box
      sx={{
        position: 'relative',
        width: width,
        height: getHeight || minHeight,
        margin: '0 auto'
      }}
    >
      {loading && (
        <Box
          sx={{
            display: 'grid',
            placeContent: 'center',
            width,
            height: getHeight || minHeight,
            margin: margin ? margin : '0 auto'
          }}
        >
          <LoadingAnimation />
        </Box>
      )}

      <iframe
        id="iframe"
        src={src}
        width={width}
        frameBorder="0"
        scrolling="no"
        title="Iframe Content"
        onLoad={handleLoad}
        style={
          loading
            ? { display: 'none' }
            : {
                height: getHeight() || minHeight
              }
        }
      ></iframe>
    </Box>
  )
}

export default IframeWithLoading
