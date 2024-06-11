import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount, Token, ETHER } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tryParseAmount } from '../swap/hooks'
import { Field, selectCurrency, typeInput } from './actions'
import { AppDispatch, AppState } from 'state'
import { useActiveWeb3React } from 'hooks'
import { usePair } from 'components/Widget/data/Reserves'
import { useTokenBalances } from 'components/Widget/hooks/wallet'
import { wrappedCurrency } from 'components/Widget/utils/wrappedCurrency'
import { useTotalSupply } from 'components/Widget/data/TotalSupply'
import { checkChainId } from 'components/Widget/utils/utils'
import { useCurrency } from 'components/Widget/hooks/Tokens'

export function useBurnState(): AppState['burn'] {
  return useSelector<AppState, AppState['burn']>(state => state.burn)
}

export function useDerivedBurnInfo(): {
  pair?: Pair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: CurrencyAmount
    [Field.CURRENCY_B]?: CurrencyAmount
  }
  error?: string
  lpBalance: undefined | TokenAmount
  poolShare: string
  currencies: { [field in Field]?: Currency }
} {
  const { account, chainId } = useActiveWeb3React()
  const checkedChainId = checkChainId(chainId)

  const {
    independentField,
    typedValue,
    [Field.CURRENCY_A]: { currencyId: currencyIdA },
    [Field.CURRENCY_B]: { currencyId: currencyIdB }
  } = useBurnState()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined
    }),
    [currencyA, currencyB]
  )

  // pair + totalsupply
  const [, pair] = usePair(currencyA ?? undefined, currencyB ?? undefined)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const [tokenA, tokenB] = [
    wrappedCurrency(currencyA ?? undefined, checkedChainId),
    wrappedCurrency(currencyB ?? undefined, checkedChainId)
  ]
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
      : undefined
  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
      : undefined
  const liquidityValues: { [Field.CURRENCY_A]?: TokenAmount; [Field.CURRENCY_B]?: TokenAmount } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB
  }

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }
  // user specified a specific amount of liquidity tokens
  else if (independentField === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken)
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.raw, userLiquidity.raw)
      }
    }
  }
  // user specified a specific amount of token a or b
  else {
    if (tokens[independentField]) {
      const independentAmount = tryParseAmount(typedValue, tokens[independentField])
      const liquidityValue = liquidityValues[independentField]
      if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
        percentToRemove = new Percent(independentAmount.raw, liquidityValue.raw)
      }
    }
  }

  const poolShare = totalSupply && userLiquidity ? new Percent(userLiquidity.raw, totalSupply.raw).toFixed(2) : '0'

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
        ? new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
        : undefined,
    [Field.CURRENCY_A]:
      tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
        ? new TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
        : undefined,
    [Field.CURRENCY_B]:
      tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
        ? new TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
        : undefined
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmounts[Field.LIQUIDITY] || !parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? 'Enter an amount'
  }

  return { pair, parsedAmounts, error, lpBalance: userLiquidity, poolShare, currencies }
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onCurrencySelection: (field: Field, currency: Currency) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : ''
        })
      )
    },
    [dispatch]
  )

  return {
    onUserInput,
    onCurrencySelection
  }
}
