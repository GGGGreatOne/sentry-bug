import { styled, Box, Typography, Stack, Button } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import Head from 'next/head'
import SubmitCard from 'views/appStore/submitApp/card'

const StyleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1440px',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  padding: '120px 120px 0',
  [theme.breakpoints.down('md')]: {
    padding: '120px 20px 64px',
    gap: '24px'
  }
}))

export default function Page() {
  const isMd = useBreakpoint('md')
  return (
    <StyleBox>
      <Head>
        <title>BounceClub - Submit App</title>
      </Head>
      <Stack
        spacing={{ xs: 16, md: 32 }}
        textAlign={{ xs: 'start', md: 'center' }}
        alignItems={{ xs: 'start', md: 'center' }}
      >
        <Typography variant={isMd ? 'h4' : 'h1'}>Submit An App</Typography>
        <Button
          variant="contained"
          sx={{
            padding: '2px 8px',
            height: '21px',
            width: '140px',
            fontSize: '12px',
            lineHeight: 1.4,
            fontWeight: 400,
            color: '#4E6EF3',
            backgroundColor: '#D1EEFA',
            ':hover': {
              backgroundColor: '#D1EEFA',
              opacity: 0.7
            }
          }}
        >
          Coming Soon
        </Button>
      </Stack>
      <SubmitCard />
    </StyleBox>
  )
}
