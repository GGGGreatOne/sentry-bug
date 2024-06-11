import { ApiInstance } from 'utils/fetch'
import {
  DisperseListParam,
  TokenInfoList,
  LockInfoList,
  GetLocksListParam,
  ExchangeParam,
  ExchangeList,
  GetDisperselistParam,
  GetDisperselistResult,
  TokenUploadimgParam
} from './type'

export const getTokenInfo = (params: DisperseListParam) => {
  return ApiInstance.post<TokenInfoList>('/toolbox/tokens', params)
}

export const getExchangeList = (params: ExchangeParam) => {
  return ApiInstance.post<ExchangeList>('/toolbox/exchange', params)
}

export const getDisperselist = (params: GetDisperselistParam) => {
  return ApiInstance.get<GetDisperselistResult>(`token/disperselist`, params)
}

export const getTokenLockerList = (params: GetLocksListParam) => {
  return ApiInstance.get<LockInfoList>(`token/lockerlist`, params)
}

export const TokenUploadimg = (params: TokenUploadimgParam) => {
  return ApiInstance.post<LockInfoList>(`token/uploadimg/${params.tokenContract}`, {
    imageUrl: params.imageUrl
  })
}
