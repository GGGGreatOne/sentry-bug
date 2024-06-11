import { Percent } from '@uniswap/sdk-core'
import { DutchOrderBuilder } from '@uniswap/uniswapx-sdk'
import { BigNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import { DutchOrderTrade, LimitOrderTrade } from '../state/routing/types'
import { SignatureExpiredError, UserRejectedRequestError } from '../utils/errors'
import { signTypedData } from '../utils/signing'
import { didUserReject, swapErrorToUserReadableMessage } from '../utils/swapErrorToUserReadableMessage'

// type DutchAuctionOrderError = { errorCode?: number; detail?: string }
// type DutchAuctionOrderSuccess = { hash: string }
// type DutchAuctionOrderResponse = DutchAuctionOrderError | DutchAuctionOrderSuccess

// const isErrorResponse = (res: Response, order: DutchAuctionOrderResponse): order is DutchAuctionOrderError =>
//   res.status < 200 || res.status > 202

const UNISWAP_API_URL = process.env.NEXT_PUBLIC_REACT_APP_UNISWAP_API_URL
const UNISWAP_GATEWAY_DNS_URL = process.env.NEXT_PUBLIC_REACT_APP_UNISWAP_GATEWAY_DNS
if (UNISWAP_API_URL === undefined || UNISWAP_GATEWAY_DNS_URL === undefined) {
  throw new Error(`UNISWAP_API_URL and UNISWAP_GATEWAY_DNS_URL must be defined environment variables`)
}

// getUpdatedNonce queries the UniswapX service for the most up-to-date nonce for a user.
// The `nonce` exists as part of the Swap quote response already, but if a user submits back-to-back
// swaps without refreshing the quote (and therefore uses the same nonce), then the subsequent swaps will fail.
//
async function getUpdatedNonce(swapper: string, chainId: number): Promise<BigNumber | null> {
  try {
    // endpoint fetches current nonce
    const res = await fetch(`${UNISWAP_GATEWAY_DNS_URL}/nonce?address=${swapper.toLowerCase()}&chainId=${chainId}`)
    const { nonce } = await res.json()
    return BigNumber.from(nonce).add(1)
  } catch (e) {
    console.error(e)
    return null
  }
}

export function useUniswapXSwapCallback({
  trade // allowedSlippage,// fiatValues
}: {
  trade?: DutchOrderTrade | LimitOrderTrade
  fiatValues: { amountIn?: number; amountOut?: number; feeUsd?: number }
  allowedSlippage: Percent
}) {
  const { account, library: provider /*, connector*/ } = useActiveWeb3React()

  // const { data } = useCachedPortfolioBalancesQuery({ account })
  // const portfolioBalanceUsd = data?.portfolios?.[0]?.tokensTotalDenominatedValue?.value

  return useCallback(async () => {
    if (!account) throw new Error('missing account')
    if (!provider) throw new Error('missing provider')
    if (!trade) throw new Error('missing trade')

    try {
      const updatedNonce = await getUpdatedNonce(account, trade.inputAmount.currency.chainId)
      // TODO(limits): WEB-3434 - add error state for missing nonce
      if (!updatedNonce) throw new Error('missing nonce')

      const order = trade.asDutchOrderTrade({ nonce: updatedNonce, swapper: account }).order
      const startTime = Math.floor(Date.now() / 1000) + trade.startTimeBufferSecs
      const endTime = startTime + trade.auctionPeriodSecs
      const deadline = endTime + trade.deadlineBufferSecs

      const updatedOrder = DutchOrderBuilder.fromOrder(order)
        .decayStartTime(startTime)
        .decayEndTime(endTime)
        .deadline(deadline)
        .swapper(account)
        .nonFeeRecipient(account, trade.swapFee?.recipient)
        // if fetching the nonce fails for any reason, default to existing nonce from the Swap quote.
        .nonce(updatedNonce ?? order.info.nonce)
        .build()
      const { domain, types, values } = updatedOrder.permitData()

      const signature = await signTypedData(provider.getSigner(account), domain, types, values)
      return signature
    } catch (error) {
      if (didUserReject(error)) {
        throw new UserRejectedRequestError(swapErrorToUserReadableMessage(error))
      }
      if (error instanceof UserRejectedRequestError) {
        throw error
      } else if (error instanceof SignatureExpiredError) {
        throw error
      } else {
        throw new Error(swapErrorToUserReadableMessage(error))
      }
    }
  }, [account, provider, trade])
}
