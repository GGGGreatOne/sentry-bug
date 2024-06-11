import { styled, Typography, useTheme } from '@mui/material'
import { useActiveWeb3React } from 'hooks/'

import { ExternalLink } from 'components/Global'
import { useAllTransactions } from 'state/transactions/hooks'
import Spinner from 'components/Spinner'
import SuccessIcon from 'assets/svg/statusIcon/success_icon.svg'
import Error from 'assets/svg/statusIcon/error_icon.svg'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import useBreakpoint from 'hooks/useBreakpoint'

const TransactionStatusText = styled(Typography)({
  marginRight: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 8,

  '& :hover': {
    texDecoration: 'underline'
  }
})

const TransactionState = styled(ExternalLink)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textDecoration: 'none !important',
  borderRadius: '0.5rem',
  padding: '0.25rem 0rem',
  fontWeight: 500,
  fontSize: '0.825rem',

  '&:hover': {
    color: 'var(--ps-neutral4)'
  }
}))

export default function Transaction({ hash }: { hash: string }) {
  const isMd = useBreakpoint('md')
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const theme = useTheme()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId && !process.env.STORYBOOK_MODE) return null

  return (
    <div>
      <TransactionState href={chainId ? getEtherscanLink(chainId, hash, 'transaction') : ''}>
        <TransactionStatusText noWrap maxWidth={isMd ? '80%' : '240px'}>
          <Typography overflow={isMd ? '' : 'hidden'} textOverflow={isMd ? '' : 'ellipsis'}>
            {summary ?? hash}
          </Typography>
          ↗
        </TransactionStatusText>
        {pending ? (
          <Spinner />
        ) : success ? (
          <SuccessIcon height={16} width={16} fill={theme.palette.success.main} />
        ) : (
          <Error height={16} width={16} />
        )}
      </TransactionState>
    </div>
  )
}
