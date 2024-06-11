import { useMemo } from 'react'
import ERC20_INTERFACE from '../abis/erc20'
import { useActiveWeb3React } from '.'
import { useBytes32TokenContract, useInterfaceMulticall, useTokenContract } from './useContract'
import { isAddress } from '../utils'
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
  NEVER_RELOAD,
  useSingleCallResult
} from './multicall'
import { CurrencyAmount } from '../constants/token'
import JSBI from 'jsbi'
import { Currency } from '../constants/token'
import { SupportedChainId } from '../constants/chains'
import { arrayify, parseBytes32String } from 'ethers/lib/utils'
import isZero from '../utils/index'
import { ZERO_ADDRESS } from '../constants'

export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[],
  chainId?: SupportedChainId
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useInterfaceMulticall(chainId)

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    chainId,
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value)
          memo[address] = CurrencyAmount.fromRawAmount(
            Currency.getNativeCurrency(chainId),
            JSBI.BigInt(value.toString())
          )
        return memo
      }, {}),
    [addresses, chainId, results]
  )
}

export function useETHBalance(
  uncheckedAddress?: string | undefined,
  chainId?: SupportedChainId
): CurrencyAmount | undefined {
  const ETHBalances = useETHBalances([uncheckedAddress], chainId)

  return useMemo(() => (uncheckedAddress ? ETHBalances[uncheckedAddress] : undefined), [ETHBalances, uncheckedAddress])
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Currency | undefined)[],
  chainId?: SupportedChainId
): [{ [tokenAddress: string]: CurrencyAmount | undefined }, boolean] {
  const validatedTokens: Currency[] = useMemo(
    () => tokens?.filter((t?: Currency): t is Currency => isAddress(t?.address) !== false && !t?.isNative) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(chainId, validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [
    address
  ])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new CurrencyAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
  chainId?: SupportedChainId
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.map(currency => (currency && !currency?.isNative ? currency : undefined)) ?? [],
    [currencies]
  )
  const eths = useMemo(() => currencies?.find(currency => currency && currency.isNative), [currencies])

  const tokenBalances = useTokenBalancesWithLoadingIndicator(account, tokens, chainId)[0]
  const ethBalance = useETHBalance(eths ? account : undefined, chainId)
  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency.isNative) return ethBalance
        else return tokenBalances[currency.address]
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency,
  chainId?: SupportedChainId
): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency], chainId)[0]
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
      bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
      ? parseBytes32String(bytes32)
      : defaultValue
}

export function useToken(tokenAddress: string, chainId?: SupportedChainId): Currency | undefined | null {
  const { chainId: linkChainId } = useActiveWeb3React()
  const curChainId = chainId || linkChainId

  const address = useMemo(() => {
    return isZero(tokenAddress) ? '' : isAddress(tokenAddress)
  }, [tokenAddress])

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)

  const tokenName = useSingleCallResult(curChainId, tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(curChainId, tokenContractBytes32, 'name', undefined, NEVER_RELOAD)
  const symbol = useSingleCallResult(curChainId, tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(curChainId, tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(curChainId, tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (!curChainId) return undefined
    if (tokenAddress === ZERO_ADDRESS) return Currency.getNativeCurrency(curChainId)
    if (!address) return undefined
    if (address && isZero(address)) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Currency(
        curChainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    curChainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    tokenAddress,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useTokens(
  tokenAddress: (string | undefined)[],
  chainId?: SupportedChainId
): undefined | (Currency | undefined)[] {
  const { chainId: linkChainId } = useActiveWeb3React()
  const curChainId = chainId || linkChainId

  const filterAddresses = useMemo(() => tokenAddress?.filter(i => i !== ZERO_ADDRESS), [tokenAddress])

  const tokenNames = useMultipleContractSingleData(
    curChainId,
    filterAddresses,
    ERC20_INTERFACE,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbols = useMultipleContractSingleData(
    curChainId,
    filterAddresses,
    ERC20_INTERFACE,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const decimalss = useMultipleContractSingleData(
    curChainId,
    filterAddresses,
    ERC20_INTERFACE,
    'decimals',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!tokenAddress.length || !curChainId) return undefined
    if (filterAddresses.length && (tokenNames[0].loading || symbols[0].loading || decimalss[0].loading))
      return undefined
    let offset = 0
    return tokenAddress.map((address, index) => {
      if (address && isZero(address)) {
        offset = offset + 1
        return Currency.getNativeCurrency(curChainId)
      }
      const symbol = symbols[index - offset].result
      const tokenName = tokenNames[index - offset].result
      const decimal = decimalss[index - offset].result
      if (!symbol || !tokenName || !decimal || !address) return undefined

      return new Currency(curChainId, address, decimal[0], symbol[0], tokenName[0])
    })
  }, [curChainId, decimalss, filterAddresses.length, symbols, tokenAddress, tokenNames])
}
