import { usePagination, useRequest } from 'ahooks'
import { ICreateAuthentication, ICreatePoolParams, ProviderDispatchActionType } from './type'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { IAuctionHistoryPagination, IPaginationParams } from 'plugins/auction/api/type'
import { useUserInfo } from 'state/user/hooks'
import { stringifyBanner } from 'plugins/auction/utils'
import { PoolType } from 'api/type'
import { createAuctionPool, getAuctionHistory, getAuctionPoolInfo, importAuctionWhitelist } from 'plugins/auction/api'
import { useCreateParams } from './provider'
import { AuctionType, ParticipantStatus } from 'plugins/auction/plugins/fixed-price/constants/type'
import { Contract } from 'ethers'
import { Log } from '@ethersproject/providers'
import { publishBox } from 'api/boxes'
import { NULL_BYTES } from 'plugins/auction/plugins/fixed-price/constants'
import { formatInput } from 'plugins/auction/plugins/fixed-price/constants/utils'
import { POLLING_INTERVAL } from 'utils'

export function useSetBasicInfo() {
  const { dispatch } = useCreateParams()
  const userInfo = useUserInfo()
  const boxId = useMemo(() => userInfo.box?.boxId || '', [userInfo.box?.boxId])
  return useRequest(
    async (values: ICreatePoolParams) => {
      const params = {
        body: {
          banner: stringifyBanner({
            MobileBannerUrl: values.basic.MobileBannerUrl,
            PCbannerUrl: values.basic.PCbannerUrl
          }),
          description: values.basic.dec,
          name: values.basic.auctionName,
          category: values.poolInfo.auctionType === AuctionType.FIXED_PRICE ? PoolType.FIXED_SWAP : PoolType.Staking,
          attachements: '',
          ...(values.basic.id ? { id: values.basic.id } : {})
        },
        boxId: boxId
      }
      const res = await createAuctionPool(params)
      if (res.code !== 200) {
        return Promise.reject(res.msg)
      }
      const auth: ICreateAuthentication = {
        expiredTime: res.data.expiredTime,
        poolKey: res.data.poolKey,
        signature: `0x${res.data.signature}`
      }
      dispatch?.({
        type: ProviderDispatchActionType.setAuth,
        payload: { auth }
      })
      // need publish box
      const res2 = await publishBox(boxId)
      if (res2.code !== 200) {
        return Promise.reject(res2.msg)
      }
      return auth
    },
    { manual: true, ready: !!boxId }
  )
}

export function useImportWhitelist() {
  const { dispatch } = useCreateParams()
  const { runAsync: getPoolKeyHandle } = useSetBasicInfo()
  return useRequest(
    async (values: ICreatePoolParams) => {
      // If there is a whitelist, create it twice, get poolKey
      const { poolKey } = await getPoolKeyHandle(values)
      let whitelist: string[] = []
      if (values.settings.participantStatus === ParticipantStatus.Whitelist) {
        whitelist = values.settings.whiteListAddress || []
      } else if (values.settings.whitelistWithAmount) {
        whitelist = (formatInput(values.settings.whitelistWithAmount)[3] as string[]) || []
      }

      const params = {
        poolKey,
        body: { whitelist }
      }
      let res: any = null
      try {
        res = await importAuctionWhitelist(params.poolKey, params.body)
        const auth: ICreateAuthentication = {
          expiredTime: res.data.expiredTime,
          poolKey: res.data.poolKey,
          signature: `0x${res.data.signature}`,
          merkleRoot: res.data.merkleRoot,
          whiteListCount: res.data.whiteListCount
        }
        dispatch?.({
          type: ProviderDispatchActionType.setAuth,
          payload: { auth }
        })
        return auth
      } catch (error) {
        return Promise.reject(error)
      }
    },
    { manual: true }
  )
}
export function useAuthorized() {
  const setBasicInfo = useSetBasicInfo()

  const importWhitelist = useImportWhitelist() // have whitelist use import
  return { setBasicInfo, importWhitelist }
}

export function usePoolId() {
  return useCallback((contract: Contract, logs: Log[], eventName: string, name: string): string | undefined => {
    for (const log of logs) {
      if (log.address !== contract.address) {
        continue
      }
      const data = contract.interface.parseLog(log)
      if (eventName !== data.name) {
        continue
      }
      if (data.args?.[name]) {
        return data.args[name].toString()
      }
    }
    return undefined
  }, [])
}

export function useAuctionHistory(poolId: string | undefined, params?: IPaginationParams) {
  const isChange = useRef(false)
  useEffect(() => {
    isChange.current = true
  }, [poolId, params])
  const result = usePagination<IAuctionHistoryPagination, any>(
    async () => {
      const res = await getAuctionHistory(poolId || '', params)
      return { total: res.data.total, list: res.data.data, count: res.data.count }
    },
    {
      ready: !!poolId,
      pollingInterval: POLLING_INTERVAL,
      refreshOnWindowFocus: true,
      refreshDeps: [poolId, params],
      onSuccess() {
        isChange.current = false
      }
    }
  )
  return { ...result, loading: isChange.current && result.loading }
}

// this is poolId not contract id, is back id
export function useAuctionPoolInfo(poolId: string | undefined) {
  const { address } = useUserInfo()
  return useRequest(
    async () => {
      const res = await getAuctionPoolInfo(poolId as string)
      const _isEnWhitelist = !!Object.keys(res.data.whitelist).length
      const isWhiteListPool = res.data.auction.merkleRoot ? res.data.auction.merkleRoot !== NULL_BYTES : undefined
      return {
        ...res.data,
        isEnWhiteList: !!isWhiteListPool ? _isEnWhitelist : true,
        isWhiteListPool: !!isWhiteListPool
      }
    },
    { ready: !!poolId, refreshDeps: [address, poolId] }
  )
}
