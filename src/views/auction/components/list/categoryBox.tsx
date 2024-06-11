import { Stack, Typography } from '@mui/material'
import { AuctionCategory } from 'plugins/auction/pages/erc20-create-pool/type'
// import BounceLogo from 'assets/svg/black-logo.svg'
interface IProps {
  category: AuctionCategory | undefined
}
export default function CategoryBox({ category }: IProps) {
  return (
    <Stack
      flexDirection={'row'}
      sx={{
        width: 'fit-content',
        height: 21.781,
        padding: '5.445px 7.26px',
        gap: 3.63,
        borderRadius: 90.752,
        background: 'var(--ps-neutral7)'
      }}
    >
      {/* <BounceLogo /> */}
      <Typography
        sx={{
          color: '#000',
          fontFamily: 'SF Pro Display',
          fontSize: '10.89px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '100%', // '10.89px'
          textTransform: 'capitalize'
        }}
      >
        {category ? AuctionCategory[category] : '--'}
      </Typography>
    </Stack>
  )
}
