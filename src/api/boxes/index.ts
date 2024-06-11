import { IBoxValue, IBoxesJsonData, IBoxesPublishJsonData } from 'state/boxes/type'
import { ApiInstance } from 'utils/fetch'
import {
  ICreateBoxParams,
  ICreateBoxResult,
  PluginListResult,
  GetBoxListParams,
  BoxListResult,
  StableListResult,
  IPluginListParams,
  IPluginListResult,
  ClubRanksResult,
  TokenPriceInfo,
  IPluginLeverageHistoryParams,
  LeverageHistoryReturnData,
  IStablecoinTroveParams,
  StablecoinTroveListResult,
  IStablecoinListParams,
  ClubRanksListParams,
  EnablePluginListResult,
  GetStakePoolListParams,
  StakePoolListResult,
  ITokenListParams,
  ITokenListResult,
  BoxListSimpleResult,
  GetClubNetWorthListResult
} from './type'
import { IBoxCheckStatus } from 'api/user/type'
import { getImage } from 'api'

export const getClubName = async (name: string) => {
  return ApiInstance.get<{ count: number }>(`club/checkname`, { name: name })
}

export const getBoxJsonData = async (boxId: string | number) => {
  return ApiInstance.get<IBoxesJsonData>(`club/draft/${boxId}`)
}

export const publishBox = async (boxId: string | number) => {
  return ApiInstance.post<IBoxesJsonData>(`club/publish/${boxId}`, {})
}

export const JoinChatRoom = async (boxId: string | number, userId: string) => {
  return ApiInstance.post(`invite/user/${boxId}`, {
    chatUserId: userId
  })
}

export const getBoxInfo = async (boxId: string | number) => {
  return ApiInstance.get<IBoxesPublishJsonData>(`club/info/${boxId}`)
}

export const updateBoxJsonData = async (boxId: string | number, boxValue: IBoxValue) => {
  const projectName = boxValue.boxBasicInfo.projectName
  const avatar = boxValue.boxBasicInfo.avatar
  const description = boxValue.boxBasicInfo.introduction
  const about = JSON.stringify(boxValue.about)
  const page = JSON.stringify(boxValue.boxBasicInfo)
  const links = JSON.stringify(boxValue.boxBasicInfo.links)
  const plugins = JSON.stringify(boxValue.pluginList)
  const pluginInfo = JSON.stringify(boxValue.pluginData)
  const bgImage = JSON.stringify({
    backgroundImg: boxValue.boxBasicInfo.backgroundImg,
    backgroundMobileImg: boxValue.boxBasicInfo.backgroundMobileImg
  })
  return ApiInstance.post(`club/edit/${boxId}`, {
    projectName,
    avatar,
    description,
    about,
    page,
    links,
    pluginInfo,
    plugins,
    bgImage
  })
}

export const createBox = (params: ICreateBoxParams) => {
  return ApiInstance.post<ICreateBoxResult>('club/create', params)
}
export const boxCheckStatus = () => {
  return ApiInstance.get<IBoxCheckStatus>('club/check')
}
export const claimBox = () => {
  return ApiInstance.post('club/claim', {})
}

export const claimAirdrop = ({ address }: { address?: string }) => {
  return ApiInstance.get('airdrop/claim', { address })
}

export const GetEnableplugins = (boxId: string) => {
  return ApiInstance.get<PluginListResult[]>('club/enableplugins/' + boxId, {})
}

export const GetBoxList = async (params: GetBoxListParams) => {
  const res = await ApiInstance.get<BoxListResult>('club/clublist', params)
  res.data.list = getImage(res.data.list)
  return res
}

export const GetBoxSimpleList = async (params: GetBoxListParams) => {
  const res = await ApiInstance.get<BoxListSimpleResult>('club/clublist', params)
  return res
}

export const GetStablecoinList = (params?: IStablecoinListParams) => {
  return ApiInstance.get<StableListResult>('club/plugin/stablelist', params)
}

export const GetPluginList = (params: IPluginListParams) => {
  return ApiInstance.get<IPluginListResult>('index/pluginlist', params)
}

export const GetBoxTokenList = (params: ITokenListParams) => {
  return ApiInstance.get<ITokenListResult>('tokenlist', params)
}

export const GetClubRanks = (params: ClubRanksListParams) => {
  return ApiInstance.get<ClubRanksResult>('club/userrank/' + params.clubId, params.params)
}

export const GetTokenPrice = () => {
  return ApiInstance.get<TokenPriceInfo[]>('asset/token/price', {})
}

export const GetLeverageTradeHistory = (params: IPluginLeverageHistoryParams) => {
  return ApiInstance.get<LeverageHistoryReturnData>('market/list', params)
}

export const GetStablecoinTroves = (params: IStablecoinTroveParams) => {
  return ApiInstance.get<StablecoinTroveListResult>('trove/list', params)
}

export const GetEnablePluginList = (boxId: string) => {
  return ApiInstance.get<EnablePluginListResult[]>(`club/plugins/${boxId}`, {})
}

export const GetStakePoolList = async (params: GetStakePoolListParams) => {
  const res = await ApiInstance.get<StakePoolListResult>('club/pool/list', params)
  return res
}

export const GetClubNetWorthList = (boxId: string) => {
  return ApiInstance.get<GetClubNetWorthListResult>(`club/networth/${boxId}`, {})
}
