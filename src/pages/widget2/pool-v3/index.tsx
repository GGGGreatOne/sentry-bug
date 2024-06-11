import { Container } from '@mui/material'
import RemoveLiquidityV3 from 'components/Widget2/Liquidity/RemoveLiquidity/V3'
import Pool from 'components/Widget2/Pool'
import PositionPage from 'components/Widget2/Pool/PositionPage'
import { Provider as ApolloProvider } from 'components/Widget2/graphql/apollo/Provider'
import { ThemeProvider } from 'components/Widget2/theme'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
export default function Widget2page() {
  const router = useRouter()
  const tokenId: string | undefined = useMemo(() => router.query.tokenId?.toString(), [router.query.tokenId])
  const type: string | undefined = useMemo(() => router.query.type?.toString(), [router.query.type])

  const children = useMemo(() => {
    if (type === 'remove' && tokenId) {
      return <RemoveLiquidityV3 boxId={20} tokenId={tokenId} />
    }
    if (tokenId) {
      return <PositionPage tokenId={tokenId} />
    }
    return <Pool boxId={20} />
  }, [tokenId, type])

  return (
    <ApolloProvider>
      <ThemeProvider>
        <Container sx={{ mt: 100, width: '100%' }}>{children}</Container>
      </ThemeProvider>
    </ApolloProvider>
  )
}
