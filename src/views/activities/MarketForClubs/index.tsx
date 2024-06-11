import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { ClubCard } from './ClubCard'
import { Filters } from './Filters'
import { queryLoadListClubs } from 'api/activities'
import { useInfiniteScroll } from 'ahooks'
import { NoData } from './NoData'
import useBreakpoint from 'hooks/useBreakpoint'

export function MarketForClubs() {
  const [filterIndex, setFilterIndex] = useState<number>(0)
  const theme = useTheme()
  const isMd = useBreakpoint('md')
  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    d => {
      const pageSize = 12
      const pageNum = d?.pageNum === undefined ? 1 : d.pageNum + 1
      const filter = [
        { orderByColumn: 'ts', isAsc: 'desc' },
        { orderByColumn: 'ranks', isAsc: 'asc' },
        { orderByColumn: 'wantAmount', isAsc: 'asc' },
        { orderByColumn: 'wantAmount', isAsc: 'desc' }
      ][filterIndex] as any

      return queryLoadListClubs({
        ...filter,
        pageNum,
        pageSize
      }) as any
    },
    {
      reloadDeps: [filterIndex],
      target: typeof window === 'undefined' ? null : document,
      isNoMore: d => {
        return d?.pageNum * d?.pageSize >= d?.total
      }
    }
  )

  const content = useMemo(() => {
    if (data?.list?.length === 0 && !loading) {
      return <NoData />
    }
    return (
      <div>
        <Grid
          container
          gap={20}
          sx={{
            [theme.breakpoints.down('sm')]: {
              width: '100%'
            }
          }}
        >
          {!loading
            ? data?.list.map((club, i) => (
                <Grid width={isMd ? '100%' : '32.18%'} key={`${club.id}_${i}`} item>
                  <ClubCard club={club} />
                </Grid>
              ))
            : Array.from({ length: 6 }, (value, i) => (
                <Grid width={isMd ? '100%' : '32.18%'} key={i} item>
                  <ClubCard />
                </Grid>
              ))}
        </Grid>
        <Box sx={{ py: 24, textAlign: 'center' }}>
          {loadingMore && <Typography variant="IBM_Plex_Sans">More loading...</Typography>}
          {noMore && <Typography variant="IBM_Plex_Sans">No more</Typography>}
        </Box>
      </div>
    )
  }, [data?.list, isMd, loading, loadingMore, noMore, theme.breakpoints])

  return (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        width: '100%',
        bgcolor: 'var(--ps-neutral)',
        padding: isMd ? '16px 20px 64px 20px' : '48px 0 120px 0',
        marginTop: 100
      }}
    >
      <Box
        width={isMd ? 'calc(100vw - 40px)' : 1200}
        sx={{ borderRadius: '12px', bgcolor: 'var(--ps-neutral2)', padding: isMd ? '24px 16px' : '32px 20px' }}
      >
        <Stack gap={40}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="IBM_Plex_Sans" fontSize={{ xs: 16, md: 20 }}>
              Clubs on the market
            </Typography>
            <Filters onChange={setFilterIndex} />
          </Stack>

          {content}
        </Stack>
      </Box>
    </Stack>
  )
}
