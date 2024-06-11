import { Box, Card, Typography } from '@mui/material'

export default function PoolPriceBar({ data, noLiquidity }: { data: object; noLiquidity?: boolean }) {
  return (
    <Card style={{ padding: '16px 20px', borderRadius: 16 }}>
      <Typography sx={{ mb: 12 }} fontWeight={500} fontSize={20}>
        {noLiquidity ? 'Initial prices' : 'Prices'} & Pool share
      </Typography>
      <Box sx={{ display: 'grid', gap: 12 }}>
        {Object.keys(data).map((key, idx) => (
          <>
            <Box key={key + idx + data[key as keyof typeof data]} display="flex" justifyContent="space-between">
              <Typography sx={{ fontWeight: 500 }} fontSize={13}>
                {key}
              </Typography>
              <Typography color="rgba(255, 255, 255, 0.60)" fontSize={13}>
                {data[key as keyof typeof data]}
              </Typography>
            </Box>
          </>
        ))}
      </Box>
    </Card>
  )
}
