import { Stack, Typography, styled } from '@mui/material'
import CloseSvg from 'assets/images/boxes/close.svg'
import DragSvg from 'assets/images/boxes/drag.svg'
import TimeSvg from 'assets/images/boxes/time.svg'
import TipSvg from 'assets/images/boxes/tips.svg'
import { Dispatch, createRef, useCallback, useState } from 'react'
import ModelChange from 'views/clubs/components/ToolsBar/ModelChange'
import { BoxListItem } from 'api/boxes/type'
import Search, { SearchType } from 'views/clubs/components/ToolsBar/Search'
import SeachOption from 'views/clubs/components/ToolsBar/SeachOption'
import BoxPagination, { PaginationButton } from 'views/clubs/components/ToolsBar/BoxPagination'
import { ROUTES } from 'constants/routes'
import { useRouter } from 'next/router'

const PaginationButtonCom = styled(PaginationButton)(() => ({
  padding: 0,
  '&:hover': {
    border: '1px solid var(--ps-text-100)'
  }
}))

const BottomMenu = ({
  allData,
  isPrevious = false,
  handleBackToPrevious,
  handleSlide,
  initialSlide,
  setBoxType,
  setPage,
  reLoad,
  handleNext
}: {
  allData: BoxListItem[]
  isPrevious: boolean
  handleBackToPrevious: () => void
  handleSlide: (index: number) => void
  initialSlide: number
  setBoxType: Dispatch<string>
  setPage: Dispatch<number>
  reLoad: () => void
  handleNext: () => void
}) => {
  // const [searchValue, setSearchValue] = useState<string>('')
  const [openTips, setOpenTips] = useState<boolean>(false)

  const Previous = () => {
    return (
      <PaginationButtonCom className="previous">
        <Stack
          className="previous"
          sx={{
            height: 44,
            padding: '0 24px'
          }}
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={() => {
            handleBackToPrevious && handleBackToPrevious()
          }}
        >
          <Typography
            className="previous"
            sx={{
              fontSize: 13,
              color: '#BCBCBC'
            }}
          >
            ← Previous
          </Typography>
        </Stack>
      </PaginationButtonCom>
    )
  }

  const Next = () => {
    return (
      <PaginationButtonCom className="next">
        <Stack
          className="next"
          sx={{
            height: 44,
            padding: '0 24px'
          }}
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={() => {
            handleNext && handleNext()
          }}
        >
          <Typography
            className="next"
            sx={{
              fontSize: 13,
              color: '#BCBCBC'
            }}
          >
            Next →
          </Typography>
        </Stack>
      </PaginationButtonCom>
    )
  }

  const TipsCom = () => {
    return (
      <Stack
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          width: 280,
          height: 220,
          borderRadius: `8px`,
          background: `rgba(50, 50, 50, 0.40))`,
          backdropFilter: `blur(5px)`,
          cursor: 'pointer'
        }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={24}
      >
        <Typography
          sx={{
            color: '#fff',
            fontSize: 20
          }}
        >
          Explore Clubs
        </Typography>
        <Stack
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, 0.20)`,
            overflow: 'hidden'
          }}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <DragSvg />
        </Stack>
        <Typography
          sx={{
            color: '#bcbcbc',
            fontSize: 13
          }}
        >
          Scroll, drag to explore clubs
        </Typography>
        <CloseSvg
          style={{
            position: 'absolute',
            top: 12,
            right: 12
          }}
          onClick={() => {
            setOpenTips(false)
          }}
        />
      </Stack>
    )
  }
  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )

  const innerRef = createRef<any>()

  return (
    <Stack
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 100,
        padding: '0 20px',
        zIndex: 99999,
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%)`,
        flexShrink: 0
      }}
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      {!isPrevious && !openTips && (
        <PaginationButtonCom
          sx={{ width: 60, height: 60 }}
          onClick={() => {
            setOpenTips(true)
            setTimeout(() => {
              setOpenTips(false)
            }, 3000)
          }}
        >
          <Stack
            sx={{
              width: 60,
              height: 60
            }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <TipSvg />
          </Stack>
        </PaginationButtonCom>
      )}
      {!isPrevious && openTips && <TipsCom />}

      {isPrevious && (
        <BoxPagination
          onChange={(event: any, page: any) => {
            handleSlide(page)
          }}
          count={allData.length}
          page={initialSlide}
        ></BoxPagination>
      )}

      <Stack
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate3D(-50%, -50%, 0)',
          borderRadius: `8px`,
          background: `rgba(13, 13, 13, 0.40)`,
          backdropFilter: `blur(5px)`,
          padding: 8
        }}
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={4}
      >
        {isPrevious && <Previous />}
        <Search
          ref={innerRef}
          onChange={(item, filter) => {
            console.log('choice', item, filter)
            if (item) {
              routeTo(item.boxId)
            } else {
              const boxType = Object.entries(filter as any)
                .map(_ => (_[1] ? _[0] : null))
                .filter(_ => !!_)
                .join(',')
              setPage(0)
              setBoxType(boxType)
            }
          }}
          option={(item: BoxListItem) => {
            return <SeachOption item={item}></SeachOption>
          }}
        />
        <ModelChange />
        {isPrevious && <Next />}
      </Stack>
      {!isPrevious && (
        <PaginationButtonCom
          sx={{
            width: 60,
            height: 60,
            position: 'absolute',
            right: 20,
            bottom: 30
          }}
        >
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            onClick={() => {
              reLoad()
              innerRef && innerRef.current.clearHandle(SearchType.ByFilter)
              innerRef && innerRef.current.clearHandle(SearchType.ByInput)
            }}
          >
            <TimeSvg />
          </Stack>
        </PaginationButtonCom>
      )}
    </Stack>
  )
}
export default BottomMenu
