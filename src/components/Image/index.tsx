import { styled } from '@mui/material'
import { ImgHTMLAttributes, useMemo, useState } from 'react'

const BAD_SRCS: { [x in string]: true } = {}

const StyleImage = styled('img')(() => ({}))

export default function Image({
  src,
  alt = '',
  style,
  className,
  altSrc,
  ...rest
}: {
  src: string
  alt?: string
  style?: React.CSSProperties
  className?: string
  altSrc?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'style'>) {
  const [, refresh] = useState<number>(0)
  const srcs = useMemo(() => [src, altSrc], [src, altSrc])
  const srcStr = srcs.find(item => !BAD_SRCS[item ?? ''])
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <StyleImage
      {...rest}
      src={srcStr}
      alt={alt}
      style={style}
      className={className}
      onError={() => {
        if (srcStr) BAD_SRCS[srcStr] = true
        refresh(i => i + 1)
      }}
    />
  )
}
