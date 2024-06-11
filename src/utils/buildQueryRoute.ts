import { isURL } from 'utils'

interface IParsedUrl {
  path: string
  queryParams: Record<string, string | number>
}

export function parseUrl(url: string): IParsedUrl {
  const urlObj = new URL(isURL(url) ? url : `https://a.com${url}`)
  const path = urlObj.pathname
  const queryParams = Object.fromEntries(urlObj.searchParams.entries())
  return { path, queryParams }
}

export function buildQueryRoute(
  asPath: string,
  params: Record<string, string | number> = {},
  sourceWhiteListParams?: string[]
): string {
  const { path, queryParams } = parseUrl(asPath)
  const filterQueryObjs: Record<string, string | number> = {}
  const filterQueryParams = Object.keys(queryParams).filter(v => sourceWhiteListParams?.includes(v))

  for (const item of filterQueryParams) {
    filterQueryObjs[item] = queryParams[item]
  }
  const queryParamsResult = Object.assign(filterQueryObjs, params)

  const queryString = Object.keys(queryParamsResult)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParamsResult[key])}`)
    .join('&')

  return path + (queryString ? `?${queryString}` : '')
}
