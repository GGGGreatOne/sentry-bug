import { Box, Typography } from '@mui/material'
import ListItem from './listItem'
const Page = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1440,
        margin: '0 auto',
        paddingTop: 110,
        px: { xl: 120, lg: 80, xs: 16 },
        padding: '110px 120px 0'
      }}
    >
      <Typography color={'primary'} variant="h3" fontWeight={500} sx={{ fontSize: { xs: 40, sm: 56 } }}>
        All Clubs
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', sm: '1fr' }, gap: 20, mt: { xs: 40, sm: 60 } }}>
        <ListItem />
        <ListItem />
        <ListItem />
        <ListItem />
      </Box>
    </Box>
  )
}

export default Page
