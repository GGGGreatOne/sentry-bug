import { FixedSwapPoolProp } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useRandomSelectionERC20Contract } from './useContract'
import { useBoxExecute } from 'hooks/useBoxCallback'
import { useActiveWeb3React } from 'hooks'
import { useCallback } from 'react'

export function useCreatorClaim(
  poolId: number | string,
  name: string,
  boxAddress: string | undefined,
  contract?: string
) {
  const randomSelectionERC20Contract = useRandomSelectionERC20Contract(contract)

  const funcName = 'creatorClaim'
  return useBoxExecute(
    boxAddress,
    { toContract: randomSelectionERC20Contract, toData: [poolId], toFunc: funcName },
    { action: funcName + '_random', key: `${funcName}-${poolId}`, summary: `Creator claim assets for ${name}` }
  )
}

export const useRandomSelectionPlaceBid = (poolInfo: FixedSwapPoolProp & { boxAddress: string | undefined }) => {
  const { boxAddress } = poolInfo
  const { account } = useActiveWeb3React()

  const randomSelectionERC20Contract = useRandomSelectionERC20Contract(poolInfo.contract)

  const { runWithModal, submitted } = useBoxExecute(
    boxAddress,
    {
      toContract: randomSelectionERC20Contract,
      toData: {},
      toFunc: 'bet'
    },
    { action: `random_selection_swap`, summary: 'You have successfully purchased a ticket' }
  )
  const run = useCallback(async () => {
    if (!account) {
      return Promise.reject('no account')
    }
    if (!randomSelectionERC20Contract) {
      return Promise.reject('no contract')
    }
    // TODO:proofArr
    const proofArr: string[] = []

    return [poolInfo.poolId, proofArr]
  }, [account, randomSelectionERC20Contract, poolInfo.poolId])

  return {
    runWithModal: async () => {
      const args = await run()
      return runWithModal(args)
    },
    submitted
  }
}

export const useRegretBid = (poolInfo: FixedSwapPoolProp & { boxAddress: string | undefined }) => {
  const { boxAddress } = poolInfo
  const randomSelectionERC20Contract = useRandomSelectionERC20Contract(poolInfo.contract)
  return useBoxExecute(
    boxAddress,
    { toContract: randomSelectionERC20Contract, toData: [poolInfo.poolId], toFunc: 'reverse' },
    { action: `random_selection_reverse`, summary: `Regret & reverse ${poolInfo.token1.symbol}` }
  )
}
export const useUserClaim = (poolInfo: FixedSwapPoolProp, isWinner: boolean, boxAddress: string) => {
  const { account } = useActiveWeb3React()

  const randomSelectionERC20Contract = useRandomSelectionERC20Contract(poolInfo.contract)
  const func = isWinner ? 'winnerClaim' : 'otherClaim'
  const executeResult = useBoxExecute(
    boxAddress,
    { toContract: randomSelectionERC20Contract, toData: {}, toFunc: func },
    {
      action: `random_selection_user_claim`,
      key: poolInfo.poolId,
      summary: `Claim token ${isWinner ? poolInfo.token0.symbol : poolInfo.token1.symbol}`
    }
  )
  const run = useCallback(async () => {
    if (!account) {
      return Promise.reject('no account')
    }
    if (!randomSelectionERC20Contract) {
      return Promise.reject('no contract')
    }

    if (!poolInfo.totalShare || !poolInfo.curPlayer) {
      return Promise.reject('error')
    }

    let args: any[] = [poolInfo.poolId, []]

    // TODO: userRandomIsWinterProof
    if (isWinner) {
      if (Number(poolInfo.curPlayer) > Number(poolInfo.totalShare)) {
        const userRandomIsWinterProof: any = {}

        // const userRandomIsWinterProof = await getUserRandomIsWinterProof({
        //   address: account,
        //   category: PoolType.Lottery,
        //   chainId: poolInfo.chainId,
        //   poolId: poolInfo.poolId,
        //   tokenType: 1
        // })
        args = [poolInfo.poolId, JSON.parse(userRandomIsWinterProof.data.proof)]
      }
    } else {
      // TODO: userRandomFailedProof
      const userRandomFailedProof: any = {}
      // const userRandomFailedProof = await getUserRandomFailedProof({
      //   address: account,
      //   category: PoolType.Lottery,
      //   chainId: poolInfo.chainId,
      //   poolId: poolInfo.poolId,
      //   tokenType: 1
      // })
      args = [poolInfo.poolId, userRandomFailedProof.data.expiredTime, userRandomFailedProof.data.signature]
    }

    return args
  }, [account, randomSelectionERC20Contract, poolInfo.totalShare, poolInfo.curPlayer, poolInfo.poolId, isWinner])

  return {
    ...executeResult,
    runWithModal: async () => {
      const args = await run()
      return executeResult.runWithModal(args)
    }
  }
}
