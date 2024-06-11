import { Box, Stack, styled, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useGetBoxInfo } from 'hooks/boxes/useGetBoxInfo'
import useBreakpoint from 'hooks/useBreakpoint'
import { AuctionCategory } from 'plugins/auction/pages/erc20-create-pool/type'
import { parseBanner } from 'plugins/auction/utils'
import { useMemo } from 'react'
import { formatGroupNumber } from 'utils'
import Image from 'next/image'
import TeslaIcon from 'assets/svg/boxes/tesla.svg'
import PoolStatusBox from '../PoolStatus'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { IAuctionDetail } from 'plugins/auction/api/type'
import { PoolStatus } from 'api/type'
import { Currency, CurrencyAmount } from 'constants/token'
import Link from 'next/link'
import LinkIcon from 'components/LinkIcon'
const Title = styled(Typography)`
  color: var(--ps-text-100, #fff);
  ${({ theme }) => (theme.breakpoints.down('md') ? `font-size:28px;` : `font-size: 44px;`)}

  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  letter-spacing: -0.88px;
`
const StyledTeslaIcon = styled(TeslaIcon)`
  cursor: pointer;
  & g {
    stroke: ${({ theme }) => theme.palette.text.primary};
  }
`
const TypeRound = styled(Box)`
  height: fit-content;
  padding: 4px 14px;
  border-radius: 100px;
  background: var(--black-60, rgba(18, 18, 18, 0.6));
  backdrop-filter: blur(5px);
  color: var(--yellow-d, var(--yellow-d, #a4d220));
  text-align: center;

  /* D/H6 */
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 21px */
  letter-spacing: -0.28px;
`
const ColumnLine = <Box sx={{ width: '1px', height: 32, backgroundColor: 'rgba(255, 255, 255, 0.60)' }} />
interface IProps {
  poolStatus: PoolStatus | undefined
  claimAt: number | undefined
  closeAt: number | undefined
  openAt: number | undefined
  tokenCurrency: Currency | undefined
  auction: IAuctionDetail | undefined
  swapRatio: CurrencyAmount | undefined
  token0Amount: CurrencyAmount | undefined
  token1Currency: Currency | undefined
}
export default function Page({
  auction,
  claimAt,
  closeAt,
  openAt,
  poolStatus,
  tokenCurrency,
  swapRatio,
  token0Amount,
  token1Currency
}: IProps) {
  const { MobileBannerUrl, PCbannerUrl } = useMemo(() => parseBanner(auction?.banner || ''), [auction?.banner])
  const isMd = useBreakpoint('md')
  const { data: _data } = useGetBoxInfo(`${auction?.sourceBoxId || auction?.boxId}`)
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          height: { xs: 500, md: 600 },
          margin: '0 auto',
          background: { xs: `url(${MobileBannerUrl}) center no-repeat`, md: `url(${PCbannerUrl}) center no-repeat` },
          backgroundPosition: 'center',
          borderRadius: 20,
          padding: '42px 40px 80px 40px',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            maxHeight: { xs: 500, md: 600 },
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '20px',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        <Box
          sx={{
            padding: { xs: 20, md: '42px 40px 80px 40px' },
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <Title>{auction?.name}</Title>
          <Stack
            justifyContent={'space-between'}
            sx={{ flexDirection: { xs: 'column-reverse', md: 'row' }, mt: { xs: 40, md: 0 } }}
          >
            <Stack flexDirection={'row'} alignItems={'center'} sx={{ gap: 20, mt: { xs: 20, md: 40 } }}>
              <Box>
                {_data?.boxBasicInfo.avatar ? (
                  <Image
                    src={_data.boxBasicInfo.avatar}
                    style={{ borderRadius: 100 }}
                    width={isMd ? 40 : 72}
                    height={isMd ? 40 : 72}
                    alt=""
                  ></Image>
                ) : (
                  <StyledTeslaIcon />
                )}
              </Box>

              <Stack gap={isMd ? 6 : 16} width={isMd ? '80%' : 'auto'}>
                <Stack direction={'row'} alignItems={'center'} gap={isMd ? 10 : 20}>
                  <Typography
                    sx={{
                      maxWidth: isMd ? '50%' : 300,
                      fontSize: isMd ? 20 : 28,
                      color: 'var(--ps-text-100)',
                      fontWeight: 500,
                      lineHeight: '39.2px',
                      whiteSpace: 'nowrap',
                      overflow: 'Hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {_data?.boxBasicInfo.projectName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: isMd ? 20 : 28,
                      color: 'var(--ps-text-100)',
                      fontWeight: 500,
                      lineHeight: '39.2px'
                    }}
                  >
                    #{_data?.rewardId}
                  </Typography>
                </Stack>
                <Stack direction={'row'} gap={20}>
                  <Box
                    sx={{
                      padding: '3px 8px',
                      borderRadius: 100,
                      background: 'var(--ps-neutral2)',
                      color: 'var(--ps-text-100)',
                      fontSize: 12,
                      fontStyle: 'normal',
                      fontSeight: 400,
                      lineHeight: '16.8px',
                      textAlign: 'center'
                    }}
                  >
                    Rank {_data?.anotherInfo.rank ? _data.anotherInfo.rank : '--'}
                  </Box>
                  <Typography fontSize={16} color={'#E6E6CE'}>
                    {_data?.anotherInfo.tvl
                      ? formatGroupNumber(new BigNumber(_data.anotherInfo.tvl).toNumber(), '', 2)
                      : '0'}{' '}
                    TVL
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack alignItems={'end'} flexDirection={'row'} sx={{ gap: 12 }}>
              <PoolStatusBox
                style={{ height: '29px' }}
                status={poolStatus}
                claimAt={claimAt || 0}
                openTime={openAt || 0}
                closeTime={closeAt || 0}
              />
              <TypeRound>{AuctionCategory[auction?.category || AuctionCategory['Fixed Price Auction']]}</TypeRound>
            </Stack>
          </Stack>
          <Stack alignItems={'center'} sx={{ gap: 16, width: 'fit-content', margin: '0 auto', pt: { xs: 0, md: 50 } }}>
            <CurrencyLogo currencyOrAddress={tokenCurrency?.address || ''} size={'60px'} />
            <Typography
              sx={{
                color: '#FFF',
                // fontFamily: 'Public Sans',
                fontSize: { xs: 22, md: 44 },
                fontWeight: 700,
                lineHeight: '130%',
                letterSpacing: '-0.88px'
              }}
            >
              {tokenCurrency?.symbol?.toLocaleUpperCase() || '--'}
            </Typography>
          </Stack>

          <Stack mt={32} gap={16} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
            {_data?.boxBasicInfo.links.map((item, index) => {
              if (!item.url) return null
              return (
                <Link key={item.typeName + index} href={item.url} target="_blank">
                  <Stack
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'var(--ps-text-10)',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    <LinkIcon
                      type={item.typeName}
                      color={_data.boxBasicInfo.textColor ? _data.boxBasicInfo.textColor : '0D0D0D'}
                      isMd={isMd}
                    />
                  </Stack>
                </Link>
              )
            })}
          </Stack>

          <Stack
            mt={16}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ gap: { xs: 10, md: 24 } }}
          >
            <Box>
              <Typography sx={{ color: '#D7D6D9', fontSize: 14 }}>Token Name</Typography>
              <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>
                ${tokenCurrency?.symbol?.toUpperCase() || '--'}
              </Typography>
            </Box>
            {ColumnLine}
            <Box>
              <Typography sx={{ color: '#D7D6D9', fontSize: 14 }}>Token Price</Typography>
              <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>
                {swapRatio?.toSignificant() || '--'} {token1Currency?.symbol?.toUpperCase() || '--'}
              </Typography>
            </Box>
            {ColumnLine}
            <Box>
              <Typography sx={{ color: '#D7D6D9', fontSize: 14 }}>Token Amount</Typography>
              <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>
                {token0Amount?.toSignificant() || '--'}
              </Typography>
            </Box>
            {/* {ColumnLine}
            <Box>
              <Typography sx={{ color: '#D7D6D9', fontSize: 14 }}>Token Price</Typography>
              <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 600, fontFamily: 'Public Sans' }}>
                $ {tokenCurrency?.symbol?.toUpperCase()}
              </Typography>
            </Box> */}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
