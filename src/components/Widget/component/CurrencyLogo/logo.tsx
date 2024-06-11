import { HelpCircle } from 'components/Widget/assets/svg'
import { ImageProps } from 'next/image'
import React, { useState } from 'react'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find(src => !BAD_SRCS[src])

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh(i => i + 1)
        }}
      />
    )
  }

  return <HelpCircle {...rest} />
}
