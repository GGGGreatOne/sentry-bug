import { Box, Stack, Typography } from '@mui/material'
import RankingSvg from 'assets/svg/boxes/ranking_icon.svg'
import MobileRankingSvg from 'assets/svg/boxes/mobile/ranking_icon.svg'
import Image from 'components/Image'
import DefaultAvatar from 'assets/images/account/default_followings_item.png'
import { useGetClubRanks } from 'hooks/boxes/useGetClubRanks'
import useBreakpoint from 'hooks/useBreakpoint'
import LoadingAnimation from 'components/Loading'
import { WithAnimation } from 'components/WithAnimation'
import { ClubRanksListParams } from 'api/boxes/type'
import EmptyData from 'components/EmptyData'

const Page = ({ boxId }: { boxId: string | number | undefined }) => {
  const isMd = useBreakpoint('md')
  const params: ClubRanksListParams = {
    clubId: boxId,
    params: {
      pageNum: 1,
      pageSize: 20
    }
  }
  const { data: ClubRanks, loading } = useGetClubRanks(params)
  console.log('🚀 ~ Page ~ ClubRanks:', ClubRanks)
  if (loading)
    return (
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          width: 220,
          height: 220,
          margin: '0 auto'
        }}
      >
        <LoadingAnimation />
      </Box>
    )
  if (isMd) {
    return (
      <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <Box
          sx={{
            width: '100%',
            borderRadius: 12,
            background: 'var(--ps-neutral2)',
            padding: '24px 16px'
          }}
        >
          <Stack spacing={16}>
            <Typography fontSize={15} fontWeight={'500'} lineHeight={1.4}>
              LEADERBOARD
            </Typography>

            <Box
              sx={{
                borderRadius: '16px',
                display: 'flex',
                width: '100%',
                height: '85px',
                backgroundColor: 'var(--ps-text-10)',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 0'
              }}
            >
              <Stack direction={'row'} spacing={29} alignItems={'center'}>
                <MobileRankingSvg />
                <Typography fontSize={15} fontWeight={'500'} lineHeight={1.4}>
                  Your Rank
                </Typography>
                <Typography fontSize={15} fontWeight={'500'} lineHeight={1.4}>
                  {ClubRanks?.rank || 0}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
              <Typography fontSize={'13px'} fontWeight={'500'} lineHeight={'18px'}>
                Rank
              </Typography>
              <Typography fontSize={'13px'} fontWeight={'500'} lineHeight={'18px'}>
                User
              </Typography>
            </Box>

            {!!ClubRanks?.list.length ? (
              <Box width={'100%'}>
                {ClubRanks?.list?.map((v, index) => (
                  <Item
                    key={v.userId + index.toString()}
                    avatarUrl={v.avatar || DefaultAvatar.src}
                    name={v.userName || 'userName'}
                    index={index + 1}
                    bg={index % 2 === 0}
                  />
                ))}
              </Box>
            ) : (
              <EmptyData color="var(--ps-text-60)" height={100} />
            )}
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      <Box
        sx={{
          width: '100%',
          borderRadius: 12,
          background: 'var(--ps-neutral2)',
          padding: '32px 40px'
        }}
      >
        <Stack spacing={40}>
          <Typography variant="h3">LEADERBOARD</Typography>
          <Stack spacing={48}>
            <WithAnimation>
              <Box
                sx={{
                  borderRadius: '24px',
                  display: 'flex',
                  width: '100%',
                  height: '100px',
                  backgroundColor: 'var(--ps-text-10)',
                  alignItems: 'center',
                  padding: '16px 24px 16px 0'
                }}
              >
                <Box display={'flex'} alignItems={'center'} gap={'20px'}>
                  <RankingSvg
                    style={{
                      position: 'relative',
                      left: -3
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Typography fontSize={'20px'} fontWeight={'500'} lineHeight={'26px'}>
                      Your Rank
                    </Typography>
                    <Typography fontSize={'28px'} fontWeight={'500'} lineHeight={'40px'}>
                      {ClubRanks?.rank || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </WithAnimation>

            <Stack spacing={24}>
              <WithAnimation rootMargin="0px 0% -12% 0%">
                <Box sx={{ display: 'flex', gap: 48, pl: 16 }}>
                  <Typography fontSize={'13px'} fontWeight={'500'} lineHeight={'18px'}>
                    Rank
                  </Typography>
                  <Typography fontSize={'13px'} fontWeight={'500'} lineHeight={'18px'}>
                    User
                  </Typography>
                </Box>
              </WithAnimation>

              {!!ClubRanks?.list.length ? (
                <Box width={'100%'}>
                  {ClubRanks?.list?.map((v, index) => (
                    <WithAnimation key={v.userId + index.toString()} rootMargin="0px 0% -12% 0%">
                      <Item
                        avatarUrl={v.avatar || DefaultAvatar.src}
                        name={v.userName || 'userName'}
                        index={index + 1}
                        bg={index % 2 === 0}
                      />
                    </WithAnimation>
                  ))}
                </Box>
              ) : (
                <EmptyData color="var(--ps-text-60)" height={100} />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

const Item = ({ avatarUrl, name, index, bg }: { avatarUrl: string; name: string; index: number; bg?: boolean }) => {
  const isMd = useBreakpoint('md')

  if (isMd) {
    return (
      <Stack
        direction={'row'}
        width={'100%'}
        height={'64px'}
        sx={{
          backgroundColor: bg ? 'var(--ps-text-10)' : 'transparent',
          borderRadius: '16px',
          padding: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Stack
          direction={'row'}
          spacing={8}
          sx={{
            alignItems: 'center'
          }}
        >
          <Typography width={32} textAlign={'center'}>
            {index}
          </Typography>
          <Image src={avatarUrl} width={32} height={32} alt="png" style={{ borderRadius: '50%' }} />
        </Stack>

        <Typography fontSize={'15px'} fontWeight={'500'} maxWidth={100} noWrap>
          {name || 'userName'}
        </Typography>
      </Stack>
    )
  }
  return (
    <Stack
      direction={'row'}
      spacing={48}
      width={'100%'}
      height={{ xs: '64px', md: '76px' }}
      sx={{
        backgroundColor: bg ? 'var(--ps-text-10)' : 'transparent',
        borderRadius: { xs: '16px', md: '24px' },
        padding: { xs: '16px', md: '16px 24px' },
        alignItems: 'center'
      }}
    >
      <Typography>{index}</Typography>
      <Box display={'flex'} gap={16} alignItems={'center'}>
        <Image src={avatarUrl} width={44} height={44} alt="png" style={{ borderRadius: '50%' }} />
        <Typography fontSize={'20px'} fontWeight={'500'} lineHeight={'26px'}>
          {name || 'userName'}
        </Typography>
      </Box>
    </Stack>
  )
}

export default Page
