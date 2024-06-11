import { Typography, Box, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import { TokenAmount, Currency } from '@uniswap/sdk'
import ActionButton from '../Button/ActionButton'
import { useActiveWeb3React } from 'hooks'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function ConfirmSupplyModal({
  onConfirm,
  shareOfPool,
  isOpen,
  onDismiss,
  liquidityMinted,
  valA,
  valB,
  tokenA,
  tokenB,
  priceA,
  priceB
}: {
  onConfirm: () => void
  isOpen: boolean
  onDismiss: () => void
  liquidityMinted: TokenAmount | undefined
  valA: string
  valB: string
  tokenA?: Currency
  tokenB?: Currency
  priceA: string
  priceB: string
  shareOfPool: string
  noLiquidity?: boolean
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Typography fontSize={16} fontWeight={500}>
          You will receive
        </Typography>
        <Box
          sx={{
            padding: 20,
            background: 'rgba(255, 255, 255, 0.10)',
            borderRadius: '16px',
            my: 28
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems={'center'} gap={10}>
            <Typography
              fontSize={20}
              fontWeight={900}
              sx={{
                whiteSpace: 'wrap',
                wordBreak: 'break-all'
              }}
            >
              {liquidityMinted?.toSignificant(6) ?? '-'}
            </Typography>
            <DoubleCurrencyLogo currency0={tokenA as any} currency1={tokenB as any} size={28} />
          </Box>

          <Typography fontSize={16} mt={16} mb={12}>
            {getSymbol(tokenA, chainId)} - {getSymbol(tokenB, chainId)}
          </Typography>
          <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary, mb: 24 }}>
            Output is estimated.If the price changes by more than 5% your transaction will revert.
          </Typography>
          <AddLiquidityDetails
            token1={tokenA}
            token2={tokenB}
            token1Val={valA}
            token2Val={valB}
            rateToken1Token2={priceA}
            rateToken2Token1={priceB}
            shareOfPool={shareOfPool}
          />
        </Box>
        <ActionButton onAction={onConfirm} actionText="Confirm Supply" width="100%" isBlackBg />
      </Box>
    </Modal>
  )
}

function AddLiquidityDetails({
  token1,
  token2,
  token1Val,
  token2Val,
  rateToken1Token2,
  rateToken2Token1,
  shareOfPool
}: {
  token1?: Currency
  token2?: Currency
  token1Val: string
  token2Val: string
  rateToken1Token2: string
  rateToken2Token1: string
  shareOfPool: string
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()

  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 20, md: 12 }
      }}
    >
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={8}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography fontSize={13}>
            {getSymbol(token1, chainId)} <span style={{ color: theme.palette.text.primary }}> Deposited</span>
          </Typography>
        </Box>

        <Typography display={'flex'} alignItems="center" gap={8} color="rgba(255, 255, 255, 0.60)" fontSize={13}>
          <CurrencyLogo currencyOrAddress={token1 as any} size={'18px'} />
          {token1Val}
        </Typography>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={8}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography fontSize={13}>
            {getSymbol(token2, chainId)} <span style={{ color: theme.palette.text.primary }}>Deposited</span>
          </Typography>
        </Box>

        <Typography display={'flex'} alignItems="center" gap={8} color="rgba(255, 255, 255, 0.60)" fontSize={13}>
          <CurrencyLogo currencyOrAddress={token2 as any} size={'18px'} />
          {token2Val}
        </Typography>
      </Box>
      {(!rateToken1Token2 && !rateToken2Token1) || (rateToken1Token2 === '0' && rateToken2Token1 === '0') ? null : (
        <Box display={'flex'} justifyContent="space-between" alignItems="flex-start" gap={8}>
          <Box display="flex" alignItems="flex-start" gap={9}>
            <Typography sx={{ color: theme.palette.text.secondary }} fontSize={13} mb="auto">
              Rates
            </Typography>
          </Box>
          <Box display="grid" gap={8} justifyItems={'flex-end'}>
            <Typography color="rgba(255, 255, 255, 0.60)" fontSize={13}>
              1 {getSymbol(token1, chainId)} = {rateToken1Token2} {getSymbol(token2, chainId)}
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.60)" fontSize={13}>
              1 {getSymbol(token2, chainId)} = {rateToken2Token1} {getSymbol(token1, chainId)}
            </Typography>
          </Box>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }} fontSize={13}>
            Share of Pool
          </Typography>
        </Box>

        <Typography color="rgba(255, 255, 255, 0.60)" fontSize={13}>
          {shareOfPool}%
        </Typography>
      </Box>
    </Box>
  )
}
