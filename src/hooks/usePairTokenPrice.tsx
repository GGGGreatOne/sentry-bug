import { Currency, ETHER, Token } from '@uniswap/sdk'
import { usePair, usePairs } from 'components/Widget/data/Reserves'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import { checkChainId } from 'components/Widget/utils/utils'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ZERO_ADDRESS } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { IBoxPluginBasicItemData } from 'state/boxes/type'
import { useToken, useTokens } from './useToken'
import { Box } from '@mui/material'
import { WBB } from 'components/Widget/constant'

export function usePairTokenPrice({ tokenA, tokenB }: { tokenA?: Token; tokenB?: Token }) {
  const { chainId } = useActiveWeb3React()
  const [, pair] = usePair(tokenA, tokenB)

  const priceA = pair?.token0Price.equalTo('0') ? '0' : pair?.token0Price?.toFixed(8, undefined, 2) ?? '-'

  return `1${getSymbol(tokenA, chainId)} = ${priceA ?? '-'} ${getSymbol(tokenB, chainId)}`
}

export function usePairTokenPriceList(list: IBoxPluginBasicItemData[]) {
  const { chainId } = useActiveWeb3React()
  const addressList = list.reduce((acc, { token0Contract, token1Contract }) => {
    acc.push(token0Contract ?? '')
    acc.push(token1Contract ?? '')
    return acc
  }, [] as Array<string>)

  const tokenList = useTokens(addressList)

  const tokenPairList: [Currency | undefined, Currency | undefined][] = useMemo(() => {
    const checkedChainId = checkChainId(chainId)
    if (!checkedChainId) return []
    return list.map(({ token0Contract, token1Contract }, idx) => {
      if (!token0Contract || !token1Contract) {
        return [undefined, undefined]
      }
      const tokenA = tokenList?.[idx * 2]
      const tokenB = tokenList?.[idx * 2 + 1]
      const chainIdA = checkChainId(tokenA?.chainId)
      const chainIdB = checkChainId(tokenB?.chainId)
      return [
        token0Contract === ZERO_ADDRESS
          ? ETHER
          : tokenA && chainIdA
            ? new Token(chainIdA, tokenA.address, tokenA?.decimals, tokenA?.symbol, tokenA?.name)
            : undefined,
        token1Contract === ZERO_ADDRESS
          ? ETHER
          : tokenB && chainIdB
            ? new Token(chainIdB, tokenB.address, tokenB?.decimals, tokenB?.symbol, tokenB?.name)
            : undefined
      ]
    })
  }, [chainId, list, tokenList])

  const pairs = usePairs(tokenPairList)

  const priceList = useMemo(() => {
    return pairs.map(([, pair]) => {
      const priceA = pair?.token0Price.equalTo('0') ? '0' : pair?.token0Price?.toSignificant(6)
      return {
        price: priceA ? (
          <Price token0Address={pair?.token0.address} token1Address={pair?.token1.address} priceA={priceA} />
        ) : (
          '-'
        ),
        reserve: pair ? (
          <Box>
            <Reserve token0Address={pair?.token0.address} reserve0={pair?.reserve0.toSignificant(8) ?? '-'} />
            <Reserve token0Address={pair?.token1.address} reserve0={pair?.reserve1.toSignificant(8) ?? '-'} />
          </Box>
        ) : (
          '-'
        ),
        liquidityToken: pair?.liquidityToken
      }
    })
  }, [pairs])

  return priceList
}

const Price = ({
  token0Address,
  token1Address,
  priceA
}: {
  token0Address: string | undefined
  token1Address: string | undefined
  priceA: string | undefined
}) => {
  const { chainId } = useActiveWeb3React()
  const token0 = useToken(token0Address || '')
  const token1 = useToken(token1Address || '')

  const t0 = chainId && token0Address === WBB?.address ? ETHER : token0
  const t1 = chainId && token1Address === WBB?.address ? ETHER : token1

  return (
    <>
      1 {getSymbol(t0, chainId)} = {priceA ?? '-'} {getSymbol(t1, chainId)}
    </>
  )
}

const Reserve = ({ token0Address, reserve0 }: { token0Address: string | undefined; reserve0: string }) => {
  const { chainId } = useActiveWeb3React()
  const token0 = useToken(token0Address || '')
  const symbol = getSymbol(token0, chainId)
  return (
    <>
      <Box sx={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
        <CurrencyLogo currencyOrAddress={token0 as any} size={'16px'} />
        {symbol === 'WBB' ? 'BB' : symbol}
        <Box component="span"></Box> {reserve0}
      </Box>
    </>
  )
}
