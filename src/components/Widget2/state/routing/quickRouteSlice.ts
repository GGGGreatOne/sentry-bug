import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ms from 'ms'

import { GetQuickQuoteArgs, PreviewTradeResult, QuickRouteResponse, QuoteState } from './types'
import { isExactInput, transformQuickRouteToTrade } from './utils'

const UNISWAP_API_URL = process.env.NEXT_PUBLIC_REACT_APP_UNISWAP_API_URL
const UNISWAP_GATEWAY_DNS_URL = process.env.NEXT_PUBLIC_REACT_APP_UNISWAP_GATEWAY_DNS

if (UNISWAP_API_URL === undefined || UNISWAP_GATEWAY_DNS_URL === undefined) {
  throw new Error(`UNISWAP_API_URL and UNISWAP_GATEWAY_DNS_URL must be a defined environment variable`)
}

export const quickRouteApi = createApi({
  reducerPath: 'quickRouteApi',
  baseQuery: fetchBaseQuery(),
  endpoints: build => ({
    getQuickRoute: build.query<PreviewTradeResult, GetQuickQuoteArgs>({
      async queryFn(args, _api, _extraOptions, fetch) {
        const { tokenInAddress, tokenInChainId, tokenOutAddress, tokenOutChainId, amount, tradeType } = args
        const type = isExactInput(tradeType) ? 'exactIn' : 'exactOut'

        const requestBody = {
          tokenInChainId,
          tokenInAddress,
          tokenOutChainId,
          tokenOutAddress,
          amount,
          type: type
        }

        const response = await fetch({
          method: 'GET',
          url: `${UNISWAP_GATEWAY_DNS_URL}/quote`,
          params: requestBody
        })

        if (response.error) {
          // cast as any here because we do a runtime check on it being an object before indexing into .errorCode
          const errorData = response.error.data as { errorCode?: string; detail?: string }
          // NO_ROUTE should be treated as a valid response to prevent retries.
          if (
            typeof errorData === 'object' &&
            (errorData?.errorCode === 'NO_ROUTE' || errorData?.detail === 'No quotes available')
          ) {
            return {
              data: { state: QuoteState.NOT_FOUND, latencyMs: Date.now() }
            }
          } else {
            return { error: response.error }
          }
        }

        const quickRouteResponse = response.data as QuickRouteResponse

        const previewTrade = transformQuickRouteToTrade(args, quickRouteResponse)

        return {
          data: {
            state: QuoteState.SUCCESS,
            trade: previewTrade,
            latencyMs: Date.now()
          }
        }
      },
      keepUnusedDataFor: ms(`10s`),
      extraOptions: {
        maxRetries: 0
      }
    })
  })
})

export const { useGetQuickRouteQuery } = quickRouteApi
export const useGetQuickRouteQueryState = quickRouteApi.endpoints.getQuickRoute.useQueryState
