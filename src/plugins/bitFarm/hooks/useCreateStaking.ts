import { useCallback } from 'react'
import { useStakingFactoryContract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { Currency, CurrencyAmount } from 'constants/token'
import { useUserHasSubmittedRecords } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'

export function useCreateStaking(boxContractAddr: string | undefined) {
  const { account } = useActiveWeb3React()
  const stakingFactoryContract = useStakingFactoryContract()
  const action = 'createStaking'
  const key = boxContractAddr
  const submitted = useUserHasSubmittedRecords(account, action, key)

  const { runWithModal } = useBoxExecute(
    boxContractAddr,
    {
      toContract: stakingFactoryContract,
      toFunc: 'createStaking',
      toData: []
      // value: amount?.currency.isNative ? amount.raw.toString() : undefined
    },
    {
      key,
      summary: 'Create Staking',
      action
    }
    // true
  )

  const createStaking = useCallback(
    /**
     *
     * @param _title
     * @param _stakeToken
     * @param _rewardTokenAmount
     * @param _startTime
     * @param _duration duration time
     * @returns
     */
    (
      _title: string,
      _stakeToken: Currency,
      _rewardTokenAmount: CurrencyAmount,
      _startTime: string,
      _duration: string
    ) => {
      const args = [
        _title,
        _stakeToken.address,
        _rewardTokenAmount.currency.address,
        _rewardTokenAmount.raw.toString(),
        _startTime,
        _duration
      ]
      console.log('🚀 ~ useCreateStaking ~ stakingFactoryContract:', stakingFactoryContract)
      console.log(
        '🚀 ~ useCreateStaking ~ values:',
        args,
        _rewardTokenAmount.currency.isNative && _rewardTokenAmount.raw.toString()
      )

      return runWithModal(args, _rewardTokenAmount.currency.isNative ? _rewardTokenAmount.raw.toString() : undefined)
    },
    [runWithModal, stakingFactoryContract]
  )

  return {
    submitted,
    createStaking
  }
}
