import { Typography, Box, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import ActionButton from '../Button/ActionButton'
import { Currency } from '@uniswap/sdk'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import { useActiveWeb3React } from 'hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'

export default function ConfirmRemoveModal({
  onConfirm,
  isOpen,
  onDismiss,
  val,
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
  val: string
  valA: string
  valB: string
  tokenA?: Currency
  tokenB?: Currency
  priceA: string
  priceB: string
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 24px">
        <Box display="flex" alignItems="center" mb={{ xs: 20, md: 39 }}>
          <Typography fontSize={16} fontWeight={500}>
            You will receive
          </Typography>
        </Box>
        <Box sx={{ background: theme.palette.background.default }} padding="24px" borderRadius={'16px'} mb={28}>
          <Box display="flex" justifyContent="space-between" alignItems={'center'}>
            <Typography fontSize={20} fontWeight={900}>
              {valA}
            </Typography>
            <Typography fontSize={15} fontWeight={400} display={'flex'} alignItems={'center'} component={'div'} gap={5}>
              <CurrencyLogo currencyOrAddress={tokenA as any} /> {getSymbol(tokenA, chainId)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems={'center'} mt={10}>
            <Typography fontSize={20} fontWeight={900}>
              {valB}
            </Typography>
            <Typography fontSize={15} fontWeight={400} display={'flex'} alignItems={'center'} component={'div'} gap={5}>
              <CurrencyLogo currencyOrAddress={tokenB as any} /> {getSymbol(tokenB, chainId)}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary, mb: 24 }} mt={20}>
            Output is estimated.If the price changes by more than 5% your transaction will revert.
          </Typography>
          <RemoveLiquidityDetails
            token1={tokenA}
            token2={tokenB}
            lpValue={val}
            rateToken1Token2={priceA}
            rateToken2Token1={priceB}
          />{' '}
        </Box>
        <ActionButton onAction={onConfirm} actionText="Confirm Remove" width="100%" isBlackBg />
      </Box>
    </Modal>
  )
}

function RemoveLiquidityDetails({
  token1,
  token2,
  lpValue,
  rateToken1Token2,
  rateToken2Token1
}: {
  token1?: Currency
  token2?: Currency
  lpValue: string
  rateToken1Token2: string
  rateToken2Token1: string
}) {
  const { chainId } = useActiveWeb3React()

  return (
    <Box
      sx={{
        padding: 20,

        borderRadius: '8px',
        display: 'grid',
        gap: 12,
        mb: 40
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={500}>
          LP{' '}
          {/* <Token1Text fontSize={16} />:{' '}
          <span style={{ color: theme.palette.text.secondary }}>
            <Token2Text />
          </span>{' '} */}
          Burned
        </Typography>
        <Box display="flex" gap={8} alignItems="center" justifyItems={'flex-end'}>
          <DoubleCurrencyLogo currency0={token1 as any} currency1={token2 as any} size={18} />
          <Typography fontSize={16} fontWeight={500}>
            {lpValue}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={500}>
          Price
        </Typography>
        <Box display="grid" gap={8} justifyItems={'flex-end'}>
          <Typography fontSize={16} fontWeight={400}>
            1 {getSymbol(token1, chainId)} = {rateToken1Token2} {getSymbol(token2, chainId)}
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            1 {getSymbol(token2, chainId)} = {rateToken2Token1} {getSymbol(token1, chainId)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
