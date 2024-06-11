import { ChevronRight } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { Currency, ETHER, Token, Trade, WETH } from '@uniswap/sdk'
import React, { Fragment, memo } from 'react'

export default memo(function SwapRoute({ trade }: { trade: Trade | undefined }) {
  return (
    <Box width="100%" display={'flex'} alignItems="center">
      {trade!.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        const currency = unwrappedToken(token)
        return (
          <Fragment key={i}>
            <Box display="flex" alignItems="end">
              <Typography fontSize={14}>{currency.symbol?.toUpperCase()}</Typography>
            </Box>
            {isLastItem ? null : <ChevronRight />}
          </Fragment>
        )
      })}
    </Box>
  )
})

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH[token.chainId])) return ETHER
  return token
}
