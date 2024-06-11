import { Typography, Box, useTheme, Card } from '@mui/material'
import { Currency } from '@uniswap/sdk'
import { getSymbol } from 'components/Widget/utils/getSymbol'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { useActiveWeb3React } from 'hooks'

export default function PositionCard({
  assetA,
  assetB,
  lpBalance,
  error,

  poolShare,
  liquidityA,
  liquidityB
}: {
  assetA?: Currency | null
  assetB?: Currency | null
  error?: string | JSX.Element
  lpBalance?: string
  poolShare?: string
  liquidityA?: string
  liquidityB?: string
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()

  const data = {
    ['Your pool share']: poolShare ?? '-' + ' %',
    [`${getSymbol(assetA, chainId) ?? '-'} in pool`]: liquidityA ?? '-',
    [`${getSymbol(assetB, chainId) ?? ''} in pool`]: liquidityB ?? '-'
  }
  return (
    <>
      <Card sx={{ borderRadius: '16px', margin: '0 24px 30px', padding: 20 }}>
        {error && (
          <Typography component="div" fontSize={16} fontWeight={500} color={theme.palette.text.secondary}>
            {error}
          </Typography>
        )}
        {!error && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Pool position</Typography>
            </Box>

            <Box
              display={{ xs: 'grid', sm: 'flex' }}
              justifyContent="space-between"
              mt={24}
              mb={12}
              alignItems="center"
              gap={4}
            >
              <Box display={{ xs: 'grid', sm: 'flex' }} gap={15} alignItems="center">
                <DoubleCurrencyLogo currency0={assetA as any} currency1={assetB as any} size={20} />
                <Typography fontWeight={500} fontSize={13}>
                  {getSymbol(assetA, chainId) + '/' + getSymbol(assetB, chainId)}
                </Typography>
              </Box>
              <Typography fontSize={13} fontWeight={700}>
                {lpBalance || '-'}{' '}
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gap: 12 }}>
              {Object.keys(data).map((key, idx) => (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography sx={{ color: theme.palette.text.secondary, fontWeight: 500 }} fontSize={13}>
                    {key}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }} fontSize={13}>
                    {data[key as keyof typeof data]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Card>
    </>
  )
}
