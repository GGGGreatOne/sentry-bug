import { Box, Stack, SxProps, Theme, Typography, styled } from '@mui/material'
import PieChart from 'components/CreatChart/PieCharts'
import { IBoxAboutSectionTypeTokenomicColor, TokenomicType } from 'state/boxes/type'
import BarCharts from 'components/CreatChart/BarCharts'
import LeftLineSvg from 'assets/svg/boxes/leftLine.svg'
import RightLineSvg from 'assets/svg/boxes/rightLine.svg'
import { useUpdateThemeMode } from 'state/application/hooks'
import { IBoxAboutSectionTypeTokenomicValue } from 'state/boxes/type'
import { useToken } from 'hooks/useToken'
import { Currency } from 'constants/token'
import { formatGroupNumber, shortenAddress } from 'utils'
import CopyIcon from 'assets/svg/boxes/copy.svg'
import ShareIcon from 'assets/svg/boxes/share.svg'
import { getEtherscanLink } from 'utils/getEtherscanLink'
import useBreakpoint from 'hooks/useBreakpoint'
import { PieChartsProps } from 'components/CreatChart'
import { useEffect, useState } from 'react'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Copy from 'components/essential/Copy'

const StyledLeftLineSvg = styled(LeftLineSvg)(({}) => ({
  cursor: 'pointer',
  position: 'absolute',
  bottom: 0,
  left: 0,
  transform: 'translateX(-66%)',
  '& path': {
    stroke: 'var(--ps-text-40)'
  }
}))
const StyledRightLineSvg = styled(RightLineSvg)(({}) => ({
  cursor: 'pointer',
  position: 'absolute',
  bottom: 0,
  right: 0,
  transform: 'translateX(67%)',
  '& path': {
    stroke: 'var(--ps-text-40)'
  }
}))

const StyledCopyIcon = styled(CopyIcon)(({}) => ({
  cursor: 'pointer',
  '& path': {
    fill: 'var(--ps-text-60)'
  }
}))
const StyledShareIcon = styled(ShareIcon)(({}) => ({
  cursor: 'pointer',
  '& path': {
    fill: 'var(--ps-text-60)'
  }
}))

const Legend = ({
  item,
  color,
  isMd,
  flexDirection = 'column',
  alignItems = 'flex-start',
  sx,
  textWidth = 185
}: {
  item: PieChartsProps
  color: string
  isMd?: boolean
  flexDirection?: string
  alignItems?: string
  sx?: SxProps<Theme>
  textWidth?: string | number
}) => {
  return (
    <Stack gap={isMd ? 8 : 16} flexDirection={'row'} alignItems={'flex-start'} sx={sx}>
      <Box
        sx={{
          background: color,
          width: 9,
          height: 9,
          borderRadius: '50%',
          marginTop: 4
        }}
      ></Box>
      <Stack
        gap={10}
        width={isMd ? '89%' : textWidth}
        sx={{ flexDirection: flexDirection, alignItems: alignItems, justifyContent: 'space-between' }}
      >
        <Typography
          variant="body1"
          sx={{
            maxHeight: isMd ? 72 : 36,
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '18.2px',
            fontSize: isMd ? 13 : 13,
            color: 'var(--ps-text-60)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontStyle: 'normal',
            fontSize: isMd ? 15 : 20,
            fontWeight: 500,
            lineHeight: '22.4px',
            color: 'var(--ps-text-100)'
          }}
        >
          {item.percent}
        </Typography>
      </Stack>
    </Stack>
  )
}

const TokenBox = ({ token, isMd }: { token: Currency; isMd: boolean }) => {
  return (
    <Stack
      gap={isMd ? 10 : 0}
      flexDirection={isMd ? 'column' : 'row'}
      alignItems={isMd ? 'flex-start' : 'center'}
      justifyContent={'space-between'}
      sx={{
        background: 'var(--ps-text-10)',
        padding: isMd ? '16px 24px' : 24,
        borderRadius: 12,
        marginBottom: isMd ? 15 : 30
      }}
    >
      <Stack gap={10} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
        <CurrencyLogo currencyOrAddress={token} size={'30px'}></CurrencyLogo>
        <Typography
          variant={isMd ? 'h5' : 'h4'}
          sx={{
            fontWeight: 400,
            lineHeight: isMd ? '21px' : '22.4px',
            color: 'var(--ps-text-100)'
          }}
        >
          {token?.name}
        </Typography>
        <Typography
          variant={isMd ? 'body2' : 'h5'}
          sx={{
            fontWeight: 400,
            lineHeight: isMd ? '13px' : '18.2px',
            color: 'var(--ps-text-60)'
          }}
        >
          {token?.symbol}
        </Typography>
      </Stack>
      <Stack
        gap={3}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          borderRadius: 8,
          background: 'var(--ps-neutral2)',
          padding: '8px 10px'
        }}
      >
        <Typography
          variant={isMd ? 'caption' : 'h5'}
          sx={{
            fontWeight: 400,
            lineHeight: isMd ? '16.8px' : '18.2px',
            color: 'var(--ps-text-60)'
          }}
        >
          {shortenAddress(token.address)}
        </Typography>
        <Copy
          toCopy={token.address}
          margin="0"
          svgColor="var(--ps-text-60)"
          CopySvg={<StyledCopyIcon />}
          svgWidth={20}
          height="max-content"
        />
        <StyledShareIcon
          onClick={() => window.open(getEtherscanLink(token.chainId, token.address, 'token'), '_blank')}
        />
      </Stack>
    </Stack>
  )
}

const PieBox = ({ shares, totalSupply }: { shares: PieChartsProps[]; totalSupply: string }) => {
  const min = Math.ceil(shares.length / 2)
  const max = shares.length
  const isMd = useBreakpoint('md')
  const { mode } = useUpdateThemeMode()
  return (
    <>
      {isMd ? (
        <Stack flexDirection={'column'} alignItems={'center'}>
          <PieChart
            width={216}
            height={216}
            total={Number(totalSupply)}
            data={shares}
            textColor={mode === 'light' ? 'rgba(13, 13, 13, 0.60)' : 'rgba(255, 255, 255, 0.60)'}
            subtextColor={mode === 'light' ? '#1B1B1B' : '#FFFFFF'}
            colorList={IBoxAboutSectionTypeTokenomicColor}
          />
          <Stack width={'100%'} gap={8} flexDirection={'row'} flexWrap={'wrap'} marginTop={15}>
            {shares.map((item, index) => {
              return (
                <Box key={index} width={'48%'}>
                  <Legend item={item} color={IBoxAboutSectionTypeTokenomicColor[index]} isMd={isMd} />
                </Box>
              )
            })}
          </Stack>
        </Stack>
      ) : (
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          sx={{ position: 'relative', height: 356, padding: '25px 38px 12px 10px' }}
        >
          <Stack gap={12}>
            {shares.slice(min, max).map((item, index) => {
              return (
                <Legend key={index} item={item} color={IBoxAboutSectionTypeTokenomicColor[index + min]} isMd={isMd} />
              )
            })}
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '48.6%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <StyledLeftLineSvg />
            <PieChart
              width={361}
              height={361}
              total={Number(totalSupply)}
              data={shares}
              textColor={mode === 'light' ? 'rgba(13, 13, 13, 0.60)' : 'rgba(255, 255, 255, 0.60)'}
              subtextColor={mode === 'light' ? '#1B1B1B' : '#FFFFFF'}
              colorList={IBoxAboutSectionTypeTokenomicColor}
            />
            <StyledRightLineSvg />
          </Box>
          <Stack gap={12}>
            {shares.slice(0, min).map((item, index) => {
              return <Legend key={index} item={item} color={IBoxAboutSectionTypeTokenomicColor[index]} isMd={isMd} />
            })}
          </Stack>
        </Stack>
      )}
    </>
  )
}

const BarBox = ({ shares, totalSupply }: { shares: PieChartsProps[]; totalSupply: string }) => {
  const isMd = useBreakpoint('md')
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }
  useEffect(() => {
    if (isMd) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return
  }, [isMd])
  return (
    <Stack flexDirection={isMd ? 'column' : 'row'} justifyContent={'space-between'} padding={isMd ? 0 : '0 24px'}>
      <Box>
        <Typography
          sx={{
            fontSize: isMd ? 13 : 15,
            fontWeight: 500,
            lineHeight: isMd ? '13px' : '15px'
          }}
        >
          Total Supply
        </Typography>
        <Typography
          sx={{
            fontSize: isMd ? 30 : 56,
            fontWeight: 500,
            lineHeight: isMd ? '30px' : '78.4px',
            marginBottom: 20,
            marginTop: isMd ? 16 : 0
          }}
        >
          {formatGroupNumber(Number(totalSupply))}
        </Typography>
        <BarCharts
          width={isMd ? screenWidth - 72 : 500}
          height={shares.length * 40}
          total={Number(totalSupply)}
          data={shares}
          colorList={IBoxAboutSectionTypeTokenomicColor}
        />
      </Box>
      {isMd ? (
        <Stack width={'100%'} gap={8} flexDirection={'row'} flexWrap={'wrap'} marginTop={15}>
          {shares.map((item, index) => {
            return (
              <Box key={index} width={'48%'}>
                <Legend item={item} color={IBoxAboutSectionTypeTokenomicColor[index]} isMd={isMd} />
              </Box>
            )
          })}
        </Stack>
      ) : (
        <Stack gap={20} flexDirection={'column'}>
          {shares.map((item, index) => {
            return (
              <Legend
                key={index}
                item={item}
                color={IBoxAboutSectionTypeTokenomicColor[index]}
                flexDirection="row"
                alignItems="center"
                textWidth={220}
                sx={{
                  paddingBottom: 12,
                  borderBottom: shares.length !== index + 1 ? '1px solid var(--ps-text-20)' : 'none'
                }}
              />
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}

const Tokenomic = ({ data }: { data: IBoxAboutSectionTypeTokenomicValue }) => {
  const isMd = useBreakpoint('md')
  const token = useToken(data.tokenAdress)

  // const token = useToken('0x0000000000000000000000000000000000000000')
  const shares: PieChartsProps[] = data.shares.map(item => {
    return {
      name: item.purpose,
      value: (Number(data.totalSupply) * Number(item.percentage)) / 100,
      percent: item.percentage + '%'
    }
  })
  return (
    <Box>
      {token && <TokenBox token={token} isMd={isMd} />}
      {data.style === TokenomicType.PIE && <PieBox shares={shares} totalSupply={data.totalSupply} />}
      {data.style === TokenomicType.BAR && <BarBox shares={shares} totalSupply={data.totalSupply} />}
    </Box>
  )
}

export default Tokenomic
