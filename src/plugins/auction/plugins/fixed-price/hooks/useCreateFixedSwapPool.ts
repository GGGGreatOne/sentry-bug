import { useActiveWeb3React } from 'hooks'
import { Dispatch, useCallback, useMemo } from 'react'
import { CurrencyAmount } from 'constants/token'
import { BigNumber } from 'bignumber.js'
import { AllocationStatus, IReleaseData, IReleaseType, ParticipantStatus } from '../constants/type'
import { useFixedSwapERC20Contract } from './useContract'
import { PoolType } from 'api/type'
import { formatInput } from '../constants/utils'
import { GetPoolCreationSignatureParams } from '../api/type'
import { NULL_BYTES } from '../constants'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { ICreateFixedPricePool } from '../pages/create-fixed-price/createType'
import { Actions, ICreatePoolParams, ProviderDispatchActionType } from 'plugins/auction/pages/erc20-create-pool/type'
import { usePoolId } from 'plugins/auction/pages/erc20-create-pool/hooks'
import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import auctionDialogControl from 'plugins/auction/components/create-pool/modal'
import { IClubPluginId } from 'state/boxes/type'
export interface Params {
  whitelist: string[]
  poolSize: string
  swapRatio: string
  allocationPerWallet: string
  startTime: number
  endTime: number
  delayUnlockingTime: number
  poolName: string
  tokenFromAddress: string
  tokenToAddress: string
  tokenFormDecimal: string | number
  tokenToDecimal: string | number
  releaseType: IReleaseType
  releaseData: {
    startAt: number | string
    endAtOrRatio: number | string
  }[]
  whitelistWithAmount?: string
}
const NO_LIMIT_ALLOCATION = '0'

export function sortReleaseData(releaseData: IReleaseData[]): IReleaseData[] {
  return releaseData.sort((a, b) => {
    if (a.startAt === null || b.startAt === null) {
      if (a.startAt === null && b.startAt === null) {
        return 0
      } else if (a.startAt === null) {
        return 1
      } else {
        return -1
      }
    }

    return a.startAt.diff(b.startAt)
  })
}

export function makeValuesReleaseData(values: ICreatePoolParams['poolInfo']) {
  if (Number(values.releaseType) === IReleaseType.Instant) {
    return []
  }
  if (Number(values.releaseType) === IReleaseType.Cliff) {
    return [
      {
        startAt: values.delayUnlockingTime?.unix() || 0,
        endAtOrRatio: 0
      }
    ]
  }
  return []
}

export function useCreateFixedSwapPool(
  values: ICreatePoolParams,
  boxContractAddr: string | undefined,
  dispatch: Dispatch<Actions> | null
) {
  const { account, chainId } = useActiveWeb3React()
  const fixedSwapERC20Contract = useFixedSwapERC20Contract()
  const getPoolId = usePoolId()
  const poolInfo = values.poolInfo as ICreateFixedPricePool
  const settings = values.settings
  const basicInfo = values.basic
  const router = useRouter()
  const { poolKey, expiredTime, signature } = useMemo(() => values.auth, [values.auth])
  const { amountTotal0: _amountTotal0, amountTotal1: _amountTotal1, totalSupply, swapRatio } = poolInfo
  const [amountTotal0, amountTotal1] = useMemo((): Array<CurrencyAmount | undefined> => {
    return [
      _amountTotal0 ? CurrencyAmount.fromAmount(_amountTotal0, totalSupply) : undefined,
      _amountTotal1
        ? CurrencyAmount.fromAmount(_amountTotal1, new BigNumber(totalSupply).times(swapRatio).toString())
        : undefined
    ]
  }, [_amountTotal0, _amountTotal1, swapRatio, totalSupply])

  const [whitelistAddress, whitelistAmounts] = useMemo(
    () => (settings.whitelistWithAmount ? formatInput(settings.whitelistWithAmount) : []),
    [settings]
  )
  const isPlayableAuction = useMemo(() => {
    return (
      settings.participantStatus === ParticipantStatus.WhitelistWithAmount &&
      !!(whitelistAddress?.length > 0 && whitelistAmounts?.length > 0)
    )
  }, [settings, whitelistAddress?.length, whitelistAmounts?.length])
  const method = useMemo(() => (isPlayableAuction ? 'createPlayableV2' : 'createV2'), [isPlayableAuction])
  const executeResult = useBoxExecute(
    boxContractAddr,
    {
      toContract: fixedSwapERC20Contract,
      toFunc: method,
      toData: {},
      value: amountTotal0?.currency.isNative ? amountTotal0.raw.toString() : undefined
    },
    {
      summary: 'Create fixedSwap auction',
      action: 'createERC20FixedSwapAuction',
      cancelText: 'To Club',
      modalSuccessClose() {
        auctionDialogControl.hide('Erc20CreatePoolConfirm')
        dispatch?.({ type: ProviderDispatchActionType.resetVal, payload: null })
      },
      modalSuccessCancel() {
        auctionDialogControl.hide('Erc20CreatePoolConfirm')
        router.push(`${ROUTES.club.editClub}?appId=${IClubPluginId.Auction}`)
      }
    }
  )

  const calculateContractCallParams = useCallback(async () => {
    const params: Params = {
      whitelist:
        settings.participantStatus === ParticipantStatus.Whitelist
          ? (settings.whiteListAddress as string[]) || []
          : settings.participantStatus === ParticipantStatus.WhitelistWithAmount
            ? (whitelistAddress as string[])
            : [],
      poolSize: poolInfo.totalSupply,
      swapRatio: poolInfo.swapRatio,
      allocationPerWallet:
        poolInfo.allocationStatus === AllocationStatus.Limited && !isPlayableAuction
          ? new BigNumber(poolInfo.allocationPerWallet).toString()
          : NO_LIMIT_ALLOCATION,
      startTime: poolInfo.startTime?.unix() || 0,
      endTime: poolInfo.endTime?.unix() || 0,
      delayUnlockingTime:
        Number(poolInfo.releaseType) === IReleaseType.Instant ? 0 : poolInfo.delayUnlockingTime?.unix() || 0,
      poolName: basicInfo.auctionName.slice(0, 50),
      tokenFromAddress: amountTotal0?.currency.address || '',
      tokenFormDecimal: amountTotal0?.currency.decimals || '',
      tokenToAddress: amountTotal1?.currency.address || '',
      tokenToDecimal: amountTotal1?.currency.decimals || '',
      // todo: why used 1000 => values.releaseType === 1000 ? IReleaseType.Cliff : values.releaseType,
      releaseType: poolInfo.releaseType,
      releaseData: makeValuesReleaseData(poolInfo),
      whitelistWithAmount: settings.whitelistWithAmount
    }

    if (!amountTotal0 || !amountTotal1) {
      return Promise.reject('currencyFrom or currencyTo error')
    }
    if (!account) {
      return Promise.reject('no account')
    }
    if (!fixedSwapERC20Contract) {
      return Promise.reject('no contract')
    }
    const merkleroot = values.auth.merkleRoot || NULL_BYTES
    const signatureParams: GetPoolCreationSignatureParams = {
      amountTotal0: amountTotal0.raw.toString(),
      amountTotal1: new BigNumber(amountTotal1?.raw.toString() || '0').toFixed(0, BigNumber.ROUND_DOWN),
      category: PoolType.FIXED_SWAP,
      chainId: chainId,
      claimAt: params.delayUnlockingTime,
      closeAt: params.endTime,
      creator: account,
      maxAmount1PerWallet:
        CurrencyAmount.fromAmount(amountTotal1?.currency, params.allocationPerWallet)?.raw.toString() || '0',
      merkleroot: merkleroot,
      name: params.poolName,
      openAt: params.startTime,
      token0: params.tokenFromAddress,
      token1: params.tokenToAddress,
      releaseType: params.releaseType,
      releaseData: params.releaseData
    }

    const contractCallParams = {
      name: signatureParams.name,
      token0: signatureParams.token0,
      token1: signatureParams.token1,
      amountTotal0: signatureParams.amountTotal0,
      amountTotal1: signatureParams.amountTotal1,
      openAt: signatureParams.openAt,
      closeAt: signatureParams.closeAt,
      claimAt: signatureParams.claimAt,
      maxAmount1PerWallet: signatureParams.maxAmount1PerWallet,
      whitelistRoot: merkleroot,
      // (80 / 100 ) * 1e18
      txFeeRatio: new BigNumber(settings.clubShare).div(100).times(new BigNumber(10).pow(18)).toString()
    }

    const args = [
      poolKey,
      contractCallParams,
      Number(params.releaseType),
      params.releaseData.map(item => ({ ...item, endAtOrRatio: item.endAtOrRatio.toString() })),
      false,
      expiredTime,
      signature
    ]
    return args
  }, [
    account,
    amountTotal0,
    amountTotal1,
    basicInfo.auctionName,
    chainId,
    expiredTime,
    fixedSwapERC20Contract,
    isPlayableAuction,
    poolInfo,
    poolKey,
    settings.clubShare,
    settings.participantStatus,
    settings.whiteListAddress,
    settings.whitelistWithAmount,
    signature,
    values.auth.merkleRoot,
    whitelistAddress
  ])
  return {
    ...executeResult,
    runWithModal: async () => {
      const data = await calculateContractCallParams()
      return executeResult.runWithModal(data).then(curReceipt => {
        if (fixedSwapERC20Contract) {
          const poolId = getPoolId(fixedSwapERC20Contract, curReceipt.logs, 'Created', 'index')
          console.log('🚀 ~ returnexecuteResult.runWithModal ~ poolId:', poolId)
        }
      })
    }
  }
}
