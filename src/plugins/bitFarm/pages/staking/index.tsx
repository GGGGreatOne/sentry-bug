import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { viewControl } from 'views/editBox/modal'
import PoolList from './PoolList'
import { useStakePoolList } from 'plugins/bitFarm/hooks/useStakingPool'
import AddIcon from 'plugins/tokenToolBox/assets/toolBox/addIcon.svg'
import LoadingAnimation from 'components/Loading'
import useBreakpoint from 'hooks/useBreakpoint'
import PaginationView from 'components/Pagination'
import { useClubAuthCallback } from 'hooks/boxes/useClubAuthCallback'
import { useMemo } from 'react'
import EmptyData from 'components/EmptyData'
const StylePaginationView = styled(PaginationView)(() => ({
  width: '100%'
}))

const CreatePoolButton = ({ boxAddress, listing }: { boxAddress: string | undefined; listing?: boolean }) => {
  return (
    <Stack spacing={24} alignItems={'center'}>
      <Box
        onClick={() => {
          if (listing) return
          viewControl.show('CreatePoolModal', {
            boxAddress
          })
        }}
        sx={{
          width: 158,
          height: 158,
          backgroundColor: 'var(--ps-text-10)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          svg: {
            transform: 'scale(2.5)',
            path: {
              fill: listing ? 'var(--ps-text-60)' : 'var(--ps-text-100)'
            }
          },
          ':hover': {
            cursor: listing ? 'auto' : 'pointer',
            opacity: listing ? 1 : 0.9
          }
        }}
      >
        <AddIcon />
      </Box>
      <Button
        disabled={listing}
        variant="contained"
        sx={{
          maxWidth: { xs: 113, md: 146 },
          height: { xs: 36, md: 44 },
          color: '#0D0D0D',
          fontSize: { xs: 13, md: 15 },
          whiteSpace: 'nowrap'
        }}
        onClick={() => {
          viewControl.show('CreatePoolModal', {
            boxAddress
          })
        }}
      >
        Create A Pool
      </Button>
      <Typography variant="body1" fontSize={{ xs: 15, md: 16 }} color={'var(--ps-text-60)'} textAlign={'center'}>
        Your should create a pool first.
      </Typography>
    </Stack>
  )
}

const Staking = ({
  boxContactAddr,
  boxId,
  pluginId,
  editing,
  listing
}: {
  boxContactAddr: string
  boxId?: string | number
  pluginId?: number
  editing?: boolean | undefined
  listing?: boolean
}) => {
  const isMd = useBreakpoint('md')
  const {
    stakePoolList: poolList,
    loading,
    page
  } = useStakePoolList(boxId ? boxId.toString() : '', pluginId ? pluginId.toString() : '')

  const { isFreeMode, isMembers: _isMembers, isClubOwner: _isClubOwner } = useClubAuthCallback(boxContactAddr)

  const isPermission = useMemo(() => {
    if (!isFreeMode) {
      return !!_isClubOwner || _isMembers
    }
    return true
  }, [_isClubOwner, _isMembers, isFreeMode])

  if (isMd) {
    return (
      <Box
        sx={{
          width: '100%',
          borderRadius: 12,
          background: 'var(--ps-neutral2)',
          padding: { xs: '24px 16px', md: '32px 40px' }
        }}
      >
        <Stack spacing={!poolList?.list.length && !editing ? 0 : 24}>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography
              sx={{
                color: 'var(--ps-text-100)',
                fontSize: 20,
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              BITSTAKING
            </Typography>

            {editing && !!poolList?.list.length && (
              <Button
                disabled={listing}
                variant="outlined"
                sx={{
                  maxWidth: 120,
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
                }}
                onClick={() => {
                  viewControl.show('CreatePoolModal', { boxAddress: boxContactAddr })
                }}
              >
                Create A Pool
              </Button>
            )}
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 380
            }}
          >
            {loading ? (
              <LoadingAnimation />
            ) : (
              <>
                {!poolList?.list.length ? (
                  <>
                    {editing ? (
                      <CreatePoolButton boxAddress={boxContactAddr} />
                    ) : (
                      <EmptyData color="var(--ps-text-60)" height={100} />
                    )}
                  </>
                ) : (
                  <PoolList boxContactAddr={boxContactAddr} poolList={poolList} editing={editing} />
                )}
              </>
            )}
          </Box>
          <StylePaginationView
            count={page.totalPage}
            page={page.currentPage}
            onChange={(_, value) => page.setCurrentPage(value)}
          />
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
        padding: { xs: '24px 16px', md: '32px 40px' }
      }}
    >
      <Stack spacing={!poolList?.list.length && !editing ? 0 : 24}>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography
            variant="h3"
            sx={{
              color: 'var(--ps-text-100)',
              fontWeight: 500
            }}
          >
            BITSTAKING
          </Typography>

          {editing && !!poolList?.list.length && (
            <Button
              disabled={listing}
              variant="outlined"
              sx={{
                maxWidth: 133,
                whiteSpace: 'nowrap'
              }}
              onClick={() => {
                viewControl.show('CreatePoolModal', { boxAddress: boxContactAddr })
              }}
            >
              Create A Pool
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 490
          }}
        >
          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              {!poolList?.list.length ? (
                <>
                  {editing ? (
                    <CreatePoolButton boxAddress={boxContactAddr} listing={listing} />
                  ) : (
                    <EmptyData color="var(--ps-text-60)" height={100} />
                  )}
                </>
              ) : (
                <PoolList
                  boxContactAddr={boxContactAddr}
                  poolList={poolList}
                  editing={editing}
                  listing={listing}
                  isPermission={isPermission}
                />
              )}
            </>
          )}
        </Box>
        <StylePaginationView
          count={page.totalPage}
          page={page.currentPage}
          onChange={(_, value) => page.setCurrentPage(value)}
        />
      </Stack>
    </Box>
  )
}
export default Staking
