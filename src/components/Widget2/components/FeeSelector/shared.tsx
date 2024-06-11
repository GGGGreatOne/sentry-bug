import { Typography } from '@mui/material'
import { ChainId, SUPPORTED_CHAINS } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import type { ReactNode } from 'react'

export const FEE_AMOUNT_DETAIL: Record<
  FeeAmount,
  { label: string; description: ReactNode; supportedChains: readonly ChainId[] }
> = {
  [FeeAmount.LOWEST]: {
    label: '0.01',
    description: (
      <Typography color={'#fff'} fontSize={12}>
        Best for very stable pairs.
      </Typography>
    ),
    supportedChains: []
  },
  [FeeAmount.LOW]: {
    label: '0.05',
    description: (
      <Typography color={'#fff'} fontSize={12}>
        Best for stable pairs.
      </Typography>
    ),
    supportedChains: SUPPORTED_CHAINS
  },
  [FeeAmount.MEDIUM]: {
    label: '0.3',
    description: (
      <Typography color={'#fff'} fontSize={12}>
        Best for most pairs.
      </Typography>
    ),
    supportedChains: SUPPORTED_CHAINS
  },
  [FeeAmount.HIGH]: {
    label: '1',
    description: (
      <Typography color={'#fff'} fontSize={12}>
        Best for exotic pairs.
      </Typography>
    ),
    supportedChains: SUPPORTED_CHAINS
  }
}
