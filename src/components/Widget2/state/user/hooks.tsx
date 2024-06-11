import { Percent, Token, V2_FACTORY_ADDRESSES } from '@uniswap/sdk-core'
import { computePairAddress } from '@uniswap/v2-sdk'
import JSBI from 'jsbi'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { RouterPreference } from '../../state/routing/types'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from '../../constants/routing'
import { useDefaultActiveTokens } from '../../hooks/Tokens'
import {
  updateHideClosedPositions,
  updateUserDeadline,
  updateUserRouterPreference,
  updateUserSlippageTolerance
} from './reducer'
import { SerializedToken, SlippageTolerance } from './types'
import { useActiveWeb3React } from 'hooks'
import { SupportedLocale } from 'components/Widget2/constants/locales'

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name
  }
}

export function useUserLocale(): SupportedLocale | null {
  return 'en-US'
}

export function useRouterPreference(): [RouterPreference, (routerPreference: RouterPreference) => void] {
  const dispatch = useAppDispatch()

  const routerPreference = useAppSelector(state => state.swap2.user.userRouterPreference)

  const setRouterPreference = useCallback(
    (newRouterPreference: RouterPreference) => {
      dispatch(updateUserRouterPreference({ userRouterPreference: newRouterPreference }))
    },
    [dispatch]
  )

  return [routerPreference, setRouterPreference]
}

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): [
  Percent | SlippageTolerance.Auto,
  (slippageTolerance: Percent | SlippageTolerance.Auto) => void
] {
  const userSlippageToleranceRaw = useAppSelector(state => {
    return state.swap2.user.userSlippageTolerance
  })

  // TODO(WEB-1985): Keep `userSlippageTolerance` as Percent in Redux store and remove this conversion
  const userSlippageTolerance = useMemo(
    () =>
      userSlippageToleranceRaw === SlippageTolerance.Auto
        ? SlippageTolerance.Auto
        : new Percent(userSlippageToleranceRaw, 10_000),
    [userSlippageToleranceRaw]
  )

  const dispatch = useAppDispatch()
  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: Percent | SlippageTolerance.Auto) => {
      let value: SlippageTolerance.Auto | number
      try {
        value =
          userSlippageTolerance === SlippageTolerance.Auto
            ? SlippageTolerance.Auto
            : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient)
      } catch (error) {
        value = SlippageTolerance.Auto
      }
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance: value
        })
      )
    },
    [dispatch]
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

/**
 *Returns user slippage tolerance, replacing the auto with a default value
 * @param defaultSlippageTolerance the value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const [allowedSlippage] = useUserSlippageTolerance()
  return allowedSlippage === SlippageTolerance.Auto ? defaultSlippageTolerance : allowedSlippage
}

export function useUserHideClosedPositions(): [boolean, (newHideClosedPositions: boolean) => void] {
  const dispatch = useAppDispatch()

  const hideClosedPositions = useAppSelector(state => state.swap2.user.userHideClosedPositions)

  const setHideClosedPositions = useCallback(
    (newHideClosedPositions: boolean) => {
      dispatch(updateHideClosedPositions({ userHideClosedPositions: newHideClosedPositions }))
    },
    [dispatch]
  )

  return [hideClosedPositions, setHideClosedPositions]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const userDeadline = useAppSelector(state => state.swap2.user.userDeadline)
  // const onL2 = Boolean(chainId && L2_CHAIN_IDS.includes(chainId))
  const deadline = /*onL2 ? L2_DEADLINE_FROM_NOW :*/ userDeadline

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [deadline, setUserDeadline]
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  if (tokenA.chainId !== tokenB.chainId) throw new Error('Not matching chain IDs')
  if (tokenA.equals(tokenB)) throw new Error('Tokens cannot be equal')
  if (!V2_FACTORY_ADDRESSES[tokenA.chainId]) throw new Error('No V2 factory address on this chain')

  return new Token(
    tokenA.chainId,
    computePairAddress({ factoryAddress: V2_FACTORY_ADDRESSES[tokenA.chainId], tokenA, tokenB }),
    18,
    'BIT-V2',
    'Bitswap V2'
  )
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useDefaultActiveTokens(chainId)

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? Object.keys(tokens).flatMap(tokenAddress => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map(base => {
                  if (base.address === token.address) {
                    return null
                  } else {
                    return [base, token]
                  }
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId]
  )

  const combinedList = useMemo(() => generatedPairs.concat(pinnedPairs), [generatedPairs, pinnedPairs])

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map(key => keyed[key])
  }, [combinedList])
}
