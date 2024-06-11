import { useMemo } from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import Divider from 'components/Divider'
// import AddIcon from '@mui/icons-material/Add'
// import { GasStation } from '../../assets/svg'
import { Currency, Token, Trade } from '@uniswap/sdk'
// import CurrencyLogo from '../CurrencyLogo'
import Accordion from '../Accordion'
import SwapRoute from './SwapRoute'
import QuestionHelper from 'components/essential/QuestionHelper'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import { useActiveWeb3React } from 'hooks'

export function SwapSummary({
  // fromAsset,
  toAsset,
  expanded,
  onChange,
  // gasFee,
  price,
  minReceiveQty,
  slippage,
  toVal,
  // routerTokens,
  trade
}: {
  routerTokens?: Currency[] | Token[]
  fromAsset?: Currency
  toAsset?: Currency
  expanded: boolean
  onChange: () => void
  gasFee?: string
  minReceiveQty: string
  slippage: number
  toVal?: string
  price?: string
  trade: Trade | undefined
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()

  const summary = useMemo(() => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <InfoIcon color={'currentColor'} />
          <Typography color={'currentColor'} fontSize={12}>
            1 {getSymbol(trade?.inputAmount.currency)} = {price} {getSymbol(trade?.outputAmount.currency)}
            {/* (${currencyRate}) */}
          </Typography>
        </Box>

        {/* <Box display="flex" gap={5} alignItems="center">
          <GasStation />
          <Typography color={'currentColor'}>~${gasFee || '-'}</Typography>
        </Box> */}
      </Box>
    )
  }, [price, trade?.inputAmount.currency, trade?.outputAmount.currency])

  const details = useMemo(() => {
    return (
      <>
        <Box display="grid" gap={8} padding="12px 0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography fontSize={12}>Expected Output</Typography>
            </Box>

            <Typography fontSize={12}>
              {toVal} <span style={{ color: theme.palette.text.secondary }}>{getSymbol(toAsset, chainId)}</span>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography fontSize={12}>Price Impact</Typography>
            </Box>

            <Typography sx={{ color: theme.palette.text.secondary }} fontSize={12}>
              {slippage}%
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box display="grid" gap={8} padding="12px 0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9} sx={{ maxWidth: { xs: 154, md: 'unset' } }}>
              <Typography fontSize={12}>Minimum received after slippage ({slippage}%)</Typography>
            </Box>

            <Typography fontSize={12}>
              {minReceiveQty} <span>{getSymbol(toAsset, chainId)}</span>
            </Typography>
          </Box>
          {/* <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography fontSize={12}>Network Fee</Typography>
            </Box>

            <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}>
              ${gasFee || '-'}
            </Typography>
          </Box> */}
        </Box>

        {trade && trade.route.path.length > 2 && (
          <>
            <Divider />
            <Box padding="12px 0">
              <Box display="flex" alignItems="center">
                <Typography fontSize={12}>Router</Typography>
                <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
              </Box>
              <SwapRoute trade={trade} />{' '}
            </Box>
          </>
        )}
        {/* <RouterGraph tokens={routerTokens} fromAsset={fromAsset} toAsset={toAsset} fee="0.3%" /> */}
      </>
    )
  }, [toVal, theme.palette.text.secondary, toAsset, chainId, slippage, minReceiveQty, trade])

  return <Accordion summary={summary} details={details} expanded={expanded} onChange={onChange} />
}

// function RouterGraph({
//   fromAsset,
//   toAsset,
//   fee,
//   tokens
// }: {
//   tokens?: Currency[]
//   fromAsset?: Currency
//   toAsset?: Currency
//   fee: string
// }) {
//   const theme = useTheme()

//   const Dashline = styled(Box)({
//     borderBottom: `1px dashed ${theme.palette.text.secondary}`,
//     position: 'absolute',
//     width: 'calc(100% - 64px)'
//   })

//   return (
//     <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px 0" position="relative">
//       {fromAsset && <CurrencyLogo currency={toAsset} style={{ width: 24 }} />}
//       <Box
//         sx={{
//           background: '#ffffff',
//           minWidth: 125,
//           height: 38,
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           borderRadius: '10px',
//           zIndex: 1
//         }}
//       >
//         <Box sx={{ display: 'flex' }}>
//           {fromAsset && <CurrencyLogo currency={toAsset} style={{ width: 24 }} />}
//           {tokens?.map((token, idx) => {
//             return (
//               <CurrencyLogo
//                 currency={token}
//                 style={{ width: 24, marginLeft: -5 * (idx + 1), zIndex: 2 }}
//                 key={token?.symbol ?? '' + idx}
//               />
//             )
//           })}
//           {toAsset && <CurrencyLogo currency={toAsset} style={{ width: 24, marginLeft: -5, zIndex: 2 }} />}
//         </Box>
//         <Typography ml={10}>{fee}</Typography>
//       </Box>
//       {toAsset && <CurrencyLogo currency={toAsset} style={{ width: 24 }} />}
//       <Box sx={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center' }}>
//         <Dashline />
//       </Box>
//     </Box>
//   )
// }

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M8.16406 4.52311H9.83073V6.18978H8.16406V4.52311ZM8.16406 7.85645H9.83073V12.8564H8.16406V7.85645ZM8.9974 0.356445C4.3974 0.356445 0.664062 4.08978 0.664062 8.68978C0.664062 13.2898 4.3974 17.0231 8.9974 17.0231C13.5974 17.0231 17.3307 13.2898 17.3307 8.68978C17.3307 4.08978 13.5974 0.356445 8.9974 0.356445ZM8.9974 15.3564C5.3224 15.3564 2.33073 12.3648 2.33073 8.68978C2.33073 5.01478 5.3224 2.02311 8.9974 2.02311C12.6724 2.02311 15.6641 5.01478 15.6641 8.68978C15.6641 12.3648 12.6724 15.3564 8.9974 15.3564Z"
        fill={color}
      />
    </svg>
  )
}
