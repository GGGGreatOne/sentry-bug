import { useMemo } from 'react'
import { Typography, Box, Button, useTheme } from '@mui/material'
import Modal from 'components/Modal'
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import QuestionHelper from 'components/essential/QuestionHelper'
import { CurrencyAmount, currencyEquals, Trade, Currency } from '@uniswap/sdk'
import { Field } from 'state/widget/swap/actions'
import ActionButton from '../Button/ActionButton'
import _CurrencyLogo from '../CurrencyLogo'
import { HelperText } from 'components/Widget/constant/helperText'
import Divider from 'components/Divider'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import { useActiveWeb3React } from 'hooks'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmSwapModal({
  onConfirm,
  from,
  to,
  isOpen,
  onDismiss,
  onAcceptChanges,
  trade,
  originalTrade,
  allowedSlippage,
  priceImpact,
  slippageAdjustedAmounts
}: {
  onConfirm: () => void
  from?: Currency
  to?: Currency
  isOpen: boolean
  onDismiss: () => void
  onAcceptChanges: () => void
  trade: Trade | undefined
  originalTrade: Trade | undefined
  allowedSlippage: number
  priceImpact?: string
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount | undefined
    OUTPUT?: CurrencyAmount | undefined
  }
}) {
  const { chainId } = useActiveWeb3React()
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box>
        <Box padding={{ xs: '30px 20px', md: '33px 32px' }}>
          <Typography
            fontSize={16}
            // mb={39}
            mb={15}
            fontWeight={500}
          >
            Confirm Swap
          </Typography>
          <Divider />
          <Box mt={30}></Box>
          <SwapPanel
            from={from}
            to={to}
            fromVal={trade?.inputAmount.toFixed(6) ?? '-'}
            toVal={trade?.outputAmount.toFixed(6) ?? '-'}
          />
          <Typography fontSize={12} mt={16} mb={24} textAlign={'center'}>
            {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {getSymbol(to, chainId) ?? '-'} ={' '}
            {trade?.inputAmount.toFixed(6)} {getSymbol(from, chainId)}
          </Typography>
          {showAcceptChanges && <PriceUpdateNotification onDismiss={onAcceptChanges} />}
          {/* <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 24, mb: 24 }}>
          Output is estimated.You will receive at least {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
          {to?.symbol} or the transaction will revert.
        </Typography> */}
          <Divider />
          <SwapDetails
            ExpectedQty={trade?.outputAmount?.toFixed(6) ?? ''}
            priceImpact={priceImpact ?? ''}
            slippage={allowedSlippage / 100 + ''}
            MinReceiveQty={slippageAdjustedAmounts.OUTPUT?.toFixed(6) ?? ''}
            NetworkFee="8.23"
            toAsset={to}
          />
        </Box>
        <Box sx={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px' }} margin="4px">
          <ActionButton
            width="100%"
            onAction={onConfirm}
            actionText="Confirm Swap"
            error={showAcceptChanges ? 'Confirm Swap' : undefined}
          />
        </Box>
      </Box>
    </Modal>
  )
}

function SwapPanelRow({ asset, value, approx }: { asset?: Currency; value: string; approx?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 'max-content' }}>
      <Box sx={{ display: 'flex', gap: 6, position: 'relative', width: '100%', alignItems: 'center' }}>
        <_CurrencyLogo currency={asset} size="16px" />
        <Box display="grid" gap={5}>
          <Typography fontSize={16} sx={{ wordBreak: 'break-all' }}>
            {value}
          </Typography>
          {approx && (
            <Typography sx={{ fontSize: 12, color: theme => theme.palette.text.secondary }}>~${approx}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

function SwapPanel({ from, to, fromVal, toVal }: { from?: Currency; to?: Currency; fromVal: string; toVal: string }) {
  // const theme = useTheme()

  return (
    <Box
      sx={{
        // background: theme.palette.background.default,
        padding: '12px 20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        justifyContent: 'center'
      }}
    >
      <SwapPanelRow asset={from} value={fromVal} />
      <svg width="11" height="4" viewBox="0 0 11 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.006 3.35C8.146 3.05133 8.28133 2.79 8.412 2.566C8.552 2.342 8.68733 2.15533 8.818 2.006H0.656V1.418H8.818C8.68733 1.25933 8.552 1.068 8.412 0.844C8.28133 0.62 8.146 0.363333 8.006 0.0739997H8.496C9.084 0.755333 9.7 1.25933 10.344 1.586V1.838C9.7 2.15533 9.084 2.65933 8.496 3.35H8.006Z"
          fill="white"
        />
      </svg>

      <SwapPanelRow asset={to} value={toVal} />
    </Box>
  )
}

function PriceUpdateNotification({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Box
      sx={{
        height: 67,
        display: 'flex',
        borderRadius: '8px',
        padding: '0 25px 0 12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box display="flex" alignItems="center">
        <WarningAmberIcon />
        <Typography ml={10}>Price Updated</Typography>
      </Box>

      <Button variant="contained" onClick={onDismiss} sx={{ width: 97, height: 44 }}>
        Accept
      </Button>
    </Box>
  )
}

function SwapDetails({
  ExpectedQty,
  priceImpact,
  slippage,
  MinReceiveQty,
  // NetworkFee,
  toAsset
}: {
  ExpectedQty: string
  priceImpact: string
  slippage: string
  MinReceiveQty: string
  NetworkFee: string
  toAsset: Currency | undefined
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()

  return (
    <Box
      sx={{
        padding: 20,
        // background: theme.palette.background.default,
        borderRadius: '8px',
        display: 'grid',
        gap: 12,
        '& p': {
          fontSize: 12
        }
      }}
    >
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display={'flex'} alignItems="center" gap={9}>
          <Typography>Expected Output</Typography>
          <QuestionHelper text={HelperText.expectedOuptut} />
        </Box>

        <Typography sx={{ wordBreak: 'break-all' }}>
          {ExpectedQty} {ExpectedQty.length > 22 && <br />}{' '}
          <span style={{ color: theme.palette.text.secondary }}> {getSymbol(toAsset, chainId) ?? '-'}</span>
        </Typography>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography>Price Impact</Typography>
          <QuestionHelper text={HelperText.priceImpact} />
        </Box>

        <Typography sx={{ color: theme.palette.text.secondary }}>{priceImpact}%</Typography>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Minimum received <br />
            after slippage ({slippage}%)
          </Typography>
          <QuestionHelper text={HelperText.minReceived} />
        </Box>

        <Typography>
          {MinReceiveQty}
          {MinReceiveQty.length > 22 && <br />}{' '}
          <span style={{ color: theme.palette.text.secondary }}>{getSymbol(toAsset, chainId) ?? '-'}</span>
        </Typography>
      </Box>
      {/* <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>Network Fee</Typography>
          <QuestionHelper text={HelperText.networkFee} />
        </Box>

        <Typography sx={{ color: theme.palette.text.secondary }}>~${NetworkFee}</Typography>
      </Box> */}
    </Box>
  )
}
