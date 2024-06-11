import RemoveLiquidityV3 from 'components/Widget2/Liquidity/RemoveLiquidity/V3'
import Pool from 'components/Widget2/Pool'
import PositionPage from 'components/Widget2/Pool/PositionPage'
import AddLiquidity from '../Liquidity/AddLiquidity'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Container } from '@mui/material'
import { FeeAmount } from '@uniswap/v3-sdk'

export interface IRouteType {
  tokenId: string | undefined
  type: 'add' | 'remove' | undefined
  feeAmount: FeeAmount | undefined
  currency0: string | undefined
  currency1: string | undefined
}

export default function Widget2page({ boxId }: { boxId: string }) {
  const router = useRouter()
  const query = useMemo(() => router.query as unknown as IRouteType, [router.query])
  const tokenId = useMemo(() => query.tokenId, [query.tokenId])
  const type = useMemo(() => query.type, [query.type])

  const children = useMemo(() => {
    if (type === 'remove' && tokenId) {
      return <RemoveLiquidityV3 boxId={boxId} tokenId={tokenId} />
    }
    if (type === 'add') {
      return <AddLiquidity boxId={boxId} />
    }
    if (tokenId) {
      return <PositionPage tokenId={tokenId} />
    }
    return <Pool boxId={boxId} />
  }, [tokenId, boxId, type])

  return <Container sx={{ width: '100%' }}>{children}</Container>
}
