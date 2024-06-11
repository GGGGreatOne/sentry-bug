import { Box, Stack, Typography, useTheme } from '@mui/material'
import Icon1 from 'assets/svg/claimBox/about-icon-1.svg'
import Icon2 from 'assets/svg/claimBox/about-icon-2.svg'
// import Icon3 from 'assets/svg/claimBox/about-icon-3.svg'
// import Icon4 from 'assets/svg/claimBox/about-icon-4.svg'
import Icon1Mobile from 'assets/svg/claimBox/about-icon-1-mobile.svg'
import Icon2Mobile from 'assets/svg/claimBox/about-icon-2-mobile.svg'
// import Icon3Mobile from 'assets/svg/claimBox/about-icon-3-mobile.svg'
// import Icon4Mobile from 'assets/svg/claimBox/about-icon-4-mobile.svg'
import Icon5 from 'assets/svg/claimBox/about-icon-5.svg'
import Icon6 from 'assets/svg/claimBox/about-icon-6.svg'
import Icon7 from 'assets/svg/claimBox/about-icon-7.svg'
import useBreakpoint from 'hooks/useBreakpoint'
const BoxItem = ({ icon, title, subTitle }: { icon: React.JSX.Element; title: string; subTitle: string }) => {
  const isSm = useBreakpoint('sm')
  return (
    <Stack
      justifyContent={'space-between'}
      sx={{
        padding: isSm ? 24 : 32,
        borderRadius: 24,
        background: 'var(--ps-neutral)',
        width: isSm ? '100%' : 392,
        height: isSm ? '100%' : 194
      }}
    >
      {icon}
      <Box mt={isSm ? 16 : 0}>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 20, md: 28 },
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '140%'
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-text-40)',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 15, md: 20 },
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '130%',
            marginTop: 12
          }}
        >
          {subTitle}
        </Typography>
      </Box>
    </Stack>
  )
}
export default function Page() {
  const theme = useTheme()
  const isSm = useBreakpoint('sm')
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '600px auto',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: '1fr'
        }
      }}
    >
      <Box>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: 'New York',
            fontSize: { xs: 50, md: 120 },
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '100%'
          }}
        >
          About BounceBit
        </Typography>
        <Typography
          sx={{
            color: 'var(--ps-neutral3)',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 15, md: 20 },
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '130%',
            margin: '16px 0 60px',
            [theme.breakpoints.down('sm')]: {
              margin: '16px 0 40px'
            }
          }}
        >{`Who we are & why we're here.`}</Typography>
        <Typography
          sx={{
            color: 'var(--ps-text-60)',
            fontFamily: 'SF Pro Display',
            fontSize: { xs: 15, md: 20 },
            fontStyle: 'normal',
            fontWeight: '500',
            lineHeight: '160%'
          }}
        >
          {/* BounceBit is a middleware protocol built on top of Bitcoin, advancing a significant network expansion through
          a crypto economic effort known as restaking.
          <br />
          Critical ecosystem infrastructure like bridges and oracles are secured by restaked BTC. BounceBit integrates a
          transparent CeFi foundation securing BIT via the regulated custody of Mainnet Digital and Ceffu while
          leveraging on-chain asset traceability.
          <br />
          Through an innovative CeFi + DeFi framework, BounceBit empowers BTC holders to earn yield across multiple
          networks. */}
          BounceBit is building a BTC restaking infrastructure that provides a foundational layer for different
          restaking products, secured by the regulated custody of Mainnet Digital and Ceffu. The BounceBit chain,
          designed as a showcase of a restaking product within the BounceBit ecosystem, is a PoS Layer 1 secured by
          validators staking both BTC and BounceBit’s native token — A dual-token system leveraging native Bitcoin’s
          security with full EVM compatibility. Critical ecosystem infrastructure like bridges and oracles are secured
          by restaked BTC. Through an innovative CeFi + DeFi framework, BounceBit empowers BTC holders to earn yield
          across multiple networks.
        </Typography>
      </Box>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        sx={{ gap: isSm ? 16 : 36, [theme.breakpoints.down('sm')]: { mt: 40 } }}
      >
        <Stack sx={{ height: 422, gap: 12 }} alignItems={'center'} justifyContent={'center'}>
          {!isSm && (
            <>
              <Icon1 />
              <Icon2 />
              <Icon1 />
              <Icon2 />
              <Icon1 />
              {/* <Icon3 /> */}
              {/* <Icon4 /> */}
            </>
          )}
          {isSm && (
            <>
              <Icon1Mobile />
              <Icon2Mobile />
              <Icon1Mobile />
              <Icon2Mobile />
              <Icon1Mobile />
              {/* <Icon3Mobile /> */}
              {/* <Icon4Mobile /> */}
            </>
          )}
        </Stack>
        <Stack sx={{ gap: 24, width: '100%' }}>
          <BoxItem icon={<Icon5 />} title="The Water Margin Event" subTitle="Jan 30, 2024" />
          <BoxItem icon={<Icon6 />} title="Testnet" subTitle="March 8, 2024" />
          <BoxItem icon={<Icon7 />} title="Mainnet " subTitle="May, 2024" />
        </Stack>
      </Stack>
    </Box>
  )
}
