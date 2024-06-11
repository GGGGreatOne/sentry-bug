/* eslint-disable @next/next/no-img-element */
import { Box, styled, InputBase, Stack, Typography, Drawer, Skeleton } from '@mui/material'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { ClickAwayListener } from '@mui/base'
import useBreakpoint from 'hooks/useBreakpoint'
import SeachSvg from 'assets/svg/search.svg'
import CloseSvg from 'assets/svg/activeties/close.svg'
// import PatchCheckFll from 'assets/svg/home/patchCheckFll.svg'
import VerifyIcon from 'assets/svg/verifiedIconSm.svg'
import CloseIcon from '@mui/icons-material/Close'
import PopperCard from 'components/PopperCard'
import { useGetSearchBoxList } from 'hooks/boxes/useGetBoxList'
import { BoxTypes, IListOrder, OrderType } from 'api/boxes/type'
import { ROUTES } from 'constants/routes'
import { useRouter } from 'next/router'
import DefaultImage from 'assets/images/account/default_followings_item.png'
import EmptyData from 'components/EmptyData'

const searchMaxNum = 20

const SearchBoxMd = styled(Box)`
  background: transparent;
`
const SearchBox = styled(Box)<{ hasBoxAction: any }>`
  position: absolute;
  top: 50%;
  right: ${props => (props.hasBoxAction ? '280px' : ' 120px')};
  z-index: 999;
  transform: translateY(-50%);
  /* background: var(--ps-text-primary); */

  ${props => props.theme.breakpoints.down('lg')} {
    right: ${props => (props.hasBoxAction ? '280px' : ' 120px')};
  }
`

const StyledSearch = styled(SeachSvg)<{ color?: string }>(({ theme, color }) => ({
  cursor: 'pointer',
  '& g': {
    stroke: color ? color : theme.palette.text.primary
  }
}))

const StyledCloseSvg = styled(CloseSvg)<{ color?: string }>(({ theme, color }) => ({
  cursor: 'pointer',
  position: 'absolute',
  right: 24,
  '& g': {
    stroke: color ? theme.palette.text.secondary : theme.palette.text.primary
    // stroke: theme.palette.text.secondary
  }
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  transition: '1s',
  fontSize: 13,
  fontWeight: 400,
  lineHeight: 1.4,
  color: 'var(--ps-text-100)',
  '& .MuiInputBase-input': {
    height: 44,
    padding: theme.spacing(1, 1, 1, 0)
  }
}))

const BorderBox = styled(Box)`
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: 6px;
`

interface Tabs {
  name: string
  index: number
}

const tabs: Tabs[] = [
  { name: 'Project Clubs', index: BoxTypes.PROJECT },
  { name: 'User Clubs', index: BoxTypes.USER }
]

const SearchResult = ({ isMd, value, close }: { isMd: boolean; value: string; close: () => void }) => {
  const route = useRouter()
  const [tabIndex, setTabIndex] = useState(BoxTypes.PROJECT)

  const skeletonNumber = useMemo(() => {
    if (isMd) {
      return Math.floor((window.innerHeight - 180) / 56)
    }
    return 5
  }, [isMd])
  const params = {
    pageNum: 0,
    pageSize: searchMaxNum,
    projectName: encodeURIComponent(value),
    orderByColumn: OrderType.TVL,
    isAsc: IListOrder.DESC
  }
  const { data: inputFilterList } = useGetSearchBoxList(params)

  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
      close()
    },
    [close, route]
  )

  return (
    <Box>
      <Stack gap={40} direction={'row'} alignItems={'center'} justifyContent={'flex-start'} mb={16} display={'none'}>
        {tabs.map((item, index) => {
          return (
            <Typography
              key={item.name + index}
              variant={isMd ? 'body2' : 'h5'}
              sx={{
                color: tabIndex === item.index ? 'var(--ps-text-100)' : 'var(--ps-text-40)',
                borderBottom: tabIndex === item.index ? '1px solid var(--ps-text-100)' : '1px solid transparent',
                lineHeight: 1,
                fontWeight: 500,
                cursor: 'pointer'
              }}
              onClick={() => {
                setTabIndex(item.index)
              }}
            >
              {item.name}
            </Typography>
          )
        })}
      </Stack>
      <Stack
        gap={4}
        direction={'column'}
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
        sx={{
          height: isMd ? 'calc(100vh - 205px)' : 276,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 0
          }
        }}
      >
        {/* loading */}
        {!inputFilterList &&
          Array(skeletonNumber)
            .fill(0)
            .map((item, index) => {
              return <SearchSkeleton key={item + index} isMd={isMd} />
            })}
        {inputFilterList && inputFilterList.list.length === 0 ? (
          <EmptyData size={14} />
        ) : (
          inputFilterList?.list.map((item, index) => {
            return (
              <Stack
                onClick={() => routeTo(item.boxId)}
                key={item.projectName + index}
                gap={12}
                direction={'row'}
                alignItems={'center'}
                padding={8}
                sx={{
                  cursor: 'pointer'
                }}
              >
                <BorderBox>
                  <img
                    width={36}
                    height={36}
                    style={{ borderRadius: 6 }}
                    src={item.avatar}
                    alt={''}
                    onError={(e: any) => {
                      e.target.onerror = null
                      e.target.src = DefaultImage.src
                    }}
                  />
                </BorderBox>

                <Box width={isMd ? 'calc(100vw - 145px)' : 220}>
                  <Stack gap={4} mb={4} direction={'row'} alignItems={'center'}>
                    <Typography variant="h6">{item.projectName}</Typography>
                    {item.verified && <VerifyIcon width={17} />}
                  </Stack>
                  <Typography
                    variant="h2"
                    sx={{
                      color: 'var(--ps-neutral3)',
                      fontWeight: 400,
                      fontSize: 12
                    }}
                  >
                    Club ID {item.rewardId} · {item.followCount} Followers
                  </Typography>
                </Box>
              </Stack>
            )
          })
        )}
      </Stack>
    </Box>
  )
}

const SerchDrawer = ({
  open,
  handleClose,
  handleChange,
  isMd,
  value,
  setValue,
  close
}: {
  open: boolean
  handleClose: () => void
  isMd: boolean
  value: string
  setValue: () => void
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  close: () => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <Drawer variant="persistent" anchor="top" open={open}>
      <Box sx={{ minHeight: '100vh', zIndex: 999, position: 'relative', padding: '0 20px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 0'
          }}
          onClick={handleClose}
        >
          <Typography variant="h3" color={'var(--ps-neutral6)'} fontWeight={500} lineHeight={1.4}>
            Search
          </Typography>
          <CloseIcon sx={{ color: theme => theme.palette.text.primary }} />
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={12}
          sx={{
            background: open ? 'var(--ps-text-10)' : 'var(--ps-text-primary)',
            padding: '0 24px 0 12px',
            borderRadius: 8,
            position: 'relative'
          }}
        >
          <StyledSearch color={open ? 'var(--ps-neutral4)' : ''} />
          <StyledInputBase
            inputRef={inputRef}
            placeholder="Search by clubs, activities"
            inputProps={{ 'aria-label': 'search' }}
            value={value}
            onChange={handleChange}
            sx={{
              width: open ? 252 : 0,
              paddingRight: value ? 32 : 0
            }}
          />
          {value && <StyledCloseSvg color={'var(--ps-neutral3)'} onClick={setValue} />}
        </Box>
        {value && (
          <Box
            sx={{
              padding: 16,
              width: '100%',
              borderRadius: 8,
              background: 'var(--ps-text-primary)'
            }}
          >
            <SearchResult close={() => close()} value={value} isMd={isMd} />
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

const SearchSkeleton = ({ isMd }: { isMd: boolean }) => {
  return (
    <Stack gap={12} direction={'row'} alignItems={'center'} padding={8}>
      <Skeleton variant="rectangular" width={36} height={36} />
      <Stack gap={4} direction={'column'}>
        <Skeleton variant="rectangular" width={80} height={isMd ? 12 : 13} />
        <Skeleton variant="rectangular" width={isMd ? 'calc(100vw - 145px)' : 220} height={17} />
      </Stack>
    </Stack>
  )
}

export default function Search({ hasBoxAction }: { hasBoxAction: any }) {
  const isMd = useBreakpoint('md')
  const inputRef = useRef<HTMLInputElement>(null)
  const [openPopper, setOpenPopper] = useState(false)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    if (value) {
      setOpenPopper(true)
    } else {
      setOpenPopper(false)
    }
  }, [value])
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const SearchContainer = isMd ? SearchBoxMd : SearchBox
  return (
    <SearchContainer hasBoxAction={hasBoxAction} id="search-container">
      {isMd ? (
        <>
          <StyledSearch
            onClick={() => {
              setOpen(true)
            }}
          />
          <SerchDrawer
            open={open}
            isMd={isMd}
            value={value}
            close={() => {
              setValue('')
              setOpen(false)
            }}
            setValue={() => {
              setValue('')
            }}
            handleClose={() => {
              setOpen(false)
            }}
            handleChange={handleChange}
          />
        </>
      ) : (
        <PopperCard
          open={openPopper}
          closeHandler={() => {
            setValue('')
            setOpenPopper(false)
            setOpen(false)
          }}
          handleClick={() => {
            value &&
              setTimeout(() => {
                setOpenPopper(true)
              }, 1000)
          }}
          sx={{ padding: value ? 16 : 0, width: 320, borderRadius: 8, background: 'var(--ps-neutral)' }}
          targetElement={
            <Box
              display={'flex'}
              alignItems={'center'}
              gap={open ? 12 : 0}
              sx={{
                background: open ? 'var(--ps-text-10)' : 'transparent',
                padding: open ? '0 12px' : 0,
                borderRadius: 8,
                position: 'relative'
              }}
            >
              <StyledSearch
                color={open ? 'var(--ps-neutral4)' : ''}
                onClick={() => {
                  setOpen(!open)
                }}
              />
              <StyledInputBase
                inputRef={inputRef}
                placeholder="Search by clubs, activities"
                inputProps={{ 'aria-label': 'search' }}
                value={value}
                onChange={handleChange}
                sx={{
                  width: open ? 252 : 0,
                  paddingRight: open ? 32 : 0
                }}
              />
              {value && open && (
                <StyledCloseSvg
                  onClick={() => {
                    setValue('')
                  }}
                />
              )}
            </Box>
          }
        >
          {value && (
            <SearchResult
              close={() => {
                setValue('')
                setOpen(false)
              }}
              value={value}
              isMd={isMd}
            />
          )}
        </PopperCard>
      )}
    </SearchContainer>
  )
}
