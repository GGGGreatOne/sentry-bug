import { useInfiniteScroll, usePagination } from 'ahooks'
import { GetBoxList, GetBoxSimpleList } from 'api/boxes/index'
import { GetBoxListParams } from 'api/boxes/type'
import { GetSimpleFollowingList } from 'api/user'
import { GetFollowingListParams } from 'api/user/type'
import { useActiveWeb3React } from 'hooks'
import { Dispatch, useRef } from 'react'
export const useGetBoxList = (params: GetBoxListParams) => {
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await GetBoxList({ ...params, pageNum: current, pageSize })
      return res.data
    },
    {
      defaultPageSize: params.pageSize,
      manual: false,
      refreshDeps: [
        params.boxType,
        params.pageNum,
        params.pageSize,
        params.projectName,
        params.orderByColumn,
        params.isAsc
      ]
    }
  )
}

export const useGetBoxSimpleList = (params: GetBoxListParams) => {
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await GetBoxSimpleList({ ...params, pageNum: current, pageSize })
      return res.data
    },
    {
      defaultPageSize: params.pageSize,
      manual: false,
      refreshDeps: [
        params.boxType,
        params.pageNum,
        params.pageSize,
        params.projectName,
        params.orderByColumn,
        params.isAsc
      ]
    }
  )
}

export const useGetSimpleFollowingList = (params: GetFollowingListParams, ready?: boolean) => {
  const { account } = useActiveWeb3React()
  return usePagination(
    async ({ current, pageSize }) => {
      const res = await GetSimpleFollowingList({ ...params, pageNum: current, pageSize })
      return res.data
    },
    {
      defaultPageSize: params.pageSize,
      manual: false,
      refreshDeps: [params.boxType, params.pageNum, params.pageSize],
      ready: ready && !!account
    }
  )
}

export const useGetSearchBoxList = (params: GetBoxListParams) => {
  return usePagination(
    async ({ current, pageSize }) => {
      if (params.projectName === '')
        return {
          total: 0,
          list: []
        }
      const res = await GetBoxList({ ...params, pageNum: current, pageSize })
      return res.data
    },
    {
      defaultPageSize: params.pageSize,
      manual: false,
      refreshDeps: [params.boxType, params.pageNum, params.pageSize, params.projectName]
    }
  )
}

export const useGetBoxListInfinite = (params: GetBoxListParams, page: number, setPage: Dispatch<number>) => {
  return useInfiniteScroll(
    async () => {
      const res = await GetBoxList({ ...params, pageNum: page })
      return res.data
    },
    {
      manual: false,
      reloadDeps: [params.boxType],
      onSuccess() {
        setPage(page + 1)
      }
    }
  )
}

export const useGetBoxListInfiniteMd = (params: GetBoxListParams, target: HTMLDivElement | null) => {
  const page = useRef(1)

  return {
    infiniteScroll: useInfiniteScroll(
      async () => {
        const res = await GetBoxSimpleList({ ...params, pageNum: page.current })
        return res.data
      },
      {
        manual: false,
        target: target,
        isNoMore: data => {
          if (data && params.pageSize && (page.current - 1) * params.pageSize >= data?.total) return true
          return false
        },
        onSuccess() {
          page.current = page.current + 1
        }
      }
    ),
    callBack: () => {
      page.current = 1
    }
  }
}

export const useGetFollowingListInfiniteMd = (params: GetFollowingListParams, target: HTMLDivElement | null) => {
  const page = useRef(1)

  return {
    infiniteScroll: useInfiniteScroll(
      async () => {
        const res = await GetSimpleFollowingList({ ...params, pageNum: page.current })
        return res.data
      },
      {
        manual: false,
        target: target,
        isNoMore: data => {
          if (data && params.pageSize && (page.current - 1) * params.pageSize >= data?.total) return true
          return false
        },
        onSuccess() {
          page.current = page.current + 1
        }
      }
    ),
    callBack: () => {
      page.current = 1
    }
  }
}
