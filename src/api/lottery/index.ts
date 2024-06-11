export interface BoxRewardList {
  total: number
  list: RewardRecord[]
}

export type RewardRecord = {
  createTime: string
  updateTime: string
  id: string
  rewardAddress: string
  source: number
  status: number
  hash: string
  participants: number
  txTs: number
}
