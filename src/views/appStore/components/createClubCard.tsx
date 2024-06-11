import { Box, Typography, Stack, Button } from '@mui/material'
import { useRouter } from 'next/router'

const CreateClubBox = () => {
  const router = useRouter()
  return (
    <Box width={'100%'} paddingRight={{ xs: '20px', md: 'unset' }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: 'auto', md: '230px' },
          borderRadius: '24px',
          display: { xs: 'grid', md: 'flex' },
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { xs: '48px 20px', md: '72px 48px' },
          backgroundColor: 'var(--ps-neutral2)',
          gap: { xs: '48px', md: 'unset' }
        }}
      >
        <Stack spacing={24} maxWidth={600}>
          <Typography
            fontSize={{ xs: 24, md: 40 }}
            fontWeight={600}
            lineHeight={{ xs: '17px', md: '28px' }}
            color={'var(--px-text-100)'}
          >
            The BounceBit App Store
          </Typography>
          <Typography variant="body1" fontSize={'15px'}>
            {
              'BounceBit App Store features a wide range of plugins built by BounceClub ecosystem partners & developers, enabling BounceClub owners to easily add Web3 applications to their clubs without coding and provide various activities for club members.'
            }
          </Typography>
        </Stack>

        <Button
          onClick={() => {
            router.push('/claimClub#jump')
          }}
          variant="contained"
          sx={{
            width: { xs: '95px', md: '125px' },
            height: { xs: '36px', md: '44px' },
            borderRadius: '100px',
            padding: { xs: '8px 15px', md: '12px 24px' },
            background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)',
            color: 'var(--px-text-100)',
            fontSize: { xs: '13px', md: '15px' },
            whiteSpace: 'nowrap'
          }}
        >
          Create Club
        </Button>
      </Box>
    </Box>
  )
}

export default CreateClubBox
