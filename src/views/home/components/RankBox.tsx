import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { WithAnimation } from 'components/WithAnimation'
import useBreakpoint from 'hooks/useBreakpoint'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
// import Heart from 'assets/svg/home/heart.svg'
import MdFollowers from 'assets/svg/home/md_followers.svg'
import { useCallback, useMemo } from 'react'
import { useGetClubList } from 'hooks/boxes/useGetClubList'
import { ClubInfoProps } from 'api/home/type'
import Router from 'next/router'
// import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import BigNumber from 'bignumber.js'
import { formatGroupNumber } from 'utils'
import Image from 'components/Image'
import { OrderType } from 'api/boxes/type'
import VerifiedIcon from 'assets/svg/verifyIcon.svg'
import SmVerifiedIcon from 'assets/svg/verifiedIconSm.svg'

interface CusBoxProps {
  isTop: boolean
}
const IconBorder = styled(Box)<CusBoxProps>`
  width: 120px;
  height: 120px;
  border-radius: 28px;
  border: 4px solid var(--ps-text-20);
  overflow: hidden;
  margin-top: ${props => (props.isTop ? '0px' : '23px')};

  ${props => props.theme.breakpoints.down('md')} {
    width: ${props => (props.isTop ? '80px' : '56.254px')};
    height: ${props => (props.isTop ? '80px' : '56.254px')};
    border-radius: ${props => (props.isTop ? '12px' : '8.438px')};
    border: 4px solid var(--ps-text-20);
    overflow: hidden;
  }
`

const RankBoxText = styled(Box)<CusBoxProps>`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 100px;
  background: var(--ps-text-primary-40);
  backdrop-filter: blur(5px);
  color: var(--ps-text-100);
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;

  ${props => props.theme.breakpoints.down('md')} {
    width: ${props => (props.isTop ? '30px' : '21.095px')};
    height: ${props => (props.isTop ? '30px' : '21.095px')};
    font-size: ${props => (props.isTop ? '-15px' : '-10.548px')};
    bottom: ${props => (props.isTop ? '-15px' : '-10.548px')};
    font-size: ${props => (props.isTop ? '15px' : '10.548px')};
  }
`

const ItemBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  width: 100%;
  border-radius: 12px;
  background: var(--ps-neutral);
  color: var(--ps-text-100);
  transform: scale(1);

  ${props => props.theme.breakpoints.down('md')} {
    padding: 8px 12px;
  }

  &:hover {
    transform: scale(1.005);
    cursor: pointer;
    background: var(--ps-text-10);
  }
`

const ItemIconBorder = styled(Box)`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  overflow: hidden;
  margin-left: 40px;

  ${props => props.theme.breakpoints.down('md')} {
    width: 32px;
    height: 32px;
    margin-left: 8px;
  }
`

const Top3Item = ({ rankData, rank }: { rankData: ClubInfoProps | undefined; rank: number }) => {
  // const router = useRouter()
  const isMd = useBreakpoint('md')
  const isTop = useMemo(() => rank === 1, [rank])

  // const LinkTo = useCallback(() => {
  //   router.push(ROUTES.club.cusBox('111111'))
  // }, [router])

  return (
    <Box
      // onClick={LinkTo}
      maxWidth={200}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={8}
      sx={{
        cursor: !rankData ? 'unset' : 'pointer'
      }}
      onClick={() => rankData?.boxId && Router.push(ROUTES.club.cusBox(rankData?.boxId))}
    >
      <Box position={'relative'}>
        <IconBorder isTop={isTop}>
          {!rankData?.avatar && !rankData?.rank ? (
            <Box
              width={isMd ? (isTop ? 72 : 48) : 112}
              height={isMd ? (isTop ? 72 : 48) : 112}
              sx={{
                backgroundColor: 'var(--ps-neutral2)'
              }}
            />
          ) : (
            <Image
              width={isMd ? (isTop ? 72 : 48) : 112}
              height={isMd ? (isTop ? 72 : 48) : 112}
              src={rankData?.avatar || DefaultAvatar.src}
              alt=""
            />
          )}
        </IconBorder>
        {rankData?.verified && !isMd && (
          <VerifiedIcon width={24} style={{ position: 'absolute', bottom: 0, left: 100 }} />
        )}
        {rankData?.verified && isMd && (
          <SmVerifiedIcon
            width={17}
            style={{ position: 'absolute', bottom: 'calc(50% - 43px)', left: isTop ? 68 : 48 }}
          />
        )}
        <RankBoxText isTop={isTop}>{!!rankData?.rank ? rankData?.rank : rank === 0 ? 2 : isTop ? 1 : 3}</RankBoxText>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={isMd ? 4 : 8}
        mt={isMd ? (isTop ? 26 : 18) : 28}
      >
        <Typography
          color="var(--ps-text-100)"
          fontSize={isMd ? (isTop ? 13 : 9.141) : 15}
          fontWeight={500}
          lineHeight={'100%'}
          sx={{
            maxWidth: isMd ? 101 : 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {rankData?.projectName || '--'}
        </Typography>
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={8}>
          {/* <Heart /> */}
          <Typography
            color="var(--ps-text-100)"
            fontSize={isMd ? (isTop ? 15 : 10.548) : 20}
            fontWeight={500}
            textAlign={'center'}
          >{`${
            rankData?.volume ? formatGroupNumber(new BigNumber(rankData.volume).toNumber(), '', 2) : 0
          } Volume`}</Typography>
        </Box>
        <Typography color="var(--ps-neutral3)" fontSize={isMd ? (isTop ? 12 : 8.438) : 13} lineHeight={'140%'}>{`${
          rankData?.followCount === undefined ? '--' : rankData?.followCount
        } followers`}</Typography>
      </Box>
    </Box>
  )
}

const Top3Items = ({ rankDatas }: { rankDatas: ClubInfoProps[] | undefined }) => {
  const isMd = useBreakpoint('md')

  const Top3 = useMemo(() => {
    if (!!rankDatas?.length) {
      if (rankDatas.length <= 1) return [undefined, ...rankDatas, undefined]
      if (rankDatas.length === 2) return [rankDatas[1], rankDatas[0], undefined]
      return [rankDatas[1], rankDatas[0], rankDatas[2]]
    }
    return [undefined, undefined, undefined]
  }, [rankDatas])

  return (
    <Box
      width={'100%'}
      display={'grid'}
      gap={isMd ? 12 : 73}
      sx={{
        gridTemplateColumns: '1fr 1fr 1fr'
      }}
    >
      {Top3?.map((item, index) => {
        return (
          <Box key={index.toString()} order={index === 1 ? index : index + 1}>
            <Top3Item rankData={item} rank={index} />
          </Box>
        )
      })}
    </Box>
  )
}

const Items = ({ rankDatas }: { rankDatas: ClubInfoProps[] }) => {
  const isMd = useBreakpoint('md')

  const LinkTo = useCallback(() => {
    // router.push(ROUTES.club.cusBox('111111'))
  }, [])

  const otherRanks = useMemo(() => {
    const arr = [...rankDatas].splice(3, 14)
    return arr
  }, [rankDatas])

  return (
    <Box onClick={LinkTo} width={'100%'} display={'flex'} flexDirection={'column'} mt={48} mb={13} gap={13}>
      {otherRanks.map((item, index) => {
        const ItemComponent = ItemBox

        return (
          <ItemComponent key={item.rank} onClick={() => Router.push(ROUTES.club.cusBox(item.boxId))}>
            <Box display="flex" flexDirection={'row'} gap={isMd ? 8 : 20} alignItems={'center'}>
              <Typography
                width={'24px'}
                color={'var(--ps-neutral3)'}
                fontSize={isMd ? 15 : 20}
                fontWeight={500}
                lineHeight={'130%'}
              >
                {index + 4}
              </Typography>
              <ItemIconBorder>
                <Image src={item.avatar || DefaultAvatar.src} width={isMd ? 32 : 60} height={isMd ? 32 : 60} alt="" />
                {item?.verified && !isMd && (
                  <VerifiedIcon width={24} style={{ position: 'absolute', bottom: 12, left: 148 }} />
                )}
                {item?.verified && isMd && (
                  <SmVerifiedIcon style={{ position: 'absolute', bottom: 'calc(50% - 17px)', left: 75 }} />
                )}
              </ItemIconBorder>
              <Stack>
                <Typography
                  noWrap
                  color={'var(--ps-text-100)'}
                  fontSize={isMd ? 15 : 20}
                  fontWeight={500}
                  lineHeight={'130%'}
                  width={isMd ? 150 : 600}
                >
                  {item.projectName || '--'}
                </Typography>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2}>
                  {isMd && <MdFollowers />}
                  <Typography
                    fontSize={isMd ? 12 : 15}
                    fontWeight={400}
                    lineHeight={'140%'}
                    color={'var(--ps-neutral3)'}
                  >
                    {`${item.followCount || 0} followers`}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box display="flex" flexDirection={'row'} gap={20} alignItems={'center'}>
              <Typography
                fontSize={isMd ? 15 : 20}
                fontWeight={500}
                lineHeight={'130%'}
                color={'var(--ps-text-100)'}
                textAlign={'center'}
              >{`${
                item.volume ? formatGroupNumber(new BigNumber(item.volume).toNumber(), '', 2) : 0
              } Volume`}</Typography>
            </Box>
          </ItemComponent>
        )
      })}
    </Box>
  )
}

export default function RankBox({ whithoutAnimation = false }: { whithoutAnimation?: boolean }) {
  const isMd = useBreakpoint('md')
  const { data: RankRes } = useGetClubList({ orderByColumn: OrderType.RANKS, isAsc: 'asc', pageNum: 1, pageSize: 10 })

  const RankList = useMemo(() => {
    if (!!RankRes?.length) {
      return RankRes
    }
    return []
  }, [RankRes])

  if (whithoutAnimation) {
    return (
      <Stack
        alignItems={'center'}
        sx={{
          width: '100%',
          maxWidth: isMd ? '100vw' : '1200px',
          margin: isMd ? '70px auto 100px' : '100px auto 0px'
        }}
      >
        {isMd ? (
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{
              width: '100%',
              padding: '0 20px',
              margin: '0 auto 40px'
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 36,
                lineHeight: '100%',
                color: 'var(--ps-text-100)',
                margin: '0 auto'
              }}
            >
              Club Ranking
            </Typography>
          </Stack>
        ) : (
          <Box>
            <Typography
              fontSize={64}
              fontWeight={500}
              lineHeight={'100%'}
              color={'var(--ps-text-100)'}
              sx={{
                fontWeight: 500
              }}
              mb={60}
            >
              Club Ranking
            </Typography>
          </Box>
        )}
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} px={isMd ? 20 : 0}>
          <Box style={{ width: isMd ? '100%' : undefined }}>
            <Top3Items rankDatas={RankList} />
          </Box>
          {
            !!RankList?.length && RankList?.length > 3 ? (
              <Box width={'100%'}>
                <Items rankDatas={RankList} />
              </Box>
            ) : null
            // <Typography
            //   sx={{
            //     mt: { xs: 30, md: 60 },
            //     color: 'var(--ps-text-60)',
            //     fontSize: { xs: 20, md: 28 },
            //     fontWeight: 500,
            //     lineHeight: 1.4
            //   }}
            // >
            //   No Data
            // </Typography>
          }
        </Box>
        <Box>
          <Box mt={30}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                Router.push('/clubs')
              }}
            >
              Explore more
            </Button>
          </Box>
        </Box>
      </Stack>
    )
  }
  return (
    <Stack
      alignItems={'center'}
      sx={{
        width: '100%',
        maxWidth: isMd ? '100vw' : '1200px',
        margin: isMd ? '70px auto 100px' : '100px auto 0px'
      }}
    >
      {isMd ? (
        <WithAnimation
          Component={Stack}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{
            width: '100%',
            padding: '0 20px',
            margin: '0 auto 40px'
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 36,
              lineHeight: '100%',
              color: 'var(--ps-text-100)',
              margin: '0 auto'
            }}
          >
            Club Ranking
          </Typography>
        </WithAnimation>
      ) : (
        <WithAnimation>
          <Typography
            fontSize={64}
            fontWeight={500}
            lineHeight={'100%'}
            color={'var(--ps-text-100)'}
            sx={{
              fontWeight: 500
            }}
            mb={60}
          >
            Club Ranking
          </Typography>
        </WithAnimation>
      )}
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} px={isMd ? 20 : 0}>
        <WithAnimation style={{ width: isMd ? '100%' : undefined }}>
          <Top3Items rankDatas={RankList} />
        </WithAnimation>
        {
          !!RankList?.length && RankList.length > 3 ? (
            <Box width={'100%'}>
              <WithAnimation>
                <Items rankDatas={RankList} />
              </WithAnimation>
            </Box>
          ) : null
          // <Typography
          //   sx={{
          //     mt: { xs: 30, md: 60 },
          //     color: 'var(--ps-text-60)',
          //     fontSize: { xs: 20, md: 28 },
          //     fontWeight: 500,
          //     lineHeight: 1.4
          //   }}
          // >
          //   No Data
          // </Typography>
        }
      </Box>

      <WithAnimation>
        <Box mt={30}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              Router.push('/clubs')
            }}
          >
            Explore more
          </Button>
        </Box>
      </WithAnimation>
    </Stack>
  )
}
