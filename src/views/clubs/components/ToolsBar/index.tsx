import { Box, styled } from '@mui/material'
import Search from './Search'
import SeachOption from './SeachOption'
import { BoxListItem } from 'api/boxes/type'
// import BoxPagination from './BoxPagination'
import useBreakpoint from 'hooks/useBreakpoint'
import { Dispatch, useCallback } from 'react'
import ModelChange from './ModelChange'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'

export declare type Data = {
  total: number
  list: any[]
}
export declare type Params = [
  {
    current: number
    pageSize: number
    [key: string]: any
  },
  ...any[]
]

// export interface PaginationResult {
//   current: number
//   pageSize: number
//   total: number
//   totalPage: number
//   onChange: (current: number, pageSize: number) => void
//   changeCurrent: (current: number) => void
//   changePageSize: (pageSize: number) => void
// }

interface ToolsBarProps {
  isShow?: boolean
  isModel?: boolean
  // pagination?: PaginationResult
  setBoxType: Dispatch<string>
  setProjectName: Dispatch<string>
}
const Container = styled(Box)`
  display: flex;
  padding: 8px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: var(--ps-text-primary-40);
  backdrop-filter: blur(5px);

  ${props => props.theme.breakpoints.down('md')} {
    padding: 4px;
    gap: 4px;
  }
`

export const ToolsBox = styled(Box)`
  display: flex;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 6px;
  background: var(--ps-neutral);
  cursor: pointer;

  &:hover {
    border: 1px solid var(--ps-text-100);
  }
`

const ToolsBar = ({ isShow = true, setBoxType, isModel = true }: ToolsBarProps) => {
  const isMd = useBreakpoint('md')
  // const paginationHandle = useCallback(
  //   (e: any, _: number) => {
  //     pagination?.changeCurrent(_)
  //   },
  //   [pagination]
  // )
  // const previousHandle = useCallback(() => {
  //   if (pagination.current <= 1) return
  //   pagination.changeCurrent(pagination.current - 1)
  // }, [pagination])
  // const nextHandle = useCallback(() => {
  //   if (pagination.current >= pagination.totalPage) return
  //   pagination.changeCurrent(pagination.current + 1)
  // }, [pagination])

  const route = useRouter()
  const routeTo = useCallback(
    (boxId: number) => {
      route.push(ROUTES.club.cusBox(boxId.toString()))
    },
    [route]
  )

  return (
    <>
      {isShow && (
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          pb={20}
          px={20}
          position={'fixed'}
          bottom={0}
          zIndex={50}
        >
          <Box width={'25%'}>
            {/* {!isMd && pagination && (
              <BoxPagination
                onChange={paginationHandle}
                count={pagination?.totalPage}
                page={pagination?.current}
              ></BoxPagination>
            )} */}
          </Box>
          <Container>
            {/* {!isMd && <PaginationButton onClick={previousHandle}>← Previous</PaginationButton>} */}
            <Search
              onChange={(item, filter) => {
                console.log('choice', item, filter)
                const boxType = Object.entries(filter as any)
                  .map(_ => (_[1] ? _[0] : null))
                  .filter(_ => !!_)
                  .join(',')
                setBoxType(boxType)
                item && routeTo(item.boxId)
              }}
              option={(item: BoxListItem) => {
                return <SeachOption item={item}></SeachOption>
              }}
            />
            {!isMd && isModel && <ModelChange />}

            {/* {!isMd && <PaginationButton onClick={nextHandle}>Next →</PaginationButton>} */}
          </Container>
          <Box width={'25%'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}></Box>
        </Box>
      )}
    </>
  )
}
export default ToolsBar
