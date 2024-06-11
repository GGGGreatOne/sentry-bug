import { Box, ClickAwayListener, Stack, Typography } from '@mui/material'
// import boxBgImg from 'assets/images/boxes/boxitem.png'
// import headIcon from 'assets/images/boxes/headicon.png'
import PointerImg from 'assets/images/boxes/pointer.png'
import _ from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
// import BottomMenu from 'views/clubs/components/BottomMenu'
import RowSwiper from 'views/clubs/components/RowSwiper'
import BoxCardItem from '../../views/clubs/components/BoxCardItem'
import LoadingBg from '../../views/clubs/components/LoadingBg'
import { BoxListItem, BoxTypes, IListOrder, OrderType } from 'api/boxes/type'
import { useGetBoxListInfinite } from 'hooks/boxes/useGetBoxList'
import BottomMenu from 'views/clubs/components/BottomMenu'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'
import Head from 'next/head'
import { useUserInfo } from 'state/user/hooks'
import { ILoginUserInfoUser } from 'api/user/type'

export interface GlobalCoordsParam {
  x: number
  y: number
}

const Clubs = () => {
  const isMd = useBreakpoint('md')
  const route = useRouter()
  useEffect(() => {
    if (isMd) {
      route.push(ROUTES.clubs.allClub)
    }
  }, [isMd, route])
  const [initLoading, setInitLoading] = useState(true)
  const [dataList, setDataList] = useState<BoxListItem[][]>([])
  const [slidesPerView, setSlidesPerView] = useState(3)
  const [activeIndex, setActiveIndex] = useState(1)
  const [dialogInitialSlide, setDialogInitialSlide] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [boxSize] = useState(25)

  const [projectName] = useState('')
  const [boxType, setBoxType] = useState('')
  const [page, setPage] = useState(1)
  const [isReload, setIsReload] = useState(false)
  const params = {
    pageNum: page,
    pageSize: boxSize,
    projectName: encodeURIComponent(projectName),
    boxType: boxType ? boxType : `${BoxTypes.PROJECT},${BoxTypes.USER}`,
    orderByColumn: OrderType.ID,
    isAsc: IListOrder.ASC
  }
  const noMore = useRef(false)
  const { user } = useUserInfo()
  const [userTemp, setUserTemp] = useState<ILoginUserInfoUser | null>(null)
  const { data: boxListData, loading, loadMore, reload } = useGetBoxListInfinite(params, page, setPage)
  console.log('data->>useGetBoxList', boxListData?.list, boxListData?.total, loading)

  useEffect(() => {
    setTimeout(() => {
      // load data
      const data = _.chunk(boxListData?.list, boxSize / 5)
      setDataList(data)
      setInitLoading(false)
    }, 1200)
    return () => {}
  }, [boxListData?.list, boxSize])

  useEffect(() => {
    const handleResize = () => {
      const wh = window.innerHeight
      setSlidesPerView((wh - 76) / 400)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dataList])
  const [globalCoords, setGlobalCoords] = useState<GlobalCoordsParam>({ x: 0, y: 0 })
  const handleMouseMove = (event: any) => {
    setGlobalCoords({
      x: event.clientX,
      y: event.clientY - 70
    })
  }
  const handleClickBox = (index: number) => {
    setDialogInitialSlide(index)
    setTimeout(() => {
      setOpenDialog(true)
    }, 500)
  }

  const swiperRef = useRef<any>(null)
  const reLoadFunc = useCallback(async () => {
    await setBoxType('')
    await setPage(1)
    noMore.current = false
    reload()
    swiperRef.current && swiperRef.current.swiper.slideTo(1)
  }, [reload])
  useEffect(() => {
    if (userTemp?.userId !== user?.userId) {
      setUserTemp(user)
      setPage(1)
      setInitLoading(true)
      setTimeout(() => {
        setInitLoading(false)
        setIsReload(true)
      }, 1000)
    } else {
      setIsReload(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  useEffect(() => {
    if (isReload && page === 1) {
      noMore.current = false
      reload()
      swiperRef.current && swiperRef.current.swiper.slideTo(1)
    }
  }, [isReload, page, reload])
  return (
    <>
      <Head>
        <title>BounceClub - Clubs</title>
      </Head>
      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          background: `url(${PointerImg.src}) repeat left top / auto auto`
        }}
        onMouseMove={handleMouseMove}
      >
        {boxListData?.list.length === 0 ? (
          <Stack alignItems={'center'} justifyContent={'center'} width={'100vw'} height={'100vh'}>
            <Typography fontSize={13} fontWeight={400}>
              No results
            </Typography>
          </Stack>
        ) : (
          <Swiper
            key={'bouncebox'}
            loop={false}
            initialSlide={1}
            centeredSlides={true}
            centeredSlidesBounds={true}
            slidesPerView={slidesPerView}
            modules={[Mousewheel]}
            direction={'vertical'}
            mousewheel={true}
            ref={swiperRef}
            onSlideChange={swiperCore => {
              const { activeIndex } = swiperCore
              setActiveIndex(activeIndex === 0 ? 1 : activeIndex)
              if (boxListData?.total && params.pageSize >= boxListData?.total) return
              if (activeIndex !== 0 && activeIndex % 3 === 0) {
                if (noMore.current) return
                loadMore()
                if (boxListData && page * params.pageSize >= boxListData?.total) {
                  noMore.current = true
                }
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              paddingTop: 70,
              paddingBottom: 30,
              zIndex: 1
            }}
            onMouseMove={handleMouseMove}
          >
            {dataList.map((row, index) => {
              return (
                <SwiperSlide key={'row' + index}>
                  <Stack
                    sx={{
                      width: '100vw',
                      height: '100%'
                    }}
                    direction={'row'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    {row.map((col, i) => {
                      return (
                        <BoxCardItem
                          handleClick={() => {
                            if (openDialog) return
                            handleClickBox(index * 5 + i)
                          }}
                          key={'col' + i}
                          isFocus={activeIndex === index && i === 2}
                          item={col}
                          globalCoords={globalCoords}
                        />
                      )
                    })}
                  </Stack>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}

        {boxListData?.list.length === 0 ? (
          <></>
        ) : (
          boxListData && (
            <ClickAwayListener
              onClickAway={(e: any) => {
                console.log('ClickAwayListener', e, e.target.classList)
                if (Array.from(e.target.classList).includes('previous')) return
                if (Array.from(e.target.classList).includes('next')) return
                setOpenDialog(false)
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: 600,
                  position: 'fixed',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: openDialog ? 1 : 0,
                  zIndex: openDialog ? 2 : 0,
                  transition: 'opacity 0.6s'
                }}
              >
                <RowSwiper
                  data={boxListData.list}
                  initialSlide={dialogInitialSlide}
                  handleSlide={(index: number) => {
                    setDialogInitialSlide(index)
                  }}
                />
              </Box>
            </ClickAwayListener>
          )
        )}

        {boxListData && (
          <BottomMenu
            initialSlide={dialogInitialSlide}
            allData={boxListData?.list}
            handleSlide={(index: number) => {
              handleClickBox(index)
            }}
            isPrevious={openDialog}
            handleBackToPrevious={async () => {
              await setDialogInitialSlide(dialogInitialSlide - 1)
            }}
            handleNext={async () => {
              await setDialogInitialSlide(dialogInitialSlide + 1)
            }}
            setBoxType={setBoxType}
            setPage={setPage}
            reLoad={reLoadFunc}
          />
        )}
      </Box>
      <LoadingBg loading={initLoading} />
    </>
  )
}
export default Clubs
