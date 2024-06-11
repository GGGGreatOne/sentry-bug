import { Box, Typography, useTheme } from '@mui/material'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import { ExternalLink } from 'components/Global'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import MessageBox from './MessageBox'

export default function TransactionSubmittedModal({
  hash,
  pendingText,
  beforeClose
}: {
  hash?: string
  pendingText?: string
  beforeClose?: () => void
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  return (
    <MessageBox type={'pending'} header={'Transaction Submitted'} beforeClose={beforeClose}>
      <Box display="grid" gap="20px" justifyContent="center">
        <Typography fontWeight={400} fontSize={14} textAlign="center" color={theme.palette.text.secondary}>
          {pendingText || 'Please wait for the transaction to confirm'}
        </Typography>
        {chainId && hash && (
          <ExternalLink
            underline="always"
            href={getEtherscanLink(chainId, hash, 'transaction')}
            style={{ fontSize: 12 }}
          >
            View on explorer
          </ExternalLink>
        )}
      </Box>
    </MessageBox>
  )
}
