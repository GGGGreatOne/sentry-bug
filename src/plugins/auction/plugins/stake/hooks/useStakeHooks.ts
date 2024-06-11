import { useActiveWeb3React } from 'hooks'
import { useStakeTokenWithTimeWeightContract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { CoinResultType } from '../constants/type'
import { CurrencyAmount } from 'constants/token'
import { Dispatch, useMemo } from 'react'
import { ICreateStakePool } from '../pages/create-stake/createType'
import { IReleaseType } from '../../fixed-price/constants/type'
import { Actions, ICreatePoolParams, ProviderDispatchActionType } from 'plugins/auction/pages/erc20-create-pool/type'
import BigNumber from 'bignumber.js'
import auctionDialogControl from 'plugins/auction/components/create-pool/modal'
import { ROUTES } from 'constants/routes'
import { useRouter } from 'next/router'
import { IClubPluginId } from 'state/boxes/type'

export const useStakingCreatorClaim = (
  coinInfo: CoinResultType | undefined,
  poolId: string | undefined,
  boxAddress: string | undefined
) => {
  const { chainId } = useActiveWeb3React()
  const contract = useStakeTokenWithTimeWeightContract(chainId)
  const nowTime = () => new Date().getTime()

  const canClaimToken0Amount = useMemo(() => {
    const total0 = new BigNumber(coinInfo?.amountTotal0?.toString() || '0')
    const swap0Amount = new BigNumber(coinInfo?.currencyAmountSwap0?.raw.toString() || '0')
    if (!coinInfo?.currencyAmountSwap0) {
      return undefined
    }
    if (swap0Amount.isGreaterThanOrEqualTo(total0)) {
      return CurrencyAmount.fromAmount(coinInfo?.currencyAmountSwap0?.currency, '0')
    }
    return CurrencyAmount.fromRawAmount(coinInfo?.currencyAmountSwap0?.currency, total0.minus(swap0Amount).toString())
  }, [coinInfo?.amountTotal0, coinInfo?.currencyAmountSwap0])

  const canClaimToken1Amount = useMemo(() => {
    const total1 = new BigNumber(coinInfo?.currencyAmountTotal1?.toExact() || '0')
    const swap1Amount = new BigNumber(coinInfo?.currencyAmountSwap1?.toExact() || '0')
    const txFee = new BigNumber(coinInfo?.txFee || '0').div(100)
    let txFeeAmount: BigNumber
    if (!coinInfo?.currencyAmountSwap1?.currency) {
      return
    }
    if (swap1Amount.isGreaterThanOrEqualTo(total1)) {
      txFeeAmount = total1.times(txFee)
      return CurrencyAmount.fromAmount(coinInfo?.currencyAmountSwap1?.currency, total1.minus(txFeeAmount).toString())
    } else {
      txFeeAmount = swap1Amount.times(txFee)
      return CurrencyAmount.fromAmount(
        coinInfo?.currencyAmountSwap1?.currency,
        swap1Amount.minus(txFeeAmount).toString()
      )
    }
  }, [coinInfo?.currencyAmountSwap1, coinInfo?.currencyAmountTotal1, coinInfo?.txFee])
  const content = useMemo(() => {
    if (nowTime() < Number(coinInfo?.openAt) * 1000) {
      return `You have successfully cancelled`
    } else {
      return `You have successfully claimed ${
        canClaimToken0Amount?.toSignificant() || '0'
      } ${coinInfo?.currencyAmountTotal0?.currency.symbol?.toUpperCase()} and ${
        canClaimToken1Amount?.toSignificant() || '0'
      } ${coinInfo?.currencyAmountSwap1?.currency.symbol?.toUpperCase()}`
    }
  }, [
    canClaimToken0Amount,
    canClaimToken1Amount,
    coinInfo?.currencyAmountSwap1?.currency.symbol,
    coinInfo?.currencyAmountTotal0?.currency.symbol,
    coinInfo?.openAt
  ])

  return useBoxExecute(
    boxAddress,
    { toContract: contract, toData: [poolId], toFunc: 'creatorClaim' },
    {
      action: 'creatorClaim',
      summary: content,
      successTipsText: content
    }
  )
}
export const useCreateWithTimeWeightStakingPool = (
  props: ICreatePoolParams,
  boxAddress: string | undefined,
  dispatch: Dispatch<Actions> | null
) => {
  const contract = useStakeTokenWithTimeWeightContract()
  const params = props.poolInfo as ICreateStakePool
  const router = useRouter()
  const arg = useMemo(() => {
    const amount0 = params.token0Currency
      ? CurrencyAmount.fromAmount(params.token0Currency, params.amountTotal0)?.raw.toString()
      : '0'
    const amount1 = params.token1Currency
      ? CurrencyAmount.fromAmount(params.token1Currency, params.amountTotal1)?.raw.toString()
      : '0'
    const openAt = params.startTime?.unix() || 0
    const closeAt = params.endTime?.unix() || 0
    const releaseAt =
      Number(params.releaseType) === Number(IReleaseType.Cliff)
        ? params.delayUnlockingTime?.unix() || 0
        : params.endTime?.unix() || 0
    const txFeeRatio = new BigNumber(params.clubShare).div(100).times(new BigNumber(10).pow(18)).toString()
    const arg = [
      props.auth.poolKey,
      [
        params.token0Currency?.address,
        params.token1Currency?.address,
        amount0,
        amount1,
        openAt,
        closeAt,
        releaseAt,
        params.releaseDuration,
        txFeeRatio
      ],
      props.auth.expiredTime,
      props.auth.signature
    ]
    return arg
  }, [params, props.auth.expiredTime, props.auth.poolKey, props.auth.signature])
  return useBoxExecute(
    boxAddress,
    { toContract: contract, toData: arg, toFunc: 'create' },
    {
      action: 'create',
      summary: 'create pool',
      cancelText: 'To Club',
      modalSuccessClose() {
        auctionDialogControl.hide('CreateErc20StakingConfirm')
        dispatch?.({ type: ProviderDispatchActionType.resetVal, payload: null })
      },
      modalSuccessCancel() {
        auctionDialogControl.hide('CreateErc20StakingConfirm')
        router.push(`${ROUTES.club.editClub}?appId=${IClubPluginId.Auction}`)
      }
    }
  )
}
export const useClaimToken0 = (
  poolId: string | undefined,
  boxAddress: string | undefined,
  amount: CurrencyAmount | undefined
) => {
  const { chainId } = useActiveWeb3React()
  const contract = useStakeTokenWithTimeWeightContract(chainId)
  return useBoxExecute(
    boxAddress,
    { toContract: contract, toData: [poolId], toFunc: 'claimToken0' },
    {
      action: 'claim token0',
      summary: `You have successfully claimed ${amount?.toSignificant()} ${amount?.currency?.symbol}`,
      successTipsText: `You have successfully claimed ${amount?.toSignificant()} ${amount?.currency.symbol?.toLocaleUpperCase()}`
    }
  )
}
export const useClaimToken1 = (
  poolId: string | undefined,
  boxAddress: string | undefined,
  amount: CurrencyAmount | undefined
) => {
  const { chainId } = useActiveWeb3React()
  const contract = useStakeTokenWithTimeWeightContract(chainId)
  return useBoxExecute(
    boxAddress,
    { toContract: contract, toData: [poolId], toFunc: 'claimToken1' },
    {
      action: 'claim token0',
      summary: `You have successfully claimed ${amount?.toSignificant()} ${amount?.currency?.symbol}`,
      successTipsText: `You have successfully claimed ${amount?.toSignificant()} ${amount?.currency.symbol?.toLocaleUpperCase()}`
    }
  )
}
export const useStakingBid = (
  boxAddress: string | undefined,
  poolId: string | undefined,
  amount: CurrencyAmount | undefined,
  close: () => void
) => {
  const { chainId } = useActiveWeb3React()
  const contract = useStakeTokenWithTimeWeightContract(chainId)
  const isToken1Native = amount?.currency.isNative
  return useBoxExecute(
    boxAddress,
    {
      toContract: contract,
      toData: [poolId, amount?.raw.toString()],
      toFunc: 'commit',
      value: isToken1Native ? amount?.raw.toString() : undefined
    },
    {
      action: 'stake auction',
      summary: `You have successfully staked ${amount?.toSignificant()} ${amount?.currency?.symbol}`,
      successTipsText: `You have successfully stake ${amount?.toSignificant()} ${amount?.currency.symbol?.toLocaleUpperCase()}`,
      modalSuccessClose() {
        close()
      },
      modalSuccessCancel() {
        close()
      }
    }
  )
}
