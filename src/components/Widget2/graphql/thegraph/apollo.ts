import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@uniswap/sdk-core'
import { useActiveWeb3React } from 'hooks'

const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
}

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[ChainId.MAINNET] })

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  // const chainId = store.getState().application.chainId
  const { chainId } = useActiveWeb3React()

  operation.setContext(() => ({
    uri: chainId && CHAIN_SUBGRAPH_URL[chainId] ? CHAIN_SUBGRAPH_URL[chainId] : CHAIN_SUBGRAPH_URL[ChainId.MAINNET]
  }))

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

export const chainToApolloClient: Record<number, ApolloClient<NormalizedCacheObject>> = {
  [ChainId.MAINNET]: new ApolloClient({
    cache: new InMemoryCache(),
    uri: CHAIN_SUBGRAPH_URL[ChainId.MAINNET]
  })
}
