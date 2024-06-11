import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'
import { AuctionPool, IReleaseType, ParticipantStatus } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useRandomSelectionERC20Contract } from './useContract'
import { makeValuesReleaseData } from 'plugins/auction/plugins/fixed-price/hooks/useCreateFixedSwapPool'
import {
  GetPoolCreationSignatureParams,
  GetWhitelistMerkleTreeRootParams
} from 'plugins/auction/plugins/fixed-price/api/type'
import { PoolType } from 'api/type'
import { getPoolCreationSignature, getWhitelistMerkleTreeRoot } from 'plugins/auction/plugins/fixed-price/api'
import { NULL_BYTES } from 'plugins/auction/plugins/fixed-price/constants'
import { useBoxExecute } from 'hooks/useBoxCallback'

interface Params {
  whitelist: string[]
  swapRatio: string
  startTime: number
  endTime: number
  delayUnlockingTime: number
  poolName: string
  tokenFromAddress: string
  tokenToAddress: string
  tokenFormDecimal: string | number
  tokenToDecimal: string | number
  totalShare: string | number
  ticketPrice: string | number
  maxPlayer: number
  releaseType: IReleaseType
  releaseData: {
    startAt: number | string
    endAtOrRatio: number | string
  }[]
}

export function useCreateRandomSelectionPool(values: AuctionPool, boxAddress: string | undefined) {
  const { account, chainId } = useActiveWeb3React()
  const randomSelectionERC20Contract = useRandomSelectionERC20Contract()
  const { amountTotal0, amountTotal1 } = values

  const executeResult = useBoxExecute(
    boxAddress,
    { toContract: randomSelectionERC20Contract, toData: {}, toFunc: 'createV2' },
    { action: 'createERC20RandomSelectionAuction', summary: 'Create Random Selection auction' }
  )
  const calculateContractCallParams = useCallback(async () => {
    const params: Params = {
      whitelist: values.participantStatus === ParticipantStatus.Whitelist ? values.whitelist : [],
      swapRatio: values.swapRatio,
      startTime: values.startTime?.unix() || 0,
      endTime: values.endTime?.unix() || 0,
      delayUnlockingTime:
        IReleaseType.Linear === values.releaseType || IReleaseType.Fragment === values.releaseType
          ? values.releaseDataArr?.[0].startAt?.unix() || 0
          : IReleaseType.Instant === values.releaseType
            ? 0
            : values.shouldDelayUnlocking || IReleaseType.Cliff === values.releaseType
              ? values.shouldDelayUnlocking
                ? values.delayUnlockingTime?.unix() || 0
                : values.endTime?.unix() || 0
              : values.endTime?.unix() || 0,
      poolName: values.poolName.slice(0, 50),
      tokenFromAddress: amountTotal0?.currency.address || '',
      tokenFormDecimal: amountTotal0?.currency.decimals || '',
      tokenToAddress: amountTotal1?.currency.address || '',
      tokenToDecimal: amountTotal1?.currency.decimals || '',
      totalShare: Number(values.winnerNumber) || 0,
      ticketPrice: values.ticketPrice || 0,
      maxPlayer: Number(values.maxParticipantAllowed) || 0,
      releaseType: values.releaseType === 1000 ? IReleaseType.Cliff : values.releaseType,
      releaseData: makeValuesReleaseData(values as any)
    }

    if (!amountTotal0 || !amountTotal1) {
      return Promise.reject('currencyFrom or currencyTo error')
    }

    // if (!chainId) {
    //   return Promise.reject(new Error('This chain is not supported for the time being'))
    // }
    if (!account) {
      return Promise.reject('no account')
    }
    if (!randomSelectionERC20Contract) {
      return Promise.reject('no contract')
    }

    let merkleroot = ''

    if (params.whitelist.length > 0) {
      const whitelistParams: GetWhitelistMerkleTreeRootParams = {
        addresses: params.whitelist,
        category: PoolType.Lottery,
        chainId: chainId
      }
      const { data } = await getWhitelistMerkleTreeRoot(whitelistParams)
      merkleroot = data.merkleroot
    }

    const signatureParams: GetPoolCreationSignatureParams = {
      amountMin1: amountTotal1.raw.toString(),
      amountTotal0: amountTotal0.raw.toString(),
      category: PoolType.Lottery,
      chainId: chainId,
      claimAt: params.delayUnlockingTime,
      closeAt: params.endTime,
      creator: account,
      maxAmount1PerWallet: amountTotal1.raw.toString(),
      merkleroot: merkleroot,
      maxPlayer: Number(params.maxPlayer),
      name: params.poolName,
      openAt: params.startTime,
      token0: params.tokenFromAddress,
      token1: params.tokenToAddress,
      totalShare: params.totalShare,
      releaseType: params.releaseType,
      releaseData: params.releaseData
    }

    const {
      data: { id, expiredTime, signature }
    } = await getPoolCreationSignature(signatureParams)

    const contractCallParams = {
      name: signatureParams.name,
      token0: signatureParams.token0,
      token1: signatureParams.token1,
      amountTotal0: signatureParams.amountTotal0,
      amount1PerWallet: signatureParams.maxAmount1PerWallet,
      openAt: signatureParams.openAt,
      claimAt: signatureParams.claimAt,
      closeAt: signatureParams.closeAt,
      maxPlayer: Number(params.maxPlayer),
      nShare: signatureParams.totalShare,
      whitelistRoot: merkleroot || NULL_BYTES
    }
    const args = [
      id,
      contractCallParams,
      params.releaseType,
      params.releaseData.map(item => ({ ...item, endAtOrRatio: item.endAtOrRatio.toString() })),
      false,
      expiredTime,
      signature
    ]
    return args
  }, [account, amountTotal0, amountTotal1, chainId, randomSelectionERC20Contract, values])
  return {
    ...executeResult,
    async runWithModal() {
      const args = await calculateContractCallParams()
      return executeResult.runWithModal(args)
    }
  }
}
