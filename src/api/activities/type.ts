export type GetListClubsParams = {
  pageSize: number
  pageNum: number
  orderByColumn?: 'ts' | 'wantAmount' | 'ranks'
  isAsc?: 'desc' | 'asc'
}

export type ListClubItem = {
  followCount: number
  userAvatar?: string
  tvl: number
  userName: string
  userId: number
  wantAmount: string
  volume: number
  rewardId: number
  ranks: number
  id: number
  projectName: string
  wantToken: string
  ts: number
  orderId: number
  bgImage?: string
}

export type ListClubsResult = {
  total: number
  list: ListClubItem[]
}

export type BuyerSignResult = {
  address: string
  sign: string
  expiredTime: number
}
