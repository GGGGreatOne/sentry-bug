import { Box, Skeleton, Stack, styled, Typography } from '@mui/material'
import { BoxContainer } from 'components/BoxContainer'
import ToolsBar from 'views/clubs/components/ToolsBar'
import { useGetBoxListInfiniteMd, useGetFollowingListInfiniteMd } from 'hooks/boxes/useGetBoxList'
import BoxListItem from 'views/clubs/components/BoxListItem'
import { BoxListSimpleItem, GetBoxListParams, IListOrder, OrderType } from 'api/boxes/type'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BoxTypes } from 'api/boxes/type'
import useBreakpoint from 'hooks/useBreakpoint'
import Head from 'next/head'
import TimeSvg from 'assets/images/boxes/time.svg'
import { GetFollowingListParams, ILoginUserInfoUser } from 'api/user/type'
import EmptyData from 'components/EmptyData'
import { useUserInfo } from 'state/user/hooks'

const Placeholding = styled(Box)`
  height: 70px;
`
const Main = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
`
const TabText = styled(Typography)`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  padding-bottom: 5px;
  cursor: pointer;
  ${props => props.theme.breakpoints.down('md')} {
    font-size: 15px;
    line-height: 22.4px;
  }
`

const Title = styled(Typography)`
  color: var(--ps-text-100);
  font-variant-numeric: lining-nums proportional-nums;
  font-size: 56px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;

  ${props => props.theme.breakpoints.down('md')} {
    margin: 0px 20px;
    font-size: 30px;
  }
`

const MdContainer = styled(Box)`
  margin: 20px 0;
`

const CusListContainer = styled(Box)`
  height: calc(100vh - 174px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
`

const LoadingSkeleton = () => {
  const isMd = useBreakpoint('md')
  return Array.from<string>({ length: 6 }).map((_, index) => (
    <Skeleton
      key={index}
      sx={{
        borderRadius: 12
      }}
      width={isMd ? 'calc(100vw - 20px)' : 590}
      height={isMd ? 175 : 180}
      variant="rectangular"
    />
  ))
}
const BoxSize = 12

const AllclubsItem = ({ params, user }: { params: GetBoxListParams; user: ILoginUserInfoUser | null }) => {
  const isMd = useBreakpoint('md')
  const [userTemp, setUserTemp] = useState<ILoginUserInfoUser | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { callBack, infiniteScroll } = useGetBoxListInfiniteMd(params, listRef.current)
  const { data, loading, reload } = infiniteScroll
  const [loadingOut, setLoadingOut] = useState(false)
  const reloadFun = useCallback(async () => {
    callBack()
    reload()
  }, [callBack, reload])

  useEffect(() => {
    if (params.boxType) {
      reloadFun()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.boxType])

  useEffect(() => {
    if (userTemp?.userId !== user?.userId) {
      setUserTemp(user)
      setLoadingOut(true)
      setTimeout(() => {
        setLoadingOut(false)
        reloadFun()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const reloadProps = useMemo(() => {
    if (isMd) {
      return {
        top: 120,
        right: 30,
        zIndex: 51
      }
    }
    return {
      bottom: 28,
      right: 30,
      zIndex: 51
    }
  }, [isMd])

  return (
    <>
      <Stack
        position={'fixed'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          width: 44,
          height: 44,
          borderRadius: `8px`,
          background: `var(--ps-neutral)`,
          cursor: 'pointer'
        }}
        onClick={reloadFun}
        {...reloadProps}
      >
        <TimeSvg />
      </Stack>
      {data?.list && data?.list.length === 0 ? (
        <EmptyData height={500} />
      ) : (
        <CusListContainer ref={listRef}>
          <Stack flexDirection={'row'} flexWrap={'wrap'} gap={20} justifyContent={'center'}>
            <>
              {loading || loadingOut ? (
                <LoadingSkeleton />
              ) : (
                data?.list.map((item: BoxListSimpleItem) => {
                  return (
                    <Box key={item.boxId} width={isMd ? 'calc(100vw - 20px)' : 590}>
                      <BoxListItem
                        callBack={() => {
                          // runGetBoxList({ current: pagination.current, pageSize: pagination.pageSize })
                        }}
                        item={item}
                      ></BoxListItem>
                    </Box>
                  )
                })
              )}
            </>
          </Stack>
        </CusListContainer>
      )}
    </>
  )
}

const FollowingsItem = ({ params }: { params: GetFollowingListParams }) => {
  const isMd = useBreakpoint('md')
  const listRef = useRef<HTMLDivElement>(null)
  const { callBack, infiniteScroll } = useGetFollowingListInfiniteMd(params, listRef.current)
  const { data, loading, reload } = infiniteScroll

  const reloadFun = useCallback(async () => {
    callBack()
    reload()
  }, [callBack, reload])

  useEffect(() => {
    if (params.boxType) {
      reloadFun()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.boxType])

  return (
    <>
      <Stack
        position={'fixed'}
        top={isMd ? 120 : 'none'}
        bottom={isMd ? 'none' : 28}
        right={30}
        zIndex={50}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          width: 44,
          height: 44,
          borderRadius: `8px`,
          background: `var(--ps-neutral)`,
          cursor: 'pointer',
          zIndex: 51
        }}
        onClick={reloadFun}
      >
        <TimeSvg />
      </Stack>
      {data?.list && data?.list.length === 0 ? (
        <EmptyData height={500} />
      ) : (
        <CusListContainer ref={listRef}>
          <Stack flexDirection={'row'} flexWrap={'wrap'} gap={20} justifyContent={'center'}>
            <>
              {loading ? (
                <LoadingSkeleton />
              ) : (
                data?.list.map((item: BoxListSimpleItem) => {
                  return (
                    <Box key={item.boxId} width={isMd ? 'calc(100vw - 20px)' : 590}>
                      <BoxListItem
                        callBack={() => {
                          // runGetBoxList({ current: pagination.current, pageSize: pagination.pageSize })
                        }}
                        item={item}
                      ></BoxListItem>
                    </Box>
                  )
                })
              )}
            </>
          </Stack>
        </CusListContainer>
      )}
    </>
  )
}

const Allclubs = () => {
  const [projectName, setProjectName] = useState('')
  const [boxType, setBoxType] = useState('')
  const [tab, setTab] = useState(1)
  const userInfo = useUserInfo()
  const isMd = useBreakpoint('md')
  const params = {
    pageNum: 1,
    pageSize: BoxSize,
    projectName: projectName,
    boxType: boxType ? boxType : `${BoxTypes.PROJECT},${BoxTypes.USER}`,
    orderByColumn: OrderType.ID,
    isAsc: IListOrder.ASC
  }
  const folloingParams = {
    pageNum: 1,
    pageSize: BoxSize,
    boxType: boxType.length > 1 ? '' : boxType
  }

  useEffect(() => {
    if (!userInfo.user) {
      setTab(1)
    }
  }, [userInfo.user])

  return (
    <BoxContainer isClub={true}>
      <Head>
        <title>BounceClub - Clubs</title>
      </Head>
      <MdContainer>
        <Placeholding></Placeholding>
        <Main>
          <Stack
            direction={'row'}
            alignItems={'flex-end'}
            justifyContent={'space-between'}
            margin={isMd ? '0 0 40px 0' : '41px 0 60px'}
          >
            <Title className="home-app-step2">All Clubs</Title>
            {userInfo.user && (
              <Stack direction={'row'} alignItems={'center'} gap={40} margin={'0 16px 16px 0'}>
                <TabText
                  sx={{
                    color: tab === 1 ? 'var(--ps-text-100)' : 'var(--ps-text-40)',
                    borderBottom: tab === 1 ? '1px solid var(--ps-text-100)' : '1px solid transparent'
                  }}
                  onClick={() => setTab(1)}
                >
                  All
                </TabText>
                <TabText
                  sx={{
                    color: tab === 3 ? 'var(--ps-text-100)' : 'var(--ps-text-40)',
                    borderBottom: tab === 2 ? '1px solid var(--ps-text-100)' : '1px solid transparent'
                  }}
                  onClick={() => setTab(2)}
                >
                  Followings
                </TabText>
              </Stack>
            )}
          </Stack>

          {tab === 1 && <AllclubsItem params={params} user={userInfo.user}></AllclubsItem>}

          {tab === 2 && <FollowingsItem params={folloingParams}></FollowingsItem>}
        </Main>
      </MdContainer>

      <ToolsBar
        setBoxType={setBoxType}
        setProjectName={setProjectName}
        // pagination={tab === 1 ? pagination : pagination2}
        isShow={true}
        isModel={tab === 1 ? true : false}
      />
    </BoxContainer>
  )
}
export default Allclubs
