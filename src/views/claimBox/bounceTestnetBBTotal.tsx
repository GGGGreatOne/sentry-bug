import { Stack, Typography } from '@mui/material'
import { useGetPowerful } from 'hooks/boxes/useGetPowerful'
import useBreakpoint from 'hooks/useBreakpoint'

export default function Page() {
  const isSm = useBreakpoint('sm')
  const { data } = useGetPowerful()
  return (
    <Stack
      spacing={{ md: 59, xs: 40 }}
      sx={{ width: '100%', marginTop: isSm ? 160 : 300, justifyContent: 'center', alignItems: 'center' }}
    >
      <Stack spacing={24}>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            textAlign: 'center',
            fontFamily: 'IBM Plex Sans',
            fontSize: { md: 56, xs: 28 },
            fontWeight: 500,
            lineHeight: '39px'
          }}
        >
          BounceClub Testnet
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            textAlign: 'center',
            fontFamily: 'IBM Plex Sans',
            fontSize: { md: 64, xs: 32 },
            fontWeight: 500,
            lineHeight: 1
          }}
        >
          Total Clubs Created
        </Typography>
      </Stack>
      <Typography
        sx={{
          width: 'max-content',
          textAlign: 'center',
          fontFamily: 'IBM Plex Sans',
          fontSize: { xs: 60, lg: 120, sm: 90 },
          fontWeight: 500,
          lineHeight: 1,
          background:
            'var(--colorful, linear-gradient(90deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%))',
          backgroundClip: 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent'
        }}
      >
        {data?.clubCount ? (48321 || data?.clubCount).toLocaleString() : 0}
      </Typography>
    </Stack>
  )
}
