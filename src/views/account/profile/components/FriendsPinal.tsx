import { Masonry } from '@mui/lab'
import { Box, styled } from '@mui/material'
import { useInfiniteScroll } from 'ahooks'
import { GetFriendslist } from 'api/user'
import { useRef, useState } from 'react'
// import FollowingsCarItem from './FollowingsCarItem'
import useBreakpoint from 'hooks/useBreakpoint'
import EmptyData from 'components/EmptyData'
interface TabPanelProps {
  index: number
  value: number
}
export const ListContainer = styled(Box)`
  height: 600px;
  margin-top: 40px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0px;
  }

  ${props => props.theme.breakpoints.down('lg')} {
    padding-left: 10px;
  }

  ${props => props.theme.breakpoints.down('md')} {
    height: calc(100vh - 202px);
  }
`

function FriendsPinal({ value, index, ...other }: TabPanelProps) {
  const isMd = useBreakpoint('md')
  const isLg = useBreakpoint('lg')
  const listRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const { data } = useInfiniteScroll(
    async () => {
      const params = {
        pageNum: page,
        pageSize: pageSize
      }
      const res = await GetFriendslist(params)
      setPage(page + 1)
      return res.data
    },
    {
      target: listRef.current,
      isNoMore: data => {
        if (!data) return true
        if (data && (page - 1) * pageSize >= data?.total) return true
        return false
      }
    }
  )

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {!data?.list || data?.list.length === 0 ? (
        <EmptyData height={isMd ? 300 : 400} color={'var(--ps-text-40)'} />
      ) : (
        <ListContainer ref={listRef}>
          <Masonry columns={isLg ? 1 : 2} spacing={16}>
            <>
              {/* {data?.list.map((_, index) => (
                <FollowingsCarItem key={_.id + index} item={_} index={index} mutate={mutate} />
              ))} */}
            </>
          </Masonry>
        </ListContainer>
      )}
    </Box>
  )
}

export default FriendsPinal
