import {
  UpdataResponse,
  UpdataBodys,
  IGetTokenImgParams,
  IGetTokenImgResult,
  IGetTokenAssetResult,
  IGetTokenListParams,
  ITokenListResult
} from './type'
import { ApiInstance } from 'utils/fetch'
import _ from 'lodash'
export const upload = async (body: UpdataBodys) => {
  const formData = new FormData()
  formData.append('file', body.file)
  return ApiInstance.post<UpdataResponse>('common/upload', formData, {})
}

// abandon api
export const getPluginTokenList = (params?: IGetTokenListParams) => {
  return ApiInstance.get<ITokenListResult>('tokenlist', params)
}

export const getTokenImg = (params: IGetTokenImgParams) => {
  return ApiInstance.get<IGetTokenImgResult>('plugin/tokenimage', params)
}

export const getOnChainAssetsList = () => {
  return ApiInstance.get<IGetTokenAssetResult>('asset/token/source', {})
}

export const getTokenList = ({ boxId, tokenName, verified, pageSize, pageNum }: IGetTokenListParams) => {
  return ApiInstance.get<ITokenListResult>(
    'tokenlist',
    _.omitBy({ boxId, tokenName, verified, pageSize, pageNum }, _.isNil)
  )
}
