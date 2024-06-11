import BigNumber from 'bignumber.js'

export function stringifyBanner({
  PCbannerUrl,
  MobileBannerUrl
}: {
  PCbannerUrl: string
  MobileBannerUrl: string
}): string {
  let bannerStr = ''
  try {
    bannerStr = JSON.stringify({
      PCbannerUrl: PCbannerUrl,
      MobileBannerUrl: MobileBannerUrl
    })
  } catch (error) {
    console.error(error)
  }
  return bannerStr
}
export function parseBanner(banner: string): { PCbannerUrl: string; MobileBannerUrl: string } {
  let bannerObj: Record<string, any> = {}
  try {
    bannerObj = JSON.parse(banner)
  } catch (error) {
    console.error(error)
  }
  return {
    PCbannerUrl: bannerObj.PCbannerUrl || '',
    MobileBannerUrl: bannerObj.MobileBannerUrl || ''
  }
}
export const formatNumber = (
  input: string | BigNumber,
  options?: {
    unit?: number | string
    shouldSplitByComma?: boolean
    decimalPlaces?: number
  }
) => {
  const unit = typeof options?.unit === 'undefined' ? 18 : Number(options?.unit)

  const shouldSplitByComma = typeof options?.shouldSplitByComma === 'undefined' ? true : options?.shouldSplitByComma

  const decimalPlaces = options?.decimalPlaces ?? 6

  const readableBigNumber = BigNumber.isBigNumber(input) ? input.div(10 ** unit) : new BigNumber(input).div(10 ** unit)

  if (shouldSplitByComma) {
    if (typeof decimalPlaces === 'number') {
      return readableBigNumber.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN).toFormat()
    }
    return readableBigNumber.toFormat()
  } else {
    if (typeof decimalPlaces === 'number') {
      return readableBigNumber.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN).toFixed()
    }
    return readableBigNumber.toFixed()
  }
}
export const removeRedundantZeroOfFloat = (floatInput: string) => {
  const regexp = /(?:\.0*|(\.\d+?)0+)$/
  return floatInput.replace(regexp, '$1')
}
