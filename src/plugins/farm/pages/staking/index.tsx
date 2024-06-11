import { Box, Stack, Typography } from '@mui/material'
import StakeList from './stakeList'
import StakePanel from './stakePanel'
import { useEffect, useState } from 'react'
import { useFetchPluginTokenList } from 'hooks/boxes/useGetClubPlugin'
import useBreakpoint from 'hooks/useBreakpoint'

const Stake = ({ boxContactAddr }: { boxContactAddr: string }) => {
  const isMd = useBreakpoint('md')
  const { data } = useFetchPluginTokenList({
    params: {
      pageSize: 100,
      pageNum: 0
    }
  })
  const [logo, setLogo] = useState<string | undefined>()
  const [tokenAddress, setTokenAddress] = useState<string | undefined>()
  const AppIntoView = () => {
    const section = document.getElementById('stakePanel')
    if (section) {
      const offsetTop = section.offsetTop
      window.scrollTo({ top: offsetTop - 100, behavior: 'smooth' })
    }
  }
  useEffect(() => {
    if (tokenAddress === undefined && data && data?.[0].contractAddress) {
      setTokenAddress(data?.[0].contractAddress)
    }
  }, [data, tokenAddress])

  if (isMd) {
    return (
      <Box
        sx={{
          width: '100%',
          borderRadius: 12,
          background: 'var(--ps-neutral2)',
          padding: '24px 16px'
        }}
      >
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography fontSize={15} fontWeight={'500'} lineHeight={1.4}>
            LEADERBOARD
          </Typography>

          {/* <Button variant="outlined" sx={{ height: 44, marginRight: 16 }}>
        Delete App Page
      </Button> */}
        </Stack>
        <Stack flexDirection={{ xs: 'column', md: 'row' }} mt={40} sx={{ gap: 40, alignItems: { xs: 'center' } }}>
          <StakeList
            setTokenAddress={setTokenAddress}
            data={data}
            setLogo={setLogo}
            handleStakeCallback={AppIntoView}
          />
          <Box id="stakePanel">
            <StakePanel
              boxContactAddr={boxContactAddr}
              tokenAddress={tokenAddress}
              setTokenAddress={setTokenAddress}
              logo={logo}
              setLogo={setLogo}
            />
          </Box>
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 12,
        background: 'var(--ps-neutral2)',
        padding: '32px 40px'
      }}
    >
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.4
          }}
        >
          BITSTAKING
        </Typography>

        {/* <Button variant="outlined" sx={{ height: 44, marginRight: 16 }}>
          Delete App Page
        </Button> */}
      </Stack>
      <Stack flexDirection={{ xs: 'column', md: 'row' }} mt={40} sx={{ gap: 40 }}>
        <StakeList setTokenAddress={setTokenAddress} data={data} setLogo={setLogo} handleStakeCallback={AppIntoView} />
        <Box id="stakePanel">
          <StakePanel
            boxContactAddr={boxContactAddr}
            tokenAddress={tokenAddress}
            setTokenAddress={setTokenAddress}
            logo={logo}
            setLogo={setLogo}
          />
        </Box>
      </Stack>
    </Box>
  )
}
export default Stake
